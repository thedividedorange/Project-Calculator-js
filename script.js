const buttonsNumbers = document.querySelectorAll(".calcButtons button.number")
const buttonsOperations = document.querySelectorAll(".calcButtons button.operation")
const deleteButton = document.querySelector(".calcButtons button.delete")
const currentEntry = document.querySelector(".calcButtons button.ce")
const resetCalculator = document.querySelector(".calcButtons button.reset")
const equals = document.querySelector(".calcButtons button.equals")
const percent = document.querySelector(".calcButtons button.percent")
const decimal = document.querySelector(".calcButtons button.decimal")
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
}

const calcState = {
    oldState: { previous: '',
            operator: '',
            next: '',
            result: '',
    },
    newState: { previous: '',
            operator: '',
            next: '',
            result: '',
    },
    current: ''
}

function operate(previous,next, operator){

    const {newState} = calcState

    switch(operator){
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

function handleNumbersClickEvt(){

    const {newState} = calcState
    
    if (newState.operator === ''){
        newState.previous += this.value
        newState.previous.charAt(0) === '0' && newState.previous.length >= 2  ? 
        newState.previous = parseFloat([...newState.previous].splice(1).join('')) : newState.previous = parseFloat(newState.previous)

        bottomDisplay.textContent = newState.previous

        updateCurrentState('previous')
    } else {
        newState.next += this.value
        newState.next.charAt(0) === '0' && newState.previous.length >= 2 ? 
        newState.next = parseFloat([...newState.next].splice(1).join('')) : newState.next = parseFloat(newState.next)

        bottomDisplay.textContent = newState.next

        updateCurrentState('next')
    }
}

function handlePercentEvt(){

    const {oldState, newState} = calcState

    let swap = newState.operator
    newState.operator = this.value

    if (calcState.current === 'previous'){
        bottomDisplay.textContent = newState.previous = 0
        newState.operator = swap
        topDisplay.textContent = ''

    } else if (calcState.current === 'next'){
        bottomDisplay.textContent = operate(newState.previous, newState.next, newState.operator)
        newState.operator = swap
        topDisplay.textContent = `${newState.previous} ${newState.operator} ${newState.next} =`
    
        copyObjectToOld(oldState, newState)
        clearValues(true, false, false, false)
        updateCurrentState(undefined)

    } else if (calcState.current === undefined){
        newState.operator = swap
    }
}

// function to handle how the equals button operates based on different conditions on the current state of the calculator.
// use `calcState` in console to understand.

const handleEqualsButton = () => {

    const {oldState, newState} = calcState
    // Initialise topDisplay & BottomDisplay Variables to false
    let topDisplay = false
    let bottomDisplay = false
    isDecimalEnd() // Calls function to check if current state value is ending with a decimal before working with equals button

    if (newState.previous !== '' && newState.next !== ''){
        bottomDisplay = operate(newState.previous, newState.next, newState.operator)
        topDisplay = `${newState.previous} ${newState.operator} ${newState.next} =`

        copyObjectToOld(oldState, newState)
        clearValues(true)
        updateCurrentState(undefined)
    } else if (newState.previous !== '' && newState.next === ''){
        if (newState.previous === oldState.result){
            topDisplay = `${oldState.previous} ${oldState.operator} ${oldState.next} =`
            bottomDisplay = `${oldState.result}`
        } else {
            topDisplay = ' '
        }

        clearValues(true, false, false, true) 
    } else return

    updateDisplay(topDisplay, bottomDisplay)
    handleError()
}

// function to handle current entry button, works similar to windows 10 calculator, depending on the state of the calculator
// if state is previous or next, value is set to 0, if undefined or empty, it is calls the clearValues()

const handleCurrentEntryButton = () => {

    const {newState} = calcState
    const currentState = getCurrentState()

    if(currentState === 'previous'){
        newState.previous = 0
        updateDisplay(false, '0')
    } else if(currentState === 'next'){
        newState.next = 0
        updateDisplay(false, '0')
    } else {
        clearValues(true, false, true)
    }
}

// function to handle calculator delete (backspace) button, includes error handling if user backspaces all the numbers
// if no number is left it throws NaN, so it is replaced by 0 using handleError()

const handleCalcDeleteButton = () => {

    const {newState} = calcState
    const currentState = getCurrentState()
    let temp 

    const result = [currentState].map((value) => {
        if(value === `previous`){
            temp = newState.previous.toString()
        } else if (value === `next`){
            temp = newState.next.toString()
        } else return

        temp = parseFloat(temp.slice(0, temp.length-1))
        return value === `previous` ? newState.previous = temp : newState.next = temp
    })
    
    if(result[0] !== undefined) updateDisplay(false, result)
    handleError()
}

// function to handle some errors during operations like NaN, Infinity, this function is called in some other
// functions based on the outputs

const handleError = () => {

    isNaNOrInfinity(calcState)
    const displayError = bottomDisplay.textContent

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

// function to loop through Object and check for NaN or Infinity replacing it with 0
// we do not want to include current key and operator

const isNaNOrInfinity = (Objct) => {
    Object.keys(Objct).forEach((key) => {
        if (key !== 'current') { 
            for (let keys in Objct[key]) {
                if (!isFinite(Objct[key][keys]) && keys !== 'operator') Objct[key][keys] = 0;   
            }
        }
    });
}

// function to handle reset button click, once clicked it resets the calculator values

const handleResetButton = () => clearValues(true, true, true, true)

// function to clear old object, new object, display screen, current state

const clearValues = (objNew=false, objOld=false, display=false, currentState=false) => {

    objNew === true ? clearObj(calcState.newState, currentState) : calcState.newState
    objOld === true ? clearObj(calcState.oldState, currentState) : calcState.oldState

    if(display === true) updateDisplay(' ', '0')
}

// function to clear new object and/or current state

const clearObj = (objct, currentState) => {
    for (let i in objct){
        objct[i] = ''
    }
    if(currentState) calcState.current = ''
}

// function to copy new object values to old object for use later on

const copyObjectToOld = (oldObjct,newObjct) => {
    for(oldkeys in oldObjct){
        for(newkeys in newObjct){
            oldkeys === newkeys ? oldObjct[oldkeys] = newObjct[newkeys] : oldObjct[oldkeys]
        }
    }
}

//

const updateDisplay = (topDisplayValue, bottomDisplayValue, operator) => {
    if (topDisplayValue){
        // console.log(topDisplayValue)
        // topDisplayValue.toString().split(".")[1].length >= 4 ? topDisplay.textContent = topDisplayValue.toFixed(4) : 
        topDisplay.textContent = topDisplayValue
    }
    if (bottomDisplayValue) {
        if (operator){
            switch(operator){
                case "+":
                    bottomDisplay.textContent += bottomDisplayValue
                    break;
                default:
                    return
            }        
        } else bottomDisplay.textContent = bottomDisplayValue
    }
}

// function to handle the decimal button clicks, it gets the current state of the Calculator,
// it then checks if the values have a decimal or got using the checkDecimalPoint(), if false it add a decimal point
// and then updates the display values 

const handleDecimalButton = () => {
    
    const {newState} = calcState
    const currentState = [getCurrentState()]

    currentState.forEach((state) => {
        if(state === undefined || state === ''){
            return
        } else {
            const isDecimal = checkDecimalPoint(state)

            if(!isDecimal){
                state === `previous` ? newState.previous = newState.previous.toString().concat(".") :
                state === `next` ? newState.next = newState.next.toString().concat(".") : newState.next

                updateDisplay(false, '.', '+')
            }
        }
    })
}

// function to check if the number has a decimal (.) or not, if true it will return true else false

const checkDecimalPoint = (currentState) => {

    const {newState} = calcState

    if (currentState === `previous` && newState.previous.toString().includes(".")){
        return true
    } else if (currentState === 'next' && newState.next.toString().includes(".")){
        return true
    } else return false
}

// function to check if the number is ending with a decimal(.) and no values after the decimal, 
// if true and a user tries to operate using an operator, it will automatically add 0 to the end of the decimal (.)    

const isDecimalEnd = () => {

    const {newState} = calcState
    const currentState = getCurrentState()
    let temp

    const result = [currentState].map((value) => {
        if (value === 'previous' && newState.previous !== ''){
            temp = newState.previous.toString()
        } else if (value === 'next' && newState.next !== '') {
            temp = newState.next.toString()
        } else return

        temp.charAt(temp.length-1) === "." ? temp = temp.concat("0") : temp
        return value === 'previous' ? newState.previous = parseFloat(temp) : newState.next = parseFloat(temp)
    })

    if(result[0] !== undefined) updateDisplay(false, result)
}

// function to get the currentState of the calculator

const getCurrentState = () => calcState.current

// function to get the update the currentState of the calculator

const updateCurrentState = (state) => calcState.current = state

// function to check the lenght of floating points and reduce it to a maximum of 4 decimals

const checkFloatLength = (element) => {
    const [array, decimalPoint] = element.toString().split(".")
    return decimalPoint !== undefined ? decimalPoint.length >=4 ? element.toFixed(4) : element : array
}

// All event Listeners below

decimal.addEventListener("click", handleDecimalButton)
deleteButton.addEventListener("click", handleCalcDeleteButton)
currentEntry.addEventListener("click", handleCurrentEntryButton)
resetCalculator.addEventListener("click", handleResetButton)
equals.addEventListener("click", handleEqualsButton)
percent.addEventListener("click", handlePercentEvt)
buttonsOperations.forEach(button => button.addEventListener("click", handleOperationsClickEvt))
buttonsNumbers.forEach(button => button.addEventListener("click", handleNumbersClickEvt))

// handleCurrentEntryEvt, equals, update display