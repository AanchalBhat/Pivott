import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useLocation } from "react-router-dom";
import { Grid } from "@mui/material";
import "../RolesPermissions/RolesPermissions.css";

const OverviewTab = ({ navigationData }) => {
  const location = useLocation();
  const splitLocation = location?.pathname.split("/");

  const handleTabActiveStatus = (text) => {
    if (splitLocation[1] === "campaign" || splitLocation[1] === "account-details"||splitLocation[1] === "subscriptions" ) {
      return splitLocation[2] === text;
    }
    return splitLocation[3] === text;
  };

  return (
    <Box className="ma-overView-tab">
      <Grid container>
        <Grid item xs={12} md={12}>
          <List className="ma-role-tabbar" sx={{ display: "inline-flex" }}>
            {navigationData?.map((item, id) => {
              return (
                <ListItem
                  key={id}
                  className={
                    handleTabActiveStatus(item?.listItemIconTxt)
                      ? "ma-active-tab"
                      : "ma-deactive-tab"
                  }
                  onClick={() => item.handleClick()}
                  sx={{ cursor: "pointer" }}
                >
                  <ListItemText primary={item.title} />
                </ListItem>
              );
            })}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverviewTab;
