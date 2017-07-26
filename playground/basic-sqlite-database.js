var Sequelize = require('Sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': 'basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('Todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250] //cannot be empty
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});
sequelize.sync({
	//force: true
}).then(function() {
	console.log('everything is synced');

	Todo.findById(2).then(function(todo){
		if(todo){
			console.log(todo.toJSON());
		}
		else{
			console.log('not found');
		}
	});


	Todo.create({
		description: 'take out trash',
		completed: 'false'
	}).then(function(todo) {
		return Todo.create({
			description: 'clean office'
		});
	}).then(function() {
		// return Todo.findById(1);
		return Todo.findAll({
			where: {
				description: {
					$like: '%trash%'
				}
			}
		})
	}).then(function(todos) {
		if (todos) {
			todos.forEach(function(todo) {
				console.log(todo.toJSON());
			});
		} else {
			console.log('no todo found!');
		}
	}).catch(function(e) { //headling the crash and loged out the error
		console.log(e);
	});
});