import React from 'react';
import { LineChartComponent } from '../../../../../components/Dashboard/charts/LineChartComponent';
import "@testing-library/jest-dom";
import { render, screen } from '@testing-library/react';
 
jest.mock('echarts-for-react')
  
describe('LineChartComponent', () => {
  it('should render a line chart', () => {
    const lastSixMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const wonData = [10, 20, 30, 40, 50, 60, 70];
    const lostData = [5, 10, 15, 20, 25, 30, 35];
    const wrapper = render(<LineChartComponent lastSixMonth={lastSixMonth} wonData={wonData} lostData={lostData} />);
  });
});



