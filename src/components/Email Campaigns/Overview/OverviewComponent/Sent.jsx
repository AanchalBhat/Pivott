import {
  Avatar,
  Box,
  Grid,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import "./Structure.css";
import { makeStyles } from "@mui/styles";
import { EMAIL_SENDING, EMAIL_SENT } from "../../../../utils/constants";
import { CircularLoader } from "../../../../pages/common/CircularLoader";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../../../context";
import { STRING_REGEX } from "../../../../utils/regexLists";
import RecipientMore from "./RecipientMore";

const useStyles = makeStyles({
  gridContainer_1: {
    margin: "30px 0px 15px",
  },
  template_img_holder: {
    width: "100%",
    height: "100%",
    maxWidth: "96px",
    maxHeight: "124px",
    borderRadius: "4px",
    border: "1px solid #D1D1DA",
    background: "#FFF",
    padding: "9px 8px",
    overflow: "hidden",
  },
  template_img1: {
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },
  gridBox_1: {
    marginRight: "18px",
  },
  gridBox_2: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column !important",
  },
  detailsText_Box: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: "35px",
  },
  description: {
    color: "#191A47",
    fontSize: "14px",
    fontWeight: "400",
    lineHeight: "normal",
  },
  divider: {
    borderTop: "1px solid #e8e8ed",
    padding: "15px 0px !important",
  },
  sender_detailsText_Box: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column !important",
    lineHeight: "21px",
  },
  sender_description: {
    margin: "10px 0px",
  },
  gridContainer_delivery: {
    display: "inline-grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    width: "100%",
  },
  delivery_box: {
    padding: "34px 0px 120px",
  },
  delivery_label: {
    color: "#191A47",
    textAlign: "center",
    fontSize: "32px !important",
    fontWeight: "600 !important",
    marginBottom: "15px",
  },
  delivery_label_primary: {
    color: "#2C42B5",
  },
  delivery_description: {
    color: "#8C8DA3",
    fontSize: "14px !important",
    textAlign: "center",
    fontWeight: 400,
  },
  label: {
    color: "#8C8DA3",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
    minWidth: "150px",
  },
});

