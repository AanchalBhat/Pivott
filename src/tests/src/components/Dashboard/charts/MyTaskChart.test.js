import React from 'react';
import { render } from '@testing-library/react';
import { MyTaskChart } from '../../../../../components/Dashboard/charts/MyTaskChart';

jest.mock('echarts-for-react')
test('renders MyTaskChart component', () => {
  const xAxis = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const pendingTasks = [10, 20, 15, 30, 25];
  const completedTasks = [20, 10, 5, 15, 30];

  const { getByText } = render(
    <MyTaskChart
      xAxis={xAxis}
      pendingTasks={pendingTasks}
      completedTasks={completedTasks}
    />
    
  );
});
