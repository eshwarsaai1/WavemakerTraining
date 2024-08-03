let storage=0;
const operators = ['+','-','/','*','%'];
var op_exists=false;

const display=document.getElementById('display');
const btns=document.querySelectorAll('.btn-num-op');
const backspace=document.querySelectorAll('.bs');
const clear=document.querySelector(".clear");
const reci=document.querySelector(".reci");
const sqrt=document.querySelector(".sqrt");
const memoryclear=document.querySelector(".mc");
const memoryretriev=document.querySelector(".mr");
const memorystore=document.querySelector(".ms");
const memoryinc=document.querySelector(".mi");
const memorydec=document.querySelector(".md");
const equal=document.querySelector(".equal");



clear.addEventListener('click', clearScreen);
reci.addEventListener('click', reciprocate);
sqrt.addEventListener('click', squareRoot);
memoryclear.addEventListener('click', memoClear);
memoryretriev.addEventListener('click', memoRetrive);
memorystore.addEventListener('click', memoStore);
memoryinc.addEventListener('click', memoInc);
memorydec.addEventListener('click', memoDec);
equal.addEventListener('click', evaluate);


btns.forEach(btn => {
    btn.addEventListener('click', insert);   
});

backspace.forEach(btn => {
    btn.addEventListener('click', backSpace);   
});

function insert(){
    const cur_val=this.innerHTML;
    if(display.value=='0'){
        display.value=null;
        if(cur_val == '+' || cur_val == '-'){
            display.value+=cur_val;
            return;
        }
    }
    const prev_val=display.value[(display.value).length-1];
    if(operators.includes(cur_val)){
        if(!op_exists){
            op_exists=true;
            display.value+=cur_val;
        }
        else if((operators.includes(prev_val)) && (prev_val!=cur_val) && (cur_val=='+' || cur_val=='-')){
            display.value+=cur_val;
        }
        else alert("Only one operator allowed at a time");
    }
    else display.value+=cur_val;
};

function clearScreen(){
    op_exists=false;
    display.value=0;
}

function backSpace(){
    if(operators.includes(display.value[(display.value).length - 1])) op_exists=false;
    display.value=display.value.slice(0,-1);
    if((display.value).length == 0) display.value=0;
}

function memoStore(){
    if(op_exists) alert("Can't store with operator");
    else{
        storage=Number(display.value);
        display.value=0;
    }
}

function memoRetrive(){
    if(storage == null) alert("No value in Memory");
    else display.value=storage;
}

function memoClear(){
    storage=null;
}

function memoInc(){
    if(op_exists) alert("Can't store with operator");
    else{
        storage+=Number(display.value);
        display.value=0;
    }
}

function memoDec(){
    storage-=Number(display.value);
    display.value=0;
}

function reciprocate(){
    if(display.value == 0) alert("Denominator cannot be zero");
    else display.value=Math.round((1/display.value)*100)/100;
}

function squareRoot(){
    if(display.value<0) alert("Can't Square root negative number")
    else display.value=Math.round(Math.sqrt(display.value)*100)/100;
}

function evaluate(){
    display.value=Math.round(eval(display.value)*100)/100;
    op_exists=false;
}