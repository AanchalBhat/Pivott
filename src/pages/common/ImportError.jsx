import { Box, Grid, Typography } from "@mui/material";
import "../../styles/global/common.css";

export const ImportError = ({ importErr }) => {

    return (
        <Box className="ma-import-errors">
            <Typography className="ma-import-error-txt"
            >Please correct errors in your Excel sheet and re-import for a smooth experience.</Typography>

            <Grid my={2} className='ma-import-grid'>
                <Grid item xs={12} md={12}>
                    <Typography className="ma-import-heading">Errors</Typography>
                </Grid>
                <Box className="ma-import-box" style={{ padding: "10px 0" }}>
                    {importErr.length && importErr.map((elem, index) => (
                        <pre
                            key={index}
                            style={{
                                overflow: 'unset',
                                color: "#191A47",
                                fontSize: "13px",
                                fontWeight: "400",
                                padding: "5px 0",
                                textAlign: "left",
                                paddingLeft: "15px",
                            }}
                        >
                            {elem}
                        </pre>
                    ))}
                </Box>
            </Grid>
        </Box>
    );
};
