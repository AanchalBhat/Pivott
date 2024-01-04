import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Popover from "@mui/material/Popover";
import "./sendemail.css";
import { Avatar, Box, Typography } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import Autocomplete from "@mui/material/Autocomplete";
import { ReactTrixRTEInput, ReactTrixRTEToolbar } from "react-trix-rte";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import MinimizeIcon from "@mui/icons-material/Minimize";
import MaximizeIcon from "@mui/icons-material/Maximize";
import { Collapse, Grid } from "@mui/material";
import { userApi } from "../../apis/userApi";
import debouce from "lodash.debounce";
import { ButtonLoader } from "./ButtonLoader";
import { getMethodError } from "../../constants/errorMessages";
import { Toaster } from "./Toaster";
import Trix from "trix"; // Please do not remove Trix as it is a dependency for the attachment URL.

export const SentEmail = ({
  toEmail,
  emailSubject,
  isCc,
  isBcc,
  emailBody,
  emailBcc,
  emailCc,
  setEmailCc,
  setEmailBcc,
  // usersEmail,
  setIsCc,
  setIsBcc,
  setEmailBody,
  handleAttachment,
  handleSubject,
  handleClose,
  handleEmailSubmit,
  maxSize,
  subjectErr,
  bodyErr,
  setBodyErr,
  setMaxSize,
  expanded,
  setExpanded,
  openMail,
  loading,
}) => {
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [srchUser, setSrchUser] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleChange = (event, newValue) => {
    let strippedString = newValue.replace(/(<([^>]+)>)/gi, "");
    let editorData = strippedString.replace(/nbsp;/g, "").trim();
    if (editorData?.length === 0) {
      setBodyErr("Email body can't be empty");
    } else {
      setBodyErr("");
    }
    setEmailBody(editorData);
  };

  const handleFileAttachment = (e) => {
    if (e?.attachment?.attachment) {
      const temp = {
        name: e.attachment.attachment.file.name,
        attachment: e.attachment.attachment.file,
      };
      handleAttachment(temp, "add");
    }
  };

  const handleAttachmentRemove = (e) => {
    handleAttachment(e?.attachment?.file.name, "remove");
  };

  useEffect(() => {
    if (!srchUser && openMail) {
      getLeadOwnerData();
    }
  }, [srchUser, openMail]);

  const getLeadOwnerData = (srchQuery) => {
    userApi
      .getUsers(srchQuery)
      .then((data) => {
        setUserLoading(true);
        if (data?.data) {
          setUsers(data?.data);
          setUserLoading(false);
        } else {
          setUsers([]);
          setUserLoading(false);
        }
      })
      .catch((error) => {
        setUserLoading(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const debounceSaveUser = React.useCallback(
    debouce(function (e) {
      if (e) {
        getLeadOwnerData(e);
      }
    }, 800),
    []
  );
  const getContactData = (event, newValue) => {
    if (newValue) {
      setSrchUser(true);
    } else {
      setSrchUser(false);
    }
    if (event?.type !== undefined && event?.type !== "click") {
      setUserLoading(true);
      debounceSaveUser(newValue);
    }
  };

  const handleCc = () => {
    setIsCc(true);
  };

  const handleBcc = () => {
    setIsBcc(true);
  };

  const tools = [
    "bold",
    "italic",
    "link",
    "heading1",
    "code",
    "number",
    "outdent",
    "indent",
    "attachFiles",
    "undo",
    "redo",
    // "bullet"
  ];

  const CcAutocomplete = () => {
    return (
      <Autocomplete
        className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-wb57ya-MuiFormControl-root-MuiTextField-root"
        fullWidth
        multiple
        id="send to"
        loading={userLoading}
        data-testid="cc_email"
        // options={usersEmail}
        options={users}
        onChange={(event, newValue) => {
          setEmailCc(newValue);
        }}
        value={emailCc}
        filterOptions={(users) => users}
        getOptionLabel={(option) => option?.attributes?.email}
        onInputChange={(event, newInputValue) => {
          getContactData(event, newInputValue);
        }}
        renderOption={(props, option, { selected }) => {
          return (
            <li {...props}>
              <Box display={"flex"} flexDirection={"row"}>
                <Avatar size={"22"} variant={"circular"} />
                <Box display={"flex"} ml={3} flexDirection={"column"}>
                  <Typography color={"text.primary"}>
                    {option?.attributes?.first_name +
                      " " +
                      option?.attributes?.last_name}
                  </Typography>
                  <Typography color={"text.secondary"}>
                    {option?.attributes?.email}
                  </Typography>
                </Box>
              </Box>
              <hr />
              &nbsp;
            </li>
          );
        }}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              variant="standard"
              className="w-100 h-100"
              InputProps={{
                ...params.InputProps,
                disableUnderline: !isBcc ? false : true,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      {isCc && "Cc"}
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{ cursor: "pointer" }}
                    onClick={handleBcc}
                  >
                    {!isBcc && "Bcc"}
                  </InputAdornment>
                ),
              }}
            />
          );
        }}
      />
    );
  };

  const BccAutocomplete = () => {
    return (
      <Autocomplete
        className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-wb57ya-MuiFormControl-root-MuiTextField-root"
        fullWidth
        multiple
        id="send to"
        // options={usersEmail}
        loading={userLoading}
        options={users}
        filterOptions={(users) => users}
        onChange={(event, newValue) => {
          setEmailBcc(newValue);
        }}
        value={emailBcc}
        getOptionLabel={(option) => option?.attributes?.email}
        onInputChange={(event, newInputValue) => {
          getContactData(event, newInputValue);
        }}
        disableClearable
        renderOption={(props, option, { selected }) => {
          return (
            <li {...props}>
              <Box display={"flex"} flexDirection={"row"}>
                <Avatar size={"22"} variant={"circular"} />
                <Box display={"flex"} ml={3} flexDirection={"column"}>
                  <Typography color={"text.primary"}>
                    {option?.attributes?.first_name +
                      " " +
                      option?.attributes?.last_name}
                  </Typography>
                  <Typography color={"text.secondary"}>
                    {option?.attributes?.email}
                  </Typography>
                </Box>
              </Box>
              <hr />
              &nbsp;
            </li>
          );
        }}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              variant="standard"
              className="w-100 h-100"
              InputProps={{
                ...params.InputProps,
                "data-testid": "bcc_email",
                disableUnderline: isCc || !isCc ? false : true,
                startAdornment: (
                  <>
                    <InputAdornment position="start" sx={{ cursor: "pointer" }}>
                      Bcc
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{ cursor: "pointer" }}
                    onClick={handleCc}
                  >
                    {!isCc && "Cc"}
                  </InputAdornment>
                ),
              }}
            />
          );
        }}
      />
    );
  };

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      <Grid item xs={12} md={12}>
        <Box className="ma-sendBox-mail" data-testid="new_message">
          <Popover
            className={`${
              !maxSize ? "ma-mailPopup-size" : "ma-mailPopupMaxSize"
            } ${!expanded ? "ma-expandPosition" : ""}`}
            open={openMail}
            onClose={handleClose}
          >
            <div>
              <div className="ma-sMail-title">
                <h6>New Message</h6>
                <div className="ma-allBtn-mail">
                  <span
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    {expanded ? <MinimizeIcon /> : <MaximizeIcon />}
                  </span>
                  <span style={{ cursor: "pointer" }}>
                    {maxSize === true ? (
                      <CloseFullscreenIcon onClick={() => setMaxSize(false)} />
                    ) : (
                      <OpenInFullIcon onClick={() => setMaxSize(true)} />
                    )}
                  </span>
                  <span onClick={handleClose}>
                    <CloseIcon />
                  </span>
                </div>
              </div>
            </div>
            <Collapse in={expanded} timeout="auto">
              <div>
                <div className="ma-emailMain-sec">
                  <div className="ma-sendFromto-mail">
                    <TextField
                      className="w-100"
                      variant="standard"
                      data-testid="to_email"
                      value={toEmail}
                      InputProps={{
                        disableUnderline: isCc || isBcc ? true : false,
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{ cursor: "pointer" }}
                          >
                            To
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <>
                            <InputAdornment
                              position="end"
                              sx={{ cursor: "pointer" }}
                              onClick={handleCc}
                            >
                              {!isCc && !isBcc && "Cc"}
                            </InputAdornment>
                            <InputAdornment
                              position="end"
                              sx={{ cursor: "pointer" }}
                              onClick={handleBcc}
                            >
                              {!isBcc && !isCc && "Bcc"}
                            </InputAdornment>
                          </>
                        ),
                      }}
                    />
                    {isCc && CcAutocomplete()}
                    {isBcc && BccAutocomplete()}
                  </div>
                  <div className="ma-Subject-mail">
                    <TextField
                      variant="standard"
                      value={emailSubject}
                      onChange={handleSubject}
                      placeholder="Subject"
                      data-testid="subject"
                      className="w-100 h-100"
                      helperText={
                        <span className="ma-error">{subjectErr}</span>
                      }
                    />
                  </div>
                  <div className="ma-textArea-mail py-3 px-1">
                    <ReactTrixRTEInput
                      defaultValue={emailBody}
                      toolbarId="react-trix-rte-editor"
                      onChange={handleChange}
                      onAttachmentAdd={handleFileAttachment}
                      onAttachmentRemove={handleAttachmentRemove}
                      multiple
                    />
                    <span className="ma-error">{bodyErr}</span>
                  </div>
                  <div className="ma-mailSend-btn p-3 d-flex">
                    <ButtonLoader
                      loading={loading}
                      classStyle={"ma-Send-btn sendbtn-padding"}
                      handleClick={() => handleEmailSubmit()}
                      testid={"send"}
                      title={"Send"}
                    />
                    <span className="toolbox">
                      <ReactTrixRTEToolbar
                        toolbarActions={tools}
                        toolbarId="react-trix-rte-editor"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </Collapse>
          </Popover>
        </Box>
      </Grid>
    </Grid>
  );
};
