import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [currencyAmount, setCurrencyAmount] = useState(1);
  const [currencyResult, setCurrencyResult] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");

  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (currencyAmount <= 0) return;

      try {
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${currencyAmount}&from=${fromCurrency}&to=${toCurrency}`
        );

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        setCurrencyResult(data.rates[toCurrency]);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    fetchExchangeRate();
  }, [currencyAmount, fromCurrency, toCurrency]);

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Currency Converter</h1>
        <Input value={currencyAmount} onHandleAmount={(e) => setCurrencyAmount(Math.max(0, Number(e.target.value)))} />
        <div className="exchange-container">
          <CurrencyExchange value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} />
          <span className="arrow">→</span>
          <CurrencyExchange value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} />
        </div>
        <Result value={currencyResult.toFixed(2)} currencyUnit={toCurrency} />
      </div>
    </div>
  );
}

function Input({ value, onHandleAmount }) {
  return (
    <input
      type="number"
      value={value}
      onChange={onHandleAmount}
      className="input-field"
    />
  );
}

function CurrencyExchange({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="select-box"
    >
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="CAD">CAD</option>
      <option value="INR">INR</option>
    </select>
  );
}

function Result({ value, currencyUnit }) {
  return (
    <p className="result">
      Converted Amount: {value} {currencyUnit}
    </p>
  );
}
