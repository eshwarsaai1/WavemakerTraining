hobbies = ["swim" , "travel" , "music"];
professions=["Employed", "Business", "Farmer"];


var email=document.getElementById("mail");
var fname=document.getElementById("fname");
var lname=document.getElementById("lname");
var pass=document.getElementById("pass");
var confpass=document.getElementById("confpass");
var income=document.getElementById("income");
var age=document.getElementById("age");
var bio=document.getElementById("bio");



async function loadUser(){
    var fetchurl="https://randomuser.me/api";
    try{
        let response=await fetch(fetchurl);
        if(!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }

        const json=await response.json();
        const data=json.results[0];
        email.value=data.email;
        fname.value=data.name.first;
        lname.value=data.name.last;
        pass.value=data.login.password;
        confpass.value=data.login.password;
        document.getElementById(data.gender).checked=true;
        document.getElementById(hobbies[Math.round(Math.random()*2)]).checked=true;
        document.getElementById(hobbies[Math.round(Math.random()*2)]).checked=true;
        document.getElementById("proff").value=professions[Math.round(Math.random()*2)];
        document.getElementById("file").value="";   
        income.value=(Math.random()*85000)+15000;
        age.value=data.dob.age;
        bio.value=`username: ${data.login.username} and uuid: ${data.login.uuid}`;
    }
    catch(error){
        console.error(error.message);
    }
}

window.onload = function() {
    loadUser()
};

document.getElementById("submit").addEventListener('click', postdata);

async function postdata(){
    var accountform=document.getElementById("accountform");
    const formdetails=new FormData(accountform);
    const formdata=Object.fromEntries(formdetails.entries());
    

    var response = await fetch("https://dummyjson.com/users/", {
        method: 'POST',
        headers: { 'Content-type' : 'application/json'},
        body: JSON.stringify(formdata)
    })
    
    if(response.ok) alert("uploaded successfully");
    else alert("Something went wrong");
    accountform.reset();
}