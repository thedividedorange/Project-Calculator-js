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
        const {newV} = obj
        b = newV.next = a * b / 100        
        return a+b
    },
}

const obj = {
    oldV: { previous: '',
            operator: '',
            next: '',
            result: '',
    },
    newV: { previous: '',
            operator: '',
            next: '',
            result: '',
    },
    current: ''
}

function operate(previous,next, operator){

    const {newV} = obj

    switch(operator){
        case "+":
            newV.result = operations.add(previous,next)
            break;
        case "-":
            newV.result = operations.substract(previous,next)
            break;
        case "*":
            newV.result = operations.multiply(previous,next)
            break;
        case "÷":
            newV.result = operations.divide(previous,next)
            break;
        case "%":
            newV.result = operations.percent(previous,next)
            break;
        default:
            return
    }
    return newV.result
}

function handleOperationsClickEvt(){

    const {oldV, newV} = obj

    if (newV.previous === ''){
        newV.previous = oldV.result = parseFloat(bottomDisplay.textContent)    
        newV.operator = this.value

        topDisplay.textContent = newV.previous + newV.operator

    } else if (newV.previous !== '' && newV.next !== ''){
        bottomDisplay.textContent = operate(newV.previous, newV.next, newV.operator)

        cpyObjectToOld()

        newV.operator = this.value
        topDisplay.textContent = newV.result + newV.operator  

        clearValues(true,false,false)

        newV.previous = parseFloat(bottomDisplay.textContent)
        newV.operator = this.value

    } else {
        newV.operator = this.value
        topDisplay.textContent = newV.previous + newV.operator
        obj.current = undefined
    }
}

function handleNumbersClickEvt(){

    const {newV} = obj
    
    if (newV.operator === ''){
        
        newV.previous += this.value
        newV.previous.charAt(0) === '0' && newV.previous.length >= 2  ? 
        newV.previous = parseFloat([...newV.previous].splice(1).join('')) : newV.previous = parseFloat(newV.previous)

        bottomDisplay.textContent = newV.previous
        obj.current = 'previous'

    } else {
        newV.next += this.value
        newV.next.charAt(0) === '0' && newV.previous.length >= 2 ? 
        newV.next = parseFloat([...newV.next].splice(1).join('')) : newV.next = parseFloat(newV.next)

        bottomDisplay.textContent = newV.next
        obj.current = 'next'
    }
}

function handlePercentEvt(){

    const {newV} = obj

    let swap = newV.operator
    newV.operator = this.value

    if (obj.current === 'previous'){
        bottomDisplay.textContent = newV.previous = 0
        newV.operator = swap
        topDisplay.textContent = ''

    } else if (obj.current === 'next'){
        bottomDisplay.textContent = operate(newV.previous, newV.next, newV.operator)
        newV.operator = swap
        topDisplay.textContent = `${newV.previous} ${newV.operator} ${newV.next} =`
    
        cpyObjectToOld()
        clearValues(true,false,false)
        obj.current = undefined

    } else if (obj.current === undefined){
        newV.operator = swap
    }
}

function handleEqualsEvt(){

    const {oldV, newV} = obj

    if (newV.previous !== '' && newV.next !== ''){
        bottomDisplay.textContent = operate(newV.previous, newV.next, newV.operator)
        topDisplay.textContent = `${newV.previous} ${newV.operator} ${newV.next} =`

        cpyObjectToOld()
        handleError()
        clearValues(true,false,false)

        obj.current = undefined

    } else if (newV.previous !== '' && newV.next === ''){

        if (newV.previous === oldV.result){
            topDisplay.textContent = `${oldV.previous} ${oldV.operator} ${oldV.next} =`
        } else {
            topDisplay.textContent = ''
        }

        clearValues(true,false,false) 
    } 
}

function handleCurrentEntryEvt(){

    const {newV} = obj

    if (obj.current === undefined){
        clearValues(true,false,true) 

    } else if (obj.current === 'previous'){
        bottomDisplay.textContent = newV.previous = 0

    } else if (obj.current === 'next'){
        bottomDisplay.textContent = newV.next = 0
    }
}

function handleCalcDeleteEvt(){

    const {newV} = obj

    if (obj.current === 'previous'){
        newV.previous = newV.previous.toString()
        newV.previous = parseInt(newV.previous.slice(0, newV.previous.length-1))

        bottomDisplay.textContent = newV.previous

    } else if (obj.current === 'next'){
        newV.next = newV.next.toString()
        newV.next = parseFloat(newV.next.slice(0, newV.next.length-1))

        bottomDisplay.textContent = newV.next
    }

    handleError()
}

function handleResetEvt(){
    clearValues(true, true, true)
}

function clearValues(objNew=false, objOld=false, display=false){

    objNew === true ? clearObj(obj.newV) : obj.newV
    objOld === true ? clearObj(obj.oldV) : obj.oldV

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

function cpyObjectToOld(){

    const {oldV, newV} = obj

    oldV.previous = newV.previous
    oldV.operator = newV.operator
    oldV.next = newV.next
    oldV.result = newV.result
}

function handleError(){

    const {newV} = obj

    isNaN(newV.previous) ? newV.previous = 0 : newV.previous
    isNaN(newV.next) ? newV.next = 0 : newV.next

    if (bottomDisplay.textContent === "NaN"){
        bottomDisplay.textContent = '0'
        
    } else if (bottomDisplay.textContent === "Infinity" && newV.operator === '÷'){
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