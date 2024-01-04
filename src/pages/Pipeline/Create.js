
import Box from "@mui/material/Box";
import CreatePipeline from "../../components/Pipeline/CreatePipeline"


export default function Create() {
    return (
      <Box sx={{ display: 'flex' }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <CreatePipeline/>
        </Box>
      </Box>
    );
  }