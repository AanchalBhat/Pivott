import React, { useState, useEffect } from "react";
import FemaleIcon from "@mui/icons-material/Female";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { MeetingApi } from "../../apis/MeetingApi";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Stack from "@mui/material/Stack";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useNavigate, useParams } from "react-router-dom";
import "react-phone-input-2/lib/style.css";
import { Country } from "country-state-city";
import { userApi } from "../../apis/userApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneInput from "react-phone-input-2";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import Select from "react-select";
import { Toaster } from "../../pages/common/Toaster";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
// import global css
import "../../styles/global/common.css";
import { Avatar } from "@mui/material";
import {
  EMAIL_REGEX,
  FIRSTNAME_REGEX,
  LASTNAME_REGEX,
} from "../../utils/regexLists";
import { TimeZoneApi } from "../../apis/TimeZonesApi";
import { ButtonLoader } from "../../pages/common/ButtonLoader";
import { getMethodError } from "../../constants/errorMessages";
import IncorrectId from "../NotFound/IncorrectId";
import { INVALID_ID_DATA } from "../../utils/constants";
import { useOutletContext } from "react-router-dom";

const EditDetails = () => {
  const [language, setLanguage] = useState("");
  const [languages_list, setLanguageList] = useState([]);
  const [timezone, setTimeZone] = useState("");
  const [timezoneData, setTimeZoneData] = useState([]);
  const [gender, setGender] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const userId = params?.id;
  const [country, setCountry] = useState("");
  const [first_name, setFirstName] = useState("");
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
  const [last_name, setLastName] = useState("");
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailValid, setEmailValid] = useState(true);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [phone_code, setPhoneCode] = useState("");
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  const [imgData, setImgData] = useState(null);
  const [imgDataTemp, setImgDatatemp] = useState(false);
  const [imgUrl, setImgurl] = useState(null);
  const placeholderText = "Enter";
  const canNotempty = " can't be empty ";
  const [fname, setFnameError] = useState(false);
  const [lname, setLnameError] = useState(false);
  const [phoneFlag, setPhoneFlag] = useState(false);
  const [country_code, setCountry_code] = useState("");
  const [designation, setDesignation] = useState("");
  const [company_name, setCompany] = useState("");
  const [companyErrorMessage, setCompanyErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [Invalid_data, setInvalidData] = useState(false);
  const [
    navigationData,
    setDrawerData,
    setOpen,
    profileNavigationData,
    setIsProfileDrawer,
  ] = useOutletContext();

  const getLanguages = () => {
    MeetingApi.getLanguages()
      .then(function (response) {
        if (response?.language_list?.length > 0) {
          setLanguageList(response?.language_list);
        } else {
          console.log("An Error Occured! with langauges");
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const getTimeZones = () => {
    TimeZoneApi.getTimezones()
      .then(function (response) {
        if (response?.time_zones?.length > 0) {
          setTimeZoneData(response?.time_zones);
        } else {
          console.log("An error occured");
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const onChangePicture = (e) => {
    let imagData = e.target.files[0];
    let size = 2000002;
    const allowedExtensions = ["jpg", "png"];
    const allowedMimeTypes = ["image/jpeg", "image/png"];
    const extension = imagData?.name.split(".").pop().toLowerCase();
    const mimeType = imagData?.type.toLowerCase();

    if (
      allowedExtensions.includes(extension) &&
      allowedMimeTypes.includes(mimeType)
    ) {
      if (imagData?.size < size) {
        setImgDatatemp(true);
        if (e.target.files[0]) {
          base64FileURL(e.target.files[0], (obj) => {
            setImgurl(e.target.files[0]);
          });
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            setImgData(reader.result);
          });
          reader.readAsDataURL(e.target.files[0]);
        }
      } else {
        Toaster.TOAST("Image size more than 2 Mb not accepted.", "error");
        if (!imgData) {
          setImgData(false);
          setImgDatatemp(false);
        }
      }
    } else {
      Toaster.TOAST("Please select valid image (PNG or JPG ).", "error");
      if (!imgData) {
        setImgData(false);
        setImgDatatemp(false);
      }
    }
  };

  const base64FileURL = (element, callback) => {
    let file = element;
    let reader = new window.FileReader();
    reader.onloadend = function (e) {
      setImgurl(e.target.result);
      callback(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handlefirst_nameChanges = (e) => {
    setFirstName(e.target.value);
    if (!e.target.value) {
      setFirstNameErrorMessage("First name can't be empty");
    } else if (!FIRSTNAME_REGEX.test(e.target.value)) {
      setFnameError(true);
      setFirstNameErrorMessage("Please enter a valid first name");
    } else {
      setFnameError(false);
      setFirstNameErrorMessage("");
    }
  };
  const handleLastnameChanges = (e) => {
    setLastName(e.target.value);
    if (!e.target.value) {
      setLastNameErrorMessage("Last name can't be empty");
    } else if (!LASTNAME_REGEX.test(e.target.value)) {
      setLnameError(true);
      setLastNameErrorMessage("Please enter a valid last name");
    } else {
      setLnameError(false);
      setLastNameErrorMessage("");
    }
  };
  const handlecompanyChanges = (e) => {
    setCompany(e.target.value);
    if (!e.target.value) {
      setCompanyErrorMessage("Company can't be empty");
    } else {
      setCompanyErrorMessage("");
    }
  };
  const handleEmailChange = (e) => {
    if (!EMAIL_REGEX.test(e.target.value)) {
      setEmail(e.target.value);
      setEmailValid(false);
      setEmailErrorMessage("Please enter a valid email Id");
    } else {
      setEmail(e.target.value);
      setEmailValid(true);
      setEmailErrorMessage("");
    }
  };

  const handlePhoneChanges = (value, data, event, formattedValue) => {
    const countryCode = "+" + data.dialCode;
    setPhoneNumber(formattedValue);
    setPhoneCode(countryCode);
    setCountry_code(data?.countryCode);
    let split_data = formattedValue?.split(countryCode);
    let split_no = split_data[1];
    if (data?.countryCode === "in") {
      if (split_no?.length > 11) {
        setPhoneErrorMessage("");
        setPhoneFlag(false);
      } else {
        setPhoneErrorMessage("Please enter valid contact");
        setPhoneFlag(true);
      }
    } else if (split_no?.length === 0) {
      setPhoneErrorMessage("Contact " + canNotempty);
      setPhoneFlag(true);
    } else {
      setPhoneErrorMessage("");
      setPhoneFlag(false);
    }
  };

  useEffect(() => {
    getTimeZones();
    getEditDetail();
    getLanguages();
    setOpen(true);
    setDrawerData(profileNavigationData);
    setIsProfileDrawer(true);
  }, []);

  const getEditDetail = () => {
    if (userId) {
      userApi
        .getUser(userId)

        .then((resp) => {
          const data = resp?.data?.attributes;
          setImgData(data?.profile_photo?.url);
          setFirstName(data?.first_name);
          setLastName(data?.last_name);
          setEmail(data?.email);
          setPhoneNumber(data?.country_code + " " + data?.phone);
          setPhoneCode(data?.country_code);
          setCountry(
            data?.user_address?.country
              ? { name: (data?.user_address?.country).trim() }
              : ""
          );
          setLanguage(data?.language || "");
          setImgDatatemp(false);
          setGender(data?.gender || "");
          setTimeZone(data?.timezone || "");
          setDesignation(data?.designation || "");
          setCompany(data.company_name || "");
        })
        .catch((error) => {
          if (error.response?.data?.error === INVALID_ID_DATA) {
            setInvalidData(true);
            return;
          }
          Toaster.TOAST(getMethodError(error), "error");
          console.log(error);
        });
    }
  };

  const handleValidation = () => {
    if (!email) {
      setEmailValid(false);
      setEmailErrorMessage("Email" + canNotempty);
    }
    if (!first_name) {
      setFirstNameErrorMessage("First name" + canNotempty);
    }
    if (!last_name) {
      setLastNameErrorMessage("Last name " + canNotempty);
      setLnameError(true);
    }
    if (!phone_number) {
      setPhoneErrorMessage("Contact " + canNotempty);
      setPhoneFlag(true);
    }
    if (phone_number?.length < 11 && country_code === "in") {
      setPhoneErrorMessage("Please enter valid contact");
      setPhoneFlag(true);
    }
    if (!company_name) {
      setCompanyErrorMessage("Company" + canNotempty);
    }
  };

  const handleSaveClick = () => {
    handleValidation();
    if (
      email?.length !== 0 &&
      emailErrorMessage === "" &&
      first_name?.length !== 0 &&
      firstNameErrorMessage === "" &&
      last_name?.length !== 0 &&
      lastNameErrorMessage === "" &&
      phone_number?.length !== 0 &&
      company_name?.length !== 0 &&
      phoneFlag === false
    ) {
      const formData = new FormData();

      formData.append("data[first_name]", first_name);
      formData.append("data[last_name]", last_name);
      formData.append("data[email]", email);
      formData.append(
        "data[phone]",
        phone_number?.replace(phone_code, "").trim()
      );
      formData.append("data[country_code]", phone_code);
      formData.append("data[gender]", gender);
      if (country?.name) {
        formData.append(
          "data[address_attributes][country]",
          `${(country?.flag || "").trim()} ${country?.name || ""}`
        );
      }
      formData.append("data[timezone]", timezone);
      formData.append("data[language]", language);
      formData.append("data[designation]", designation);

      if (imgDataTemp) {
        formData.append("data[profile_photo]", imgUrl);
      }

      if (userId) {
        setLoading(true);
        userApi
          .update(formData, userId)

          .then(function (res) {
            if (res?.data) {
              let storedObject = JSON.parse(localStorage.getItem("user_info"));
              if (storedObject) {
                storedObject.profile_photo.url =
                res?.data?.attributes?.profile_photo?.url;
              storedObject.first_name = first_name;
              storedObject.last_name = last_name;
              storedObject.email = email;
              storedObject.phone = phone_number?.replace(phone_code, "").trim();
              storedObject.gender = gender;
              storedObject.timezone = timezone;
              storedObject.language = language;
              storedObject.designation = designation;
              if (storedObject.user_address && country?.name) {
                storedObject.user_address.country = `${(country?.flag || "").trim()} ${country?.name || ""}`;
              }
              let updatedObject = JSON.stringify(storedObject);
              localStorage.setItem("user_info", updatedObject);
              }
              Toaster.TOAST("User updated successfully!", "success");
              navigate("/account-details/profile-details");
            }
            setLoading(false);
          })
          .catch((error) => {
            Toaster.TOAST(getMethodError(error), "error");
            setLoading(false);
            console.log(error);
          });
      }
    }
  };
  const backNavigation = () => {
    setIsProfileDrawer(false);
    navigate("/account-details/profile-details");
    setDrawerData(navigationData);
    setOpen(false);
  };

  return (
    <Box className="ma-leads-box" sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{ flexGrow: 1 }}
        className="ma-mainTop-box mainBox"
      >
        {Invalid_data ? (
          <IncorrectId />
        ) : (
          <Paper elevation={2} className={"ma-mainShadow-box createlead-page"}>
            <Typography className={"createlead-heading"}>
              <ArrowBackIcon className="Arrowbtn-mr" onClick={backNavigation} />
              <span
                data-testid="edit-detail"
                style={{ fontSize: "18px", marginLeft: "5px" }}
              >
                Account Details
              </span>
            </Typography>
            <div className="ma-createMain-form">
              <div>
                <div className="avatarimg_txt  ">
                  {imgDataTemp && (
                    <div className="image_container">
                      <img data-testid="img" src={imgData} alt="file" />
                    </div>
                  )}
                  {!imgDataTemp && (
                    <div>
                      {imgData && (
                        <div className="image_container">
                          <img src={imgData} alt="file" />
                        </div>
                      )}
                      {!imgData && (
                        <div className="image_container2 account_profile">
                          <Avatar alt="Remy Sharp">
                            {" "}
                            <AccountCircleIcon />{" "}
                          </Avatar>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="imageupload">
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Button
                        className="changepic"
                        data-testid="change-pic"
                        type="file"
                        onChange={onChangePicture}
                        component="label"
                      >
                        Change Picture
                        <input
                          data-testid="picture"
                          hidden
                          accept="image/*"
                          multiple
                          type="file"
                        />
                      </Button>
                    </Stack>
                    <h6 className="txtsize mb-0">
                      Max Size 2MB Formats JPG/PNG
                    </h6>
                  </div>
                </div>
              </div>
              <div>
                <Box>
                  <Grid container spacing={2} xs={12} md={8}>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      className={"createlead-detail-grid"}
                    >
                      <label className="labeltxt ">
                        <span className="requreiedField">*</span> First Name
                      </label>
                      <TextField
                        data-testid="firstnameinput"
                        className="createlead-textField placeholder_field"
                        fullWidth
                        placeholder={placeholderText + " first name"}
                        name="first_name"
                        onChange={(e) => handlefirst_nameChanges(e)}
                        id="first_name"
                        value={first_name}
                        error={fname}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircleOutlinedIcon />
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{ maxLength: 50 }}
                        helperText={
                          <span className="ma-error">
                            {firstNameErrorMessage}
                          </span>
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      className={"createlead-detail-grid"}
                    >
                      <label className="labeltxt ">
                        <span className="requreiedField">*</span> Last Name
                      </label>
                      <TextField
                        data-testid="lastnameinput"
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
                        inputProps={{ maxLength: 50 }}
                        error={lname}
                        helperText={
                          <span className="ma-error">
                            {lastNameErrorMessage}
                          </span>
                        }
                        value={last_name}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      className={"createlead-detail-grid"}
                    >
                      <label className="labeltxt ">
                        <span className="requreiedField">*</span> Email
                      </label>
                      <TextField
                        data-testid="emailinput"
                        className="createlead-textField placeholder_field"
                        fullWidth
                        id="email"
                        placeholder="farhan@gmail.com"
                        name="email"
                        value={email}
                        disabled
                        onChange={(e) => handleEmailChange(e)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MailOutlineIcon />
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{ maxLength: 50 }}
                        error={!isEmailValid ? true : false}
                        helperText={
                          <span className="ma-error">{emailErrorMessage}</span>
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      className={"createlead-detail-grid"}
                    >
                      <label className="labeltxt ">
                        <span className="requreiedField">*</span> Phone
                      </label>
                      <div className="ma-country-code">
                        <PhoneInput
                          inputProps={{ "data-testid": "phoneinput" }}
                          country={"in"}
                          value={phone_number}
                          onChange={handlePhoneChanges}
                          countryCodeEditable={false}
                        />
                        <span className="ma-error">{phoneErrorMessage}</span>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      className={"createlead-detail-grid"}
                    >
                      <label className="labeltxt ">Gender</label>
                      <TextField
                        data-testid="genderinput"
                        className="createlead-textField placeholder_field"
                        fullWidth
                        id="gender"
                        name="gender"
                        value={gender}
                        select="true"
                        onChange={(e) => setGender(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FemaleIcon />
                            </InputAdornment>
                          ),
                        }}
                      >
                        <MenuItem value={"Male"}>Male</MenuItem>
                        <MenuItem value={"Female"}>Female</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      className={"createlead-detail-grid"}
                    >
                      <label className="labeltxt ">Country</label>
                      <Select
                        className="createlead-textField placeholder_field ma-reactSelect-style"
                        classNamePrefix="ma-react-select-box"
                        fullWidth
                        id="country"
                        name="country"
                        placeholder="Select country"
                        data-testid="countryinput"
                        options={Country.getAllCountries()}
                        getOptionLabel={(options) => {
                          return (
                            <div className="country-search">
                              <div>{options?.name}</div>&nbsp;
                              <div>{options?.flag}</div>
                            </div>
                          );
                        }}
                        getOptionValue={(options) => {
                          return options["name"];
                        }}
                        value={country}
                        onChange={(item) => {
                          setCountry(item);
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      className={"createlead-detail-grid"}
                    >
                      <label className="labeltxt">Language</label>
                      <TextField
                        data-testid="languageinput"
                        className="createlead-textField placeholder_field"
                        fullWidth
                        value={language}
                        id="language"
                        name="language"
                        select="true"
                        onChange={(e) => setLanguage(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <GTranslateIcon />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {languages_list?.map((item, key) => {
                          return (
                            <MenuItem value={item} key={key}>
                              {item}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      className={"createlead-detail-grid"}
                    >
                      <label className="labeltxt">Timezone</label>
                      <TextField
                        data-testid="timezoneinput"
                        className="createlead-textField placeholder_field"
                        fullWidth
                        id="timezone"
                        name="timezone"
                        select="true"
                        value={timezone}
                        onChange={(e) => setTimeZone(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTimeIcon />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {timezoneData?.map((item, key) => {
                          return (
                            <MenuItem value={item} key={key}>
                              {item}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      md={6}
                      className={"createlead-detail-grid"}
                    >
                      <label className="labeltxt ">Company</label>
                      <TextField
                        data-testid="companyinput"
                        className="createlead-textField placeholder_field"
                        fullWidth
                        id="company"
                        placeholder="Enter Company"
                        name="company"
                        value={company_name}
                        onChange={(e) => handlecompanyChanges(e)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CorporateFareIcon />
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{ maxLength: 30 }}
                        error={companyErrorMessage}
                        helperText={
                          <span className="ma-error">
                            {companyErrorMessage}
                          </span>
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      md={6}
                      className={"createlead-detail-grid"}
                    >
                      <label className="labeltxt ">Designation</label>
                      <TextField
                        data-testid="designationinput"
                        className="createlead-textField placeholder_field"
                        fullWidth
                        id="designation"
                        placeholder="Enter designation"
                        name="designation"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeOutlinedIcon />
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{ maxLength: 40 }}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={12}
                      className={"createlead-detail-grid"}
                    >
                      <div className="createlead-buttons ma-login-btn">
                        <ButtonLoader
                          loading={loading}
                          classStyle={
                            "createlead-buttons__saveButton savebtntext"
                          }
                          btnType={"submit"}
                          handleClick={() => handleSaveClick()}
                          testid={"save"}
                          title={"SAVE"}
                        />
                        <Button
                          data-testid="cancel"
                          className="cancelbtn"
                          type="button"
                          variant="outlined"
                          onClick={() => {
                            navigate("/account-details/profile-details");
                          }}
                        >
                          CANCEL
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </Box>
              </div>
            </div>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default EditDetails;
