import { useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import PopupHeader from "./PopupHeader";
// import global css
import "../../styles/global/common.css";
import { ReactMultiEmail } from "react-multi-email";
import { DataContext } from "../../context";
import { campaignApi } from "../../apis/campaignApi";
import { Toaster } from "./Toaster";
import { restMethodError } from "../../constants/errorMessages";
import { Button, DialogActions } from "@mui/material";
import { ButtonLoader } from "./ButtonLoader";

const SendEmailPopup = ({
  preview_text,
  reply_to_address,
  subject,
  open,
  handelClose,
  content,
}) => {
  const { toPreviewData } = useContext(DataContext);
  const [emailList, setEmailList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (emailList.length > 0) {
      setErrorMsg("");
    }
  }, [emailList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailList.length < 1) {
      setErrorMsg("Email can't be empty!");
      return;
    }
    setLoader(true);
    let data = {
      emails: emailList,
      reply_to_address: reply_to_address,
      subject: subject,
      preview_text: preview_text || null,
    };
    if (content) {
      data = { ...data, content_html: content };
    } else if (toPreviewData && toPreviewData.content_html) {
      data = {
        ...data,
        content_html: toPreviewData && toPreviewData.content_html,
      };
    } else {
      data = { ...data, content_html: "" };
    }
    campaignApi
      .sendTestEmail(data)
      .then((response) => {
        Toaster.TOAST("Test email sent successfully!", "success");

        handelClose();
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        handelClose();
        Toaster.TOAST(restMethodError(error), "error");
      });
  };

  return (
    <Dialog className="ma-popup-boxHolder" open={open} onClose={handelClose}>
      <form>
        <PopupHeader label="Send Test Email" handleToCloseLT={handelClose} />
        <DialogContent>
          <div className="ma-parentLT">
            <Grid container xs={12} md={12}>
              <Grid
                item={true}
                xs={12}
                md={12}
                className={"createlead-detail-grid"}
              >
                <label className="labeltxt">
                  <span className="requreiedField">*</span>Email
                </label>
                <div className="formPopup">
                  <ReactMultiEmail
                    emails={emailList}
                    onChange={(_emails) => setEmailList(_emails)}
                    getLabel={(emails, index, removeEmail) => {
                      return (
                        <div className="roundInput" data-tag key={index}>
                          <div data-tag-item>{emails}</div>
                          <span
                            className="roundCross ms-2"
                            style={{ cursor: "pointer" }}
                            data-tag-handle
                            onClick={() => removeEmail(index)}
                          >
                            ×
                          </span>
                        </div>
                      );
                    }}
                    onKeyDown={(e) => {}}
                  />
                  {errorMsg && <span className="ma-error">{errorMsg}</span>}
                </div>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#F9F9FB", padding: "0" }}>
          <div className="popup-listMDbutton">
            <Button
              className="cancel me-3"
              data-testid="cancel-btn"
              autoFocus
              onClick={handelClose}
            >
              CANCEL
            </Button>
            <ButtonLoader
              loading={loader}
              classStyle={"applay m-0"}
              handleClick={(e) => handleSubmit(e)}
              testid={"submit-btn"}
              title={"SEND EMAIL"}
              autoFocus={true}
            />
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SendEmailPopup;
