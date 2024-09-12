var leavesUl = document.getElementById("leaves-list");
var requestsUl = document.getElementById("requests-list");
var employee = {};

var leavesContainer = document.getElementById("leaves-container");
var requestsContainer = document.getElementById("requests-container");
var welcomeContainer = document.getElementById("welcome-container");
var applyLeaveContainer = document.getElementById("applyLeave-container");
var leaveTypeInput = document.getElementById("leaveType");
var fromDateInput = document.getElementById("fromDate");

fromDateInput.min =getCurrentDate();
var toDateInput = document.getElementById("toDate");
var descriptionInput = document.getElementById("description");


var logoutBtn = document.getElementById("logout-btn");
var myLeavesBtn = document.getElementById("leaves-btn");
var myTeamRequestsBtn = document.getElementById("requests-btn");
var applyLeaveBtn = document.getElementById("applyLeave-btn");
var submitLeaveBtn = document.getElementById("submit-leave-btn");


submitLeaveBtn.addEventListener("click", applyLeave);
logoutBtn.addEventListener('click', logout);


myLeavesBtn.addEventListener("click", () => {
    requestsContainer.classList.add("d-none");
    applyLeaveContainer.classList.add("d-none");
    leavesContainer.classList.remove("d-none");
})


myTeamRequestsBtn.addEventListener("click", () => {
    applyLeaveContainer.classList.add("d-none");
    leavesContainer.classList.add("d-none");
    requestsContainer.classList.remove("d-none");
})


applyLeaveBtn.addEventListener("click", () => {
    requestsContainer.classList.add("d-none");
    leavesContainer.classList.add("d-none");
    applyLeaveContainer.classList.remove("d-none");
})


function addLeave(leave, request) {
    var li = document.createElement("li");
    li.id = leave.leaveId;
    li.classList.add("d-flex", "borde", "mx-4", "my-1", "bg-light", "border-1-black");
    var status = document.createElement("b");
    if(leave.status == "Approved"){
        status.classList.add("text-success");
    }
    else if(leave.status == "Rejected"){
        status.classList.add("text-danger");
    }
    else{
        status.classList.add("text-warning");
    }
    status.classList.add("p-2", "col-sm-1", "border", "overflow-auto", "text-center");
    status.innerHTML = leave.status;
    li.appendChild(status);
    var employeeName = document.createElement("span");
    if (request) {
        employeeName.classList.add("p-2", "col-sm-2", "border", "overflow-auto", "text-center");
        employeeName.innerHTML = leave.employeeName;
        li.appendChild(employeeName);
    }
    var LeaveType = document.createElement("span");
    LeaveType.classList.add("p-2", "col-sm-2", "border", "overflow-auto", "text-center");
    LeaveType.innerHTML = leave.leaveType;
    li.appendChild(LeaveType);
    var fromDate = document.createElement("time");
    fromDate.classList.add("p-2", "col-sm-1", "border", "overflow-auto", "text-center");
    fromDate.innerHTML = leave.fromDate;
    li.appendChild(fromDate);
    var toDate = document.createElement("time");
    toDate.classList.add("p-2", "col-sm-1", "border", "overflow-auto", "text-center");
    toDate.innerHTML = leave.toDate;
    li.appendChild(toDate);
    var applyDate = document.createElement("time")
    applyDate.classList.add("p-2", "col-sm-1", "border", "overflow-auto", "text-center");
    applyDate.innerHTML = leave.applyDate;
    li.appendChild(applyDate);
    if (request) {
        var description = document.createElement("span");
        description.classList.add("p-2", "col-sm-2", "overflow-auto", "text-center", "border");
        description.innerHTML = leave.description;
        li.appendChild(description);
        if (leave.status == "PENDING") {
            var div = document.createElement("div");
            div.classList.add("col-sm-2", "d-flex", "align-items-center", "justify-content-around", "text-center");
            var acceptBtn = document.createElement("button");
            acceptBtn.classList.add("btn", "rounded", "bg-success", "text-white", "px-2", "m-1", "py-1", "margin-right");
            acceptBtn.value = "accept"
            acceptBtn.innerHTML = "Accept";
            div.appendChild(acceptBtn);
            var rejectBtn = document.createElement("button");
            rejectBtn.classList.add("btn", "rounded", "bg-danger", "text-white", "px-2", "m-1", "py-1", "margin-right");
            rejectBtn.value = "Reject"
            rejectBtn.innerHTML = "Reject";
            div.appendChild(rejectBtn);
            li.appendChild(div);
        }
        requestsUl.appendChild(li);
    }
    else {
        var description = document.createElement("span");
        description.classList.add("p-2", "col-sm-3", "overflow-auto");
        description.innerHTML = leave.description;
        li.appendChild(description);
        leavesUl.appendChild(li);
    }
}

