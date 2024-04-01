const buttonsNumbers = document.querySelectorAll(".calcButtons button.number")
const buttonsOperations = document.querySelectorAll(".calcButtons button.operation")
const deleteButton = document.querySelector(".calcButtons button.delete")
const currentEntry = document.querySelector(".calcButtons button.ce")
const resetCalculator = document.querySelector(".calcButtons button.reset")
const equals = document.querySelector(".calcButtons button.equals")
const topDisplay = document.querySelector(".display .top")
const bottomDisplay = document.querySelector(".display .bottom")

const operations = {
    add: (a,b) => obj.n.result = bottomDisplay.textContent = a+b,
    substract: (a,b) => obj.n.result = bottomDisplay.textContent = a-b,
    divide: (a,b) => obj.n.result = bottomDisplay.textContent = a/b,
    multiply: (a,b) => obj.n.result = bottomDisplay.textContent = a*b,
    // percent: () => obj.result = parseInt(bottomDisplay.textContent)/100,
}
const obj = {
    o: {previousOld: 0,
        operatorOld: '',
        nextOld: 0,
        resultOld: 0,
    },
    n:{ previous: 0,
        operator: '',
        next: 0,
        result: 0,
    }
}
// const obj = {
//     previous: 0,
//     operator: '',
//     next: 0,
//     result: 0,
// }

// const objOld = {
//     previousOld: 0,
//     operatorOld: '',
//     nextOld: 0,
//     resultOld: 0,
// }

let current;

function operate(previous,next, operator){

    obj.n.previous = parseFloat(previous)
    obj.n.next = parseFloat(next)

    switch(operator){
        case "+":
            operations.add(obj.n.previous,obj.n.next)
            break;
        case "-":
            operations.substract(obj.n.previous,obj.n.next)
            break;
        case "*":
            operations.multiply(obj.n.previous,obj.n.next)
            break;
        case "÷":
            operations.divide(obj.n.previous,obj.n.next)
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

    // if (obj.n.previous === 0 && obj.o.previousOld !== 0){
    if (obj.n.previous === 0){
        obj.n.previous = obj.o.resultOld = bottomDisplay.textContent    
        obj.n.operator = this.value
        topDisplay.textContent = obj.n.previous + obj.n.operator  
        console.log(`1`)

    } else if(obj.n.previous !== 0 && obj.n.next !== 0){

        operate(obj.n.previous, obj.n.next, obj.n.operator)
        console.log(`2`)
        cpyObjectToOld()

        obj.n.operator = this.value
        topDisplay.textContent = obj.n.result + obj.n.operator 
            
        clearValues()
        console.log(`3`)
        obj.n.previous = bottomDisplay.textContent
        obj.n.operator = this.value

        } 
    else {  
        obj.n.operator = this.value
        topDisplay.textContent = obj.n.previous + obj.n.operator
        current = undefined
        console.log(`4`)
    }
}

function handleNumbersClickEvt(){

    if (obj.n.operator === ''){
        obj.n.previous += this.value
        obj.n.previous.charAt(0) === '0' ? obj.n.previous = [...obj.n.previous].splice(1).join('') : obj.n.previous
        bottomDisplay.textContent = obj.n.previous
        current = 'previous'
    } 
    else {
        obj.n.next += this.value
        obj.n.next.charAt(0) === '0' ? obj.n.next = [...obj.n.next].splice(1).join('') : obj.n.next
        bottomDisplay.textContent = obj.n.next
        current = 'next'
    }
}

function handleEqualsEvt(){

    if(obj.n.previous !== 0 && obj.n.next !== 0){
        operate(obj.n.previous, obj.n.next, obj.n.operator)
        topDisplay.textContent = `${obj.n.previous} ${obj.n.operator} ${obj.n.next} =`
        cpyObjectToOld()
        clearValues()    
    } else if(obj.n.previous !== 0 && obj.n.next === 0){
        topDisplay.textContent = `${obj.o.previousOld} ${obj.o.operatorOld} ${obj.o.nextOld} =`
        clearValues()
        }
}

function handleCurrentEntryEvt(){

    if (current === undefined){
        clearValues()
        obj.n.result = ''
        bottomDisplay.textContent = '0'
        topDisplay.textContent = ''
    } else if(current === 'previous'){
        bottomDisplay.textContent = obj.n.previous = 0
        } else if(current === 'next'){
        bottomDisplay.textContent = obj.n.next = 0
            }
}

function handleCalcDeleteEvt(){

    if(current === 'previous'){
        obj.n.previous = obj.n.previous.slice(0, obj.n.previous.length-1)
        bottomDisplay.textContent = obj.previous
    } else if(current === 'next'){
        obj.n.next = obj.n.next.slice(0, obj.n.next.length-1)
        bottomDisplay.textContent = obj.n.next
    }
}

function handleResetEvt(){

    clearValues()
    obj.n.result = ''
    bottomDisplay.textContent = '0'
    topDisplay.textContent = ''
}

function clearValues(){

    obj.n.previous=0
    obj.n.next=0
    obj.n.operator = ''
    obj.n.result = 0
    current = undefined
}

function cpyObjectToOld(){

    obj.o.previousOld = obj.n.previous
    obj.o.operatorOld = obj.n.operator
    obj.o.nextOld = obj.n.next
    obj.o.resultOld = obj.n.result
}

deleteButton.addEventListener("click", handleCalcDeleteEvt)
currentEntry.addEventListener("click", handleCurrentEntryEvt)
resetCalculator.addEventListener("click", handleResetEvt)
equals.addEventListener("click", handleEqualsEvt)
buttonsOperations.forEach(button => button.addEventListener("click", handleOperationsClickEvt))
buttonsNumbers.forEach(button => button.addEventListener("click", handleNumbersClickEvt))

// function handleOperationsClickEvt(){

//     if(this.value === "="){
//         if(values.previous !== 0 && values.next !== 0){
//             operate(values.previous, values.next, values.operator)
//             topDisplay.textContent = `${values.previous} ${values.operator} ${values.next} =`

//             objOld.previousOld = values.previous
//             objOld.operatorOld = values.operator
//             objOld.nextOld = values.next
//             objOld.resultOld = values.result

//             clearValues()
//         } else {
//             if(values.previous !== 0 && values.next === 0){
//                 topDisplay.textContent = `${objOld.previousOld} ${objOld.operatorOld} ${objOld.nextOld} =`
    
//                 // objOld.previousOld = values.previous
//                 // objOld.operatorOld = values.operator
//                 // objOld.nextOld = values.next
//                 // objOld.resultOld = values.result
    
//                 clearValues()
//             }
//         }
//     } else if (this.value === "%"){
//         values.operator = this.value
//         operate(undefined, undefined, values.operator)
//         bottomDisplay.textContent = values.result
//         clearValues()
//     }

//     else {
//         if (values.previous === 0 && objOld.previous !== 0){
//             values.previous = objOld.previousOld = bottomDisplay.textContent   
//         }

//         if(values.previous !== 0 && values.next !== 0){
//             operate(values.previous, values.next, values.operator)

//             objOld.operatorOld = values.operator
//             objOld.previousOld = values.previous
//             objOld.operatorOld = values.operator
//             objOld.nextOld = values.next
//             objOld.resultOld = values.result

//             values.operator = this.value
//             topDisplay.textContent = values.result + values.operator

 
            
//             clearValues()
//             console.log(`first`)
//             values.previous = bottomDisplay.textContent
//             values.operator = this.value

//         } else {
//             values.operator = this.value
//             topDisplay.textContent = values.previous + values.operator
//             current = undefined
//             console.log(`sec`)
//             }

//         }
// }








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


