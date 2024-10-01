import { Sector } from "recharts";

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

export const AverageCalculator = ({ wins, losses }) => {
  const totalGames = wins + losses;
  const winPercentage = (wins / totalGames) * 100;
  const lossPercentage = (losses / totalGames) * 100;

  return {
    win: winPercentage,
    loss: lossPercentage,
  };
};

// Render Pie Custom Design
export const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.label}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#fff"
        fontSize={16}
      >{`${value} Trade`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
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
