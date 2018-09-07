import * as sql from './sql';
import Connection from './Connection';
import Context from './Context';
import * as bean from '../bean/index';
export default abstract class Handler {
    context: Context;
    abstract handlerName: string;
    abstract driver: any;
    config: bean.IConnectionConfig;
    getTableInfo(tableName: string): Promise<Array<bean.ColumnInfo>>;
    run(query: string | sql.INode, args?: Array<any>, connetction?: Connection): Promise<bean.ResultSet>;
    convertPlaceHolder(query: string): string;
    insertQuery(collection: string, columns: string, values: string): string;
    selectQuery(collection: string, columns: string): string;
    whereQuery(where: string): string;
    groupQuery(groupBy: string): string;
    orderQuery(orderBy: string): string;
    updateQuery(collection: string, columns: string, wheres: string): string;
    deleteQuery(collection: string, where: string): string;
    getConnection(): Promise<Connection>;
    openConnetion(conn: any): Promise<any>;
    initTransaction(conn: any): Promise<void>;
    commit(conn: any): Promise<void>;
    rollback(conn: any): Promise<void>;
    close(conn: any): Promise<void>;
    eq(val0: string, val1: string): string;
    neq(val0: string, val1: string): string;
    lt(val0: string, val1: string): string;
    gt(val0: string, val1: string): string;
    lteq(val0: string, val1: string): string;
    gteq(val0: string, val1: string): string;
    and(values: string[]): string;
    or(values: string[]): string;
    not(val0: string): string;
    in(val0: string, val1: string): string;
    between(values: string[]): string;
    like(val0: string, val1: string): string;
    isNull(val0: string): string;
    isNotNull(val0: string): string;
    exists(val0: string): string;
    limit(val0: string, val1: string): string;
    plus(val0: string, val1: string): string;
    minus(val0: string, val1: string): string;
    multiply(val0: string, val1: string): string;
    devide(val0: string, val1: string): string;
    asc(val0: string): string;
    desc(val0: string): string;
    sum(val0: string): string;
    min(val0: string): string;
    max(val0: string): string;
    count(val0: string): string;
    average(val0: string): string;
}
