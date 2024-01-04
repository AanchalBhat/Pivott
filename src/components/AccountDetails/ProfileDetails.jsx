import React, { useEffect, useState } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Avatar, Box, Button, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../../apis/userApi'
import { getMethodError } from '../../constants/errorMessages'
import { Toaster } from '../../pages/common/Toaster'
import { CircularLoader } from '../../pages/common/CircularLoader'

export default function ProfileDetails () {
  const [loader, setLoader] = useState(true)
  const [users, setUsers] = useState()
  const [imgData, setImgData] = useState(null)
  const navigate = useNavigate()
  const user_id = localStorage.getItem('login_id')
  const field_data = [
    {
      name: 'First Name',
      value: users?.first_name ? users?.first_name : 'N/A'
    },
    {
      name: 'Last Name',
      value: users?.last_name ? users?.last_name : 'N/A'
    },
    {
      name: 'Email',
      value: users?.email ? users?.email : 'N/A'
    },
    {
      name: 'Phone',
      value: users?.phone ? users?.country_code + ' ' + users?.phone : 'N/A'
    },
    {
      name: 'Gender',
      value: users?.gender ? users?.gender : 'N/A'
    },
    {
      name: 'Country/Region',
      value: users?.user_address?.country ? users?.user_address?.country : 'N/A'
    },
    {
      name: 'Language',
      value: users?.language ? users?.language : 'N/A'
    },
    {
      name: 'TimeZone',
      value: users?.timezone ? users?.timezone : 'N/A'
    },
    {
      name: 'Company',
      value: users?.company_name ? users?.company_name : 'N/A'
    }
  ]

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    setLoader(true)
    userApi
      .getUser(user_id)
      .then(res => {
        setLoader(false)
        if (res.data) {
          setUsers(res?.data?.attributes)
          setImgData(res.data?.attributes?.profile_photo?.url)
        }
      })
      .catch(error => {
        Toaster.TOAST(getMethodError(error), 'error')
        setLoader(false)
        console.log(error)
      })
  }

  return (
    <Box>
      {loader ? (
        <CircularLoader />
      ) : (
        <Grid container spacing={2} xs={12} md={12}>
          <Grid item xs={12} md={6}>
            <div data-testid='img' className='text_container'>
              {!imgData || imgData == null ? (
                <div className='image_container account_profile Female_image'>
                  <Avatar alt='Remy Sharp'>
                    {' '}
                    <AccountCircleIcon />{' '}
                  </Avatar>
                </div>
              ) : (
                ''
              )}
              {imgData && (
                <div className='image_container Female_image'>
                  <img src={users?.profile_photo?.url} alt='file' />
                </div>
              )}
              <div className='profile_Text'>
                <h4 className='ps-2 alishasam_Text'>
                  {users?.first_name} {users?.last_name}
                </h4>
                <h4 className='ps-2 role_text'>
                  {users?.designation ? users?.designation : 'No Designation'}
                </h4>
              </div>
            </div>
          </Grid>

          <Grid className='ma-convertEdit-bar-acc' item xs={12} md={6}>
            <Button
              className='ma-edit-btn'
              data-testid='btn'
              onClick={() =>
                navigate(`/account-details/profile-details/${user_id}`)
              }
            >
              <EditOutlinedIcon />
              Edit Details
            </Button>
          </Grid>

          {field_data?.map((elem, idx) => {
            return (
              <Grid key={idx} item xs={12} md={6}>
                <label className='lable_Text'>{elem?.name}</label>
                <h6 className='field_Text'>{elem?.value}</h6>
              </Grid>
            )
          })}
        </Grid>
      )}
    </Box>
  )
}
