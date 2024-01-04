import React, { useEffect, useState, useContext } from "react";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DealsApi } from "../../apis/DealsApi";
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
import "../../styles/global/common.css";
import "../../styles/custom/Create.css";
import { LeadAPI } from "../../apis/LeadApi";
import DropDownCrud from "../../pages/common/Dropdowns_Crud/Drodpown_CRUD";
import DropdownCreateEdit from "../../pages/common/Dropdowns_Crud/DropdownCreateEdit";
import DropdownDelete from "../../pages/common/Dropdowns_Crud/DropdownDelete";
import ClearIcon from "@mui/icons-material/Clear";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { DealSchema } from "../../pages/common/ValidationSchema/DealSchema";
import { Formik, Form } from "formik";
import {
  ADD_NEW,
  RECORD_EXIST,
  LEAD_SOURCE,
  PAYMENT_MODE,
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
let field_editLabel = "";
let field_placeholder = "";
let field_addLabel = "";

const CreateDeals = () => {
  const navigate = useNavigate();
  // const [searchParams, setSearchParams] = useSearchParams();
  const login_id = JSON.parse(localStorage.getItem("login_id"));
  const { crudField } = useContext(DataContext);
  const [usersData, setUsersData] = useState([]);
  const [OwnerValue, setOwnerValue] = useState("");
  const [contact_detail_id, setContactId] = useState("");
  const [campaign_sources, setCampaign] = useState();
  const [owner_id, setOwner_id] = useState(login_id);
  const [currency, setCurrency] = useState("");

  const [deal_name, setDeal_name] = useState("");
  const [description, setDescription] = useState("");
  const [sign_off_date, setSign_off_date] = useState(TodayDate());
  const [kick_off_date, setKick_off_date] = useState(TodayDate());
  const [value, setValue] = useState("");
  const [tenure, setTenure] = useState("");
  const [deal_terms, setDeal_terms] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [contactVal, setVal] = useState("");
  const [filterData, setFilteredData] = useState([]);
  const [srchData, setSrchData] = useState(false);
  const [srchUser, setSrchUser] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  // lead source
  const [lead_source_id, setlead_source] = useState("");
  const [leadSourceArray, setLeadSourceArray] = useState([]);

  // lead source
  const [payment_mode_id, setPayment_mode] = useState("");
  const [paymentModeArray, setPaymentModeArray] = useState([]);

  //crud dropdown states
  const [fieldName, setFieldName] = useState();
  const [fieldID, setFieldID] = useState();
  const [itemValue, setItemValue] = useState("");
  const [fieldErrMsg, setFieldErrMsg] = useState("");
  const [deleteDialogShow, setDeleteDialog] = useState(false);
  const [crudDialogShow, setCrudDialog] = useState(false);
  const [Invalid_data, setInvalidData] = useState(false);
  // loader states
  const [loading, setLoading] = useState(false);
  const [saveAndNewLoader, setSaveAndNewLoader] = useState(false);

  const page = 1;
  const pageSize = 20;
  const params = useParams();
  const location = useLocation();
  const module_name = location?.pathname.split("/")[1];
  const DealsId = params?.id;
  const createId = params?.createId;
  const [contactErr, setContactErr] = useState("");
  const [ownerErr, setOwnerErr] = useState("");
  const [show, setShow] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [openCalendar1, setOpenCalendar1] = useState(false);
  const [openCalendar2, setOpenCalendar2] = useState(false);
  let userInfo = JSON.parse(localStorage.getItem("user_info"));
  const [initialData, setInitialData] = useState({
    deal_name: "", //
    sign_off_date: TodayDate(),
    kick_off_date: TodayDate(),
    owner_id: owner_id,
    value: "",
    description: "",
    contact_detail_id: "",
    lead_source_id: "",
    payment_mode_id: "",
    deal_terms: "",
    campaign_sources: "",
    tenure: "",
    isSaveAndNew: false,
    currency_id: "",
  });

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

  // useEffect(() => {
  //   if (current_page) {
  //     setSearchParams({ page: current_page})
  //   }
  // }, [])

  const getLeadOwnerData = (srchQuery) => {
    userApi
      .getUsers(srchQuery)
      .then((data) => {
        setUserLoading(true);
        if (data?.data?.length > 0) {
          setUsersData(data?.data);
          setUserLoading(false);
        } else {
          setUsersData([]);
          setUserLoading(false);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        setUserLoading(false);
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
        setOwnerErr("Please select deal owner");
      } else {
        setOwnerErr("");
      }
    } else {
      setOwnerErr("");
    }
    setOwnerValue(newValue);
  };

  const stateClear = () => {
    setContactId("");
    setOwner_id("");
    setOwnerValue("");
    setDeal_name("");
    setDescription("");
    setSign_off_date("");
    setKick_off_date("");
    setValue("");
    setTenure("");
    setPayment_mode("");
    setDeal_terms("");
    setCampaign("");
    setVal("");
    setlead_source("");
    setCurrency("");
  };

  const EditDetails = (body, saveAndNew) => {
    let id = DealsId ? DealsId : createId;
    DealsApi.update(body, id)
      .then(function (response) {
        if (response?.data) {
          if (saveAndNew) {
            navigate(`/deal/create`);
            setShow(false);
          } else if (DealsId) {
            navigate(`/deal/${DealsId}/overview`);
          } else {
            navigate(`/deal`);
          }

          stateClear();
          Toaster.TOAST("Deals Updated Successfully", "success");
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

  const createDeals = (data, saveAndNew) => {
    DealsApi.create(data)

      .then(function (response) {
        if (response?.data) {
          if (saveAndNew) {
            navigate(`/deal/create`);
            setShow(false);
          } else {
            navigate(`/deal/${response?.data?.attributes?.id}/overview`);
          }
          stateClear();
          Toaster.TOAST("Deals Created Successfully", "success");
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
      val?.deal_owner?.id &&
      val?.deal_name &&
      val?.tenure &&
      val?.payment_mode?.id &&
      val?.lead_source?.id
    ) {
      isTrue = true;
    }
  };

  const getFormValues = () => {
    isTrue = false;
    if (DealsId) {
      DealsApi.getDataById(params?.id)
        .then(function (response) {
          if (response?.data) {
            let val = response?.data?.attributes;
            setContactId(val?.contact_detail?.id);
            setOwner_id(val?.deal_owner?.id);
            setOwnerValue(val?.deal_owner?.full_name);
            setDeal_name(val?.deal_name);
            setDescription(val?.description);
            setSign_off_date(val?.sign_off_date);
            setKick_off_date(val?.kick_off_date);
            setValue(val?.value);
            setTenure(val?.tenure);
            setPayment_mode(val?.payment_mode?.id);
            setDeal_terms(val?.deal_terms);
            setCampaign(val?.campaign_sources);
            setlead_source(val?.lead_source?.id);
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
    if (createId) {
      DealsApi.getDataById(params?.createId)

        .then(function (response) {
          if (response?.data) {
            let val = response?.data?.attributes;
            setContactId(val?.contact_detail?.id);
            setOwner_id(val?.deal_owner?.id ? val?.deal_owner?.id : login_id);
            setOwnerValue(val?.deal_owner?.full_name);
            setDeal_name(val?.deal_name);
            setDescription(val?.description);
            setValue(val?.value);
            setTenure(val?.tenure);
            setPayment_mode(val?.payment_mode?.id);
            setDeal_terms(val?.deal_terms);
            setCampaign(val?.campaign_sources);
            setlead_source(val?.lead_source?.id);
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
    getFormValues();
    getFormValuesForCreate();
    getLeadSourceData(); // for lead source
    getPaymentModeData();
    setOwnerValue(userInfo?.full_name);
    setOwner_id(login_id);
    if (!DealsId && !createId) {
      setCurrency(userInfo?.currency?.id);
    }
  }, []);

  const setFormikData = (val) => {
    setInitialData({
      payment_mode_id: val?.payment_mode?.id,
      deal_terms: val?.deal_terms,
      deal_name: val?.deal_name,
      sign_off_date: val?.sign_off_date,
      kick_off_date: val?.kick_off_date,
      owner_id: val?.owner_id ? val?.owner_id : login_id,
      description: val?.description,
      campaign_sources: val?.campaign_sources,
      tenure: val?.tenure,
      value: val?.value,
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
      contact_detail_id: parseInt(contact_detail_id),
      owner_id: parseInt(owner_id ? owner_id : login_id),
      deal_name: deal_name,
      payment_mode_id: parseInt(payment_mode_id),
      currency_id: parseInt(currency),
      deal_terms: deal_terms,
      sign_off_date: sign_off_date ? sign_off_date : now,
      kick_off_date: kick_off_date ? kick_off_date : now,
      campaign_sources: campaign_sources,
      tenure: tenure,
      description: description,
      value: value,
      lead_source_id: parseInt(lead_source_id),
    };

    if (DealsId || createId) {
      EditDetails(data, saveAndNew);
    } else {
      createDeals(data, saveAndNew);
    }
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
    !flag &&
      temp?.filter((elem) => {
        if (elem?.attributes?.full_name === value) {
          flag = true;
        }
      });
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

  useEffect(() => {
    setContactErr("");
  }, [contactVal]);

  const contactDropDown = (setFieldValue, touched, errors) => {
    return (
      <ContactPerson
        getContactValue={setFieldValue}
        userLoading={userLoading}
        filterData={filterData}
        contactVal={contactVal}
        FilterData={FilterData}
        contactError={contactErr}
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

  const handleBackBtn = () => {
    if (createId || DealsId) {
      if (isTrue) {
        setShow(false);
        navigate(`/deal`);
      } else {
        setShow(true);
      }
    }
  };

  const handleCancel = () => {
    if (createId || DealsId) {
      handleBackBtn();
    } else {
      navigate(`/deal`);
    }
  };
  const Dealsname = "Deals";

  //lead source functionality
  const getLeadSourceData = () => {
    LeadAPI.getLeadSourceData()
      .then((response) => setLeadSourceArray(response?.data))
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const getPaymentModeData = () => {
    DealsApi.getPaymentModeData()
      .then((response) => setPaymentModeArray(response?.data))
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };
  //dropdown_crud functionality

  useEffect(() => {
    handleFields();
  }, [crudField]);

  //Dropdown delete content
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
      case PAYMENT_MODE:
        field_editLabel = "Payment Mode";
        field_placeholder = "Enter payment mode";
        field_addLabel = "Payment Mode";
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setItemValue(fieldName?.attributes?.name);
  }, [fieldName]);

  const handleModalClose = () => setDeleteDialog(false);

  const handleFieldChange = (val) => {
    setItemValue(val);
  };

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

  const handleDeleteClick = (id, associatedFlag) => {
    const deleteId = id ? id : fieldID?.id;
    let apiCall;
    setDisabled(true);
    switch (field_addLabel) {
      case "Source":
        apiCall = LeadAPI.deleteLeadSource(deleteId, associatedFlag);
        break;
      case "Payment Mode":
        apiCall = DealsApi.deletePaymentMode(deleteId, associatedFlag);
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
            setInitialData({ ...initialData, lead_source_id: "" });
            break;
          case PAYMENT_MODE:
            getPaymentModeData();
            setPayment_mode("");
            setInitialData({ ...initialData, payment_mode_id: "" });
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

  const handleValid = () => {
    if (!itemValue) {
      setFieldErrMsg("Field can't be empty");
    }
  };

  const handleDropdownSubmit = (setFieldValue) => {
    handleValid();
    let data = {
      data: {
        name: itemValue,
      },
    };
    if (itemValue && !fieldErrMsg) {
      apiCallingEndPoints(data, setFieldValue);
    }
  };

  const apiCallingEndPoints = (data, setFieldValue) => {
    let apiCall;
    switch (field_addLabel) {
      case LEAD_SOURCE:
        apiCall = fieldName?.id
          ? LeadAPI.editLeadSource(fieldName.id, data)
          : LeadAPI.createLeadSource(data);
        break;
      case PAYMENT_MODE:
        apiCall = fieldName?.id
          ? DealsApi.editPaymentMode(fieldName.id, data)
          : DealsApi.createPaymentMode(data);
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
            case LEAD_SOURCE:
              successMessage = fieldName?.id
                ? "Lead source updated Successfully"
                : "Lead source created Successfully";
              getLeadSourceData();
              if (!fieldName?.id) {
                setlead_source(response?.data?.id);
                setFieldValue("lead_source_id", response?.data?.id);
              }
              break;
            case PAYMENT_MODE:
              successMessage = fieldName?.id
                ? "Payment Mode updated Successfully"
                : "Payment Mode created Successfully";
              getPaymentModeData();
              if (!fieldName?.id) {
                setPayment_mode(response?.data?.id);
                setFieldValue("payment_mode_id", response?.data?.id);
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

  //Sign Off Date
  const handleDateChange = (newValue, setFieldValue) => {
    let date_formated = FormatDate(newValue?.$d);
    setSign_off_date(date_formated);
    setFieldValue("sign_off_date", date_formated);
  };

  //kick off date
  const handleKickDateChange = (newValue, setFieldValue) => {
    let date_formated = FormatDate(newValue?.$d);
    setKick_off_date(date_formated);
    setFieldValue("kick_off_date", date_formated);
  };

  const clearSign_off_dateDate = (setFieldValue) => {
    setOpenCalendar1(false); // Close the calendar
    setSign_off_date(null); // Clear the date
    setFieldValue("sign_off_date", null); // Clear the date
  };

  const clearKickDate = (setFieldValue) => {
    setOpenCalendar2(false); // Close the calendar
    setKick_off_date(null); // Clear the date
    setFieldValue("kick_off_date", null); // Clear the date
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
              data-testid="cancel-abc"
            >
              <div>
                <ArrowBackIcon
                  className="Arrowbtn-mr"
                  sx={{ color: show ? "#8c8da3" : "black" }}
                  onClick={() => handleCancel()}
                />
                {DealsId ? `Edit ${Dealsname}` : `Create ${Dealsname}`}
              </div>
              {show && (
                <Alert className="py-0 px-2" severity="error">
                  Please fill all required fields & save!
                </Alert>
              )}
            </Typography>
            <Formik
              enableReinitialize={createId || DealsId || deleteDialogShow}
              initialValues={initialData}
              validationSchema={DealSchema}
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
                        <h1 data-testid="create-deal" className="detailstxt mb-4">
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
                            <LeadOwnerDropdown
                              label="Deal Owner"
                              userLoading={userLoading}
                              placeholder="deal owner"
                              users={usersData}
                              owner_id={owner_id}
                              ownerErr={ownerErr}
                              OwnerValue={OwnerValue}
                              getContactData={getContactData}
                              handleOwner={setOwner_id}
                              setFieldValue={setFieldValue}
                              helperText={
                                <span className="ma-error">
                                  {touched.owner_id && errors.owner_id}
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
                            <label className="labeltxt ">{Dealsname} Value</label>
                            <CurrencyTextField
                              field="value"
                              currency={currency}
                              setCurrency={setCurrency}
                              expected_revenue={value}
                              setRevenue={setValue}
                              setFieldValue={setValue}
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
                              <span className="requreiedField">*</span>
                              {Dealsname} Name
                            </label>
                            <TextField
                              data-testid="deal_name"
                              className="createlead-textField placeholder_field"
                              fullWidth
                              id="deal_name"
                              placeholder="My deal"
                              name="deal_name"
                              value={deal_name}
                              onChange={(event) => {
                                setFieldValue("deal_name", event.target.value);
                                setDeal_name(event.target.value);
                              }}
                              inputProps={{ maxLength: 80 }}
                              helperText={
                                <span className="ma-error">
                                  {touched.deal_name && errors.deal_name}
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
                            <label className="labeltxt ">Sign Off Date</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                open={openCalendar1}
                                onOpen={() => setOpenCalendar1(true)}
                                onClose={() => setOpenCalendar1(false)}
                                disablePast
                                value={sign_off_date}
                                onChange={(val) =>
                                  handleDateChange(val, setFieldValue)
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    name="Call Time"
                                    size="medium"
                                    id="Deal sign_off_date"
                                    placeholder="Nov 10,2022"
                                    onKeyDown={(e) => e.preventDefault()}
                                    onMouseDown={() => setOpenCalendar1(true)}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <IconButton
                                            onClick={() =>
                                              clearSign_off_dateDate(
                                                setFieldValue
                                              )
                                            }
                                            size="small"
                                            edge="end"
                                          >
                                            {sign_off_date && <ClearIcon />}
                                          </IconButton>
                                          <IconButton
                                            onClick={() => setOpenCalendar1(true)}
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
                              {Dealsname} Tenure (Week){" "}
                            </label>
                            <TextField
                              data-testid="tenure"
                              className="createlead-textField placeholder_field"
                              fullWidth
                              placeholder="1"
                              name="tenure"
                              value={tenure}
                              inputProps={{
                                maxLength: 3,
                              }}
                              onChange={(event) => {
                                setFieldValue("tenure", event.target.value);
                                setTenure(event.target.value);
                              }}
                              id="tenuer"
                              helperText={
                                <span className="ma-error">
                                  {touched.tenure && errors.tenure}
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
                              <span className="requreiedField">*</span>Payment
                              Mode
                            </label>
                            <DropDownCrud
                              id={"payment_mode_id"}
                              name={"payment_mode_id"}
                              dataTestid={"payment_mode"}
                              placeholder={"Select payment mode"}
                              handleValueChange={(e) => {
                                setFieldValue("payment_mode_id", e.target.value);
                                setPayment_mode(e.target.value);
                              }}
                              itemId={payment_mode_id}
                              arrayData={paymentModeArray}
                              onAddDetail={onAddPopup}
                              handleEditClick={handleEditClick}
                              handleShow={handleShow}
                              addNew={"PAYMENT MODE"}
                              helperText={
                                <span className="ma-error">
                                  {touched.payment_mode_id &&
                                    errors.payment_mode_id}
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
                              Implementation Kick-off
                            </label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                disablePast
                                open={openCalendar2}
                                value={kick_off_date}
                                onOpen={() => setOpenCalendar2(true)}
                                onClose={() => setOpenCalendar2(false)}
                                onChange={(val) =>
                                  handleKickDateChange(val, setFieldValue)
                                }
                                renderInput={(params) => (
                                  <TextField
                                    data-testid="Call_Time"
                                    {...params}
                                    fullWidth
                                    name="Call Time"
                                    size="medium"
                                    id="Pipeline Journey"
                                    placeholder="Nov 10,2022"
                                    onKeyDown={(e) => e.preventDefault()}
                                    onMouseDown={() => setOpenCalendar2(true)}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <IconButton
                                            onClick={() =>
                                              clearKickDate(setFieldValue)
                                            }
                                            size="small"
                                            edge="end"
                                          >
                                            {kick_off_date && <ClearIcon />}
                                          </IconButton>
                                          <IconButton
                                            onClick={() => setOpenCalendar2(true)}
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
                            <label className="labeltxt ">Campaign Source</label>
                            <TextField
                              data-testid="campaign"
                              className="createlead-textField placeholder_field"
                              fullWidth
                              id="campaign"
                              placeholder="Enter campaign source"
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
                          <Grid
                            item
                            xs={12}
                            md={6}
                            className={"createlead-detail-grid"}
                          >
                            <label className="labeltxt ">Deal Term</label>
                            <TextField
                              data-testid="deal_terms"
                              className="createlead-textField placeholder_field"
                              fullWidth
                              type="text"
                              id="deal_terms"
                              placeholder="Deal term"
                              name="deal_terms"
                              value={deal_terms}
                              onChange={(event) => {
                                setFieldValue("deal_terms", event.target.value);
                                setDeal_terms(event.target.value);
                              }}
                            ></TextField>
                          </Grid>
                          {/* lead source start*/}
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
                              handleValueChange={(e) => {
                                setFieldValue("lead_source_id", e.target.value);
                                setlead_source(e.target.value);
                              }}
                              itemId={lead_source_id}
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
                          </Grid>
                          {/* lead source end*/}

                          <Grid item xs={12}>
                            <label className="labeltxt ">Description</label>
                            <TextField
                              data-testid="description"
                              id="manage_data"
                              multiline
                              rows={2}
                              fullWidth
                              value={description}
                              className="placeholder_field"
                              name="manage_data"
                              placeholder="Write some description here"
                              onChange={(event) => {
                                setFieldValue("description", event.target.value);
                                setDescription(event.target.value);
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
                            title={DealsId ? " UPDATE" : "SAVE"}
                            handleClick={() =>
                              setFieldValue("isSaveAndNew", false)
                            }
                          />
                          {!DealsId && (
                            <ButtonLoader
                              disabled={saveAndNewLoader || loading}
                              classStyle={"ms-3 saveandedittext"}
                              btnType={"submit"}
                              title={"SAVE AND NEW"}
                              data-testid={"SAVE_AND_NEW"}
                              variant={"outlined"}
                              handleClick={() =>
                                setFieldValue("isSaveAndNew", true)
                              }
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

export default CreateDeals;
