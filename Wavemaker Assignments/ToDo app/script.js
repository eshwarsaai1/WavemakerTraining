var priorities = ["", "high", "medium", "low"];

var tasksArray = [];

var taskcontainer = document.getElementById("task-container");
var add_btn = document.getElementById("add-btn");
var taskname_input = document.getElementById("task-name");
var deadline_input = document.getElementById("duration");
deadline_input.min = currentTime();
var prior = document.getElementById("priority");
var themechanger = document.getElementById("theme");
var dialog = document.getElementById("dialog");
var searchbar = document.getElementById("search");
var sortbtn = document.getElementById("sortbtn");
var sortby = document.getElementById("sortby");
var subtaskbox = document.getElementById("subtask-dialog");
var subtaskname = document.getElementById("subtask-name");
var subtasktime = document.getElementById("subtask-time");
var subtaskprior = document.getElementById("subtask-priority");
var subtaskadd = document.getElementById("subtask-add");
var exportbtn = document.getElementById("export-btn");
var importfile = document.getElementById("import-file");
var importbtn = document.getElementById("import-btn");
var logoutBtn = document.getElementById("logout-btn");


add_btn.addEventListener('click', () => {
    if (taskname_input.value == "") {
        alert("Enter task name");
    }
    else if (taskExists(taskname_input.value)) {
        alert("task already exists");
    }
    else {
        let time = currentTime();
        let tasktime = deadline_input.value;
        if (tasktime < time) {
            alert("Invalid Date and time");
        }
        else {
            var task = {};
            task.taskName = taskname_input.value;
            task.deadline = formatTime(deadline_input.value);
            task.priorityId = priorities.indexOf(prior.value);
            task.isCompleted = false;
            addTask(task);
        }
    }
}
);

logoutBtn.addEventListener('click', logout);
sortbtn.addEventListener('click', sorttasks);

function currentTime() {
    const time = new Date();
    let cur_time = time.getFullYear();
    cur_time += ("-" + String(time.getMonth() + 1).padStart(2, '0'));
    cur_time += ("-" + String(time.getDate()).padStart(2, '0'));
    cur_time += (" " + String(time.getHours()).padStart(2, '0'));
    cur_time += (":" + String(time.getMinutes()).padStart(2, '0'));
    cur_time += (":" + String(time.getSeconds()).padStart(2, '0'));
    return cur_time;
}

themechanger.addEventListener("click", () => {
    const body = document.querySelector("body");
    if (body.classList.contains("darkmode")) {
        themechanger.innerHTML = "🌙";
    }
    else themechanger.innerHTML = "☀️";
    body.classList.toggle("darkmode");
})

exportbtn.addEventListener("click", exportjson);
importbtn.addEventListener("click", () => {
    importfile.click();
    importfile.addEventListener("change", (e) => importjson(e));
}
);

function sendNotification(body) {
    const options = {
        body: body
    }
    if(Notification.permission != "granted"){
        Notification.requestPermission();
    }
    if(Notification.permission == "granted"){
        new Notification("Task Remainder", options);
    }
}

async function addTask(task) {
    var url = "http://localhost:8080/api/addTask";
    console.log(task);
    try {
        var response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(task),
            credentials: "include"
        });
        if (response.ok) {
            var result = await response.json();
            task.taskId = result.taskId;
            tasksArray.push(task);
            createTask(task);
        } else {
            alert("Server: Bad request");
        }
    } catch (error) {
        console.log(error);
    }
}

function taskExists(currentTaskName) {
    for (let task of tasksArray) {
        if (task.taskName == currentTaskName) {
            return true;
        }
    }
    return false;
}

function formatTime(time) {
    return "" + time.substring(0, 10) + " " + time.substring(11);
}


