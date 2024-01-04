
import Box from "@mui/material/Box";
import CreateBoards from "../../components/Pipeline/CreateBoards"


export default function PipelineBoard(props) {
    return (
      <Box sx={{ display: 'flex' }}>
        <Box component="main" className="ma-board-main" sx={{ flexGrow: 1, p: 0 }}>
          <CreateBoards 
          data ={props}
          />
        </Box>
      </Box>
    );
  }