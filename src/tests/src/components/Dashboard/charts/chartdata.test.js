import { data } from "../../../../../components/Dashboard/chartdata";

test('data constant contains the correct lineChartData and myTaskData', () => {
  expect(data).toHaveProperty('lineChartData');
  expect(data).toHaveProperty('myTaskData');

  expect(data.lineChartData).toEqual([
    {
      name: 'Jan',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Feb',
      uv: 3000,
      pv: 1398, 
      amt: 2210,
    },
    {
      name: 'Mar',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'April',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'May',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
  ]);

  expect(data.myTaskData).toEqual([
    {
      name: 'S',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'M',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'T',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'W',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'T',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'S',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ]);
});
