import React from 'react';
import { render } from '@testing-library/react';
import { MeetingChart } from '../../../../../components/Dashboard/charts/MeetingChart';
import '@testing-library/jest-dom/extend-expect'; 

test('renders MeetingChart component', () => {
  const data = [
    { name: 'Category 1', value: 50 },
    { name: 'Category 2', value: 30 },
   
  ];

  const { getByText } = render(<MeetingChart data={data} />);

  const category1Text = getByText('Category 1');
  const category2Text = getByText('Category 2');
  expect(category1Text).toBeInTheDocument();
  expect(category2Text).toBeInTheDocument();

});
