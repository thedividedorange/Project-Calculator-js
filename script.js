const buttonsNumbers = document.querySelectorAll(".calcButtons button.number")
const buttonsOperations = document.querySelectorAll(".calcButtons button.operation")
const deleteButton = document.querySelector(".calcButtons button.delete")
const currentEntry = document.querySelector(".calcButtons button.ce")
const resetCalculator = document.querySelector(".calcButtons button.reset")
const equals = document.querySelector(".calcButtons button.equals")
const topDisplay = document.querySelector(".display .top")
const bottomDisplay = document.querySelector(".display .bottom")

const operations = {
    add: (a,b) => a+b,
    substract: (a,b) => a-b,
    divide: (a,b) => a/b,
    multiply: (a,b) => a*b,
    // percent: () => obj.result = parseInt(bottomDisplay.textContent)/100,
}
const obj = {
    o: {previousOld: '',
        operatorOld: '',
        nextOld: '',
        resultOld: '',
    },
    n:{ previous: '',
        operator: '',
        next: '',
        result: '',
    }
}

let current;

function operate(previous,next, operator){

    switch(operator){
        case "+":
            return obj.n.result = operations.add(previous,next)
            break;
        case "-":
            return obj.n.result = operations.substract(previous,next)
            break;
        case "*":
            return obj.n.result = operations.multiply(previous,next)
            break;
        case "÷":
            return obj.n.result = operations.divide(previous,next)
            break;
        // case "%":
        //     operations.percent()
        //     break;
    }
}

function handleOperationsClickEvt(){
    // if (this.value === "%"){
    //     obj.operator = this.value
    //     operate(undefined, undefined, obj.operator)
    //     bottomDisplay.textContent = obj.result
    //     clearValues()
    // }
    // else {
    if (obj.n.previous === ''){
        obj.n.previous = obj.o.resultOld = parseFloat(bottomDisplay.textContent)    
        obj.n.operator = this.value
        topDisplay.textContent = obj.n.previous + obj.n.operator  

    } else if(obj.n.previous !== '' && obj.n.next !== ''){

        bottomDisplay.textContent = operate(obj.n.previous, obj.n.next, obj.n.operator)
        cpyObjectToOld()

        obj.n.operator = this.value
        topDisplay.textContent = obj.n.result + obj.n.operator 
            
        clearValues(true,false,false)

        obj.n.previous = parseFloat(bottomDisplay.textContent)
        obj.n.operator = this.value

        } 
    else {  
        obj.n.operator = this.value
        topDisplay.textContent = obj.n.previous + obj.n.operator
        current = undefined
    }
}

function handleNumbersClickEvt(){

    if (obj.n.operator === ''){
        obj.n.previous += this.value
        obj.n.previous.charAt(0) === '0' && obj.n.previous.length >= 2  ? 
            obj.n.previous = parseFloat([...obj.n.previous].splice(1).join('')) : obj.n.previous = parseFloat(obj.n.previous)
        bottomDisplay.textContent = obj.n.previous
        current = 'previous'
    } 
    else {
        obj.n.next += this.value
        obj.n.next.charAt(0) === '0' && obj.n.previous.length >= 2 ? 
            obj.n.next = parseFloat([...obj.n.next].splice(1).join('')) : obj.n.next = parseFloat(obj.n.next)
        bottomDisplay.textContent = obj.n.next
        current = 'next'
    }
}

function handleEqualsEvt(){

    if(obj.n.previous !== '' && obj.n.next !== ''){
        bottomDisplay.textContent = operate(obj.n.previous, obj.n.next, obj.n.operator)
        topDisplay.textContent = `${obj.n.previous} ${obj.n.operator} ${obj.n.next} =`
        cpyObjectToOld()
        handleError()
        clearValues(true,false,false) 
        current = undefined   
    } else if(obj.n.previous !== '' && obj.n.next === ''){
            if(obj.n.previous === obj.o.resultOld){
                topDisplay.textContent = `${obj.o.previousOld} ${obj.o.operatorOld} ${obj.o.nextOld} =`
            }
            else {
                topDisplay.textContent = ''
            }
            clearValues(true,false,false) 
        }
    
}

function handleCurrentEntryEvt(){

    if (current === undefined){
        clearValues(true,false,true) 
    } else if(current === 'previous'){
        bottomDisplay.textContent = obj.n.previous = 0
        } else if(current === 'next'){
            bottomDisplay.textContent = obj.n.next = 0
            }
}

