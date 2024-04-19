const buttonsNumbers = document.querySelectorAll(".calcButtons button.number")
const buttonsOperations = document.querySelectorAll(".calcButtons button.operation")
const deleteButton = document.querySelector(".calcButtons button.delete")
const currentEntryButton = document.querySelector(".calcButtons button.ce")
const resetCalculator = document.querySelector(".calcButtons button.reset")
const equalsButton = document.querySelector(".calcButtons button.equals")
const percentButton = document.querySelector(".calcButtons button.percent")
const decimalButton = document.querySelector(".calcButtons button.decimal")
const squareButton = document.querySelector(".calcButtons button.square")
const topDisplay = document.querySelector(".display .top")
const bottomDisplay = document.querySelector(".display .bottom")

const operations = {
    add: (a, b) => a + b,
    substract: (a, b) => a - b,
    divide: (a, b) => a / b,
    multiply: (a, b) => a * b,
    percent: (a, b) => {
        const {newState} = calcState
        b = newState.next = checkFloatLength(a * b / 100)
        return a+b
    },
    square: (num) => Math.pow(num, 2)
}

const calcState = {
    oldState: { previous: '', operator: '', next: '', result: ''},
    newState: { previous: '', operator: '', next: '', result: ''},
    current: ''
}

const strings = {
    errorMsg: {1: 'Cannot Divide by zero'},
    errorType: {1: '-Infinity', 2: 'Infinity', 3: 'NaN'},
    value: {1: ' ', 2: '0', 3: 'previous', 4: 'next', 5: '', 6: 'current', 7: 'operator'},
    sign: {1: '+', 2: '-', 3: '*', 4: '÷', 5: '%', 6: 'x²'}
}

function operate(previous,next, operator){

    const { newState } = calcState, { sign } = strings
  
    switch (operator){
        case sign[1]:
            newState.result = operations.add(previous,next)
            break;
        case sign[2]:
            newState.result = operations.substract(previous,next)
            break;
        case sign[3]:
            newState.result = operations.multiply(previous,next)
            break;
        case sign[4]:
            newState.result = operations.divide(previous,next)
            break;
        case sign[5]:
            newState.result = operations.percent(previous,next)
            break;
        case sign[6]:
            let num = previous
            newState.result = operations.square(num)
            break;
        default:
            return
    }

    return newState.result = checkFloatLength(newState.result)
}

function handleOperationsClickEvt(){

    const { oldState, newState } = calcState, { value } = strings
    let topDisplay = false, bottomDisplay = false

    isDecimalEnd()

    if (newState.previous){
        if (newState.next){
            bottomDisplay = operate(newState.previous, newState.next, newState.operator)
            copyObjectToOld(oldState, newState)
            newState.operator = this.value
            topDisplay = `${newState.result} ${newState.operator}`
    
            clearValues(true)
            newState.previous = parseFloat(bottomDisplay)
            bottomDisplay = value[2]
            newState.operator = this.value
        } else {
            newState.operator = this.value
            topDisplay = `${newState.previous} ${newState.operator}`
            updateCurrentState(undefined)
        }
    } else if (oldState.result) {
        newState.previous = oldState.result
        newState.operator = this.value
        topDisplay = `${newState.previous} ${newState.operator}`
    }

    updateDisplay(topDisplay, bottomDisplay)
}

function handleNumbersClickButton(){

    const { newState } = calcState, { value } = strings
    const currentState = newState.operator === '' ? value[3] : value[4]

    newState[currentState] += this.value
        
    if (newState[currentState].charAt(0) === value[2]) {
        if (newState[currentState].length >= 2) newState[currentState].substring(1)
    } else {
        newState[currentState]
    }
    
    newState[currentState] = parseFloat(checkFloatLength(newState[currentState]))

    updateCurrentState(currentState)
    updateDisplay(false, newState[currentState].toString())
}

function handlePercentButton(){

    const { oldState, newState } = calcState, currentState = getCurrentState()
    const { value } = strings
    let topDisplay = false, bottomDisplay = false, swap = newState.operator

    newState.operator = this.value

    if (currentState){
        if (currentState === value[3]){
            newState[currentState] = Number(value[2])
            bottomDisplay = newState[currentState].toString()
            newState.operator = swap
            topDisplay = value[1]
        } else {
            bottomDisplay = operate(newState.previous, newState[currentState], newState.operator)
            newState.operator = swap
            topDisplay = `${newState.previous} ${newState.operator} ${newState[currentState]} =`
            bottomDisplay = operate(newState.previous, newState[currentState], newState.operator)

            copyObjectToOld(oldState, newState)
            clearValues(true)
            updateCurrentState(undefined)
        }
    } else newState.operator = swap

    updateDisplay(topDisplay, bottomDisplay)
}

function handleSquareButton(){
    
    const { newState } = calcState
    const currentState = getCurrentState(), { value } = strings
    let topDisplay = false, bottomDisplay = false, swap = newState.operator

        if (currentState){
            newState.operator = this.value
            bottomDisplay = operate(newState[currentState], false, newState.operator)
            newState[currentState] = newState.result

            newState.result = value[5]
            newState.operator = currentState === value[3] ? value[5] : swap
        } else return 

    updateDisplay(topDisplay, bottomDisplay)
}

