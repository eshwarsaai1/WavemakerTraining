var tasknames=[];

var taskcontainer=document.getElementById("task-container");
var add=document.getElementById("add-btn");
var taskname=document.getElementById("task-name");
var deadline=document.getElementById("duration");
deadline.min=currentTime();
var prior=document.getElementById("priority");
var themechanger=document.getElementById("theme");
var dialog=document.getElementById("dialog");
var searchbar=document.getElementById("search");
var sortbtn=document.getElementById("sortbtn");
var sortby=document.getElementById("sortby");


add.addEventListener('click', () => {
    if(tasknames.includes(taskname.value)){
        alert("task already exists");
    }
    else{
        var time=currentTime();
        var tasktime=deadline.value;
        const currentTaskName=taskname.value;
        if(tasktime>time){
            time=new Date(time);
            tasktime=new Date(tasktime);
            console.log(tasktime , time , tasktime-time);
            if((taskname-time) <= (30*60*1000)){
                sendNotification(currentTaskName);
            }
            else{
                setTimeout(() => {
                    sendNotification(currentTaskName);
                }, tasktime-time-(30*60*1000));
            }
            addtask();
        }
        else{
            alert("Invalid Date and time");
        }
    }
    }
);
sortbtn.addEventListener('click',sorttasks);

function currentTime(){
    const time=new Date();
    var cur_time=time.getFullYear();
    cur_time+=("-"+String(time.getMonth()+1).padStart(2,'0'));
    cur_time+=("-"+String(time.getDate()).padStart(2,'0'));
    cur_time+=("T"+String(time.getHours()).padStart(2,'0'));
    cur_time+=(":"+String(time.getMinutes()).padStart(2,'0'));
    return cur_time;
}


/* <div class="task col-md-5 d-flex align-items-center m-2 px-0 rounded border">
            <span class="drager p-3 bg-danger h-100">::</span>
            <div class="w-100 bg-light">
                <h5>Assignment 1 </h5>
                <time datetime="06-08-2024" class="mx-1 deadline"> Duration : </time>
            </div>
            <button class="btn">Delete</button>
        </div> */

themechanger.addEventListener("click", ()=>{
    const body=document.querySelector("body");
    if(body.classList.contains("darkmode")){
        themechanger.innerHTML="🌙";
    }
    else themechanger.innerHTML="☀️";
    body.classList.toggle("darkmode");
})

function sendNotification(taskname){
    const options={
        body: `Task ${taskname} deadline is due 30 minutes`
    }
    new Notification("Task Remainder", options);
}

function addtask(){
    tasknames.push(taskname.value);
    let task=document.createElement("div");
    task.draggable=true;
    task.classList.add("task" , "col-md-5", "d-flex", "align-items-center", "m-2", "rounded" , "px-0" ,  "border");
    let dragtool=document.createElement("span");
    dragtool.innerHTML="::";
    dragtool.classList.add("drager", "h-100" ,"p-3" ,`prior-${prior.value}`);
    task.appendChild(dragtool);
    let content=document.createElement("div");
    content.classList.add("w-100", "px-1");
    let title=document.createElement("h5");
    title.innerHTML=taskname.value;
    let duration=document.createElement("time");
    duration.innerHTML=deadline.value;
    content.appendChild(title);
    content.appendChild(duration);
    task.appendChild(content);
    // var addsubtaskbtn=document.createElement("button");
    // addsubtaskbtn.classList.add("btn", "p-0", "mx-1");
    // addsubtaskbtn.innerHTML="+";
    // addsubtaskbtn.addEventListener("click", ()=>{})
    // task.appendChild(addsubtaskbtn);
    var editbtn=document.createElement("button");
    editbtn.classList.add("btn", "px-1", "border" , "mx-1", "bg-light", "py-0");
    editbtn.innerHTML="Edit";
    editbtn.addEventListener("click", () => {
        edittask(task);
    }
    );
    task.appendChild(editbtn);
    var deletebtn=document.createElement("button");
    deletebtn.classList.add("btn", "px-1", "border" , "mx-1", "bg-light", "py-0");
    deletebtn.innerHTML="Delete";
    deletebtn.addEventListener("click", () => {
        deletetask(task)}
    );
    task.appendChild(deletebtn);
    taskcontainer.appendChild(task);
    savedata();
    taskname.value=null;
    deadline.value=null;
    prior.value="high";
}

