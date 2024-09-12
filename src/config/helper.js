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
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
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
