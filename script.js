const buttonsNumbers = document.querySelectorAll(".calcButtons button.number")
const buttonsOperations = document.querySelectorAll(".calcButtons button.operation")
const deleteButton = document.querySelector(".calcButtons button.delete")
const currentEntry = document.querySelector(".calcButtons button.ce")
const resetCalculator = document.querySelector(".calcButtons button.reset")
const topDisplay = document.querySelector(".display .top")
const bottomDisplay = document.querySelector(".display .bottom")

const operations = {
    add: (a,b) => values.result = bottomDisplay.textContent = a+b,
    substract: (a,b) => values.result = bottomDisplay.textContent = a-b,
    divide: (a,b) => values.result = bottomDisplay.textContent = a/b,
    multiply: (a,b) => values.result = bottomDisplay.textContent = a*b,
    percent: () => values.result = parseInt(bottomDisplay.textContent)/100,
}

const values = {
    previous: 0,
    next: 0,
    result: 0,
    operator: ''
}

let current;

function operate(previous,next, operator){

    values.previous = parseInt(previous)
    values.next = parseInt(next)

    switch(operator){
        case "+":
            operations.add(values.previous,values.next)
            break;
        case "-":
            operations.substract(values.previous,values.next)
            break;
        case "*":
            operations.multiply(values.previous,values.next)
            break;
        case "÷":
            operations.divide(values.previous,values.next)
            break;
        case "%":
            operations.percent()
            break;
    }
}

function clearValues(){
    values.previous=0
    values.next=0
    values.operator = ''
    current = undefined
}



function handleCurrentEntryEvt(){
    if (current === undefined){
        clearValues()
        values.result = ''
        bottomDisplay.textContent = '0'
        topDisplay.textContent = ''
    } else if(current === 'previous'){
        bottomDisplay.textContent = values.previous = 0
    } else if(current === 'next'){
        bottomDisplay.textContent = values.next = 0
    }
}

function handleResetEvt(){
    clearValues()
    values.result = ''
    bottomDisplay.textContent = '0'
    topDisplay.textContent = ''
}

function handleNumbersClickEvt(){

    if (values.operator === ''){
        values.previous += this.value
        values.previous.charAt(0) === '0' ? values.previous = [...values.previous].splice(1).join('') : values.previous
        bottomDisplay.textContent = values.previous
        current = 'previous'

    } else {
        values.next += this.value
        values.next.charAt(0) === '0' ? values.next = [...values.next].splice(1).join('') : values.next
        bottomDisplay.textContent = values.next
        current = 'next'
        }

    // if (values.operator === ''){
    //     values.previous += this.value

    //     if(values.previous.charAt(0) === '0'){
    //         values.previous = [...values.previous].splice(1).join('')
    //     }

    //     bottomDisplay.textContent = values.previous

    // } else {
    //     values.next += this.value
        
    //     if(values.next.charAt(0) === '0'){
    //         values.next = [...values.next].splice(1).join('')
    //     }

    //     bottomDisplay.textContent = values.next
    //     }
}

function handleOperationsClickEvt(){

    if(this.value === "="){
        if(values.previous !== 0 && values.next !== 0){
            operate(values.previous, values.next, values.operator)
            topDisplay.textContent = `${values.previous} ${values.operator} ${values.next} =`
            clearValues()
        }
    } else {
        if (values.previous === 0){
            values.previous = bottomDisplay.textContent   
        }

        if(values.previous !== 0 && values.next !== 0){
            operate(values.previous, values.next, values.operator)

            values.operator = this.value
            topDisplay.textContent = values.result + values.operator

            clearValues()

            values.previous = bottomDisplay.textContent
            values.operator = this.value

        } else {
            values.operator = this.value
            topDisplay.textContent = values.previous + values.operator
            current = undefined
            }

        }
}

function handleCalcDeleteEvt(){
    if(current === 'previous'){
        values.previous = values.previous.slice(0, values.previous.length-1)
        bottomDisplay.textContent = values.previous
    } else if(current === 'next'){
        values.next = values.next.slice(0, values.next.length-1)
        bottomDisplay.textContent = values.next
    }
}

deleteButton.addEventListener("click", handleCalcDeleteEvt)
currentEntry.addEventListener("click", handleCurrentEntryEvt)
resetCalculator.addEventListener("click", handleResetEvt)
buttonsOperations.forEach(button => button.addEventListener("click", handleOperationsClickEvt))
buttonsNumbers.forEach(button => button.addEventListener("click", handleNumbersClickEvt))

