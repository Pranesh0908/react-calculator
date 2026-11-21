import { useState } from "react";

const keys = [
  ["AC", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "⌫", "="]
];

function calculate(first, second, operator) {
  const a = Number(first);
  const b = Number(second);

  switch (operator) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷": return b === 0 ? "Cannot divide by zero" : a / b;
    default: return b;
  }
}

export default function App() {
  const [display, setDisplay] = useState("0");
  const [previous, setPrevious] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForNumber, setWaitingForNumber] = useState(false);

  function inputDigit(digit) {
    if (display === "Error" || display === "Cannot divide by zero") {
      setDisplay(digit);
      setWaitingForNumber(false);
      return;
    }
    if (waitingForNumber) {
      setDisplay(digit);
      setWaitingForNumber(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  }

  function inputDecimal() {
    if (waitingForNumber) {
      setDisplay("0.");
      setWaitingForNumber(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }

  function chooseOperator(nextOperator) {
    if (operator && !waitingForNumber) {
      const result = calculate(previous, display, operator);
      if (typeof result === "string") {
        setDisplay("Error");
        setPrevious(null);
        setOperator(null);
        setWaitingForNumber(true);
        return;
      }
      const formatted = String(Number(result.toPrecision(12)));
      setDisplay(formatted);
      setPrevious(formatted);
    } else {
      setPrevious(display);
    }
    setOperator(nextOperator);
    setWaitingForNumber(true);
  }

  function performEquals() {
    if (!operator || previous === null) return;
    const result = calculate(previous, display, operator);
    if (typeof result === "string") {
      setDisplay("Error");
    } else {
      setDisplay(String(Number(result.toPrecision(12))));
    }
    setPrevious(null);
    setOperator(null);
    setWaitingForNumber(true);
  }

  function handleKey(key) {
    if (/^\d$/.test(key)) return inputDigit(key);
    if (key === ".") return inputDecimal();
    if (key === "AC") {
      setDisplay("0");
      setPrevious(null);
      setOperator(null);
      setWaitingForNumber(false);
      return;
    }
    if (key === "⌫") {
      if (waitingForNumber || display.length <= 1 || display === "Error") {
        setDisplay("0");
      } else {
        setDisplay(display.slice(0, -1));
      }
      return;
    }
    if (key === "±") {
      if (display !== "0" && display !== "Error") {
        setDisplay(String(Number(display) * -1));
      }
      return;
    }
    if (key === "%") {
      if (display !== "Error") setDisplay(String(Number(display) / 100));
      return;
    }
    if (["+", "−", "×", "÷"].includes(key)) return chooseOperator(key);
    if (key === "=") return performEquals();
  }

  return (
    <main className="page">
      <section className="calculator" aria-label="Calculator">
        <header className="topbar">
          <div className="brand-mark">C</div>
          <span>CALCULATOR</span>
          <span className="live-dot" aria-label="Ready" />
        </header>

        <div className="display" aria-live="polite">
          <div className="expression">
            {previous !== null && operator ? `${previous} ${operator}` : " "}
          </div>
          <div className="result">{display}</div>
        </div>

        <div className="keypad">
          {keys.flat().map((key) => (
            <button
              key={key}
              type="button"
              className={[
                "key",
                ["÷", "×", "−", "+"].includes(key) ? "operator" : "",
                key === "=" ? "equals" : "",
                ["AC", "±", "%", "⌫"].includes(key) ? "utility" : "",
                key === "0" ? "zero" : ""
              ].join(" ")}
              onClick={() => handleKey(key)}
              aria-label={key === "⌫" ? "Backspace" : key}
            >
              {key}
            </button>
          ))}
        </div>
        <footer>Simple calculations, made easy.</footer>
      </section>
    </main>
  );
}