function createTask(currentTask) {
    let task = document.createElement("div");
    task.draggable = true;
    task.id = currentTask.taskId;
    task.classList.add("task", "col-md-5", "m-2", "px-0", "border", "rounded");
    let maintask = document.createElement("div");
    maintask.classList.add("d-flex", "align-items-center", "m-0", "px-0", "rounded");
    let dragtool = document.createElement("span");
    dragtool.innerHTML = "::";
    dragtool.classList.add("drager", "h-100", "p-3", `prior-${priorities[currentTask.priorityId]}`);
    maintask.appendChild(dragtool);
    let content = document.createElement("div");
    content.classList.add("w-100", "px-1");
    let title = document.createElement("h5");
    title.innerHTML = currentTask.taskName;
    let duration = document.createElement("time");
    duration.innerHTML = currentTask.deadline;
    content.appendChild(title);
    content.appendChild(duration);
    maintask.appendChild(content);
    let addsubtaskbtn = document.createElement("button");
    addsubtaskbtn.classList.add("btn", "px-1", "mx-1", "bg-light", "py-0", "border");
    addsubtaskbtn.innerHTML = "+";
    addsubtaskbtn.addEventListener("click", () => {
        subtaskbox.classList.remove("d-none");
        subtaskadd.addEventListener("click", () => {
            addsubtask(task);
            subtaskadd.removeEventListener("click", () => {
                addsubtask(task);
            });
        });

    })
    maintask.appendChild(addsubtaskbtn);
    let editbtn = document.createElement("button");
    editbtn.classList.add("btn", "px-1", "border", "mx-1", "bg-light", "py-0");
    editbtn.innerHTML = "Edit";
    editbtn.addEventListener("click", () => {
        edittask(task);
    }
    );
    maintask.appendChild(editbtn);
    let deletebtn = document.createElement("button");
    deletebtn.classList.add("btn", "px-1", "border", "mx-1", "bg-light", "py-0");
    deletebtn.innerHTML = "Delete";
    deletebtn.addEventListener("click", () => {
        deletetask(task);
    }
    );
    maintask.appendChild(deletebtn);
    let statusbox = document.createElement("input");
    statusbox.type = "checkbox";
    statusbox.classList.add("mx-1"); 
    statusbox.addEventListener("change", () => {
        markTaskDone(task, true);
    });
    if(currentTask.isCompleted) statusbox.checked = true;
    maintask.appendChild(statusbox);
    task.appendChild(maintask);
    if(currentTask.isCompleted) {
        currentTask.isCompleted = false;
        markTaskDone(task, false);
    }
    taskname_input.value = null;
    deadline_input.value = null;
    prior.value = "high";
    taskcontainer.appendChild(task);
}

function addsubtask(cur_subtask) {
    let subtask = document.createElement("div");
    subtask.classList.add("subtask", "d-flex", "justify-content-end", "m-0");
    subtask.draggable = true;
    let maintask = document.createElement("div");
    maintask.classList.add("col-md-10", "d-flex", "align-items-center", "px-0", "m-2", "border", "rounded");
    let dragtool = document.createElement("span");
    dragtool.innerHTML = "::";
    dragtool.classList.add("drager", "h-100", "p-3", `prior-${subtaskprior.value}`);
    maintask.appendChild(dragtool);
    let content = document.createElement("div");
    content.classList.add("w-100", "px-1");
    let title = document.createElement("h5");
    title.innerHTML = subtaskname.value;
    let duration = document.createElement("time");
    duration.innerHTML = subtasktime.value;
    content.appendChild(title);
    content.appendChild(duration);
    maintask.appendChild(content);
    let editbtn = document.createElement("button");
    editbtn.classList.add("btn", "px-1", "border", "mx-1", "bg-light", "py-0");
    editbtn.innerHTML = "Edit";
    editbtn.addEventListener("click", (e) => {
        editsubtask(e);
    }
    );
    maintask.appendChild(editbtn);
    let deletebtn = document.createElement("button");
    deletebtn.classList.add("btn", "px-1", "border", "mx-1", "bg-light", "py-0");
    deletebtn.innerHTML = "Delete";
    deletebtn.addEventListener("click", (e) => {
        deletesubtask(e);
    }
    );
    maintask.appendChild(deletebtn);
    subtask.appendChild(maintask);
    cur_subtask.appendChild(subtask);
    subtaskbox.classList.add("d-none");
    subtask = null;
    subtaskname.value = null;
    subtasktime.value = null;
    subtaskprior.value = "high";
}

