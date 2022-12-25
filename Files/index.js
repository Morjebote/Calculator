const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const operators = ["+", "-", "*", "/"];
let seq = {first:[], second:[]};
let num = {first:0, second:0};
let res = [];
let lastClicked = 0;
let error = false;
let activeArray = "first";

activateAll();

$(".reset").click(function(event){
  if(lastClicked != "c"){
    seq = {first:[], second:[]};
    num = {first:0, second:0};
    res = [];
    activeArray = "first";
    $(".field").text(0);
    markLast();
    if(error == true){
      activateAll();
      error = false;
    }
  }
});

function activateAll(){
  $(".number").click(function(event){
    activate(write);
  });

  $(".zero").click(function(event){
    activate(writeZero);
  });

  $(".point").click(function(event){
    activate(writePoint);
  });

  $(".del").click(function(event){
    activateDel();
  });

  $(".operation").click(function(event){
    activateOperation();
  });

  $(".equal").click(function(event){
    activateEqual();
  });

  $("button").click(function(){
    console.log(seq);
    console.log(num);
    console.log(res);
    console.log(lastClicked);
  });
}

function activate(e){
  if(res.length == 0 || lastClicked == "="){
    res = [];
    e("first");
    activeArray = "first";
  }else{
    e("second");
    activeArray = "second";
  }
  markLast();
}

function activateDel(){
  if(seq[activeArray].length > 1){
    if(activeArray != null){
      seq[activeArray].pop();
      num[activeArray] = seq[activeArray].join('');
      display(activeArray);
    }
  }else{
    seq[activeArray].pop();
    num[activeArray] = 0;
    display(activeArray);
  }
  markLast();
}

function activateOperation(){
  if(seq.first.length != 0 || lastClicked == "="){
    if(operators.some(el => res.includes(el)) == false){
      res.push(num.first, event.currentTarget.id);
    }else if(seq.second.length != 0){
      res.push(num.second);
      num.first = +eval(res.join('')).toFixed(8);
      seq.second = [];
      num.second = 0;
      res = [num.first, event.currentTarget.id];
      checkForError();
      if(error == false){
        display("first");
      }
    }else if(operators.includes(res[1]) == true){
      res.pop();
      res.push(event.currentTarget.id);
    }
  }else if(event.currentTarget.id == "-"){
    seq.first.push("-");
  }
  markLast();
}

function activateEqual(){
  if(operators.includes(lastClicked) == true){
    if((lastClicked == "+" && num.first.toString().includes("-")) || lastClicked == "-"){
      num.first = num.first * (-1);
      seq.first = [];
    }
    display("first");
    num.second = 0;
    res = [num.first, "+"];
  }else{
    if(res.length == 0){
      display("first");
      seq.first = [];
    }else{
      res.push(num.second);
      num.first = +eval(res.join('')).toFixed(8);
      res.splice(0, 1, num.first);
      res.pop();
      seq = {first:[], second:[]};
      checkForError();
      if(error == false){
        display("first");
      }
    }
  }
  markLast();
}

function write(n){
  if(seq[n][0] == 0 && seq[n][1] != "."){
    seq[n].pop();
  }
  if(seq[n].length < 10){
    seq[n].push(event.currentTarget.id);
    num[n] = seq[n].join('');
    display(n);
  }
}

function writeZero(n){
  if(seq[n][0] != 0 || seq[n][1] == "."){
    write(n);
  }
}

function writePoint(n){
  if(seq[n].includes(".") == false){
    seq[n].push(".");
    if(seq[n][0] == "."){
      seq[n].splice(0, 0, 0);
    }
  }
  num[n] = Number(seq[n].join(''));
  display(n);
}

function display(n){
  $(".field").text(num[n]);
}

function markLast(){
  lastClicked = event.currentTarget.id;
}

function checkForError(){
  reduceDecimal();
  if(num.first == Infinity || num.first.toString().length > 10){
    showError();
  }else if(num.first.toString().includes("e") == true){
    num.first = 0;
    res.splice(0, 1, 0);
    display("first");
  }
}

function reduceDecimal(){
  num.first = num.first.toString();
  if(num.first.includes(".") == true && num.first.length > 10){
    num.first = num.first.slice(0, num.first.length - (num.first.length - 10));
    res.splice(0, 1, num.first);
  }
  num.first = Number(num.first);
}

function showError(){
  $(".field").text("E");
  error = true;
  $(".number").off("click");
  $(".zero").off("click");
  $(".point").off("click");
  $(".del").off("click");
  $(".operation").off("click");
  $(".equal").off("click"); 
}
