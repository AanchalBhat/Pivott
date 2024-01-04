import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { ButtonLoader } from './ButtonLoader';
import "../../styles/custom/Tabs.css";

export default function DomainPopup({ title,
  content,
  open,
  handleClose,
  handleClick,
  primaryBtn,
  loading = false
}) {

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={"sm"}
      className='ma-deletePopup-box'
    >
      <DialogTitle className='ma-root my-2'>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions className="p-3">
        <Button
          variant="outlined"
          size="medium"
          onClick={() => handleClose()}
          className={"ma-delete-noBtn"}
        >
          {"NO"}
        </Button>
        <ButtonLoader
          loading={loading}
          style={{ 
            color: primaryBtn ? "#fff" : "#191A47", 
            background: primaryBtn ? "#ff542e" : "#FFF",
            border: `1px solid ${primaryBtn ? "#ff542e" : "#d1d1da"}`,
            boxShadow : `${!primaryBtn && "none"}`
          }}
          classStyle={"ma-yesBtn-domain"}
          handleClick={() => handleClick()}
          title={"YES"}
          autoFocus={true}
        />
      </DialogActions>
    </Dialog>
  )
}
