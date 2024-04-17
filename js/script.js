const buttonsNumbers = document.querySelectorAll(".calcButtons button.number")
const buttonsOperations = document.querySelectorAll(".calcButtons button.operation")
const deleteButton = document.querySelector(".calcButtons button.delete")
const currentEntry = document.querySelector(".calcButtons button.ce")
const resetCalculator = document.querySelector(".calcButtons button.reset")
const equals = document.querySelector(".calcButtons button.equals")
const percent = document.querySelector(".calcButtons button.percent")
const decimal = document.querySelector(".calcButtons button.decimal")
const square = document.querySelector(".calcButtons button.square")
const topDisplay = document.querySelector(".display .top")
const bottomDisplay = document.querySelector(".display .bottom")

const operations = {
    add: (a, b) => a + b,
    substract: (a, b) => a - b,
    divide: (a, b) => a / b,
    multiply: (a, b) => a * b,
    percent: (a, b) => {
        const {newState} = calcState
        b = newState.next = a * b / 100        
        return a+b
    },
    square: (number) => Math.pow(number, 2)
}

const calcState = {
    oldState: { previous: '', operator: '', next: '', result: ''},
    newState: { previous: '', operator: '', next: '', result: ''},
    current: ''
}

function operate(previous,next, operator){

    const {newState} = calcState

    switch (operator){
        case "+":
            newState.result = operations.add(previous,next)
            break;
        case "-":
            newState.result = operations.substract(previous,next)
            break;
        case "*":
            newState.result = operations.multiply(previous,next)
            break;
        case "÷":
            newState.result = operations.divide(previous,next)
            break;
        case "%":
            newState.result = operations.percent(previous,next)
            break;
        case "x²":
            let num = previous
            newState.result = operations.square(num)
            break;
        default:
            return
    }

    return checkFloatLength(newState.result)
}

function handleOperationsClickEvt(){

    const {oldState, newState} = calcState
    isDecimalEnd()

    if (newState.previous === '' && oldState.result !== ''){
        newState.previous = oldState.result
        newState.operator = this.value
        topDisplay.textContent = newState.previous + newState.operator

    } else if (newState.previous !== '' && newState.next !== ''){
        bottomDisplay.textContent = operate(newState.previous, newState.next, newState.operator)

        copyObjectToOld(oldState, newState)
        newState.operator = this.value
        topDisplay.textContent = newState.result + newState.operator  

        clearValues(true, false, false, false)
        newState.previous = parseFloat(bottomDisplay.textContent)
        bottomDisplay.textContent = '0'
        newState.operator = this.value

    } else if(newState.previous !== '' && newState.next === ''){
        newState.operator = this.value
        topDisplay.textContent = newState.previous + newState.operator
        updateCurrentState(undefined)
    }
}

function handleNumbersClickButton(){

    const {newState} = calcState
    const currentState = newState.operator === '' ? 'previous' : 'next'

    newState[currentState] += this.value
        
    if (newState[currentState].charAt(0) === '0') {
        newState[currentState] = newState[currentState].length >= 2 ? parseFloat(newState[currentState].substring(1)) : parseFloat(newState[currentState])
    } else {
        newState[currentState] = parseFloat(newState[currentState]);
    }

    updateCurrentState(currentState)
    updateDisplay(false, newState[currentState])
}

function handlePercentButton(){

    const {oldState, newState} = calcState, currentState = getCurrentState();
    let topDisplay = false, bottomDisplay = false, swap = newState.operator

    newState.operator = this.value

    if (currentState){
        if (currentState === 'previous'){
            newState[currentState] = 0
            bottomDisplay = newState[currentState].toString()
            newState.operator = swap
            topDisplay = ' '
        } else {
            bottomDisplay = operate(newState.previous, newState[currentState], newState.operator)
            newState.operator = swap
            topDisplay = `${newState.previous} ${newState.operator} ${newState[currentState]} =`

            copyObjectToOld(oldState, newState)
            clearValues(true)
            updateCurrentState(undefined)
        }
    } else newState.operator = swap

    updateDisplay(topDisplay, bottomDisplay)
}

const handleEqualsButton = () => {

    const {oldState, newState} = calcState
    let topDisplay = false, bottomDisplay = false

    isDecimalEnd()

    if (newState.previous !== '') {
        if (newState.next !== '') {
            bottomDisplay = operate(newState.previous, newState.next, newState.operator);
            topDisplay = `${newState.previous} ${newState.operator} ${newState.next} =`;

            copyObjectToOld(oldState, newState);
            clearValues(true);
            updateCurrentState(undefined);
        } else {
            if(newState.previous === oldState.result) {
                topDisplay = `${oldState.previous} ${oldState.operator} ${oldState.next} =`;
                bottomDisplay = `${oldState.result}`;
            } else {
                topDisplay = ' ';
            }

            clearValues(true, false, false, true);
        }
    } else return

    updateDisplay(topDisplay, bottomDisplay)
    handleError()
}

