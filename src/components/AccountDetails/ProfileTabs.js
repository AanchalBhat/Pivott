import Typography from '@mui/material/Typography'
import './AccountDetail.css'
import { useEffect } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router'
import { useOutletContext } from 'react-router-dom'

// importing global css
import '../../styles/global/common.css'
import { Box, Card, CardContent } from '@mui/material'
import OverviewTab from '../../pages/common/OverviewTab'
import { featureFlag } from '../../utils/splitConfig'

const ProfileTabs = showTabs => {
  const navigate = useNavigate()
  const userInfo = JSON.parse(localStorage.getItem("user_info")).role?.role_name;
  const role_name = (userInfo === "admin") || (userInfo === "superadmin");

  const [
    navigationData,
    setDrawerData,
    setOpen,
    profileNavigationData,
    setIsProfileDrawer
  ] = useOutletContext()

  const navigationDataTab = [
    {
      handleClick: () => {
        navigate(`/account-details/profile-details`)
      },
      title: 'Profile',
      listItemIconTxt: 'profile-details'
    },
    role_name && featureFlag('enable_invite_link') && {
      handleClick: () => {
        navigate(`/account-details/your-company`)
      },
      title: 'Your Companies',
      listItemIconTxt: 'your-company'
    },
    role_name && {
      handleClick: () => {
        navigate(`/account-details/update-currency`)
      },
      title: 'Currency',
      listItemIconTxt: 'update-currency'
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
              <span data-testid='account-detail'>Profile Preferences</span>
            </Typography>
          </div>
        </div>
        <CardContent className='p-0 border-0 mr-2'>
          {showTabs && <OverviewTab navigationData={navigationDataTab} />}
        </CardContent>
      </Box>
    </Card>
  )
}

export default ProfileTabs
