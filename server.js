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
	var queryParams = req.query; //query is given by ?
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') { //cheaking condition
		filteredTodos = _.where(filteredTodos, { //searching condition
			"completed": true //giving condition
		});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {
			"completed": false
		});
	}
	//filteredtodos is here -> create propety by by ||?q=dog||
	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function(todo) {
			return todo.description.indexOf(queryParams.q) > -1;
		});
	}
	res.json(filteredTodos);
});

app.get('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10); //parseInt-> string to int req.params.id->:id id dalne ke liye
	

	db.todo.findById(todoId).then(function(todo){
		if(!!todo){
			res.json(todo.toJSON());
		}
		else{
			res.status(404).send();
		}
	}, function(e){
		res.status(500).json(e);
	});
});

//post request
app.post('/todos', function(req, res) {

	var body = _.pick(req.body, 'description', 'completed'); //itna he input legga #hacking_trick
	
	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});
});

//delete //todos/:id
app.delete('/todos/:id', function(req, res) { //delete is http method
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});

	if (!matchedTodo) {
		res.status(404).json({
			"error": "no todo  found with that id"
		});
	} else {
		todos = _.without(todos, matchedTodo); //return the copy of array without matchedTodo
		res.json(matchedTodo);
	}
}); //
//PUT
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	})
	if (!matchedTodo) {
		return res.status(404).send();
	}
	var body = _.pick(req.body, 'description', 'completed'); //new data
	var validAttributes = {};

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		res.status(400).send();
	}
	//descripion
	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}
	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('express listening on port ' + PORT + ' !');
	});
});