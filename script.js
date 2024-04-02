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
    oldV: { previous: '',
            operator: '',
            nextOld: '',
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
            return newV.result = operations.add(previous,next)
        case "-":
            return newV.result = operations.substract(previous,next)
        case "*":
            return newV.result = operations.multiply(previous,next)
        case "÷":
            return newV.result = operations.divide(previous,next)
        // case "%":
        //     operations.percent()
        //     break;
        default:
            return
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
    console.log(newV)
    if (newV.operator === ''){
        console.log(this.value)
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

    if(objNew === true) {
        for (let i in obj.newV){
            // typeof obj.newV[i] === 'number' ? obj.newV[i] = '' : typeof obj.newV[i] === 'string' ? obj.newV[i] = '' : obj.newV[i]
            obj.newV[i] = ''
        }
    }
    if(objOld === true){
        for (let i in obj.oldV){
            // typeof obj.oldV[i] === 'number' ? obj.oldV[i] = '' : typeof obj.oldV[i] === 'string' ? obj.oldV[i] = '' : obj.oldV[i]
            obj.oldV[i] = ''
        }
    }
    if(display === true){
        bottomDisplay.textContent = '0'
        topDisplay.textContent = ''
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