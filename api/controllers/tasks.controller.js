const pg = require('pg');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const config = require('./db.js');

var pool = new pg.Pool(config);

module.exports.getAllTasks = function(req,res){

		pool.connect(function(pgerr,client,done){

				if(pgerr){

					res
						.status(500)
						.json("Error getting pg client from pool");

				}else{

					client.query("SELECT * FROM tasks WHERE userid = '" + req.userid.trim() + "'",(err,data) => {	

								done(); //release client back to pool
								if(err){

									res
										.status(400);
										.json(err);									
								}else{
									res
										.status(200)
										.json(data.rows);										
								}
							});
				}
			});
};

module.exports.addTask = function(req,res){

		let taskid = "t_" + shortid.generate();
		pool.connect(function(pgerr,client,done){
			
			if(pgerr){

					res
						.status(500)
						.json("Error getting pg client from pool");
			}else{
			
				client.query("INSERT INTO tasks(taskid,taskdata,userid,timestamp) VALUES( '" + taskid + "','" + req.body.taskData + "','" + req.userid + "','" + req.body.timestamp + "')",(err,result) => {
						
						done();
						if(err){

							res
								.status(400)
								.json(err);
						}else{

							res
								.status(201)
								.json({ taskid : taskid});						
						}
				});
			}
		});	
};


module.exports.deleteTask = function(req,res){

	let taskid = req.params.taskid;

	// var token = req.headers.authorization.split(' ')[1];
	// var decoded = jwt.decode(token,{complete: true});
	// var email = decoded.payload.email;
	// var name = decoded.payload.username;
	// var userid = decoded.payload.userid;

	pool.connect(function(pgerr,client,done){

			if(pgerr){

				console.log("error getting client from pool");
			}else{
				
						client.query("DELETE FROM tasks WHERE userid = '" + req.userid + "' AND taskid = '" + taskid + "'",(err,result) => {
						done();
						if(err){
							console.log("error deleting task");			
							res.statusCode = 400;
							res.setHeader('Content-Type','application/json');
							res.end(JSON.stringify(err));
						}else{							
							res.statusCode = 200;
							res.end();
						}
				});		

			}

		});
};