// buttons.forEach((button) =>{

//     button.addEventListener("click", function(evt){

//         if(this.classList.contains("number")){ 
//             if (values.operator === ''){
//                 values.previous += this.value
//                 if(values.previous.charAt(0) === '0'){
//                     values.previous = [...values.previous].splice(1).join('')
//                 }
//                 bottomDisplay.textContent = values.previous
//             } else { 
//                 values.next += this.value
//                 if(values.next.charAt(0) === '0'){
//                     values.next = [...values.next].splice(1).join('')
//                 }
//                 bottomDisplay.textContent = values.next
//             }
//         }

//         if(this.classList.contains("operation")){

//                 if(this.value === "="){
//                     if(values.previous !== 0 && values.next !== 0){
//                         operate(values.previous, values.next, values.operator)
//                         topDisplay.textContent = `${values.previous} ${values.operator} ${values.next} =`
//                         clearValues()
//                     }
//                 } else {

//                     if (values.previous === 0){
//                         values.previous = bottomDisplay.textContent   
//                     }

//                     if(values.previous !== 0 && values.next !== 0){
//                         operate(values.previous, values.next, values.operator)

//                         values.operator = this.value
//                         topDisplay.textContent = values.result + values.operator

//                         clearValues()

//                         values.previous = bottomDisplay.textContent
//                         values.operator = this.value

//                      } else{
                    
//                         values.operator = this.value
//                         topDisplay.textContent = values.previous + values.operator
//                      }


//                 }
//         }
//     })
// })








//old

// const buttons = document.querySelectorAll(".calcButtons button")
// const topDisplay = document.querySelector(".display .top")
// const bottomDisplay = document.querySelector(".display .bottom")

// const operations = {
//     add: (a,b) => result = bottomDisplay.textContent = a+b,
//     substract: (a,b) => result = bottomDisplay.textContent = a-b,
//     divide: (a,b) => result = bottomDisplay.textContent = a/b,
//     multiply: (a,b) => result = bottomDisplay.textContent = a*b,
//     // percent: () => result = parseInt(bottomDisplay.textContent)/100,
// }

// const values = {
//     a: 0,
//     b: 0,
//     temp: 0,
//     result: 0,
//     operator: ''
// }

// let a = 0
// let b = 0
// let temp = 0
// let result = 0
// let operator = ''

// function operate(a,b, operator){
//     a = parseInt(a)
//     b = parseInt(b)

//     switch(operator){
//         case "+":
//             operations.add(a,b)
//             break;
//         case "-":
//             operations.substract(a,b)
//             break;
//         case "*":
//             operations.multiply(a,b)
//             break;
//         case "÷":
//             operations.divide(a,b)
//             break;
//     //     case "%":
//     //         operations.percent()
//     //         break;
//     }
// }

// function clearValues(){
//     a=0
//     b=0
//     temp=0
//     operator = ''
    
// }

// buttons.forEach(function(button){

//     button.addEventListener("click", function(evt){

//         if(this.classList.contains("number")){ 
//             if (operator === ''){
//                 a += this.value
//                 if(a.charAt(0) === '0'){
//                     a = [...a].splice(1).join('')
//                 }
//                 bottomDisplay.textContent = a
//             } else { 
//                 b += this.value
//                 if(b.charAt(0) === '0'){
//                     b = [...b].splice(1).join('')
//                 }
//                 bottomDisplay.textContent = b
//             }
//         }

//         if(this.classList.contains("operation")){

//                 if(this.value === "="){
//                     if(a !== 0 && b !== 0){
//                         operate(a,b, operator)
//                         if(temp !== 0){
//                             b=temp
//                         }
//                         topDisplay.textContent = `${a} ${operator} ${b} =`
//                         clearValues()
//                     }
//                 } else {

//                     if (a === 0){
//                         a = bottomDisplay.textContent   
//                     }

//                     if(a !== 0 && b !== 0){
//                         temp = b
//                         operate(a,b, operator)
//                         operator = this.value
//                         topDisplay.textContent = result + operator

//                         clearValues()
//                         a = bottomDisplay.textContent
//                         operator = this.value

//                      } else{
                    
//                     operator = this.value
//                     topDisplay.textContent = a + operator
//                      }


//                 }
//         }
//     })
// })


