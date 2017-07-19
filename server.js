var express=require('express');
var app=express();
var PORT=process.env.PORT||3000;
var todos=[{
	id: 1,
	description: "meet mom for lunch",
	completed: false
},{
	id: 2,
	description: 'go to market',
	completed: false
},{
	id: 3,
	description: 'fill the bottel',
	completed: false
}];

app.get('/',function(req,res){
	res.send('todo api root');
});

app.get('/todos',function(req,res){
	res.json(todos);
});

app.get('/todos/:id',function(req,res){
	var todoId = req.params.id;
	var matchedTodo;
	res.send('asking for todo with id of'+ req.params.id);

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


app.listen(PORT,function(){
	console.log('express listening on port '+PORT+' !');
});