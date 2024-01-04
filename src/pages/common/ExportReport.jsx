import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import PopupHeader from './PopupHeader'
import PopupFooter from './PopupFooter'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { ReportsApi } from '../../apis/ReportsApi'
import excelImg from '../../assets/Excel.svg'
import pdfImg from '../../assets/pdf.svg'
import csvImg from '../../assets/csv.svg'
import { Toaster } from './Toaster'
import '../../styles/global/common.css'
import { restMethodError } from '../../constants/errorMessages'
import { ContactListApi } from '../../apis/ContactListApi'

const ExportReport = ({
  openLT,
  handleToCloseLT,
  cloneReportId,
  label,
  isContactList = false,
  ContactListId = false
}) => {
  const [format, setFormat] = useState('xls')
  const [loading, setLoading] = useState(false)
  const handleFormat = val => {
    setFormat(val)
  }

  const handleExport = (apiMethod, data) => {
    apiMethod(data)
      .then(blob => {
        setLoading(false)
        const fileURL = window.URL.createObjectURL(new Blob([blob]))
        let alink = document.createElement('a')
        alink.href = fileURL
        alink.download = `myFiles.${format}`
        alink.click()
        Toaster.TOAST('File download successfully', 'success')
        handleClose()
      })
      .catch(error => {
        setLoading(false)
        Toaster.TOAST(restMethodError(error), 'error')
        console.error(error)
      })
  }

  const handleReportExport = data => {
    handleExport(ReportsApi.exportsReport, data)
  }

  const handleExportContacts = data => {
    handleExport(ContactListApi.exportContacts, data)
  }

  const handleSubmit = e => {
    setLoading(true)
    e.preventDefault()
    let data = {
      export_as: format
    }
    if (isContactList) {
      data = {
        ...data,
        contact_ids: ContactListId,
        contact_category_id: parseInt(cloneReportId)
      }
    } else {
      data = {
        ...data,
        report_id: cloneReportId
      }
    }
    try {
      if (isContactList) {
        handleExportContacts({ data: data })
      } else {
        handleReportExport(data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleClose = () => {
    setFormat('xls')
    handleToCloseLT()
  }
  return (
    <Dialog
      sx={{
        position: 'absolute',
        zIndex: '1000'
      }}
      className='ma-popup-boxHolder'
      open={openLT}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit}>
        <PopupHeader label={label} handleToCloseLT={handleClose} />
        <DialogContent
          sx={{
            '& .MuiDialogContent-root': {
              padding: isContactList && '20px 129px !important'
            }
          }}
        >
          <div
            className={`ma-parentLT ${
              isContactList ? 'ma-exportContact-file' : 'ma-export-file'
            } `}
          >
            <Grid container xs={12} md={12} gap='20px'>
              <Grid item xs={12} md={12} className='mx-auto'>
                <span className='fileFormat-heading'>Choose File Format :</span>
                <div
                  className={
                    isContactList
                      ? 'ma-exportFile-format ma-exportFile-format2'
                      : 'ma-exportFile-format ma-exportFile-format1'
                  }
                >
                  <ul>
                    <li
                      style={{
                        border:
                          format === 'xls'
                            ? '2px solid #2C42B5'
                            : '2px solid #D1D1DA'
                      }}
                      onClick={() => {
                        if (format === 'xls') {
                          handleFormat('xls')
                        }
                      }}
                    >
                      {format === 'xls' && (
                        <p className='ma-connect-icon'>
                          <CheckCircleIcon sx={{ color: '#36B37E' }} />
                        </p>
                      )}
                      <img src={excelImg} alt='excel' />{' '}
                      <p className='mt-3 mb-0'>Excel</p>
                    </li>
                    {!isContactList && (
                      <li
                        style={{
                          border:
                            format === 'pdf'
                              ? '2px solid #2C42B5'
                              : '2px solid #D1D1DA'
                        }}
                        onClick={() => {
                          if (format !== 'pdf') {
                            handleFormat('pdf')
                          }
                        }}
                      >
                        {format === 'pdf' && (
                          <p className='ma-connect-icon'>
                            <CheckCircleIcon sx={{ color: '#36B37E' }} />
                          </p>
                        )}
                        <img src={pdfImg} alt='pdf' />{' '}
                        <p className='my-3 mb-0'>PDF</p>
                      </li>
                    )}
                    <li
                      style={{
                        border:
                          format === 'csv'
                            ? '2px solid #2C42B5'
                            : '2px solid #D1D1DA'
                      }}
                      onClick={() => {
                        if (format !== 'csv') {
                          handleFormat('csv')
                        }
                      }}
                    >
                      {format === 'csv' && (
                        <p className='ma-connect-icon'>
                          <CheckCircleIcon sx={{ color: '#36B37E' }} />
                        </p>
                      )}
                      <img src={csvImg} alt='csv' />{' '}
                      <p className='mt-3 mb-0'>CSV</p>
                    </li>
                  </ul>
                </div>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <PopupFooter
          loading={loading}
          submitBtn={'Export'}
          handleToCloseLT={handleClose}
        />
      </form>
    </Dialog>
  )
}

export default ExportReport