add.addEventListener("click",() => {

})

function edittask(cur_task){
    dialog.classList.remove("d-none");
    var new_name=dialog.querySelector("#edit-name");
    var new_time=dialog.querySelector("#edit-time");
    var new_prior=dialog.querySelector("#edit-priority");
    var cur_name=cur_task.querySelector("h5");
    var cur_time=cur_task.querySelector("time");
    var cur_prior=cur_task.querySelector("span");
    if(cur_prior.classList.contains("prior-high")){
        cur_prior.classList.remove("prior-high");
        new_prior.value="high";
    }
    else if(cur_prior.classList.contains("prior-medium")){
        cur_prior.classList.remove("prior-medium");
        new_prior.value="medium";
    }
    else{
        cur_prior.classList.remove("prior-low");
        new_prior.value="low";
    }
    new_name.value=cur_name.innerHTML;
    new_time.value=cur_time.innerHTML;
    dialog.querySelector("button").addEventListener("click", () => {
        tasknames[tasknames.indexOf(cur_name.innerHTML)]=new_name.value;
        cur_name.innerHTML=new_name.value;
        cur_time.innerHTML=new_time.value;
        cur_prior.classList.add(`prior-${new_prior.value}`)
        savedata();
        new_name=null;
        new_prior=null;
        new_prior=null;
        dialog.classList.add("d-none");
    })
}

function deletetask(cur_task){
    taskcontainer.childNodes.forEach((node) => {
        if(node == cur_task){
            tasknames.splice(tasknames.indexOf(node.childNodes[1].childNodes[0].innerHTML));
            taskcontainer.removeChild(cur_task);
        }
    })
    savedata();
}

function sorttasks(){
    console.log("sorting started");
    let tasksArray = Array.from(taskcontainer.children);
    let sortByValue = sortby.value;

    if (sortByValue === "Sort by priority") {
        console.log("sorting..");
        tasksArray.sort((a, b) => {
            console.log(a.children[0].classList);
            let priorityA = a.children[0].classList[3].split("-")[1];
            let priorityB = b.children[0].classList[3].split("-")[1];
            return ["high", "medium", "low"].indexOf(priorityA) - ["high", "medium", "low"].indexOf(priorityB);
        });
    } else if (sortByValue === "Sort by deadline") {
            console.log("sorting..");
        tasksArray.sort((a, b) => {
            return (new Date(a.querySelector("time").innerHTML)) - (new Date(b.querySelector("time").innerHTML));
        });
    }
    // console.log(tasksArray);

    tasksArray.forEach(task => taskcontainer.appendChild(task));
    console.log("sorted");
    savedata();
}

function savedata(){
    localStorage.setItem("tasks", taskcontainer.innerHTML);
}

function getdata(){
    taskcontainer.innerHTML = localStorage.getItem("tasks");
    var tasks=document.querySelectorAll(".task");
    tasks.forEach((task) => {
        task.lastChild.addEventListener("click", ()=> {
            deletetask(task);
        });
        task.children[2].addEventListener("click", () =>{
            edittask(task);
        });
    })
}

searchbar.addEventListener("input", (e)=>{
    const searchval = e.target.value;
    taskcontainer.querySelectorAll(".task").forEach((task) => {
        if((task.querySelector("h5").innerHTML.includes(searchval))) task.classList.remove("d-none");
        else task.classList.add("d-none");
    });
})

getdata();
sorttasks();

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