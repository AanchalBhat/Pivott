import React from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import ReplayIcon from "@mui/icons-material/Replay";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Convert = ({ handleConvert, handleLostConvert, data }) => {
  return (
    <>
      <DropdownButton
        // alignRight
        data-testid="drop-btn"
        title={
          <span>
            {" "}
            <ReplayIcon /> Convert <ArrowDropDownIcon />{" "}
          </span>
        }
        id="dropdown-basic-button"
        className="ma-dropdowns dropdown-toggle"
        onSelect={handleConvert}
      >
        {data &&
          data?.map((item, key) => (
            <Dropdown.Item key={key} eventKey={item?.eventKey} onClick={() => { item?.label === "Convert to Lost" && handleLostConvert(item?.label) }}>
              {item?.label}
            </Dropdown.Item>
          ))}
      </DropdownButton>
    </>
  );
};

export default React.memo(Convert);
