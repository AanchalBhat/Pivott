import ReactEChart from "echarts-for-react"

export const LineChartComponent = ({ lastSixMonth, wonData, lostData }) => {
  var colorPalette = ['#31aead', '#e5757e'];
  const eChartsOption = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: lastSixMonth
    },
    yAxis: {
      splitLine: { show: true },
      axisLabel: { show: false },
      type: 'value',
    },
    legend: {
      data: ["Won", "Lost"],
      left: "10px",
      icon: "circle"
    },
    grid: {
      left: '18px',
      bottom: '2rem',
      containLabel: true
    },
    series: [
      {
        name: "Won",
        data: wonData,
        type: 'line'
      },
      {
        name: "Lost",
        data: lostData,
        type: 'line'
      }
    ],
    color: colorPalette,
  };

  return (
    <ReactEChart option={eChartsOption} />
  );
}

