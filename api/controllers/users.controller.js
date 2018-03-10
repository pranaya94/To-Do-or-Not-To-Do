const pg = require('pg');
const qs = require('querystring');
const bcrypt = require('bcrypt-nodejs');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');

const config = require('./db.js');

var pool = new pg.Pool(config);

module.exports.userLogin = function(req,res){	
					
			pool.connect(function(pgerr,client,done){

					if(pgerr){
						
						res
							.status(500)
							.send("500 : Error fetching pg client from pool");
					}else{

						client.query("SELECT password, name, userid from users where email = '" + req.body.email + "'",(err,result) => {

						done();
						if(err){
														
							res
								.status(500)
								.send("500 : Database error at login");
						}else if(result.rows.length == 0){

							res
								.status(404)
								.send("404 : User not found");
						}else{
					
							if(bcrypt.compareSync(req.body.password,result.rows[0]["password"].trim())){
																	
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
										.json({data : token });

								}else{

									res
										.status(400)
										.send("Wrong password");									
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

					res
						.status(400)
						.json("User already exists");
				}else{

				res
					.status(200)
					.end();				
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
		
				res
					.status(401)
					.send('Unauthorized');
			}else{
				req.userid = decoded.userid;
				next();
			}
		});
	}else{
		res.status(403).json('No token provided');
	}
};