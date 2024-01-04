import React from 'react'
import { Grid, Box, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import visa from '../../assets/Visa.png'
import masterCard from '../../assets/Mastercard.png'
import { DeleteIcon } from '../../assets/index'
import '../../styles/custom/Tabs.css'

const data = [
  {
    id: 0,
    image: visa,
    heading: 'Axis Bank Platinum Card',
    text: 'primary',
    number: '**** **** **** 0024 | 07/2029',
    user: 'SAYYED FARHAN AHMED'
  },
  {
    id: 1,
    image: masterCard,
    heading: 'HDFC Bank Diamond Card',
    text: 'Set Primary',
    number: '**** **** **** 0024 | 07/2029',
    user: 'TUSHAR PAL'
  }
]

export default function PaymentMethod () {
  return (
    <Box className="p-4">
      <Typography variant='h5'>Existing Methods</Typography>
      <Grid container className='mt-4' sx={{ gap: '15px' }}>
        {data.map(data => (
          <Grid
            item
            key={data.id}
            xs={6}
            md={5.9}
            sx={{
              backgroundColor: '#F9F9FB',
              border: '1px solid #E8E8ED',
              borderRadius: '8px',
              padding: '10px'
            }}
          >
            <Box className='d-flex justify-content-between'>
              <Box>
                <img src={data.image} alt='visa' />
                <h6 className='mt-3'>{data.heading}</h6>
              </Box>
              <Box className='d-flex'>
                <div>
                  <button className='sayyed_Txt'>
                    {data.text === 'primary' && (
                      <span>
                        <CheckCircleIcon sx={{ color: '#36b37e' }} />
                      </span>
                    )}
                    <span className='user_text_in_btn'>{data.text}</span>
                  </button>
                </div>

                <button
                  className='delete_icon_btn'
                  // onClick={() => handleShow(elem?.id)}
                >
                  <img
                    src={DeleteIcon}
                    alt='DeleteIcon'
                    className='delete_Icon '
                  />
                </button>
              </Box>
            </Box>
            <Box className='mt-5'>
              <h6 style={{ color: '#2C42B5' }}>{data.number}</h6>
              <h6 style={{ color: '#8C8DA3' }}>{data.user}</h6>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
