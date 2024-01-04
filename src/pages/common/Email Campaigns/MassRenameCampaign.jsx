import { useState, useEffect, useContext } from 'react'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
// import global css
import '../../../styles/global/common.css'
import PopupHeader from '../PopupHeader'
import PopupFooter from '../PopupFooter'
import { DataContext } from '../../../context'
import { styled } from '@mui/system'
import { campaignApi } from '../../../apis/campaignApi'
import { Toaster } from '../Toaster'
import { restMethodError } from '../../../constants/errorMessages'

// Styled component for the table row
const StyledTableRow = styled(Grid)(({ theme, even }) => ({
  background: even ? '#FFF' : '#F9F9FB',
  border: '1px solid #E8E8ED',
  display: 'flex',
  alignItems: 'center'
}))

const StyledHeaderRow = styled(Grid)({
  background: '#F9F9FB',
  border: '1px solid #F9F9F9'
})

const StyledHeaderItem = styled(Grid)(({ isNameLabel }) => ({
  borderRight: isNameLabel ? '1px solid #E8E8ED' : 'none',
  padding: 0
}))

// Styled component for the header row labels
const StyledHeaderLabel = styled('label')({
  color: '#191A47',
  fontWeight: 600,
  fontSize: '16px',
  padding: '15px 15px 25px'
})

const StyledBody = styled('div')({
  padding: '36px 12px 25px'
})

const StyledGridItem = styled(Grid)(({ isLabel }) => ({
  margin: '16px 0px',
  marginLeft: isLabel ? '25px' : '0px',
  textTransform: 'capitalize',
  color: isLabel ? '#191A47' : 'none',
  fontWeight: isLabel ? '400' : 'normal',
  fontSize: '14px',
  width: isLabel ? '50%' : '40%'
}))

const MassRenameCampaign = ({ openLT, handleToCloseLT }) => {
  const [loading, setLoading] = useState(false)
  const { emailCampaignObj, setGlobalEmailCampaign, setCampaignTableReload } =
    useContext(DataContext)
  const [editedValues, setEditedValues] = useState()
  const [arr, setArr] = useState(emailCampaignObj)
  const [renameErrors, setRenameErrors] = useState({})

  useEffect(() => {
    setEditedValues(emailCampaignObj)
  }, [])

  const handleRename = () => {
    const data = {
      campaigns: arr
    }
    let numCheck = arr.length > 1
    setLoading(true)
    campaignApi
      .massRename(data)
      .then(response => {
        setLoading(false)
        handleToCloseLT()
        if(response){
          Toaster.TOAST(
            `${numCheck ? 'Campaigns' : 'Campaign'} renamed successfully!`,
            'success'
          )
          setCampaignTableReload(prev => !prev)
          setGlobalEmailCampaign([])
        }
      })
      .catch(error => {
        const errors = error?.response?.data?.error_details
        setRenameErrors(errors)
        setLoading(false)
        Toaster.TOAST(restMethodError(error), 'error')
        console.log(error)
      })
  }

  const handleSubmit = e => {
    e.preventDefault()
    handleRename()
  }


  const handleRenameChange = (e, id, index) => {
    setArr(elem => {
      const newArr = [...elem]
      newArr[index] = {
        ...newArr[index],
        new_name: e.target.value
      }
      return newArr
    })

    setRenameErrors(errors => {
      const newErrors = { ...errors }
      newErrors[index] = ''
      return newErrors
    })
  }


  const handelClose = () => {
    handleToCloseLT()
  }

  return (
    <Dialog
      sx={{
        position: 'absolute',
        zIndex: '1000'
      }}
      className='ma-massRenamePopup-boxHolder'
      open={openLT}
      onClose={handelClose}
    >
      <form onSubmit={handleSubmit}>
        <PopupHeader label='Rename Campaigns' handleToCloseLT={handelClose} />
        <DialogContent>
          <StyledBody>
            <Grid container xs={12} md={12}>
              <StyledTableRow
                item
                xs={12}
                md={12}
                even={false}
                className={'createlead-detail-grid'}
              >
                <StyledHeaderRow container className={'createlead-detail-grid'}>
                  <StyledHeaderItem isNameLabel={true} item xs={6}>
                    <StyledHeaderLabel>NAME</StyledHeaderLabel>
                  </StyledHeaderItem>
                  <StyledHeaderItem isNameLabel={false} item xs={6}>
                    <StyledHeaderLabel>NEW NAME</StyledHeaderLabel>
                  </StyledHeaderItem>
                </StyledHeaderRow>
              </StyledTableRow>
              {arr &&
                arr.map((item, idx) => {
                  return (
                    <StyledTableRow
                      container
                      even={idx % 2 === 0}
                      key={idx}
                      className={'createlead-detail-grid'}
                    >
                      <StyledGridItem isLabel={true}>
                        {editedValues && editedValues[idx].new_name}
                      </StyledGridItem>
                      <StyledGridItem isLabel={false}>
                        <TextField
                          fullWidth
                          name={`rename-${idx}`}
                          variant='outlined'
                          value={{ new_name: item['new_name'], id: item['id'] }}
                          onChange={e => handleRenameChange(e, item.id, idx)}
                          inputProps={{ value: item['new_name'] }}
                          placeholder='New name'
                          error={Boolean(
                            renameErrors[item.id] || renameErrors[idx]
                          )}
                          helperText={
                            <span
                              style={{ fontSize: '11px' }}
                              className='ma-error'
                            >
                              {renameErrors[item.id] &&
                                renameErrors[item.id]?.replace(
                                  editedValues[idx].new_name + ':',
                                  ''
                                )}
                              {renameErrors[idx] &&
                                renameErrors[idx]?.replace(
                                  editedValues[idx].new_name + ':',
                                  ''
                                )}
                            </span>
                          }
                        />
                      </StyledGridItem>
                    </StyledTableRow>
                  )
                })}
            </Grid>
          </StyledBody>
        </DialogContent>
        <PopupFooter
          loading={loading}
          submitBtn={'Update Names'}
          handleToCloseLT={handelClose}
          rename={true}
        />
      </form>
    </Dialog>
  )
}

export default MassRenameCampaign
