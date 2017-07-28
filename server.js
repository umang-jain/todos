var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('todo api root'); //simple sending
});

app.get('/todos', function(req, res) {
	var query = req.query; //query is given by ?
	// var filteredTodos = todos;

	// if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') { //cheaking condition
	// 	filteredTodos = _.where(filteredTodos, { //searching condition
	// 		"completed": true //giving condition
	// 	});
	// } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
	// 	filteredTodos = _.where(filteredTodos, {
	// 		"completed": false
	// 	});
	// }
	// //filteredtodos is here -> create propety by by ||?q=dog||
	// if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
	// 	filteredTodos = _.filter(filteredTodos, function(todo) {
	// 		return todo.description.indexOf(queryParams.q) > -1;
	// 	});
	// }
	// res.json(filteredTodos);

	var where = {};
	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}
	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);
	}, function(e) {
		res.status(500).send();
	});

});

app.get('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10); //parseInt-> string to int req.params.id->:id id dalne ke liye
	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// }); //findwhere-> todos 

	// if (matchedTodo) {
	// 	res.json(matchedTodo);
	// } else {
	// 	res.status(404).send();
	// }

	db.todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).json(e);
	});
});

//post request
app.post('/todos', function(req, res) {

	var body = _.pick(req.body, 'description', 'completed'); //itna he input legga #hacking_trick

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON()); //output
	}, function(e) {
		res.status(400).json(e);
	});
});

//delete //todos/:id
app.delete('/todos/:id', function(req, res) { //delete is http method
	var todoId = parseInt(req.params.id, 10);
	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// });

	// if (!matchedTodo) {
	// 	res.status(404).json({
	// 		"error": "no todo  found with that id"
	// 	});
	// } else {
	// 	todos = _.without(todos, matchedTodo); //return the copy of array without matchedTodo
	// 	res.json(matchedTodo);
	// }
	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'no todo with id'
			});
		} else {
			res.status(204).send();
		}
	},	function() {
			res.status(500).send();
	});
});

//PUT
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// })
	// if (!matchedTodo) {
	// 	return res.status(404).send();
	// }
	var body = _.pick(req.body, 'description', 'completed'); //new data
	var Attributes = {};

	if (body.hasOwnProperty('completed')) {
		Attributes.completed = body.completed;
	}
	//descripion
	if (body.hasOwnProperty('description')) {
		Attributes.description = body.description;
	}
	db.todo.findById(todoId).then(function(todo){
		if(todo){
				return todo.update(Attributes);
		}else{
			res.status(404).send(); 
		}
	},function(){
		res.status(500).send();
	}).then(function(todo){
			res.json(todo.toJSON());
	},function(e){
		res.status(400).json(e);
	});
});
//new post request
app.post('/users',function(req,res){
	var body = _.pick(req.body, 'email', 'password');
	db.user.create(body).then(function(user){
		res.json(user.toPublicJSON());
	},function(e){
		res.status(400).json(e);
	});
});	

db.sequelize.sync().then(function() {//force to resattle the database
	app.listen(PORT, function() {
		console.log('express listening on port ' + PORT + ' !');
	});
});