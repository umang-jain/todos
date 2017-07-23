var express=require('express');
var app=express();
var PORT=process.env.PORT||3000;
var todos=[];
var todoNextId = 1;
var bodyParser= require('body-parser');
var _ = require('underscore');

app.use(bodyParser.json());

app.get('/',function(req,res){
	res.send('todo api root');
});

app.get('/todos',function(req,res){
	res.json(todos);
});

app.get('/todos/:id',function(req,res){
	var todoId = parseInt(req.params.id,10);//parseInt-> string to int req.params.id->:id id dalne ke liye
	var matchedTodo=_.findWhere(todos,{id: todoId});//findwhere-> todos 
	
	if(matchedTodo){
		res.json(matchedTodo);
	}
	else{
		res.status(404).send();
	}
});

//post request
app.post('/todos',function(req,res){

	var body=_.pick(req.body,'description','completed');
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length===0){
		return res.status(400).send();
	}
	body.description=body.description.trim();
	body.id=todoNextId++;
	todos.push(body);
	res.json(body);
});
//delete //todos/:id
app.delete('/todos/:id',function(req,res){//delete is http method
	var todoId = parseInt(req.params.id,10);
	var matchedTodo = _.findWhere(todos,{id: todoId});

	if(!matchedTodo){
		res.status(404).json({"error": "no todo  found with that id"});
	} else {
		todos = _.without(todos,matchedTodo);//return the copy of array without matchedTodo
		res.json(matchedTodo);
	}
});//
//PUT
app.put('/todos/:id',function(req,res){
	 var todoId=parseInt(req.params.id,10);
	 var matchedTodo=_.findWhere(todos,{id: todoId})
	 if(!matchedTodo){
	 	return res.status(404).send();
	 }
	 var body=_.pick(req.body,'description','completed');//new data
	 var validAttributes={};

	 if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
	 	validAttributes.completed=body.completed;
	 }else if(body.hasOwnProperty('completed')){
	 	res.status(400).send();
	 }
	  //descripion
	 if(body.hasOwnProperty('description') && _.isString(body.description) &&body.description.trim().length>0){
	 	validAttributes.description=body.description;
	 }	else if(body.hasOwnProperty('description')){
	 	res.status(400).send();
	 }
	_.extend(matchedTodo,validAttributes);
	res.json(matchedTodo);
});
app.listen(PORT,function(){
	console.log('express listening on port '+PORT+' !');
});