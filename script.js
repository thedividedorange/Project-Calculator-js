const buttonsNumbers = document.querySelectorAll(".calcButtons button.number")
const buttonsOperations = document.querySelectorAll(".calcButtons button.operation")
const deleteButton = document.querySelector(".calcButtons button.delete")
const currentEntry = document.querySelector(".calcButtons button.ce")
const resetCalculator = document.querySelector(".calcButtons button.reset")
const equals = document.querySelector(".calcButtons button.equals")
const percent = document.querySelector(".calcButtons button.percent")
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
    return newState.result
}

function handleOperationsClickEvt(){

    const {oldState, newState} = calcState

    if (newState.previous === ''){
        newState.previous = oldState.result = parseFloat(bottomDisplay.textContent)    
        newState.operator = this.value

        topDisplay.textContent = newState.previous + newState.operator

    } else if (newState.previous !== '' && newState.next !== ''){
        bottomDisplay.textContent = operate(newState.previous, newState.next, newState.operator)

        copyObjectToOld(oldState, newState)

        newState.operator = this.value
        topDisplay.textContent = newState.result + newState.operator  

        clearValues(true,false,false)

        newState.previous = parseFloat(bottomDisplay.textContent)
        newState.operator = this.value

    } else {
        newState.operator = this.value
        topDisplay.textContent = newState.previous + newState.operator
        calcState.current = undefined
    }
}

function handleNumbersClickEvt(){

    const {newState} = calcState
    
    if (newState.operator === ''){
        
        newState.previous += this.value
        newState.previous.charAt(0) === '0' && newState.previous.length >= 2  ? 
        newState.previous = parseFloat([...newState.previous].splice(1).join('')) : newState.previous = parseFloat(newState.previous)

        bottomDisplay.textContent = newState.previous
        calcState.current = 'previous'

    } else {
        newState.next += this.value
        newState.next.charAt(0) === '0' && newState.previous.length >= 2 ? 
        newState.next = parseFloat([...newState.next].splice(1).join('')) : newState.next = parseFloat(newState.next)

        bottomDisplay.textContent = newState.next
        calcState.current = 'next'
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
        clearValues(true,false,false)
        calcState.current = undefined

    } else if (calcState.current === undefined){
        newState.operator = swap
    }
}

function handleEqualsEvt(){

    const {oldState, newState} = calcState

    if (newState.previous !== '' && newState.next !== ''){
        bottomDisplay.textContent = operate(newState.previous, newState.next, newState.operator)
        topDisplay.textContent = `${newState.previous} ${newState.operator} ${newState.next} =`

        copyObjectToOld(oldState, newState)
        handleError()
        clearValues(true,false,false)

        calcState.current = undefined

    } else if (newState.previous !== '' && newState.next === ''){

        if (newState.previous === oldState.result){
            topDisplay.textContent = `${oldState.previous} ${oldState.operator} ${oldState.next} =`
        } else {
            topDisplay.textContent = ''
        }

        clearValues(true,false,false) 
    } 
}

function handleCurrentEntryEvt(){

    const {newState} = calcState

    if (calcState.current === undefined){
        clearValues(true,false,true) 

    } else if (calcState.current === 'previous'){
        bottomDisplay.textContent = newState.previous = 0

    } else if (calcState.current === 'next'){
        bottomDisplay.textContent = newState.next = 0
    }
}

function handleCalcDeleteEvt(){

    const {newState} = calcState

    if (calcState.current === 'previous'){
        newState.previous = newState.previous.toString()
        newState.previous = parseInt(newState.previous.slice(0, newState.previous.length-1))

        bottomDisplay.textContent = newState.previous

    } else if (calcState.current === 'next'){
        newState.next = newState.next.toString()
        newState.next = parseFloat(newState.next.slice(0, newState.next.length-1))

        bottomDisplay.textContent = newState.next
    }

    handleError()
}

function handleResetEvt(){
    clearValues(true, true, true)
}

function clearValues(objNew=false, objOld=false, display=false){

    objNew === true ? clearObj(calcState.newState) : calcState.newState
    objOld === true ? clearObj(calcState.oldState) : calcState.oldState

    if(display === true){
        bottomDisplay.textContent = '0'
        topDisplay.textContent = ''
    }
}

function clearObj(objct){
    for (let i in objct){
        objct[i] = ''
    }
}

function copyObjectToOld(oldObjct,newObjct){
    for(oldkeys in oldObjct){
        for(newkeys in newObjct){
            oldkeys === newkeys ? oldObjct[oldkeys] = newObjct[newkeys] : oldObjct[oldkeys]
        }
    }
}

function handleError(){

    const {newState} = calcState

    isNaN(newState.previous) ? newState.previous = 0 : newState.previous
    isNaN(newState.next) ? newState.next = 0 : newState.next

    if (bottomDisplay.textContent === "NaN"){
        bottomDisplay.textContent = '0'
        
    } else if (bottomDisplay.textContent === "Infinity" && newState.operator === '÷'){
        bottomDisplay.textContent = 'Cannot Divide by 0'
        
    }
}
// function updateDisplay(top, bottom){
//     bottomDisplay.textContent = bottom
    
// }
// updateDisplay("bottomDisplay:0, topDisplay:1")

deleteButton.addEventListener("click", handleCalcDeleteEvt)
currentEntry.addEventListener("click", handleCurrentEntryEvt)
resetCalculator.addEventListener("click", handleResetEvt)
equals.addEventListener("click", handleEqualsEvt)
percent.addEventListener("click", handlePercentEvt)
buttonsOperations.forEach(button => button.addEventListener("click", handleOperationsClickEvt))
buttonsNumbers.forEach(button => button.addEventListener("click", handleNumbersClickEvt))
