import { DialogActions, Button } from '@mui/material'
import '../../styles/custom/ReportsPopup.css'
import { ButtonLoader } from './ButtonLoader'

const PopupFooter = ({
  loading,
  submitBtn,
  handleToCloseLT,
  handleSave,
  rename = false
}) => {
  return (
    <DialogActions sx={{ backgroundColor: '#F9F9FB', padding: '0' }}>
      <div className='popup-listMDbutton'>
        <Button
          className='cancel me-3'
          data-testid='cancel-btn'
          autoFocus
          onClick={handleToCloseLT}
        >
          CANCEL
        </Button>
        <ButtonLoader
          loading={loading}
          classStyle={'applay m-0'}
          btnType={'submit'}
          handleClick={() => {}}
          testid={'submit-btn'}
          title={submitBtn.toUpperCase()}
          autoFocus={true}
          style={{ maxWidth: rename && '180px' }}
        />
      </div>
    </DialogActions>
  )
}

export default PopupFooter
