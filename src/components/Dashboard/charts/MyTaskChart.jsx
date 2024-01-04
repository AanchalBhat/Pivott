import ReactEChart from "echarts-for-react"

export const MyTaskChart = ({ xAxis, pendingTasks, completedTasks }) => {
  const option = {
    xAxis: {
      data: xAxis,
      boundaryGap: false,
    },
    yAxis: {
      splitLine: { show: true },
      axisLabel: { show: false },
      type: 'value',
    },
    legend: {
      data: ["Pending", "Complete"],
      left: "10px",
      icon: "circle"
    },
    grid: {
      left: '20px',
      // right: 'auto',
      bottom: '2rem',
      containLabel: true
    },
    series: [
      {
        name: "Complete",       
        data: completedTasks,
        type: 'bar',
        stack: 'x',
        barWidth: '12%',
        itemStyle:{
        barBorderRadius: [0, 0],
        color:'#5C3DFB'
        }
      },
      {
        name: "Pending",
        data: pendingTasks,
        type: 'bar',
        stack: 'x',
        barWidth: '12%',
        itemStyle:{
        barBorderRadius: [50, 50, 0, 0],
        color:'#04C1FA'
        }
      }
    ]
  };
  return (
    <ReactEChart option={option}/>
  );
}

