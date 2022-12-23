const operation = ["+", "-", "*", "/"]
let seq = {first:[], second:[]};
let num = {first:0, second:0};
let res = [];
var n = 0;

$(".number").click(function(event){
  if(res.length == 0){
    write("first");
  }else{
    if(n == 1){
      seq.second.pop();
      write("second");
      n = 0;
    }else{
      write("second");
    }
  }
});

$(".point").click(function(event){
  if(res.length == 0){
    writePoint("first");
  }else{
    writePoint("second");
  }
});

$(".operation").click(function(event){
  if(seq.first.length != 0){
    if((operation.some(el => res.includes(el))) == false){
      res.push(num.first, event.currentTarget.id);
    }else if(seq.second.length !=0 && n == 0){
      res.push(num.second)
      num.first = +eval(res.join('')).toFixed(8);
      seq.second = [];
      num.second = 0;
      res = [num.first, event.currentTarget.id];
      display("first");
    }else if(operation.includes(res[res.length - 1]) == true){
      res.pop();
      res.push(event.currentTarget.id);
    }
  }
  checkForError();
});

$(".equal").click(function(){
  n = 1;
  res.push(num.second);
  num.first = +eval(res.join('')).toFixed(8);
  res.splice(0, 1, num.first);
  res.pop();
  display("first");
  checkForError();
});

$(".reset").click(function(){
  location.reload();
});

function write(n){
  if(seq[n].length < 10){
    seq[n].push(event.currentTarget.id);
    checkFirst(n);
    display(n);
  }
}

function writePoint(n){
  if(seq[n].includes(".") == false){
    seq[n].push(".");
    if(seq[n][0] == "."){
      seq[n].splice(0, 0, 0);
    }
  }
}

function checkFirst(n){
  if(seq[n][0] == 0 && seq[n][1] != ","){
    seq[n].pop();
  }else{
    num[n] = seq[n].join('');
  }
}

function display(n){
  $(".field").text(num[n]);
}

function checkForError(){
  if(num.first == Infinity){
    error();
  }
  if(num.first.toString().length > 10){
    error();
  }
  if(num.first.toString().includes("e") == true){
    num.first = 0;
    $(".field").text("0");
  }
}

function error(){
  $(".field").text("E");
  $("button").off();
  $(".reset").click(function(){
    location.reload();
  });
}