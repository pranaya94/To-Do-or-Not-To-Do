function login(){
	let email_text = document.getElementById("email").value;
	let password_text = document.getElementById("password").value;

	let formData = {
			email : email_text,
			password : password_text
	};


			function postFormToServer(redirectToTaskPage){

					  console.log("ajax call to post login form");
					  let xhttp = new XMLHttpRequest();
					   xhttp.open('POST','/api/login',true);
					   xhttp.setRequestHeader("Content-type","application/json");
					   xhttp.send(JSON.stringify(formData));

					  xhttp.onreadystatechange = function(){

					    if(this.readyState == 4 && this.status == 201){

					      let token = JSON.parse(this.responseText);						      		      
					      window.localStorage.setItem('access_token',token['data']);
					      redirectToTaskPage();
					    
					    }else if(this.readyState == 4 && this.status == 404){

							alert("user not found");
							return;
						}else if(this.readyState == 4 && this.status == 400){

							alert("wrong password");
							return;
						}

					  };

			}

			function redirectToTaskPage(){	

						console.log("redirecting to task page");
						window.location = './todo/todo.html';	
						return;					
			}
			
			postFormToServer(redirectToTaskPage);

}