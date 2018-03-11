function register(){

	let name = document.getElementById("name").value;
	let email = document.getElementById("email").value;
	let password = document.getElementById("password").value;
	let repeatPassword = document.getElementById("re_password").value;

	if(password !== repeatPassword){
		alert("Passwords don't match");
		return;
	}	

	let emailRegEx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

	if(!emailRegEx.test(email)){

		alert("enter valid email");
		return;
	} 

	let formData = {
		name : name,
		email : email,
		password : password
	};

	function postFormToServer(){
	
		let xhttp = new XMLHttpRequest();
		xhttp.open('POST','/api/register',true);
		xhttp.setRequestHeader('Content-type','application/json');
		xhttp.send(JSON.stringify(formData));

		xhttp.onreadystatechange = function(){

			if(this.readyState == 4 && this.status == 201){

				window.location = '/';
				return;
			}

		};
	}
	
		postFormToServer();

}