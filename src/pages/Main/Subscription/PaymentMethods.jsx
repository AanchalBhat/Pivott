import { Box, Paper } from '@mui/material'
import React, { lazy, Suspense } from 'react'
import { lazyRetry, renderLazyLoader } from '../../../utils/chunkHandle'
import SubscriptionTabs from '../../../components/Subscription/SubscriptionTabs'

const PaymentMethod = lazy(() =>
  lazyRetry(
    () => import('../../../components/Subscription/PaymentMethod'),
    'payment-method'
  )
)

export default function PaymentMethods() {
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
			  <PaymentMethod/>
			</Suspense>
		  </Paper>
		</div>
	  </Box>
    )
}
