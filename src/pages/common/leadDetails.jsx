import React, { useState, useEffect, useContext, useCallback } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import "../../components/Leads/CreateLeads.css";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Country, State, City } from "country-state-city";
import { PipelineApi } from "../../apis/pipelineApi";
import { DataContext } from "../../context";
import LeadOwnerDropdown from "./LeadOwner";
import { PotentialApi } from "../../apis/PotentialApi";
import { DealsApi } from "../../apis/DealsApi";
import Select from "react-select";
import { Toaster } from "./Toaster";
import { userApi } from "../../apis/userApi";
import debouce from "lodash.debounce";
import { LeadAPI } from "../../apis/LeadApi";
import DropdownDelete from "./Dropdowns_Crud/DropdownDelete";
import DropdownCreateEdit from "./Dropdowns_Crud/DropdownCreateEdit";
import DropDownCrud from "./Dropdowns_Crud/Drodpown_CRUD";
import { Avatar } from "@mui/material";
import {
  EMAIL_REGEX,
  FIRSTNAME_REGEX,
  LASTNAME_REGEX,
  ZIPCODE_REGEX,
} from "../../utils/regexLists";
import "../../styles/global/common.css";
import "../../styles/custom/Create.css";
import { ButtonLoader } from "./ButtonLoader";
import {
  deleteMethodError,
  getMethodError,
  restMethodError,
} from "../../constants/errorMessages";
import { RECORD_EXIST, INVALID_ID_DATA } from "../../utils/constants";
import IncorrectId from "../../components/NotFound/IncorrectId";

let isFname = false;
let isLname = false;
let field_editLabel = "";
let field_placeholder = "";
let field_addLabel = "";

const LeadDetailsEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  // const [searchParams, setSearchParams] = useSearchParams();
  const leadId = params?.id;
  const splitLocation = location?.pathname.split("/");
  const module_name = splitLocation[1];
  const { crudField } = useContext(DataContext);
  const [leadStatusArray, setLeadStatusArray] = useState([]);
  const [leadSourceArray, setLeadSourceArray] = useState([]);
  const [leadIndustryArray, setLeadIndustryArray] = useState([]);
  const [compnySizeArray, setCompnySizeArray] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const user_info = JSON.parse(localStorage.getItem("user_info"));
  const [findState, setfindState] = useState([]);
  const [company_name, setcompany] = useState("");
  const [designation, setdesignation] = useState("");
  const [lead_source_id, setlead_source] = useState("");
  const [status_id, setLead_status] = useState("");
  const [industry, setindustry] = useState("");
  const [company_size, setcompany_size] = useState("");
  const [state, setstate] = useState("");
  const [city, setCity] = useState("");
  const [country, setcountry] = useState("");
  const [first_name, setFirstName] = useState(user_info?.first_name);
  const [last_name, setLastName] = useState(user_info?.last_name);
  const [email, setEmail] = useState(user_info?.email);
  const [phone_number, setPhoneNumber] = useState(
    user_info?.phone ? user_info?.phone : ""
  );
  const [phone_code, setPhoneCode] = useState("");
  const [description, setdescription] = useState("");
  const [website, setWebsite] = useState("");
  const [street_address, setStreet] = useState("");
  const [zip_code, setZipcode] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  const [zipCodeErrorMessage, setZipcodeErrorMessage] = useState("");
  const [leadSourceErrorMessage, setLeadSourceErrMsg] = useState("");
  const [leadStatusErrorMessage, setLeadStatusErrMsg] = useState("");
  const [companyErr, setCompanyErr] = useState("");
  const [imgData, setImgData] = useState(null);
  const [imgUrl, setImgurl] = useState(null);
  const [isEmailValid, setEmailValid] = useState(true);
  const [imgDataTemp, setImgDatatemp] = useState(false);
  const [OwnerValue, setOwnerValue] = useState("");
  const [phoneFlag, setPhoneFlag] = useState(false);
  const [isoCode, setIsoCode] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [ownerErr, setOwnerErr] = useState("");
  //dropdown crud
  const [fieldName, setFieldName] = useState();
  const [fieldID, setFieldID] = useState();
  const [itemValue, setItemValue] = useState("");
  const [fieldErrMsg, setFieldErrMsg] = useState("");
  const [show, setShow] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [isCompany, setIsCompany] = useState(false);
  const [isZip, setIsZip] = useState(false);
  const [srchUser, setSrchUser] = useState(false);
  const placeholderText = "Enter";
  const dropdownError = "Please select ";
  const canNotempty = "can't be empty";
  // loader
  const [loader, setLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [Invalid_data, setInvalidData] = useState(false);
  // const current_page = localStorage.getItem("current_page");

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

  const handlefirst_nameChanges = (e) => {
    let val = e.target.value;
    setFirstName(e.target.value);
    if (!val) {
      setFirstNameErrorMessage("First name can't be empty");
    } else if (!FIRSTNAME_REGEX.test(val)) {
      setFirstNameErrorMessage("Please enter a valid first name");
      isFname = true;
    } else {
      setFirstNameErrorMessage("");
      isFname = false;
    }
  };
  const handleLastnameChanges = (e) => {
    let val = e.target.value;
    setLastName(e.target.value);
    if (!e.target.value) {
      setLastNameErrorMessage("Last name can't be empty");
    } else if (!LASTNAME_REGEX.test(val)) {
      setLastNameErrorMessage("Please enter a valid last name");
      isLname = true;
    } else {
      setLastNameErrorMessage("");
      isLname = false;
    }
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!e.target.value) {
      setEmailErrorMessage("Email can't be empty");
    } else if (!EMAIL_REGEX.test(e?.target?.value)) {
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
    setOwnerValue(user_info?.full_name);
    setOwnerId(user_info?.id);
    getLeadStatus();
    getLeadSourceData();
    getIndustry();
    getCompanySize();
  }, []);

  useEffect(() => {
    let data = State?.getStatesOfCountry(isoCode);
    setfindState(data);
  }, [isoCode]);

  const checkModule = (response) => {
    const data = response?.data?.attributes;
    setOwnerId(
      data?.lead_details?.data?.attributes?.lead_owner?.id || user_info?.id
    );
    setOwnerValue(
      data?.lead_details?.data?.attributes?.lead_owner?.full_name
        ? data?.lead_details?.data?.attributes?.lead_owner?.full_name
        : user_info?.full_name
    );
    setImgData(data?.lead_details?.data?.attributes?.profile_photo?.url);
    setFirstName(data?.contact_detail?.first_name);
    setLastName(data?.contact_detail?.last_name);
    setEmail(data?.contact_detail?.email);
    setPhoneNumber(
      data?.contact_detail?.country_code +
        " " +
        data?.contact_detail?.phone_number
    );
    setPhoneCode(data?.contact_detail?.country_code);
    setcompany(data?.contact_detail?.company_name);
    setdesignation(data?.contact_detail?.designation);
    setlead_source(data?.lead_details?.data?.attributes?.lead_source?.id);
    setLead_status(data?.lead_details?.data?.attributes?.status?.id);
    setindustry(data?.lead_details?.data?.attributes?.industry?.id);
    setcompany_size(
      data?.lead_details?.data?.attributes?.company_size?.id || ""
    );
    setWebsite(data?.lead_details?.data?.attributes?.website);
    setStreet(data?.lead_details?.data?.attributes?.lead_address?.street);
    setstate(
      data?.lead_details?.data?.attributes?.lead_address?.state
        ? {
            name: data?.lead_details?.data?.attributes?.lead_address?.state,
          }
        : ""
    );
    setCity(
      data?.lead_details?.data?.attributes?.lead_address?.city
        ? {
            name: data?.lead_details?.data?.attributes?.lead_address?.city,
          }
        : ""
    );
    setZipcode(data?.lead_details?.data?.attributes?.lead_address?.zip_code);
    setdescription(data?.lead_details?.data?.attributes?.description);
    setImgDatatemp(false);
    setcountry(
      data?.lead_details?.data?.attributes?.lead_address?.country
        ? {
            name: data?.lead_details?.data?.attributes?.lead_address?.country,
          }
        : ""
    );
    MapDataOnEdit(data?.lead_details?.data?.attributes?.lead_address);
  };

  const getEditDetail = () => {
    let apiEndPoint = null;
    switch (splitLocation[1]) {
      case "pipeline":
        apiEndPoint = PipelineApi.getDataById(leadId);
        break;
      case "potential":
        apiEndPoint = PotentialApi.getDataById(leadId);
        break;
      case "deal":
        apiEndPoint = DealsApi.getDataById(leadId);
        break;
      default:
        break;
    }
    if (leadId && apiEndPoint) {
      apiEndPoint
        .then((resp) => {
          if (resp) {
            checkModule(resp);
          }
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
  };

  const handleValidation = () => {
    if (!email) {
      setEmailErrorMessage("Email " + canNotempty);
    }
    if (!first_name) {
      setFirstNameErrorMessage("First name " + canNotempty);
    }
    if (!last_name) {
      setLastNameErrorMessage("Last name " + canNotempty);
    }
    if (phoneFlag) {
      setPhoneErrorMessage("Please enter valid contact");
    }
    if (!lead_source_id) {
      setLeadSourceErrMsg(dropdownError + "lead source");
    }
    if (!status_id) {
      setLeadStatusErrMsg(dropdownError + "lead status");
    }
    if (!company_name) {
      setCompanyErr("Company " + canNotempty);
    }
    if (!OwnerValue) {
      setOwnerErr("Please select lead owner");
    }
  };

  const EditDetails = (body) => {
    const leadId = params?.id;
    setLoader(true);
    const handleSuccess = (moduleName) => {
      handleBack();
      Toaster.TOAST(`${moduleName} Updated Successfully`, "success");
    };

    const handleUpdate = (apiFunction, moduleName) => {
      apiFunction(body, leadId)
        .then((response) => {
          if (response?.data) {
            handleSuccess(moduleName);
          }
          setLoader(false);
        })
        .catch((error) => {
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    };

    switch (splitLocation[1]) {
      case "pipeline":
        handleUpdate(PipelineApi.updateLeadDetialsById, "Pipeline");
        break;
      case "potential":
        handleUpdate(PotentialApi.updateLeadDetialsById, "Potential");
        break;
      case "deal":
        handleUpdate(DealsApi.updateLeadDetialsById, "Deal");
        break;
      default:
        setLoader(false);
        break;
    }
  };

  const handleSaveClick = () => {
    handleValidation();
    if (
      ownerId &&
      lead_source_id &&
      status_id &&
      first_name &&
      last_name &&
      email &&
      company_name?.length !== 0 &&
      emailErrorMessage === "" &&
      zipCodeErrorMessage === "" &&
      lastNameErrorMessage === "" &&
      firstNameErrorMessage === "" &&
      ownerErr === "" &&
      !isFname &&
      !isLname &&
      isEmailValid &&
      OwnerValue?.length !== 0 &&
      phoneFlag === false &&
      !isCompany &&
      !isZip
    ) {
      const formData = new FormData();
      formData.append("data[lead][owner_id]", ownerId);
      formData.append("data[contact_detail][first_name]", first_name || "");
      formData.append("data[contact_detail][last_name]", last_name || "");
      formData.append("data[contact_detail][email]", email);
      formData.append("data[contact_detail][company_name]", company_name || "");
      // formData.append("data[contact_detail][phone_number]", phone_number?.replace(phone_code + " ", ''));
      formData.append(
        "data[contact_detail][phone_number]",
        phone_number?.replace(phone_code, "").trim()
      );
      formData.append("data[contact_detail][country_code]", phone_code || "");
      formData.append("data[contact_detail][designation]", designation || "");
      formData.append("data[lead][lead_source_id]", lead_source_id);
      formData.append("data[lead][company_name]", company_name || "");
      formData.append("data[lead][website]", website || "");
      formData.append("data[lead][industry_id]", industry || "");
      formData.append("data[lead][designation]", designation || "");
      formData.append("data[lead][company_size_id]", company_size || "");
      formData.append(
        "data[lead][address_attributes][street]",
        street_address || ""
      );
      formData.append(
        "data[lead][address_attributes][country]",
        country?.name || ""
      );
      formData.append(
        "data[lead][address_attributes][state]",
        state?.name || ""
      );
      formData.append("data[lead][address_attributes][city]", city?.name || "");
      formData.append(
        "data[lead][address_attributes][zip_code]",
        zip_code || ""
      );
      formData.append("data[lead][description]", description || "");
      formData.append("data[lead][status_id]", status_id);
      if (imgDataTemp) {
        formData.append("data[lead][profile_photo]", imgUrl);
      }
      EditDetails(formData);
    } else {
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    if (ownerId) {
      setOwnerErr("");
    }
  }, [ownerId]);

  const handleOwner = (val) => {
    setOwnerId(val?.id);
    if (val?.id) {
      setOwnerErr("");
    } else {
      setOwnerErr("Please select lead owner");
    }
  };

  useEffect(() => {
    if (!srchUser) {
      getLeadOwnerData();
    }
  }, [srchUser]);

  const getLeadOwnerData = (srchQuery) => {
    userApi
      .getUsers(srchQuery)
      .then((data) => {
        if (data?.data) {
          setUsersData(data?.data);
        } else {
          setUsersData([]);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const debounceSaveUser = useCallback(
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
      debounceSaveUser(newValue);
    }

    if (!isCheck) {
      if (user_info?.full_name !== newValue) {
        setOwnerErr("Please select lead owner");
      } else {
        setOwnerErr("");
      }
    } else {
      setOwnerErr("");
    }
    setOwnerValue(newValue);
  };

  const LeadOwnerDropDown = () => {
    return (
      <>
        {usersData && (
          <LeadOwnerDropdown
            label="Lead owner"
            placeholder="lead owner"
            users={usersData}
            owner_id={ownerId}
            ownerErr={ownerErr}
            OwnerValue={OwnerValue}
            getContactData={getContactData}
            handleOwner={handleOwner}
            setFieldValue={() => {}}
          />
        )}
      </>
    );
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

  const base64FileURL = (element, callback) => {
    let file = element;
    let reader = new window.FileReader();
    reader.onloadend = function (e) {
      setImgurl(e.target.result);
      callback(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // crud dropdown functionality

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

  const handleFields = () => {
    switch (crudField) {
      case "lead_source":
        field_editLabel = "Lead Source";
        field_placeholder = "Enter lead source";
        field_addLabel = "Source";
        break;
      case "industry":
        field_editLabel = "Industry";
        field_placeholder = "Enter an industry";
        field_addLabel = "Industry";
        break;
      case "company_size":
        field_editLabel = "Company Size";
        field_placeholder = "Enter a company size";
        field_addLabel = "Company Size";
        break;
      case "lead_status":
        field_editLabel = "Lead Status";
        field_placeholder = "Enter a status";
        field_addLabel = "Status";
        break;
      default:
        break;
    }
  };
  const handleModalClose = () => setShow(false);

  let deleteContent = {
    Name: fieldID?.attributes?.name,
    EditLabel: field_editLabel,
    ModuleName: module_name,
  };

  const handleFieldChange = (val) => {
    setItemValue(val);
  };

  const onAddPopup = (data) => {
    if (data === "add_new") {
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
      case "Source":
        apiCall = LeadAPI.deleteLeadSource(deleteId, associatedFlag);
        break;
      case "Industry":
        apiCall = LeadAPI.deleteIndustry(deleteId, associatedFlag);
        break;
      case "Company Size":
        apiCall = LeadAPI.deleteCompanySize(deleteId, associatedFlag);
        break;
      case "Status":
        apiCall = LeadAPI.deleteLeadStatus(deleteId, associatedFlag);
        break;
      default:
        break;
    }
    handleDropdownItemDelete(apiCall);
  };

  const handleDropdownItemDelete = (apiCall) => {
    if (!apiCall) return;
    setDisabled(true);
    apiCall
      .then((res) => {
        Toaster.TOAST(res?.message, "success");
        switch (field_addLabel) {
          case "Source":
            getLeadSourceData();
            setlead_source("");
            break;
          case "Industry":
            getIndustry();
            setindustry("");
            break;
          case "Company Size":
            getCompanySize();
            setcompany_size("");
            break;
          case "Status":
            getLeadStatus();
            setLead_status("");
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
    if (field_addLabel === "Status") {
      data = {
        data: {
          name: itemValue,
          status_type: "lead",
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
      case "Source":
        apiCall = fieldName?.id
          ? LeadAPI.editLeadSource(fieldName.id, data)
          : LeadAPI.createLeadSource(data);
        break;
      case "Industry":
        apiCall = fieldName?.id
          ? LeadAPI.editIndustry(fieldName.id, data)
          : LeadAPI.createIndustry(data);
        break;
      case "Company Size":
        apiCall = fieldName?.id
          ? LeadAPI.editCompanySize(fieldName?.id, data)
          : LeadAPI.createCompanySize(data);
        break;
      case "Status":
        apiCall = fieldName?.id
          ? LeadAPI.editLeadStatus(fieldName.id, data)
          : LeadAPI.createLeadStatus(data);
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
          let successMessage = "";
          switch (field_addLabel) {
            case "Source":
              successMessage = fieldName?.id
                ? "Lead source updated Successfully"
                : "Lead source created Successfully";
              getLeadSourceData();
              if (!fieldName?.id) {
                setlead_source(response?.data?.id);
              }
              break;
            case "Industry":
              successMessage = fieldName?.id
                ? "Industry updated Successfully"
                : "Industry created Successfully";
              getIndustry();
              if (!fieldName?.id) {
                setindustry(response?.data?.id);
              }
              break;
            case "Company Size":
              successMessage = fieldName?.id
                ? "Company Size updated Successfully"
                : "Company Size created Successfully";
              getCompanySize();
              if (!fieldName?.id) {
                setcompany_size(response?.data?.id);
              }
              break;
            case "Status":
              successMessage = fieldName?.id
                ? "Lead status updated Successfully"
                : "Lead status created Successfully";
              getLeadStatus();
              if (!fieldName?.id) {
                setLead_status(response?.data?.id);
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
                onClick={() => handleBack()}
              />
              Lead Details
            </Typography>

            <div className="ma-createMain-form">
              <div>
                <div>
                  <h1 className="detailstxt">Details</h1>
                </div>
                <div className="avatarimg_txt">
                  {imgDataTemp && (
                    <div className="image_container">
                      <img src={imgData} alt="file" data-testid="img" />
                    </div>
                  )}
                  {!imgDataTemp && (
                    <div>
                      {imgData && (
                        <div className="image_container">
                          <img src={imgData} alt="file" data-testid="img" />
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
                          data-testid="pic"
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
                    {LeadOwnerDropDown()}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    className={"createlead-detail-grid"}
                  >
                    <label className="labeltxt ">Website</label>
                    <TextField
                      className="createlead-textField placeholder_field"
                      fullWidth
                      id="website"
                      placeholder="www.google.com"
                      name="website"
                      value={website}
                      data-testid="website-1"
                      onChange={(e) => handleWebsiteChanges(e)}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    className={"createlead-detail-grid"}
                  >
                    <label className="labeltxt ">
                      <span className="requreiedField">*</span>
                      Lead Source
                    </label>
                    <DropDownCrud
                      dataTestid={"lead-source"}
                      id={"lead_source_id"}
                      name={"lead_source_id"}
                      placeholder={"Select lead source"}
                      handleValueChange={handleLeadSourceChange}
                      itemId={lead_source_id}
                      errorMessage={leadSourceErrorMessage}
                      arrayData={leadSourceArray}
                      onAddDetail={onAddPopup}
                      handleEditClick={handleEditClick}
                      handleShow={handleShow}
                      addNew={"Source"}
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
                      <span className="requreiedField">*</span>Lead Status
                    </label>
                    <DropDownCrud
                      dataTestid={"lead-status"}
                      id={"status_id"}
                      name={"status_id"}
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
                      dataTestid={"industry"}
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
                </Grid>
              </Box>
              <div className={"createlead-detail-address"}>
                <h4 className="Addresstxt">Address </h4>
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
                      className="createlead-textField placeholder_field"
                      fullWidth
                      id="street_address"
                      placeholder="4959 Eagle Street"
                      name="street_address"
                      data-testid="street"
                      onChange={(e) => handleStreetChanges(e)}
                      value={street_address}
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
                      rows={2}
                      fullWidth
                      value={zip_code}
                      placeholder="01234"
                      className="placeholder_field"
                      name="zip_code"
                      data-testid="zip"
                      onChange={(e) => handleZipcodeChanges(e)}
                      helperText={
                        <span className="ma-error">{zipCodeErrorMessage}</span>
                      }
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
                      data-testid="country"
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
                      data-testid="state"
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
                      data-testid="city"
                      placeholder="Select city"
                      options={City.getCitiesOfState(
                        state?.countryCode,
                        state?.isoCode
                      )}
                      // data-testid="city1"
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
                      helperText={
                        <span className="ma-error">error in city</span>
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <label className="labeltxt ">Description </label>
                    <TextField
                      className="m-0 placeholder_field"
                      id="description"
                      multiline
                      rows={2}
                      fullWidth
                      name=""
                      value={description}
                      data-testid="desc"
                      placeholder="Write some description here"
                      onChange={(e) => {
                        setdescription(e.target.value);
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
              <div className={"createlead-detail-address"}>
                <h3 className="Addresstxt">Contact Details </h3>
              </div>
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
                      className="createlead-textField placeholder_field"
                      fullWidth
                      placeholder={`${placeholderText} first name`}
                      name="first_name"
                      data-testid="fname"
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
                      helperText={
                        <span className="ma-error">
                          {firstNameErrorMessage}
                        </span>
                      }
                      inputProps={{ maxLength: 50 }}
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
                      className="createlead-textField placeholder_field"
                      fullWidth
                      id="last_name"
                      data-testid="lname"
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
                      helperText={
                        <span className="ma-error">{lastNameErrorMessage}</span>
                      }
                      value={last_name}
                      inputProps={{ maxLength: 50 }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    className={"createlead-detail-grid"}
                  >
                    <label className="labeltxt ">
                      <span className="requreiedField">*</span> Company
                    </label>
                    <TextField
                      className="createlead-textField placeholder_field"
                      fullWidth
                      id="company_name"
                      placeholder="Enter company name"
                      name="company_name"
                      value={company_name}
                      data-testid="company"
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
                    <label className="labeltxt ">Contact</label>
                    <div className="ma-country-code">
                      <PhoneInput
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
                    <label className="labeltxt ">
                      <span className="requreiedField">*</span>Email
                    </label>
                    <TextField
                      className="createlead-textField placeholder_field"
                      fullWidth
                      id="email"
                      placeholder="farhan@gmail.com"
                      name="email"
                      value={email}
                      data-testid="email"
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
                      inputProps={{ maxLength: 50 }}
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
                      className="createlead-textField placeholder_field"
                      fullWidth
                      id="designation"
                      placeholder="Enter designation "
                      name="designation"
                      data-testid="desig"
                      value={designation}
                      onChange={(e) => handleDesignationChange(e)}
                      inputProps={{ maxLength: 50 }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    className={"createlead-detail-grid"}
                  >
                    <div className="createlead-buttons ma-login-btn">
                      <ButtonLoader
                        loading={loader}
                        classStyle={
                          "createlead-buttons__saveButton savebtntext"
                        }
                        btnType={"submit"}
                        handleClick={() => handleSaveClick()}
                        testid={"save"}
                        title={"SAVE"}
                      />
                      <Button
                        className="cancelbtn"
                        type="button"
                        variant="outlined"
                        data-testid="cancel"
                        onClick={() => handleBack()}
                      >
                        CANCEL
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </Box>
            </div>
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

export default LeadDetailsEdit;
