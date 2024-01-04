import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CloseIcon from "@mui/icons-material/Close";
import { menu_open } from "../assets/index";
import { Typography } from "@mui/material";
import "../styles/global/common.css";

const Header1 = (props) => {
  return (
    <>
      <Typography
        className="ma-topHeader-leads"
        variant="h6"
        noWrap
        component="div"
      >
        {props?.open &&
          props?.splitLocation[1] !== "global-search" &&
          !props?.isProfileDrwawer && (
            <MenuOpenIcon
              className="ma_menu_open"
              onClick={props?.open && props?.handleDrawerClose}
            />
          )}
        {!props?.open && props?.splitLocation[1] !== "global-search" && (
          <a href="#/" onClick={(e) => e.preventDefault()}>
            {" "}
            <img
            className="ma-rightIcon-bar"
              src={menu_open}
              onClick={!props?.open && props?.handleDrawerOpen}
              alt="menu-icon"
            />
          </a>
        )}
        {props?.splitLocation[1] === "global-search" && (
          <CloseIcon className="ma_menu_open" onClick={props?.handleBack} />
        )}{" "}
        {props?.title}
      </Typography>
    </>
  );
};

export default Header1;
