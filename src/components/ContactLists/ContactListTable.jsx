import { Box, Paper, Stack, Tooltip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React from 'react'
import { CustomNoRowsOverlay } from '../../pages/common/CustomNoRowsOverlay'

const headCells = [
  {
    field: 'first_name',
    headerName: 'Name',
    sortable: true,
    width: 350,
    renderCell: params => {
      return (
        <span>
          {params?.row?.attributes?.first_name +
            ' ' +
            params?.row?.attributes?.last_name || '-'}
        </span>
      )
    }
  },
  {
    field: 'designation',
    headerName: 'Designation',
    sortable: true,
    width: 250,
    renderCell: params => {
      return <span>{params.row?.attributes?.designation || '-'}</span>
    }
  },
  {
    field: 'email',
    headerName: 'Email',
    sortable: true,
    width: 350,
    renderCell: params => {
      return (
        <span className='linkStyling'>
          {params.row?.attributes?.email || '-'}
        </span>
      )
    }
  },
  {
    field: 'mobile',
    headerName: 'Mobile',
    sortable: true,
    width: 180,
    valueGetter: params => {
      return params.row?.attributes?.phone_number
        ? `${params.row?.attributes?.country_code} ${params.row?.attributes?.phone_number}`
        : '-'
    }
  }
]

export default function ContactListTable ({
  contactListData,
  rowCount,
  loader,
  pageSize,
  page,
  gridKey,
  handlePageChange,
  setContactListId
}) {
  const handlePage = val => {
    let data = val + 1
    handlePageChange(data)
  }
  return (
    <Box className='ma-main-table' sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <div style={{ height: '700px' }}>
          <DataGrid
            key={gridKey}
            disableColumnFilter
            disableSelectionOnClick
            disableColumnSelector
            rows={contactListData}
            columns={headCells}
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
                backgroundColor: '#F9F9FB'
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
            rowHeight={58.5}
            headerHeight={52}
            pageSize={pageSize}
            rowCount={rowCount}
            rowsPerPageOptions={[pageSize]}
            page={page - 1}
            checkboxSelection
            onPageChange={newPage => handlePage(newPage)}
            onSelectionModelChange={itm => setContactListId(itm)}
            components={{
              NoRowsOverlay: () =>
                CustomNoRowsOverlay(loader, contactListData, 'contact-lists')
            }}
          />
        </div>
      </Paper>
    </Box>
  ) 
}
