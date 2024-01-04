import React, { useMemo } from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

const Actions = ({ actionsData, isTrue = false, ContactListId = false ,allContacts=false}) => {
  const filteredAction = useMemo(() => {
    if (isTrue) {
      // If condition is true, filter out "move to archive"
      return actionsData.filter(item => item.value !== 'move to archive')
    } else {
      // If condition is false, return the original array
      return actionsData
    }
  }, [actionsData, isTrue])

  return (
    <>
      <div className='ma-dropdown-design ms-2 me-1'>
        <DropdownButton
          title={
            <span>
              Actions
              <ArrowDropDownIcon />
            </span>
          }
          labelid='demo-simple-select-autowidth-label'
          // className="filterSelect"
        >
          {filteredAction &&
            filteredAction?.map((item, key) => (
                <Dropdown.Item
                  disabled={item.disabled && ContactListId.length === 0 && !allContacts}
                  style={{
                    color:item.disabled && ContactListId.length === 0 && !allContacts && '#8C8DA3'
                  }}
                  className='ma-menuFont-family'
                  key={key}
                  onClick={() => {
                    item?.handleClick()
                  }}
                >
                  {item.title}
                </Dropdown.Item>
            ))}
        </DropdownButton>
      </div>
    </>
  )
}

export default Actions
