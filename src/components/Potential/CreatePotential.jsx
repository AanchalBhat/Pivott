import React, { useContext, useEffect, useState } from "react";
//mui
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PotentialApi } from "../../apis/PotentialApi";
import { PipelineApi } from "../../apis/pipelineApi";
import ContactDetailForm from "../../pages/common/ContactDetail";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContactPerson from "../../pages/common/ContactPerson";
import { DataContext } from "../../context";
import { Alert, IconButton } from "@mui/material";
import LeadOwnerDropdown from "../../pages/common/LeadOwner";
import { Toaster } from "../../pages/common/Toaster";
import debouce from "lodash.debounce";
import { userApi } from "../../apis/userApi";
import { LeadAPI } from "../../apis/LeadApi";
import "../../styles/global/common.css";
import "../../styles/custom/Create.css";
import DropDownCrud from "../../pages/common/Dropdowns_Crud/Drodpown_CRUD";
import DropdownCreateEdit from "../../pages/common/Dropdowns_Crud/DropdownCreateEdit";
import DropdownDelete from "../../pages/common/Dropdowns_Crud/DropdownDelete";
import { Formik, Form } from "formik";
import ClearIcon from "@mui/icons-material/Clear";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { PotentialSchema } from "../../pages/common/ValidationSchema/PotentialSchema";
import {
  ADD_NEW,
  RECORD_EXIST,
  STAGE,
  TYPE,
  LEAD_SOURCE,
  INVALID_ID_DATA,
} from "../../utils/constants";
import { ButtonLoader } from "../../pages/common/ButtonLoader";
import CurrencyTextField from "../../pages/common/CurrencyField";
import { FormatDate, TodayDate } from "../../utils";
import {
  deleteMethodError,
  getMethodError,
  restMethodError,
} from "../../constants/errorMessages";
import IncorrectId from "../NotFound/IncorrectId";

let isTrue = false;

let field_editLabel = "";
let field_placeholder = "";
let field_addLabel = "";

