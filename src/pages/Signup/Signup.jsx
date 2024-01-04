import React, { useContext, useEffect, useState } from 'react'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

//mui
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import CorporateFareIcon from '@mui/icons-material/CorporateFare'
import mobLogo from '../../assets/logo_bluev.svg'
import logoWhite from '../../assets/logo-white.svg'
import signupThumb from '../../assets/signup-thumb.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SignUpAPI } from '../../apis/SignupApi'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import SocialLogin from '../Login/SocialLogin'
import { GenerateOtpAPI } from '../../apis/VerifyEmailApi'
import { setCompanyDomain } from '../../utils'
import { DataContext } from '../../context'
import { Toaster } from '../common/Toaster'
import debouce from 'lodash.debounce'
import '../Login/Login.css'
import { Box, CircularProgress } from '@mui/material'
import { EMAIL_REGEX, NAMES_REGEX } from '../../utils/regexLists'
import { getCountryCallingCode } from 'libphonenumber-js'
import { ButtonLoader } from '../common/ButtonLoader'
import { getMethodError, restMethodError } from '../../constants/errorMessages'

const Signup = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const invitation_token = params.get('invitation_token')
  const company_domain = params.get('company_domain')
  const company_token = params.get('company_token')
  const { setIsCompName } = useContext(DataContext)
  const [email, setEmail] = useState('')
  const [isFnameValid, setIsFnameValid] = useState(true)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [fullNameErrorMessage, setFullNameErrorMessage] = useState('')
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneCode, setPhoneCode] = useState('+91')
  const [phoneErrorMessage, setPhoneErrorMessage] = useState('')
  const [company, setCompany] = useState('')
  const [companyErr, setCompanyErr] = useState('')
  const [terms, setTerms] = useState(false)
  const [termsErr, setTermsErr] = useState('')
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [isCompany, setIsCompany] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailLoader, setEmailLoader] = useState(false)
  const [loader, setLoader] = useState('')
  const user_not_found = JSON.parse(localStorage.getItem('user_not_found_data'))
  let country_code = '+91'
  useEffect(() => {
    const loginErrorSSO = localStorage.getItem('error')
    if (loginErrorSSO) {
      Toaster.TOAST(loginErrorSSO, 'error')
    }
    if (user_not_found) {
      loginWithSSO()
    }
    localStorage.removeItem('error')
  }, [])

  useEffect(() => {
    if (invitation_token) {
      SignUpAPI.getEmailNCompany(invitation_token, company_domain)
        .then(resp => {
          if (resp) {
            setEmail(resp?.email)
            setCompany(resp?.company_name?.name)
            setBtnDisabled(true)
          }
        })
        .catch(error => {
          Toaster.TOAST(getMethodError(error), 'error')
          console.log(error)
        })
    }
    if (company_token) {
      getInvitationLink()
    }
  }, [])

  const getInvitationLink = () => {
    SignUpAPI.getCompanyToken(company_token)
      .then(resp => {
        localStorage.setItem('company_token', resp?.company?.invitation_token)
        setCompany(resp?.company?.name)
        setBtnDisabled(true)
      })
      .catch(error => {
        Toaster.TOAST(getMethodError(error), 'error')
        console.log(error)
      })
  }

  const loginWithSSO = () => {
    setFirstName(user_not_found?.first_name)
    setLastName(user_not_found?.last_name)
    setEmail(user_not_found?.email)
  }
  useEffect(() => {
    const signUpData = JSON.parse(localStorage.getItem('sign_up_data'))
    if (signUpData) {
      setLoader(false)
      setFirstName(signUpData?.first_name)
      setLastName(signUpData?.last_name)
      setEmail(signUpData?.email)
      setCompany(signUpData?.company_name)
      setPhoneNumber(signUpData?.country_code + ' ' + signUpData?.phone)
      setPhoneCode(signUpData?.country_code)
    }
    localStorage.removeItem('social_title')
  }, [country_code])
  const [toggle_password, setToggle_password] = useState(false)
  const [isPasswordCheck, setIsPasswordCheck] = useState(false)
  let strongRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*])(?=.{4,})'
  )

  const filterCompany = companyName => {
    let data = {
      name: companyName
    }
    setLoader('company')
    SignUpAPI.companyFilter({ data })
      .then(res => {
        setLoader('')
        setCompanyErr('')
      })
      .catch(error => {
        setLoader('')
        setCompanyErr(restMethodError(error))
        console.log(error)
      })
  }

  const filterEmail = validEmail => {
    let user = {
      email: validEmail
    }
    setLoader('email')
    SignUpAPI.emailFilter({ user })
      .then(res => {
        setLoader('')
        setEmailErrorMessage('')
      })
      .catch(error => {
        setLoader('')
        setEmailErrorMessage(restMethodError(error))
        console.log(error)
      })
  }

  const debounceSave = React.useCallback(
    debouce(function (e) {
      if (e) {
        filterCompany(e)
      }
    }, 800),
    []
  )

  const debounceEmailSave = React.useCallback(
    debouce(function (e) {
      if (e) {
        filterEmail(e)
      }
    }, 800),
    []
  )

  const handleEmailChange = event => {
    let val = event.target.value
    setEmail(event.target.value)
    debounceEmailSave(val)
    if (!val) {
      setEmailErrorMessage("Email can't be empty")
    } else {
      setEmailErrorMessage('')
    }
  }

  const handlePasswordChanges = event => {
    setPassword(event.target.value)
    if (!event.target.value) {
      setPasswordErrorMessage("Password can't be empty")
    } else if (!strongRegex.test(event.target.value)) {
      setIsPasswordCheck(false)
      setPasswordErrorMessage(
        'Password must be at least one uppercase, lowercase, special character and number'
      )
    } else if (event.target.value?.length < 8) {
      setIsPasswordCheck(false)
      setPasswordErrorMessage('Password should be minimum 8 characters')
    } else {
      setIsPasswordCheck(true)
      setPasswordErrorMessage('')
    }
  }

  const togglePasswordHide = () => {
    setToggle_password(toggle_password => !toggle_password)
  }

  const handleOrganizationChanges = event => {
    let val = event.target.value
    setCompany(event.target.value)
    debounceSave(val)
    if (!val) {
      setCompanyErr("Company can't be empty")
    } else if (val?.length < 3 || val?.length > 75) {
      if (!val) {
        setCompanyErr('')
        setIsCompany(false)
      } else {
        setIsCompany(true)
        setCompanyErr('Company should be min 3 & max 75 characters')
      }
    } else {
      setCompanyErr('')
      setIsCompany(false)
    }
  }

  const handleCountry = country => {
    if (country) {
      const countryCallingCode = getCountryCallingCode(country)
      setPhoneCode(`+${countryCallingCode}`)
    }
  }

  const handlePhoneChanges = value => {
    setPhoneNumber(value)
    if (!value) {
      setPhoneErrorMessage("Phone number can't be empty")
    } else {
      setPhoneErrorMessage(' ')
    }
  }

  const handleFirstnameChanges = event => {
    setFirstName(event.target.value)
    if (!event?.target?.value) {
      setFullNameErrorMessage("First name can't be empty")
    } else if (!NAMES_REGEX.test(event?.target?.value)) {
      setIsFnameValid(false)
      setFullNameErrorMessage('Please enter a valid name')
    } else {
      setIsFnameValid(true)
      setFullNameErrorMessage('')
    }
  }

  const handleLastnameChanges = event => {
    setLastName(event.target.value)
    if (!event?.target?.value) {
      setLastNameErrorMessage("Last name can't be empty")
    } else if (!NAMES_REGEX.test(event?.target?.value)) {
      setLastNameErrorMessage('Please enter a valid last name')
    } else {
      setLastNameErrorMessage('')
    }
  }

  const handleTerms = () => {
    setTerms(!terms)
    if (!terms) {
      setTermsErr('')
    }
  }

  const inviteUserSignUp = user => {
    setLoading(true)
    SignUpAPI.create({ user }, invitation_token, company_domain)
      .then(response => {
        Toaster.TOAST(response?.message, 'success')
        localStorage.setItem('user_email', JSON.stringify(user?.email))
        localStorage.setItem('login_id', response?.data?.data?.id)
        localStorage.setItem('token', response?.token)
        localStorage.setItem(
          'user_info',
          JSON.stringify(response?.data?.data?.attributes)
        )
        setCompanyDomain(response?.data?.data?.attributes?.domain)
        setIsCompName(prev => !prev)
        navigate('/dashboard')
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        Toaster.TOAST(restMethodError(error), 'error')
        console.log(error)
      })
  }

  const invitedLinkSignUp = user => {
    setLoading(true)
    GenerateOtpAPI.create({ user }, company_token)
      .then(response => {
        if (response?.success) {
          if (response?.success === false) {
            navigate('/login')
          } else {
            navigate('/verify-email')
          }
          Toaster.TOAST(response?.message, 'success')
          localStorage.setItem('sign_up_data', JSON.stringify(user))
          localStorage.setItem('user_email', JSON.stringify(user?.email))
        }
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        Toaster.TOAST(restMethodError(error), 'error')
        console.log(error)
      })
  }

  const normalSignUp = user => {
    setLoading(true)
    let data = {
      first_name: firstName,
      last_name: lastName,
      phone: phoneNumber?.replace(phoneCode, '').trim(),
      email: email,
      country_code: phoneCode,
      company_name: company
    }
    GenerateOtpAPI.create({ user: data })
      .then(function (response) {
        Toaster.TOAST(response?.message, 'success')
        localStorage.setItem('sign_up_data', JSON.stringify(user))
        if (response?.success === false) {
          navigate('/login')
        } else {
          navigate('/verify-email')
        }
        localStorage.setItem('user_email', JSON.stringify(user?.email))

        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        // if (error?.response?.data?.success === false) {
        //   navigate("/login");
        // }
        Toaster.TOAST(restMethodError(error), 'error')
        console.log(error)
      })
  }

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      document.getElementById('signUpButton').click()
    }
  }

  const handleLoginClick = () => {
    let user = {
      first_name: firstName,
      last_name: lastName,
      phone: phoneNumber?.replace(phoneCode, '').trim(),
      country_code: phoneCode,
      company_name: company,
      email: email,
      password: password
    }

    if (
      email?.length !== 0 &&
      isFnameValid &&
      password?.length !== 0 &&
      firstName?.length !== 0 &&
      lastName?.length !== 0 &&
      phoneNumber?.length !== 0 &&
      company?.length !== 0 &&
      terms &&
      password?.length >= 8 &&
      phoneErrorMessage === ' ' &&
      isPasswordCheck &&
      !isCompany &&
      companyErr === '' &&
      emailErrorMessage === ''
    ) {
      setLoading(true)
      if (invitation_token) {
        inviteUserSignUp(user)
      } else if (company_token) {
        invitedLinkSignUp(user)
      } else {
        normalSignUp(user)
      }
    } else {
      if (email?.length === 0) {
        setEmailErrorMessage("Email can't be empty")
      }
      if (password?.length === 0) {
        setPasswordErrorMessage("Password can't be empty")
      } else if (password?.length < 8) {
        setPasswordErrorMessage('Password should be minimum 8 characters')
      }
      if (firstName?.length === 0) {
        setIsFnameValid(false)
        setFullNameErrorMessage("First name can't be empty")
      }
      if (lastName?.length === 0) {
        setLastNameErrorMessage("Last name can't be empty")
      }
      if (phoneNumber?.length === 0) {
        setPhoneErrorMessage("Phone number can't be empty")
      }
      if (company?.length === 0) {
        setCompanyErr("Company can't be empty")
      }
      if (!terms) {
        setTermsErr('Please check terms and privacy')
      }
    }
  }

  return (
    <div className='ma-login-top mainContainer'>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={4}>
          <div className='ma-mainCenter-image'>
            <div className='ma-mainScreen-image ma-signupbg-image'>
              <div className='ma-contentImg-set'>
                <Box sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                  <img src={logoWhite} className='loginImg' alt='login_image' />{' '}
                  <img
                    src={mobLogo}
                    className='mobile_loginImg'
                    alt='mobile_login_image'
                  />{' '}
                </Box>
                <h2>
                  <span>Jump start</span> and automate your <span>Sales!</span>
                </h2>
              </div>
              <div className='ma-loginThumb-img'>
                <img src={signupThumb} alt='login_image' />{' '}
              </div>
            </div>
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={8}
          sx={{
            flexDirection: 'row',
            display: 'flex',
            position: 'relative',
            margin: '0 auto'
          }}
        >
          <Grid item container>
            <Grid
              item
              xs={12}
              md={12}
              lg={8}
              className='ma-signup-container cardContainer FormInputs'
              sx={{ margin: 'auto' }}
            >
              <h3 data-testid='sig' className='ma-form-heading'>
                Signup
              </h3>
              <Grid className='ma-form-signup' container spacing={2}>
                <Grid item xs={6} md={6} lg={6}>
                  <TextField
                    role='textb'
                    className='placeholder_field'
                    data-testid='firstName'
                    name='firstName'
                    fullWidth
                    id='firstName'
                    autoComplete='off'
                    placeholder='*First Name'
                    value={firstName}
                    autoFocus
                    onChange={e => handleFirstnameChanges(e)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <AccountCircleOutlinedIcon />
                        </InputAdornment>
                      )
                    }}
                    helperText={
                      <span className='ma-error'>{fullNameErrorMessage}</span>
                    }
                    error={!isFnameValid ? true : false}
                  />
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <TextField
                    className='placeholder_field'
                    data-testid='lastname'
                    name='lastname'
                    fullWidth
                    id='lastname'
                    autoComplete='off'
                    placeholder='*Last Name'
                    value={lastName}
                    onChange={e => handleLastnameChanges(e)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <AccountCircleOutlinedIcon />
                        </InputAdornment>
                      )
                    }}
                    helperText={
                      <span className='ma-error'>{lastNameErrorMessage}</span>
                    }
                  />
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <TextField
                    className='placeholder_field'
                    data-testid='email-input'
                    fullWidth
                    name='email'
                    placeholder='*Email'
                    value={email}
                    type='email'
                    disabled={!company_token && btnDisabled}
                    onChange={e => handleEmailChange(e)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <MailOutlineIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position='end'>
                          {' '}
                          {loader === "email" && (
                            <CircularProgress size='1.2rem' thickness='1.5' />
                          )}
                        </InputAdornment>
                      )
                    }}
                    error={emailErrorMessage ? true : false}
                    helperText={
                      <span className='ma-error'>{emailErrorMessage}</span>
                    }
                  />
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <TextField
                    className='placeholder_field'
                    fullWidth
                    data-testid='company'
                    value={company}
                    placeholder='*Organization Name'
                    type='text'
                    name='organizationName'
                    disabled={btnDisabled}
                    onChange={e => handleOrganizationChanges(e)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <CorporateFareIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position='end'>
                          {' '}
                          {loader === "company" && (
                            <CircularProgress size='1.2rem' thickness='1.5' />
                          )}
                        </InputAdornment>
                      )
                    }}
                    error={companyErr ? true : false}
                    helperText={<span className='ma-error'>{companyErr}</span>}
                  />
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <div className='ma-country-code'>
                    <PhoneInput
                      className='placeholder_field'
                      onCountryChange={handleCountry}
                      placeholder='*Phone'
                      value={phoneNumber}
                      defaultCountry={'IN'}
                      onChange={handlePhoneChanges}
                    />
                    <span className='countryCodeValue'>{phoneCode}</span>
                    <span className='ma-error'>{phoneErrorMessage}</span>
                  </div>
                </Grid>

                {/* <Grid item xs={12} md={12}> */}
                <Grid item xs={6} md={6} lg={6}>
                  <TextField
                    className='placeholder_field'
                    fullWidth
                    data-testid='password'
                    value={password}
                    placeholder='*Password (8+ characters)'
                    type={toggle_password ? 'text' : 'password'}
                    onChange={e => handlePasswordChanges(e)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <LockOutlinedIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment
                          position='end'
                          sx={{ cursor: 'pointer' }}
                        >
                          {' '}
                          {toggle_password ? (
                            <Visibility
                              className='cursor_pointer'
                              onClick={togglePasswordHide}
                            />
                          ) : (
                            <VisibilityOff onClick={togglePasswordHide} />
                          )}
                        </InputAdornment>
                      )
                    }}
                    helperText={
                      <span className='ma-error'>{passwordErrorMessage}</span>
                    }
                    onKeyPressCapture={handleKeyPress}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <div className='checkbox_container'>
                    <Checkbox
                      inputProps={{ 'data-testid': 'check' }}
                      checked={terms}
                      className='ma-check-box p-0 me-2'
                      color='primary'
                      onChange={() => handleTerms()}
                      onKeyPressCapture={handleKeyPress}
                    />
                    <h6 className='infoTxt'>
                      <span>*By clicking Sign me up you agree to </span>{' '}
                      <span>
                        <Link to='/tnc'>Terms & Conditions</Link> and{' '}
                        <Link to='/privacy-policy'>Privacy Policy</Link>.
                      </span>
                    </h6>
                  </div>
                  <span className='ma-error'> {termsErr}</span>
                </Grid>
                <Grid item xs={12} md={12}>
                  <div className='signUpRow'>
                    <ButtonLoader
                      loading={loading}
                      classStyle={'signUpBtn'}
                      btnType={'submit'}
                      testid={'signup-btn'}
                      id={'signUpButton'}
                      title={'SIGNUP'}
                      fullWidth={true}
                      handleClick={() => handleLoginClick()}
                    />
                  </div>
                </Grid>
                {!invitation_token && (
                  <Grid item xs={12} md={12}>
                    <div className='seprateTxt'>
                      <div className='access'>
                        <span>Or access quickly</span>
                      </div>
                    </div>
                    {/* Social login design starts================== */}
                    <SocialLogin title='Signup' />
                    {/* Social login design ends================== */}
                  </Grid>
                )}
              </Grid>
            </Grid>
            <div></div>
          </Grid>
          <div className='ma-tryIt-free text-center'>
            <p>
              {' '}
              Have an account?
              <span
                data-testid='login'
                className='tryIt'
                onClick={() => {
                  navigate('/login')
                }}
              >
                Login
              </span>
            </p>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Signup