const Sent = ({ overviewData, status, loader }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setToPreviewData } = useContext(DataContext);
  const [recipientEmail, setReceipentEmail] = useState([]);

  useEffect(() => {
    recipientContactData();
  }, [overviewData]);

  const recipientContactData = () => {
    const recipientContact = overviewData?.recipients_contacts.map(
      (contact) => contact.email
    );
    setReceipentEmail(recipientContact);
  };
  const recipients_contacts = overviewData?.recipients_contacts
    ? overviewData?.recipients_contacts
    : [];
  const recipients_email = recipientEmail ? recipientEmail : [];
  const recipients_modules = overviewData?.recipients_modules
    ? overviewData?.recipients_modules
    : [];
  const combinedArray = [...recipients_modules, ...recipients_email];
  const startingTwoValues = combinedArray.slice(0, 7);
  const remainingValues = combinedArray.slice(7);
  const recipentsData = startingTwoValues.join(", ");
  const [openList, setOpenList] = useState(false);

  const handlePreview = () => {
    setToPreviewData((prev) => ({
      ...prev,
      content_html: overviewData.content_html,
      content_json: overviewData.content_json,
    }));
    navigate(`/campaign/preview`);
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
          <>
            <div className="ma-campaignMain-form">
              <Box>
                <Typography variant="h6" className="campaigns-detailstxt">
                  Details
                </Typography>
              </Box>
              <Grid
                className={classes.gridContainer_1}
                container
                xs={12}
                md={12}
                lg={12}
              >
                {overviewData?.content_html && (
                  <Grid item className={classes.gridBox_1} xs={6} md={6} lg={1}>
                    <Box className={classes.template_img_holder}>
                      {overviewData?.content_html && (
                        <div className="content">
                          <div className="content-overlay"></div>
                          <div>
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
                      )}
                    </Box>
                  </Grid>
                )}
                <Grid item className={classes.gridBox_2} xs={6} md={8} lg={10}>
                  <Box className={classes.detailsText_Box}>
                    <span className={classes.label}>
                      {status === EMAIL_SENT
                        ? "Delivered Time:"
                        : status === EMAIL_SENDING
                          ? "Sent Time:"
                          : "Cancelled Time:"}
                    </span>
                    <span className={classes.description}>
                      {status === EMAIL_SENT
                        ? overviewData?.delivered_time
                          ? overviewData?.delivered_time
                          : "N/A"
                        : status === EMAIL_SENDING
                          ? overviewData?.sending_time
                            ? overviewData?.sending_time
                            : "N/A"
                          : overviewData?.cancelled_time
                            ? overviewData?.cancelled_time
                            : "N/A"}
                    </span>
                  </Box>
                  <Box className={classes.detailsText_Box}>
                    <span className={classes.label}>Recipients:</span>
                    <RecipientMore
                      recipients_contacts={recipients_contacts}
                      recipients_modules={recipients_modules}
                      recipientEmail={recipientEmail}
                    />
                  </Box>
                  <Box className={classes.detailsText_Box}>
                    <span className={classes.label}>Subject:</span>
                    <span className={classes.description}>
                      {overviewData?.subject ? overviewData?.subject : "N/A"}
                    </span>
                  </Box>
                  <Box className={classes.detailsText_Box}>
                    <span className={classes.label}>Preview Text:</span>
                    <span className={classes.description}>
                      {overviewData?.preview_text
                        ? overviewData?.preview_text
                        : "N/A"}
                    </span>
                  </Box>
                </Grid>
              </Grid>
              <div className={classes.divider} />
              <Box>
                <Typography variant="h6" className="campaigns-detailstxt">
                  Sender Details
                </Typography>
              </Box>
              <Grid
                container
                className={classes.gridContainer_1}
                xs={12}
                md={12}
                lg={12}
              >
                <Grid
                  item
                  xs={12}
                  md={3}
                  lg={3}
                  className={classes.sender_detailsText_Box}
                >
                  <span className={`${classes.sender_label} ${classes.label}`}>
                    Name
                  </span>
                  <span
                    className={`${classes.sender_description} ${classes.description}`}
                  >
                    {overviewData?.sender_name
                      ? overviewData?.sender_name
                      : "N/A"}
                  </span>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={3}
                  lg={3}
                  className={classes.sender_detailsText_Box}
                >
                  <span className={`${classes.sender_label} ${classes.label}`}>
                    Email
                  </span>
                  <span
                    className={`${classes.sender_description} ${classes.description}`}
                  >
                    {overviewData?.sender_email
                      ? overviewData?.sender_email
                      : "N/A"}
                  </span>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={3}
                  lg={3}
                  className={classes.sender_detailsText_Box}
                >
                  <span className={`${classes.sender_label} ${classes.label}`}>
                    Reply-to address
                  </span>
                  <span
                    className={`${classes.sender_description} ${classes.description}`}
                  >
                    {overviewData?.reply_to_address
                      ? overviewData?.reply_to_address
                      : "N/A"}
                  </span>
                </Grid>
              </Grid>
              {status === EMAIL_SENT && (
                <>
                  <div className={classes.divider} />
                  <Box>
                    <Typography variant="h6" className="campaigns-detailstxt">
                      Delivery
                    </Typography>
                  </Box>
                  <Box
                    className={classes.gridContainer_delivery}
                    xs={10}
                    md={10}
                    lg={10}
                  >
                    <Box xs={2} md={2} lg={2} className={classes.delivery_box}>
                      <Typography
                        variant="h3"
                        component="h3"
                        className={`${classes.delivery_label} ${classes.delivery_label_primary}`}
                      >
                        {overviewData?.delivered ? overviewData?.delivered : 0}
                      </Typography>
                      <Typography
                        className={`${classes.delivery_description} ${classes.label}`}
                      >
                        Successfully Delivered
                      </Typography>
                    </Box>
                    <Box xs={2} md={2} lg={2} className={classes.delivery_box}>
                      <Typography
                        variant="h3"
                        component="h3"
                        className={`${classes.delivery_label}`}
                      >
                        {overviewData?.bounced ? overviewData?.bounced : 0}
                      </Typography>
                      <Typography className={`${classes.delivery_description}`}>
                        Bounced
                      </Typography>
                    </Box>
                    {overviewData?.track_click_links_in_emails  && (
                       <Box xs={2} md={2} lg={2} className={classes.delivery_box}>
                       <Typography
                         variant="h3"
                         component="h3"
                         className={`${classes.delivery_label}`}
                       >
                         {overviewData?.clicked ? overviewData?.clicked : 0}
                       </Typography>
                       <Typography className={`${classes.delivery_description}`}>
                         Clicked
                       </Typography>
                     </Box>
                    )}
                    {
                      overviewData?.track_opening_emails && (
                        <Box xs={2} md={2} lg={2} className={classes.delivery_box}>
                          <Typography
                            variant="h3"
                            component="h3"
                            className={`${classes.delivery_label}`}
                          >
                            {overviewData?.un_opened ? overviewData?.un_opened : 0}
                          </Typography>
                          <Typography className={`${classes.delivery_description}`}>
                            Unopened
                          </Typography>
                        </Box>
                      )
                    }
                    <Box xs={2} md={2} lg={2} className={classes.delivery_box}>
                      <Typography
                        variant="h3"
                        component="h3"
                        className={`${classes.delivery_label}`}
                      >
                        {overviewData?.un_subscribed
                          ? overviewData?.un_subscribed
                          : 0}
                      </Typography>
                      <Typography className={`${classes.delivery_description}`}>
                        Unsubscribed
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </div>
          </>
        )}
      </Paper>
    </div>
  );
};

export default Sent;
