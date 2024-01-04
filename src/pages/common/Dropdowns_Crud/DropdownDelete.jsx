import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

export default function DropdownDelete({
    title,
    content,
    openDelete,
    handleClose,
    handleDelete,
    disabled=false
}) {
    return (
        <Dialog
            open={openDelete}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={"sm"}
            className='ma-deletePopup-box'
        >
            <DialogTitle className='ma-root'>
                {/* {title} */}
                {`Delete ${content?.EditLabel} "${content?.Name}" ?`}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {`Deleting "${content?.Name}" from ${content?.EditLabel} will reassign all ${content?.Name} ${content?.ModuleName} to "Other"`}
                </DialogContentText>
            </DialogContent>
            <DialogActions className="p-3">
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={() => handleClose()}
                    className="noBtn"
                    sx={{
                        border: '1px solid #D1D1DA !important',
                        borderRadius: '4',
                        color: '#000 !important',
                        height: '42px',
                        width: '112px',
                        textTransform: 'none !important',
                        minWidth: '64px',
                    }}
                >
                    NO
                </Button>
                <Button
                    disabled={disabled}
                    onClick={() => handleDelete(null, true)}
                    autoFocus
                    size="medium"
                    className="yesBtn"
                    sx={{
                        backgroundColor: '#EC627B !important',
                        borderRadius: '4',
                        color: '#fff !important',
                        height: '42px',
                        width: '112px',
                        textTransform: 'none !important',
                        minWidth: '64px',
                    }}
                >
                    YES
                </Button>
            </DialogActions>
        </Dialog >
    )
}
