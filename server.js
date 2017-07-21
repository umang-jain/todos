var express=require('express');
var app=express();
var PORT=process.env.PORT||3000;
var todos=[];
var todoNextId = 1;
var bodyParser= require('body-parser');

app.use(bodyParser.json());

app.get('/',function(req,res){
	res.send('todo api root');
});

app.get('/todos',function(req,res){
	res.json(todos);
});

app.get('/todos/:id',function(req,res){
	var todoId = parseInt(req.params.id,10);
	var matchedTodo;

	todos.forEach(function(todo){
		if(todoId===todo.id)
			matchedTodo=todo;
	});
	
	if(matchedTodo){
		res.json(matchedTodo);
	}
	else{
		res.status(404).send();
	}
});
//post request

app.post('/todos',function(req,res){
	var body=req.body;
	body.id=todoNextId++;
	todos.push(body);
	res.json(body);
});

app.listen(PORT,function(){
	console.log('express listening on port '+PORT+' !');
});