const handleCurrentEntryButton = () => {

    const {newState} = calcState, currentState = getCurrentState()

    if (currentState){
        newState[currentState] = 0
        updateDisplay(false,  '0')
    } else if (currentState === ''){
        clearValues(true, false, true)
    }
}

const handleCalcDeleteButton = () => {

    const {newState} = calcState, currentState = getCurrentState()
    let result

    if (currentState){
        let temp = newState[currentState].toString()
        temp = parseFloat(temp.slice(0, temp.length-1))
        result = newState[currentState] = temp 
    } else return

    updateDisplay(false, result.toString())
    handleError()
}

const handleError = () => {
    fixNaNOrInfinity(calcState)
    fixDisplayError(bottomDisplay)
}

const fixDisplayError = (display) => {

    const displayError = display.textContent

    switch (displayError) {
        case "Infinity":
        case "-Infinity":
            updateDisplay(false, 'Cannot Divide by 0');
            break;
        case "NaN":
            updateDisplay(false, '0');
            break;
        default:
            return;
    }
}

const fixNaNOrInfinity = (object) => {
    Object.keys(object).forEach((key) => {
        if (key !== 'current') { 
            for (let subKey in object[key]) {
                if (!isFinite(object[key][subKey]) && subKey !== 'operator') object[key][subKey] = 0;   
            }
        }
    });
}

const handleResetButton = () => clearValues(true, true, true, true)

const clearValues = (objNew=false, objOld=false, display=false, currentState=false) => {

    objNew === true ? clearObj(calcState.newState, currentState) : calcState.newState
    objOld === true ? clearObj(calcState.oldState, currentState) : calcState.oldState

    if (display === true) updateDisplay(' ', '0')
}

const clearObj = (objct, currentState) => {
    for (let i in objct){
        objct[i] = ''
    }
    if (currentState) calcState.current = ''
}

const copyObjectToOld = (oldObjct,newObjct) => {
    for (oldkeys in oldObjct){
        for (newkeys in newObjct){
            oldkeys === newkeys ? oldObjct[oldkeys] = newObjct[newkeys] : oldObjct[oldkeys]
        }
    }
}

const updateDisplay = (topDisplayValue, bottomDisplayValue, operator) => {

    if (topDisplayValue){
        // console.log(topDisplayValue)
        // topDisplayValue.toString().split(".")[1].length >= 4 ? topDisplay.textContent = topDisplayValue.toFixed(4) : 
        topDisplay.textContent = topDisplayValue
    }
    if (bottomDisplayValue) {
        if (operator){
            switch (operator){
                case "+":
                    bottomDisplay.textContent += bottomDisplayValue
                    break;
                default:
                    return
            }        
        } else bottomDisplay.textContent = bottomDisplayValue
    }
}

const handleDecimalButton = () => {
    
    const {newState} = calcState, currentState = getCurrentState()

    if (currentState){
        const isDecimal = checkDecimalPoint(currentState)
        if (!isDecimal) {
            newState[currentState] = newState[currentState].toString().concat(".");
            updateDisplay(false, '.', '+');
        }
    } else return
}

const checkDecimalPoint = (currentState) => {

    const {newState} = calcState
    const value = newState[currentState].toString()

    return value.includes('.')
}   

const isDecimalEnd = () => {

    const {newState} = calcState, currentState = getCurrentState()
    let result

    if (currentState){
        if (newState[currentState]){
            let temp = newState[currentState].toString()
            temp = temp.charAt(temp.length-1) === '.' ? temp.concat('0') : temp
            result = newState[currentState] = parseFloat(temp)
        }
    } else return

    updateDisplay(false, result)
}

function handleSquareButton(){
    
    const {newState} = calcState, currentState = getCurrentState()
    let topDisplay = false, bottomDisplay = false, swap = newState.operator

        if (currentState){
            newState.operator = this.value
            bottomDisplay = operate(newState[currentState], false, newState.operator)
            newState[currentState] = newState.result

            newState.result = ''
            newState.operator = currentState === 'previous' ? '' : swap
        } else return 

    updateDisplay(topDisplay, bottomDisplay)
}

const getCurrentState = () => calcState.current
const updateCurrentState = (state) => calcState.current = state

const checkFloatLength = (element) => {
    const [array, decimalPoint] = element.toString().split(".")
    return decimalPoint !== undefined ? decimalPoint.length >=4 ? element.toFixed(4) : element : array
}

decimal.addEventListener("click", handleDecimalButton)
deleteButton.addEventListener("click", handleCalcDeleteButton)
currentEntry.addEventListener("click", handleCurrentEntryButton)
resetCalculator.addEventListener("click", handleResetButton)
equals.addEventListener("click", handleEqualsButton)
percent.addEventListener("click", handlePercentButton)
square.addEventListener("click", handleSquareButton)
buttonsOperations.forEach(button => button.addEventListener("click", handleOperationsClickEvt))
buttonsNumbers.forEach(button => button.addEventListener("click", handleNumbersClickButton))