import React from 'react';
import Box from '@mui/material/Box';
const DashboardComponent = React.lazy(() => import("../components/Dashboard/Dashboard"));


const Dashboard = () => {
  return (
    <>
      <Box container>
        <DashboardComponent />
      </Box>

    </>
  )
}

export default Dashboard
