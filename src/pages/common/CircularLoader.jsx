import { Box, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    root: {
        width: "100%",
        height: "100%",
        minHeight: "50vh",
        position: "relative",
        top: 0,
        left: 0,
        display: "flex",
    }
})
export const CircularLoader = () => {
    const classes = useStyles();
    return (
        <Box className={classes.root}>
            <Box sx={{
                display: 'flex',
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                margin: "auto"
            }}>
                <CircularProgress />
            </Box>
        </Box>
    )
}
