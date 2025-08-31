// Function to transform keys (remove underscores and convert to uppercase)
const transformKeys = (obj) => {
  const transformedObj = {};
  for (const key in obj) {
    const newKey = key.replace(/_/g, " ").toUpperCase(); // Replace underscores and convert to uppercase
    transformedObj[newKey] = obj[key];
  }
  return transformedObj;
};

// Function to convert JSON data to CSV
const convertToCSV = (data) => {
  if (!data || !data.length) {
    return "";
  }

  const csvRows = [];

  // Transform the data
  const transformedData = data.map(transformKeys);

  // Get headers (keys of the transformed JSON objects)
  const headers = Object.keys(transformedData[0]);
  csvRows.push(headers.join(",")); // Join headers with commas

  // Loop over rows
  transformedData.forEach((row) => {
    const values = headers.map((header) => {
      const escape = ("" + row[header]).replace(/"/g, '\\"'); // Escape quotes
      return `"${escape}"`; // Wrap values in quotes
    });
    csvRows.push(values.join(",")); // Join values with commas
  });

  return csvRows.join("\n"); // Combine rows with newlines
};

// Function to trigger CSV download
const downloadCSV = (csvData, filename) => {
  const blob = new Blob([csvData], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Click handler for the export button
export const handleExport = (data, filename) => {
  if (!data || !data.length) {
    console.error("No data provided for export!");
    return;
  }

  const csvData = convertToCSV(data);
  downloadCSV(csvData, filename);
};
