import React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'
import { NavLink as NavLinkBase } from 'react-router-dom'
// import global css
import '../styles/global/common.css'

const DrawerData = props => {
  const { splitLocation = [] } = props
  const userInfo = JSON.parse(localStorage.getItem('user_info'))
  const role_name = userInfo?.role?.role_name
  const PopupAction = (popupState, itm) => {
    removeStorageItem();
    popupState.close();
  };

  const removeStorageItem = () => {
    localStorage.removeItem("current_page")
    localStorage.removeItem("all_filter_data");
  };

  const NavLink = React.forwardRef((props, ref) => {
    return (
      <NavLinkBase ref={ref} {...props} className={props.activeClassName} />
    );
  });
  return (
    <>
      <List className='ma-listBar-side'>
        {props?.drawerData?.map((item, id) => {
          if (item) {
            return (
              <div key={id}>
                {props?.isProfileDrwawer &&
                  ((id === 0 && (
                    <h5
                      style={{
                        color: '#5E5F7E',
                        fontWeight: 600,
                        paddingLeft: '24px',
                        margin: '1rem 1rem'
                      }}
                    >
                      {'PERSONAL'}
                    </h5>
                  )) ||
                    (((id === 3 && role_name !== 'executive') ||
                      (id === 4 && role_name === 'executive')) && (
                      <h5
                        style={{
                          color: '#5E5F7E',
                          fontWeight: 600,
                          paddingLeft: '24px',
                          margin: '1rem 1rem'
                        }}
                      >
                        {'COMPANY'}
                      </h5>
                    )))}
                <ListItem
                  key={id}
                  disablePadding
                  sx={{ display: 'block' }}
                  className={`${
                    !item.upcoming
                      ? 'ma-listpoint-sidebar'
                      : 'ma-listpoint-sidebar ma-disabled'
                  }`}
                >
                  {!item?.subNav ? (
                    <ListItemButton
                      component={NavLink}
                      onClick={() => {
                        removeStorageItem();
                      }}
                      to={item.to}
                      className='ma-listItem-center '
                      sx={{
                        minHeight: 48,
                        justifyContent: props?.open ? 'initial' : 'center',
                        px: 2.5
                      }}
                    >
                      <Tooltip
                        placement='right-start'
                        title={
                          <Typography className='ma-tooltip-txt'>
                            {item?.title}
                          </Typography>
                        }
                      >
                        <ListItemIcon
                          className={`${
                            splitLocation[1] === `${item?.listItemIconTxt}`
                              ? 'ma-sideIcon-set-active'
                              : 'ma-sideIcon-set'
                          }
                            ${
                              splitLocation[2] === `${item?.listItemIconTxt}`
                                ? 'ma-sideIcon-set-active'
                                : 'ma-sideIcon-set'
                            }`}
                          sx={{
                            minWidth: 0,
                            mr: props?.open ? 3 : 'auto',
                            justifyContent: 'center'
                          }}
                        >
                          {item?.activeTabIcon()}
                        </ListItemIcon>
                      </Tooltip>
                      <ListItemText
                        className={`${
                          splitLocation[1] === `${item?.listItemIconTxt}`
                            ? 'ma-listitem-txt-active'
                            : 'ma-listitem-txt'
                        }
                            ${
                              splitLocation[2] === `${item?.listItemIconTxt}`
                                ? 'ma-listitem-txt-active'
                                : 'ma-listitem-txt'
                            }`}
                        primary={item?.title}
                        sx={{ opacity: props?.open ? 1 : 0 }}
                      />

                      {item.upcoming && (
                        <span
                          style={{
                            display: props?.open ? 'block' : 'none',
                            opacity: props?.open ? 1 : 0,
                            color: '#E8E8ED',
                            background: '#303159',
                            borderRadius: '2px',
                            padding: '3px 6px',
                            fontSize: '10px',
                            textTransform: 'uppercase'
                          }}
                        >
                          Upcoming
                        </span>
                      )}
                    </ListItemButton>
                  ) : (
                    <PopupState variant='popover' popupId='demo-popup-popover'>
                      {popupState => (
                        <div>
                          <ListItemButton
                            className='ma-listItem-center'
                            sx={{
                              minHeight: 48,
                              justifyContent: props?.open
                                ? 'initial'
                                : 'center',
                              px: 2.5
                            }}
                            {...bindTrigger(popupState)}
                          >
                            <ListItemIcon
                              className={`${
                                splitLocation[1] ===
                                `${item?.subNav[0]?.listItemIconTxt}`|| splitLocation[1] ===
                                `${item?.subNav[1]?.listItemIconTxt}`
                                  ? 'ma-sideIcon-set-active'
                                  : 'ma-sideIcon-set'
                              }
                            `}
                              sx={{
                                minWidth: 0,
                                mr: props?.open ? 3 : 'auto',
                                justifyContent: 'center'
                              }}
                            >
                              {item?.activeTabIcon()}
                            </ListItemIcon>
                            <ListItemText
                              className='ma-listitem-txt'
                              primary={item?.title}
                              sx={{ opacity: props?.open ? 1 : 0 }}
                            />
                            {item?.upcoming && (
                              <span
                                style={{
                                  display: props?.open ? 'block' : 'none',
                                  opacity: props?.open ? 1 : 0,
                                  color: '#E8E8ED !important ',
                                  background: '#303159',
                                  borderRadius: '2px',
                                  padding: '3px 6px',
                                  fontSize: '10px',
                                  textTransform: 'uppercase'
                                }}
                              >
                                Upcoming
                              </span>
                            )}
                          </ListItemButton>
                          <Popover
                            sx={{
                              '.MuiPopover-paper': {
                                padding: '20px 12px',
                                background: '#191A47',
                                borderRadius: props?.open ? '0px' : '8px',
                                border: props?.open
                                  ? 'none'
                                  : '1px solid #47486C',
                                boxShadow: props?.open
                                  ? 'none'
                                  : '0px 3px 16px 0px rgba(0, 0, 0, 0.30)',
                                borderLeft: props?.open
                                  ? '1px solid #47486C'
                                  : 'none',
                                marginLeft: props?.open ? '-30px' : '-40px',
                                paddingLeft: props?.open ? '26px' : '12px',
                                paddingTop: props?.open ? '0px' : '20px',
                                marginTop: '20px'
                              },
                              '.MuiListItemText-root': {
                                color: '#F9F9FB',
                                margin: '4px 0px  ',
                                background: props?.open ? '#191A47' : '#303159',
                                borderRadius: '4px',
                                // translateX: "50%",
                                cursor: 'pointer'
                              }
                            }}
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                              vertical: 40,
                              horizontal: 70
                            }}
                            transformOrigin={{
                              vertical: 0,
                              horizontal: 0
                            }}
                          >
                            {item?.subNav?.map((itm, idx) => {
                              return (
                                <ListItemText
                                  primary={
                                    <NavLinkBase exact to={itm?.to}>
                                      {itm?.title}
                                    </NavLinkBase>
                                  }
                                  key={idx}
                                  className={
                                    itm.upcoming &&
                                    idx == 1 &&
                                    itm?.listItemIconTxt === 'contact-lists'
                                      ? 'ma-listitem-txt ma-disabled':
                                       splitLocation[1] ===
                                        itm?.listItemIconTxt
                                      ? 'ma-listitem-txt-active'
                                      : 'ma-listitem-txt'
                                  }
                                  onClick={() => PopupAction(popupState, itm)}
                                  sx={{
                                    textAlign: props?.open ? 'left' : 'center',
                                    width: '150px',
                                    padding: '5px 10px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <ListItemIcon
                                    className={
                                      splitLocation[1] ===
                                      `${itm?.listItemIconTxt}`
                                        ? ''
                                        : 'ma-sideIcon-set'
                                    }
                                    sx={{
                                      minWidth: 0,
                                      mr: props?.open ? 3 : 'auto',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    {itm?.icon()}
                                  </ListItemIcon>
                                  <Typography sx={{ p: 2 }}>
                                    {itm?.title}
                                  </Typography>
                                </ListItemText>
                              )
                            })}
                          </Popover>
                        </div>
                      )}
                    </PopupState>
                  )}
                </ListItem>
              </div>
            )
          }
        })}
      </List>
    </>
  )
}

export default DrawerData
