import React, { useEffect, useState } from 'react'
import Actions from '../../pages/common/Actions'
import { Box, Button, InputAdornment, MenuItem, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import ContactListTable from './ContactListTable'
import AllLeads from '../../pages/common/DropdownFilter'
import { ContactListApi } from '../../apis/ContactListApi'
import debouce from 'lodash.debounce'
import { getMethodError, restMethodError } from '../../constants/errorMessages'
import { Toaster } from '../../pages/common/Toaster'
import CreateList from './CreateList'
import { useSearchParams } from 'react-router-dom'
import DomainPopup from '../../pages/common/DomainPopup'
import ContactActionPopup from './ContactActionPopup'
import CopyToList from './CopyToList'
import ExportReport from '../../pages/common/ExportReport'

let dropdownCheck = false

export default function ContactList () {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [contactListData, setContactListData] = useState([])
  const [srchData, setSrchData] = useState(false)
  const [loader, setLoader] = useState(false)
  const [page, setPage] = useState(1)
  const [gridKey, setGridKey] = useState(0)
  const pageSize = 10
  const [rowCount, setRowCount] = useState(0)
  const butonopen = Boolean(null)
  const [createList, setCreateList] = useState(false)
  const [allContacts, setAllContacts] = useState('')
  const [openDeletePopup, setOpenDeletePopup] = useState(false)
  const [categories, setCategories] = useState([])
  const [renamePopup, setRenamePopup] = useState(false)
  const [rename, setRename] = useState('')
  const [renameErr, setRenameErr] = useState('')
  const [createNewListPopup, setCreateNewListPopup] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newListNameErr, setNewListNameErr] = useState('')
  const [actionData, setActionsData] = useState()
  const [ContactListId, setContactListId] = useState([])
  const [srchUser, setSrchUser] = useState(false)
  const [userLoading, setUserLoading] = useState(false)
  const [contactFolder, setContactFolder] = useState([])
  const [value, setValue] = useState(
    searchParams.get('filter') ? searchParams.get('filter') : ''
  )
  const [copyListPopup, setCopyListPopup] = useState(false)
  const [exportPopup, setExportPopup] = useState(false)

  const commonActions = [
    {
      id: 1,
      value: 'copy_to_list',
      handleClick: () => handleCopyListPopup(),
      title: 'Copy to list',
      disabled: ContactListId.length === 0
    },
    {
      id: 2,
      value: 'create_new_list',
      handleClick: () => {
        setCreateNewListPopup(true)
      },
      title: 'Create new list',
      disabled: ContactListId.length === 0
    },
    {
      id: 3,
      value: 'export',
      handleClick: () => setExportPopup(true),
      title: 'Export'
    }
  ]
  const otherActions = [
    {
      id: 3,
      value: 'rename list',
      handleClick: () => handleRenamePopup(),
      title: 'Rename List'
    },
    {
      id: 4,
      value: 'duplicate list',
      handleClick: () => handleDuplicateList(),
      title: 'Duplicate list'
    },
    {
      id: 5,
      value: 'delete list',
      handleClick: () => setOpenDeletePopup(true),
      title: 'Delete list'
    }
  ]

  const updateActionsData = () => {
    let updatedActionsData = [...commonActions]

    if (allContacts) {
      updatedActionsData = [...updatedActionsData, ...otherActions]
    } else {
      updatedActionsData = [...updatedActionsData]
    }

    setActionsData(updatedActionsData)
  }

  const handleCopyListPopup = () => {
    setCopyListPopup(true)
  }

  useEffect(() => {
    updateActionsData()
  }, [allContacts])

  useEffect(() => {
    getCategories()
  }, [])

  useEffect(() => {
    if (srchData) {
      getCategories()
    }
  }, [srchData])

  const debounceSaveUser = React.useCallback(
    debouce(function (e) {
      if (e) {
        getCategories(e)
      }
    }, 800),
    []
  )

  const debounceSave = React.useCallback(
    debouce(function (e) {
      getContactListData(e)
    }, 600),
    []
  )

  useEffect(() => {
    if (!srchData && !dropdownCheck && value == '') {
      getContactListData()
    }
  }, [page])

  useEffect(() => {
    if (srchData) {
      getContactListData(searchQuery)
    }
  }, [page, srchData])

  useEffect(() => {
    let page_count = searchParams.get('page') ? +searchParams.get('page') : page
    if (!srchData && allContacts && value !== '') {
      dropdownCheck = true;
      handleDropdownFilter(allContacts)
    }
    if (searchParams.get('page')) {
      setPage(page_count)
    }
  }, [page])

  const getContactListData = data => {
    let page_count = searchParams.get('page') ? +searchParams.get('page') : page
    setLoader(true)
    ContactListApi.getContactLists(page_count, pageSize, data, dropdownCheck)
      .then(res => {
        setLoader(false)
        if (res?.data) {
          setContactListData(res.data)
          setRowCount(res?.meta?.total_records)
          setGridKey(prevKey => prevKey + 1)
        } else {
          setContactListData([])
        }
      })
      .catch(err => {
        setLoader(false)
        Toaster.TOAST(getMethodError(err), 'error')
        console.log(err)
      })
  }

  useEffect(() => {
    if (value !== '') {
      handleDropdownFilter(value)
      setAllContacts(value)
      showCategoriesById(value)
    }
    if(searchParams.get("filter") || value !== '') {
      dropdownCheck = true;
    }
    getAddContactList()
  }, [])

  const handleDropdownFilter = val => {
    setLoader(true)
    ContactListApi.getDropdownFilter(val, page, pageSize, dropdownCheck)
      .then(res => {
        setLoader(false)
        if (res?.data) {
          setContactListData(res?.data)
          if (page != 1 && !res?.meta?.next_page && !res?.meta?.previous_page) {
            setPage(1)
            setSearchParams({ filter: val, page: 1 })
          }
          setRowCount(res?.meta?.total_records)
        } else {
          setContactListData([])
        }
      })
      .catch(error => {
        setLoader(false)
        setContactListData([])
        Toaster.TOAST(getMethodError(error), 'error')
      })
  }

  const getCategories = () => {
    ContactListApi.getContactCategories()
      .then(res => {
        setCategories(res?.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const showCategoriesById = id => {
    ContactListApi.categoriesById(id)
      .then(res => {
        if (res?.data) {
          setRename(res.data.attributes.name)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const handleSearchChange = e => {
    let data = e.target.value
    setSearchQuery(data)
    if (page === 1) {
      debounceSave(data)
    } else {
      setPage(1)
      if (searchParams.get('filter')) {
        setSearchParams({ filter: value, page: 1 })
      } else {
        setSearchParams({ page: 1 })
      }
    }
    if (data) {
      setSrchData(true)
    } else {
      setSrchData(false)
    }
  }

  const handlePageChange = newPage => {
    if (searchParams.get('filter')) {
      setSearchParams({ filter: value, page: newPage })
    } else {
      setSearchParams({ page: newPage })
    }
    setPage(newPage)
  }

  const handleContacts = e => {
    let val = e.target.value
    setValue(val)
    if (val) {
      setSearchParams({ filter: val, page: page })
    } else {
      searchParams.delete('filter')
      searchParams.delete('page')
      setSearchParams(searchParams)
      setValue('')
    }
    setAllContacts(val)
    if (val) {
      dropdownCheck = true
    } else {
      dropdownCheck = false
      setPage(1)
    }
    handleDropdownFilter(val)
    showCategoriesById(val)
  }

  const handleClick = () => {
    setCreateList(true)
  }

  const handleDeletePopup = () => {
    setOpenDeletePopup(false)
  }

  const handleRenamePopup = () => {
    setRenamePopup(true)
    showCategoriesById(allContacts)
  }

  const closeRenamePopup = () => {
    setRenamePopup(false)
    setRenameErr('')
  }

  const handleRename = e => {
    let val = e.target.value
    setRename(val)
    if (!val) {
      setRenameErr('Name is Required')
    } else {
      setRenameErr('')
    }
  }

  const handleCreateListName = e => {
    let val = e.target.value
    setNewListName(val)
    if (!val) {
      setNewListNameErr('Category name is Required')
    } else {
      setNewListNameErr('')
    }
  }

  const getAddContactList = val => {
    ContactListApi.getContactLists(page, pageSize, val)
      .then(data => {
        setUserLoading(true)
        if (data?.data) {
          setContactFolder(data?.data)
          setUserLoading(false)
        } else {
          setContactFolder([])
          setUserLoading(false)
        }
      })
      .catch(error => {
        setUserLoading(false)
        Toaster.TOAST(getMethodError(error), 'error')
        console.log(error)
      })
  }
  const closeCreateListName = () => {
    setCreateNewListPopup(false)
    setNewListName('')
    setNewListNameErr('')
  }

  const handleRenameCategory = () => {
    if (!rename) {
      setRenameErr('Name is required')
    }
    const data = {
      name: rename,
      contact_category_id: allContacts
    }
    if (rename) {
      setLoader(true)
      ContactListApi.renameContactCategory({ data: data })
        .then(res => {
          setLoader(false)
          getCategories()
          setRenamePopup(false)
          setRenameErr('')
          Toaster.TOAST(res?.message, 'success')
        })
        .catch(err => {
          setLoader(false)
          Toaster.TOAST(restMethodError(err), 'error')
        })
    }
  }

  const handleDuplicateList = () => {
    const data = {
      contact_category_id: allContacts
    }
    setLoader(true)
    ContactListApi.duplicateList({ data: data })
      .then(res => {
        setLoader(false)
        getCategories()
        Toaster.TOAST(res?.message, 'success')
      })
      .catch(err => {
        setLoader(false)
        Toaster.TOAST(restMethodError(err), 'error')
      })
  }

  const handleCreateList = () => {
    if (!newListName) {
      setNewListNameErr('Category name is Required')
    }
    const data = {
      name: newListName,
      contact_ids: ContactListId
    }
    if (newListName && ContactListId) {
      setLoader(true)
      ContactListApi.create(data)
        .then(res => {
          setLoader(false)
          if (res?.message) {
            setCreateNewListPopup(false)
            getCategories()
            setNewListName('')
            setNewListNameErr('')
            getContactListData()
            Toaster.TOAST(res.message, 'success')
          }
        })
        .catch(err => {
          setLoader(false)
          Toaster.TOAST(restMethodError(err), 'error')
        })
    }
  }

  const handleDeleteCategory = () => {
    setLoader(true)
    ContactListApi.categoryDelete(allContacts)
      .then(res => {
        setLoader(false)
        setOpenDeletePopup(false)
        getCategories()
        setAllContacts('')
        dropdownCheck = false;
        getContactListData()
        searchParams.delete('filter')
        setSearchParams(searchParams)
        Toaster.TOAST(res.message, 'success')
      })
      .catch(err => {
        setLoader(false)
        Toaster.TOAST(restMethodError(err), 'error')
      })
  }

  const dropdownFilterData = categories?.map((data, key) => {
    return (
      <MenuItem key={key} value={data?.id}>
        {data?.attributes?.name}
      </MenuItem>
    )
  })

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box component='main' className='ma-mainTop-box' sx={{ flexGrow: 1 }}>
          <div className='ma-mainShadow-box'>
            <div className='leadBox ma-leads-box'>
              <div className='leadChildBox'>
                <div className='ma-allfilter-list'>
                  <Button
                    className='CreateLeadButton'
                    id='demo-customized-button'
                    aria-controls={
                      butonopen ? 'demo-customized-menu' : undefined
                    }
                    aria-haspopup='true'
                    aria-expanded={butonopen ? 'true' : undefined}
                    variant='contained'
                    disableElevation
                    onClick={handleClick}
                    startIcon={<AddIcon />}
                  >
                    Add New List
                  </Button>
                  <AllLeads
                    alignParam={['bottom', -35, 'top', 'left']}
                    title='All contacts'
                    allLead={
                      searchParams.get('filter') &&
                      searchParams.get('filter') !== ''
                        ? searchParams.get('filter')
                        : allContacts
                    }
                    handleList={handleContacts}
                    leadArray={dropdownFilterData}
                  />
                </div>
              </div>
            </div>

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
                  <Actions
                    actionsData={actionData}
                    ContactListId={ContactListId}
                    allContacts={allContacts}
                  />
                </div>
              </div>

              <div>
                <ContactListTable
                  contactListData={contactListData}
                  rowCount={rowCount}
                  page={page}
                  loader={loader}
                  gridKey={gridKey}
                  pageSize={pageSize}
                  handlePageChange={newPage => handlePageChange(newPage)}
                  setContactListId={setContactListId}
                />
              </div>
              {createList && (
                <CreateList
                  openLT={createList}
                  setCreateList={setCreateList}
                  getCategories={getCategories}
                  srchUser={srchUser}
                  setSrchUser={setSrchUser}
                  userLoading={userLoading}
                  setUserLoading={setUserLoading}
                  contactFolder={contactFolder}
                  getAddContactList={getAddContactList}
                />
              )}
              {openDeletePopup && (
                <DomainPopup
                  title={`Delete "${rename}"?`}
                  content={`Are you sure you want to delete"${rename}"?`}
                  open={openDeletePopup}
                  handleClose={handleDeletePopup}
                  handleClick={handleDeleteCategory}
                  primaryBtn={true}
                  loading={loader}
                />
              )}

              {renamePopup && (
                <ContactActionPopup
                  openLT={renamePopup}
                  handleClose={closeRenamePopup}
                  heading='Rename contact list'
                  label={'Contact list name'}
                  value={rename}
                  handleChange={e => handleRename(e)}
                  loading={loader}
                  btnTitle={'Update Name'}
                  error={renameErr}
                  handleClick={() => handleRenameCategory()}
                  placeholder={'Enter category name'}
                />
              )}
              {createNewListPopup && (
                <ContactActionPopup
                  openLT={createNewListPopup}
                  handleClose={closeCreateListName}
                  heading='Create new contact list'
                  label={'Contact list name'}
                  value={newListName}
                  handleChange={e => handleCreateListName(e)}
                  loading={loader}
                  btnTitle={'Create'}
                  error={newListNameErr}
                  handleClick={() => handleCreateList()}
                  placeholder={'Enter contact list name'}
                />
              )}

              {copyListPopup && (
                <CopyToList
                  categories={categories}
                  ContactListId={ContactListId}
                  copyListPopup={copyListPopup}
                  setCopyListPopup={setCopyListPopup}
                  debounceSaveUser={debounceSaveUser}
                  setSrchData={setSrchData}
                  getContactListData={getContactListData}
                />
              )}
              {exportPopup && (
                <ExportReport
                  openLT={exportPopup}
                  handleToCloseLT={() => setExportPopup(false)}
                  cloneReportId={allContacts}
                  isContactList={true}
                  label='Export contacts'
                  ContactListId={ContactListId}
                />
              )}
            </div>
          </div>
        </Box>
      </Box>
    </>
  )
}