function edittask(cur_task) {
    dialog.classList.remove("d-none");
    let new_name = dialog.querySelector("#edit-name");
    let new_deadline = dialog.querySelector("#edit-time");
    let new_prior = dialog.querySelector("#edit-priority");
    let cur_name = cur_task.firstChild.querySelector("h5");
    let taskId = parseInt(cur_task.id);
    tasksArray.splice(tasksArray.findIndex(task => task.taskId === taskId), 1);
    new_deadline.min = currentTime();
    let cur_time = cur_task.firstChild.querySelector("time");
    let cur_prior = cur_task.firstChild.querySelector("span");
    if (cur_prior.classList.contains("prior-high")) {
        cur_prior.classList.remove("prior-high");
        new_prior.value = "high";
    }
    else if (cur_prior.classList.contains("prior-medium")) {
        cur_prior.classList.remove("prior-medium");
        new_prior.value = "medium";
    }
    else {
        cur_prior.classList.remove("prior-low");
        new_prior.value = "low";
    }
    new_name.value = cur_name.innerHTML;
    new_deadline.value = cur_time.innerHTML;
    dialog.querySelector("button").removeEventListener("click", saveedit);
    dialog.querySelector("button").addEventListener("click", saveedit);

    function saveedit() {
        if (new_name) {
            if (taskExists(new_name.value)) {
                alert(`task name ${new_name.value} is already exists.
                    Try another!!`);
            }
            else {
                let task = {};
                task.taskName = new_name.value;
                task.deadline = formatTime(new_deadline.value);
                task.priorityId = priorities.indexOf(new_prior.value);
                task.isCompleted = false;
                task.taskId = taskId;
                tasksArray.push(task);
                edittaskDB(taskId, task);
                cur_name.innerHTML = task.taskName;
                cur_time.innerHTML = task.deadline
                cur_prior.classList.add(`prior-${priorities[task.priorityId]}`);
                new_name = null;
                new_prior = null;
                new_prior = null;
                dialog.classList.add("d-none");
            }
        }
    }
}

async function edittaskDB(taskId, task) {
    let url = "http://localhost:8080/api/updateTask";
    try {
        var response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(task),
            credentials: "include"
        });
        if (response.ok) {
            console.log("DB Updated");
        } else {
            alert("Server: Bad request");
        }
    } catch (error) {
        console.log(error);
    }
}


function editsubtask(e) {
    cur_task = e.target.parentElement;
    dialog.classList.remove("d-none");
    let new_name = dialog.querySelector("#edit-name");
    let new_deadline = dialog.querySelector("#edit-time");
    let new_prior = dialog.querySelector("#edit-priority");
    let cur_name = cur_task.children[1].querySelector("h5");
    let cur_time = cur_task.children[1].querySelector("time");
    let cur_prior = cur_task.querySelector("span");
    if (cur_prior.classList.contains("prior-high")) {
        cur_prior.classList.remove("prior-high");
        new_prior.value = "high";
    }
    else if (cur_prior.classList.contains("prior-medium")) {
        cur_prior.classList.remove("prior-medium");
        new_prior.value = "medium";
    }
    else {
        cur_prior.classList.remove("prior-low");
        new_prior.value = "low";
    }
    new_name.value = cur_name.innerHTML;
    new_deadline.value = cur_time.innerHTML;
    dialog.querySelector("button").removeEventListener("click", saveedit);
    dialog.querySelector("button").addEventListener("click", saveedit);

    function saveedit() {
        if (new_name) {
            cur_name.innerHTML = new_name.value;
            cur_time.innerHTML = new_deadline.value;
            cur_prior.classList.add(`prior-${new_prior.value}`)
            new_name = null;
            new_prior = null;
            new_prior = null;
            cur_task = null;
            dialog.classList.add("d-none");
        }
    }
}


function deletetask(cur_task) {
    let taskId = parseInt(cur_task.id);
    let index = tasksArray.findIndex(task => task.taskId === taskId);
    tasksArray.splice(index, 1);
    cur_task.remove();
    deleteTaskDB(taskId);
}


async function deleteTaskDB(taskId) {
    let url = "http://localhost:8080/api/deleteTask?taskId=" + taskId;
    try {
        var response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-type': 'application/json' },
            credentials: "include"
        });
        if (response.ok) {
            console.log("Deleted");
        } else {
            alert("Server: Bad request");
        }
    } catch (error) {
        console.log(error);
    }
}


function deletesubtask(e) {
    let cur_subtask = e.target.parentElement;
    cur_subtask.remove();
}


function markTaskDone(task, shouldChangeDB) {
    console.log("marked");
    let taskId = parseInt(task.id);
    var addSubTaskBtn = task.children[0].children[2];
    var editBtn = task.children[0].children[3];
    var statusbox = task.children[0].children[5];
    let index = tasksArray.findIndex(task => task.taskId === taskId);
    console.log(index, tasksArray[index].isCompleted);
    if(tasksArray[index].isCompleted){
        statusbox.classList.remove("bg-success");
        addSubTaskBtn.disabled = false;
        editBtn.disabled = false;
        // deleteBtn.disabled = false;
        tasksArray[index].isCompleted = false;
        
    }
    else{
        statusbox.classList.add("bg-success");
        addSubTaskBtn.disabled = true;
        editBtn.disabled = true;
        // deleteBtn.disabled = true;
        tasksArray[index].isCompleted = true;
    }
    if(shouldChangeDB) toggleCheckTask(taskId, tasksArray[index].isCompleted)
}


