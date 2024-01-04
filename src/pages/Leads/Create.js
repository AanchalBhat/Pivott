import React from "react";
import Box from "@mui/material/Box";
import CreateLeads from '../../components/Leads/CreateLeads';

export default function Create() {
  return (
    <>
    <Box sx={{ display: 'flex' }}>
    {/* <AppsBar /> */}
      <Box component="main" className="" sx={{ flexGrow: 1}}>
        <CreateLeads/>     
      </Box>
    </Box>
    </>
  );
}

