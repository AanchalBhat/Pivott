import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { ButtonLoader } from './ButtonLoader';
import "../../styles/custom/Tabs.css";

export default function DeletePopup({ title,
  content,
  openDelete,
  handleClose,
  handleDelete,
  primaryBtn,
  secondaryBtn,
  deleteId,
  loading = false
}) {

  const handleDeleteClick = () => {
    if (deleteId) {
      handleDelete(deleteId);
    }
    else {
      handleDelete();
    }
  }

  return (
    <Dialog
      open={openDelete}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={"sm"}
      className='ma-deletePopup-box'
    >
      <DialogTitle className='ma-root'>
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
          className={secondaryBtn ? "ma-delete-noBtn" : "ma-del-cancel"}
        >
          {secondaryBtn || "NO"}
        </Button>
        <ButtonLoader
          loading={loading}
          classStyle={primaryBtn ? "ma-delete-yesBtn" : "ma-del-applay"}
          handleClick={() => handleDeleteClick()}
          title={primaryBtn || "YES"}
          autoFocus={true}
        />
      </DialogActions>
    </Dialog>
  )
}
