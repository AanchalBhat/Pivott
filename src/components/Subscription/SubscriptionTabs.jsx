import React, { useEffect } from 'react'
import { Box, Card, CardContent, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import { featureFlag } from '../../utils/splitConfig'
import OverviewTab from '../../pages/common/OverviewTab'

export default function SubscriptionTabs ({ showTabs }) {
  const navigate = useNavigate()
  const [
    navigationData,
    setDrawerData,
    setOpen,
    profileNavigationData,
    setIsProfileDrawer
  ] = useOutletContext()

  const navigationDataTabs = [
    featureFlag('enable_invite_link') && {
      handleClick: () => {
        navigate(`/subscriptions/current-plan`)
      },
      title: 'Current Plan',
      listItemIconTxt: 'current-plan'
    },
    featureFlag('enable_invite_link') && {
      handleClick: () => {
        navigate(`/subscriptions/transaction-history`)
      },
      title: 'Transaction History',
      listItemIconTxt: 'transaction-history'
    },
    featureFlag('enable_invite_link') && {
      handleClick: () => {
        navigate(`/subscriptions/payment-methods`)
      },
      title: 'Payment Methods',
      listItemIconTxt: 'payment-methods'
    }
  ]

  useEffect(() => {
    setOpen(true)
    setDrawerData(profileNavigationData)
    setIsProfileDrawer(true)
  }, [])

  const backNavigation = () => {
    setIsProfileDrawer(false)
    navigate('/dashboard')
    setDrawerData(navigationData)
    setOpen(false)
  }

  return (
    <Card variant='outlined' className='ma-leads-box border-0 overflow-visible'>
      <Box>
        <div className='tobNavigation ma-overview-heading'>
          <div className='border-0'>
            <Typography className='createlead-heading p-0 border-0'>
              <ArrowBackIcon className='Arrowbtn-mr' onClick={backNavigation} />
              <span data-testid='account-detail'>My Subscriptions</span>
            </Typography>
          </div>
        </div>
        <CardContent className='p-0 border-0 mr-2'>
          {showTabs && <OverviewTab navigationData={navigationDataTabs} />}
        </CardContent>
      </Box>
    </Card>
  )
}
