import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
//mui
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
//mui icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// api
import { LeadAPI } from "../../apis/LeadApi";
// other imports
import { DataContext } from "../../context";
import { Country, State, City } from "country-state-city";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import LeadOwnerDropdown from "../../pages/common/LeadOwner";
import { defaultProfile } from "../../assets/index";
import Select from "react-select";
import { Toaster } from "../../pages/common/Toaster";
import debouce from "lodash.debounce";
import { userApi } from "../../apis/userApi";
import "../../styles/global/common.css";
import "../../styles/custom/Create.css";
import DropDownCrud from "../../pages/common/Dropdowns_Crud/Drodpown_CRUD";
import DropdownCreateEdit from "../../pages/common/Dropdowns_Crud/DropdownCreateEdit";
import DropdownDelete from "../../pages/common/Dropdowns_Crud/DropdownDelete";
import { Avatar } from "@mui/material";
import Alert from "@mui/material/Alert";
import {
  WEBSITE_REGEX,
  NAMES_REGEX,
  EMAIL_REGEX,
  STREET_REGEX,
  ZIPCODE_REGEX,
} from "../../utils/regexLists";
import {
  ADD_NEW,
  RECORD_EXIST,
  INDUSTRY,
  LEAD_STATUS,
  LEAD_SOURCE,
  COMPANY_SIZE,
  INVALID_ID_DATA,
} from "../../utils/constants";
import { ButtonLoader } from "../../pages/common/ButtonLoader";
import {
  deleteMethodError,
  getMethodError,
  restMethodError,
} from "../../constants/errorMessages";
import IncorrectId from "../NotFound/IncorrectId";