function handleCalcDeleteEvt(){

    if(current === 'previous'){
        obj.n.previous = obj.n.previous.toString()
        obj.n.previous = parseInt(obj.n.previous.slice(0, obj.n.previous.length-1))
        bottomDisplay.textContent = obj.n.previous
    } else if(current === 'next'){
        obj.n.next = obj.n.next.toString()
        obj.n.next = parseFloat(obj.n.next.slice(0, obj.n.next.length-1))
        bottomDisplay.textContent = obj.n.next
        }
    handleError()
}

function handleResetEvt(){
    clearValues(true, true, true)
}

function clearValues(objNew=false, objOld=false, display=false){

    if(objNew === true) {
        for (let i in obj.n){
            typeof obj.n[i] === 'number' ? obj.n[i] = '' : typeof obj.n[i] === 'string' ? obj.n[i] = '' : obj.n[i]
        }
    }
    if(objOld === true){
        for (let i in obj.o){
            typeof obj.o[i] === 'number' ? obj.o[i] = '' : typeof obj.o[i] === 'string' ? obj.o[i] = '' : obj.o[i]
        }
    }
    if(display === true){
        bottomDisplay.textContent = '0'
        topDisplay.textContent = ''
    }
}

function cpyObjectToOld(){

    obj.o.previousOld = obj.n.previous
    obj.o.operatorOld = obj.n.operator
    obj.o.nextOld = obj.n.next
    obj.o.resultOld = obj.n.result
}

function handleError(){

    isNaN(obj.n.previous) ? obj.n.previous = 0 : obj.n.previous
    isNaN(obj.n.next) ? obj.n.next = 0 : obj.n.next

    if (bottomDisplay.textContent === "NaN"){
        bottomDisplay.textContent = '0'
    }
    if(bottomDisplay.textContent === "Infinity" && obj.n.operator === '÷'){
        bottomDisplay.textContent = 'Cannot Divide by 0'
    }
}

deleteButton.addEventListener("click", handleCalcDeleteEvt)
currentEntry.addEventListener("click", handleCurrentEntryEvt)
resetCalculator.addEventListener("click", handleResetEvt)
equals.addEventListener("click", handleEqualsEvt)
buttonsOperations.forEach(button => button.addEventListener("click", handleOperationsClickEvt))
buttonsNumbers.forEach(button => button.addEventListener("click", handleNumbersClickEvt))





















// const buttonsNumbers = document.querySelectorAll(".calcButtons button.number")
// const buttonsOperations = document.querySelectorAll(".calcButtons button.operation")
// const deleteButton = document.querySelector(".calcButtons button.delete")
// const currentEntry = document.querySelector(".calcButtons button.ce")
// const resetCalculator = document.querySelector(".calcButtons button.reset")
// const equals = document.querySelector(".calcButtons button.equals")
// const topDisplay = document.querySelector(".display .top")
// const bottomDisplay = document.querySelector(".display .bottom")

// const operations = {
//     add: (a,b) => a+b,
//     substract: (a,b) => a-b,
//     divide: (a,b) => a/b,
//     multiply: (a,b) => a*b,
//     // percent: () => obj.result = parseInt(bottomDisplay.textContent)/100,
// }
// const obj = {
//     o: {previousOld: 0,
//         operatorOld: '',
//         nextOld: 0,
//         resultOld: 0,
//     },
//     n:{ previous: 0,
//         operator: '',
//         next: 0,
//         result: 0,
//     }
// }

// let current;

// function operate(previous,next, operator){

//     switch(operator){
//         case "+":
//             return obj.n.result = operations.add(previous,next)
//             break;
//         case "-":
//             return obj.n.result = operations.substract(previous,next)
//             break;
//         case "*":
//             return obj.n.result = operations.multiply(previous,next)
//             break;
//         case "÷":
//             return obj.n.result = operations.divide(previous,next)
//             break;
//         // case "%":
//         //     operations.percent()
//         //     break;
//     }
// }

// function handleOperationsClickEvt(){
//     // if (this.value === "%"){
//     //     obj.operator = this.value
//     //     operate(undefined, undefined, obj.operator)
//     //     bottomDisplay.textContent = obj.result
//     //     clearValues()
//     // }
//     // else {

//     // if (obj.n.previous === 0 && obj.o.previousOld !== 0){
//     if (obj.n.previous === 0){
//         obj.n.previous = obj.o.resultOld = parseFloat(bottomDisplay.textContent)    
//         obj.n.operator = this.value
//         topDisplay.textContent = obj.n.previous + obj.n.operator  
//         console.log(`1`)

//     } else if(obj.n.previous !== 0 && obj.n.next !== 0){

//         bottomDisplay.textContent = operate(obj.n.previous, obj.n.next, obj.n.operator)
//         console.log(`2`)
//         cpyObjectToOld()

