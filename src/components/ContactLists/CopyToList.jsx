import React, { useState } from 'react'
import PopupHeader from '../../pages/common/PopupHeader'
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField
} from '@mui/material'
import { ButtonLoader } from '../../pages/common/ButtonLoader'
import { Toaster } from '../../pages/common/Toaster'
import { restMethodError } from '../../constants/errorMessages'
import { ContactListApi } from '../../apis/ContactListApi'

export default function CopyToList ({
  categories,
  ContactListId,
  copyListPopup,
  setCopyListPopup,
  debounceSaveUser,
  setSrchData,
  getContactListData
}) {
  const [copyListId, setCopyListId] = useState()
  const [copyListErr, setcopyListErr] = useState('')
  const [loader, setLoader] = useState(false)

  const handleClose = () => {
    setCopyListPopup(false)
    setcopyListErr('')
  }

  const handleValidation = () => {
    if (!copyListId) {
      setcopyListErr('Please select contact list')
    }
  }

  const handleCopyList = () => {
    handleValidation()
    if (copyListId && ContactListId) {
      const data = {
        contact_category_id: parseInt(copyListId),
        contact_ids: ContactListId
      }
      setLoader(true)
      ContactListApi.copyToList({ data: data })
        .then(response => {
          setLoader(false)
          if (response) {
            setCopyListPopup(false)
            setcopyListErr('')
            getContactListData()
            Toaster.TOAST(response?.message, 'success')
          }
        })
        .catch(error => {
          setLoader(false)
          Toaster.TOAST(restMethodError(error), 'error')
          console.log(error)
        })
    }
  }

  const getCopyListId = newValue => {
    if (newValue) {
      setCopyListId(newValue?.id)
      setcopyListErr('')
    } else {
      setcopyListErr('Please select contact list')
    }
  }

  const getCopyListName = (event, newValue) => {
    if (newValue) {
      setSrchData(false);
    } else {
      setSrchData(true);
    }
    if (event?.type !== undefined && event?.type !== "click") {
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
        open={copyListPopup}
        onClose={handleClose}
      >
        <PopupHeader
          label='Copy contacts to list'
          handleToCloseLT={handleClose}
        />
        <DialogContent>
          <div className='ma-parentLT'>
            <Grid container xs={12} md={12}>
              <Grid xs={12} md={12} className={'createlead-detail-grid'}>
                <label className='labeltxt'>Contact lists</label>
                <Autocomplete
                  options={categories}
                  getOptionLabel={option => option.attributes.name}
                  onChange={(event, newValue) => {
                    getCopyListId(newValue)
                  }}
                  onInputChange={(event, newInputValue) => {
                    getCopyListName(event, newInputValue)
                  }}
                  renderOption={(props, option, { selected }) => (
                    <li
                      {...props}
                      key={option.attributes.id}
                      style={{ borderBottom: '1px solid #E8E8ED' }}
                    >
                      <span>{option?.attributes?.name}</span>
                    </li>
                  )}
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder='Select contacts List'
                      helperText={
                        <span className='ma-error'>{copyListErr}</span>
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
              loading={loader}
              classStyle={'applay m-0'}
              handleClick={() => {
                handleCopyList()
              }}
              testid={'submit-btn'}
              title={'Copy'}
              autoFocus={true}
            />
          </div>
        </DialogActions>
      </Dialog>
    </>
  )
}
