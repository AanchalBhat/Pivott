import React, { useContext, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PipelineApi } from "../../apis/pipelineApi";
import ContactDetailForm from "../../pages/common/ContactDetail";
import ContactPerson from "../../pages/common/ContactPerson";
import debouce from "lodash.debounce";
import { DataContext } from "../../context";
import { Alert, IconButton } from "@mui/material";
import LeadOwnerDropdown from "../../pages/common/LeadOwner";
import { Toaster } from "../../pages/common/Toaster";
import { userApi } from "../../apis/userApi";
import "../../styles/custom/Create.css";
import DropDownCrud from "../../pages/common/Dropdowns_Crud/Drodpown_CRUD";
import DropdownCreateEdit from "../../pages/common/Dropdowns_Crud/DropdownCreateEdit";
import DropdownDelete from "../../pages/common/Dropdowns_Crud/DropdownDelete";
import { PotentialApi } from "../../apis/PotentialApi";
import { LeadAPI } from "../../apis/LeadApi";
import { Formik, Form } from "formik";
import ClearIcon from "@mui/icons-material/Clear";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { PipelineSchema } from "../../pages/common/ValidationSchema/PipelineSchema";
import {
  ADD_NEW,
  RECORD_EXIST,
  STAGE,
  SCORE,
  TYPE,
  LEAD_SOURCE,
  INVALID_ID_DATA,
} from "../../utils/constants";
import { ButtonLoader } from "../../pages/common/ButtonLoader";
import CurrencyTextField from "../../pages/common/CurrencyField";
import { FormatDate, TodayDate } from "../../utils";
import IncorrectId from "../NotFound/IncorrectId";
import {
  deleteMethodError,
  getMethodError,
  restMethodError,
} from "../../constants/errorMessages";

let isTrue = false;
let isContact = false;
let field_editLabel = "";
let field_placeholder = "";
let field_addLabel = "";

