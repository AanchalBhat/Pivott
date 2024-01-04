import { useState, useEffect, useContext } from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { DataGrid } from '@mui/x-data-grid'
import _ from 'lodash'
// other imports
import IconTooltip from '../../../pages/common/IconTooltip'
//import global css
import '../../../styles/global/common.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Avatar } from '@mui/material'
import { useLocation, useParams } from 'react-router-dom'
import { Toaster } from '../../../pages/common/Toaster'
import { getMethodError } from '../../../constants/errorMessages'
import { campaignApi } from '../../../apis/campaignApi'
import { CustomNoRowsOverlay } from '../../../pages/common/CustomNoRowsOverlay'
import {
  EMAIL_CANCELLED,
  EMAIL_SCHEDULED,
  INVALID_ID_DATA
} from '../../../utils/constants'
import IncorrectId from '../../NotFound/IncorrectId'
import { DataContext } from '../../../context'

const ReceipentsList = props => {
  const params = useParams()
  const location = useLocation()
  const { setAllListOptions } = useContext(DataContext);
  const status = location.state?.campaignStatus
  let receipents_id = params.id
  const pageSize = 10
  const [page, setPage] = useState(1)
  const [rowCount, setRowCount] = useState()
  const [receipents, setReceipents] = useState([])
  const [loader, setLoader] = useState()
  const [Invalid_data, setInvalidData] = useState(false)

  const getObjectForKey = (key, keyValue, idx) => {
    switch (key) {
      case "bounce_count":
        return {
          id: idx,
          value: `bounce`,
          label: `Bounced (${keyValue})`,
          key: key,
        };
      case "click_count":
        return {
          id: idx,
          value: `click`,
          label: `Clicked (${keyValue})`,
          key: key,
        };
      case "delivered_count":
        return {
          id: idx,
          value: `delivered`,
          label: `Delivered (${keyValue})`,
          key: key,
        };
      case "open_count":
        return {
          id: idx,
          value: `open`,
          label: `Opened (${keyValue})`,
          key: key,
        };
      case "un_opened_count":
        return {
          id: idx,
          value: `un_opened`,
          label: `Unopened (${keyValue})`,
          key: key
        };
      case "unsubscribe_count":
        return {
          id: idx,
          value: `unsubscribe`,
          label: `Unsubscribed (${keyValue})`,
          key: key,
        };
    }
  }
  const getReceipentsList = () => {
    setLoader(true)
    campaignApi
      .getReceipentsListData(
        receipents_id,
        page,
        pageSize,
        props?.recipientListData
      )
      .then(response => {
        setLoader(false)
        if (response.statuses_count) {
          let tempData = Object.keys(response.statuses_count).map((key, idx) => {
            return getObjectForKey(key, response?.statuses_count?.[key], idx);
          })
          setAllListOptions(tempData);
        }
        if (response?.data) {
          setReceipents(response?.data)
          setRowCount(response?.meta?.total_records)
        } else if (response?.success) {
          setRowCount(response?.meta?.total_records || 0)
          setReceipents([])
        }
      })
      .catch(error => {
        setLoader(false)
        if (error.response?.data?.error === INVALID_ID_DATA) {
          setInvalidData(true)
          return
        }
        Toaster.TOAST(getMethodError(error), 'error')
        console.log(error)
      })
  }

  const handlePage = val => {
    let data = val + 1
    setPage(data)
  }

  useEffect(() => {
    getReceipentsList()
  }, [props?.recipientListData, page])

  const headCells = [
    {
      field: 'first_name',
      headerName: 'Name',
      sortable: true,
      minWidth: 400,
      flex: 1,
      valueGetter: params => `${params?.row?.attributes?.full_name}`,
      renderCell: cellValues => {
        let userName = cellValues?.row?.attributes?.full_name
        return (
          <>
            <Stack
              direction='row'
              spacing={2}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Avatar sx={{ width: '42px', height: '42px' }} alt='Remy Sharp'>
                  {' '}
                  <AccountCircleIcon></AccountCircleIcon>{' '}
                </Avatar>
                <div
                  className='ma-nameTable-list'
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '7px'
                  }}
                >
                  <IconTooltip title={userName} />
                </div>
              </div>
            </Stack>
          </>
        )
      }
    },
    {
      field: 'email',
      sortable: true,
      headerName: 'Email',
      minWidth: 350,
      flex: 1,
      renderCell: params => {
        return (
          <span className='linkStyling'>{params?.row?.attributes?.email}</span>
        )
      }
    },
    {
      field: 'opened_count',
      sortable: true,
      headerName: 'Opened Count',
      minWidth: 350,
      flex: 1,
      renderCell: params => {
        return (
          <span>
            {params?.row?.attributes.opened_count}
          </span>
        )
      }
    },
    {
      field: 'opened_time',
      sortable: true,
      minWidth: 350,
      flex: 1,
      headerName: "Last Opened Time",
      renderCell: (params) => {
        return (
          <span>
            {params?.row?.attributes?.last_opened_time
              ? params?.row?.attributes?.last_opened_time
              : "N/A"}
          </span>
        )
      }
    },
    {
      field: 'delivered_time',
      sortable: true,
      minWidth: 350,
      flex: 1,
      headerName: "Delivered Time",
      renderCell: (params) => {
        return (
          <span>
            {params?.row?.attributes?.delivered_time
              ? params?.row?.attributes?.delivered_time
              : "N/A"}
          </span>
        )
      }
    }
  ]

  const headCellsData =
    status === EMAIL_SCHEDULED || status === EMAIL_CANCELLED
      ? headCells.slice(0, 2)
      : headCells

  return (
    <>
      {Invalid_data ? (
        <span style={{ display: 'flex', justifyContent: 'center' }}>
          <IncorrectId />
        </span>
      ) : (
        <Box className='ma-main-table' sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <div style={{ height: '700px' }}>
              <DataGrid
                disableColumnFilter
                disableColumnSelector
                rows={receipents}
                columns={headCellsData}
                paginationMode='server'
                sx={{
                  borderLeft: 'none',
                  borderRight: 'none',
                  color: '#191A47',
                  borderRadius: '0',
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: '600',
                    fontSize: '14px',
                    textTransform: 'uppercase'
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#F9F9FB',
                    cursor: 'pointer'
                  },
                  '.MuiDataGrid-iconSeparator': {
                    display: 'none'
                  },
                  '& .MuiDataGrid-columnHeader': {
                    border: '1px solid #E8E8ED',
                    borderLeft: 'none',
                    borderTop: 'none',
                    borderBottom: 'none'
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    border: '1px solid #E8E8ED',
                    borderLeft: 'none',
                    borderTop: 'none',
                    backgroundColor: '#F9F9FB'
                  },
                  '& .MuiDataGrid-columnHeader:nth-last-of-type(1)': {
                    borderRight: 'none'
                  }
                }}
                rowHeight={62}
                headerHeight={52}
                pageSize={pageSize}
                rowCount={rowCount}
                rowsPerPageOptions={[pageSize]}
                page={page - 1}
                onPageChange={newPage => handlePage(newPage)}
                disableSelectionOnClick
                components={{
                  NoRowsOverlay: () =>
                    CustomNoRowsOverlay(loader, receipents, 'receipents')
                }}
              />
            </div>
          </Paper>
        </Box>
      )}
    </>
  )
}
export default ReceipentsList
