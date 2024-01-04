import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback
} from 'react'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Autocomplete from '@mui/material/Autocomplete'
import Avatar from '@mui/material/Avatar'
// mui icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AddIcon from '@mui/icons-material/Add'
import TuneIcon from '@mui/icons-material/Tune'
import SearchIcon from '@mui/icons-material/Search'
import LeadTable from '../../components/Leads/LeadTable'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
// other imports
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { styled, alpha } from '@mui/material/styles'
import { Country, State, City } from 'country-state-city'
import { DataContext } from '../../context'
import { LeadAPI } from '../../apis/LeadApi'
import Select from 'react-select'
import debouce from 'lodash.debounce'
// STATIC DATA & REUSABLE COMPONENTS
import { LeadsArr } from '../../Data/data'
import { leadDefaultList } from '../../Data/ManageDataList'
import FilterByLeads from '../common/FilterByLeads'
import ListName from '../common/ListName'
import DialogBox from '../common/TransferDialogBox'
import ManageData from '../common/ManageData'
import Convert from '../common/Convert'
import AllLeads from '../common/DropdownFilter'
import ImportDialogBox from '../common/ImportDialogBox'
import Actions from '../common/Actions'
import Between from '../common/Between'
import { Toaster } from '../common/Toaster'
import { userApi } from '../../apis/userApi'
import '../../styles/global/common.css'
import LostPipelinePopup from '../../components/Pipeline/Details/PipelineOverview/LostPipeline'
import DropdownCreateEdit from '../common/Dropdowns_Crud/DropdownCreateEdit'
import DropdownDelete from '../common/Dropdowns_Crud/DropdownDelete'
import { LostLeadApi } from '../../apis/LostLeadApi'
import { FilterAccordion } from '../common/AllFilter/FilterAccordion'
import LeadOwnerDropdown from '../common/LeadOwner'
import { ButtonLoader } from '../common/ButtonLoader'
import {
  deleteMethodError,
  getMethodError,
  restMethodError
} from '../../constants/errorMessages'
import { RECORD_EXIST } from '../../utils/constants'

let check;
let dropdownCheck = false
let field_editLabel = ''

