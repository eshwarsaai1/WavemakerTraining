var loginbtn = document.getElementById("login-btn");
var message = document.getElementById("msg");
var username = document.getElementById("username");
var password = document.getElementById("password");

loginbtn.addEventListener("click", login);
async function login(){
    const url = "http://localhost:8080/api/login";
    console.log(username.value, password.value);
    const user = {
        userName: username.value,
        password: password.value
    }
    console.log(user);
    console.log(JSON.stringify(user));
    try{
        var response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-type' : 'application/json'},
            body: JSON.stringify(user),
            credentials: "include"
        });
    }catch(error){
        console.log(error);
    }
    console.log(response);
    var result = await response.json();
    console.log(result);
    if(result.status === "success"){
        message.classList.add("d-none");
        window.location.href = 'dashboard.html';
    } 
    else {
        message.classList.remove("d-none");
    }
}