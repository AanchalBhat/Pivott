import { Box, Paper } from '@mui/material'
import React, { lazy, Suspense } from 'react'
import { lazyRetry, renderLazyLoader } from '../../utils/chunkHandle'
import ProfileTabs from '../../components/AccountDetails/ProfileTabs'

const CurrencyUpdate = lazy(() =>
    lazyRetry(
        () => import('../../components/AccountDetails/CurrencyUpdate'),
        'currency-update'
    )
)

export default function Currency() {
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
                    <ProfileTabs showTabs={true} />
                    <Suspense fallback={renderLazyLoader()}>
                        <CurrencyUpdate />
                    </Suspense>
                </Paper>
            </div>
        </Box>
    )
}
