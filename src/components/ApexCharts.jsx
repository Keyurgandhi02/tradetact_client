import React from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = ({ series, categories }) => {
  const options = {
    chart: {
      height: 450,
      type: "line",
      foreColor: "#fff",
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: "datetime",
      categories: categories,
    },
    tooltip: {
      x: {
        format: "dd/MM/yy",
      },
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height={450}
    />
  );
};

export default ApexChart;
