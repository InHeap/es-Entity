"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmpContext_1 = require("./modal/EmpContext");
var config = {
    driver: null,
    handler: 'postgres',
    hostname: 'localhost',
    username: 'rohan',
    password: '12345',
    database: 'test'
};
var context = new EmpContext_1.default(config);
let q = 4;
async function run() {
    await context.init();
    console.log('[INIT]');
    let trans = await context.initTransaction();
    console.log('[SELECT]');
    let v = await trans.employees.get(1);
    console.log('id: ' + v.id + ', name: ' + v.name + ', desc: ' + v.description);
    v.description.set('test update 2');
    v = await trans.employees.update(v);
    console.log('id: ' + v.id + ', name: ' + v.name + ', desc: ' + v.description);
    console.log('[UPDATE]');
    let a = trans.employees.getEntity();
    a.name.set('name 2');
    a.description.set('desc insert 232432323');
    v = await trans.employees.insert(a);
    console.log('[INSERTION]');
    console.log('id: ' + v.id + ', name: ' + v.name + ', desc: ' + v.description);
    console.log('[DELETION]');
    await trans.employees.delete(v);
    await trans.commit();
    console.log('[SELECT CONDITIONAL]');
    let q = await context.employees.where((a) => {
        return a.name.IsNotNull();
    }).list();
    for (let i = 0; i < q.length; i++) {
        let j = q[i];
        console.log('id: ' + j.id + ', desc: ' + j.description);
    }
    console.log('[TEST COMPLETE]');
    let app = await v.application.unique();
    console.log(app);
    process.exit(0);
}
run();
