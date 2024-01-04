import { Box, Paper } from '@mui/material'
import React, { lazy, Suspense } from 'react'
import { lazyRetry, renderLazyLoader } from '../../../utils/chunkHandle'
import SubscriptionTabs from '../../../components/Subscription/SubscriptionTabs'

const CurrentPlan = lazy(() =>
  lazyRetry(
    () => import('../../../components/Subscription/CurrentPlan'),
    'current-plan'
  )
)

export default function CurrentPlans() {
	return (
		<Box
		component='main'
		className='ma-mainTop-box ma-overview-main'
		sx={{ flexGrow: 1, background: '#f1f1f4' }}
	  >
		<div>
		  <Paper
			className='ma-shadow-hide'
			sx={{ boxShadow: 'none', borderRadius: '0px' }}
		  >
			<SubscriptionTabs showTabs={true} />
			<Suspense fallback={renderLazyLoader()}>
			  <CurrentPlan/>
			</Suspense>
		  </Paper>
		</div>
	  </Box>
	)
}
