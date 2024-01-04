import { Iconparkcubewhite } from "../assets/index";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));
const DrawerHead = (props) => {
  return (
    <>
      <DrawerHeader
        onClick={
          props?.open && !props?.isProfileDrwawer
            ? props?.handleDrawerClose
            : props?.handleDrawerOpen
        }
        className="ma-sideTop-bar"
      >
        {!props?.open ? (
          <img
            src={Iconparkcubewhite}
            alt="IconParkCubeWhite"
            className="cube_size_"
          />
        ) : (
          <>
            <div className="d-flex align-items-center ma-drawerLeft-side">
              <img
                src={Iconparkcubewhite}
                alt="IconParkCubeWhite"
                className="cube_size_"
              />
              <h6 className="ma-pivott-logo">Pivott.ai</h6>
            </div>
          </>
        )}
      </DrawerHeader>
      {props?.isProfileDrwawer && (
        <div style={{ display: "block" }}>
          <Button
            className="ma-goback-btn"
            variant="Outlined"
            onClick={props?.backNavigation}
          >
            <ArrowBackIosIcon />
            Go Back
          </Button>
        </div>
      )}
    </>
  );
};

export default DrawerHead;
