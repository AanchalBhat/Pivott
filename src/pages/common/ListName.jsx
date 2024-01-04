import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const ListName = ({
  title,
  placeholder,
  name,
  handleChange,
  value,
  arr,
  select,
  inputProps,
  setFlag,
  setValue
}) => {
  const [temp, setTemp] = useState()
  const [open, setOpen] = useState(false);

  const handleDropdownToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setTemp(arr)
  }, [arr])

  const handleChangeData = (e) => {
    handleChange(e)
    setFlag(prev => !prev)
  }

  const handleClear = () => {
    setValue("")
    setFlag(prev => !prev)
  }

  return (
    <>
      <div className="leadfilterDCforminput">
        <div className="leadfilterDCformlable">{title}</div>
        <TextField
          className="placeholder_field"
          fullWidth
          placeholder={placeholder}
          name={name}
          onChange={(e) => handleChangeData(e)}
          value={value}
          select={select}
          SelectProps={{
            IconComponent: () => (
              <div style={{ display: "flex", cursor: "pointer",padding:"0 5px" }}>
                {value && <span onClick={() => handleClear()}><ClearIcon sx={{color:"hsl(0, 0%, 80%)",fontSize:"18px"}}/></span>}
                <span onClick={handleDropdownToggle} ><KeyboardArrowDownIcon sx={{color:"hsl(0, 0%, 80%)"}}/></span>
              </div>
            ),
            open: open,
            onClose: () => handleDropdownToggle(),
            onOpen : () => handleDropdownToggle(),
          }}
          inputProps={inputProps}
          label={!value && placeholder}
          InputLabelProps={{
            shrink: false,
            style: {
              color: '#8c8da3',
              fontSize: '14px'
            },
          }}
        >
          {select && temp}
        </TextField>
      </div>
    </>
  );
};

export default ListName;