const CreatePipeline = () => {
  const navigate = useNavigate();
  // const [searchParams, setSearchParams] = useSearchParams();
  const login_id = JSON.parse(localStorage.getItem("login_id"));
  let id = JSON.parse(localStorage.getItem("user_info"));
  const { crudField } = useContext(DataContext);
  const [usersData, setUsersData] = useState([]);
  const [OwnerValue, setOwnerValue] = useState("");
  const [expected_revenue, setRevenue] = useState();
  const [journey, setDate] = useState(TodayDate());
  const [account_name, setAccountName] = useState("");
  const [description, setdescription] = useState("");
  const [campaign_sources, setCampaign] = useState("");
  const [next_step, setStep] = useState("");
  const [type, setType] = useState("");
  const [stage, setStage] = useState("");
  const [owner_id, setOwner] = useState(login_id);
  const [contact_detail_id, setContactId] = useState("");
  const [contactVal, setVal] = useState("");
  const [typeData, setTypeValues] = useState([]);
  const [stageData, setStageData] = useState([]);
  const [filterData, setFilteredData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currency, setCurrency] = useState("");

  //err state

  //dropdown_crud
  const [fieldName, setFieldName] = useState();
  const [fieldID, setFieldID] = useState();
  const [itemValue, setItemValue] = useState("");
  const [deleteDialogShow, setDeleteDialog] = useState(false);
  const [crudDialogShow, setCrudDialog] = useState(false);
  const [fieldErrMsg, setFieldErrMsg] = useState("");

  // lead source
  const [lead_source_id, setlead_source] = useState("");
  const [leadSourceArray, setLeadSourceArray] = useState([]);

  // pipiline score
  const [pipeline_score_id, setPipeline_score] = useState("");
  const [pipelineScoreArray, setPipelineScoreArray] = useState([]);

  const [show, setShow] = useState(false);
  const [srchData, setSrchData] = useState(false);
  const [srchUser, setSrchUser] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  //use state to fetch edit/convert data using formik
  const [initialData, setInitialData] = useState({
    pipeline_stage_id: "",
    stage_type_id: "",
    account_name: "",
    journey: TodayDate(),
    owner_id: owner_id,
    pipeline_score_id: "",
    expected_revenue: "",
    next_step: "",
    description: "",
    campaign_sources: "",
    contact_detail_id: "",
    lead_source_id: "",
    isSaveAndNew: false,
    currency_id: "",
  });
  const page = 1;
  const pageSize = 20;
  const params = useParams();
  const location = useLocation();
  const module_name = location?.pathname.split("/")[1];
  const pipelineId = params?.id;
  const createId = params?.createId;
  // loader states
  const [loading, setLoading] = useState(false);
  const [saveAndNewLoader, setSaveAndNewLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [Invalid_data, setInvalidData] = useState(false);
  // const current_page = localStorage.getItem("current_page");

  // useEffect(() => {
  //   if (current_page) {
  //     setSearchParams({ page: current_page})
  //   }
  // }, [])

  const getTypeData = () => {
    setOwnerValue(id?.full_name);
    setOwner(login_id);
    PipelineApi.getType(id?.company_id)

      .then((response) => {
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
    PipelineApi.getStageData(id?.company_id)

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
    setPipeline_score("");
    setlead_source("");
    setStage("");
    setDate();
    setRevenue("");
    setContactId("");
    setOwner();
    setOwnerValue("");
    setStep("");
    setdescription("");
    setType("");
    setCampaign("");
    setVal("");
    setCurrency("");
  };
  const EditDetails = (body, saveAndNew) => {
    if (!saveAndNew) {
      setLoading(true);
    } else {
      setSaveAndNewLoader(true);
    }
    let id = pipelineId ? pipelineId : createId;
    PipelineApi.update(body, id)
      .then(function (response) {
        if (response?.data) {
          if (saveAndNew) {
            navigate(`/pipeline/create`);
            setShow(false);
          } else if (pipelineId) {
            navigate(`/pipeline/${pipelineId}/overview`);
          } else {
            navigate(`/pipeline`);
          }

          Toaster.TOAST("Pipeline Updated Successfully", "success");
        }
        stateClear();
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
  const createPipeline = (data, saveAndNew) => {
    if (!saveAndNew) {
      setLoading(true);
    } else {
      setSaveAndNewLoader(true);
    }
    PipelineApi.create(data)

      .then(function (response) {
        if (response?.data) {
          if (saveAndNew) {
            navigate(`/pipeline/create`);
            setShow(false);
          } else {
            navigate(`/pipeline/${response?.data?.attributes?.id}/overview`);
          }
          Toaster.TOAST("Pipeline Created Successfully", "success");
          stateClear();
          isContact = false;
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
  const setFormikData = (val) => {
    setInitialData({
      pipeline_stage_id: val?.pipeline_stage?.id,
      stage_type_id: val?.stage_type?.id,
      account_name: val?.account_name,
      journey: val?.journey,
      owner_id: val?.owner_id ? val?.owner_id : login_id,
      pipeline_score_id: val?.pipeline_score?.id,
      expected_revenue: val?.expected_revenue,
      next_step: val?.next_step,
      description: val?.description,
      campaign_sources: val?.campaign_sources,
      contact_detail_id: val?.contact_detail?.id,
      lead_source_id: val?.lead_source?.id,
      currency_id: val?.currency?.id,
    });
  };

  const isBackValidation = (val) => {
    if (
      val?.contact_detail?.id &&
      val?.account_name &&
      val?.pipeline_stage?.id &&
      val?.stage_type?.id &&
      val?.lead_source?.id &&
      val?.pipeline_owner?.id
    ) {
      isTrue = true;
    }
  };

  const getFormValues = () => {
    isTrue = false;
    if (pipelineId || createId) {
      let paramPass = pipelineId ? params.id : createId;
      PipelineApi.getDataById(paramPass)
        .then(function (response) {
          if (response?.data) {
            var datetime = new Date();
            var now = datetime
              .toISOString()
              .replace(/T/, " ")
              .replace(/:00.000Z/, "");
            let val = response?.data?.attributes;
            setAccountName(val?.account_name);
            setPipeline_score(val?.pipeline_score?.id);
            setStage(val?.pipeline_stage?.id);
            setDate(val?.journey ? val?.journey : now);
            setRevenue(val?.expected_revenue);
            setCurrency(val?.currency?.id || id?.currency?.id);
            setOwner(
              val?.pipeline_owner?.id ? val?.pipeline_owner?.id : login_id
            );
            setOwnerValue(val?.pipeline_owner?.full_name);
            setStep(val?.next_step);
            setdescription(val?.description);
            setVal(val?.contact_detail?.full_name);
            setContactId(val?.contact_detail?.id);
            setType(val?.stage_type?.id);
            setCampaign(val?.campaign_sources);
            setlead_source(val?.lead_source?.id);
            setFormikData(val);
            isBackValidation(val);
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

  useEffect(() => {
    getTypeData();
    getStageData();
    getFormValues();
    getLeadSourceData();
    getPipelineScoreData();
    if (!pipelineId && !createId) {
      setCurrency(id?.currency?.id);
    }
  }, []);

  const handleSaveClick = (saveAndNew) => {
    let data = {
      account_name: account_name,
      pipeline_score_id: pipeline_score_id,
      expected_revenue: expected_revenue,
      currency_id: parseInt(currency),
      journey: journey,
      owner_id: parseInt(owner_id),
      next_step: next_step,
      description: description,
      pipeline_stage_id: parseInt(stage),
      campaign_sources: campaign_sources,
      stage_type_id: parseInt(type),
      contact_detail_id: parseInt(contact_detail_id),
      lead_source_id: parseInt(lead_source_id),
    };
    if (pipelineId || createId) {
      EditDetails(data, saveAndNew);
    } else {
      createPipeline(data, saveAndNew);
    }
  };

  const GetContactDetailsList = (srchQuery) => {
    PipelineApi.getContactDetails(srchQuery, page, pageSize)
      .then(function (response) {
        setUserLoading(true);
        if (response?.data?.length > 0) {
          setFilteredData(response?.data);
          isContact = true;
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

  const contactDropDown = (setFieldValue, touched, errors) => {
    return (
      <ContactPerson
        userLoading={userLoading}
        getContactValue={setFieldValue}
        setContactId={setContactId}
        filterData={filterData}
        contactVal={contactVal}
        FilterData={FilterData}
        onAddDetail={onAddDetail}
        helperText={
          <span className="ma-error">
            {touched.contact_detail_id && errors.contact_detail_id}
          </span>
        }
      />
    );
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
      isContact = true;
      return;
    }
    let flag = false;
    const temp = filterData;
    temp?.filter((elem) => {
      if (flag) {
        return null;
      }
      if (elem?.attributes?.full_name === value) {
        isContact = true;
        flag = true;
      } else {
        isContact = false;
      }
      return isContact;
    });
  };

  const onAddDetail = () => {
    setOpenModal(!openModal);
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

  const getContactData = (e, newValue, isCheck) => {
    if (newValue) {
      setSrchUser(true);
    } else {
      setSrchUser(false);
    }
    if (e?.type !== undefined && e?.type !== "click") {
      setUserLoading(true);
      debounceSaveUser(newValue);
    }
    setOwnerValue(newValue);
  };

  const handleBackBtn = () => {
    if (createId || pipelineId) {
      if (isTrue) {
        setShow(false);
        navigate(`/pipeline`);
      } else {
        setShow(true);
      }
    }
  };

  const handleCancel = () => {
    if (createId || pipelineId) {
      handleBackBtn();
    } else {
      navigate(`/pipeline`);
    }
  };

  //lead source functionality
  const getLeadSourceData = () => {
    LeadAPI.getLeadSourceData()
      .then((response) => setLeadSourceArray(response?.data))
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const getPipelineScoreData = () => {
    PipelineApi.getPipelineScoreData()
      .then((response) => setPipelineScoreArray(response?.data))
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };
  //functionality for crud dropdown

  useEffect(() => {
    handleFields();
  }, [crudField]);

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
      case STAGE:
        field_editLabel = "Pipeline Stage";
        field_placeholder = "Enter pipeline stage";
        field_addLabel = "Stage";
        break;
      case TYPE:
        field_editLabel = "Pipeline Type";
        field_placeholder = "Enter pipeline type";
        field_addLabel = "Type";
        break;
      case SCORE:
        field_editLabel = "Pipeline Score";
        field_placeholder = "Enter pipeline score";
        field_addLabel = "Score";
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setItemValue(fieldName?.attributes?.name);
  }, [fieldName]);

  const handleFieldChange = (val) => {
    setItemValue(val);
  };

  const handleModalClose = () => setDeleteDialog(false);

  const onAddPopup = (data) => {
    if (data === ADD_NEW) {
      setItemValue("");
      setFieldName("");
    }
    setCrudDialog(!crudDialogShow);
  };

  const handleToCloseLT = () => {
    setCrudDialog(!crudDialogShow);
    setFieldName();
    setFieldErrMsg("");
  };

  const handleShow = (data) => {
    handleDeleteClick(data?.id, false);
    setFieldID(data);
  };

  const handleEditClick = (event, data) => {
    setCrudDialog(!crudDialogShow);
    setFieldName(data);
  };
  const handleValid = () => {
    if (!itemValue) {
      setFieldErrMsg("Field can't be empty");
    }
  };

  const handleDeleteClick = (id, associatedFlag) => {
    const deleteId = id ? id : fieldID?.id;
    let apiCall;

    switch (field_addLabel) {
      case STAGE:
        apiCall = PipelineApi.deletePipelineStage(deleteId, associatedFlag);
        break;
      case TYPE:
        apiCall = PotentialApi.deleteTypeData(deleteId, associatedFlag);
        break;
      case LEAD_SOURCE:
        apiCall = LeadAPI.deleteLeadSource(deleteId, associatedFlag);
        break;
      case SCORE:
        apiCall = PipelineApi.deletePipelineScore(deleteId, associatedFlag);
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
            setInitialData({ ...initialData, pipeline_stage_id: "" });
            break;
          case TYPE:
            getTypeData();
            setType("");
            setInitialData({ ...initialData, stage_type_id: "" });
            break;
          case LEAD_SOURCE:
            getLeadSourceData();
            setlead_source("");
            setInitialData({ ...initialData, lead_source_id: "" });
            break;
          case SCORE:
            getPipelineScoreData();
            setPipeline_score("");
            setInitialData({ ...initialData, pipeline_score_id: "" });
            break;
          default:
            break;
        }
        handleModalClose();
        setDisabled(false);
      })
      .catch((error) => {
        if (error?.response?.data?.code === RECORD_EXIST) {
          setDeleteDialog(true);
        }
        setDisabled(false);
        Toaster.TOAST(deleteMethodError(error), "error");
        console.log(error);
      });
  };

  const handleDropdownSubmit = (setFieldValue) => {
    handleValid();
    let data = {};
    if (
      field_addLabel === STAGE ||
      field_addLabel === LEAD_SOURCE ||
      field_addLabel === SCORE
    ) {
      data = {
        data: {
          name: itemValue,
        },
      };
    } else if (field_addLabel === TYPE) {
      data = {
        data: {
          name: itemValue,
          section: module_name,
        },
      };
    }
    if (itemValue && !fieldErrMsg) {
      apiCallingEndPoints(data, setFieldValue);
    }
  };

  const apiCallingEndPoints = (data, setFieldValue) => {
    let apiCall;

    switch (field_addLabel) {
      case STAGE:
        apiCall = fieldName?.id
          ? PipelineApi.editPipelineStage(fieldName.id, data)
          : PipelineApi.createPipelineStage(data);
        break;
      case TYPE:
        apiCall = fieldName?.id
          ? PotentialApi.editTypeData(fieldName.id, data)
          : PotentialApi.createTypeData(data);
        break;
      case LEAD_SOURCE:
        apiCall = fieldName?.id
          ? LeadAPI.editLeadSource(fieldName.id, data)
          : LeadAPI.createLeadSource(data);
        break;
      case SCORE:
        apiCall = fieldName?.id
          ? PipelineApi.editPipelineScore(fieldName.id, data)
          : PipelineApi.createPipelineScore(data);
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
          setOpenModal(false);
          let successMessage = "";
          switch (field_addLabel) {
            case "Stage":
              successMessage = fieldName?.id
                ? "Pipeline stage updated Successfully"
                : "Pipeline stage created Successfully";
              getStageData();
              if (!fieldName?.id) {
                setStage(response?.data?.id);
                setFieldValue("pipeline_stage_id", response?.data?.id);
              }
              break;
            case "Type":
              successMessage = fieldName?.id
                ? "Pipeline type updated Successfully"
                : "Pipeline type created Successfully";
              getTypeData();
              if (!fieldName?.id) {
                setType(response?.data?.id);
                setFieldValue("stage_type_id", response?.data?.id);
              }
              break;
            case "Source":
              successMessage = fieldName?.id
                ? "Lead source updated Successfully"
                : "Lead source created Successfully";
              getLeadSourceData();
              if (!fieldName?.id) {
                setlead_source(response?.data?.id);
                setFieldValue("lead_source_id", response?.data?.id);
              }
              break;
            case "Score":
              successMessage = fieldName?.id
                ? "Pipeline Score updated Successfully"
                : "Pipeline Score created Successfully";
              getPipelineScoreData();
              if (!fieldName?.id) {
                setPipeline_score(response?.data?.id);
                setFieldValue("pipeline_score_id", response?.data?.id);
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
    setFieldValue("journey", formated_date);
  };

  const clearDate = (setFieldValue) => {
    setOpenCalendar(false); // Close the calendar
    setDate(null); // Clear the date
    setFieldValue("journey", null); // Clear the date
  };

  return (
    <Box className="ma-leads-box" sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{ flexGrow: 1, padding: "0" }}
        className="ma-mainTop-box mainBox p-0"
      >
        {Invalid_data ? (
          <IncorrectId />
        ) : (
          <Paper elevation={1} className={"ma-mainShadow-box createlead-page"}>
            <Typography
              className={"createlead-heading justify-content-between"}
            >
              <div>
                <ArrowBackIcon
                  className="Arrowbtn-mr"
                  sx={{ color: show ? "#8c8da3" : "black" }}
                  onClick={() => handleCancel()}
                />
                {pipelineId ? "Edit Pipeline" : "Create Pipeline"}
              </div>
              {show && (
                <Alert className="py-0 px-2" severity="error">
                  Please fill all required fields & save!
                </Alert>
              )}
            </Typography>

            <Formik
              enableReinitialize={createId || pipelineId || deleteDialogShow}
              initialValues={initialData}
              validationSchema={PipelineSchema}
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
                        <h1
                          data-testid="create-pipeline"
                          className="detailstxt mb-4"
                        >
                          <span className="requreiedField">*</span>Contact
                          Person
                        </h1>
                        <div className="ma-filedbtn-contact align-items-center">
                          <Box>
                            <Grid container spacing={2} alignItems="center">
                              <Grid
                                item
                                xs={6}
                                md={4}
                                className={"createlead-detail-grid pt-0"}
                                data-testid="Auto-complete"
                              >
                                {contactDropDown(
                                  setFieldValue,
                                  touched,
                                  errors
                                )}
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
                                label="Pipeline Owner"
                                userLoading={userLoading}
                                placeholder="pipeline owner"
                                users={usersData}
                                owner_id={owner_id}
                                ownerErr={null}
                                OwnerValue={OwnerValue}
                                getContactData={getContactData}
                                setFieldValue={setFieldValue}
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
                            <label className="labeltxt ">
                              <span className="requreiedField">*</span>Pipeline
                              Stage
                            </label>
                            <DropDownCrud
                              dataTestid={"pipeline_stage"}
                              id={"pipeline_stage"}
                              name={"stage"}
                              placeholder={"Select pipeline stage"}
                              itemId={stage}
                              handleValueChange={(e) => {
                                setFieldValue(
                                  "pipeline_stage_id",
                                  e.target.value
                                );
                                setStage(e.target.value);
                              }}
                              // errorMessage={stageErr}
                              arrayData={stageData}
                              onAddDetail={onAddPopup}
                              handleEditClick={handleEditClick}
                              handleShow={handleShow}
                              addNew={"STAGE"}
                              helperText={
                                <span className="ma-error">
                                  {touched.pipeline_stage_id &&
                                    errors.pipeline_stage_id}
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
                              Account Name
                            </label>
                            <TextField
                              className="createlead-textField placeholder_field"
                              fullWidth
                              id="accnt_name"
                              placeholder="Google"
                              name="account_name"
                              value={account_name}
                              onChange={(event) => {
                                setFieldValue(
                                  "account_name",
                                  event.target.value
                                );
                                setAccountName(event.target.value);
                              }}
                              inputProps={{ maxLength: 80 }}
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
                              <span className="requreiedField">*</span>
                              Type
                            </label>
                            <DropDownCrud
                              dataTestid={"type"}
                              id={"type"}
                              name={"stage_type_id"}
                              placeholder={"Select pipeline type"}
                              handleValueChange={(e) => {
                                setFieldValue("stage_type_id", e.target.value);
                                setType(e.target.value);
                              }}
                              itemId={type}
                              // errorMessage={typeErr}
                              arrayData={typeData}
                              onAddDetail={onAddPopup}
                              handleEditClick={handleEditClick}
                              handleShow={handleShow}
                              addNew={"TYPE"}
                              helperText={
                                <span className="ma-error">
                                  {touched.stage_type_id &&
                                    errors.stage_type_id}
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
                              className="createlead-textField placeholder_field"
                              fullWidth
                              id="step"
                              placeholder="Enter next move"
                              name="next_step"
                              value={next_step}
                              onChange={(e) => {
                                setFieldValue("next_step", e.target.value);
                                setStep(e.target.value);
                              }}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            className={"createlead-detail-grid"}
                          >
                            <label className="labeltxt ">
                              Pipeline Score (%)
                            </label>
                            <DropDownCrud
                              id={"pipeline_score_id"}
                              name={"pipeline_score_id"}
                              dataTestid={"pipeline_score"}
                              placeholder={"Select pipeline score"}
                              handleValueChange={(e) => {
                                setFieldValue(
                                  "pipeline_score_id",
                                  e.target.value
                                );
                                setPipeline_score(e.target.value);
                              }}
                              itemId={pipeline_score_id}
                              // errorMessage={""}
                              arrayData={pipelineScoreArray}
                              onAddDetail={onAddPopup}
                              handleEditClick={handleEditClick}
                              handleShow={handleShow}
                              addNew={"SCORE"}
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
                              Pipeline Journey
                            </label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                // disablePast
                                value={journey}
                                open={openCalendar}
                                onOpen={() => setOpenCalendar(true)}
                                onClose={() => setOpenCalendar(false)}
                                onChange={(val) =>
                                  handleDateChange(val, setFieldValue)
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    name="Call Time"
                                    size="medium"
                                    id="Pipeline Journey"
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
                                            <ClearIcon />
                                          </IconButton>
                                          <IconButton
                                            onClick={() =>
                                              setOpenCalendar(true)
                                            }
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
                              Expected Revenue
                            </label>
                            <CurrencyTextField
                              field="expected_revenue"
                              currency={currency}
                              setCurrency={setCurrency}
                              expected_revenue={expected_revenue}
                              setRevenue={setRevenue}
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
                            <label className="labeltxt ">Campaign Source</label>
                            <TextField
                              className="createlead-textField placeholder_field"
                              fullWidth
                              id="campaign"
                              placeholder="New campaign source"
                              name="campaign"
                              value={campaign_sources}
                              onChange={(e) => {
                                setFieldValue(
                                  "campaign_sources",
                                  e.target.value
                                );
                                setCampaign(e.target.value);
                              }}
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
                            {
                              <DropDownCrud
                                id={"lead_source_id"}
                                name={"lead_source_id"}
                                dataTestid={"lead_source"}
                                placeholder={"Select lead source"}
                                handleValueChange={(e) => {
                                  setFieldValue(
                                    "lead_source_id",
                                    e.target.value
                                  );
                                  setlead_source(e.target.value);
                                }}
                                itemId={lead_source_id}
                                // errorMessage={leadSourceErrorMessage}
                                arrayData={leadSourceArray}
                                onAddDetail={onAddPopup}
                                handleEditClick={handleEditClick}
                                handleShow={handleShow}
                                addNew={"SOURCE"}
                                helperText={
                                  <span className="ma-error">
                                    {touched.lead_source_id &&
                                      errors.lead_source_id}
                                  </span>
                                }
                                disabled={disabled}
                              />
                            }
                          </Grid>

                          <Grid item xs={12}>
                            <label className="labeltxt ">Description</label>
                            <TextField
                              id="manage_data"
                              multiline
                              rows={2}
                              fullWidth
                              value={description}
                              name="manage_data"
                              className="placeholder_field"
                              placeholder="Write some description here"
                              onChange={(e) => {
                                setFieldValue("description", e.target.value);
                                setdescription(e.target.value);
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </div>
                    <Grid className="mt-4" container xs={12} md={12} lg={12}>
                      <Grid
                        item
                        className="ma-Divider-bar w-100 px-4 pb-3 pt-0"
                      >
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
                            title={pipelineId ? " UPDATE" : "SAVE"}
                          />
                          {!pipelineId && (
                            <ButtonLoader
                              disabled={saveAndNewLoader || loading}
                              classStyle={"ms-3 saveandedittext"}
                              btnType={"submit"}
                              handleClick={() =>
                                setFieldValue("isSaveAndNew", true)
                              }
                              title={"SAVE AND NEW"}
                              variant="outlined"
                            />
                          )}
                          <Button
                            className="ms-3 cancelbtn"
                            variant="outlined"
                            disabled={show ? true : false}
                            onClick={() => handleCancel()}
                          >
                            CANCEL
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
                    {crudDialogShow && (
                      <DropdownCreateEdit
                        openModal={crudDialogShow}
                        handleToCloseLT={handleToCloseLT}
                        valueName={fieldName}
                        editLabel={field_editLabel}
                        addLabel={field_addLabel}
                        placeholder={field_placeholder}
                        handleSubmit={() => handleDropdownSubmit(setFieldValue)}
                        itemValue={itemValue}
                        handleChange={handleFieldChange}
                        errMsg={fieldErrMsg}
                        setErrMsg={setFieldErrMsg}
                        setFieldValue={setFieldValue}
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
          openDelete={deleteDialogShow}
          handleClose={handleModalClose}
          handleDelete={handleDeleteClick}
        />
      </Box>
    </Box>
  );
};

export default CreatePipeline;
