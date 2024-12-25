"use client";

import { useState, useEffect } from "react";
import { ArrowsRightLeftIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface ExchangeRates {
  USD: number;
  EUR: number;
  GBP: number;
}

export default function CurrencyConverter() {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
        if (!API_KEY) {
          throw new Error("Exchange rate API key is not configured");
        }
        
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/INR`
        );
        const data = await response.json();
        
        // Convert rates to INR base
        setRates({
          USD: 1 / data.conversion_rates.USD,
          EUR: 1 / data.conversion_rates.EUR,
          GBP: 1 / data.conversion_rates.GBP,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch exchange rates");
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const convertToINR = (amount: number, currency: string): string => {
    if (!rates || !rates[currency as keyof ExchangeRates]) return "0";
    return (amount * rates[currency as keyof ExchangeRates]).toFixed(2);
  };

  if (loading) {
    return (
      <div className="p-6 rounded-xl bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-[0_0_25px_rgba(15,23,42,0.3)]">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-slate-800/40 backdrop-blur-md border border-slate-700/50">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-[0_0_25px_rgba(15,23,42,0.3)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-left"
      >
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ArrowsRightLeftIcon className="h-6 w-6 text-blue-400" />
          Currency Converter
        </h2>
        <ChevronDownIcon 
          className={`h-6 w-6 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      
      {isOpen && (
        <div className="p-6 pt-0">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="flex-1 px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <p className="text-sm text-slate-400">Amount in INR</p>
                <p className="text-xl font-semibold text-white">
                  ₹{amount ? convertToINR(parseFloat(amount), fromCurrency) : "0.00"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <p className="text-sm text-slate-400">Exchange Rate</p>
                <p className="text-xl font-semibold text-white">
                  1 {fromCurrency} = ₹{rates ? rates[fromCurrency as keyof ExchangeRates].toFixed(2) : "0.00"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <p className="text-sm text-slate-400">Last Updated</p>
                <p className="text-xl font-semibold text-white">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 