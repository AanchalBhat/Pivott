
import Box from "@mui/material/Box";
import CreateDeals from "../../components/Deals/CreateDeals"


export default function Create() {
    return (
      <Box sx={{ display: 'flex' }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <CreateDeals/>
        </Box>
      </Box>
    );
  }