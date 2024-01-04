import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { userApi } from '../../apis/userApi'
import {
  deleteMethodError,
  getMethodError
} from '../../constants/errorMessages'
import { Toaster } from '../../pages/common/Toaster'
import { lightDeleteIcon } from '../../assets/index'
import DomainPopup from '../../pages/common/DomainPopup'
import AddDomain from '../../pages/common/AddDomain'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { featureFlag } from '../../utils/splitConfig'
import { CircularLoader } from '../../pages/common/CircularLoader'
import { ADMIN, SUPER_ADMIN } from '../../utils/constants'

export default function WhiteList() {
  const [loader, setLoader] = useState(true)
  const [openAddDomain, setOpenAddDomain] = useState(false)
  const [companyDomains, setCompanyDomains] = useState([])
  const [domainID, setDomainID] = useState()
  const [openDeletePopup, setOpenDeletePopup] = useState(false)
  const [openEditPopup, setOpenEditPopup] = useState(false)
  const user_info = JSON.parse(
    localStorage.getItem("user_info")
  )?.role?.role_name;

  const role_name = (user_info === SUPER_ADMIN) || (user_info === ADMIN);

  useEffect(() => {
    if (featureFlag('enable_invite_link')) {
      getDomain()
    }
  }, [])

  const handleEditDomain = id => {
    setOpenAddDomain(true)
    setDomainID(id)
    setOpenEditPopup(false)
  }

  const handleEditPopup = id => {
    setOpenEditPopup(true)
    setDomainID(id)
  }

  const handleShow = id => {
    setOpenDeletePopup(true)
    setDomainID(id)
  }

  const handleDeletePopup = () => {
    setOpenDeletePopup(false)
  }

  const handleEditPOpup = () => {
    setOpenEditPopup(false)
  }

  const getDomain = () => {
    setLoader(true)
    userApi
      .getCompanyDomain()
      .then(res => {
        setLoader(false)
        if (res?.data) {
          setCompanyDomains(res.data)
        }
      })
      .catch(error => {
        Toaster.TOAST(getMethodError(error), 'error')
        setLoader(false)
        console.log(error)
      })
  }

  const handleDelete = () => {
    setLoader(true)
    userApi
      .delete(domainID)
      .then(res => {
        setOpenDeletePopup(false)
        Toaster.TOAST(res?.message, 'success')
        if (companyDomains.length > 0) {
          getDomain()
        }
        setLoader(false)
      })
      .catch(error => {
        setLoader(false)
        Toaster.TOAST(deleteMethodError(error), 'error')
        console.log(error)
      })
  }

  return (
    <>
      <Box className='d-flex justify-content-between  align-items-center m-4'>
        <Typography variant='h6'>White listed company domains</Typography>
        {
          role_name &&
          <Button
            variant='contained'
            className='createlead-buttons__saveButton'
            sx={{ color: '#fff' }}
            onClick={() => {
              setOpenAddDomain(true)
              setDomainID()
            }}
          >
            Add Domain
          </Button>
        }
      </Box>
      <Divider sx={{ background: '#E8E8ED' }} />
      {loader ? (
        <CircularLoader />
      ) : (
        <>
          {companyDomains?.map(data => (
            <>
              <Grid container my={2} className='d-flex  align-items-center px-4'>
                <Grid item xs={6}>
                  {data?.attributes?.default
                    ? data?.attributes?.name + ' (Default)'
                    : data?.attributes?.name}
                </Grid>
                <Grid item xs={6} className='d-flex justify-content-end'>
                  <TextField
                    value={data?.attributes?.domain}
                    size='small'
                    disabled
                    className='mx-2'
                    sx={{
                      '& .MuiInputBase-root.Mui-disabled': {
                        backgroundColor: '#F1F1F4',
                        color: '#D1D1DA'
                      },
                      '& .MuiOutlinedInput-input': {
                        height: '28px !important'
                      }
                    }}
                  />
                  {role_name &&
                    <div
                      className='mx-2'
                      style={{
                        width: !data?.attributes?.default ? 'auto' : '99px' // Adjust the width as needed
                      }}
                    >
                      {
                        !data?.attributes?.default && (
                          <>
                            <button
                              className='edit_icon_btn'
                              style={{ width: '42px', height: '42px' }}
                              onClick={() => {
                                handleEditPopup(data?.id)
                              }}
                            >
                              <EditOutlinedIcon />
                            </button>
                            <button
                              className='delete_icon_btn'
                              style={{
                                backgroundColor: '#FF5630',
                                border: 'none',
                                width: '42px',
                                height: '42px'
                              }}
                              onClick={() => handleShow(data?.id)}
                            >
                              <img
                                src={lightDeleteIcon}
                                alt='DeleteIcon'
                                className='delete_Icon'
                              />
                            </button>
                          </>
                        )}
                    </div>
                  }
                </Grid>
              </Grid>
              <Divider sx={{ background: '#E8E8ED' }} />
            </>
          ))}
        </>
      )}

      {openAddDomain && (
        <AddDomain
          openAddDomain={openAddDomain}
          setOpenAddDomain={setOpenAddDomain}
          getCompanyDomain={getDomain}
          companyDomains={companyDomains}
          domainID={domainID}
        />
      )}

      {openDeletePopup && (
        <DomainPopup
          title='Are you sure about Deleting the domain?'
          content='Deleting a domain may restrict users from joining or accessing teams linked to it. This adjustment ensures accurate and secure team memberships.'
          open={openDeletePopup}
          handleClose={handleDeletePopup}
          handleClick={handleDelete}
          primaryBtn={true}
          loading={loader}
        />
      )}

      {openEditPopup && (
        <DomainPopup
          title='Are you sure about editing the domain?'
          content='Editing or modifying a domain may restrict users from joining or accessing teams linked to it. This adjustment ensures accurate and secure team memberships.'
          open={openEditPopup}
          handleClose={handleEditPOpup}
          handleClick={() => handleEditDomain(domainID)}
          loading={loader}
        />
      )}
    </>
  )
}
