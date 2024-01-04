import { useState } from "react";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { STRING_REGEX } from "../../../../utils/regexLists";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
const RecipientMore = ({
  recipients_contacts,
  recipients_modules,
  recipientEmail,
}) => {
  const [openList, setOpenList] = useState(false);
  const recipients_email = recipientEmail ? recipientEmail : [];
  const combinedArray = [...recipients_modules, ...recipients_email];
  const startingTwoValues = combinedArray.slice(0, 7);
  const remainingValues = combinedArray.slice(7);
  const recipentsData = startingTwoValues.join(", ");

  return (
    <>
      <span className="campaigns-field_Text " style={{ position: "relative" }}>
        {recipentsData ? recipentsData : "N/A"}
      </span>
      {remainingValues.length > 0 && (
        <span
          className="ma-recipients-eyeIcon"
          onClick={() => setOpenList(true)}
          style={{ cursor: "pointer", margin: "0 5px" }}
        >
          <VisibilityIcon />
        </span>
      )}
      <Menu
        id="simple-menu"
        open={openList}
        onClose={() => setOpenList(false)}
        sx={{
          padding: "10px",
          marginBottom: "auto",
          maxHeight: "440px",
          position: "absolute",
          left: "-20.5%",
          width: "100%",
        }}
        elevation={1}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        {recipients_modules.length > 0 && (
          <>
            <h5
              style={{
                borderBottom: "1px solid#E8E8ED",
                padding: "10px",
              }}
            >
              Contact List
            </h5>
            {recipients_modules.map((listData) => (
              <MenuItem
                sx={{
                  fontSize: "0.875rem",
                  width: "100%",
                  maxWidth: 500,
                  minWidth: 500,
                }}
              >
                {listData}
              </MenuItem>
            ))}
          </>
        )}
        {recipients_contacts.length > 0 && (
          <>
            <h5
              style={{
                borderBottom: "1px solid#E8E8ED",
                borderTop: "1px solid#E8E8ED",
                padding: "10px",
              }}
            >
              Individual Contacts
            </h5>
            {recipients_contacts.map((listData) => (
              <MenuItem
                className="d-flex"
                key={listData.id}
                sx={{
                  fontSize: "0.875rem",
                  width: "100%",
                  maxWidth: 500,
                  minWidth: 500,
                }}
              >
                <Avatar size={"22"} variant={"circular"}>
                  {listData.name?.match(STRING_REGEX).join("").toUpperCase()}
                </Avatar>
                <Box display={"flex"} ml={2} flexDirection={"column"}>
                  <Typography
                    color="text.primary"
                    sx={{ fontSize: "0.875rem" }}
                  >
                    {listData.name}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {listData.email}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </>
        )}
      </Menu>
    </>
  );
};
export default RecipientMore;