let isTrue = false;
let isFname = false;
let isLname = false;
let field_editLabel = "";
let field_placeholder = "";
let field_addLabel = "";
const Createlead = () => {
  const navigate = useNavigate();
  // const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const params = useParams();
  const leadId = params?.id;
  const module_name = location?.pathname.split("/")[1];
  const createId = params?.createId;
  let param_id = leadId ? leadId : createId;
  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const id = JSON.parse(localStorage.getItem("login_id"));
  const { crudField } = useContext(DataContext);
  const [leadStatusArray, setLeadStatusArray] = useState([]);
  const [leadSourceArray, setLeadSourceArray] = useState([]);
  const [leadIndustryArray, setLeadIndustryArray] = useState([]);
  const [compnySizeArray, setCompnySizeArray] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [findState, setfindState] = useState([]);
  const [country, setcountry] = useState("");
  const [company_name, setcompany] = useState("");
  const [designation, setdesignation] = useState("");
  const [lead_source_id, setlead_source] = useState("");
  const [status_id, setLead_status] = useState("");
  const [industry, setindustry] = useState("");
  const [company_size, setcompany_size] = useState("");
  const [state, setstate] = useState("");
  const [city, setCity] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_code, setPhoneCode] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [webSiteErrorMessage, setWebsiteErrorMessage] = useState("");
  const [street_address, setStreet] = useState("");
  const [streetErrorMessage, setStreetErrorMessage] = useState("");
  const [zip_code, setZipcode] = useState("");
  const [zipCodeErrorMessage, setZipcodeErrorMessage] = useState("");
  const [leadSourceErrorMessage, setLeadSourceErrMsg] = useState("");
  const [leadStatusErrorMessage, setLeadStatusErrMsg] = useState("");
  const [owner_id, setOwner] = useState("");
  const [ownerErr, setOwnerErr] = useState("");
  const [companyErr, setCompanyErr] = useState("");
  const [description, setdescription] = useState("");
  const [imgData, setImgData] = useState(null);
  const [imgUrl, setImgurl] = useState(null);
  const [isEmailValid, setEmailValid] = useState(true);
  const [imgDataTemp, setImgDatatemp] = useState(false);
  const [phoneFlag, setPhoneFlag] = useState(false);
  const [stateInfo, setStateInfo] = useState([]);
  const [OwnerValue, setOwnerValue] = useState("");
  const [isoCode, setIsoCode] = useState("");
  const [Invalid_data, setInvalidData] = useState(false);
  // const current_page = localStorage.getItem("current_page");

  // dropdown crud
  const [fieldName, setFieldName] = useState();
  const [fieldID, setFieldID] = useState();
  const [itemValue, setItemValue] = useState("");
  const [fieldErrMsg, setFieldErrMsg] = useState("");
  const [show, setShow] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [isZip, setIsZip] = useState(false);
  const [srchUser, setSrchUser] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveAndNewLoader, setSaveAndNewLoader] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const placeholderText = "Enter";
  const dropdownError = "Please select";
  const canNotempty = "can't be empty";

  // useEffect(() => {
  //   if (current_page) {
  //     setSearchParams({ page: current_page})
  //   }
  // }, [])

  const getLeadStatus = () => {
    LeadAPI.getLeadStatusData()
      .then((response) => {
        setLeadStatusArray(response?.data);
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const getLeadSourceData = () => {
    LeadAPI.getLeadSourceData()
      .then((response) => setLeadSourceArray(response?.data))
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const getIndustry = () => {
    LeadAPI.getIndustry()
      .then((response) => setLeadIndustryArray(response?.data))
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const getCompanySize = () => {
    LeadAPI.getCompanySize()
      .then((response) => setCompnySizeArray(response?.data))
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
  const stateClear = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber(phone_code);
    setcompany("");
    setlead_source("");
    setLead_status("");
    setindustry("");
    setcompany_size("");
    setWebsite("");
    setStreet("");
    setstate("");
    setCity("");
    setZipcode("");
    setdescription("");
    setdesignation("");
    setcountry("");
    setfindState([]);
    setImgData(defaultProfile);
    setImgurl(null);
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
      setFirstNameErrorMessage(`First name ${canNotempty}`);
    } else if (!NAMES_REGEX.test(e.target.value)) {
      setFirstNameErrorMessage("Please enter a valid first name");
      isFname = true;
    } else {
      setFirstNameErrorMessage("");
      isFname = false;
    }
  };

  const handleLastnameChanges = (e) => {
    setLastName(e.target.value);
    if (!NAMES_REGEX.test(e.target.value)) {
      setLastNameErrorMessage("Please enter a valid last name");
      isLname = true;
    } else {
      setLastNameErrorMessage("");
      isLname = false;
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!EMAIL_REGEX.test(e?.target?.value)) {
      setEmailValid(false);
      setEmailErrorMessage("Please enter a valid email Id");
    } else {
      setEmailValid(true);
      setEmailErrorMessage("");
    }
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

  const handleDesignationChange = (e) => {
    setdesignation(e.target.value);
  };

  const handleLeadSourceChange = (e) => {
    setlead_source(e.target.value);
    if (e.target.value) {
      setLeadSourceErrMsg("");
    }
  };

  const handleLeadStatusChange = (e) => {
    setLead_status(e.target.value);
    if (e.target.value) {
      setLeadStatusErrMsg("");
    }
  };

  const handlePhoneChanges = (value, data, event, formattedValue) => {
    const countryCode = "+" + data.dialCode;
    setPhoneNumber(formattedValue);
    setPhoneCode(countryCode);
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

  const handleWebsiteChanges = (e) => {
    if (!WEBSITE_REGEX.test(e?.target?.value)) {
      setWebsite(e.target.value);
      setWebsiteErrorMessage("Please enter Website");
      setWebsiteErrorMessage("");
    } else {
      setWebsite(e.target.value);
      setWebsiteErrorMessage("");
    }
  };

  const handleStreetChanges = (e) => {
    if (!STREET_REGEX.test(e?.target?.value)) {
      setStreet(e.target.value);
      setStreetErrorMessage("Please enter Street Name");
      setStreetErrorMessage("");
    } else {
      setStreet(e.target.value);
      setStreetErrorMessage("");
    }
  };

  const handleZipcodeChanges = (e) => {
    setZipcode(e.target.value);
    if (e.target.value && !ZIPCODE_REGEX.test(e?.target?.value)) {
      setZipcodeErrorMessage("Please enter valid zip code");
    } else if (e.target.value?.length < 3 && e.target.value !== "") {
      setZipcodeErrorMessage("Enter zip code with length 3-12");
      setIsZip(true);
    } else {
      setZipcodeErrorMessage("");
      setIsZip(false);
    }
  };

  useEffect(() => {
    findState.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    getEditDetail();
    setOwnerValue(userInfo?.full_name);
    setOwner(id);
    getLeadStatus();
    getLeadSourceData();
    getIndustry();
    getCompanySize();
  }, []);

  useEffect(() => {
    let data = State?.getStatesOfCountry(isoCode);
    setfindState(data);
  }, [isoCode]);

  useEffect(() => {
    City.getCitiesOfState(stateInfo[0]?.countryCode, stateInfo[0]?.isoCode);
  }, [stateInfo]);

  const isBackValidation = (data) => {
    if (
      data?.lead_owner?.id &&
      data?.contact_detail?.first_name &&
      data?.contact_detail?.last_name &&
      data?.contact_detail?.email &&
      data?.contact_detail?.company_name &&
      data?.lead_source?.id &&
      data?.status?.id
    ) {
      isTrue = true;
    }
  };

  const getEditDetail = () => {
    isTrue = false;
    let id = leadId ? leadId : createId;
    if (id) {
      LeadAPI.getByid(id)
        .then((resp) => {
          const data = resp?.data?.attributes;
          setImgData(data?.profile_photo?.url);
          setFirstName(data?.contact_detail?.first_name);
          setLastName(data?.contact_detail?.last_name);
          setEmail(data?.contact_detail?.email);
          setPhoneNumber(
            data?.contact_detail?.country_code +
              " " +
              data?.contact_detail?.phone_number
          );
          setOwner(data?.lead_owner?.id);
          setOwnerValue(data?.lead_owner?.full_name);
          setPhoneCode(data?.contact_detail?.country_code);
          setcompany(data?.contact_detail?.company_name);
          setdesignation(data?.contact_detail?.designation);
          setlead_source(data?.lead_source?.id);
          setLead_status(data?.status?.id);
          setindustry(data?.industry?.id || "");
          setcompany_size(data?.company_size?.id || "");
          setWebsite(data?.website || "");
          setStreet(data?.lead_address?.street || "");
          setstate(
            data?.lead_address?.state ? { name: data?.lead_address?.state } : ""
          );
          setCity(
            data?.lead_address?.city ? { name: data?.lead_address?.city } : ""
          );
          setZipcode(data?.lead_address?.zip_code || "");
          setdescription(data?.description || "");
          setImgDatatemp(false);
          setcountry(
            data?.lead_address?.country
              ? { name: data?.lead_address?.country }
              : ""
          );
          MapDataOnEdit(data?.lead_address);
          isBackValidation(data);
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
  const MapDataOnEdit = (Val) => {
    //to get states acc to country
    const getCountry = Country.getAllCountries();
    let getContry = getCountry.filter((eve) => eve?.name === Val?.country);
    setIsoCode(getContry[0]?.isoCode);

    //to get cities acc to state
    let dataCity = State?.getStatesOfCountry(getContry[0]?.isoCode);
    let getState = dataCity.filter((eve) => eve?.name === Val?.state);
    setStateInfo(getState);
  };

  const handleValidation = () => {
    if (!email) {
      setEmailErrorMessage(`Email ${canNotempty}`);
    }
    if (!first_name) {
      setFirstNameErrorMessage(`First name ${canNotempty}`);
    }
    if (!last_name) {
      setLastNameErrorMessage(`Last name ${canNotempty}`);
    }
    if (!OwnerValue) {
      setOwnerErr("Please select lead owner");
    }
    if (phoneFlag) {
      setPhoneErrorMessage("Please enter valid contact");
    }
    if (!lead_source_id) {
      setLeadSourceErrMsg(`${dropdownError} lead source`);
    }
    if (!status_id) {
      setLeadStatusErrMsg(`${dropdownError} lead status`);
    }
    if (!company_name) {
      setCompanyErr(`Company name ${canNotempty}`);
    }
  };

  const handleSaveClick = (saveAndNew) => {
    if (!saveAndNew) {
      setLoading(true);
    } else {
      setSaveAndNewLoader(true);
    }
    handleValidation();

    if (isValidForm()) {
      const formData = createFormData();
      let operation;
      if (param_id) {
        operation = LeadAPI.update(formData, param_id);
      } else {
        operation = LeadAPI.create(formData);
      }

      operation
        .then((response) => {
          if (response?.data) {
            const successMessage = param_id
              ? "Lead updated successfully!"
              : "Lead Created Successfully";
            Toaster.TOAST(successMessage, "success");
            if (saveAndNew) {
              setIsBack(false);
              // setNewLoading(true);
              navigate(`/lead/create`);
            } else if (param_id) {
              navigate(`/lead/${param_id}/overview`);
            } else {
              navigate(`/lead/${response?.data?.attributes?.id}/overview`);
            }

            localStorage.setItem(
              "useDataPopup",
              JSON.stringify(response?.data)
            );
            stateClear();
          }
          if (!saveAndNew) {
            setLoading(false);
          } else {
            setSaveAndNewLoader(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          setSaveAndNewLoader(false);
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    } else {
      window.scrollTo(0, 0);
      if (!saveAndNew) {
        setLoading(false);
      } else {
        setSaveAndNewLoader(false);
      }
    }
  };

  const isValidForm = () => {
    return (
      email?.length !== 0 &&
      emailErrorMessage === "" &&
      first_name?.length !== 0 &&
      firstNameErrorMessage === "" &&
      last_name?.length !== 0 &&
      lastNameErrorMessage === "" &&
      ownerErr === "" &&
      lead_source_id?.length !== 0 &&
      owner_id?.length !== 0 &&
      company_name?.length !== 0 &&
      !isFname &&
      !isLname &&
      isEmailValid &&
      OwnerValue?.length !== 0 &&
      status_id?.length !== 0 &&
      !phoneFlag &&
      !isCompany &&
      !isZip
    );
  };

  const createFormData = () => {
    const formData = new FormData();
    formData.append("data[owner_id]", owner_id);
    formData.append("data[contact_detail][first_name]", first_name);
    formData.append("data[contact_detail][last_name]", last_name);
    formData.append("data[contact_detail][email]", email);
    formData.append("data[contact_detail][company_name]", company_name);
    formData.append(
      "data[contact_detail][phone_number]",
      phone_number?.replace(phone_code, "").trim()
    );
    formData.append("data[contact_detail][country_code]", phone_code);
    formData.append("data[contact_detail][designation]", designation);
    formData.append("data[contact_detail][title]", "Mr");
    formData.append("data[lead_source_id]", parseInt(lead_source_id));
    formData.append("data[status_id]", status_id);
    formData.append("data[website]", website || "");
    formData.append("data[industry_id]", industry || "");
    formData.append("data[company_size_id]", company_size || "");
    formData.append("data[address_attributes][street]", street_address || "");
    formData.append("data[address_attributes][state]", state?.name || "");
    formData.append("data[address_attributes][country]", country?.name || "");
    formData.append("data[address_attributes][city]", city?.name || "");
    formData.append("data[address_attributes][zip_code]", zip_code || "");
    formData.append("data[description]", description || "");
    if (imgDataTemp) {
      formData.append("data[profile_photo]", imgUrl);
    }
    return formData;
  };

  const handleOwner = (val) => {
    setOwner(val);
    if (val) {
      setOwnerErr("");
    } else {
      setOwnerErr("Please select lead owner");
    }
  };

  useEffect(() => {
    if (owner_id) {
      setOwnerErr("");
    }
  }, [owner_id]);

  useEffect(() => {
    if (!srchUser) {
      getLeadOwnerData();
    }
  }, [srchUser]);

  const getLeadOwnerData = (srchQuery) => {
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
        getLeadOwnerData(e);
      }
    }, 800),
    []
  );

  const getContactData = (event, newValue, isCheck) => {
    if (newValue) {
      setSrchUser(true);
    } else {
      setSrchUser(false);
    }
    if (event?.type !== undefined && event?.type !== "click") {
      setUserLoading(true);
      debounceSaveUser(newValue);
    }

    if (!isCheck) {
      if (userInfo?.full_name !== newValue) {
        setOwnerErr("Please select lead owner");
      } else {
        setOwnerErr("");
      }
    } else {
      setOwnerErr("");
    }
    setOwnerValue(newValue);
  };

  const handleBackBtn = () => {
    if (createId || leadId) {
      if (isTrue) {
        setIsBack(false);
        navigate(`/lead`);
      } else {
        setIsBack(true);
      }
    }
  };

  const handleCancel = () => {
    if (createId || leadId) {
      handleBackBtn();
    } else {
      navigate(`/lead`);
    }
  };

  useEffect(() => {
    handleFields();
  }, [crudField]);

  useEffect(() => {
    if (lead_source_id) {
      setLeadSourceErrMsg("");
    }
    if (status_id) {
      setLeadStatusErrMsg("");
    }
  }, [lead_source_id, status_id]);

  useEffect(() => {
    setItemValue(fieldName?.attributes?.name);
  }, [fieldName]);

  let deleteContent = {
    Name: fieldID?.attributes?.name,
    EditLabel: field_editLabel,
    ModuleName: module_name,
  };

  const handleFields = () => {
    switch (crudField) {
      case LEAD_SOURCE:
        field_editLabel = "Lead Source";
        field_placeholder = "Enter lead source";
        field_addLabel = "Source";
        break;

      case INDUSTRY:
        field_editLabel = "Industry";
        field_placeholder = "Enter an industry";
        field_addLabel = "Industry";
        break;

      case LEAD_STATUS:
        field_editLabel = "Lead Status";
        field_placeholder = "Enter a lead status";
        field_addLabel = "Status";
        break;

      case COMPANY_SIZE:
        field_editLabel = "Company Size";
        field_placeholder = "Enter a company size";
        field_addLabel = "Company Size";
        break;

      default:
        break;
    }
  };

  const handleModalClose = () => setShow(false);

  const handleFieldChange = (val) => {
    setItemValue(val);
  };

  const onAddPopup = (data, id) => {
    if (data === ADD_NEW) {
      setItemValue("");
      setFieldName("");
    }
    setOpenModal(!openModal);
  };

  const handleToCloseLT = () => {
    setOpenModal(!openModal);
    setFieldName();
    setFieldErrMsg("");
  };

  const handleShow = (data) => {
    setDisabled(true);
    handleDeleteClick(data?.id, false);
    setFieldID(data);
  };

  const handleEditClick = (event, data) => {
    setOpenModal(!openModal);
    setFieldName(data);
  };

  const handleDeleteClick = (id, associatedFlag) => {
    const deleteId = id ? id : fieldID?.id;
    let apiCall;
    switch (field_addLabel) {
      case LEAD_SOURCE:
        apiCall = LeadAPI.deleteLeadSource(deleteId, associatedFlag);
        break;
      case INDUSTRY:
        apiCall = LeadAPI.deleteIndustry(deleteId, associatedFlag);
        break;
      case LEAD_STATUS:
        apiCall = LeadAPI.deleteLeadStatus(deleteId, associatedFlag);
        break;
      case COMPANY_SIZE:
        apiCall = LeadAPI.deleteCompanySize(deleteId, associatedFlag);
        break;
      default:
        break;
    }
    handleDropdownItemDelete(apiCall);
  };

  const handleDropdownItemDelete = (apiCall) => {
    if (!apiCall) return;
    apiCall
      .then((res) => {
        Toaster.TOAST(res?.message, "success");
        switch (field_addLabel) {
          case LEAD_SOURCE:
            getLeadSourceData();
            setlead_source("");
            break;
          case INDUSTRY:
            getIndustry();
            setindustry("");
            break;
          case LEAD_STATUS:
            getLeadStatus();
            setLead_status("");
            break;
          case COMPANY_SIZE:
            getCompanySize();
            setcompany_size("");
            break;
          default:
            break;
        }
        handleModalClose();
        setDisabled(false);
      })
      .catch((error) => {
        if (error?.response?.data?.code === RECORD_EXIST) {
          setShow(true);
        }
        setDisabled(false);
        Toaster.TOAST(deleteMethodError(error), "error");
        console.log(error);
      });
  };

  const handleValid = () => {
    if (!itemValue) {
      setFieldErrMsg("Field can't be empty");
    }
  };

  const handleDropdownSubmit = () => {
    handleValid();
    let data = {};
    if (field_addLabel === LEAD_STATUS) {
      data = {
        data: {
          name: itemValue,
          status_type: module_name,
        },
      };
    } else {
      data = {
        data: {
          name: itemValue,
        },
      };
    }
    if (itemValue && !fieldErrMsg) {
      apiCallingEndPoints(data);
    }
  };

  const apiCallingEndPoints = (data) => {
    let apiCall;
    switch (field_addLabel) {
      case LEAD_SOURCE:
        apiCall = fieldName?.id
          ? LeadAPI.editLeadSource(fieldName.id, data)
          : LeadAPI.createLeadSource(data);
        break;
      case INDUSTRY:
        apiCall = fieldName?.id
          ? LeadAPI.editIndustry(fieldName.id, data)
          : LeadAPI.createIndustry(data);
        break;
      case LEAD_STATUS:
        apiCall = fieldName?.id
          ? LeadAPI.editLeadStatus(fieldName.id, data)
          : LeadAPI.createLeadStatus(data);
        break;
      case COMPANY_SIZE:
        apiCall = fieldName?.id
          ? LeadAPI.editCompanySize(fieldName?.id, data)
          : LeadAPI.createCompanySize(data);
        break;
      default:
        break;
    }

    handleDropdownsAPI(apiCall);
  };

  const handleDropdownsAPI = (apiCall) => {
    if (!apiCall) return;
    apiCall
      .then((response) => {
        if (response?.data) {
          setOpenModal(false);
          let successMessage = "";
          switch (field_addLabel) {
            case LEAD_SOURCE:
              successMessage = fieldName?.id
                ? "Lead source updated Successfully"
                : "Lead source created Successfully";
              getLeadSourceData();
              if (!fieldName?.id) {
                setlead_source(response?.data?.id);
              }
              break;
            case INDUSTRY:
              successMessage = fieldName?.id
                ? "Industry updated Successfully"
                : "Industry created Successfully";
              getIndustry();
              if (!fieldName?.id) {
                setindustry(response?.data?.id);
              }
              break;
            case LEAD_STATUS:
              successMessage = fieldName?.id
                ? "Lead status updated Successfully"
                : "Lead status created Successfully";
              getLeadStatus();
              if (!fieldName?.id) {
                setLead_status(response?.data?.id);
              }
              break;
            case COMPANY_SIZE:
              successMessage = fieldName?.id
                ? "Company Size updated Successfully"
                : "Company Size created Successfully";
              getCompanySize();
              if (!fieldName?.id) {
                setcompany_size(response?.data?.id);
              }
              break;
            default:
              break;
          }
          Toaster.TOAST(successMessage, "success");
          handleToCloseLT();
        }
      })
      .catch((error) => {
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
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
              <ArrowBackIcon
                className="Arrowbtn-mr"
                data-testid="arrow-btn"
                sx={{ color: isBack ? "#8c8da3" : "black" }}
                onClick={() => handleCancel()}
              />
              {leadId ? "Edit lead" : "Create lead"}
            </Typography>
            {isBack && (
              <Alert className="py-0 px-2" severity="error">
                Please fill all required fields & save!
              </Alert>
            )}
            <div className="ma-createMain-form">
              <div>
                <div>
                  <h1 className="detailstxt">Details</h1>
                </div>
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
                        data-testid="pic-btn"
                        className="changepic"
                        type="file"
                        onChange={onChangePicture}
                        component="label"
                      >
                        Change Picture
                        <input
                          data-testid="change-pic"
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
              <Box>
                <Grid container spacing={2} xs={12} md={8}>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    className={"createlead-detail-grid"}
                  >
                    <LeadOwnerDropdown
                      label="Lead Owner"
                      userLoading={userLoading}
                      placeholder="lead owner"
                      users={usersData}
                      owner_id={owner_id}
                      ownerErr={ownerErr}
                      OwnerValue={OwnerValue}
                      getContactData={getContactData}
                      handleOwner={handleOwner}
                      setFieldValue={() => {}}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    className={"createlead-detail-grid"}
                  >
                    <label className="labeltxt ">
                      <span className="requreiedField">*</span>First Name
                    </label>
                    <TextField
                      data-testid="first_name"
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
                      <span className="requreiedField">*</span>Last Name
                    </label>
                    <TextField
                      data-testid="last_name"
                      className="createlead-textField placeholder_field
"
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
                      inputProps={{ maxLength: 50 }}
                      helperText={
                        <span className="ma-error">{lastNameErrorMessage}</span>
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
                      <span className="requreiedField">*</span>Email
                    </label>
                    <TextField
                      data-testid="email"
                      className="createlead-textField placeholder_field
"
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
                    data-testid="phone_number"
                  >
                    <label className="labeltxt ">Contact</label>
                    <div className="ma-country-code">
                      <PhoneInput
                        country={"in"}
                        inputProps={{ "data-testid": "contact" }}
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
                    <label className="labeltxt ">
                      <span className="requreiedField">*</span>Company
                    </label>
                    <TextField
                      data-testid="company_name"
                      className="createlead-textField placeholder_field
"
                      fullWidth
                      id="company_name"
                      placeholder="Enter company name"
                      name="company_name"
                      value={company_name}
                      onChange={(e) => handleCompanyChange(e)}
                      helperText={
                        <span className="ma-error">{companyErr}</span>
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
                      <span className="requreiedField">*</span>Lead Source
                    </label>
                    <DropDownCrud
                      id={"lead_source_id"}
                      name={"lead_source_id"}
                      dataTestid={"lead_source"}
                      placeholder={"Select lead source"}
                      handleValueChange={handleLeadSourceChange}
                      itemId={lead_source_id}
                      errorMessage={leadSourceErrorMessage}
                      arrayData={leadSourceArray}
                      onAddDetail={onAddPopup}
                      handleEditClick={handleEditClick}
                      handleShow={handleShow}
                      addNew={"SOURCE"}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    className={"createlead-detail-grid"}
                  >
                    <label className="labeltxt ">
                      <span className="requreiedField">*</span> Lead Status
                    </label>
                    <DropDownCrud
                      id={"status_id"}
                      name={"status_id"}
                      dataTestid={"lead_status"}
                      placeholder={"Select lead status"}
                      handleValueChange={handleLeadStatusChange}
                      itemId={status_id}
                      errorMessage={leadStatusErrorMessage}
                      arrayData={leadStatusArray}
                      onAddDetail={onAddPopup}
                      handleEditClick={handleEditClick}
                      handleShow={handleShow}
                      addNew={"STATUS"}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    className={"createlead-detail-grid"}
                  >
                    <label className="labeltxt ">Industry</label>
                    <DropDownCrud
                      id={"industry"}
                      name={"industry"}
                      dataTestid={"industry"}
                      placeholder={"Select industry"}
                      handleValueChange={(e) => setindustry(e.target.value)}
                      itemId={industry}
                      errorMessage={""}
                      arrayData={leadIndustryArray}
                      onAddDetail={onAddPopup}
                      handleEditClick={handleEditClick}
                      handleShow={handleShow}
                      addNew={"Industry"}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    className={"createlead-detail-grid"}
                  >
                    <label className="labeltxt ">Company Size</label>
                    <DropDownCrud
                      id={"company_size"}
                      name={"company_size"}
                      dataTestid={"company_size"}
                      placeholder={"Select company size"}
                      handleValueChange={(e) => setcompany_size(e.target.value)}
                      itemId={company_size}
                      errorMessage={""}
                      arrayData={compnySizeArray}
                      onAddDetail={onAddPopup}
                      handleEditClick={handleEditClick}
                      handleShow={handleShow}
                      addNew={"Company Size"}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    className={"createlead-detail-grid"}
                  >
                    <label className="labeltxt ">Website</label>
                    <TextField
                      data-testid="website"
                      className="createlead-textField placeholder_field
"
                      fullWidth
                      id="website"
                      placeholder="www.google.com"
                      name="website"
                      value={website}
                      onChange={(e) => handleWebsiteChanges(e)}
                      helperText={
                        <span className="ma-error">{webSiteErrorMessage}</span>
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    className={"createlead-detail-grid"}
                  >
                    <label className="labeltxt ">Designation</label>
                    <TextField
                      data-testid="designation"
                      className="createlead-textField placeholder_field
"
                      fullWidth
                      id="designation"
                      placeholder="Enter designation "
                      name="designation"
                      value={designation}
                      onChange={(e) => handleDesignationChange(e)}
                      inputProps={{ maxLength: 50 }}
                    />
                  </Grid>
                </Grid>
              </Box>
              <div className={"createlead-detail-address"}>
                <h4 className="Addresstxt" data-testid="address_title">
                  Address{" "}
                </h4>
              </div>
              <Box>
                <Grid container spacing={2} xs={12} md={8}>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    className={"createlead-detail-grid"}
                  >
                    <label className="labeltxt ">Street </label>
                    <TextField
                      data-testid="street_address"
                      className="createlead-textField placeholder_field
"
                      fullWidth
                      id="street_address"
                      placeholder="4959 Eagle Street"
                      name="street_address"
                      onChange={(e) => handleStreetChanges(e)}
                      value={street_address}
                      helperText={
                        <span className="ma-error">{streetErrorMessage}</span>
                      }
                      inputProps={{ maxLength: 80 }}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    className={"createlead-detail-grid"}
                  >
                    <label className="labeltxt ">Zip Code </label>
                    <TextField
                      data-testid="zip_code"
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
                      inputProps={{ minLength: 3, maxLength: 12 }}
                    />
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
                        setcountry(item);
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    className={"createlead-detail-grid"}
                  >
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
                  <Grid
                    item
                    xs={12}
                    md={6}
                    className={"createlead-detail-grid"}
                  >
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
                  <Grid item xs={12} md={12} lg={12}>
                    <label className="labeltxt ">Description </label>
                    <TextField
                      data-testid="description"
                      className="createlead-textField placeholder_field"
                      id="description"
                      multiline
                      rows={2}
                      fullWidth
                      name=""
                      value={description}
                      placeholder="Write some description here"
                      onChange={(e) => setdescription(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Box>
            </div>
            <Grid className="mt-4" container xs={12} md={12} lg={12}>
              <Grid item className="ma-Divider-bar w-100 px-4 pb-3 pt-0">
                <div className="createlead-buttons ma-login-btn">
                  <ButtonLoader
                    loading={loading}
                    disabled={saveAndNewLoader || loading}
                    classStyle={"createlead-buttons__saveButton savebtntext"}
                    btnType={"submit"}
                    data-testid={"save-btn"}
                    title={leadId ? " UPDATE" : "SAVE"}
                    handleClick={() => handleSaveClick()}
                  />
                  {!leadId && (
                    <ButtonLoader
                      disabled={saveAndNewLoader || loading}
                      classStyle={"saveandedittext ms-3"}
                      data-testid={"SAVE_AND_NEW"}
                      variant={"outlined"}
                      title={"SAVE AND NEW"}
                      handleClick={() => handleSaveClick("saveAndNew")}
                    />
                  )}
                  <Button
                    className="ms-3 cancelbtn"
                    type="button"
                    data-testid="cancel-btn"
                    variant="outlined"
                    disabled={isBack ? true : false}
                    onClick={() => {
                      handleCancel();
                    }}
                  >
                    CANCEL
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Paper>
        )}

        {openModal && (
          <DropdownCreateEdit
            openModal={openModal}
            handleToCloseLT={handleToCloseLT}
            valueName={fieldName}
            editLabel={field_editLabel}
            addLabel={field_addLabel}
            placeholder={field_placeholder}
            handleSubmit={handleDropdownSubmit}
            itemValue={itemValue}
            handleChange={handleFieldChange}
            errMsg={fieldErrMsg}
            setErrMsg={setFieldErrMsg}
          />
        )}
        <DropdownDelete
          title={deleteContent}
          content={deleteContent}
          openDelete={show}
          handleClose={handleModalClose}
          handleDelete={handleDeleteClick}
        />
      </Box>
    </Box>
  );
};

export default Createlead;
