const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const operators = ["+", "-", "*", "/"];
let lastClicked = 0;
let activeArray = "first";
let error = false;
let seq = { first: [], second: [] };
let num = {
  first: function () { return Number(seq.first.join('')) },
  second: function () { return Number(seq.second.join('')) },
  operator: 0,
  result: function () {
    if (num.operator == "+") {
      return num.first() + num.second();
    } else if (num.operator == "-") {
      return num.first() - num.second();
    } else if (num.operator == "*") {
      return num.first() * num.second();
    } else if (num.operator == "/") {
      return num.first() / num.second();
    }
  }
}

$(".number").click(function (event) {
  if (error != true) { select(writeNumber); }
});

$(".zero").click(function (event) {
  if (error != true) { select(writeZero); }
});

$(".point").click(function (event) {
  if (error != true) { select(writePoint); }
});

$(".operation").click(function (event) {
  if (error != true) {
    if (seq.second.length == 0) {
      num.operator = event.currentTarget.id;
    } else if (lastClicked == "=") {
      seq.second = [];
      num.operator = event.currentTarget.id;
    } else {
      seq.first = [num.result()];
      num.first();
      check();
      seq.second = [];
      num.second();
      num.operator = event.currentTarget.id;
    }
    activeArray = "first";
    markLast();
  }
});

$(".equal").click(function (event) {
  if (error != true) {
    if (operators.includes(lastClicked) == true) {
      if ((lastClicked == "+" && num.first().toString().includes("-")) || lastClicked == "-") {
        num.operator = "*";
        seq.second = [-1];
        seq.first = [num.result()];
        seq.second = [];
        num.second();
        check();
      }
    } else {
      if (seq.second.length == 0) {
        display("first");
      } else {
        seq.first = [num.result()];
        num.first();
        check();
      }
    }
    activeArray = "first";
    markLast();
  }
});

$(".del").click(function (event) {
  if (error != true) {
    if (lastClicked == "=" || operators.includes(lastClicked) == true) {
      seq.second = [];
      num.second();
      num.operator = 0;
    }
    seq[activeArray].pop();
    num[activeArray]();
    display(activeArray);
    if(seq[activeArray][seq[activeArray].length - 1] == "."){
      $(".field").text(num[activeArray]() + ".");
    }
    markLast();
  }
});

$(".reset").click(function (event) {
  seq = { first: [], second: [] };
  num.first();
  num.second();
  num.operator = 0;
  num.result();
  display("first");
  error = false;
  markLast();
});

function select(writeIt) {
  if (num.operator == 0) {
    writeIt("first");
    activeArray = "first";
  } else if (lastClicked == "=") {
    num.operator = 0;
    seq = { first: [], second: [] };
    writeIt("first");
  } else {
    writeIt("second");
    activeArray = "second";
  }
  markLast();
}

function writeNumber(n) {
  if (seq[n].length < 10) {
    if(lastClicked == "="){
      seq[n] = [];
    }
    seq[n].push(event.currentTarget.id);
    num[n]();
    if(seq[n].includes(".") && event.currentTarget.id == "0"){
      $(".field").text(seq[n].join(''));
    }else{
    display(n);
    }
  }
}

function writeZero(n) {
  if (seq[n][0] != 0 || seq[n][1] == ".") {
    writeNumber(n);
  }
}

function writePoint(n) {
  if (seq[n].includes(".") == false) {
    seq[n].push(".");
    if (seq[n][0] == ".") {
      seq[n].splice(0, 0, 0);
    }
  }
  num[n]();
  display(n);
}

function display(n) {
  $(".field").text(num[n]());
}

function markLast() {
  lastClicked = event.currentTarget.id;
}

function check() {
  reduceDecimal();
  if (num.first() == Infinity || num.first().toString().length > 10) {
    if (num.first().toString().includes(".") == false) {
      showError();
    } else if (num.first().toString().includes("e") == true) {
      seq = { first: [], second: [] };
      num.first();
      display("first");
    }
  }
}

function reduceDecimal() {
  if (num.first().toString().includes(".") == true && num.first().toString().length > 10) {
    $(".field").text(num.first().toString().slice(0, num.first().toString().length - (num.first().toString().length - 10)));
  } else {
    display("first");
  }
}

function showError() {
  $(".field").text("ERR");
  error = true;
}
