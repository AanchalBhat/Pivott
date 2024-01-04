
import { RadialBarChart, RadialBar, Legend } from 'recharts';
import '../charts/charts.css'

const style = {
  top: '20%',
  right: '0',
  lineHeight: '50px',
  color: "#000"
};

export const MeetingChart = ({ data }) => {
  return (
    <span>
      <RadialBarChart className='ma-email-circle' width={350} height={300} cx="30%" cy="50%" innerRadius="50%" outerRadius="80%" barSize={10} data={data}>
        <RadialBar
          minAngle={15}
          background
          startAngle={0} 
          endAngle={360}
          clockWise={true}
          dataKey="value"
        />
        <Legend
          iconSize={0}
          payload={data.map(
            item => ({
              id: item.name,
              type: "circle",
              value: <span className='ma-emailchart'>{item.name}<h6 style={{ color: "#000", marginLeft:"15px"}}>{item.value}</h6></span>
            })
          )
          }
          layout="vertical"
          verticalAlign="middle"
          wrapperStyle={style} />
      </RadialBarChart>
    </span>
  );

}

