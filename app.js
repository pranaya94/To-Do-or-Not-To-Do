var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

var routes = require('./api/routes');

app.set('port', (process.env.PORT || 3000));

//set static directory before defining routes
app.use(express.static(path.join(__dirname,'public'))); //define static folder
app.use('/public/todo',express.static(path.join(__dirname,'/public/todo')));
app.use('/public/register',express.static(path.join(__dirname,'/public/register')));

//index.html is served on port 3000
app.use('/node_modules',express.static(path.join(__dirname,'/node_modules')));

//enable parsing of posted forms
app.use(bodyParser.urlencoded({extended : false})); //means need only strings and arrays and no warning
app.use(bodyParser.json());

app.use('/api',routes);

var server = app.listen(app.get('port'), function(){
	var port = server.address().port;
	console.log("Listening on port " + port);	
});

