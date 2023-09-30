window.location.href = 'https://todoist.com/oauth/authorize?client_id=${ff53d20b192141da97a1a8ebe83d23b6}&redirect_uri=${https://petlist.com}&scope=data:read_write';

//get the code from the redirect URL
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if(code){
  fetch("https://todoist.com/oauth/access_token", {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: 'client_id=${ff53d20b192141da97a1a8ebe83d23b6}&client_secret=${1b5bf22c8105473eb167b37ec69dbeb8}&code=${code}',
  }).then((data) => {
    return response.json();
  }).then((data) => {
    const {access_token} = data;
    localStorage.setItem("accessToken",access_token);
  })
};

//function to add a new task
function addTask(content) {
  fetch("https://developer.todoist.com/rest/v2/?shell#get-a-user-39-s-projects", {
    method: "POST",
    headers: {
        "Authorization": 'Bearer${accessToken}',
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
      conent: content
    })
   })
  .then(response => response.json())
  .then(data => {
    if (data.id){
      listTask(); //refresh task list
    } else{
      console.log("Failed To Add Task", data);
    }
  })
  .catch(error =>{
    console.log("An Error Occurred:", error);
  });
}

//function listing existing tasks
const fetchTasks = () => {
  fetch('https://api.todoist.com/rest/v1/tasks',{
    headers:{
      Authorization: 'Bearer${accessToken}',
    },
  }).then((response) => {
    return response.json();
  }).then((data) => {
    console.log("Todoist Tasks:", data);
  })
};

//event listener for "Add Now" button
document.getElementById("addTask").addEventListener("click", function(){
  const newTask = document.getElementById("newTask").value;
  if(newTask) {
    addTask(newTask);
    document.getElementById("newTask").value="";
  }
});

