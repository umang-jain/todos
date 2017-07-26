var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/dev-todo-api.sqlite'//data save hoga yha
});
var db={};

db.todo = sequelize.import(__dirname+'/models/todo.js');//let u import data from other file && and all the define is happened in todo
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
