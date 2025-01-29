import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [currencyAmount, setCurrencyAmount] = useState(1);
  const [currencyResult, setCurrencyResult] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (currencyAmount <= 0) return;

      try {
        setIsLoading(true)
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
      } finally {
  setIsLoading(false); // ✅ Ensure loading state resets
}
    };
   if (fromCurrency === toCurrency) {
  setCurrencyResult(currencyAmount);
  return;
}
    
    fetchExchangeRate();
  }, [currencyAmount, fromCurrency, toCurrency]);

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Currency Converter</h1>
        <Input value={currencyAmount} onHandleAmount={(e) => setCurrencyAmount(Math.max(0, Number(e.target.value)))} disabled={isLoading} />
        <div className="exchange-container">
          <CurrencyExchange value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} disabled={isLoading} />
          <span className="arrow">→</span>
          <CurrencyExchange value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} disabled={isLoading}/>
        </div>
        <Result value={currencyResult.toFixed(2)} currencyUnit={toCurrency} isLoading={isLoading}/>
      </div>
    </div>
  );
}

function Input({ value, onHandleAmount, disabled }) {
  return (
    <input
      type="number"
      value={value}
      onChange={onHandleAmount}
      className="input-field"
      disabled={disabled}
    />
  );
}

function CurrencyExchange({ value, onChange, disabled }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="select-box"
      disabled={disabled}
    >
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="CAD">CAD</option>
      <option value="INR">INR</option>
    </select>
  );
}

function Result({ value, currencyUnit, isLoading }) {
  return (
    <p className="result">
      {isLoading ? "Fetching rates..." : `Converted Amount: ${value} ${currencyUnit}`}
    </p>
  );
}
