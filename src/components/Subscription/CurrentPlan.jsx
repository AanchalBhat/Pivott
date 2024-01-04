import { Box, Button, Chip, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import DoneIcon from '@mui/icons-material/Done'
import ScheduleIcon from '@mui/icons-material/Schedule'
import { SubscriptionApi } from '../../apis/SubscriptionApi'
import { CircularLoader } from '../../pages/common/CircularLoader'
import { Toaster } from '../../pages/common/Toaster'
import { getMethodError } from '../../constants/errorMessages'
import { Upgrade } from '../../pages/Main/Subscription/Upgrade'
import { Dialog } from '@material-ui/core'
import PopupHeader from '../../pages/common/PopupHeader'
import '../../styles/global/common.css'
import '../../pages/Main/Subscription/subscription.css'

export default function CurrentPlan () {
  const [loader, setLoader] = useState(false)
  const [currentPlanData, setCurrentPlanData] = useState()
  const [open, setOpen] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState()

  useEffect(() => {
    getCurrentPlanData()
  }, [])

  const getCurrentPlanData = () => {
    setLoader(true)
    SubscriptionApi.getCurrentPlan()
      .then(res => {
        setLoader(false)
        if (res?.subscription?.data) {
          setCurrentPlanData(res.subscription.data.attributes)
        }
        if (res?.subscription_status) {
          setSubscriptionStatus(res?.subscription_status)
        }
      })
      .catch(error => {
        setLoader(false)
        Toaster.TOAST(getMethodError(error), 'error')
        console.log(error)
      })
  }

  return (
    <>
      <Box className='p-4'>
        {loader ? (
          <CircularLoader />
        ) : (
          <>
            <Grid container sx={{ paddingBottom: '2rem' }}>
              <Grid item sm={12} xs={12} md={8} spacing={2} className='d-flex '>
                <Typography variant='h5'>Subscription Summary </Typography>
                {currentPlanData?.is_expired ? (
                  <Chip
                    icon={
                      <ScheduleIcon
                        sx={{ color: '#EC627B !important', fontSize: '16px' }}
                      />
                    }
                    label={subscriptionStatus}
                    sx={{
                      color: '#EC627B',
                      backgroundColor: '#FDDCE3',
                      border: '2px solid #EC627B',
                      marginLeft: '20px',
                      textTransform:"capitalize"
                    }}
                  />
                ) : (
                  <Chip
                    icon={
                      <DoneIcon
                        sx={{ color: '#36b37e !important', fontSize: '16px' }}
                      />
                    }
                    label={subscriptionStatus}
                    sx={{
                      color: 'var(--ma-sentgreen-color)',
                      backgroundColor: ' var(--ma-sentbg-color)',
                      border: '2px solid var(--ma-sentgreen-color)',
                      marginLeft: '20px',
                      textTransform:"capitalize"
                    }}
                  />
                )}
              </Grid>
            </Grid>
            <Grid
              container
              sx={{ border: '1px solid lightGrey', padding: '20px' }}
            >
              <Grid item sm={12} xs={12} md={4}>
                <Box>
                  <h5>
                    {currentPlanData?.pro_plan ? 'Pro Plan' : 'Free Plan'}
                  </h5>
                  <Typography>
                    {currentPlanData?.billing_type
                      ? currentPlanData?.billing_type
                      : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item sm={12} xs={12} md={4}>
                <Box>
                  <h5>Current Usage</h5>
                  <Typography className='linkStyling'>
                    {currentPlanData?.no_of_users_purchased
                      ? currentPlanData?.no_of_users_purchased
                      : 0}
                  </Typography>
                </Box>
              </Grid>
              <Grid item sm={12} xs={12} md={4}>
                <Box>
                  <h5>
                    {currentPlanData?.is_expired
                      ? 'Expired On'
                      : 'Next Payment Date'}
                  </h5>
                  <Typography>
                    {currentPlanData?.next_payment_date
                      ? currentPlanData?.next_payment_date
                      : currentPlanData?.expire_date
                      ? currentPlanData?.expire_date
                      : 'N/A'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item sm={12} xs={12} md={4} className='mt-5'>
                <Box>
                  <h5>Users</h5>
                  <Typography>
                    {currentPlanData?.no_of_users
                      ? currentPlanData?.no_of_users
                      : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item sm={12} xs={12} md={4} className='mt-5'>
                <Box>
                  <h5>Amount</h5>
                  <Typography>
                    {currentPlanData?.amount ? currentPlanData?.amount : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item sm={12} xs={12} md={4} className='mt-5'>
                <Box>
                  <h5>Total</h5>
                  <Typography>
                    {currentPlanData?.total ? currentPlanData?.total : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item sm={12} xs={12} md={10} className='d-flex mt-5'>
                <Grid item sm={12} xs={12} md={3}>
                  {currentPlanData?.is_expired ? (
                    <Button variant='contained' className='saveButton'>
                      Renew Plan
                    </Button>
                  ) : (
                    <Button
                      variant='contained'
                      className='saveButton'
                      onClick={() => setOpen(true)}
                    >
                      Changed Plan
                    </Button>
                  )}
                </Grid>
                <Grid item sm={12} xs={12} md={7}>
                  {currentPlanData?.pro_plan && (
                    <Button
                      className='cancelbtn'
                      startIcon={
                        currentPlanData?.is_expired ? ' ' : <PictureAsPdfIcon />
                      }
                    >
                      {currentPlanData?.is_expired
                        ? 'View All Plans'
                        : 'Download Invoice'}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
      <Dialog className='ma-upgrade-popup' open={open}>
        <PopupHeader
          label='Upgrade Plans'
          handleToCloseLT={() => setOpen(false)}
        />
        <Upgrade changeTxt={true} />
      </Dialog>
    </>
  )
}
