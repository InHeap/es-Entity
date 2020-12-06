"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LinkSet_1 = require("../collection/LinkSet");
class LinkObjectType {
    constructor(entityType, foreignFunc) {
        this.linkSet = null;
        this._value = null;
        this.linkSet = new LinkSet_1.default(entityType, foreignFunc);
        return new Proxy(this, {
            get(target, prop) {
                if (prop in target) {
                    return target[prop];
                }
                else if (target._value) {
                    return target._value[prop];
                }
            },
            getPrototypeOf() {
                return LinkObjectType.prototype;
            }
        });
    }
    bind(context) {
        this.linkSet.context = context;
        let dbSet = context.dbSetMap.get(this.linkSet.entityType);
        this.linkSet.bind(dbSet);
    }
    async apply(parentObj) {
        this.linkSet.apply(parentObj);
        this._value = await this.linkSet.unique();
    }
}
exports.default = LinkObjectType;
//# sourceMappingURL=LinkObjectType.js.map