import * as sql from '../sql/Expression';

class NumberType extends sql.Field<number> {

	constructor(data?: number) {
		super();
		this._value = data;

		return new Proxy(this, {
			get(target, prop) {
				if (prop in target) {
					return target[prop];
				} else if (prop in <Number>target._value) {
					return target._value[prop];
				}
			},
			getPrototypeOf() {
				return Number.prototype;
			}
		});

	}

	set(value: number | Number) {
		if (value == null || value == undefined) {
			super.set(null);
		} else if (typeof value == 'number' || value instanceof Number) {
			super.set(<number>value);
		}
	}

}

export default NumberType;
