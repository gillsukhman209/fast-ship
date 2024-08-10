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
    "Product",
  ];

  // Helper function to pair trades
  const pairTrades = (trades) => {
    const pairedTrades = [];
    const buyTrades = [];

    trades.forEach((trade) => {
      if (trade["B/S"] == null) {
        return;
      }
      if (trade["B/S"].trim() === "Buy") {
        buyTrades.push(trade);
      } else if (trade["B/S"].trim() === "Sell" && buyTrades.length > 0) {
        const buyTrade = buyTrades.shift(); // Get the oldest unmatched buy trade
        pairedTrades.push({
          buyTrade,
          sellTrade: trade,
        });
      }
    });

    return pairedTrades;
  };

  // Calculate profit/loss for paired trades
  const calculateProfitLoss = (buyTrade, sellTrade) => {
    const buyPrice = parseFloat(buyTrade["Avg Fill Price"]);
    const sellPrice = parseFloat(sellTrade["Avg Fill Price"]);
    const quantity = parseFloat(buyTrade["Filled Qty"]);

    if (isNaN(buyPrice) || isNaN(sellPrice) || isNaN(quantity)) {
      return "Invalid data";
    }
    let profitLoss = 0;

    if (buyTrade["Product"] === sellTrade["Product"]) {
      if (buyTrade["Product"] === "MNQ") {
        const points = sellPrice - buyPrice;
        profitLoss = (points / 50) * quantity * 100;
      } else if (buyTrade["Product"] === "NQ") {
        const points = sellPrice - buyPrice;
        profitLoss = (points / 5) * quantity * 100;
      }
    }

    return profitLoss.toFixed(2);
  };

  const pairedTrades = pairTrades(trades);

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
            {pairedTrades.map((pair, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-4 py-2 border-t border-gray-300">
                  {pair.buyTrade.Timestamp} - {pair.sellTrade.Timestamp}
                </td>
                <td className="px-4 py-2 border-t border-gray-300">Buy/Sell</td>
                <td className="px-4 py-2 border-t border-gray-300">
                  {pair.buyTrade.Type}
                </td>
                <td className="px-4 py-2 border-t border-gray-300">
                  {pair.buyTrade["Filled Qty"]}
                </td>
                <td className="px-4 py-2 border-t border-gray-300">
                  {pair.buyTrade["Avg Fill Price"]} /{" "}
                  {pair.sellTrade["Avg Fill Price"]}
                </td>
                <td className="px-4 py-2 border-t border-gray-300">
                  {calculateProfitLoss(pair.buyTrade, pair.sellTrade)}
                </td>
                <td className="px-4 py-2 border-t border-gray-300">
                  {pair.buyTrade.Product}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
