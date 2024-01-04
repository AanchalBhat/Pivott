import Tooltip from "@mui/material/Tooltip";
//import global css
import "../../styles/global/common.css";

const IconTooltip = ({ title, icon, handleIconClick }) => {
    return (
        <Tooltip
            componentsProps={{
                tooltip: {
                    sx: {
                        bgcolor: "common.black",
                        "& .MuiTooltip-arrow": {
                            color: "common.black",
                        },
                        fontWeight: 400,
                        textTransform: "capitalize"
                    },
                },
            }}
            arrow
            title={title}
            placement="top-start"
        >
            {
                icon ? (
                    <span onClick={handleIconClick} className="iconContact">
                        {icon}
                    </span>
                )
                    : (<span className="ma-userName-table">
                        {title?.length < 15 ? title : title?.substring(0, 13) + "..."}
                    </span>)
            }
        </Tooltip>
    )
}

export default IconTooltip
