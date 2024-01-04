import { useContext, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Switch from "@mui/material/Switch";
import "./Structure.css";
import { makeStyles } from "@mui/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { styled } from "@mui/material/styles";
import SendEmailPopup from "../../../../pages/common/SendEmailPopup";
import { CircularLoader } from "../../../../pages/common/CircularLoader";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../../../context";
import RecipientMore from "./RecipientMore";

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    background: "#2c42b5",
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&:before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&:after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
    background: "white",
  },
  "& .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track": {
    background: "#2c42b5 !important",
    opacity: "2 !important",
  },
}));

const useStyles = makeStyles({
  createCampaignGrid: {
    width: "100%",
    maxWidth: "100vw",
  },
  createCampaignTextField: {
    width: "100%",
    maxWidth: "470px",
  },
  createCampaignCardHolder: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "20px",
  },
  createCampaignCards: {
    width: "100%",
    height: "100%",
    minWidth: "210px",
    maxHeight: "210px",
    padding: "30px 15px 20px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    borderRadius: "4px",
    border: "1px solid var(--ma-lightgray-color)",
    background: "var(--ma-white-color)",
    textAlign: "center",
    cursor: "pointer",
  },
  sendEmailText: {
    color: "#2C42B5",
    fontSize: "14px !important",
    marginTop: "14px !important",
    fontWeight: "500 !important",
    cursor: "pointer",
  },
  emailContent: {
    padding: "16px 42px",
    overflow: "hidden",
  },
  svgIcon: {
    width: "64px !important",
    height: "64px !important",
    color: "var(--ma-secondarytext-color)",
  },
  typographyHeading: {
    color: "var(--ma-primarymain-color)",
    textAlign: "center",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
  },
  emailContentBody: {
    color: "var(--ma-gray-color)",
    textAlign: "center",
    fontSize: "12px !important",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
  },
});

