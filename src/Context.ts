import { DBSet } from './collection';
import Handler from './Handler';
import * as sql from './sql';
import Connection from './Connection';
import * as bean from './bean';
import { IEntityType } from './types';

import Mysql from './handlers/Mysql';
import OracleHandler from './handlers/Oracle';
import MsSqlServer from './handlers/MsSqlServer';
import PostgreSql from './handlers/PostGreSql';
import SQLite from './handlers/SQLite';
import Cassandra from './handlers/Cassandra'

function getHandler(config: bean.IConnectionConfig): Handler {
	let handler: Handler = null;
	switch (config.handler) {
		case bean.HandlerType.mysql:
			handler = new Mysql(config);
			break;

		case bean.HandlerType.oracle:
			handler = new OracleHandler(config);
			break;

		case bean.HandlerType.postgresql:
			handler = new PostgreSql(config);
			break;

		case bean.HandlerType.mssql:
			handler = new MsSqlServer(config);
			break;

		case bean.HandlerType.sqlite:
			handler = new SQLite(config);
			break;

		case bean.HandlerType.cassandra:
			handler = new Cassandra(config);
			break;

		default:
			throw 'No Handler Found';
	}
	return handler;
}

export default class Context {
	private _handler: Handler;
	private _entityPath: string;
	private connection: Connection = null;
	private logger = null;

	public dbSetMap = new Map<IEntityType<any>, DBSet<any>>();
	public config: bean.IConfig = null;

	constructor(config?: bean.IConfig) {
		this.config = config;

		if (!this.config.dbConfig) {
			throw new Error('Database Config Not Found');
		}

		this.handler = getHandler(this.config.dbConfig);
		if (this.config.entityPath) { this.setEntityPath(this.config.entityPath); }
		if (this.config.logger) { this.logger = this.config.logger; }
	}

	log(...arg) {
		if (this.logger) {
			this.logger.error(arg);
		}
	}

	async init() {
		await this.handler.init();

		await Promise.all(Reflect.ownKeys(this).filter(key => {
			let o: any = Reflect.get(this, key);
			return o instanceof DBSet;
		}, this).map(key => {
			let obj: DBSet<any> = Reflect.get(this, key);
			obj.context = this;
			obj.bind();
			this.dbSetMap.set(obj.getEntityType(), obj);
		}));
	}

	get handler() {
		return this._handler;
	}

	set handler(handler: Handler) {
		this._handler = handler;
		this._handler.context = this;
	}

	getEntityPath() {
		return this._entityPath;
	}

	setEntityPath(entityPath: string) {
		this._entityPath = entityPath;
	}

	async execute(query: string | sql.INode, args?: Array<any>): Promise<bean.ResultSet> {
		return await this.handler.run(query, args, this.connection);
	}

	flush(): void { }

	async initTransaction(): Promise<this> {
		let res = this;
		// Create Clone if connection not present
		if (!this.connection) {
			res = Object.assign({}, this);
			Object.setPrototypeOf(res, Object.getPrototypeOf(this));
			let keys = Reflect.ownKeys(res);
			keys.forEach((key) => {
				let prop = Reflect.get(res, key);
				if (prop instanceof DBSet) {
					prop.context = res;
				}
			});
		}
		res.connection = await res.handler.getConnection();
		await res.connection.initTransaction();
		return res;
	}

	async commit() {
		await this.connection.commit();
		await this.connection.close();
	}

	async rollback() {
		await this.connection.rollback();
		await this.connection.close();
	}

	end() {
		return this.handler.end();
	}

}