const handleEqualsButton = () => {

    const { oldState, newState } = calcState, { value } = strings
    let topDisplay = false, bottomDisplay = false

    isDecimalEnd()

    if (newState.previous !== value[5]) {
        if (newState.next !== value[5]) {
            bottomDisplay = operate(newState.previous, newState.next, newState.operator)
            topDisplay = `${newState.previous} ${newState.operator} ${newState.next} =`

            copyObjectToOld(oldState, newState);
            clearValues(true);
            updateCurrentState(undefined);
        } else {
            if(newState.previous === oldState.result) {
                topDisplay = `${oldState.previous} ${oldState.operator} ${oldState.next} =`
                bottomDisplay = `${oldState.result}`
            } else {
                topDisplay = value[1];
            }

            clearValues(true, false, false, true);
        }
    } else return

    updateDisplay(topDisplay, bottomDisplay)
    handleError()
}

const handleCurrentEntryButton = () => {

    const { newState } = calcState, currentState = getCurrentState()
    const { value } = strings

    if (currentState){
        newState[currentState] = Number(value[2])
        updateDisplay(false, value[2])
    } else if (currentState === value[5]){
        clearValues(true, false, true)
    }
}

const handleResetButton = () => clearValues(true, true, true, true)

const clearValues = (objNew=false, objOld=false, display=false, currentState=false) => {

    const { value } = strings

    objNew === true ? clearObj(calcState.newState, currentState) : calcState.newState
    objOld === true ? clearObj(calcState.oldState, currentState) : calcState.oldState

    if (display === true) updateDisplay(value[1], value[2])
}

const clearObj = (object, currentState) => {

    const { value } = strings

    Object.keys(object).forEach(key => object[key] = value[5])
    if (currentState) calcState.current = value[5]
}

const handleCalcDeleteButton = () => {

    const { newState } = calcState, currentState = getCurrentState()
    let result

    if (currentState){
        let temp = newState[currentState].toString()
        temp = parseFloat(temp.slice(0, temp.length-1))
        result = newState[currentState] = temp 
    } else return

    updateDisplay(false, result.toString())
    handleError()
}

const handleDecimalButton = () => {
    
    const { newState } = calcState, currentState = getCurrentState()

    if (currentState){
        const isDecimal = checkDecimalPoint(currentState)
        if (!isDecimal) {
            newState[currentState] = newState[currentState].toString().concat(".")
            updateDisplay(false, '.', '+')
        }
    } else return
}

const checkDecimalPoint = (currentState) => {

    const { newState } = calcState
    const value = newState[currentState].toString()

    return value.includes('.')
}   

const isDecimalEnd = () => {

    const { newState } = calcState, currentState = getCurrentState()
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

const handleError = () => {
    fixNaNOrInfinity(calcState)
    fixDisplayError(bottomDisplay)
}

const fixDisplayError = (display) => {

    const displayError = display.textContent
    const { errorMsg, errorType, value } = strings
    let displayMsg
    
    switch (displayError) {
        case errorType[1]:
        case errorType[2]:
            displayMsg = errorMsg[1]
            break;
        case errorType[3]:
            displayMsg = value[2]
            break;
        default:
            return;
    }

    updateDisplay(false, displayMsg)
}

const fixNaNOrInfinity = (object) => {

    const { value } = strings

    Object.keys(object).forEach((key) => {
        if (key !== value[6]) { 
            for (let subKey in object[key]) {
                if (!isFinite(object[key][subKey]) && subKey !== value[7]) object[key][subKey] = Number(value[2])
            }
        }
    });
}

const copyObjectToOld = (oldObject,newObject) => {
    Object.keys(oldObject).forEach((key) => {
        if (newObject.hasOwnProperty(key)) oldObject[key] = newObject[key]
    })
}

const checkFloatLength = (element) => {
    const [ array, decimalPoint ] = element.toString().split(".")
    const result = decimalPoint !== undefined ? decimalPoint.length >=8 ? element.toFixed(8) : element : array
    return parseFloat(result)
}

const updateDisplay = (topDisplayValue, bottomDisplayValue, operator) => {
  
    if (topDisplayValue) topDisplay.textContent = topDisplayValue

    if (bottomDisplayValue) {
        if (operator){
            switch (operator) { case "+": bottomDisplay.textContent += bottomDisplayValue }
        } else {
            bottomDisplay.textContent = bottomDisplayValue
        }
    }
}

const getCurrentState = () => calcState.current
const updateCurrentState = (state) => calcState.current = state

decimalButton.addEventListener("click", handleDecimalButton)
deleteButton.addEventListener("click", handleCalcDeleteButton)
currentEntryButton.addEventListener("click", handleCurrentEntryButton)
resetCalculator.addEventListener("click", handleResetButton)
equalsButton.addEventListener("click", handleEqualsButton)
percentButton.addEventListener("click", handlePercentButton)
squareButton.addEventListener("click", handleSquareButton)
buttonsOperations.forEach(button => button.addEventListener("click", handleOperationsClickEvt))
buttonsNumbers.forEach(button => button.addEventListener("click", handleNumbersClickButton))