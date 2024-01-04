import Snackbar from '@mui/material/Snackbar';
import { IconButton } from "@material-ui/core";
import CloseIcon from '@mui/icons-material/Close';

export const SnackBar = ({ setEmailToast }) => {
    return (
        <Snackbar
            ContentProps={{
                sx: {
                    background: "#191A47"
                }
            }}
            open
            autoHideDuration={2000}
            message="Email has been sent!"
            onClose={() => {setEmailToast(false)}}
            action={
                <IconButton
                    aria-label="close"
                    color="inherit"
                    sx={{ p: 0.5 }}
                    onClick={() => {setEmailToast(false)}}
                >
                    <CloseIcon />
                </IconButton>
            }
            anchorOrigin={{
                vertical: "top",
                horizontal: "center"
            }}
            sx={{ height: "100%" }}
        />
    )
}