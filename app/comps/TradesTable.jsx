// components/TradesTable.js
import React from "react";

export default function TradesTable({ trades }) {
  if (!trades.length) {
    return (
      <p className="text-center text-gray-500 my-4">No trades available.</p>
    );
  }

  const columns = [
    "Timestamp",
    "B/S",
    "Type",
    "Filled Qty",
    "Avg Fill Price",
    "Profit/Loss",
  ];

  const calculateProfitLoss = (trade) => {
    const isBuy = trade.Type === "BUY";
    const quantity = parseFloat(trade["Filled Qty"]);
    const price = parseFloat(trade["Avg Fill Price"]);
    const referencePriceField = isBuy ? "Current Price" : "Avg Fill Price";
    const referencePrice = parseFloat(trade[referencePriceField] || price);
    const profitLoss = isBuy
      ? (referencePrice - price) * quantity
      : (price - referencePrice) * quantity;
    return profitLoss.toFixed(2);
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Detailed Trade History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((column) => (
                <th key={column} className="px-4 py-2 text-left font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                {columns.map((column) => (
                  <td
                    key={column}
                    className="px-4 py-2 border-t border-gray-300"
                  >
                    {column === "Profit/Loss"
                      ? calculateProfitLoss(trade)
                      : trade[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
