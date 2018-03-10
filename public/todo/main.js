
var tasks = [];

function task(taskid,taskdata,userid,timestamp){
  this.taskid = taskid;
  this.taskdata = taskdata;
  this.userid = userid;
  this.timestamp = timestamp;
}

function createListItem(taskdata,taskid){
  var taskListElement = document.getElementById('todo');
  var newTaskElement = document.createElement('li');
  newTaskElement.id = taskid;
  newTaskElement.innerHTML = taskdata;
  taskListElement.appendChild(newTaskElement);

  var deleteTaskBtn = document.createElement('i');
  deleteTaskBtn.addEventListener('click',function(){
    deleteTask(taskid);
  });

  deleteTaskBtn.className = "delete far fa-trash-alt";
  newTaskElement.appendChild(deleteTaskBtn);
}


function getTasksFromServer(callback){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
   
    if(this.readyState == 4 && this.status == 200){
          tasks = eval(this.responseText);
          callback(tasks);
    }
    
  };

  xhttp.open('GET','/api/todo/tasks',true);
  let token = window.localStorage.getItem('access_token');
  xhttp.setRequestHeader('Authorization', 'Bearer ' + token);
  xhttp.send();
}

document.onload = getTasksFromServer(renderTasks);

function renderTasks(tasks){
  for(let i =0;i<tasks.length;i++){
    createListItem(tasks[i]["taskdata"],tasks[i]["taskid"]);
  }
}



function postTaskToServer(callback){
  let taskData = document.getElementById('input').value; //get first element in nodelist
  document.getElementById('input').value = "";
  let timestamp = Date.now();
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 201){
      taskid = JSON.parse(this.responseText)['taskid'];
      callback(taskData,taskid,timestamp);
    }
  }
   xhttp.open('POST','/api/todo/tasks',true);
   let token = window.localStorage.getItem('access_token');
   xhttp.setRequestHeader('Authorization', 'Bearer ' + token);
   xhttp.setRequestHeader("Content-type","application/json");
   xhttp.send(JSON.stringify({'taskData' : taskData,
                               'timestamp' : timestamp}));
}

function addTask(taskdata,taskid){
  // let timestamp = Date.now();
  // var newTask = new task(taskid,taskdata,userid,timestamp);
  // tasks.push(newTask);
  createListItem(taskdata,taskid);
  
}

var submitBtn = document.getElementById("add");
submitBtn.addEventListener('click',function(){
  postTaskToServer(addTask);
});

document.getElementById('input').addEventListener('keydown',function(e){
  if(e.code == 'Enter'){
    postTaskToServer(addTask);
  }
});

function deleteTask(taskid){  
  var taskToDelete = document.getElementById(taskid);
  var parentUl = document.getElementById("todo");
  parentUl.removeChild(taskToDelete);
  deleteTaskFromServer(taskid);
}

function deleteTaskFromServer(taskid){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      console.log("task : " + taskid + " deleted");
    }
  };

  xhttp.open('DELETE','/api/todo/tasks/' + taskid,true);
  let token = window.localStorage.getItem('access_token');
  xhttp.setRequestHeader('Authorization','Bearer ' + token);
  xhttp.send();
}

