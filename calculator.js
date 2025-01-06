// initalise all variables and updatable components

const screen = document.querySelector("#calculator-screen");
screen.textContent = "0"

const numberBtns = document.querySelectorAll("#calculator-numpad > .button")
const operatorBtns = document.querySelectorAll("#operators > .button")

const deleteBtn = document.querySelector("#delete-btn");
const clearBtn = document.querySelector("#clear-btn");
const equalsBtn = document.querySelector("#equals-btn");

let state = {a: "", b: "", operatorBtnId: "", process: "entering a"}

// setup helper functions

const add = () => {
    let result = parseFloat(state.a) + parseFloat(state.b);
    return formatNumber(result);
}

const subtract = () => {
    let result = parseFloat(state.a) - parseFloat(state.b);
    return formatNumber(result);
}

const multiply = () => {
    let result = parseFloat(state.a) * parseFloat(state.b);
    return formatNumber(result);
}

const divide = () => { 
    if (parseFloat(state.b) === 0) {
        return NaN;
    }
    return formatNumber((parseFloat(state.a) / parseFloat(state.b)));
}

const operate = () => {
    switch(state.operatorBtnId) {
        case "add-btn":
        case "+":
        case "a":         
            return add();
        break;
        case "-":
        case "s":
        case "sub-btn": 
            return subtract();
        break;
        case "*":
        case "m":
        case "mult-btn": 
            return multiply();
        break;
        case "/":
        case "d":
        case "div-btn":
            return divide();
        break;
        default:
            return NaN;
    }
}

// takes number, returns it as a string and ensures the string will fit within the display 
const formatNumber = (num) => {
    numString = num.toString();
    num = num.toPrecision(10);
    numString = num.toString();
    if (numString.includes(".")) {
        numString = numString.replace(/\.?0+$/, '');
    };
    return numString;
};

// with helper functions defined, heres the main logic

// logic for the operator (+-*/) actions
const operatorButtonPress = (buttonId) => {
    // if this is the first operator entered, update state to entering second number and set operator to run next   
    if (state.process === "entering a" && state.a !== "" && state.operatorBtnId === "") {
        state.operatorBtnId = buttonId;
        state.process = "entering b";
    } 
    // if a previous operator is waiting to execute (implying two values are ready), execute it with current values
    else if (state.process === "entering b" && state.b !== "" && state.operatorBtnId) {
        let result = operate();
        // update if NaN error doesn't exist
        console.log(result);
        if(result) {
            screen.textContent = result;
            // update operator to one pressed, so that it will run next
            state = {a: result, b: "", operatorBtnId: buttonId, process: "entering b"}
        // if NaN (or any falsy error) reset calculator
        } else {
            screen.textContent = "no, try again."
            state = {a: "", b: "", operatorBtnId: "", process: "entering a"}
        }
    }
    // if an equals was just pressed, and its waiting for an operator to be acted upon the result, set the operator
    else if (state.process === "waiting for operator") {
        state.process = "entering b";
        state.operatorBtnId = buttonId;
    }
}

// logic for the numpad actions
const numberButtonPress = (digit) => {
    // handle decimal points
    if (digit === ".") {
        let target;
        if (state.process === "entering a") { 
            target = "a"; 
        } else if (state.process === "entering b") { 
            target = "b";
        } else {
            return;
        }
        if (state[target].includes(".") || state.target === "") {
            return;
        }
        state[target] = state[target] + ".";
        screen.textContent = state[target];
        return;
    }
    else if (state.process === "entering a") {
        state.a = formatNumber(parseFloat(state.a + digit));
        screen.textContent = state.a
    } else if (state.process === "entering b") {   
        state.b = formatNumber(parseFloat(state.b + digit));
        screen.textContent = state.b;
    } 
}

// logic for the "DEL" action
const deleteButtonPress = () => {
     // check which number is currently being displayed to remove digit from
     if (state.process === "entering a") {
        state.a = state.a.slice(0, -1);
        screen.textContent = state.a;
    } else if (state.process === "entering b") {
        state.b = state.b.slice(0, -1);
        screen.textContent = state.b;
    }
}

// logic for the "=" action
const equalsButtonPress = () => {
    // only proceed if everything exists for the operation
    if (state.process === "entering b" && state.operatorBtnId && state.a && state.b) {
        let result = operate();
        // update if NaN error doesn't exist
        if(result) {
            screen.textContent = result;
            state = {a: result, b: "", operatorBtnId: "", process: "waiting for operator"}
        } else {
            screen.textContent = "no, try again."
            state = {a: "", b: "", operatorBtnId: "", process: "entering a"}
        }     
    } else if (state.process === "entering a" && state.a !== "") {
        state = {a: state.a, b: "", operatorBtnId: "", process: "waiting for operator"}
    }
}

// logic for the "AC" action
const clearButtonPress = () => {
    state = {a: "", b: "", operatorBtnId: "", process: "entering a"}
    screen.textContent = "0";
}

// add event listeners

deleteBtn.addEventListener('click', deleteButtonPress);
equalsBtn.addEventListener('click', equalsButtonPress);
clearBtn.addEventListener('click', clearButtonPress);
numberBtns.forEach( button => button.addEventListener("click", () => numberButtonPress(button.textContent)) );
operatorBtns.forEach( button => button.addEventListener("click", () => operatorButtonPress(button.id)) );
// adds keyboard support
document.addEventListener("keydown", (event) => {
    switch(event.key) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case ".":
            numberButtonPress(event.key);
            break;
        case "m":
        case "d":
        case "a":
        case "s":
            operatorButtonPress(event.key);
            break;
        case "Backspace":
        case "Delete":
            deleteButtonPress();
            break;
        case "c": 
            clearButtonPress();
            break;
        case "=":
        case "Enter":
        case "e":
            equalsButtonPress();
            break;
    }
})