let field_placeholder = ''
let field_addLabel = ''
let reasonid = ''
const Lists = () => {
  const { setGlobalLeads, leadData, setLeadPopupId, leadPopupid, crudField } =
    useContext(DataContext)
  const [searchParams, setSearchParams] = useSearchParams();
  const [leadStatusArray, setLeadStatusArray] = useState([])
  const [leadSourceArray, setLeadSourceArray] = useState([])
  const [leadIndustryArray, setLeadIndustryArray] = useState([])
  const [compnySizeArray, setCompnySizeArray] = useState([])
  const [usersData, setUsersData] = useState([])
  const [listData, setListData] = useState()
  const [leadSources, setLeadSources] = useState(searchParams.get("lead_source_id") || "")
  const [leadStatus, setLeadStatus] = useState(searchParams.get("status_id") || "")
  const [leadCountry, setLeadCountry] = useState(searchParams.get("country") || "")
  const [leadState, setLeadState] = useState(searchParams.get("state") || "")
  const [leadCity, setLeadCity] = useState(searchParams.get("city") || "")
  const [leadSize, setLeadSize] = useState(searchParams.get("company_size_id") || "")
  const [leadIndustry, setLeadIndustry] = useState(searchParams.get("industry_id") || "")
  const [iconId, seticonId] = useState([])
  const [opens, setOpens] = React.useState(false)
  const [openLT, setOpenLT] = React.useState(false)
  const [leadImportSucessfull, setleadImportSucessfull] = useState(false)
  const [contact_detail_id, setContactId] = useState('')
  const [leadImportProcess, setleadImportProcess] = useState(false)
  const [leadImport, setLeadImport] = useState(true)
  const [isDeleted, setIsDeleted] = useState(false)
  const allFilterData = localStorage.getItem("all_filter_data") ? JSON.parse(localStorage.getItem("all_filter_data")) : null;
  const currentFilterCount = allFilterData ?
    Object.keys(allFilterData).length :
    null;
  const [count, setCount] = useState(+currentFilterCount || 0)
  const [allLead, setAllLead] = useState('')
  const [contactsValue, setContactsValue] = useState('')
  const current_page = localStorage.getItem("current_page");
  const [open, setOpen] = useState(false)
  const [openAction, setOpenAction] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [manage, setManage] = useState(false)
  const [contactErr, setContactErr] = useState('')
  const [isContact, setIsContact] = useState(false)
  const [importedSuceessfully, setimported] = useState(false)
  const [btnDisabled, setBtnDisabled] = useState(true)
  const [resetFilter, setResetFilter] = useState(false)
  const [manageDisable, setManageDisable] = useState(false)
  const [srchData, setSrchData] = useState(false)
  const [srchUser, setSrchUser] = useState(false)
  const [lostModal, setLostModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchAccordianQuery, setSearchAccordianQuery] = useState('')
  // const [page, setPage] = React.useState(1)
  const [page, setPage] = React.useState(current_page || 1)
  const pageSize = 10
  const [filterData, setFilterData] = useState('')
  const [rowCount, setRowCount] = useState(0)
  const controller = new AbortController()
  const navigate = useNavigate()
  const location = useLocation()
  const [manageLoader, setManageLoader] = useState(false)
  const [transferLoader, setTransferLoader] = useState(false)
  const [importErr, setImportErr] = useState([])
  const [manageState, setManageState] = useState({
    company_name: 1,
    email: 1,
    phone_number: 1,
    lead_source_id: 1,
    first_name: 1,
    last_name: 1,
    status_id: 1,
    street_address: 1,
    zip_code: 1,
    country: 1,
    city: 1,
    state: 1,
    owner: 1
  })
  const [userLoading, setUserLoading] = useState(false)
  const [filterLoader, setFilterLoader] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeAccordion, setActiveAccordion] = useState([])
  const [created_date_to, setCreated_date_to] = useState(searchParams.get("created_date_to") || null)
  const [created_date_from, setCreated_date_from] = useState(searchParams.get("created_date_from") || null)
  const [updated_date_to, setUpdated_date_to] = useState(searchParams.get("updated_date_to") || null)
  const [updated_date_from, setUpdated_date_from] = useState(searchParams.get("updated_date_from") || null)
  const [owner_id, setOwner] = useState(searchParams.get("owner_id") || '')
  const isAnyAccordionOpen = activeAccordion.length > 0

  //dropdown_crud lost lead reason
  const [fieldName, setFieldName] = useState()
  const [fieldID, setFieldID] = useState()
  const [itemValue, setItemValue] = useState('')
  const [fieldErrMsg, setFieldErrMsg] = useState('')
  const [isEditModal, setIsEditModal] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [show, setShow] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [flag, setFlag] = useState(false)
  const user_info = JSON.parse(localStorage.getItem('user_info'))
  const module_name = location?.pathname.split('/')[1]
  let filterCount = 0
  const data = useMemo(
    () => [
      { eventKey: 'pipeline', label: 'Convert to Pipeline' },
      { eventKey: 'potential', label: 'Convert to Potential' },
      { eventKey: 'deal', label: 'Convert to Deal' },
      { eventKey: 'lost_lead', label: 'Convert to Lost' }
    ],
    []
  )

  const allFilterDataKeys = [
    "created_date_from", "created_date_to", "updated_date_from", "updated_date_to",
    "lead_source_id", "owner_id", "company_size_id", "industry_id",
    "status_id", "city", "state", "country"
  ]
  useEffect(() => {
    if (
      (searchParams.get("created_date_from") ||
        searchParams.get("created_date_to") ||
        searchParams.get("updated_date_from") ||
        searchParams.get("updated_date_to") ||
        searchParams.get("lead_source_id") ||
        searchParams.get("status_id") ||
        searchParams.get("company_size_id") ||
        searchParams.get("industry_id") ||
        searchParams.get("owner_id") ||
        searchParams.get("city") ||
        searchParams.get("state") ||
        searchParams.get("country") ||
        currentFilterCount) && !check
    ) {
      check = true;
      appendFilterParams();
    }
  }, [])

  useEffect(() => {
    if (current_page && !check) {
      setSearchParams({ page: current_page })
    } else if (current_page && check) {
      setSearchParams({ page: current_page, ...allFilterData })
    }
  }, [])

  // useEffect(() => {
  //   if (current_page) {
  //     setSearchParams({ page: current_page})
  //     // setPage(current_page)
  //   }
  // }, [])
  const actionsData = [
    {
      id: 1,
      value: 'lead_delete',
      handleClick: () => handleLeadDelete(),
      title: 'Lead Delete'
    },
    {
      id: 2,
      value: 'lead_transfer',
      handleClick: () => handleTransferLead(),
      title: 'Lead Transfer'
    },
    {
      id: 3,
      value: 'covert_lead',
      handleClick: () => handleConvertLead(),
      title: 'Mass Convert Pipeline'
    }
  ]

  const [itemList, setItemList] = useState(leadDefaultList)

  const getLeadStatus = () => {
    LeadAPI.getLeadStatusData()
      .then(response => {
        setLeadStatusArray(response?.data)
        setFlag(prev => !prev)
      })
      .catch(error => {
        Toaster.TOAST(getMethodError(error), 'error')
        console.log(error)
      })
  }

  const getLeadSourceData = () => {
    LeadAPI.getLeadSourceData()
      .then(response => {
        setLeadSourceArray(response?.data)
        setFlag(prev => !prev)
      })
      .catch(error => {
        Toaster.TOAST(getMethodError(error), 'error')
        console.log(error);
      })
  }

  const getIndustry = () => {
    LeadAPI.getIndustry()
      .then(response => {
        setLeadIndustryArray(response?.data)
        setFlag(prev => !prev)
      })
      .catch(error => {
        Toaster.TOAST(getMethodError(error), 'error')
        console.log(error)
      })
  }

  const getCompanySize = () => {
    LeadAPI.getCompanySize()
      .then(response => {
        setCompnySizeArray(response?.data)
        setFlag(prev => !prev)
      })
      .catch(error => {
        Toaster.TOAST(getMethodError(error), 'error')
        console.log(error)
      })
  }

  useEffect(() => {
    if (searchParams?.get("page")) {
      setPage(searchParams?.get("page"));
    }
    dropdownCheck = false
    // check = false
    getLeadStatus()
  }, [])

  function handleclose(obj, index, id) {
    setManageDisable(true)
    setManageState({ ...manageState, [obj.field_name]: id })
    if (id) {
      seticonId(iconId => iconId.filter(elId => elId !== obj.id))
    } else {
      seticonId(iconId => iconId.concat(obj.id))
    }
  }

  const getData = () => {
    Object.keys(JSON.parse(leadData)).forEach(function (key) {
      if (!JSON.parse(leadData)[key]) {
        const array = itemList.filter(i => key.includes(i.field_name))
        seticonId(iconId => iconId.concat(array[0]?.id))
      }
    })
  }

  const handleManage = reset => {
    //
    setManageLoader(true)
    let data
    if (reset) {
      data = {
        operation_type: 'set_default'
      }
    } else {
      data = {
        operation_type: 'update',
        field_name: manageState
      }
    }
    const manage_id = localStorage.getItem('manage_id')
    if (manage_id?.length) {
      LeadAPI.manageData({ data })
        .then(response => {
          setOpenAction(false)
          setManage(true)
          seticonId([])
          setItemList(leadDefaultList)
          setManageDisable(false)
          setManageLoader(false)
        })
        .catch(error => {
          setManageLoader(false)
          Toaster.TOAST(restMethodError(error), 'error')
          console.log(error)
        })
    } else {
      Toaster.TOAST('Something went wrong, try reloading!', 'error')
    }
  }
  const debounceSave = React.useCallback(
    debouce(function (e, check) {
      if (srchData)
        CallLeadsearchApi(e, check)
    }, 600),
    [srchData]
  )

  useEffect(() => {
    if (srchData) {
      CallLeadsearchApi(searchQuery, check)
    }
  }, [page])

  const CallLeadsearchApi = (data, check) => {
    LeadAPI.getSearchLead(data, page, pageSize, check, dropdownCheck)
      .then(response => {
        if (response?.data?.length > 0) {
          setRowCount(response?.meta?.total_records)
          const attr = response?.data?.map((event, index) => {
            return event.attributes
          })
          setGlobalLeads(attr)
        } else {
          setRowCount(0)
          setGlobalLeads([])
        }
      })
      .catch(error => {
        Toaster.TOAST(getMethodError(error), 'error')
        console.log(error)
      })
  }

  const handleSearchChange = e => {
    let data = e.target.value
    setSearchQuery(data)
    if (page === 1) {
      debounceSave(data, check)
    } else {
      setPage(1)
      setSearchParams({ page: 1 })
    }

    if (data) {
      setSrchData(true)
      // setSearchParams({ page: 1 })
    } else {
      setSearchParams({ page: 1 })
      setSrchData(false)
    }
  }

  const handleConvertLead = () => {
    let data = {
      lead_ids: leadPopupid,
      convert_to: 'pipeline'
    }
    // setIsDeleted(false);
    //
    if (leadPopupid?.length > 0) {
      LeadAPI.convertType({ data })
        .then(response => {
          setLeadPopupId([])
          // setIsDeleted(true);
          Toaster.TOAST(response?.message, 'success')
          navigate('/pipeline')
        })
        .catch(error => {
          Toaster.TOAST(restMethodError(error), 'error')
          console.log(error)
        })
    } else {
      Toaster.TOAST('Please select anyone entry', 'error')
    }
  }

  useEffect(() => {
    if (!srchUser) {
      getLeadOwnerData()
    }
  }, [srchUser])

  const getLeadOwnerData = srchQuery => {
    setUserLoading(true)
    let login_user_id = localStorage.getItem('login_id')
    userApi
      .getUsers(srchQuery)
      .then(data => {
        if (data?.data) {
          let restUsers = data?.data?.filter(elem => elem?.id !== login_user_id)
          setUsersData(restUsers)
          setUserLoading(false)
        } else {
          setUsersData([])
          setUserLoading(false)
        }
      })
      .catch(error => {
        setUserLoading(false)
        Toaster.TOAST(getMethodError(error), 'error')
        console.log(error)
      })
  }

  const debounceSaveUser = React.useCallback(
    debouce(function (e) {
      if (e) {
        getLeadOwnerData(e)
      }
    }, 800),
    []
  )

  const getContactData = (event, newValue) => {
    const isValidEmail = usersData.find(
      elem => elem.attributes.email === newValue
    )

    if (isValidEmail && newValue) {
      setContactErr('')
      setContactId(isValidEmail?.id)
    } else {
      setContactId('')
      setContactErr('Please select owner')
    }
    if (newValue) {
      setSrchUser(true)
    } else {
      setSrchUser(false)
    }
    if (event?.type !== undefined && event?.type !== 'click') {
      setUserLoading(true)
      debounceSaveUser(newValue)
    }
    setContactsValue(newValue)
  }

  const contactDropDown = () => {
    return (
      <>
        <Autocomplete
          className='MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-wb57ya-MuiFormControl-root-MuiTextField-root'
          fullWidth
          id='leadowner'
          options={usersData}
          filterOptions={usersData => usersData}
          onChange={(event, newValue) => {
            setContactId(newValue?.id)
          }}
          loading={userLoading}
          noOptionsText={'You have no other user to transfer the lead.'}
          getOptionLabel={option => option?.attributes?.email}
          value={{
            attributes: {
              email: contactsValue
            }
          }}
          onInputChange={(event, newInputValue) =>
            getContactData(event, newInputValue)
          }
          renderOption={(props, option, { selected }) => {
            return (
              option?.attributes?.first_name && (
                <li {...props}>
                  <Box display={'flex'} flexDirection={'row'}>
                    <Avatar size={'22'} variant={'circular'} />
                    <Box display={'flex'} ml={3} flexDirection={'column'}>
                      <Typography color={'text.primary'}>
                        {option?.attributes?.first_name +
                          ' ' +
                          option?.attributes?.last_name}
                      </Typography>
                      <Typography color={'text.secondary'}>
                        {option?.attributes?.email}
                      </Typography>
                    </Box>
                  </Box>
                  <hr />
                  &nbsp;
                </li>
              )
            )
          }}
          renderInput={params => (
            <>
              <TextField
                className='m-0'
                {...params}
                placeholder='Choose owner from here'
                margin='normal'
                variant='outlined'
                helperText={<span className='ma-error'>{contactErr}</span>}
              />
            </>
          )}
        />
      </>
    )
  }

  const handleTransferLead = () => {
    // setTranfer(nm);
    if (leadPopupid?.length > 0) {
      setOpenLT(true)
    } else {
      setOpenLT(false)
      Toaster.TOAST('Please select any entry', 'error')
    }
  }

  const handleLeadMassTransfer = () => {
    let data = {
      lead_ids: leadPopupid,
      owner_id: parseInt(contact_detail_id)
    }
    if (contactErr === '' && contact_detail_id) {
      setTransferLoader(true)
      massTransferApi(data)
    } else {
      setContactErr('Please select owner')
    }
  }

  const massTransferApi = data => {
    LeadAPI.leadTransfer({ data })

      .then(response => {
        setTransferLoader(false)
        if (response) {
          setLeadPopupId([])
          Toaster.TOAST(response?.message, 'success')
          setOpenLT(false)
          setContactErr('')
          setContactsValue('')
          setIsDeleted(prev => !prev)
        } else {
          setLeadPopupId([])
        }
      })
      .catch(error => {
        setTransferLoader(false)
        Toaster.TOAST(restMethodError(error), 'error')
        console.log(error)
      })
  }

  const handleToCloseLT = () => {
    setOpenLT(false)
    setContactErr('')
    setContactsValue('')
  }

  const handleLeadDelete = () => {
    let data = {
      lead_ids: leadPopupid
    }
    if (leadPopupid?.length > 0) {
      LeadAPI.leadMassDelete({ data })

        .then(response => {
          if (response) {
            setLeadPopupId([])
            setIsDeleted(prev => !prev)
            Toaster.TOAST(response?.message, 'success')
          } else {
            setLeadPopupId([])
          }
        })
        .catch(error => {
          Toaster.TOAST(restMethodError(error), 'error')
          console.log(error)
        })
    } else {
      Toaster.TOAST('Please select any entry', 'error')
    }
  }

  const toggleDrawer = () => {
    setOpen(!open)
    setAccordionFilterData(accordionData)
    setSearchAccordianQuery('')
  }

  const toggleDrawerAction = () => {
    setOpenAction(!openAction)
    setManage(false)
    setItemList(leadDefaultList)
  }

  const StyledMenu = styled(props => (
    <Menu
      transformOrigin={{
        vertical: 0,
        horizontal: 0
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 0,
      marginTop: theme.spacing(0),
      minWidth: 190,
      // marginLeft: 83,

      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '0px 0'
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5)
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          )
        }
      }
    }
  }))

  const [anchorEl, setAnchorEl] = useState(null)
  const butonopen = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOpenform = () => {
    setAnchorEl(null)
    setOpenForm(true)
  }

  useEffect(() => {
    if (openForm) {
      navigate(`/lead/create`)
    }
  }, [anchorEl])

  const handleManageSearch = e => {
    let val = e.target.value
    var updatedList = [...leadDefaultList]
    updatedList = updatedList.filter(item => {
      return item.data.toLowerCase().indexOf(val) !== -1
    })
    setItemList(updatedList)
  }

  const handleApply = () => {
    let creationDateFrom = new Date(created_date_from)
    let creationDateTo = new Date(created_date_to)
    let creationStartDate = `${creationDateFrom.getDate()}/${(
      '0' +
      (creationDateFrom.getMonth() + 1)
    ).slice(-2)}/${creationDateFrom.getFullYear()}`
    let creationEndDate = `${creationDateTo.getDate()}/${(
      '0' +
      (creationDateTo.getMonth() + 1)
    ).slice(-2)}/${creationDateTo.getFullYear()}`

    let modificationDateFrom = new Date(updated_date_from)
    let modificationDateTo = new Date(updated_date_to)
    let modificationDateStart = `${modificationDateFrom.getDate()}/${(
      '0' +
      (modificationDateFrom.getMonth() + 1)
    ).slice(-2)}/${modificationDateFrom.getFullYear()}`
    let modificationDateEnd = `${modificationDateTo.getDate()}/${(
      '0' +
      (modificationDateTo.getMonth() + 1)
    ).slice(-2)}/${modificationDateTo.getFullYear()}`

    let data = {}

    if (created_date_from) {
      data = {
        ...data,
        created_date_from: created_date_from !== null ? created_date_from : creationStartDate,
      };
    }
    if (created_date_to) {
      data = {
        ...data,
        created_date_to: created_date_to !== null ? created_date_to : creationEndDate,
      };
    }
    if (created_date_from || created_date_to) {
      filterCount++;
    }
    if (created_date_from && created_date_to) {
      data = {
        ...data, created_at: true,
      };
    }
    if (updated_date_from) {
      data = {
        ...data,
        updated_date_from: updated_date_from !== null ? created_date_from : modificationDateStart,
      };
    }
    if (updated_date_to) {
      data = {
        ...data,
        updated_date_to: updated_date_to !== null ? updated_date_to : modificationDateEnd,
      };
    }
    if (updated_date_from || updated_date_to) {
      filterCount++;
    }
    if (updated_date_from && updated_date_to) {
      data = {
        ...data, updated_at: true,
      };
    }
    if (leadSources) {
      filterCount++
      data = {
        ...data,
        lead_source_id: leadSources
      }
    }
    if (leadStatus) {
      filterCount++
      data = {
        ...data,
        status_id: leadStatus
      }
    }
    if (leadCountry?.name) {
      filterCount++
      data = {
        ...data,
        country: leadCountry.name
      }
    }

    if (leadState?.name) {
      filterCount++
      data = {
        ...data,
        state: leadState.name
      }
    }

    if (leadCity?.name) {
      filterCount++
      data = {
        ...data,
        city: leadCity.name
      }
    }
    if (leadSize) {
      filterCount++
      data = {
        ...data,
        company_size_id: leadSize
      }
    }
    if (leadIndustry) {
      filterCount++
      data = {
        ...data,
        industry_id: leadIndustry
      }
    }
    if (owner_id) {
      filterCount++
      data = {
        ...data,
        owner_id: owner_id
      }
    }

    setCount(filterCount)
    setFilterData(data)
    localStorage.setItem("all_filter_data", JSON.stringify(data));
    if (page === 1) {
      if (
        created_date_from ||
        created_date_to ||
        updated_date_from ||
        updated_date_to ||
        leadSources ||
        leadCity ||
        leadCountry ||
        leadState ||
        leadStatus ||
        leadSize ||
        leadIndustry ||
        owner_id
      ) {
        appendFilterParams(data);
        setSearchParams({ ...data })
      }
    } else {
      setPage(1)
      setSearchParams({ page: 1, ...data })
    }
    check = true
  }

  const appendFilterParams = (params) => {
    if (allFilterData)
      applyFilter(allFilterData);
  }

  const applyFilter = data => {
    setFilterLoader(true)
    LeadAPI.getFilter(data, page, pageSize, dropdownCheck)
      .then(response => {
        if (response?.data) {
          setListData(response?.data)
          // if (page === 1) {
          setRowCount(response?.meta?.total_records)
          // }
          const attr = response?.data?.map((event, index) => {
            return event?.attributes
          })
          setGlobalLeads(attr)
          setOpen(false)
          setSearchQuery('')
          setSearchAccordianQuery('')
          setOpenAction(false)
          setBtnDisabled(false)
          setSrchData(false);
          check = true
          //error state
        } else {
          setGlobalLeads([])
          setRowCount(0)
          setOpen(false)
          setOpenAction(false)
          setPage(1)
          setSearchParams({ page: 1 })
          setBtnDisabled(false)
          setSrchData(false);
          check = true
        }
        setFilterLoader(false)
      })
      .catch(error => {
        Toaster.TOAST(getMethodError(error), 'error')
        setFilterLoader(false)
        console.log(error)
      })
  }

  useEffect(() => {
    if (check && !srchData) {
      appendFilterParams(filterData);
    }
  }, [page, isDeleted])

  const handleClearFilter = () => {
    setCreated_date_from('')
    setCreated_date_to('')
    setUpdated_date_from('')
    setUpdated_date_to('')
    setLeadCountry('')
    setLeadCity('')
    setLeadSources('')
    setLeadStatus('')
    setLeadSize('')
    setLeadIndustry('')
    setLeadState('')
    setOwner('')
    setContactsValue('')
  }

  const handleClear = val => {
    setActiveAccordion([])
    handleClearFilter()
    setSearchAccordianQuery('')
    if (val === 'close') {
      toggleDrawer()
    } else if (val === 'clear' && count !== 0) {
      setActiveAccordion([])
      handleClearFilter()
      setCount(0)
      setResetFilter(prev => !prev)
      setBtnDisabled(true)
      setPage(1)
      setSearchParams({ page: 1 })
      allFilterDataKeys.map(elem => {
        searchParams.delete(elem)
      }
      )
      setSearchParams(searchParams);
      localStorage.removeItem("all_filter_data");
      check = false
    }
  }

  const handleReset = () => {
    setActiveAccordion([])
    toggleDrawer()
    setSearchAccordianQuery('')
    setResetFilter(prev => !prev)
    handleClearFilter()
    setCount(0)
    setPage(1)
    setSearchParams({ page: 1 })
    allFilterDataKeys.map(elem => {
      searchParams.delete(elem)
    }
    )
    setSearchParams(searchParams);
    localStorage.removeItem("all_filter_data");
    setBtnDisabled(true)
    check = false
  }

  const uploadFile = e => {
    setLeadImport(false)
    setUploading(true)
    if (e.target.files[0]) {
      const file = e.target.files[0]
      if (
        file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        const formData = new FormData()
        formData.append('file', file)
        //
        LeadAPI.fileUpload(formData, {
          signal: controller.signal
        })

          .then(response => {
            setUploading(false)
            if (response) {
              setLeadImport(false)
              setOpens(false)
              setOpens(true)
              setLeadImport(false)
              setleadImportSucessfull(true)
              setleadImportProcess(false)
              setIsDeleted(prev => !prev)
            }
            setImportErr([])
          })
          .catch(error => {
            setImportErr(error.response?.data?.errors)
            setUploading(false)
            setLeadImport(true)
            Toaster.TOAST(restMethodError(error), 'error')
            console.log(error)
          })
      } else {
        setUploading(false)
        Toaster.TOAST('Please select Excel file only', 'error')
        setLeadImport(true)
      }
    }
  }

  const donwloadLeadfile = () => {
    setDownloading(true)
    LeadAPI.getfildeDownload()
      .then(blob => {
        setDownloading(false)
        const fileURL = window.URL.createObjectURL(new Blob([blob]))
        let alink = document.createElement('a')
        alink.href = fileURL
        alink.download = `Lead.xlsx`
        alink.click()
        setLeadImport(true)
      })
      .catch(error => {
        setDownloading(false)
        Toaster.TOAST(getMethodError(error), 'error')
        console.log(error)
      })
  }

  useEffect(() => {
    if (leadData) {
      setManageState(JSON.parse(leadData))
      getData()
    }
  }, [leadData])

  const handleClickOpen1 = () => {
    setOpens(true)
    setAnchorEl(null)
    setLeadImport(true)
  }

  const handleToClose = () => {
    setleadImportSucessfull(false)
    setOpens(false)
    setLeadImport(true)
    setImportErr([])
  }

  const handleOkay = () => {
    setOpens(false)
    setLeadImport(false)
    setleadImportSucessfull(false)
    setleadImportProcess(false)
    setimported(true)
    setImportErr([])
    // setIsDeleted(true)
  }

  const handleStatusList = e => {
    let val = e.target.value
    setAllLead(val)
    if (val) {
      dropdownCheck = true
    } else {
      dropdownCheck = false
    }
    setPage(1)
    setSearchParams({ page: 1, ...allFilterData })
    handleDropdownFilter(val)
  }
  const handleDropdownFilter = val => {
    LeadAPI.getDropdownFilter(val, page, pageSize, check)

      .then(response => {
        if (response?.data) {
          const attr = response?.data?.map((event, index) => {
            return event?.attributes
          })
          // if (page === 1) {
          setRowCount(response?.meta?.total_records)
          // }
          // check = true;
          setSrchData(false);
          setSearchQuery('')
          setGlobalLeads(attr)
        } else {
          setGlobalLeads([])
        }
      })
      .catch(error => {
        Toaster.TOAST(getMethodError(error), 'error')
        console.log(error)
      })
  }

  useEffect(() => {
    if (allLead && !srchData && !check) {
      handleDropdownFilter(allLead)
    }
  }, [page, isDeleted, check])

  const handleConvert = val => {
    if (val !== 'lost_lead') {
      switch (leadPopupid?.length) {
        case 0:
          Toaster.TOAST('Please select anyone entry', 'error')
          break
        case 1:
          let data = {
            lead_ids: leadPopupid
          }

          switch (val) {
            case 'pipeline':
            case 'potential':
            case 'deal':
              data = {
                ...data,
                convert_to: val
              }
              break
            default:
              break
          }

          LeadAPI.convertType({ data })
            .then(response => {
              if (response) {
                Toaster.TOAST(response?.message, 'success')
                switch (val) {
                  case 'pipeline':
                    navigate(`/pipeline/create/${response?.record_id}`)
                    break
                  case 'potential':
                    navigate(`/potential/create/${response?.record_id}`)
                    break
                  case 'deal':
                    navigate(`/deal/create/${response?.record_id}`)
                    break
                  default:
                    break
                }
              }
            })
            .catch(error => {
              Toaster.TOAST(restMethodError(error), 'error')
              console.log(error)
            })
          break
        default:
          Toaster.TOAST('Please select only one entry', 'error')
          break
      }
    }
  }

  const stateChange = () => {
    return (
      manageState?.company_name === 1 &&
      manageState?.email === 1 &&
      manageState?.phone_number === 1 &&
      manageState?.lead_source_id === 1 &&
      manageState?.website === 1 &&
      manageState?.status_id === 1 &&
      manageState?.street_address === 1 &&
      manageState?.zip_code === 1 &&
      manageState?.owner === 1
    )
  }

  const dropdownFilterData = leadStatusArray?.map((elem, key) => {
    return (
      <MenuItem key={key} value={elem?.id}>
        {elem?.attributes?.name}
      </MenuItem>
    )
  })

  //  convert into lost lead
  const handleLostConvert = label => {
    if (label === 'Convert to Lost') {
      if (leadPopupid?.length === 1) {
        setLostModal(!lostModal)
      } else if (leadPopupid?.length === 0) {
        Toaster.TOAST('Please select anyone entry', 'error')
      } else {
        Toaster.TOAST('Please select only one entry', 'error')
      }
    }
  }

  // lost lead reason crud

  useEffect(() => {
    handleFields()
  }, [crudField])

  useEffect(() => {
    setItemValue(fieldName?.attributes?.name)
  }, [fieldName])

  let deleteContent = {
    Name: fieldID?.attributes?.name,
    EditLabel: field_editLabel,
    ModuleName: module_name
  }

  const handleModalClose = () => setShow(false)
  const handleFields = () => {
    if (crudField === 'lost_lead') {
      field_editLabel = 'Lost Lead'
      field_placeholder = 'Enter lost lead'
      field_addLabel = 'Lost Lead'
    }
  }

  const handleValid = () => {
    if (!itemValue) {
      setFieldErrMsg("Field can't be empty")
    }
  }

  const handleFieldChange = val => {
    setItemValue(val)
  }

  const handleShow = data => {
    handleDeleteClick(data?.id, false)
    setFieldID(data)
  }

  const handleEditClick = (event, data) => {
    setIsEditModal(!isEditModal)
    setFieldName(data)
  }

  const [reason_id, setReasonId] = useState('')

  const onAddPopup = (data, id) => {
    if (data === 'add_new') {
      setItemValue('')
      setFieldName('')
    }
    setIsEditModal(!isEditModal)
  }

  const handleClosePopup = () => {
    setIsEditModal(!isEditModal)
    setFieldName()
    setFieldErrMsg('')
  }

  const handleDropdownSubmit = () => {
    handleValid()
    let data = {
      data: {
        name: itemValue
      }
    }

    if (itemValue && !fieldErrMsg) {
      apiCallingEndPoints(data)
    }
  }

  const apiCallingEndPoints = data => {
    let apiCall
    apiCall = fieldName?.id
      ? LostLeadApi.editReason(fieldName.id, data)
      : LostLeadApi.createReason(data)

    handleDropdownsAPI(apiCall)
  }

  const handleDropdownsAPI = apiCall => {
    if (!apiCall) return
    apiCall
      .then(response => {
        if (response?.data) {
          setIsEditModal(false)
          let successMessage = ''
          successMessage = fieldName?.id
            ? 'Reason updated Successfully'
            : 'Reason created Successfully'
          if (!fieldName?.id) {
            setReasonId(response?.data?.id)
          }
          Toaster.TOAST(successMessage, 'success')
          handleClosePopup()
        }
      })
      .catch(error => {
        Toaster.TOAST(restMethodError(error), 'error')
        console.log(error)
      })
  }

  const handleDeleteClick = (id, associatedFlag) => {
    const deleteId = id ? id : fieldID?.id
    let apiCall = LostLeadApi.deleteReason(deleteId, associatedFlag)
    handleDropdownItemDelete(apiCall)
  }

  const handleDropdownItemDelete = apiCall => {
    if (!apiCall) return
    setDisabled(true)
    apiCall
      .then(res => {
        Toaster.TOAST(res?.message, 'success')
        handleModalClose()
        setIsDelete(!isDelete)
        setReasonId('')
        setDisabled(false)
      })
      .catch(error => {
        if (error?.response?.data?.code === RECORD_EXIST) {
          setShow(true)
        }
        setDisabled(false)
        Toaster.TOAST(deleteMethodError(error), 'error')
        console.log(error)
      })
  }

  const accordionData = [
    {
      elementName: 'Date of Creation',
      content: (
        <Between
          value={created_date_from}
          endDate={created_date_to}
          setFlag={setFlag}
          handleStartDate={setCreated_date_from}
          handleEndDate={setCreated_date_to}
        />
      )
    },
    {
      elementName: 'Last Modification',
      content: (
        <Between
          value={updated_date_from}
          endDate={updated_date_to}
          setFlag={setFlag}
          handleStartDate={setUpdated_date_from}
          handleEndDate={setUpdated_date_to}
        />
      )
    },
    {
      elementName: 'Leads by Source',
      content: (
        <ListName
          title='Lead Source'
          placeholder='Select lead source'
          name='leadSources'
          setFlag={setFlag}
          handleChange={e => {
            setLeadSources(e.target.value)
          }}
          setValue={setLeadSources}
          value={leadSources}
          select={true}
          arr={leadSourceArray?.map((data, key) => {
            return (
              <MenuItem key={key} value={data?.id}>
                {data?.attributes?.name}
              </MenuItem>
            )
          })}
        />
      )
    },
    {
      elementName: 'Leads by Status',
      content: (
        <ListName
          title='Lead Status'
          placeholder='Select lead status'
          name='leadstatus'
          setFlag={setFlag}
          handleChange={e => {
            setLeadStatus(e.target.value)
          }}
          setValue={setLeadStatus}
          value={leadStatus}
          select={true}
          arr={leadStatusArray?.map((data, key) => {
            return (
              <MenuItem key={key} value={data?.id}>
                {data?.attributes?.name}
              </MenuItem>
            )
          })}
        />
      )
    },
    {
      elementName: 'Leads by Country',
      content: (
        <Select
          title='Country'
          placeholder='Select country'
          name='leadcountry'
          className='createlead-textField placeholder_field ma-reactSelect-style'
          classNamePrefix='ma-react-select-box'
          isClearable={() => setLeadCountry('')}
          options={Country.getAllCountries()}
          getOptionLabel={options => {
            return (
              <div className='country-search'>
                <div>{options?.name}</div>&nbsp;
                <div>{options?.flag}</div>
              </div>
            )
          }}
          getOptionValue={options => {
            return options['name']
          }}
          value={leadCountry}
          onChange={value => {
            setLeadCountry(value)
            setFlag(prev => !prev)
          }}
        />
      )
    },
    {
      elementName: 'Leads by State',
      content: (
        <Select
          className='createlead-textField placeholder_field ma-reactSelect-style'
          classNamePrefix='ma-react-select-box'
          fullWidth
          id='state'
          name='state'
          placeholder='Select state'
          isClearable={() => setLeadState('')}
          options={State?.getStatesOfCountry(leadCountry?.isoCode)}
          getOptionLabel={options => {
            return options['name']
          }}
          getOptionValue={options => {
            return options['name']
          }}
          onClose={() => setLeadState('')}
          value={leadState}
          onChange={item => {
            setLeadState(item)
            setFlag(prev => !prev)
          }}
        />
      )
    },
    {
      elementName: 'Leads by City',
      content: (
        <Select
          className='createlead-textField placeholder_field ma-reactSelect-style'
          classNamePrefix='ma-react-select-box'
          fullWidth
          id='city'
          name='city'
          isClearable={() => setLeadCity('')}
          placeholder='Select city'
          options={City.getCitiesOfState(
            leadState?.countryCode,
            leadState?.isoCode
          )}
          getOptionLabel={options => {
            return options['name']
          }}
          getOptionValue={options => {
            return options['name']
          }}
          onClose={() => setLeadCity('')}
          value={leadCity}
          onChange={item => {
            setLeadCity(item)
            setFlag(prev => !prev)
          }}
        />
      )
    },
    {
      elementName: 'Leads by Employee Size',
      content: (
        <ListName
          title='Employee Size'
          placeholder='Select employee size'
          name='leadSize'
          setFlag={setFlag}
          handleChange={e => {
            setLeadSize(e.target.value)
          }}
          setValue={setLeadSize}
          value={leadSize}
          select={true}
          arr={compnySizeArray?.map((elem, index) => {
            return (
              <MenuItem key={index} value={elem?.id}>
                {elem?.attributes?.name}
              </MenuItem>
            )
          })}
        />
      )
    },
    {
      elementName: 'Leads by Industry',
      content: (
        <ListName
          title='Industry'
          placeholder='Select industry'
          name='leadindustry'
          setFlag={setFlag}
          handleChange={e => {
            setLeadIndustry(e.target.value)
          }}
          setValue={setLeadIndustry}
          value={leadIndustry}
          select={true}
          arr={leadIndustryArray?.map((elem, index) => {
            return (
              <MenuItem key={index} value={elem?.id}>
                {elem?.attributes?.name}
              </MenuItem>
            )
          })}
        />
      )
    },
    {
      elementName: 'Leads by Owner',
      content: (
        <LeadOwnerDropdown
          label='Lead Owner'
          userLoading={userLoading}
          placeholder='lead owner'
          users={usersData}
          owner_id={owner_id}
          OwnerValue={contactsValue}
          getContactData={getContactData}
          handleOwner={val => {
            setOwner(val)
            setFlag(prev => !prev)
          }}
          setFieldValue={() => { }}
        />
      )
    }
  ]

  const [accordionFilterData, setAccordionFilterData] = useState(accordionData)

  useEffect(() => {
    const filteredAccordionData = accordionData.filter(accordion =>
      accordion.elementName
        .toLowerCase()
        .includes(searchAccordianQuery.toLowerCase())
    )
    if (searchAccordianQuery?.length > 0) {
      setAccordionFilterData(filteredAccordionData)
    } else {
      setAccordionFilterData(accordionData)
    }
  }, [flag])

  const handleAccordionChange = elementName => {
    if (activeAccordion.includes(elementName)) {
      setActiveAccordion(activeAccordion.filter(item => item !== elementName))
    } else {
      setActiveAccordion([...activeAccordion, elementName])
      if (elementName === 'Leads by Status') {
        getLeadStatus()
      }
      if (elementName === 'Leads by Source') {
        getLeadSourceData()
      }
      if (elementName === 'Leads by Employee Size') {
        getCompanySize()
      }
      if (elementName === 'Leads by Industry') {
        getIndustry()
      }
      if (elementName === 'Leads by Owner') {
        getLeadOwnerData()
      }
    }
  }

  useEffect(() => {
    if (searchParams.get("page")) {
      if (!srchData && !dropdownCheck)
        localStorage.setItem("current_page", +searchParams.get("page"))
      else
        localStorage.setItem("current_page", 1)
    }
  }, [searchParams]);

  const isAccordionOpen = elementName => {
    return activeAccordion.includes(elementName)
  }

  const handleSetSearchParam = (page) => {
    if (allFilterData && Object.keys(allFilterData).length > 0) {
      setSearchParams({ page: parseInt(page), ...allFilterData })
    }
    else {
      setSearchParams({ page: parseInt(page) })
    }
  }

  const handleSearch = query => {
    setSearchAccordianQuery(query)
    const filteredAccordionData = accordionData.filter(accordion =>
      accordion.elementName.toLowerCase().includes(query.toLowerCase())
    )
    setAccordionFilterData(filteredAccordionData)
  }

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box component='main' className='ma-mainTop-box' sx={{ flexGrow: 1 }}>
          <ImportDialogBox
            opens={opens}
            handleToClose={handleToClose}
            leadImport={leadImport}
            donwloadLeadfile={donwloadLeadfile}
            uploadFile={uploadFile}
            leadImportProcess={leadImportProcess}
            handleController={() => {
              setLeadImport(true)
            }}
            leadImportSucessfull={leadImportSucessfull}
            handleOkay={handleOkay}
            downloading={downloading}
            uploading={uploading}
            importErr={importErr}
          />
          {/* only use for Lead Import closed  */}
          {/* lead transfer used only */}
          <DialogBox
            label='Lead Transfer'
            openLT={openLT}
            handleToCloseLT={handleToCloseLT}
            contactDropDown={contactDropDown}
            handleLeadMassTransfer={handleLeadMassTransfer}
            loading={transferLoader}
          />

          <div className='ma-mainShadow-box'>
            <div className='ma-leads-box'>
              <div className='leadChildBox'>
                <div className='ma-allfilter-list'>
                  <Button
                    data-testid='create-lead-btn'
                    className='CreateLeadButton'
                    id='demo-customized-button'
                    aria-controls={
                      butonopen ? 'demo-customized-menu' : undefined
                    }
                    aria-haspopup='true'
                    aria-expanded={butonopen ? 'true' : undefined}
                    variant='contained'
                    disableElevation
                    onClick={event => {
                      setAnchorEl(event.currentTarget)
                    }}
                    startIcon={<AddIcon />}
                    endIcon={<KeyboardArrowDownIcon />}
                  >
                    Create Lead
                  </Button>
                  <StyledMenu
                    id='demo-customized-menu'
                    MenuListProps={{
                      'aria-labelledby': 'demo-customized-button'
                    }}
                    anchorEl={anchorEl}
                    open={butonopen}
                    onClose={handleClose}
                  >
                    <MenuItem
                      className='ma-menuFont-family'
                      onClick={handleOpenform}
                      disableRipple
                    >
                      Create Manually
                    </MenuItem>

                    <MenuItem
                      className='ma-menuFont-family'
                      onClick={handleClickOpen1}
                    >
                      Import Template
                    </MenuItem>
                  </StyledMenu>
                  <AllLeads
                    alignParam={["bottom", -35, "top", "left"]}
                    title='All Leads'
                    allLead={allLead}
                    handleList={handleStatusList}
                    leadArray={dropdownFilterData}
                  />
                  <Button className='p-0' onClick={toggleDrawer}>
                    <Typography
                      variant='button'
                      className='ma-sideEye-icon mb-0 p-0'
                      gutterBottom
                    >
                      <TuneIcon className='mb-0 me-2 p-0' />
                      All Filter ({count})
                    </Typography>
                  </Button>
                </div>
              </div>
            </div>
            <Drawer anchor={'right'} open={open} onClose={toggleDrawer}>
              <div>
                <div className='ma-LeadMD filterSelect'>
                  <h4>All Filters</h4>
                  <Button
                    className='ma-close-btn'
                    onClick={() => handleClear('close')}
                  >
                    {/*  toggleDrawer */}
                    <CloseIcon />
                  </Button>
                </div>
                <FilterByLeads
                  title='By Leads'
                  handleReset={handleReset}
                  btnDisabled={btnDisabled}
                  handleSearch={e => {
                    handleSearch(e.target.value)
                  }}
                >
                  <div className='leadfilterDCform'>
                    {accordionFilterData.map((accordion, index) => (
                      <FilterAccordion
                        key={index}
                        elementName={accordion.elementName}
                        content={accordion.content}
                        handleAccordionChange={handleAccordionChange}
                        isAccordionOpen={isAccordionOpen}
                      />
                    ))}
                  </div>
                </FilterByLeads>
                {isAnyAccordionOpen && (
                  <div className='leadMDbutton listMDbutton border-0 mb-0 mt-3'>
                    <ButtonLoader
                      loading={filterLoader}
                      classStyle={'applay'}
                      handleClick={() => handleApply()}
                      title={'APPLY'}
                    />
                    <Button
                      className='cancel'
                      onClick={() => handleClear('clear')}
                    >
                      CLEAR
                    </Button>
                  </div>
                )}
              </div>
            </Drawer>
            <div>
              <div className='searchFilterDiv'>
                <TextField
                  size='small'
                  className='searchField'
                  name='Search'
                  placeholder='Search'
                  type='text'
                  value={searchQuery}
                  onChange={e => handleSearchChange(e)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                  helperText={<span className='ma-error'></span>}
                />
                <div className='ma-convertEdit-bar p-0'>
                  <Convert
                    data={data}
                    handleConvert={handleConvert}
                    handleLostConvert={handleLostConvert}
                  />
                  <Actions actionsData={actionsData} />
                  <Button
                    sx={{ width: 10 }}
                    size='small'
                    className='iconDiv dropdown-toggle'
                    onClick={toggleDrawerAction}
                  >
                    <span style={{ color: 'black' }}>
                      <TuneIcon />
                    </span>
                  </Button>
                  <Drawer
                    anchor={'right'}
                    open={openAction}
                    onClose={toggleDrawerAction}
                  >
                    <ManageData
                      title='By Leads'
                      loading={manageLoader}
                      toggleDrawerAction={toggleDrawerAction}
                      handleManageSearch={handleManageSearch}
                      handleManage={handleManage}
                      itemList={itemList}
                      handleclose={handleclose}
                      iconId={iconId}
                      stateChange={stateChange}
                      manageDisable={manageDisable}
                    />
                  </Drawer>
                </div>
              </div>
              <div>
                <LeadTable
                  isDeleted={isDeleted}
                  resetFilter={resetFilter}
                  listData={[{ listData }, { manage }]}
                  page={page}
                  handlePageChange={(newPage) => {
                    setPage(newPage)
                    handleSetSearchParam(newPage)
                  }}
                  rowCount={rowCount}
                  handleRowCount={newCount => setRowCount(newCount)}
                  isImported={importedSuceessfully}
                  count={count}
                  srchData={srchData}
                  check={check}
                  dropdownCheck={dropdownCheck}
                  setContactErr={setContactErr}
                />
              </div>
            </div>
          </div>
          {/* lost lead for reason dialog */}
          {lostModal && (
            <LostPipelinePopup
              setOpenModal={setLostModal}
              openModal={isEditModal}
              type={'Lead'}
              id={leadPopupid[0]}
              addNew={'REASON'}
              onAddDetail={onAddPopup}
              handleEditClick={handleEditClick}
              handleShow={handleShow}
              isDelete={isDelete}
              fieldName={fieldName}
              setReasonId={setReasonId}
              reason_id={reason_id}
            />
          )}
          {isEditModal && (
            <DropdownCreateEdit
              openModal={isEditModal}
              setOpenModal={setIsEditModal}
              valueName={fieldName}
              editLabel={'Reason'}
              addLabel={'Reason'}
              placeholder={'Enter reason'}
              handleSubmit={handleDropdownSubmit}
              itemValue={itemValue}
              handleChange={handleFieldChange}
              errMsg={fieldErrMsg}
              setErrMsg={setFieldErrMsg}
              handleToCloseLT={handleClosePopup}
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
    </>
  )
}

export default Lists
