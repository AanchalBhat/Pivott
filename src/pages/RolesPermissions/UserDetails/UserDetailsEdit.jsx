import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import {
  useNavigate,
  useParams,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Country, State, City } from "country-state-city";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import DeletePopup from "../../common/DeletePopup";
import Select from "react-select";
import { userApi } from "../../../apis/userApi";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Toaster } from "../../common/Toaster";
import debouce from "lodash.debounce";
import OwnerDropdown from "../../common/OwnerDropdown";
import { Avatar, IconButton } from "@mui/material";
import "../../../styles/global/common.css";
import {
  EMAIL_REGEX,
  FIRSTNAME_REGEX,
  ZIPCODE_REGEX,
} from "../../../utils/regexLists";
import { TimeZoneApi } from "../../../apis/TimeZonesApi";
import { ButtonLoader } from "../../common/ButtonLoader";
import { FormatDate } from "../../../utils";
import { RolesApi } from "../../../apis/RolesApi";
import { getMethodError } from "../../../constants/errorMessages";
import ClearIcon from "@mui/icons-material/Clear";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

let isFlag = false;
export default function UserDetailsEdit() {
  const [setDeactivateUserId] = useOutletContext();
  const [state, setstate] = useState("");
  const [country, setcountry] = useState("");
  const [city, setCity] = useState("");
  const [first_name, setFirstName] = useState("");
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
  const [last_name, setLastName] = useState();
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailValid, setEmailValid] = useState(true);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [phone_code, setPhoneCode] = useState("");
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  const [mobileErrorMessage, setMobileErrorMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [street_address, setStreet] = useState("");
  const [zip_code, setZipcode] = useState("");
  const [zipCodeErrorMessage, setZipcodeErrorMessage] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState();
  const [fax, setFax] = useState("");
  const [role, setRole] = useState("");
  const [addedBy, setaAddedBy] = useState("");
  const [mobile, setMobile] = useState("");
  const [joined_date, setJoined_date] = useState("");
  const [time_zone, setTime_zone] = useState("");
  const [timezoneData, setTimeZoneData] = useState([]);
  const placeholderText = "Enter";
  const canNotempty = "can't be empty";
  const [phoneFlag, setPhoneFlag] = useState(false);
  const [country_code, setCountry_code] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [imgDataTemp, setImgDatatemp] = useState(false);
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(false);
  //manager
  const [managerId, setManagerId] = useState("");
  const [managerName, setManagerName] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [srchUser, setSrchUser] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("user_info"));

  const [imgUrl, setImgurl] = useState(null);
  const [imgData, setImgData] = useState(null);
  const [roleData, setRoleData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isZip, setIsZip] = useState(false);
  const [isPhone, setIsPhone] = useState("");
  const [role_name, setRole_name] = useState("");
  const [openCalendar, setOpenCalendar] = useState(false);
  const [isInvite, setIsInvite] = useState();
  const login_id = localStorage.getItem("login_id");
  const [searchParams] = useSearchParams();
  const [designation, setDesignation] = useState("");
  const [manageField, setManageField] = useState({});
  const isMobileRegx = /^\d*$/;
  const navigate = useNavigate();
  const params = useParams();
  const userId = params?.id;

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

  const handleClose = () => {
    setOpenDelete(false);
  };

  const handleDelete = () => {
    setOpenDelete(false);
    if (searchParams.get("filter")) {
      navigate(
        `/roles-permissions/manage-users?filter=${searchParams.get("filter")}&page=${searchParams.get("page")}`
      );
    } else {
      navigate(`/roles-permissions/manage-users`);
    }
  };

  const handlefirst_nameChanges = (e) => {
    let val = e.target.value;
    setFirstName(e.target.value);
    if (!val) {
      setFirstNameErrorMessage("First name can't be empty");
    } else if (!FIRSTNAME_REGEX.test(val)) {
      setFirstNameErrorMessage("Please enter a valid first name");
    } else {
      setFirstNameErrorMessage("");
    }
  };

  const handleLastnameChanges = (e) => {
    let val = e.target.value;
    setLastName(e.target.value);
    if (!val) {
      setLastNameErrorMessage("Last name can't be empty");
    } else if (!FIRSTNAME_REGEX.test(val)) {
      setLastNameErrorMessage("Please enter a valid last name");
    } else {
      setLastNameErrorMessage("");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!EMAIL_REGEX.test(e.target.value)) {
      setEmailValid(false);
      setEmailErrorMessage("Please enter a valid email Id");
    } else {
      setEmailValid(true);
      setEmailErrorMessage("");
    }
  };

  const handleFaxChanges = (e) => {
    setFax(e.target.value);
  };
  const handleMobileChanges = (e) => {
    let val = e.target.value;
    setMobile(val.replace(/\D/g, ""));

    if (!isMobileRegx.test(val) && val) {
      setMobileErrorMessage("Please enter number");
    } else if (val?.length < 3 || val?.length > 15) {
      if (!val) {
        setMobileErrorMessage("");
        setIsMobile(false);
      } else {
        setIsMobile(true);
        setMobileErrorMessage("Mobile number should be min 3 & max 15 digit");
      }
    } else {
      setMobileErrorMessage("");
      setIsMobile(false);
    }
  };

  const handlePhoneChanges = (value, data, event, formattedValue) => {
    const countryCode = "+" + data?.dialCode;
    setPhoneNumber(formattedValue);
    setIsPhone(formattedValue);
    setPhoneCode(countryCode);
    setCountry_code(data?.countryCode);
    let split_data = formattedValue?.split(countryCode);
    let split_no = split_data[1];
    if (data?.countryCode === "in") {
      if (split_no?.length > 11) {
        setPhoneErrorMessage("");
        setPhoneFlag(false);
        isFlag = false;
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
      isFlag = false;
    }
  };

  const handleWebsiteChanges = (e) => {
    setWebsite(e.target.value);
  };

  const handleStreetChanges = (e) => {
    setStreet(e.target.value);
  };

  const handleZipcodeChanges = (e) => {
    let val = e.target.value;
    setZipcode(e.target.value);
    if (val && !ZIPCODE_REGEX.test(val)) {
      setZipcodeErrorMessage("Please enter valid zip code");
    } else if (val?.length < 3 && val !== "") {
      setZipcodeErrorMessage("Enter zip code with length 3-12");
      setIsZip(true);
    } else {
      setZipcodeErrorMessage("");
      setIsZip(false);
    }
  };

  useEffect(() => {
    setManagerName(userInfo.full_name);
    setManagerId(userInfo.id);
    getFormValues();
    getTimeZones();
    getRoleData();
  }, []);

  const getRoleData = () => {
    userApi
      .getRole()
      .then((res) => {
        setRoleData(res?.data);
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
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
      if (imagData.size < size) {
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
      Toaster.TOAST("Please select valid image (PNG or JPEG ).", "error");
      if (!imgData) {
        setImgData(false);
        setImgDatatemp(false);
      }
    }
  };
  const getFormValues = () => {
    if (userId) {
      userApi
        .getUser(params?.id)
        .then(function (response) {
          if (response?.data) {
            let val = response.data.attributes;
            setManageField(val);
            setIsInvite(val?.is_invited);
            setIsPhone(val.phone);
            setUsers(val);
            setFirstName(val.first_name);
            setImgData(val.profile_photo?.url);
            setLastName(val.last_name);
            setEmail(val.email);
            setDateOfBirth(val.date_of_birth);
            setFax(val.fax);
            setRole(val.role.id);
            setRole_name(val.role.role_name);
            setWebsite(val.website);
            setDesignation(val.designation);
            setPhoneNumber(`${val.country_code} ${val.phone}`);
            setTime_zone(val.timezone);
            setCountry_code(val.country_code);
            setJoined_date(val.joined_date);
            setaAddedBy(val.added_by);
            setMobile(val.mobile_number);
            setZipcode(val.user_address?.zip_code);
            setStreet(val.user_address?.street);
            setCity(
              val.user_address?.city ? { name: val.user_address?.city } : ""
            );
            setcountry(
              val.user_address?.country
                ? { name: val.user_address?.country }
                : ""
            );
            setstate(
              val.user_address?.state ? { name: val.user_address?.state } : ""
            );
            setManagerId(val.manager?.id || "");
            setManagerName(val.manager?.full_name || "");
          }
        })
        .catch((error) => {
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
    if (!isInvite) {
      if (!first_name) {
        setFirstNameErrorMessage("First name " + canNotempty);
      }
      if (!last_name) {
        setLastNameErrorMessage("Last name " + canNotempty);
      }

      if (!phone_number) {
        setPhoneErrorMessage("Contact " + canNotempty);
        setPhoneFlag(true);
      }
      if (isPhone == null || isPhone === "null null") {
        isFlag = true;
        setPhoneErrorMessage("Contact " + canNotempty);
      } else {
        if (!isFlag) {
          setPhoneErrorMessage("");
        }
      }
    }
    if (phone_number?.length < 11 && country_code === "in") {
      setPhoneErrorMessage("Please enter valid contact");
      setPhoneFlag(true);
    }
  };

  const handleSaveClick = () => {
    handleValidation();
    let phone_no =
      isPhone !== null ? phone_number?.replace(phone_code, "").trim() : "";
    if (
      (isInvite ||
        (first_name &&
          last_name &&
          phone_number?.length !== 10 &&
          firstNameErrorMessage === "" &&
          lastNameErrorMessage === "" &&
          phoneErrorMessage === "" &&
          phoneFlag === false)) &&
      email?.length !== 0 &&
      emailErrorMessage === "" &&
      !isMobile &&
      !isZip &&
      !isFlag
    ) {
      const formData = new FormData();
      formData.append("data[first_name]", first_name || "");
      formData.append("data[last_name]", last_name || "");
      formData.append("data[email]", email || "");
      formData.append("data[phone]", phone_no);
      formData.append("data[country_code]", phone_code || "");
      formData.append("data[website]", website || "");
      formData.append("data[date_of_birth]", dateOfBirth || "");
      formData.append("data[timezone]", time_zone);
      formData.append("data[fax]", fax || "");
      formData.append("data[designation]", designation || "");
      if (manageField?.can_modify_user?.can_edit_role !== false) {
        formData.append("data[role_id]", role ? role : "");
      }
      formData.append("data[mobile_number]", mobile || "");
      formData.append("data[address_attributes][street]", street_address || "");
      formData.append(
        "data[address_attributes][state]",
        state?.name ? state?.name : ""
      );
      formData.append(
        "data[address_attributes][country]",
        country?.name ? country?.name : ""
      );
      formData.append(
        "data[address_attributes][city]",
        city?.name ? city?.name : ""
      );
      formData.append("data[address_attributes][zip_code]", zip_code || "");
      formData.append("data[parent_id]", managerId || "");
      if (imgDataTemp) {
        formData.append("data[profile_photo]", imgUrl);
      }
      if (userId) {
        setLoading(true);
        userApi
          .update(formData, userId)
          .then(function (res) {
            if (res?.data) {
              Toaster.TOAST("User updated successfully!", "success");
              navigate(-1);
            }
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            Toaster.TOAST(getMethodError(error), "error");
            console.log(error);
          });
      }
    }
  };

  useEffect(() => {
    if (!srchUser) {
      getManagerData();
    }
  }, [srchUser]);

  const getManagerData = (srchQuery) => {
    userApi
      .getUsers(srchQuery)
      .then((data) => {
        setUserLoading(true);
        if (data?.data) {
          setUsersData(data?.data);
          setUserLoading(false);
        } else {
          setUsersData([]);
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
        getManagerData(e);
      }
    }, 800),
    []
  );

  const getUserData = (event, newValue) => {
    if (newValue) {
      setSrchUser(true);
    } else {
      setSrchUser(false);
    }
    if (event?.type !== undefined && event?.type !== "click") {
      setUserLoading(true);
      debounceSaveUser(newValue);
    }
    setManagerName(newValue);
  };

  const handleManager = (event, val) => {
    setManagerId(val?.id);
  };

  // date
  const handleDateChange = (newValue) => {
    let formated = FormatDate(newValue?.$d);
    setDateOfBirth(formated);
  };

  const clearDate = () => {
    setOpenCalendar(false); // Close the calendar
    setDateOfBirth(null); // Clear the date
  };

  //activate to deactivate and deactivate to activate
  const handleToggleDeactivateUser = (value) => {
    setLoading(true);
    let data = {
      user_ids: [userId],
    };
    if (params?.id) {
      RolesApi.toggleDeactivateUser({ data }, value)
        .then((response) => {
          if (response) {
            navigate(-1);
            // navigate("/roles-permissions/manage-users/user-details");
            Toaster.TOAST(response?.message, "success");
          } else {
            setDeactivateUserId([]);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <Paper elevation={2} className={"ma-mainShadow-box createlead-page"}>
        <div className="ma-createMain-form">
          <div>
            <div>
              <h1 data-testid="details" className="detailstxt">
                Details
              </h1>
            </div>

            <div className="avatarimg_txt ma-roles-editBtn-box">
              <div className="d-flex align-items-center">
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
                      data-testid="pic-btn"
                      className="changepic"
                      type="file"
                      onChange={onChangePicture}
                      component="label"
                    >
                      Change Picture
                      <input
                        hidden
                        data-testid="change-pic"
                        accept="image/*"
                        multiple
                        type="file"
                      />
                    </Button>
                  </Stack>
                  <h6 className="txtsize mb-0">Max Size 2MB Formats JPG/PNG</h6>
                </div>
              </div>
              {login_id !== userId && (
                <div className="ma-role-userDetail">
                  {users?.disabled ? (
                    <ButtonLoader
                      loading={loading}
                      classStyle={"ma-activate-btn"}
                      title={"Activate User"}
                      handleClick={() =>
                        handleToggleDeactivateUser("activate_user")
                      }
                    />
                  ) : (
                    <>
                      {userId !== login_id && (
                        <ButtonLoader
                          loading={loading}
                          classStyle={"ma-deactive-btn"}
                          title={"Deactivate User"}
                          handleClick={() =>
                            handleToggleDeactivateUser("deactivate_user")
                          }
                        />
                      )}
                    </>
                  )}
                  <Button
                    data-testid="delete-btn"
                    variant="contained"
                    className="ma-deleteUser-btn"
                    onClick={() => setOpenDelete(true)}
                  >
                    Delete User
                  </Button>
                </div>
              )}
            </div>
          </div>
          <Box>
            <Grid container spacing={2} xs={12} md={8}>
              <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
                <label className="labeltxt ">
                  {!isInvite && <span className="requreiedField">*</span>}First
                  Name
                </label>
                <TextField
                  data-testid="fname"
                  className="createlead-textField placeholder_field"
                  fullWidth
                  placeholder={`${placeholderText} first name`}
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
                  inputProps={{ maxLength: 40 }}
                  helperText={
                    <span className="ma-error">{firstNameErrorMessage}</span>
                  }
                />
              </Grid>
              <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
                <label className="labeltxt ">
                  {!isInvite && <span className="requreiedField">*</span>}Last
                  Name
                </label>
                <TextField
                  data-testid="lname"
                  className="createlead-textField placeholder_field"
                  fullWidth
                  id="last_name"
                  placeholder={`${placeholderText} last name`}
                  name="last_name"
                  onChange={(e) => handleLastnameChanges(e)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircleOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ maxLength: 40 }}
                  helperText={
                    <span className="ma-error">{lastNameErrorMessage}</span>
                  }
                  value={last_name}
                />
              </Grid>
              <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
                <label className="labeltxt ">
                  {!isInvite && <span className="requreiedField">*</span>}Phone
                </label>
                <div className="ma-country-code">
                  <PhoneInput
                    inputProps={{
                      "data-testid": "phone",
                    }}
                    country={"in"}
                    value={phone_number}
                    onChange={handlePhoneChanges}
                    countryCodeEditable={false}
                  />
                  <span className="ma-error">{phoneErrorMessage}</span>
                </div>
              </Grid>
              <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
                <label className="labeltxt ">Website</label>
                <TextField
                  data-testid="website-1"
                  className="createlead-textField placeholder_field"
                  fullWidth
                  id="website"
                  placeholder="www.google.com"
                  name="website"
                  value={website}
                  onChange={(e) => handleWebsiteChanges(e)}
                />
              </Grid>

              <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
                <label className="labeltxt ">
                  <span className="requreiedField">*</span>Email
                </label>
                <TextField
                  data-testid="email"
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
                  error={!isEmailValid ? true : false}
                  helperText={
                    <span className="ma-error">{emailErrorMessage}</span>
                  }
                />
              </Grid>
              <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
                <label className="labeltxt ">Date of Birth</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dateOfBirth}
                    open={openCalendar}
                    onOpen={() => setOpenCalendar(true)}
                    onClose={() => setOpenCalendar(false)}
                    className="placeholder_field"
                    inputFormat="DD/MM/YYYY"
                    onChange={(val) => handleDateChange(val)}
                    renderInput={(params) => (
                      <TextField
                        data-testid="Date of Birth-1"
                        {...params}
                        fullWidth
                        name="Date of Birth"
                        size="medium"
                        id="Date of Birth"
                        placeholder="Enter date of birth"
                        onKeyDown={(e) => e.preventDefault()}
                        onMouseDown={() => setOpenCalendar(true)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => clearDate()}
                                size="small"
                                edge="end"
                              >
                                {dateOfBirth && <ClearIcon />}
                              </IconButton>
                              <IconButton
                                onClick={() => setOpenCalendar(true)}
                                size="small"
                                edge="end"
                              >
                                <CalendarTodayIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
                <label className="labeltxt ">Role</label>
                {manageField?.can_modify_user?.can_edit_role === false ? (
                  <TextField
                    data-testid="fax-id"
                    fullWidth
                    className="createlead-textField placeholder_field"
                    value={role_name}
                    disabled
                  />
                ) : (
                  <TextField
                    data-testid="role"
                    className="createlead-textField placeholder_field"
                    fullWidth
                    id="role"
                    placeholder="Executive"
                    name="role"
                    select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    {roleData?.map((ele, key) => {
                      return (
                        <MenuItem value={ele.id} key={ele.id}>
                          {ele.attributes.name}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                )}
              </Grid>
              <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
                <label className="labeltxt ">Manager</label>
                {manageField?.can_modify_user?.can_edit_manager === false ? (
                  <TextField
                    data-testid="fax-id"
                    className="createlead-textField placeholder_field"
                    value={managerName}
                    fullWidth
                    disabled
                  />
                ) : (
                  <OwnerDropdown
                    users={usersData}
                    contactsValue={managerName}
                    getContactData={getUserData}
                    handleContactId={handleManager}
                    userLoading={userLoading}
                    placeholder="Choose manager"
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
                <label className="labeltxt ">Fax</label>
                <TextField
                  data-testid="fax-id"
                  className="createlead-textField placeholder_field"
                  fullWidth
                  id="fax"
                  placeholder="200-300"
                  name="fax"
                  value={fax}
                  onChange={(e) => handleFaxChanges(e)}
                  inputProps={{ maxLength: 20 }}
                />
              </Grid>
              {role_name !== "superadmin" && (
                <Grid
                  item
                  xs={12}
                  md={6}
                  className={"disabled-block-field createlead-detail-grid"}
                >
                  <label className="labeltxt ">Added By</label>
                  <TextField
                    data-testid="addedBy"
                    className="createlead-textField placeholder_field"
                    fullWidth
                    id="addedby"
                    placeholder="John Green"
                    name="addedby"
                    value={addedBy}
                    disabled
                    onChange={(e) => setaAddedBy(e.target.value)}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
                <label className="labeltxt ">Mobile</label>
                <TextField
                  data-testid="mobile"
                  className="createlead-textField placeholder_field"
                  fullWidth
                  id="mobile"
                  placeholder="Enter mobile number"
                  name="mobile"
                  value={mobile}
                  // inputProps={{ maxLength: 15 }}
                  onChange={(e) => handleMobileChanges(e)}
                />
                <span className="ma-error">{mobileErrorMessage}</span>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                className={"disabled-block-field createlead-detail-grid"}
              >
                <label className="labeltxt ">Joined Date</label>
                <TextField
                  data-testid="joined_date"
                  className="createlead-textField placeholder_field"
                  fullWidth
                  id="joined_date"
                  placeholder="Enter joined date"
                  name="joined_date"
                  value={joined_date}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
                <label className="labeltxt ">Time Zone</label>
                <TextField
                  data-testid="time_zone"
                  className="createlead-textField placeholder_field"
                  fullWidth
                  select
                  id="time_zone"
                  placeholder="GMT"
                  name="time_zone"
                  value={time_zone}
                  onChange={(e) => setTime_zone(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <QueryBuilderIcon />
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
                xs={12}
                md={6}
                className={"disabled-block-field createlead-detail-grid"}
              >
                <label className="labeltxt ">Designation</label>
                <TextField
                  data-testid="designation"
                  className="createlead-textField placeholder_field"
                  fullWidth
                  id="designation"
                  placeholder="Enter designation"
                  name="designation"
                  onChange={(e) => setDesignation(e.target.value)}
                  value={designation}
                />
              </Grid>
            </Grid>
          </Box>

          <Typography
            variant="subtitle1"
            className={"createlead-detail-address"}
          >
            <h4 className="Addresstxt">Address </h4>
          </Typography>
          <Box>
            <Grid container spacing={2} xs={12} md={8}>
              <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
                <label className="labeltxt ">Street </label>
                <TextField
                  data-testid="street"
                  className="createlead-textField placeholder_field"
                  fullWidth
                  id="street_address"
                  placeholder="4959 Eagle Street"
                  name="street_address"
                  onChange={(e) => handleStreetChanges(e)}
                  value={street_address}
                  inputProps={{ maxLength: 80 }}
                />
              </Grid>

              <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
                <label className="labeltxt ">Zip Code </label>
                <TextField
                  data-testid="zip"
                  rows={2}
                  fullWidth
                  value={zip_code}
                  placeholder="01234"
                  className="placeholder_field"
                  name="zip_code"
                  onChange={(e) => handleZipcodeChanges(e)}
                  helperText={
                    <span className="ma-error">{zipCodeErrorMessage}</span>
                  }
                  inputProps={{ maxLength: 12 }}
                />
              </Grid>
              <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
                <label className="labeltxt ">Country</label>
                <Select
                  className="createlead-textField placeholder_field ma-reactSelect-style"
                  classNamePrefix="ma-react-select-box"
                  fullWidth
                  id="country"
                  name="country"
                  placeholder="Select country"
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
                  value={country} //send country?.name in payload for api
                  onChange={(item) => {
                    setcountry(item);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
                <label className="labeltxt ">State</label>
                <Select
                  className="createlead-textField placeholder_field ma-reactSelect-style"
                  classNamePrefix="ma-react-select-box"
                  fullWidth
                  id="state"
                  name="state"
                  placeholder="Select state"
                  options={State?.getStatesOfCountry(country?.isoCode)}
                  getOptionLabel={(options) => {
                    return options["name"];
                  }}
                  getOptionValue={(options) => {
                    return options["name"];
                  }}
                  value={state}
                  onChange={(item) => {
                    setstate(item);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
                <label className="labeltxt ">City</label>
                <Select
                  className="createlead-textField placeholder_field ma-reactSelect-style"
                  classNamePrefix="ma-react-select-box"
                  fullWidth
                  id="city"
                  name="city"
                  placeholder="Select city"
                  options={City.getCitiesOfState(
                    state?.countryCode,
                    state?.isoCode
                  )}
                  getOptionLabel={(options) => {
                    return options["name"];
                  }}
                  getOptionValue={(options) => {
                    return options["name"];
                  }}
                  value={city}
                  onChange={(item) => {
                    setCity(item);
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Grid container spacing={2} xs={12} md={8}>
              <Grid item xs={12} md={6} className={"createlead-detail-grid"}>
                <div className="createlead-buttons ma-login-btn">
                  <ButtonLoader
                    loading={loading}
                    classStyle={"createlead-buttons__saveButton savebtntext"}
                    btnType={"submit"}
                    testid={"save-btn"}
                    title={"SAVE"}
                    handleClick={() => handleSaveClick()}
                  />

                  <Button
                    data-testid="cancel-btn"
                    className="cancelbtn"
                    type="button"
                    variant="outlined"
                    onClick={() => navigate(-1)}
                  >
                    CANCEL
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Box>
        </div>
      </Paper>
      {openDelete && (
        <DeletePopup
          title="Delete User?"
          content="Are you sure you want to delete “Alisha Sam as executive”?"
          openDelete={openDelete}
          handleClose={handleClose}
          handleDelete={handleDelete}
          loading={false}
        />
      )}
    </>
  );
}
