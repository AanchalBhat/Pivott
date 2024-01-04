
import Box from "@mui/material/Box";
import CreatePotential from "../../components/Potential/CreatePotential"

export default function Create() {
    return (
      <Box sx={{ display: 'flex' }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <CreatePotential/>
        </Box>
      </Box>
    );
  }