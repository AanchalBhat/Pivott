import React, { useEffect, useState } from 'react'
import PopupFooter from '../../pages/common/PopupFooter'
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography
} from '@mui/material'
import PopupHeader from '../../pages/common/PopupHeader'
import { ContactListApi } from '../../apis/ContactListApi'
import { ButtonLoader } from '../../pages/common/ButtonLoader'
import { Toaster } from '../../pages/common/Toaster'
import { getMethodError, restMethodError } from '../../constants/errorMessages'
import CheckIcon from '@material-ui/icons/Check'
import debouce from "lodash.debounce";

export default function CreateList({
  setCreateList,
  openLT,
  getCategories,
  srchUser,
  setSrchUser,
  userLoading,
  setUserLoading,
  contactFolder,
  getAddContactList
}) {
  const [listName, setListName] = useState()
  const [listNameErr, setListNameErr] = useState()
  const [contactId, setContactId] = useState([])
  const [contactErr, setContactErr] = useState('')
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setCreateList(false)
  }

  const handleValidation = () => {
    if (!listName) {
      setListNameErr('Name is required')
    }
    if (contactId.length === 0) {
      setContactErr('Please select contact')
    }
  }

  const createContactList = () => {
    handleValidation()
    const data = {
      name: listName,
      contact_ids: contactId
    }
    if (listName && contactId?.length > 0) {
      setLoading(true)
      ContactListApi.create(data)
        .then(res => {
          setLoading(false)
          if (res?.message) {
            Toaster.TOAST(res.message, 'success')
            handleClose()
            getCategories()
          }
        })
        .catch(error => {
          setLoading(false)
          Toaster.TOAST(restMethodError(error), 'error')
          console.log(error)
        })
    }
  }

  const handleListName = e => {
    let val = e.target.value
    setListName(val)
    if (val) {
      setListNameErr('')
    } else {
      setListNameErr('Name is required')
    }
  }

  // add contact 

  useEffect(() => {
    if (srchUser) {
      getAddContactList();
    }
  }, [srchUser]);

  const debounceSaveUser = React.useCallback(
    debouce(function (e) {
      if (e) {
        getAddContactList(e);
      }
    }, 800),
    []
  );

  const getContactId = newValue => {
    if (newValue && newValue.length > 0) {
      setContactId(newValue);
      setContactErr('')
    } 
    else {
      setContactId([]);
      // setContactErr('Please select contact')
    }
  }

  const getContactData = (event, newValue) => {
    if (newValue) {
      setSrchUser(false);
    } else {
      setSrchUser(true);
    }
    if (event?.type !== undefined && event?.type !== "click") {
      setUserLoading(true);
      debounceSaveUser(newValue);
    }
  }

  return (
    <>
      <Dialog
        sx={{
          position: 'absolute',
          zIndex: '1000'
        }}
        className='ma-popup-boxHolder'
        open={openLT}
        onClose={handleClose}
      >
        <PopupHeader
          label='Create Contact List'
          handleToCloseLT={handleClose}
        />
        <DialogContent>
          <div className='ma-parentLT'>
            <Grid container xs={12} md={12} gap='20px 35px'>
              <Grid item xs={12}>
                <label className='labeltxt'>Contact List Name</label>
                <TextField
                  fullWidth
                  name='listName'
                  value={listName}
                  id='listName'
                  variant='outlined'
                  onChange={e => handleListName(e)}
                  helperText={<span className='ma-error'>{listNameErr}</span>}
                  placeholder='Enter list name'
                />
              </Grid>
              <Grid xs={12} md={12} className={'createlead-detail-grid'}>
                <label className='labeltxt'>Contacts</label>
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  loading={userLoading}
                  options={contactFolder}
                  filterOptions={contactFolder => contactFolder}
                  getOptionLabel={option => option.attributes.email}
                  onChange={(event, newValue) => {
                    let data = newValue.map(elem => {
                      return parseInt(elem.id)
                    })
                    getContactId(data);
                  }}
                  onInputChange={(event, newInputValue) => {
                    getContactData(event, newInputValue)
                  }}
                  renderOption={(props, option, { selected }) => {
                    return (
                      option?.attributes?.first_name && 
                      !contactId.includes(parseInt(option?.id)) && 
                      (
                        <li
                          {...props}
                          key={option.id}
                          style={{ borderBottom: '1px solid #E8E8ED' }}
                        >
                          <Box display={'flex'} flexDirection={'row'}>
                            <Avatar size={'22'} variant={'circular'}>
                              {contactId.includes(parseInt(option.id)) ? (
                                <CheckIcon />
                              ) : (
                                `${option?.attributes?.first_name?.charAt(0) ||
                                ''
                                }${option?.attributes?.last_name?.charAt(0) || ''
                                }`
                              )}
                            </Avatar>
                            <Box
                              display={'flex'}
                              ml={3}
                              flexDirection={'column'}
                            >
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
                    <TextField
                      {...params}
                      placeholder='Select contacts'
                      helperText={
                        <span className='ma-error'>{contactErr}</span>
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#F9F9FB', padding: '0' }}>
          <div className='popup-listMDbutton'>
            <Button
              className='cancel me-3'
              data-testid='cancel-btn'
              autoFocus
              onClick={handleClose}
            >
              CANCEL
            </Button>
            <ButtonLoader
              loading={loading}
              classStyle={'applay m-0'}
              handleClick={createContactList}
              testid={'submit-btn'}
              title={'CREATE'}
              autoFocus={true}
            />
          </div>
        </DialogActions>
      </Dialog>
    </>
  )
}