const CreatePotential = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const [searchParams, setSearchParams] = useSearchParams();
  const module_name = location?.pathname.split("/")[1];
  const login_id = JSON.parse(localStorage.getItem("login_id"));
  const { crudField } = useContext(DataContext);
  const [usersData, setUsersData] = useState([]);
  const [OwnerValue, setOwnerValue] = useState("");
  const [lead_source_id, setLead] = useState("");
  const [account_name, setAccountName] = useState("");
  const [description, setdescription] = useState("");
  const [amount, setAmount] = useState("");
  const [campaign_sources, setCampaign] = useState("");
  const [next_step, setStep] = useState("");
  const [type, setType] = useState("");
  const [stage, setStage] = useState("");
  const [owner_id, setOwner] = useState(login_id);
  const [journey, setDate] = useState(TodayDate());
  const [potential_name, setPotentialName] = useState("");
  const [typeData, setTypeValues] = useState([]);
  const [stageData, setStageData] = useState([]);
  const [contact_detail_id, setContactId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [contactVal, setVal] = useState("");
  const [ownerError, setOwnerError] = useState("");
  const [sourceError, setSourceError] = useState("");
  const [filterData, setFilteredData] = useState([]);
  const [show, setShow] = useState(false);
  const [srchData, setSrchData] = useState(false);
  const [srchUser, setSrchUser] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [currency, setCurrency] = useState("");
  //crud state start
  const [moduleName, setModuleName] = useState();
  const [moduleID, setModuleID] = useState();
  const [moduleValue, setModuleValue] = useState("");
  const [moduleDeletePopup, setModuleDeletePopup] = useState(false);
  const [moduleEditPopup, setModuleEditPopup] = useState(false);
  const [moduleErrorMsg, setModuleErrorMsg] = useState("");
  //crud state end
  const page = 1;
  const pageSize = 20;
  const dropdownError = "Please select";
  const params = useParams();
  const potentialId = params?.id;
  const createId = params?.createId;
  let userInfo = JSON.parse(localStorage.getItem("user_info"));
  const [leadSourceArray, setLeadSourceArray] = useState([]);
  // loader states
  const [loading, setLoading] = useState(false);
  const [saveAndNewLoader, setSaveAndNewLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [Invalid_data, setInvalidData] = useState(false);
  // const current_page = localStorage.getItem("current_page");

  const [initialData, setInitialData] = useState({
    potential_name: "",
    account_name: "",
    closing_date: TodayDate(),
    owner_id: owner_id,
    next_step: "",
    description: "",
    contact_detail_id: "",
    lead_source_id: "",
    amount: "",
    potential_stage_id: "",
    campaign_sources: "",
    stage_type_id: "",
    isSaveAndNew: false,
    currency_id: "",
  });

  // useEffect(() => {
  //   if (current_page) {
  //     setSearchParams({ page: current_page})
  //   }
  // }, [])

  //crud dropdown delete title and content

  const getLeadSourceData = () => {
    LeadAPI.getLeadSourceData()
      .then((response) => setLeadSourceArray(response?.data))
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const handleBackBtn = () => {
    if (createId || potentialId) {
      if (isTrue) {
        setShow(false);
        navigate(`/potential`);
      } else {
        setShow(true);
      }
    }
  };

  useEffect(() => {
    if (owner_id) {
      setOwnerError("");
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
        setOwnerError(`${dropdownError} potential owner`);
      } else {
        setOwnerError("");
      }
    } else {
      setOwnerError("");
    }
    setOwnerValue(newValue);
  };

  const getTypeData = () => {
    const id = JSON.parse(localStorage.getItem("user_info"));
    PotentialApi.getType(id?.company_id)
      .then(function (response) {
        if (response?.data?.length > 0) {
          setTypeValues(response?.data);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const getStageData = () => {
    let id = JSON.parse(localStorage.getItem("user_info"));
    PotentialApi.getStageData(id?.company_id)
      .then(function (response) {
        if (response?.data?.length > 0) {
          setStageData(response?.data);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };
  const stateClear = () => {
    setAccountName("");
    setStage("");
    setDate("");
    setLead("");
    setOwner("");
    setOwnerValue("");
    setStep("");
    setdescription("");
    setType("");
    setCampaign("");
    setAmount("");
    setPotentialName("");
    setVal("");
    setContactId("");
    setCurrency("");
  };

  const EditDetails = (body, saveAndNew) => {
    let id = potentialId ? potentialId : createId;
    PotentialApi.update(body, id)
      .then(function (response) {
        if (response?.data) {
          if (saveAndNew) {
            navigate(`/potential/create`);
            setShow(false);
          } else if (potentialId) {
            navigate(`/potential/${potentialId}/overview`);
          } else {
            navigate(`/potential`);
          }
          stateClear();
          Toaster.TOAST("Potential Updated Successfully", "success");
        } else {
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
  };

  const createPotential = (data, saveAndNew) => {
    PotentialApi.create(data)
      .then(function (response) {
        if (response?.data) {
          if (saveAndNew) {
            navigate(`/potential/create`);
            setShow(false);
          } else {
            navigate(`/potential/${response?.data?.attributes?.id}/overview`);
          }
          stateClear();
          Toaster.TOAST("Potential Created Successfully", "success");
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
  };

  const isBackValidation = (val) => {
    if (
      val?.contact_detail?.id &&
      val?.potential_owner?.id &&
      val?.potential_name &&
      val?.account_name &&
      val?.potential_stage?.id &&
      val?.stage_type?.id &&
      val?.lead_source?.id
    ) {
      isTrue = true;
    }
  };

  const getFormValues = () => {
    isTrue = false;
    if (potentialId) {
      PotentialApi.getDataById(params?.id)
        .then(function (response) {
          if (response?.data) {
            let val = response?.data?.attributes;
            setAccountName(val?.account_name);
            setAmount(val?.amount);
            setStage(val?.potential_stage?.id);
            setDate(val?.closing_date);
            setLead(
              val?.lead_source?.id ||
              val?.lead_details?.data?.attributes?.lead_source?.id
            );
            setOwner(val?.potential_owner?.id);
            setOwnerValue(val?.potential_owner?.full_name);
            setPotentialName(val?.potential_name);
            setStep(val?.next_step);
            setdescription(val?.description);
            setType(val?.stage_type?.id);
            setCampaign(val?.campaign_sources);
            setContactId(val?.contact_detail?.id);
            setVal(val?.contact_detail?.full_name);
            setCurrency(val?.currency?.id);
            isBackValidation(val);
            setFormikData(val);
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

  const getFormValuesForCreate = () => {
    isTrue = false;
    var datetime = new Date();
    var now = datetime
      .toISOString()
      .replace(/T/, " ")
      .replace(/:00.000Z/, "");
    if (createId) {
      PotentialApi.getDataById(params?.createId)
        .then(function (response) {
          if (response?.data) {
            let val = response?.data?.attributes;
            setAccountName(val?.account_name);
            setAmount(val?.amount);
            setStage(val?.potential_stage?.id);
            setDate(val?.closing_date ? val?.closing_date : now);
            setLead(
              val?.lead_source?.id ||
              val?.lead_details?.data?.attributes?.lead_source?.id
            );
            setOwner(
              val?.potential_owner?.id ? val?.potential_owner?.id : login_id
            );
            setOwnerValue(val?.potential_owner?.full_name);
            setPotentialName(val?.potential_name);
            setStep(val?.next_step);
            setdescription(val?.description);
            setType(val?.stage_type?.id);
            setCampaign(val?.campaign_sources);
            setContactId(val?.contact_detail?.id);
            setVal(val?.contact_detail?.full_name);
            setCurrency(val?.currency?.id || userInfo?.currency?.id);
            isBackValidation(val);
            setFormikData(val);
          }
        })
        .catch((error) => {
          Toaster.TOAST(getMethodError(error), "error");
          console.log(error);
        });
    }
  };

  useEffect(() => {
    getTypeData();
    getStageData();
    getLeadSourceData();
    getFormValues();
    getFormValuesForCreate();
    setOwner(login_id);
    setOwnerValue(userInfo?.full_name);
    if (!potentialId && !createId) {
      setCurrency(userInfo?.currency?.id);
    }
  }, []);

  const setFormikData = (val) => {
    setInitialData({
      potential_stage_id: val?.potential_stage?.id,
      stage_type_id: val?.stage_type?.id,
      account_name: val?.account_name,
      journey: val?.closing_date,
      owner_id: val?.owner_id ? val?.owner_id : login_id,
      amount: val?.amount,
      potential_name: val?.potential_name,
      next_step: val?.next_step,
      description: val?.description,
      campaign_sources: val?.campaign_sources,
      contact_detail_id: val?.contact_detail?.id,
      lead_source_id: val?.lead_source?.id,
      currency_id: val?.currency?.id,
    });
  };

  const handleSaveClick = (saveAndNew) => {
    if (!saveAndNew) {
      setLoading(true);
    } else {
      setSaveAndNewLoader(true);
    }
    var datetime = new Date();
    var now = datetime
      .toISOString()
      .replace(/T/, " ")
      .replace(/:00.000Z/, "");
    let data = {
      account_name: account_name,
      potential_name: potential_name,
      lead_source_id: parseInt(lead_source_id),
      currency_id: parseInt(currency),
      owner_id: parseInt(owner_id ? owner_id : login_id),
      next_step: next_step,
      description: description,
      amount: parseInt(amount),
      potential_stage_id: parseInt(stage),
      campaign_sources: campaign_sources,
      stage_type_id: parseInt(type),
      contact_detail_id: parseInt(contact_detail_id),
      closing_date: journey ? journey : now,
    };
    if (potentialId || createId) {
      EditDetails(data, saveAndNew);
    } else {
      createPotential(data, saveAndNew);
    }
  };

  const GetContactDetailsList = (srchQuery) => {
    PipelineApi.getContactDetails(srchQuery, page, pageSize)
      .then(function (response) {
        setUserLoading(true);
        if (response?.data?.length > 0) {
          setFilteredData(response?.data);
          setUserLoading(false);
        } else {
          setFilteredData([]);
          setUserLoading(false);
        }
      })
      .catch((error) => {
        setUserLoading(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const debounceSave = React.useCallback(
    debouce(function (e) {
      if (e) {
        GetContactDetailsList(e);
      }
    }, 800),
    []
  );

  useEffect(() => {
    if (!srchData) {
      GetContactDetailsList();
    }
  }, [srchData]);

  const FilterData = (event, value, check = 0) => {
    if (value) {
      setSrchData(true);
    } else {
      setSrchData(false);
    }
    if (event?.type !== "click") {
      setUserLoading(true);
      debounceSave(value);
    }
    setVal(value);
    if (check === -1) {
      return;
    }
    let flag = false;
    const temp = filterData;
    temp?.filter((elem) => {
      if (flag) {
        return null;
      }
      if (elem?.attributes?.full_name === value) {
        flag = true;
      }
    });
  };

  const contactDropDown = (setFieldValue, touched, errors) => {
    return (
      <ContactPerson
        userLoading={userLoading}
        getContactValue={setFieldValue}
        filterData={filterData}
        contactVal={contactVal}
        FilterData={FilterData}
        onAddDetail={onAddDetail}
        setContactId={setContactId}
        helperText={
          <span className="ma-error">
            {touched.contact_detail_id && errors.contact_detail_id}
          </span>
        }
      />
    );
  };

  const onAddDetail = () => {
    setOpenModal(!openModal);
  };

  const handleCancel = () => {
    if (createId || potentialId) {
      handleBackBtn();
    } else {
      navigate(`/potential`);
    }
  };

  //common functionality for crud dropdown
  let deleteContent = {
    Name: moduleID?.attributes?.name,
    EditLabel: field_editLabel,
    ModuleName: module_name,
  };

  const handleFields = () => {
    switch (crudField) {
      case STAGE:
        field_editLabel = "Potential Stage";
        field_placeholder = "Enter stage";
        field_addLabel = "Stage";
        break;
      case TYPE:
        field_editLabel = "Type";
        field_placeholder = "Enter type";
        field_addLabel = "Type";
        break;
      case LEAD_SOURCE:
        field_editLabel = "Lead Source";
        field_placeholder = "Enter lead source";
        field_addLabel = "Source";
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    handleFields();
  }, [crudField]);

  useEffect(() => {
    setModuleValue(moduleName?.attributes?.name);
  }, [moduleName]);

  useEffect(() => {
    if (lead_source_id) {
      setSourceError("");
    }
  }, [lead_source_id]);

  const handleModuleChange = (val) => {
    setModuleValue(val);
  };

  const closeDeletePopup = () => setModuleDeletePopup(false);

  const onAddnewPopup = (data) => {
    if (data === ADD_NEW) {
      setModuleValue("");
      setModuleName("");
    }
    setModuleEditPopup(!moduleEditPopup);
  };

  const handleToCloseLT = () => {
    setModuleEditPopup(!moduleEditPopup);
    setModuleName("");
    setModuleErrorMsg("");
  };

  const openDeletePopup = (data) => {
    handleDeleteClick(data?.id, false);
    setModuleID(data);
  };

  const openEditPopup = (event, data) => {
    setModuleEditPopup(!moduleEditPopup);
    setModuleName(data);
  };

  const handleValid = () => {
    if (!moduleValue) {
      setModuleErrorMsg("Field can't be empty");
    }
  };

  const handleDeleteClick = (id, associatedFlag) => {
    const deleteId = id ? id : moduleID?.id;
    let apiCall;

    switch (field_addLabel) {
      case STAGE:
        apiCall = PotentialApi.deleteStageData(deleteId, associatedFlag);
        break;
      case TYPE:
        apiCall = PotentialApi.deleteTypeData(deleteId, associatedFlag);
        break;
      case LEAD_SOURCE:
        apiCall = LeadAPI.deleteLeadSource(deleteId, associatedFlag);
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
          case STAGE:
            getStageData();
            setStage("");
            setInitialData({ ...initialData, potential_stage_id: "" });
            break;
          case TYPE:
            getTypeData();
            setType("");
            setInitialData({ ...initialData, stage_type_id: "" });
            break;
          case LEAD_SOURCE:
            getLeadSourceData();
            setLead("");
            setInitialData({ ...initialData, lead_source_id: "" });
            break;
          default:
            break;
        }
        closeDeletePopup();
        setDisabled(false);
      })
      .catch((error) => {
        if (error?.response?.data?.code === RECORD_EXIST) {
          setModuleDeletePopup(true);
        }
        setDisabled(false);
        Toaster.TOAST(deleteMethodError(error), "error");
        console.log(error);
      });
  };

  const addModuleDataSubmit = (setFieldValue) => {
    handleValid();
    let data = {};
    if (field_addLabel === STAGE || field_addLabel === LEAD_SOURCE) {
      data = {
        data: {
          name: moduleValue,
        },
      };
    } else if (field_addLabel === TYPE) {
      data = {
        data: {
          name: moduleValue,
          section: module_name,
        },
      };
    }
    if (moduleValue && !moduleErrorMsg) {
      apiCallingEndPoints(data, setFieldValue);
    }
  };

  const apiCallingEndPoints = (data, setFieldValue) => {
    let apiCall;
    switch (field_addLabel) {
      case STAGE:
        apiCall = moduleName?.id
          ? PotentialApi.editStageData(moduleName.id, data)
          : PotentialApi.createStageData(data);
        break;
      case TYPE:
        apiCall = moduleName?.id
          ? PotentialApi.editTypeData(moduleName.id, data)
          : PotentialApi.createTypeData(data);
        break;
      case LEAD_SOURCE:
        apiCall = moduleName?.id
          ? LeadAPI.editLeadSource(moduleName.id, data)
          : LeadAPI.createLeadSource(data);
        break;
      default:
        break;
    }
    handleDropdownsAPI(apiCall, setFieldValue);
  };

  const handleDropdownsAPI = (apiCall, setFieldValue) => {
    if (!apiCall) return;
    apiCall
      .then((response) => {
        if (response?.data) {
          let successMessage = "";
          switch (field_addLabel) {
            case STAGE:
              successMessage = moduleName?.id
                ? "Potential stage updated Successfully"
                : "Potential stage created Successfully";
              getStageData();
              if (!moduleName?.id) {
                setStage(response?.data?.id);
                setFieldValue("potential_stage_id", response?.data?.id);
              }
              break;
            case TYPE:
              successMessage = moduleName?.id
                ? "Potential type updated Successfully"
                : "Potential type created Successfully";
              getTypeData();
              if (!moduleName?.id) {
                setType(response?.data?.id);
                setFieldValue("stage_type_id", response?.data?.id);
              }
              break;
            case LEAD_SOURCE:
              successMessage = moduleName?.id
                ? "Lead source updated Successfully"
                : "Lead source created Successfully";
              getLeadSourceData();
              if (!moduleName?.id) {
                setLead(response?.data?.id);
                setFieldValue("lead_source_id", response?.data?.id);
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

  // date
  const handleDateChange = (newValue, setFieldValue) => {
    let formated_date = FormatDate(newValue?.$d);
    setDate(formated_date);
    setFieldValue("closing_date", formated_date);
  };

  const clearDate = (setFieldValue) => {
    setOpenCalendar(false); // Close the calendar
    setDate(null); // Clear the date
    setFieldValue("closing_date", null); // Clear the date
  };

  return (
    <Box className="ma-leads-box" sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{ flexGrow: 1 }}
        className="ma-mainTop-box mainBox p-0"
      >
        {Invalid_data ? (
          <IncorrectId />
        ) : (
          <Paper elevation={2} className={"ma-mainShadow-box createlead-page"}>
            <Typography
              className={"createlead-heading justify-content-between"}
            >
              <div>
                <ArrowBackIcon
                  className="Arrowbtn-mr"
                  sx={{ color: show ? "#8c8da3" : "black" }}
                  onClick={() => handleCancel()}
                />
                {potentialId ? "Edit Potential" : "Create Potential"}
              </div>
              {show && (
                <Alert className="py-0 px-2" severity="error">
                  Please fill all required fields & save!
                </Alert>
              )}
            </Typography>
            <Formik
              enableReinitialize={createId || potentialId || moduleDeletePopup}
              initialValues={initialData}
              validationSchema={PotentialSchema}
              onSubmit={(values, { resetForm, setSubmitting }) => {
                setSubmitting(false);
                if (values.isSaveAndNew) {
                  handleSaveClick("saveAndNew");
                  resetForm();
                } else {
                  handleSaveClick();
                }
              }}
            >
              {({ isValid, errors, touched, values, setFieldValue, isSubmitting }) => {
                if (Object.keys(errors).length > 0 && isSubmitting) {
                  Toaster.TOAST("Please fill all the required fields", "error");
                  window.scrollTo(0, 0);
                }
                return (
                  <Form autoComplete="off">
                    <div className="ma-createMain-form">
                      <div>
                        <h1 className="detailstxt">
                          <span className="requreiedField">*</span>Contact Person
                        </h1>
                        <div className="ma-filedbtn-contact align-items-center">
                          <Box>
                            <Grid container spacing={2} alignItems="center">
                              <Grid
                                item
                                xs={6}
                                md={4}
                                className={"createlead-detail-grid pt-0"}
                              >
                                {contactDropDown(setFieldValue, touched, errors)}
                              </Grid>
                            </Grid>
                          </Box>
                        </div>
                        {openModal && (
                          <ContactDetailForm
                            setContactId={setContactId}
                            setFieldValue={setFieldValue}
                            setVal={setVal}
                            setOpenModal={setOpenModal}
                            handleFunction={FilterData}
                            GetContactDetailsList={GetContactDetailsList}
                          />
                        )}
                      </div>
                      <div>
                        <div>
                          <h1 className="detailstxt mt-3">Details</h1>
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
                            {usersData && (
                              <LeadOwnerDropdown
                                label="Potential Owner"
                                userLoading={userLoading}
                                placeholder="potential owner"
                                users={usersData}
                                owner_id={owner_id}
                                ownerErr={ownerError}
                                OwnerValue={OwnerValue}
                                setFieldValue={setFieldValue}
                                getContactData={getContactData}
                                handleOwner={setOwner}
                                helperText={
                                  <span className="ma-error">
                                    {touched.owner_id && errors.owner_id}
                                  </span>
                                }
                              />
                            )}
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            className={"createlead-detail-grid"}
                          >
                            <label className="labeltxt ">Amount</label>
                            <CurrencyTextField
                              field="amount"
                              currency={currency}
                              setCurrency={setCurrency}
                              expected_revenue={amount}
                              setRevenue={setAmount}
                              setFieldValue={setFieldValue}
                              setValidValue={() => { }}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            className={"createlead-detail-grid"}
                          >
                            <label className="labeltxt ">
                              <span className="requreiedField">*</span> Potential
                              Name
                            </label>
                            <TextField
                              className="createlead-textField placeholder_field"
                              fullWidth
                              data-testid="potential-name"
                              id="potential_name"
                              placeholder="Enter potential name"
                              name="potential_name"
                              value={potential_name}
                              onChange={(event) => {
                                setFieldValue(
                                  "potential_name",
                                  event.target.value
                                );
                                setPotentialName(event.target.value);
                              }}
                              helperText={
                                <span className="ma-error">
                                  {touched.potential_name &&
                                    errors.potential_name}
                                </span>
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
                            <label className="labeltxt ">Closing Date</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                disablePast
                                value={journey}
                                open={openCalendar}
                                onOpen={() => setOpenCalendar(true)}
                                onClose={() => setOpenCalendar(false)}
                                onChange={(newValue) =>
                                  handleDateChange(newValue, setFieldValue)
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    name="Call Time"
                                    size="medium"
                                    id="closing date"
                                    placeholder="Nov 10,2022"
                                    onKeyDown={(e) => e.preventDefault()}
                                    onMouseDown={() => setOpenCalendar(true)}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <IconButton
                                            onClick={() =>
                                              clearDate(setFieldValue)
                                            }
                                            size="small"
                                            edge="end"
                                          >
                                            {journey && <ClearIcon />}
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
                          <Grid
                            item
                            xs={12}
                            md={6}
                            className={"createlead-detail-grid"}
                          >
                            <label className="labeltxt ">
                              <span className="requreiedField">*</span>
                              Account Name
                            </label>
                            <TextField
                              className="createlead-textField placeholder_field"
                              fullWidth
                              data-testid="account-name"
                              id="accnt_name"
                              placeholder="Google"
                              name="accnt_name"
                              value={account_name}
                              inputProps={{ maxLength: 80 }}
                              onChange={(event) => {
                                setFieldValue("account_name", event.target.value);
                                setAccountName(event.target.value);
                              }}
                              helperText={
                                <span className="ma-error">
                                  {touched.account_name && errors.account_name}
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
                              <span className="requreiedField">*</span>Stage
                            </label>
                            <DropDownCrud
                              dataTestid={"stage"}
                              id={"stage"}
                              name={"potential stage"}
                              placeholder={"Select potential stage"}
                              handleValueChange={(e) => {
                                setFieldValue(
                                  "potential_stage_id",
                                  e.target.value
                                );
                                setStage(e.target.value);
                              }}
                              itemId={stage}
                              arrayData={stageData}
                              onAddDetail={onAddnewPopup}
                              handleEditClick={openEditPopup}
                              handleShow={openDeletePopup}
                              addNew={"STAGE"}
                              helperText={
                                <span className="ma-error">
                                  {touched.potential_stage_id &&
                                    errors.potential_stage_id}
                                </span>
                              }
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
                              <span className="requreiedField">*</span>
                              Type
                            </label>
                            <DropDownCrud
                              dataTestid={"type"}
                              id={"type"}
                              name={"type"}
                              placeholder={"Select type"}
                              handleValueChange={(e) => {
                                setFieldValue("stage_type_id", e.target.value);
                                setType(e.target.value);
                              }}
                              itemId={type}
                              arrayData={typeData}
                              onAddDetail={onAddnewPopup}
                              handleEditClick={openEditPopup}
                              handleShow={openDeletePopup}
                              addNew={"TYPE"}
                              helperText={
                                <span className="ma-error">
                                  {touched.stage_type_id && errors.stage_type_id}
                                </span>
                              }
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
                              <span className="requreiedField">*</span>
                              Lead Source
                            </label>
                            <DropDownCrud
                              id={"lead_source_id"}
                              dataTestid={"lead-sources"}
                              name={"lead_source_id"}
                              placeholder={"Select lead source"}
                              handleValueChange={(e) => {
                                setFieldValue("lead_source_id", e.target.value);
                                setLead(e.target.value);
                              }}
                              itemId={lead_source_id}
                              errorMessage={sourceError}
                              arrayData={leadSourceArray}
                              onAddDetail={onAddnewPopup}
                              handleEditClick={openEditPopup}
                              handleShow={openDeletePopup}
                              addNew={"SOURCE"}
                              helperText={
                                <span className="ma-error">
                                  {touched.lead_source_id &&
                                    errors.lead_source_id}
                                </span>
                              }
                              disabled={disabled}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            className={"createlead-detail-grid"}
                          >
                            <label className="labeltxt ">Next Step</label>
                            <TextField
                              data-testid="next-step"
                              className="createlead-textField placeholder_field"
                              fullWidth
                              id="step"
                              placeholder="Enter next move"
                              name="step"
                              value={next_step}
                              onChange={(event) => {
                                setFieldValue("next_step", event.target.value);
                                setStep(event.target.value);
                              }}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            className={"createlead-detail-grid"}
                          >
                            <label className="labeltxt ">Campaign Source</label>
                            <TextField
                              data-testid="campaign-sources"
                              className="createlead-textField placeholder_field"
                              fullWidth
                              id="campaign"
                              placeholder="New campaign source"
                              name="campaign"
                              value={campaign_sources}
                              onChange={(event) => {
                                setFieldValue(
                                  "campaign_sources",
                                  event.target.value
                                );
                                setCampaign(event.target.value);
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <label className="labeltxt ">Description</label>
                            <TextField
                              id="manage_data"
                              multiline
                              rows={2}
                              data-testid="desc"
                              fullWidth
                              value={description}
                              name="manage_data"
                              className="placeholder_field"
                              placeholder="Write some description here"
                              onChange={(event) => {
                                setFieldValue("description", event.target.value);
                                setdescription(event.target.value);
                              }}
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
                            classStyle={
                              "createlead-buttons__saveButton savebtntext"
                            }
                            btnType={"submit"}
                            handleClick={() =>
                              setFieldValue("isSaveAndNew", false)
                            }
                            testid={"save-btn"}
                            title={potentialId ? " UPDATE" : "SAVE"}
                          />
                          {!potentialId && (
                            <ButtonLoader
                              disabled={saveAndNewLoader || loading}
                              classStyle={"ms-3 saveandedittext"}
                              btnType={"submit"}
                              handleClick={() =>
                                setFieldValue("isSaveAndNew", true)
                              }
                              testid={"save-new-btn"}
                              title={"SAVE AND NEW"}
                              variant={"outlined"}
                            />
                          )}
                          <Button
                            className="ms-3 cancelbtn"
                            variant="outlined"
                            disabled={show ? true : false}
                            // onClick={() => navigate("/potential")}
                            onClick={() => handleCancel()}
                            data-testid="cancel-btn"
                          >
                            CANCEL
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
                    {moduleEditPopup && (
                      <DropdownCreateEdit
                        openModal={moduleEditPopup}
                        handleToCloseLT={handleToCloseLT}
                        valueName={moduleName}
                        editLabel={field_editLabel}
                        addLabel={field_addLabel}
                        placeholder={field_placeholder}
                        handleSubmit={() => addModuleDataSubmit(setFieldValue)}
                        itemValue={moduleValue}
                        handleChange={handleModuleChange}
                        errMsg={moduleErrorMsg}
                        setErrMsg={setModuleErrorMsg}
                      />
                    )}
                  </Form>
                )
              }
              }
            </Formik>
          </Paper>
        )}

        <DropdownDelete
          title={deleteContent}
          content={deleteContent}
          openDelete={moduleDeletePopup}
          handleClose={closeDeletePopup}
          handleDelete={handleDeleteClick}
        />
      </Box>
    </Box>
  );
};

export default CreatePotential;
