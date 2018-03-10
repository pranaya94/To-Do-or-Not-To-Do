const pg = require('pg');
const qs = require('querystring');
const bcrypt = require('bcrypt-nodejs');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');

const config = require('./db.js');

var pool = new pg.Pool(config);

module.exports.userLogin = function(req,res){	
		
			console.log("requerst aya");			
			pool.connect(function(pgerr,client,done){
					if(pgerr){
						console.log("error fetching client from pool");

					}else{
						client.query("SELECT password, name, userid from users where email = '" + req.body.email + "'",(err,result) => {
						done();
						if(err){
							console.log("Login internal server error");
							console.log(err);
							res
								.status(401)
								.send("Login inernal server error");

						}else if(result.rows.length == 0){

							res
								.status(404)
								.send("user not found");
						}else{
					
							if(bcrypt.compareSync(req.body.password,result.rows[0]["password"].trim()))
								{
									console.log("passwords match");									
									var token = jwt.sign({
														  username: result.rows[0]["name"].trim(),
														  userid : result.rows[0]["userid"].trim(),
														  email : req.body.email
														  }, //payload
														 's3cr3t', //secret
														 {expiresIn: 3600}
														 );	
									console.log(token);				
									res
										.status(201)
										.send(token);

								}
							else{
									res
										.status(400)
										.send("Wrong password");

									console.log("passwords don't match");
							}
						}
				
				});	
			}		
		});
};

module.exports.userRegister = function(req,res){

			let userId = shortid.generate();
		
			pool.connect(function(pgerr,client,done){
				client.query("INSERT into users(name,email,password,userid) values('" + req.body.name + "','" + req.body.email + "','" + bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10)) + "','" + userId + "')" ,(err,data) => {	
				done();
				if(err){
					res.statusCode = 400;
					res.setHeader('Content-Type', 'application/json');
					res.end('{"Error" : "Error inserting values"}');
					console.log("error inserting values : " + err);
				}else{
				res.writeHead(201,{success : true}); //redirect to login
				res.end();				
				}
			});

		});
};


module.exports.authenticate = function(req,res,next){
	var headerExists = req.headers.authorization;
	if(headerExists){
		var token = req.headers.authorization.split(' ')[1];
		console.log(token);
		jwt.verify(token,'s3cr3t',function(error,decoded){
			if(error){
				console.log(error);
				res.status(401).json('Unauthorized');
			}else{
				req.userid = decoded.userid;
				next();
			}
		});
	}else{
		res.status(403).json('No token provided');
	}
};