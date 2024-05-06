(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const operations = {
      "+": (a, b) => a + b,
      "-": (a, b) => a - b,
      "÷": (a, b) => a / b,
      "*": (a, b) => a * b,
      "%": (a, b) => {
        const { newState } = calcState;
        b = newState.next = checkFloatLength((a * b) / 100);
        return a + b;
      },
      "x²": (num) => Math.pow(num, 2),
      "1/x": (num) => 1 / num,
    };

    const calcState = {
      oldState: { previous: "", operator: "", next: "", result: "" },
      newState: { previous: "", operator: "", next: "", result: "" },
      current: "",
    };

    const strings = {
      errorMsg: { 1: "Cannot Divide by zero" },
      errorType: { 1: "-Infinity", 2: "Infinity", 3: "NaN" },
      value: {
        1: " ",
        2: "0",
        3: "previous",
        4: "next",
        5: "",
        6: "current",
        7: "operator",
      },
      sign: { 1: "+", 2: "-", 3: "*", 4: "÷", 5: "%", 6: "x²", 7: "1/x" },
    };

    const { oldState, newState } = calcState;
    const { errorMsg, errorType, value, sign } = strings;

    function operate(previous, next, operator) {
      if (operator === sign[6] || operator === sign[7]) {
        let num = previous;
        newState.result = operations[operator](num);
      } else newState.result = operations[operator](previous, next);

      return (newState.result = checkFloatLength(newState.result));
    }

    function handleOperationsClickEvt() {
      let topDisplay = false, bottomDisplay = false;

      isDecimalEnd();

      if (isNumber(newState.previous)) {
        if (newState.next) {
          bottomDisplay = operate(newState.previous, newState.next, newState.operator);
          copyObjectToOld(oldState, newState);
          newState.operator = this.value;
          topDisplay = `${newState.result} ${newState.operator}`;

          clearValues(true);
          newState.previous = parseFloat(bottomDisplay);
          bottomDisplay = value[2];
          newState.operator = this.value;
        } else {
          newState.operator = this.value;
          topDisplay = `${newState.previous} ${newState.operator}`;
          updateCurrentState(undefined);
        }
      } else if (isNumber(oldState.result)) {
        newState.previous = oldState.result;
        newState.operator = this.value;
        topDisplay = `${newState.previous} ${newState.operator}`;
      }

      updateDisplay(topDisplay, bottomDisplay);
    }

    function handleNumbersClickButton() {
      const currentState = newState.operator === "" ? value[3] : value[4];

      newState[currentState] += this.value;

      if (newState[currentState].charAt(0) === value[2]) {
        if (newState[currentState].length >= 2)
          newState[currentState].substring(1);
      } else {
        newState[currentState];
      }

      newState[currentState] = checkFloatLength(newState[currentState]);

      updateCurrentState(currentState);
      updateDisplay(false, newState[currentState]);
    }

    function handlePercentButton() {
      const currentState = getCurrentState();
      let topDisplay = false, bottomDisplay = false, swap = newState.operator;

      newState.operator = this.value;

      if (currentState) {
        if (currentState === value[3]) {
          newState[currentState] = Number(value[2]);
          bottomDisplay = newState[currentState].toString();
          newState.operator = swap;
        } else {
          bottomDisplay = operate(
            newState.previous,
            newState[currentState],
            newState.operator
          );
          newState.operator = swap;
          topDisplay = `${newState.previous} ${newState.operator} ${newState[currentState]} =`;
          bottomDisplay = operate(newState.previous, newState[currentState], newState.operator);

          copyObjectToOld(oldState, newState);
          clearValues(true);
          updateCurrentState(undefined);
        }
      } else newState.operator = swap;

      updateDisplay(topDisplay, bottomDisplay);
    }

    function handleSquareButton() {
      const currentState = getCurrentState();
      let topDisplay = false, bottomDisplay = false, swap = newState.operator;

      if (currentState) {
        newState.operator = this.value;
        bottomDisplay = operate(newState[currentState], false, newState.operator);
        newState[currentState] = newState.result;

        newState.result = value[5];
        newState.operator = currentState === value[3] ? value[5] : swap;
      } else return;

      updateDisplay(topDisplay, bottomDisplay);
    }

    function handleReciprocalButton() {
      const currentState = getCurrentState();
      let temp, topDisplay = false, bottomDisplay = false, swap = newState.operator;

      newState.operator = this.value;

      if (currentState) {
        if (currentState === value[3]) {
          bottomDisplay = operate(newState[currentState], false, newState.operator);
          temp = newState[currentState];
          topDisplay = topDisplay = `1/(${temp}) =`;

          newState[currentState] = newState.result;
          newState.result = value[5];
          newState.operator = swap;
        } else {
          bottomDisplay = operate(newState[currentState], false, newState.operator);
          temp = newState[currentState];
          newState[currentState] = newState.result;
          newState.operator = swap;

          bottomDisplay = operate(newState.previous, newState[currentState], newState.operator);
          topDisplay = `${newState.previous} ${newState.operator} 1/(${temp}) =`;

          copyObjectToOld(oldState, newState);
          clearValues(true);
          updateCurrentState(undefined);
        }
      } else newState.operator = swap;

      updateDisplay(topDisplay, bottomDisplay);
      handleError();
    }

    const handleEqualsButton = () => {
      let topDisplay = false, bottomDisplay = false;

      isDecimalEnd();

      if (isNumber(newState.previous)) {
        if (isNumber(newState.next)) {
          bottomDisplay = operate(newState.previous, newState.next, newState.operator);
          topDisplay = `${newState.previous} ${newState.operator} ${newState.next} =`;

          copyObjectToOld(oldState, newState);
          clearValues(true);
          updateCurrentState(undefined);
        } else {
          if (newState.previous === oldState.result) {
            topDisplay = `${oldState.previous} ${oldState.operator} ${oldState.next} =`;
            bottomDisplay = `${oldState.result}`;
          } else {
            topDisplay = value[1];
          }

          clearValues(true, false, false, true);
        }
      } else return;

      updateDisplay(topDisplay, bottomDisplay);
      handleError();
    };

    const handleCurrentEntryButton = () => {
      const currentState = getCurrentState();

      if (currentState) {
        newState[currentState] = Number(value[2]);
        updateDisplay(false, value[2]);
      } else clearValues(true, true, true, true);
    };

    const handleResetButton = () => clearValues(true, true, true, true);

    const clearValues = (objNew = false, objOld = false, display = false, currentState = false) => 
    {
      objNew === true
        ? clearObj(calcState.newState, currentState)
        : calcState.newState;
      objOld === true
        ? clearObj(calcState.oldState, currentState)
        : calcState.oldState;

      if (display === true) updateDisplay(value[1], value[2]);
    };

    const clearObj = (object, currentState) => {
      Object.keys(object).forEach((key) => (object[key] = value[5]));
      if (currentState) calcState.current = value[5];
    };

    const handleCalcDeleteButton = () => {
      const currentState = getCurrentState();
      let result;

      if (currentState) {
        let temp = newState[currentState].toString();
        temp = parseFloat(temp.slice(0, temp.length - 1));
        result = newState[currentState] = temp;
      } else return;

      updateDisplay(false, result);
      handleError();
    };

    const handleDecimalButton = () => {
      const currentState = getCurrentState();

      if (currentState) {
        const isDecimal = checkDecimalPoint(currentState);
        if (!isDecimal) {
          newState[currentState] = newState[currentState]
            .toString()
            .concat(".");
          updateDisplay(false, ".", "+");
        }
      } else return;
    };

    const checkDecimalPoint = (currentState) => {
      const value = newState[currentState].toString();
      return value.includes(".");
    };

    const isDecimalEnd = () => {
      const currentState = getCurrentState();
      let result;

      if (currentState) {
        if (newState[currentState]) {
          let temp = newState[currentState].toString();
          temp = temp.charAt(temp.length - 1) === "." ? temp.concat("0") : temp;
          result = newState[currentState] = parseFloat(temp);
        }
      } else return;

      updateDisplay(false, result);
    };

    const handleError = () => {
      fixNaNOrInfinity(calcState);
      fixDisplayError(bottomDisplay);
    };

    const fixDisplayError = (display) => {
      const displayError = display.textContent;
      let displayMsg;

      switch (displayError) {
        case errorType[1]:
        case errorType[2]:
          displayMsg = errorMsg[1];
          break;
        case errorType[3]:
          displayMsg = value[2];
          break;
        default:
          return;
      }

      updateDisplay(false, displayMsg);
    };

    const fixNaNOrInfinity = (object) => {
      Object.keys(object).forEach((key) => {
        if (key !== value[6]) {
          for (let subKey in object[key]) {
            if (!isFinite(object[key][subKey]) && subKey !== value[7])
              object[key][subKey] = Number(value[2]);
          }
        }
      });
    };

    const copyObjectToOld = (oldObject, newObject) => {
      Object.keys(oldObject).forEach((key) => {
        if (newObject.hasOwnProperty(key)) oldObject[key] = newObject[key];
      });
    };

    const checkFloatLength = (element) => {
      const [array, decimalPoint] = element.toString().split(".");
      const result =
        decimalPoint !== undefined
          ? decimalPoint.length >= 8
            ? parseFloat(element).toFixed(8)
            : element
          : array;
      return parseFloat(result);
    };

    const updateDisplay = (topDisplayValue, bottomDisplayValue, operator) => {
      if (topDisplayValue) topDisplay.textContent = topDisplayValue;

      if (isNumber(bottomDisplayValue)) bottomDisplayValue = bottomDisplayValue.toString();

      if (bottomDisplayValue) {
        if (operator) {
          switch (operator) {
            case "+":
              bottomDisplay.textContent += bottomDisplayValue;
          }
        } else bottomDisplay.textContent = bottomDisplayValue;
      }
    };

    const isNumber = (number) => typeof number === "number";
    const getCurrentState = () => calcState.current;
    const updateCurrentState = (state) => (calcState.current = state);

    const buttonsNumbers = document.querySelectorAll(".calcButtons button.number");
    const buttonsOperations = document.querySelectorAll(".calcButtons button.operation");
    const topDisplay = document.querySelector(".display .top");
    const bottomDisplay = document.querySelector(".display .bottom");

    const buttonClassNames = {
      "operation square": handleSquareButton,
      "operation percent": handlePercentButton,
      "operation reciprocal": handleReciprocalButton,
      "operation decimal": handleDecimalButton,
      "operation equals": handleEqualsButton,
      "operation ce": handleCurrentEntryButton,
      "operation delete": handleCalcDeleteButton,
      "operation reset": handleResetButton,
      operation: handleOperationsClickEvt,
    };

    buttonsOperations.forEach((button) => {
      button.addEventListener("click", function (e) {
        const className = e.target.classList.value;
        if (className) buttonClassNames[className].bind(this)();
      });
    });

    buttonsNumbers.forEach((button) =>
      button.addEventListener("click", handleNumbersClickButton)
    );
  });
})();
