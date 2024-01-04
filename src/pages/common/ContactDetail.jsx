import React, { useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import InputAdornment from "@mui/material/InputAdornment";
import { ContactDetailsApi } from "../../apis/contactDetailApi";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Toaster } from "../../pages/common/Toaster";
import { EMAIL_REGEX, FIRSTNAME_REGEX, LASTNAME_REGEX } from "../../utils/regexLists";
import { Box } from "@mui/material";
// import global css
import "../../styles/global/common.css";
import { ButtonLoader } from "./ButtonLoader";
import { restMethodError } from "../../constants/errorMessages";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function ContactDetailForm(props) {
  const [open, setOpen] = React.useState(true);
  const [designation, setdesignation] = useState("");
  const [company_name, setcompany] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [phone_code, setPhoneCode] = useState("");
  const [email, setEmail] = useState("");
  const [last_name, setLastName] = useState("");
  const [first_name, setFirstName] = useState("");
  const [phoneFlag, setPhoneFlag] = useState(false);
  const [country_code, setCountry_code] = useState("");
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  const [companyErr, setCompanyErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [lastnmErr, setLastnmErr] = useState("");
  const [firstnmErr, setFirstnmErr] = useState("");
  const [lastFlag, setLastFlag] = useState(false);
  const [firstFlag, setFirstFlag] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
    props.setOpenModal(false);
  };
  const placeholderText = "Enter";

  const handleDesignationChange = (e) => {
    setdesignation(e.target.value);
  };
  const handleCompanyChange = (e) => {
    let val = e.target.value;
    setcompany(e.target.value);
    if (!val) {
      setCompanyErr("Company can't be empty");
    } else if (val?.length < 3 || val?.length > 75) {
      setCompanyErr("Company should be min 3 & max 75 characters");
      setIsCompany(true);
    } else {
      setCompanyErr("");
      setIsCompany(false);
    }
  };
  const handlePhoneChanges = (value, data, event, formattedValue) => {
    const countryCode = "+" + data?.dialCode;
    setPhoneNumber(formattedValue);
    setPhoneCode(countryCode);
    setCountry_code(data?.countryCode);
    let split_data = formattedValue?.split(countryCode);
    let split_no = split_data[1];
    if (data?.countryCode === "in") {
      if (split_no?.length > 11) {
        setPhoneErrorMessage("");
        setPhoneFlag(false);
      } else if (split_no?.length === 0) {
        setPhoneErrorMessage("");
        setPhoneFlag(false);
      } else {
        setPhoneErrorMessage("Please enter valid contact");
        setPhoneFlag(true);
      }
    } else {
      setPhoneErrorMessage("");
      setPhoneFlag(false);
    }
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!EMAIL_REGEX.test(e?.target?.value)) {
      setEmailErr("Please enter a valid email Id");
    } else {
      setEmailErr("");
    }
  };
  const handleLastnameChanges = (e) => {
    setLastName(e.target.value);
    if (!LASTNAME_REGEX.test(e.target.value)) {
      setLastnmErr("Please enter a valid last name");
      setLastFlag(true);
    } else {
      setLastnmErr("");
      setLastFlag(false);
    }
  };
  const handlefirst_nameChanges = (e) => {
    setFirstName(e.target.value);
    if (!FIRSTNAME_REGEX.test(e.target.value)) {
      setFirstnmErr("Please enter a valid first name");
      setFirstFlag(true);
    } else {
      setFirstnmErr("");
      setFirstFlag(false);
    }
  };

  const handleValidation = () => {
    if (!first_name) {
      setFirstnmErr("First name can't be empty");
    }
    if (!last_name) {
      setLastnmErr("Last name can't be empty");
    }
    if (!email) {
      setEmailErr("Email can't be empty");
    }
    if (!company_name) {
      setCompanyErr("Company can't be empty");
    }
    if (country_code === "in") {
      if (phone_number?.length < 11 && phone_number?.replace(phone_code, "").trim()) {
        setPhoneErrorMessage("Please enter valid contact");
        setPhoneFlag(true);
      }
    }
  };

  const handleSubmit = () => {
    handleValidation();
    let data = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone_number: phone_number?.replace(phone_code, "").trim(),
      country_code: phone_code,
      designation: designation,
      company_name: company_name,
    };
    if (
      first_name?.length !== 0 &&
      last_name?.length !== 0 &&
      email?.length !== 0 &&
      company_name?.length !== 0 &&
      emailErr === "" &&
      phoneFlag === false &&
      lastFlag === false &&
      firstFlag === false &&
      !isCompany
    ) {
      setLoading(true);
      ContactDetailsApi.create(data)
        .then((response) => {
          if (response?.data) {
            props.setFieldValue("contact_detail_id", response?.data?.id);
            props.setContactId(response?.data?.id);
            props.setVal(response?.data?.attributes?.full_name);
            props.setOpenModal(false);
            props?.handleFunction(
              [],
              response?.data?.attributes?.full_name,
              -1
            );
            Toaster.TOAST("Contact detail submitted Successfully", "success");
            setOpen(false);
          }
          setLoading(false);
        })
        .catch((error) => {
          Toaster.TOAST(restMethodError(error), "error");
          setLoading(false);
          console.log(error);
        });
    }
  };
  return (
    <div className="">
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          className="ma-contactDetail-form"
        >
          Contact Details
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} className="px-4 py-2">
            <Grid item xs={6} md={6} className={"createlead-detail-grid"}>
              <label className="labeltxt ">
                <span className="requreiedField">*</span> First Name
              </label>
              <TextField
                data-testid="firstname-input"
                className="createlead-textField placeholder_field"
                fullWidth
                placeholder={placeholderText + " first name"}
                name="first_name"
                onChange={(e) => handlefirst_nameChanges(e)}
                id="first_name"
                value={first_name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ maxLength: 50 }}
                helperText={<span className="ma-error">{firstnmErr}</span>}
              />
            </Grid>
            <Grid item xs={6} md={6} className={"createlead-detail-grid"}>
              <label className="labeltxt ">
                <span className="requreiedField">*</span>Last Name
              </label>
              <TextField
                data-testid="lastname-input"
                className="createlead-textField placeholder_field"
                fullWidth
                id="last_name"
                placeholder={placeholderText + " last name"}
                name="last_name"
                onChange={(e) => handleLastnameChanges(e)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
                value={last_name}
                inputProps={{ maxLength: 50 }}
                helperText={<span className="ma-error">{lastnmErr}</span>}
              />
            </Grid>
            <Grid item xs={6} md={6} className={"createlead-detail-grid"}>
              <label className="labeltxt ">
                <span className="requreiedField">*</span>Email
              </label>
              <TextField
                data-testid="email-input"
                className="createlead-textField placeholder_field"
                fullWidth
                id="email"
                placeholder="farhan@gmail.com"
                name="email"
                value={email}
                onChange={(e) => handleEmailChange(e)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ maxLength: 50 }}
                helperText={<span className="ma-error">{emailErr}</span>}
              />
            </Grid>
            <Grid item xs={6} md={6} className={"createlead-detail-grid"}>
              <label className="labeltxt ">
                Contact
              </label>
              <div className="ma-country-code">
                <PhoneInput
                  inputProps={{ "data-testid": "phone-input" }}
                  country={"in"}
                  value={phone_number}
                  onChange={handlePhoneChanges}
                  countryCodeEditable={false}
                />
                <span className="ma-error">{phoneErrorMessage}</span>
              </div>
            </Grid>
            <Grid item xs={6} md={6} className={"createlead-detail-grid"}>
              <label className="labeltxt ">
                <span className="requreiedField">*</span>Company
              </label>
              <TextField
                data-testid="company-input"
                className="createlead-textField placeholder_field"
                fullWidth
                id="company_name"
                placeholder="Enter company name"
                name="company_name"
                value={company_name}
                onChange={(e) => handleCompanyChange(e)}
                helperText={<span className="ma-error">{companyErr}</span>}
              />
            </Grid>
            <Grid item xs={6} md={6} className={"createlead-detail-grid"}>
              <label className="labeltxt ">
                Designation
              </label>
              <TextField
                data-testid="designation-input"
                className="createlead-textField placeholder_field"
                fullWidth
                id="designation"
                placeholder="Enter designation "
                name="designation"
                value={designation}
                onChange={(e) => handleDesignationChange(e)}
                inputProps={{ maxLength: 50 }}
              />
            </Grid>
            <Grid></Grid>
          </Grid>
        </DialogContent>
        <Box>
          <div className="listMDbutton border-0">
            <Button
              className="cancel me-3"
              data-testid="cp-btn"
              autoFocus
              onClick={handleClose}
            >
              CANCEL
            </Button>
            <ButtonLoader
              loading={loading}
              classStyle={"applay m-0"}
              handleClick={() => handleSubmit()}
              testid={"sp-btn"}
              title={"SAVE"}
              autoFocus={true}
            />
          </div>
        </Box>
      </BootstrapDialog>
    </div>
  );
}
