import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import leadsicon from '../../assets/other_admission.svg'
import approvalicon from '../../assets/approval.svg'
import dolleriocn from '../../assets/dollericon.svg'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import ContactPhoneIcon from '@mui/icons-material/ContactPhone'
import Diversity2TwoToneIcon from '@mui/icons-material/Diversity2TwoTone'
import { STAGE_TYPE_COUNT, REASON_TYPE_COUNT } from '../../utils'
import { useNavigate } from 'react-router-dom'

const CardsSection = ({
  dashboardData,
  manageState,
  pipelineStageTitle,
  potentialStageTitle,
  reason,
  pipelineStageData,
  potentialStageData,
  pipelinesStage,
  potentialsStage,
  lostReason,
  setPipelineStageTitle,
  setPotentialStageTitle,
  setManageStateOption,
}) => {
  const [showPipelineType, setShowPipelineType] = useState()
  const [showPotentialType, setShowPotentialType] = useState()
  const [showLostType, setShowLostType] = useState()
  const navigate = useNavigate()
  useEffect(() => {
    if (manageState) {
      fillManageStateOption()
    }
  }, [manageState])

  const fillManageStateOption = () => {
    let temp = {
      leads: () => {
        if (manageState?.leads?.assigned_leads === 1) return 'assigned_leads'
        else if (manageState?.leads?.untouched_leads === 1)
          return 'untouched_leads'
        else if (manageState?.leads?.added_leads === 1) return 'added_leads'
      },
      pipelines: () => {
        if (manageState?.pipelines?.pipelines_this_month === 1) {
          setShowPipelineType(false)
          return 'pipelines_this_month'
        } else if (manageState?.pipelines?.assigned_pipelines === 1) {
          setShowPipelineType(false)
          return 'assigned_pipelines'
        } else {
          setShowPipelineType(true)
          const obj = pipelineStageData.find(item => item?.id == pipelinesStage)
          setPipelineStageTitle(obj?.name)
          return STAGE_TYPE_COUNT
        }
      },
      potentials: () => {
        if (manageState?.potentials?.potentials_this_month === 1) {
          setShowPotentialType(false)
          return 'potentials_this_month'
        } else if (manageState?.potentials?.assigned_potentials === 1) {
          setShowPotentialType(false)
          return 'assigned_potentials'
        } else {
          setShowPotentialType(true)

          const obj = potentialStageData.find(
            item => item?.id == potentialsStage
          )
          setPotentialStageTitle(obj?.name)
          return STAGE_TYPE_COUNT
        }
      },
      deals: () => {
        if (manageState?.deals?.assigned_deals === 1) return 'assigned_deals'
        /* uncomment when open and close deals feature are discussed */
        // else if (manageState.deals.open_deals === 1) return "open_deals";
        // else if (manageState.deals.close_deals === 1) return "close_deals";
        else if (manageState?.deals?.deals_this_month === 1)
          return 'deals_this_month'
      },
      lost_leads: () => {
        if (manageState?.lost_leads?.assigned_lost_leads === 1) {
          setShowLostType(false)
          return 'assigned_lost_leads'
        } else if (manageState?.lost_leads?.lost_leads_this_month === 1) {
          setShowLostType(false)
          return 'lost_leads_this_month'
        } else {
          setShowLostType(true)
          return REASON_TYPE_COUNT
        }
      },
      calls: () => {
        if (manageState?.calls?.upcoming_calls === 1) return 'upcoming_calls'
        else if (manageState?.calls?.calls_this_week === 1)
          return 'calls_this_week'
      }
    }
    setManageStateOption({
      leads: temp.leads(),
      pipelines: temp.pipelines(),
      potentials: temp.potentials(),
      deals: temp.deals(),
      lost_leads: temp.lost_leads(),
      calls: temp.calls()
    })
  }
  const handleRoute = path => {
    navigate(`/${path}`)
  }
  const leadSectionCard = () => {
    return (
      <>
        <div
          className='ma-dashboardInner-box'
          onClick={() => handleRoute('lead')}
        >
          <span className='d-flex'>
            <img src={leadsicon} alt='icon' />
            <h4 className='my-2 mx-3'>Leads</h4>
          </span>
          <div className='ma-dashboardNo-count'>
            <span>
              <h4>{dashboardData?.leads?.total_leads}</h4>
              <h6>Total Leads</h6>
            </span>

            {manageState?.leads?.untouched_leads === 1 && (
              <span>
                <h4>{dashboardData?.leads?.untouched_leads}</h4>
                <h6>Untouched Leads</h6>
              </span>
            )}

            {manageState?.leads?.assigned_leads === 1 && (
              <span>
                <h4>{dashboardData?.leads?.assigned_leads}</h4>
                <h6>Assigned Leads</h6>
              </span>
            )}

            {manageState?.leads?.added_leads === 1 && (
              <span>
                <h4>{dashboardData?.leads?.added_leads}</h4>
                <h6>Added Leads</h6>
              </span>
            )}
          </div>
        </div>
      </>
    )
  }
  const pipelineSectionCard = () => {
    return (
      <div
        className='ma-dashboardInner-box'
        onClick={() => handleRoute('pipeline')}
      >
        <span className='d-flex'>
          <img src={approvalicon} alt='icon' />
          <h4 className='my-2 mx-3'>Pipelines</h4>
        </span>
        <div className='ma-dashboardNo-count'>
          <span>
            <h4>{dashboardData?.pipelines?.total_pipelines}</h4>
            <h6>Total Pipelines</h6>
          </span>
          {manageState?.pipelines?.assigned_pipelines === 1 && (
            <span>
              <h4>{dashboardData?.pipelines?.assigned_pipelines}</h4>
              <h6>Assigned Pipelines</h6>
            </span>
          )}
          {manageState?.pipelines?.pipelines_this_month === 1 && (
            <span>
              <h4>{dashboardData?.pipelines?.pipelines_this_month}</h4>
              <h6>Pipelines This Month</h6>
            </span>
          )}
          {showPipelineType && (
            <span>
              <h4>
                {dashboardData?.pipelines?.stage_type_count?.[pipelinesStage]}
              </h4>
              <h6>
                {pipelineStageTitle && pipelineStageTitle + ' Stage Pipelines'}
              </h6>
            </span>
          )}
        </div>
      </div>
    )
  }
  const potentialSectionCard = () => {
    return (
      <div
        className='ma-dashboardInner-box'
        onClick={() => handleRoute('potential')}
      >
        <span className='d-flex'>
          <LeaderboardIcon />
          <h4 className='my-2 mx-3'>Potentials</h4>
        </span>
        <div className='ma-dashboardNo-count'>
          <span>
            <h4>{dashboardData?.potentials?.total_potentials}</h4>
            <h6>Total Potentials</h6>
          </span>
          {manageState?.potentials?.assigned_potentials === 1 && (
            <span>
              <h4>{dashboardData?.potentials?.assigned_potentials}</h4>
              <h6>Assigned Potentials</h6>
            </span>
          )}
          {manageState?.potentials?.potentials_this_month === 1 && (
            <span>
              <h4>{dashboardData?.potentials?.potentials_this_month}</h4>
              <h6>Potentials This Month</h6>
            </span>
          )}
          {showPotentialType && (
            <span>
              <h4>
                {dashboardData?.potentials?.stage_type_count?.[potentialsStage]}
              </h4>
              <h6>
                {potentialStageTitle &&
                  potentialStageTitle + ' Stage Potentials'}
              </h6>
            </span>
          )}
        </div>
      </div>
    )
  }
  const dealSectionCard = () => {
    return (
      <div
        className='ma-dashboardInner-box'
        onClick={() => handleRoute('deal')}
      >
        <span className='d-flex'>
          <img src={dolleriocn} alt='icon' />
          <h4 className='my-2 mx-3'>Deals</h4>
        </span>
        <div className='ma-dashboardNo-count'>
          <span>
            <h4>{dashboardData?.deals?.total_deals}</h4>
            <h6>Total Deals</h6>
          </span>
          {manageState?.deals?.assigned_deals === 1 && (
            <span>
              <h4>{dashboardData?.deals?.assigned_deals}</h4>
              <h6>Assigned Deals</h6>
            </span>
          )}
          {manageState?.deals?.deals_this_month === 1 && (
            <span>
              <h4>{dashboardData?.deals?.deals_this_month}</h4>
              <h6>Deals This Month</h6>
            </span>
          )}
        </div>
      </div>
    )
  }
  const lostSectionCard = () => {
    return (
      <div
        className='ma-dashboardInner-box'
        onClick={() => handleRoute('lost-lead')}
      >
        <span className='d-flex'>
          <Diversity2TwoToneIcon />
          <h4 className='my-2 mx-3'>Lost Leads</h4>
        </span>
        <div className='ma-dashboardNo-count'>
          <span>
            <h4>{dashboardData?.lost_leads?.total_lost_leads}</h4>
            <h6>Total Lost Leads</h6>
          </span>
          {manageState?.lost_leads?.assigned_lost_leads === 1 && (
            <span>
              <h4>{dashboardData?.lost_leads?.assigned_lost_leads}</h4>
              <h6>Assigned Lost Leads</h6>
            </span>
          )}
          {manageState?.lost_leads?.lost_leads_this_month === 1 && (
            <span>
              <h4>{dashboardData?.lost_leads?.lost_leads_this_month}</h4>
              <h6>Lost Leads This Month</h6>
            </span>
          )}
          {showLostType && (
            <span>
              <h4>
                {dashboardData?.lost_leads?.reason_type_count?.[lostReason] || 0}
              </h4>
              <h6>{reason}{" "}Lost Leads</h6>
            </span>
          )}
        </div>
      </div>
    )
  }
  const callsSectionCard = () => {
    return (
      <div
        className='ma-dashboardInner-callBox ma-dashboardInner-box'
      >
        <span className='d-flex'>
          <ContactPhoneIcon />
          <h4 className='my-2 mx-3'>Calls</h4>
        </span>
        <div className='ma-dashboardNo-count'>
          <span>
            <h4>{dashboardData?.calls?.total_calls}</h4>
            <h6>Total Calls</h6>
          </span>
          {manageState?.calls?.upcoming_calls === 1 && (
            <span>
              <h4>{dashboardData?.calls?.upcoming_calls}</h4>
              <h6>Upcoming Calls</h6>
            </span>
          )}
          {manageState?.calls?.calls_this_week === 1 && (
            <span>
              <h4>{dashboardData?.calls?.calls_this_week}</h4>
              <h6>Calls This Week</h6>
            </span>
          )}
        </div>
      </div>
    )
  }
  return (
    <>
      <Grid className='ma-dashboard-icon' xs={12} md={4} item>
        {leadSectionCard()}
      </Grid>

      <Grid className='ma-dashboard-icon' xs={12} md={4} item>
        {pipelineSectionCard()}
      </Grid>
      <Grid className='ma-dashboard-icon' xs={12} md={4} item>
        {potentialSectionCard()}
      </Grid>
      <Grid className='ma-dashboard-icon' xs={12} md={4} item>
        {dealSectionCard()}
      </Grid>
      <Grid className='ma-dashboard-icon' xs={12} md={4} item>
        {lostSectionCard()}
      </Grid>
      <Grid className='ma-dashboard-icon' xs={12} md={4} item>
        {callsSectionCard()}
      </Grid>
    </>
  )
}
export default CardsSection
