import React from 'react'
import PopupFooter from '../../pages/common/PopupFooter'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField
} from '@mui/material'
import PopupHeader from '../../pages/common/PopupHeader'
import { ButtonLoader } from '../../pages/common/ButtonLoader'

export default function ContactActionPopup ({
  openLT,
  handleClose,
  heading,
  label,
  value,
  handleChange,
  loading,
  btnTitle,
  error,
  placeholder,
  handleClick
}) {
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
      <PopupHeader label={heading} handleToCloseLT={handleClose} />
      <DialogContent>
        <div className='ma-parentLT'>
          <Grid container xs={12} md={12}>
            <Grid
              item={true}
              xs={12}
              md={12}
              className={'createlead-detail-grid'}
            >
              <label className='labeltxt'>{label}</label>
              <TextField
                fullWidth
                name='rename'
                value={value}
                id='rename'
                variant='outlined'
                onChange={e => handleChange(e)}
                helperText={<span className='ma-error'>{error}</span>}
                placeholder={placeholder}
              />
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: '#F9F9FB', padding: '0' }}>
        <div className='popup-listMDbutton'>
          <Button
            className='cancel me-3'
            data-testid='cancel-btn'
            autoFocus
            onClick={handleClose}
          >
            CANCEL
          </Button>
          <ButtonLoader
            loading={loading}
            classStyle={'applay m-0'}
            handleClick={() => {
              handleClick()
            }}
            testid={'submit-btn'}
            title={btnTitle.toUpperCase()}
            autoFocus={true}
          />
        </div>
      </DialogActions>
    </Dialog>
  )
}
