import "./notFound.css";
import { notFoundImage } from "../../assets";
import Stack from "@mui/material/Stack";

const NotFound = ({ value, showImage=true }) => {
  return (
    <Stack
      className="noLeadFound"
      height="100%"
      alignItems="center"
      justifyContent="center"
    >
      <div className="notFound">
        {showImage && (<div className="notFoundImageHolder">
          <img src={notFoundImage} className="notFoundImage" alt="not-found" />
        </div>)}
        <h5
          className="text-center"
          style={{ paddingBottom: 50, color: "#191A47" }}
        >
          {value}
        </h5>
      </div>
    </Stack>
  );
};

export default NotFound;
