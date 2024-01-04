import React, { useEffect, useMemo, useState } from 'react'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import PopupHeader from './PopupHeader'
import { Toaster } from './Toaster'
// import global css
import '../../styles/global/common.css'
import { getMethodError, restMethodError } from '../../constants/errorMessages'
import { userApi } from '../../apis/userApi'
import { Button, DialogActions } from '@mui/material'
import { ButtonLoader } from './ButtonLoader'
import { CircularLoader } from './CircularLoader'

const AddDomain = ({
  openAddDomain,
  setOpenAddDomain,
  getCompanyDomain,
  domainID
}) => {
  const [companyName, setCompanyName] = useState()
  const [companyNameErr, setCompanyNameErr] = useState('')
  const [companyDomain, setCompanyDomain] = useState()
  const [companyDomainErr, setCompanyDomainErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    if (domainID) {
      getCompanyDataById()
    }
  }, [domainID])

  const handleCompanyName = value => {
    setCompanyName(value)
    if (value) {
      setCompanyNameErr('')
    } else {
      setCompanyNameErr("Company name can't be empty")
    }
  }

  const handleCompanyDomain = value => {
    setCompanyDomain(value)
    if (value) {
      setCompanyDomainErr('')
    } else {
      setCompanyDomainErr("Company domain can't be empty")
    }
  }

  const handelClose = () => {
    setOpenAddDomain(false)
  }

  const handleValidation = () => {
    if (!companyName) {
      setCompanyNameErr("Company name can't be empty")
    }
    if (!companyDomain) {
      setCompanyDomainErr("Company domain can't be empty")
    }
  }

  const addCompanyDomain = () => {
    handleValidation()
    if (companyName && companyDomain) {
      setLoading(true)
      const data = { name: companyName, domain: companyDomain }
      let url
      if (domainID) {
        url = userApi.UpdateDomain({ data }, domainID)
      } else {
        url = userApi.createDomain({ data })
      }
      url
        .then(res => {
          if (res) {
            setLoading(false)
            const successMessage = domainID
              ? 'Company domain updated successfully'
              : 'Company domain created successfully'
            Toaster.TOAST(successMessage, 'success')
            handelClose()
            getCompanyDomain()
          }
        })
        .catch(error => {
          setLoading(false)
          Toaster.TOAST(restMethodError(error), 'error')
        })
    }
  }

  const getCompanyDataById = () => {
    setLoader(true)
    userApi
      .getCompanyDomainById(domainID)
      .then(res => {
        setLoader(false)
        if (res?.data?.attributes) {
          setCompanyDomain(res.data.attributes?.domain)
          setCompanyName(res.data.attributes?.name)
        }
      })
      .catch(error => {
        Toaster.TOAST(getMethodError(error), 'error')
        setLoader(false)
        console.log(error)
      })
  }

  return (
    <Dialog
      sx={{
        position: 'absolute',
        zIndex: '1000'
      }}
      className='ma-popup-boxHolder'
      open={openAddDomain}
      onClose={handelClose}
    >
      <PopupHeader
        label={domainID ? 'Edit domain' : 'Add new domain'}
        handleToCloseLT={handelClose}
      />
        <DialogContent>
          <div className='ma-parentLT'>
            <Grid container xs={12} md={12}>
              <Grid
                item={true}
                xs={12}
                md={12}
                className={'createlead-detail-grid mb-2'}
              >
                <label className='labeltxt'>Company Name</label>
                <TextField
                  fullWidth
                  name='companyName'
                  value={companyName}
                  id='companyName'
                  variant='outlined'
                  onChange={e => handleCompanyName(e.target.value)}
                  helperText={
                    <span className='ma-error'>{companyNameErr}</span>
                  }
                  error={companyNameErr}
                  placeholder='Enter company name'
                />
              </Grid>
              <Grid
                item={true}
                xs={12}
                md={12}
                className={'createlead-detail-grid'}
              >
                <label className='labeltxt'>Company Domain</label>
                <TextField
                  fullWidth
                  name='Company Domain'
                  value={companyDomain}
                  id='Company Domain'
                  variant='outlined'
                  onChange={e => handleCompanyDomain(e.target.value)}
                  helperText={
                    <span className='ma-error'>{companyDomainErr}</span>
                  }
                  error={companyDomainErr}
                  placeholder='Enter company domain'
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
            onClick={handelClose}
          >
            CANCEL
          </Button>
          <ButtonLoader
            loading={loading}
            classStyle={'applay m-0'}
            btnType={'submit'}
            handleClick={() => {
              addCompanyDomain()
            }}
            testid={'submit-btn'}
            title={domainID ? 'SAVE' : 'ADD'}
            autoFocus={true}
          />
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default AddDomain