const Scheduled = ({ overviewData, loader }) => {
  const classes = useStyles();
  let today = new Date();
  let minutes = today.getMinutes();
  minutes = minutes <= 9 ? "0" + minutes : minutes;
  const [openPopup, setOpenPopup] = useState(false);
  const navigate = useNavigate();
  const { setToPreviewData } = useContext(DataContext);
  const [recipientEmail, setReceipentEmail] = useState([]);

  const handlePreview = () => {
    setToPreviewData((prev) => ({
      ...prev,
      content_html: overviewData.content_html,
      content_json: overviewData.content_json,
    }));
    navigate(`/campaign/preview`);
  };

  useEffect(() => {
    recipientContactData();
  }, [overviewData]);

  const recipientContactData = () => {
    const recipientContact =
      overviewData?.recipients_contacts &&
      overviewData?.recipients_contacts.map((contact) => contact.email);
    setReceipentEmail(recipientContact);
  };
  const recipients_contacts = overviewData?.recipients_contacts
    ? overviewData?.recipients_contacts
    : [];
  const recipients_modules = overviewData?.recipients_modules
    ? overviewData?.recipients_modules
    : [];

  const handleSendEmail = (e) => {
    e.preventDefault();
    setOpenPopup(true);
  };
  const handleClose = () => {
    setOpenPopup(false);
  };

  return (
    <div>
      <Paper
        className="ma-campignShadow-hide"
        sx={{ boxShadow: "none", borderRadius: "0px" }}
      >
        {loader ? (
          <CircularLoader />
        ) : (
          <div className="ma-campaignMain-form">
            <Box>
              <Typography variant="h6" className="campaigns-detailstxt my-4">
                Details
              </Typography>
            </Box>
            <Box className="create-campaign-container">
              <Grid container spacing={2} xs={12} md={12} lg={12}>
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={12}
                  className={classes.createCampaignGrid}
                >
                  <label className="campaigns-labeltxt">Campaign Name</label>
                  <h6 className="campaigns-field_Text">
                    {overviewData?.name ? overviewData?.name : "N/A"}
                  </h6>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={12}
                  sx={{ position: "relative" }}
                  className={classes.createCampaignGrid}
                >
                  <span className="campaigns-labeltxt ">Recipients</span>
                  <h6 className="campaigns-field_Text">
                    <RecipientMore
                      recipients_contacts={recipients_contacts}
                      recipients_modules={recipients_modules}
                      recipientEmail={recipientEmail}
                    />
                  </h6>
                </Grid>
              </Grid>
            </Box>

            <Box className="create-campaign-container">
              <Box>
                <Typography variant="h6" className="campaigns-detailstxt my-4">
                  From
                </Typography>
              </Box>
              <Grid container spacing={2} xs={12} md={12} lg={12}>
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={6}
                  className={classes.createCampaignGrid}
                >
                  <label className="campaigns-labeltxt ">Sender Name</label>
                  <h6 className="campaigns-field_Text">
                    {overviewData?.sender_name
                      ? overviewData?.sender_name
                      : "N/A"}
                  </h6>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  className={classes.createCampaignGrid}
                >
                  <label className="campaigns-labeltxt ">Sender Email</label>
                  <h6 className="campaigns-field_Text">
                    {overviewData?.sender_email
                      ? overviewData?.sender_email
                      : "N/A"}
                  </h6>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  className={classes.createCampaignGrid}
                >
                  <label className="campaigns-labeltxt ">
                    Reply-to-Address
                  </label>
                  <h6 className="campaigns-field_Text">
                    {overviewData?.reply_to_address
                      ? overviewData?.reply_to_address
                      : "N/A"}
                  </h6>
                </Grid>
              </Grid>
            </Box>

            <Box className="create-campaign-container">
              <Box>
                <Typography variant="h6" className="campaigns-detailstxt my-4">
                  Subject
                </Typography>
              </Box>
              <Grid container spacing={2} xs={12} md={12} lg={12}>
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={10}
                  className={classes.createCampaignGrid}
                >
                  <label className="campaigns-labeltxt ">Subject</label>
                  <h6 className="campaigns-field_Text">
                    {overviewData?.subject ? overviewData?.subject : "N/A"}
                  </h6>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={10}
                  className={classes.createCampaignGrid}
                >
                  <label className="campaigns-labeltxt ">Preview Text</label>
                  <h6 className="campaigns-field_Text">
                    {overviewData?.preview_text
                      ? overviewData?.preview_text
                      : "N/A"}
                  </h6>
                </Grid>
              </Grid>
            </Box>

            <Box className="create-campaign-container">
              {overviewData?.content_html && (
                <>
                  <Box>
                    <Typography
                      variant="h6"
                      className="campaigns-detailstxt my-4"
                    >
                      Email Content
                    </Typography>
                  </Box>
                  <Grid container spacing={2} xs={6} md={6} lg={6}>
                    <Grid
                      item
                      xs={6}
                      md={6}
                      lg={4}
                      className={classes.createCampaignCardHolder}
                    >
                      <Box className={classes.template_img_holder}>
                        <div className="content">
                          <div className="content-overlay"></div>
                          <div className="content-image">
                            <img src={overviewData?.preview_image?.url} alt="template-preview" />
                          </div>
                          <div className="content-details fadeIn-bottom fadeIn-left">
                            <div
                              onClick={() => handlePreview()}
                              className="campaign-preview-btn"
                            >
                              <span>
                                <VisibilityIcon />{" "}
                              </span>
                              <p>Preview</p>
                            </div>
                          </div>
                        </div>
                      </Box>
                    </Grid>
                  </Grid>
                </>
              )}
              {overviewData?.content_html && (
                <>
                  <Box>
                    <Typography
                      onClick={(e) => handleSendEmail(e)}
                      className={classes.sendEmailText}
                    >
                      Send Test Email
                    </Typography>
                  </Box>
                  <SendEmailPopup
                    preview_text={overviewData?.preview_text}
                    reply_to_address={overviewData?.reply_to_address}
                    subject={overviewData?.subject}
                    content={overviewData?.content_html}
                    open={openPopup}
                    handelClose={handleClose}
                  />
                </>
              )}
            </Box>

            <Box className="create-campaign-container">
              <Box>
                <Typography variant="h6" className="campaigns-detailstxt my-4">
                  Sending Time
                </Typography>
              </Box>
              <Grid container spacing={2} xs={12} md={12} lg={6}>
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={12}
                  className={classes.createCampaignGrid}
                >
                  <label className="campaigns-labeltxt ">Send Options</label>
                  <TextField
                    className={`${classes.createCampaignTextField} placeholder_field`}
                    fullWidth
                    id="demo-mutiple-checkbox"
                    name="sending_option"
                    disabled
                    placeholder="Schedule for later"
                    inputProps={{ "aria-label": "With label" }}
                    sx={{ background: "#E8E8ED" }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={12}
                  className={classes.createCampaignGrid}
                >
                  <label className="campaigns-labeltxt ">Time zone</label>
                  <TextField
                    className={`${classes.createCampaignTextField} placeholder_field`}
                    fullWidth
                    id="demo-mutiple-checkbox"
                    name="time_zone"
                    disabled
                    placeholder="Time Zone"
                    value={overviewData?.timezone}
                    inputProps={{ "aria-label": "With label" }}
                    sx={{ background: "#E8E8ED" }}
                  />
                </Grid>
                <>
                  <Grid item xs={6} md={6} lg={4}>
                    <label className="campaigns-labeltxt ">Date</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        disablePast
                        disabled
                        value={overviewData?.send_date}
                        open={false}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            sx={{ background: "#E8E8ED" }}
                            fullWidth
                            name=""
                            onKeyDown={(e) => e.preventDefault()}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={6} md={6} lg={4}>
                    <label className="campaigns-labeltxt ">Time</label>
                    <TextField
                      name="send_time"
                      size="medium"
                      id="send_time"
                      placeholder="Dec 30, 2022"
                      className="duedate_textfield w-100"
                      type="time"
                      disabled
                      value={overviewData?.send_time}
                      sx={{ background: "#E8E8ED" }}
                      onChange={() => { }}
                    ></TextField>
                  </Grid>
                </>
              </Grid>
            </Box>

            <Box className="create-campaign-container">
              <Box>
                <Typography variant="h6" className="campaigns-detailstxt my-4">
                  Engagement
                </Typography>
              </Box>
              <Grid className="my-1" item xs={6} md={6} lg={6}>
                <Android12Switch
                  checked={overviewData?.track_opening_emails}
                  disabled
                />
                <label className="">Track opening emails</label>
              </Grid>
              <Grid className="my-1" item xs={6} md={6} lg={6}>
                <Android12Switch
                  checked={overviewData?.track_click_links_in_emails}
                  disabled
                />
                <label className="">Track clicking links in emails</label>
              </Grid>
            </Box>
          </div>
        )}
      </Paper>
    </div>
  );
};
export default Scheduled;
