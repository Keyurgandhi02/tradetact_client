import React from "react";

// Helper function to check if a day is a weekend (Saturday/Sunday)
const isWeekend = (year, month, day) => {
  const date = new Date(year, month, day);
  const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
  return dayOfWeek === 0 || dayOfWeek === 6;
};

// Main Calendar component to create a grid
const CalendarMonth = ({ year, monthName, month, trades, modalHandler }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get total days in the month
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"]; // Weekdays (excluding weekends)

  // Render each day in the grid, skipping weekends
  const days = [];
  for (let day = 1; day <= 31; day++) {
    if (day <= daysInMonth && !isWeekend(year, month, day)) {
      // Find all trades for the current day
      const tradesForDay = trades.filter(
        (trade) => new Date(trade.buyDate).getDate() === day
      );

      // Calculate the total profit/loss for the day
      const totalProfitLoss = tradesForDay.reduce(
        (acc, trade) => acc + parseFloat(trade.profitLossPrice || 0),
        0
      );

      // Determine the dot color based on the aggregated profit/loss
      const dotColor =
        totalProfitLoss > 25000
          ? "bg-green-500" // Dark green for profit > 25000
          : totalProfitLoss > 0 && totalProfitLoss <= 25000
          ? "bg-green-300" // Light green for profit between 0 and 25000
          : totalProfitLoss < 0 && totalProfitLoss >= -25000
          ? "bg-red-300" // Light red for loss between 0 and -25000
          : totalProfitLoss < -25000
          ? "bg-red-500" // Dark red for loss < -25000
          : ""; // No color for 0 profit/loss

      days.push(
        <div
          key={day}
          className="flex justify-center items-center h-8 border-[0.6px] border-gray-500 rounded-md "
        >
          {tradesForDay.length > 0 ? (
            <span
              onClick={() => modalHandler(true, tradesForDay)}
              className={`inline-block w-3 h-3 rounded-full cursor-pointer ${dotColor}`}
            />
          ) : (
            <span className="text-black-dark-400 dark:text-whiten">{day}</span>
          )}
        </div>
      );
    } else {
      days.push(
        <div
          key={day}
          className="flex justify-center items-center h-8 border-[0.6px] border-gray-500 text-gray-500 rounded-md"
        >
          {day <= daysInMonth ? day : null}
        </div>
      );
    }
  }

  return (
    <div className="p-4 border-[0.6px] border-gray-500 shadow-soft-xl rounded-sm bg-clip-border">
      <h3 className="text-base sm:text-xl font-bold text-black-dark-400 dark:text-whiten mb-4 text-center">
        {`${monthName} ${year}`}
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {weekdays.map((weekday) => (
          <div
            key={weekday}
            className="flex justify-center items-center h-8 text-black-dark-400 dark:text-whiten font-semibold text-xs sm:text-sm"
          >
            {weekday}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
};

export default CalendarMonth;
