// Format Number
export const formatNumber = (amount) => {
  if (typeof amount !== "number") {
    amount = parseFloat(amount);
  }
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });
};

// Format Data into DDMMYY
export function formatDateToDDMMYY(date) {
  const day = String(date?.getDate()).padStart(2, "0");
  const month = String(date?.getMonth() + 1).padStart(2, "0");
  const year = String(date?.getFullYear());
  return `${year}-${month}-${day}`;
}

// Format Date into String one time
export function formatTimestamp(timestamp) {
  const date = new Date(parseInt(timestamp, 10));

  // Options for formatting the date and time
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Format the date using toLocaleString with the desired options
  return date.toLocaleString("en-US", options);
}

export function convertFirebaseTimestamp(seconds, nanoseconds) {
  // Convert the seconds to milliseconds and ignore the nanoseconds for simplicity
  const milliseconds = seconds * 1000 + Math.floor(nanoseconds / 1000000);

  // Create a new Date object from the milliseconds
  const date = new Date(milliseconds);

  // Format the date (e.g., "20 Aug 2024, 10:26 AM")
  const formattedDate = date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formattedDate;
}

// Rfress Page Handler
export function refreshPage() {
  window.location.reload();
}

// Filter Data based on Search
export const filterData = (data, searchTerm, key) => {
  if (!searchTerm.trim()) {
    return data;
  }
  return data.filter((item) =>
    item[key].toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Helper function to convert string to uppercase
export const convertToUpperCase = (str) => {
  if (typeof str === "string") {
    return str.toUpperCase();
  }
  return "";
};

export const AverageCalculator = ({ wins, losses }) => {
  const totalGames = wins + losses;
  const winPercentage = (wins / totalGames) * 100;
  const lossPercentage = (losses / totalGames) * 100;

  return {
    win: winPercentage,
    loss: lossPercentage,
  };
};

export function labelToKey(label) {
  return label.toLowerCase().replace(/\s+/g, "") + "_one";
}

export function checkForDuplicates(data) {
  const idMap = {};
  for (const item of data) {
    const id = item.id;
    if (idMap[id]) {
      // Duplicate ID found
      alert(`Duplicate ID found: ${id}`);
      return false; // Optionally, return false to indicate a duplicate
    }
    idMap[id] = true;
  }
  return true; // No duplicates found
}

export function parseCurrencyToNumber(currencyString) {
  // Remove currency symbol (₹) and commas
  const cleanedValue = currencyString?.replace(/[₹,]/g, "");

  // Convert to number
  const numberValue = parseFloat(cleanedValue);

  return numberValue;
}