function getCurrentDate(){
    let date = new Date();
    let todaysDate = date.getFullYear();
    todaysDate += ("-" + String(date.getMonth() + 1).padStart(2, '0'));
    todaysDate += ("-" + String(date.getDate()).padStart(2, '0'));
    return todaysDate;
}

// async function getEmployee() {
//     var url = "http://localhost:8080/api/employee";
//     try {
//         var response = await fetch(url, {
//             method: 'GET',
//             headers: { 'Content-type': 'application/json' },
//             credentials: "include"
//         });
//         if(response.status == 401){
//             window.location.href = "/index.html";
//         }
//         else if (response.ok) {
//             console.log(response);
//             var result = await response.json();
//             console.log(result);
//             console.log(employee);
//             employee = result.employee;
//             console.log(employee);
//             if (employee.role === "Manager") {
//                 myTeamRequestsBtn.classList.remove("d-none");
//                 getRequests();
//             }
//             getLeaves();
//         }else {
//             alert("Server: Bad request");
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }



async function getEmployee() {
    var url = "http://localhost:8080/api/employee";
    var result = await fetch(url, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
            credentials: "include"
        }).then(response => {
            if(response.status == 401){
                window.location.href = "/index.html";
            }
            else if (response.ok) {
                return response.json();
            }else {
                console.error("Error occured: ", response.statusText);
            }
        }).then(result => {
            console.log(result);
            console.log(employee);
            employee = result.employee;
            console.log(employee);
            if (employee.role === "Manager") {
                myTeamRequestsBtn.classList.remove("d-none");
                getRequests();
            }
            getLeaves();
        }).catch(Error => {
            console.error("Error occured: ", Error);
        })
}

getEmployee();

async function applyLeave(leave){
    var leave = {};
    leave.leaveType = leaveTypeInput.value;
    leave.fromDate = fromDateInput.value;
    leave.toDate = toDateInput.value;
    leave.applyDate = getCurrentDate();
    leave.description = descriptionInput.innerHTML;
    var url = "http://localhost:8080/api/myLeaves";
    try {
        var response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(leave),
            credentials: "include"
        });
        if (response.ok) {
            alert("leave applied");
        } else {
            alert("Server: Bad request");
        }
    } catch (error) {
        console.log(error);
    }
}

async function getLeaves() {
    var url = "http://localhost:8080/api/myLeaves";
    try {
        var response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
            credentials: "include"
        });
        if (response.ok) {
            var result = await response.json();
            var leaves = result.list;
            for (var leave of leaves) {
                addLeave(leave, false);
            }
        } else {
            alert("Server: Bad request");
        }
    } catch (error) {
        console.log(error);
    }
}

async function getRequests() {
    var url = "http://localhost:8080/api/teamLeaves";
    try {
        var response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
            credentials: "include"
        });
        if (response.ok) {
            var result = await response.json();
            var leaves = result.list;
            for (var leave of leaves) {
                addLeave(leave, true);
            }
        } else {
            alert("Server: Bad request");
        }
    } catch (error) {
        console.log(error);
    }
}

async function logout() {
    var url = "http://localhost:8080/api/authentication";
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