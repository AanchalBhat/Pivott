import React, { useContext } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/AddCircleOutlined";
import { DataContext } from "../../../context";
import {
  LEAD_SOURCE,
  LEAD_STATUS,
  INDUSTRY,
  STAGE,
  SCORE,
  TYPE,
  PAYMENT_MODE,
  COMPANY_SIZE,
} from "../../../utils/constants";

const DropDownCrud = ({
  id,
  name,
  placeholder,
  handleValueChange,
  itemId,
  addNew,
  errorMessage,
  arrayData,
  onAddDetail,
  handleEditClick,
  handleShow,
  dataTestid,
  helperText,
  disabled,
}) => {
  const { setCrudField } = useContext(DataContext);
  const userInfo = JSON.parse(localStorage.getItem("user_info"))?.role
    ?.role_name;

  const handleMouseDown = () => {
    switch (id) {
      case "lead_source_id":
        setCrudField(LEAD_SOURCE);
        break;
      case "industry":
        setCrudField(INDUSTRY);
        break;
      case "pipeline_stage":
        setCrudField(STAGE);
        break;
      case "stage":
        setCrudField(STAGE);
        break;
      case "type":
        setCrudField(TYPE);
        break;
      case "status_id":
        setCrudField(LEAD_STATUS);
        break;
      case "pipeline_score_id":
        setCrudField(SCORE);
        break;
      case "company_size":
        setCrudField(COMPANY_SIZE);
        break;
      case "payment_mode_id":
        setCrudField(PAYMENT_MODE);
        break;

      default:
        break;
    }
  };

  const handleDelete = (data) => {
    if(disabled){
      return
    }
    handleShow(data)
  }

  return (
    <TextField
      data-testid={dataTestid}
      className="createlead-textField ma-setting-module"
      fullWidth
      id={id}
      name={name}
      placeholder={placeholder}
      label={!itemId && placeholder}
      value={itemId}
      select
      onChange={handleValueChange}
      helperText={
        helperText ? (
          helperText
        ) : (
          <span className="ma-error">{errorMessage}</span>
        )
      }
      onMouseDown={() => handleMouseDown()}
      SelectProps={{
        MenuProps: {
          PaperProps: { style: { maxHeight: "400px" } },
        },
      }}
      InputLabelProps={{
        shrink: false,
      }}
    >
      {arrayData?.map((data, key) => {
        return (
          <MenuItem
            key={key}
            value={data.id}
            className="menu-item"
            divider={true}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>{data?.attributes?.name}</span>
            {(userInfo === "superadmin" || userInfo === "admin") && (
              <span
                className={
                  data?.attributes?.name === "Other"
                    ? "edit-delete-remove"
                    : "edit-delete-icons"
                }
              >
                <EditIcon
                  onClick={(event) => handleEditClick(event, data)}
                  sx={{ color: "#191A47", fontSize: "20px" }}
                />
                <DeleteIcon 
                  onClick={() => handleDelete(data)}
                  sx={{ color: "#191A47", fontSize: "20px" }}
                />
              </span>
            )}
          </MenuItem>
        );
      })}
      {(userInfo === "superadmin" || userInfo === "admin") && (
        <MenuItem
          onClick={() => onAddDetail("add_new", itemId)}
          sx={{
            position: "sticky",
            zIndex: 3,
            bottom: 0,
            background: "#fff",
            display: "flex",
            color: "#2C42B5",
            fontSize: "14px",
            fontWeight: "600",
            paddingTop: "10px",
            paddingBottom: "10px",
            gap: "5px",
            "&:hover": {
              backgroundColor: "#fff !important",
            },
            "&.Mui-selected": {
              backgroundColor: "#fff",
            },
          }}
        >
          <AddIcon sx={{ color: "#2C42B5" }} />{" "}
          {`ADD NEW ${addNew.toUpperCase()}`}
        </MenuItem>
      )}
    </TextField>
  );
};

export default DropDownCrud;
