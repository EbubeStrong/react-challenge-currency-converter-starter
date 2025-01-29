import { useEffect, useState } from "react";

export default function App() {
  const [currencyAmount, setCurrencyAmount] = useState(1);
  const [currencyResult, setCurrencyResult] = useState(0);

  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");

  useEffect(() => {
    const langSearch = async () => {
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

    langSearch();
  }, [currencyAmount, fromCurrency, toCurrency]); // ✅ Only runs on mount

  function handleCurrencyAmount(e) {
    // setCurrencyAmount(!Number(e.target.value) ? 0 : Number(e.target.value));
    const value = Number(e.target.value);
    setCurrencyAmount(value > 0 ? value : 0);
  }

  function handleFromCurrency(e) {
    setFromCurrency(e.target.value);
  }

  function handleToCurrency(e) {
    setToCurrency(e.target.value);
  }

  return (
    <div>
      <Input value={currencyAmount} onHandleAmount={handleCurrencyAmount} />
      <CurrencyExchange value={fromCurrency} onChange={handleFromCurrency} />
      <CurrencyExchange value={toCurrency} onChange={handleToCurrency} />
      <Result value={currencyResult.toFixed(2)} currencyUnit={toCurrency} />
    </div>
  );
}

function Input({ value, onHandleAmount }) {
  return <input type="text" value={value} onChange={onHandleAmount} />;
}

function CurrencyExchange({ value, onChange }) {
  return (
    <select value={value} onChange={onChange}>
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="CAD">CAD</option>
      <option value="INR">INR</option>
    </select>
  );
}

function Result({ value, currencyUnit }) {
  return (
    <p>
      Converted Amount {!value ? "Loading..." : value} {currencyUnit}
    </p>
  );
}