//         obj.n.operator = this.value
//         topDisplay.textContent = obj.n.result + obj.n.operator 
            
//         clearValues(true,false,false)

//         console.log(`3`)
//         obj.n.previous = parseFloat(bottomDisplay.textContent)
//         obj.n.operator = this.value

//         } 
//     else {  
//         obj.n.operator = this.value
//         topDisplay.textContent = obj.n.previous + obj.n.operator
//         current = undefined
//         console.log(`4`)
//     }
// }

// function handleNumbersClickEvt(){

//     if (obj.n.operator === ''){
//         obj.n.previous += this.value
//         obj.n.previous.charAt(0) === '0' ? obj.n.previous = parseFloat([...obj.n.previous].splice(1).join('')) : obj.n.previous = parseFloat(obj.n.previous)
//         bottomDisplay.textContent = obj.n.previous
//         current = 'previous'
//     } 
//     else {
//         obj.n.next += this.value
//         obj.n.next.charAt(0) === '0' ? obj.n.next = parseFloat([...obj.n.next].splice(1).join('')) : obj.n.next = parseFloat(obj.n.next)
//         bottomDisplay.textContent = obj.n.next
//         current = 'next'
//     }
// }

// function handleEqualsEvt(){

//     if(obj.n.previous !== 0 && obj.n.next !== 0){
//         bottomDisplay.textContent = operate(obj.n.previous, obj.n.next, obj.n.operator)
//         topDisplay.textContent = `${obj.n.previous} ${obj.n.operator} ${obj.n.next} =`
//         cpyObjectToOld()
//         clearValues(true,false,false) 
//         current = undefined   
//     } else if(obj.n.previous !== 0 && obj.n.next === 0){
//         obj.o.operatorOld !== '' ? topDisplay.textContent = `${obj.o.previousOld} ${obj.o.operatorOld} ${obj.o.nextOld} =` : topDisplay.textContent = ''
//         clearValues(true,false,false) 
//         }

// }

// function handleCurrentEntryEvt(){

//     if (current === undefined){
//         clearValues(true,false,true) 
//     } else if(current === 'previous'){
//         bottomDisplay.textContent = obj.n.previous = 0
//         } else if(current === 'next'){
//         bottomDisplay.textContent = obj.n.next = 0
//             }
// }

// function handleCalcDeleteEvt(){

    
//     if(current === 'previous'){
//         obj.n.previous = obj.n.previous.toString()
//         obj.n.previous = parseInt(obj.n.previous.slice(0, obj.n.previous.length-1))
//         bottomDisplay.textContent = obj.n.previous
//     } else if(current === 'next'){
//         obj.n.next = obj.n.next.toString()
//         obj.n.next = parseFloat(obj.n.next.slice(0, obj.n.next.length-1))
//         bottomDisplay.textContent = obj.n.next
//     }
//     handleError()
// }


// function handleResetEvt(){

//     clearValues(true, true, true)
// }

// function clearValues(objNew=false, objOld=false, display=false){

//     if (objNew === true) {
//         for (let i in obj.n){
//             typeof obj.n[i] === 'number' ? obj.n[i] = 0 : typeof obj.n[i] === 'string' ? obj.n[i] = '' : obj.n[i]
//         }
//     }
//     if(objOld === true){
//         for (let i in obj.o){
//             typeof obj.o[i] === 'number' ? obj.o[i] = 0 : typeof obj.o[i] === 'string' ? obj.o[i] = '' : obj.o[i]
//         }
//     }
//     if(display === true){
//         bottomDisplay.textContent = '0'
//         topDisplay.textContent = ''
//     }
// }

// function cpyObjectToOld(){

//     obj.o.previousOld = obj.n.previous
//     obj.o.operatorOld = obj.n.operator
//     obj.o.nextOld = obj.n.next
//     obj.o.resultOld = obj.n.result
// }

// function handleError(){

//     isNaN(obj.n.previous) ? obj.n.previous = 0 : obj.n.previous
//     isNaN(obj.n.next) ? obj.n.next = 0 : obj.n.next
//     bottomDisplay.textContent === "NaN" ? bottomDisplay.textContent = '0' : bottomDisplay.textContent
// }

// deleteButton.addEventListener("click", handleCalcDeleteEvt)
// currentEntry.addEventListener("click", handleCurrentEntryEvt)
// resetCalculator.addEventListener("click", handleResetEvt)
// equals.addEventListener("click", handleEqualsEvt)
// buttonsOperations.forEach(button => button.addEventListener("click", handleOperationsClickEvt))
// buttonsNumbers.forEach(button => button.addEventListener("click", handleNumbersClickEvt))