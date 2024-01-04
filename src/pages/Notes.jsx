import { Box } from '@mui/material'
import { lazy, Suspense } from 'react'
import { lazyRetry, renderLazyLoader } from '../utils/chunkHandle'
import OverviewChild from './OverviewComponent'
const LeadNotes = lazy(() =>
  lazyRetry(() => import('../components/Leads/Notes/Notes'), 'notes')
)

const Notes = ({ type }) => {
  return (
    <>
      <Box
        component='main'
        className='ma-mainTop-box ma-overview-main'
        sx={{ flexGrow: 1 }}
      >
        <OverviewChild type={type} />
        <Suspense fallback={renderLazyLoader()}>
          <LeadNotes type={type} />
        </Suspense>
      </Box>
    </>
  )
}

export default Notes
