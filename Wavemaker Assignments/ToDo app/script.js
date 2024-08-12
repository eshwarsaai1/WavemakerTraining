var tasknames=[""];

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
var subtaskbox=document.getElementById("subtask-dialog");
var subtaskname=document.getElementById("subtask-name");
var subtasktime=document.getElementById("subtask-time");
var subtaskprior=document.getElementById("subtask-priority");
var subtaskadd=document.getElementById("subtask-add");
var exportbtn=document.getElementById("export-btn");
var importfile=document.getElementById("import-file");
var importbtn=document.getElementById("import-btn");


add.addEventListener('click', () => {
    console.log(tasknames);    
    if(tasknames.includes(taskname.value)){
        alert("task already exists");
    }
    else if(taskname.value == ""){
        alert("Enter task name");
    }
    else{
        let time=currentTime();
        let tasktime=deadline.value;
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
    let cur_time=time.getFullYear();
    cur_time+=("-"+String(time.getMonth()+1).padStart(2,'0'));
    cur_time+=("-"+String(time.getDate()).padStart(2,'0'));
    cur_time+=("T"+String(time.getHours()).padStart(2,'0'));
    cur_time+=(":"+String(time.getMinutes()).padStart(2,'0'));
    return cur_time;
}

themechanger.addEventListener("click", ()=>{
    const body=document.querySelector("body");
    if(body.classList.contains("darkmode")){
        themechanger.innerHTML="🌙";
    }
    else themechanger.innerHTML="☀️";
    body.classList.toggle("darkmode");
})

exportbtn.addEventListener("click", exportjson);
importbtn.addEventListener("click", () => {
    importfile.click();
    importfile.addEventListener("change", (e)=> importjson(e));
    }
);

function sendNotification(taskname){
    const options={
        body: `Task ${taskname} deadline is due 30 minutes`
    }
    new Notification("Task Remainder", options);
}


function addtask(){
    console.log(tasknames);
    tasknames.push(taskname.value);
    let task=document.createElement("div");
    task.draggable=true;
    task.classList.add("task", "col-md-5", "m-2", "px-0", "border", "rounded");
    let maintask=document.createElement("div");
    maintask.classList.add("d-flex" , "align-items-center" , "m-0" , "px-0" , "rounded");
    let dragtool=document.createElement("span");
    dragtool.innerHTML="::";
    dragtool.classList.add("drager", "h-100" ,"p-3" ,`prior-${prior.value}`);
    maintask.appendChild(dragtool);
    let content=document.createElement("div");
    content.classList.add("w-100", "px-1");
    let title=document.createElement("h5");
    title.innerHTML=taskname.value;
    let duration=document.createElement("time");
    duration.innerHTML=deadline.value;
    content.appendChild(title);
    content.appendChild(duration);
    maintask.appendChild(content);
    let addsubtaskbtn=document.createElement("button");
    addsubtaskbtn.classList.add("btn", "px-1", "mx-1", "bg-light", "py-0", "border");
    addsubtaskbtn.innerHTML="+";
    addsubtaskbtn.addEventListener("click", ()=>{
        subtaskbox.classList.remove("d-none");
        subtaskadd.addEventListener("click", ()=>{    
            addsubtask(task);
            subtaskadd.removeEventListener("click", () => {
            addsubtask(task);
            });
        });
        
    })
    maintask.appendChild(addsubtaskbtn);
    let editbtn=document.createElement("button");
    editbtn.classList.add("btn", "px-1", "border" , "mx-1", "bg-light", "py-0");
    editbtn.innerHTML="Edit";
    editbtn.addEventListener("click", () => {
        edittask(task);
    }
    );
    maintask.appendChild(editbtn);
    let deletebtn=document.createElement("button");
    deletebtn.classList.add("btn", "px-1", "border" , "mx-1", "bg-light", "py-0");
    deletebtn.innerHTML="Delete";
    deletebtn.addEventListener("click", () => {
        deletetask(task);
    }
    );
    maintask.appendChild(deletebtn);
    task.appendChild(maintask);
    taskcontainer.appendChild(task);
    savedata();
    taskname.value=null;
    deadline.value=null;
    prior.value="high";
}

function addsubtask(cur_subtask){
    tasknames.push(subtaskname.value);
    let subtask=document.createElement("div");
    subtask.classList.add("subtask", "d-flex", "justify-content-end", "m-0");
    subtask.draggable=true;
    let maintask=document.createElement("div");
    maintask.classList.add("col-md-10" , "d-flex" , "align-items-center" , "px-0", "m-2", "border" , "rounded");
    let dragtool=document.createElement("span");
    dragtool.innerHTML="::";
    dragtool.classList.add("drager", "h-100" ,"p-3" ,`prior-${subtaskprior.value}`);
    maintask.appendChild(dragtool);
    let content=document.createElement("div");
    content.classList.add("w-100", "px-1");
    let title=document.createElement("h5");
    title.innerHTML=subtaskname.value;
    let duration=document.createElement("time");
    duration.innerHTML=subtasktime.value;
    content.appendChild(title);
    content.appendChild(duration);
    maintask.appendChild(content);
    let editbtn=document.createElement("button");
    editbtn.classList.add("btn", "px-1", "border" , "mx-1", "bg-light", "py-0");
    editbtn.innerHTML="Edit";
    editbtn.addEventListener("click", (e) => {
        editsubtask(e);
    }
    );
    maintask.appendChild(editbtn);
    let deletebtn=document.createElement("button");
    deletebtn.classList.add("btn", "px-1", "border" , "mx-1", "bg-light", "py-0");
    deletebtn.innerHTML="Delete";
    deletebtn.addEventListener("click", (e) => {
        deletesubtask(e);
    }
    );
    maintask.appendChild(deletebtn);
    subtask.appendChild(maintask);
    cur_subtask.appendChild(subtask);
    savedata();
    subtaskbox.classList.add("d-none");
    subtask=null;
    subtaskname.value=null;
    subtasktime.value=null;
    subtaskprior.value="high";
}

function edittask(cur_task){
    dialog.classList.remove("d-none");
    let new_name=dialog.querySelector("#edit-name");
    let new_time=dialog.querySelector("#edit-time");
    let new_prior=dialog.querySelector("#edit-priority");
    let cur_name=cur_task.firstChild.querySelector("h5");
    console.log(tasknames);
    tasknames.splice(tasknames.indexOf(cur_name.innerHTML),1);
    console.log(tasknames);
    let cur_time=cur_task.firstChild.querySelector("time");
    let cur_prior=cur_task.firstChild.querySelector("span");
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
    dialog.querySelector("button").removeEventListener("click", saveedit);
    dialog.querySelector("button").addEventListener("click", saveedit);

    function saveedit(){
        if(new_name){
            if(tasknames.includes(new_name.value)){
                alert(`task name ${new_name.value} is already exists.
                    Try another!!`);
            }
            else{
                tasknames.push(new_name.value);
                cur_name.innerHTML=new_name.value;
                cur_time.innerHTML=new_time.value;
                cur_prior.classList.add(`prior-${new_prior.value}`)
                savedata();
                new_name=null;
                new_prior=null;
                new_prior=null;
                dialog.classList.add("d-none");
            }
        }
    }
}


function editsubtask(e){
    cur_task=e.target.parentElement;
    console.log(cur_task);
    dialog.classList.remove("d-none");
    let new_name=dialog.querySelector("#edit-name");
    let new_time=dialog.querySelector("#edit-time");
    let new_prior=dialog.querySelector("#edit-priority");
    let cur_name=cur_task.children[1].querySelector("h5");
    console.log(tasknames);
    tasknames.splice(tasknames.indexOf(cur_name.innerHTML),1);
    console.log(tasknames);
    let cur_time=cur_task.children[1].querySelector("time");
    let cur_prior=cur_task.querySelector("span");
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
    dialog.querySelector("button").removeEventListener("click", saveedit);
    dialog.querySelector("button").addEventListener("click", saveedit);

    function saveedit(){
        if(new_name){
            if(tasknames.includes(new_name.value)){
                alert(`task name ${new_name.value} is already exists.
                    Try another!!`);
            }
            else{
                tasknames.push(new_name.value);
                cur_name.innerHTML=new_name.value;
                cur_time.innerHTML=new_time.value;
                cur_prior.classList.add(`prior-${new_prior.value}`)
                savedata();
                new_name=null;
                new_prior=null;
                new_prior=null;
                cur_task=null;
                dialog.classList.add("d-none");
            }
        }
    }
}



function deletetask(cur_task){
    let tasks=taskcontainer.querySelectorAll(".task");
    tasks.forEach((task)=>{
        if(task === cur_task){
            tasknames.splice(tasknames.indexOf(task.children[0].children[1].children[0].innerHTML),1);
            taskcontainer.removeChild(cur_task);
        }
    })
    savedata();
}

function deletesubtask(e){
    console.log(e.target.parentElement);
    let cur_subtask=e.target.parentElement;
    tasknames.splice(tasknames.indexOf(cur_subtask.children[1].children[0].innerHTML),1);
    cur_subtask.remove();
    savedata();
}

function sorttasks(){
    console.log("sorting started");
    let tasksArray = Array.from(taskcontainer.children);
    let sortByValue = sortby.value;

    if (sortByValue === "Sort by priority") {
        console.log("sorting..");
        tasksArray.sort((a, b) => {
            console.log(a.children[0].children[0].classList);
            let priorityA = a.children[0].children[0].classList[3].split("-")[1];
            let priorityB = b.children[0].children[0].classList[3].split("-")[1];
            return ["high", "medium", "low"].indexOf(priorityA) - ["high", "medium", "low"].indexOf(priorityB);
        });
    } else if (sortByValue === "Sort by deadline") {
        tasksArray.sort((a, b) => {
            console.log(new Date(a.children[0].querySelector("time").innerHTML));
            return (new Date(a.children[0].querySelector("time").innerHTML)) - (new Date(b.children[0].querySelector("time").innerHTML));
        });
    }

    tasksArray.forEach(task => taskcontainer.appendChild(task));
    console.log("sorted");
}

function savedata(){
    localStorage.setItem("tasks", taskcontainer.innerHTML);
    localStorage.setItem("tasknames",JSON.stringify(tasknames));
}

function getdata(){
    taskcontainer.innerHTML = localStorage.getItem("tasks");
    // console.log(typeof(JSON.parse(localStorage.getItem("tasknames"))));
    if(localStorage.getItem("tasknames")){
        tasknames=JSON.parse(localStorage.getItem("tasknames"));
    }
    console.log(tasknames);
    let tasks=document.querySelectorAll(".task");
    tasks.forEach((task) => {
        task.firstChild.lastChild.addEventListener("click", ()=> {
            deletetask(task);
        });
        task.firstChild.children[3].addEventListener("click", () =>{
            edittask(task);
        });
        task.firstChild.children[2].addEventListener("click", () =>{
            subtaskbox.classList.remove("d-none");
            subtaskadd.addEventListener("click", ()=>{    
                addsubtask(task);
            });
            subtaskadd.removeEventListener("click", () => {
                addsubtask(task);
            });
        });
        console.log(task);
        task.querySelectorAll(".subtask").forEach((subtask)=>{
            if(subtask.firstChild){
                console.log(subtask.firstChild.children[2]);
                subtask.firstChild.children[2].addEventListener("click", (e) => {
                    editsubtask(e);
                });
                subtask.firstChild.children[3].addEventListener("click", (e) => {
                    deletesubtask(e);
                });
            }
        })
    })
}

function exportjson(){
    let tasks_content=localStorage.getItem("tasks");
    let tasknamesarray=localStorage.getItem("tasknames");
    let data={
        "tasks_content" : tasks_content,
        "tasknamesarray" : tasknamesarray,
    }

    let blob=new Blob([JSON.stringify(data)], {type: "application/json"});
    exportbtn.download="tasks.json";
    exportbtn.href= window.URL.createObjectURL(blob);
    // exportbtn.click();
}

function importjson(e){
    let file=e.target.files[0];
    if(file){
        let freader=new FileReader();
        freader.onload = function(event){
            try{
            var filecontent= JSON.parse(event.target.result);
            localStorage.setItem("tasks", filecontent.tasks_content);
            console.log(filecontent.tasks_content ,  filecontent.tasknamesarray);
            localStorage.setItem("tasknames", filecontent.tasknamesarray);
            getdata();
            }
            catch(error){
                // alert("file format doesent support");
                console.log("format incorrect");
            }
        }
        freader.readAsText(file);
    }
}

searchbar.addEventListener("input", (e)=>{
    const searchval = e.target.value;
    taskcontainer.querySelectorAll(".task").forEach((task) => {
        let has=false;
        task.querySelectorAll("h5").forEach((innertask)=> {
            if(innertask.innerHTML.includes(searchval)) has=true;
        })
        if(has === true) task.classList.remove("d-none");
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

    // taskcontainer.querySelectorAll(".task").forEach((task) => {
    //     task.addEventListener('dragstart', (e) => {
    //         draggedItem = e.target;
    //         e.target.classList.add('opacity-50');
    //     });
    
    //     task.addEventListener('dragend', (e) => {
    //         e.target.classList.remove('opacity-50');
    //         e.target.classList.remove("col-md-10");
    //         e.target.classList.add("col-md-5");
    //         draggedItem = null;
    //     });
    
    //     task.addEventListener('dragover', (e) => {
    //         e.preventDefault();
    //         const aftersubElement = getDragAfterSubElement(task, e.clientY);
    //         if (aftersubElement == null) {
    //             task.appendChild(draggedItem);
    //         } else {
    //             task.insertBefore(draggedItem, aftersubElement);
    //         }
    //     });
    
    //     function getDragAfterSubElement(container, y) {
    //         const draggableElements = [...container.querySelectorAll('.subtask:not(.opacity-50)')];
    
    //         return draggableElements.reduce((closest, child) => {
    //             const box = child.getBoundingClientRect();
    //             const offset = y - box.top - box.height / 2;
    //             if (offset < 0 && offset > closest.offset) {
    //                 return { offset: offset, element: child };
    //             } else {
    //                 return closest;
    //             }
    //         }, { offset: Number.NEGATIVE_INFINITY }).element;
    //     }
    // })
});