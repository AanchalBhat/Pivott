import { useNavigate } from "react-router-dom";
import { Paper } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TemplateImage1 from "../../assets/template_img1.svg";
import TemplateImage2 from "../../assets/template_img2.svg";
import TemplateImage3 from "../../assets/template_img3.svg";
import "./../../styles/custom/StartCampaign.css"
import { useContext } from "react";
import { DataContext } from "../../context";
import { campaignApi } from "../../apis/campaignApi";
import { restMethodError } from "../../constants/errorMessages";
import { Toaster } from "../../pages/common/Toaster";


const StartCampaign = () => {

  const navigate = useNavigate()
  const { setToPreviewData } = useContext(DataContext);

  const handleStarted = () => {
    startCampagin();
    setToPreviewData({});
    localStorage.removeItem("campaign_data");
    navigate("/campaign/create");
  }

  const startCampagin = () => {
    campaignApi.startCampaign()
      .then((res) => {
        const userData = JSON.parse(localStorage.getItem('user_info')) || {};
        userData.is_campaign_started = res.status;
        localStorage.setItem('user_info', JSON.stringify(userData));
      })
      .catch((error) => {
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  }

  return (
    <Box className="ma-leads-box" sx={{ display: "flex" }}>
      <Box
        component="main"
        className="ma-mainTop-box ma-overview-main"
        sx={{ flexGrow: 1 }}
      >
        <Paper elevation={2} className={"ma-mainShadow-box createlead-page"}>
          <Grid Container xs={12} lg={12} md={12} display="flex" justifyContent="center" alignItems="center"
            className="main_grid">
            <Grid Container xs={12} lg={12} md={12} className="grid_first">
              <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                <Typography className="new_btn">New</Typography>
                <Typography className="header_txt">Send and Automate Email Marketing Campaign</Typography>
                <Typography className="header_sub_txt">Send and Automate Email Marketing Campaign</Typography>
                <Button className="get_start_btn flex_class"
                  variant="outlined"
                  onClick={() => handleStarted()}
                >
                  Get Started for Free
                </Button>
              </Box>
            </Grid>
            <Grid Container xs={10} lg={10} md={10}
              className="grid_two flex_class"
            >
              <Grid item sx={12} lg={4} md={4}>
                <Box className="image_col flex_class">
                  <Box className="template_img_holder">
                    <img className="template_img" src={TemplateImage1} alt="template-image" />
                  </Box>
                  <Typography className="template_subheading">
                    Create Stunning Emails
                  </Typography>
                  <Typography className="template_para flex_class">
                    <span>Choose from hundreds of</span>
                    <span>Email template and customize it</span>
                    <span>as per your needs</span>
                  </Typography>
                </Box>
              </Grid>
              <Grid item sx={12} lg={4} md={4}>
                <Box className="image_col flex_class">
                  <Box className="template_img_holder">
                    <img className="template_img" src={TemplateImage2} alt="template-image" />
                  </Box>
                  <Typography className="template_subheading">
                    Foster Your Contacts
                  </Typography>
                  <Typography className="template_para flex_class">
                    <span>Choose from hundreds of</span>
                    <span>Email template and customize it</span>
                    <span>as per your needs</span>
                  </Typography>
                </Box>
              </Grid>
              <Grid item sx={12} lg={4} md={4}>
                <Box className="image_col flex_class">
                  <Box className="template_img_holder">
                    <img className="template_img" src={TemplateImage3} alt="template-image" />
                  </Box>
                  <Typography className="template_subheading">
                    Boost Campaign Performance
                  </Typography>
                  <Typography className="template_para flex_class">
                    <span>Choose from hundreds of</span>
                    <span>Email template and customize it</span>
                    <span>as per your needs</span>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};
export default StartCampaign;
