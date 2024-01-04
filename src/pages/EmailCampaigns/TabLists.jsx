import { useState, useContext } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import OverviewTab from "../common/OverviewTab";
import AddIcon from "@mui/icons-material/Add";
import { DataContext } from "../../context";

const TabLists = (props) => {
  const navigate = useNavigate();
  const { setToPreviewData } = useContext(DataContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const butonopen = Boolean(anchorEl);
  const handleOpenform = () => {
    setAnchorEl(null);
    setToPreviewData({});
    localStorage.removeItem("campaign_data");
    navigate("/campaign/create");
  };
  const navigationData = [
    {
      handleClick: () => navigate(`/campaign/lists`),
      title: "Email Campaigns",
      listItemIconTxt: "lists",
    },
    {
      handleClick: () => navigate(`/campaign/templates`),
      title: "My Templates",
      listItemIconTxt: "templates",
    },
    {
      handleClick: () => navigate(`/campaign/drafts`),
      title: "Drafts",
      listItemIconTxt: "drafts",
    },
    {
      handleClick: () => navigate(`/campaign/archive`),
      title: "Archived",
      listItemIconTxt: "archive",
    },
  ];
  return (
    <Box>
      <Card
        variant="outlined"
        className="ma-leads-box border-0 overflow-visible"
      >
        <Box>
          <div className="tobNavigation ma-overview-heading">
            <div className="border-0">
              <Typography className="createlead-heading p-0 border-0">
                Email Campaign
              </Typography>
            </div>
            <div>
              <Button
                className="CreateLeadButton"
                id="demo-customized-button"
                aria-controls={butonopen ? "demo-customized-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={butonopen ? "true" : undefined}
                variant="contained"
                disableElevation
                onClick={handleOpenform}
                startIcon={<AddIcon />}
              >
                Email Campaigns
              </Button>
            </div>
          </div>
          <CardContent className="p-0 border-0 mr-2">
            <OverviewTab navigationData={navigationData} />
            {/* <Box className="ma-Divider-bar">
              <Button className="d-none">
                <MoreHorizIcon />
              </Button>
            </Box> */}
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
};

export default TabLists;