async function toggleCheckTask(taskId, check) {
    var url;
    if(check){
        url = "http://localhost:8080/api/checkTask?taskId=" + taskId;
    }
    else{
        console.log("Uncheck");        
        url = "http://localhost:8080/api/uncheckTask?taskId=" + taskId;
    }
    try {
        var response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            credentials: "include"
        });
        if (response.ok) {
            console.log("DB Updated");
        } else {
            alert("Server: Bad request");
        }
    } catch (error) {
        console.log(error);
    }
    
}

async function getTasks() {
    var url = "http://localhost:8080/api/getTasks";
    try {
        var response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
            credentials: "include"
        });
        if (response.ok) {
            console.log(response);
            var result = await response.json();
            console.log(response);
            console.log(result);
            if(result.status == "Unauthorized"){
                window.location.href = 'index.html';
            }
            else{
                for (task of result.list) {
                    tasksArray.push(task);
                    createTask(task);
                }
                console.log(tasksArray);
                sorttasks();
            }
        } else {
            alert("Server: Bad request");
        }
    } catch (error) {
        console.log(error);
    }
}

getTasks();

setInterval(checkDeadlines, 1000*60*10);


function checkDeadlines(){
    for(task of tasksArray){
        var currentDate = new Date(currentTime());
        var currentTaskDate = new Date(task.deadline);
        if ((currentTaskDate - currentDate) < (0)){
            sendNotification(`Task ${task.taskName} deadline is over`);
        }
        else if((currentTaskDate - currentDate) < (60 * 60 * 1000)) {
            sendNotification(`Task ${task.taskName} deadline is due 60 minutes`);
        }
    }
}

function sorttasks() {
    let tasks_Array = Array.from(taskcontainer.children);
    let sortByValue = sortby.value;
    if (sortByValue === "Sort by priority") {
        tasks_Array.sort((a, b) => {
            let priorityA = a.children[0].children[0].classList[3].split("-")[1];
            let priorityB = b.children[0].children[0].classList[3].split("-")[1];
            return ["high", "medium", "low"].indexOf(priorityA) - ["high", "medium", "low"].indexOf(priorityB);
        });
    } else if (sortByValue === "Sort by deadline") {
        tasks_Array.sort((a, b) => {
            return (new Date(a.children[0].querySelector("time").innerHTML)) - (new Date(b.children[0].querySelector("time").innerHTML));
        });
    }
    tasks_Array.forEach(task => taskcontainer.appendChild(task));
}

function exportjson() {
    let blob = new Blob([JSON.stringify(tasksArray)], { type: "application/json" });
    exportbtn.download = "tasks.json";
    exportbtn.href = window.URL.createObjectURL(blob);
}

function importjson(e) {
    let file = e.target.files[0];
    if (file) {
        let freader = new FileReader();
        freader.onload = function (event) {
            try {
                var filecontent = JSON.parse(event.target.result);
                for (task of filecontent) {
                    addTask(task);
                }
                getdata();
            }
            catch (error) {
                alert("file format doesent support");
            }
        }
        freader.readAsText(file);
    }
}

searchbar.addEventListener("input", (e) => {
    const searchval = e.target.value;
    taskcontainer.querySelectorAll(".task").forEach((task) => {
        let has = false;
        task.querySelectorAll("h5").forEach((innertask) => {
            if (innertask.innerHTML.includes(searchval)) has = true;
        })
        if (has === true) task.classList.remove("d-none");
        else task.classList.add("d-none");
    });
})

async function logout(){
    var url = "http://localhost:8080/api/logout";
    try {
        var response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
            credentials: "include"
        });
        if (response.ok) {
            console.log(response);
            window.location.href = 'index.html';
        } else {
            alert("Server: Bad request");
        }
    } catch (error) {
        console.log(error);
        // window.location.href = 'dashboard.html';
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    let draggedItem = null;

    taskcontainer.addEventListener('dragstart', (e) => {
        draggedItem = e.target;
        e.target.classList.add('opacity-50');
    });

    taskcontainer.addEventListener('dragend', (e) => {
        e.target.classList.remove('opacity-50');
        draggedItem = null;
    });

    taskcontainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(taskcontainer, e.clientY);
        if (afterElement == null) {
            taskcontainer.appendChild(draggedItem);
        } else {
            taskcontainer.insertBefore(draggedItem, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task:not(.opacity-50)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }    
});