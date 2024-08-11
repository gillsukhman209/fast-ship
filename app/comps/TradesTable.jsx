import React from "react";

export default function TradesTable({ trades }) {
  if (!trades.length) {
    return (
      <p className="text-center text-gray-500 my-4">No trades available.</p>
    );
  }

  // Function to sort trades by fill time (Timestamp)
  const sortTradesByTime = (trades) => {
    return trades
      .slice()
      .sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
  };

  // Sort trades
  const sortedTrades = sortTradesByTime(trades);

  const columns = [
    "Time",
    "B/S",
    "Type",
    "Filled Qty",
    "Avg Fill Price",
    "Profit/Loss",
    "Product",
  ];

  const pairTrades = (sortedTrades) => {
    const pairedTrades = [];
    let currentBuyTrade = null;

    sortedTrades.forEach((trade) => {
      if (trade["B/S"] == null) {
        return;
      }
      if (trade["B/S"].trim() === "Buy") {
        if (currentBuyTrade) {
          // If there's already a buy trade, add the quantities
          currentBuyTrade["Filled Qty"] =
            parseFloat(currentBuyTrade["Filled Qty"]) +
            parseFloat(trade["Filled Qty"]);
          // Recalculate average fill price
          currentBuyTrade["Avg Fill Price"] =
            (parseFloat(currentBuyTrade["Avg Fill Price"]) *
              parseFloat(currentBuyTrade["Filled Qty"]) +
              parseFloat(trade["Avg Fill Price"]) *
                parseFloat(trade["Filled Qty"])) /
            (parseFloat(currentBuyTrade["Filled Qty"]) +
              parseFloat(trade["Filled Qty"]));
        } else {
          // If it's the first buy trade, set it as the current buy trade
          currentBuyTrade = { ...trade };
        }
      } else if (trade["B/S"].trim() === "Sell" && currentBuyTrade) {
        // When we encounter a sell trade, pair it with the current buy trade
        pairedTrades.push({
          buyTrade: currentBuyTrade,
          sellTrade: trade,
        });
        currentBuyTrade = null; // Reset the current buy trade
      }
    });

    // Handle any remaining buy trades
    // buyTrades.forEach((buyTrade) => {
    //   pairedTrades.push({
    //     buyTrade,
    //     sellTrade: null,
    //   });
    // });

    // sortedTrades.forEach((trade) => {
    //   if (trade["B/S"] == null) {
    //     return;
    //   }
    //   if (trade["B/S"].trim() === "Buy") {
    //     buyTrades.push(trade);
    //   } else if (trade["B/S"].trim() === "Sell" && buyTrades.length > 0) {
    //     const buyTrade = buyTrades.shift(); // Get the oldest unmatched buy trade
    //     pairedTrades.push({
    //       buyTrade,
    //       sellTrade: trade,
    //     });
    //   }
    // });

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

  const pairedTrades = pairTrades(sortedTrades);

  // Function to extract time from timestamp
  const extractTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
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
            {pairedTrades.map((pair, index) => (
              <tr
                key={`pair-${index}`}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-4 py-2 border-t border-gray-300" colSpan={7}>
                  <div className="font-semibold">Trade Pair {index + 1}</div>
                  <div>
                    Buy: {extractTime(pair.buyTrade.Timestamp)} -{" "}
                    {pair.buyTrade["Avg Fill Price"]}
                  </div>
                  <div>
                    Sell: {extractTime(pair.sellTrade.Timestamp)} -{" "}
                    {pair.sellTrade["Avg Fill Price"]}
                  </div>
                  <div>
                    Profit/Loss: $
                    {calculateProfitLoss(pair.buyTrade, pair.sellTrade)}
                  </div>
                </td>
              </tr>
            ))}
            {sortedTrades.map((trade, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-4 py-2 border-t border-gray-300">
                  {extractTime(trade.Timestamp)}
                </td>
                <td className="px-4 py-2 border-t border-gray-300">
                  {trade["B/S"]}
                </td>
                <td className="px-4 py-2 border-t border-gray-300">
                  {trade["Type"]}
                </td>
                <td className="px-4 py-2 border-t border-gray-300">
                  {trade["Filled Qty"]}
                </td>
                <td className="px-4 py-2 border-t border-gray-300">
                  {trade["Avg Fill Price"]} / {trade["Avg Fill Price"]}
                </td>
                <td className="px-4 py-2 border-t border-gray-300">
                  {/* {calculateProfitLoss(trade, trade)} */}
                </td>
                <td className="px-4 py-2 border-t border-gray-300">
                  {trade.Product}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
