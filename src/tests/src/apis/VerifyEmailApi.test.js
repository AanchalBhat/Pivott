import { VerifyEmailAPI, GenerateOtpAPI } from '../../../apis/VerifyEmailApi';
import { RESEND_OTP, RESEND_TWOFACTOR_OTP, VERIFY_EMAIL, VERIFY_TWOFACTOR } from '../../../constants/routes';
import { FetchApi } from '../../../apis/fetchApi';

jest.mock('axios'); // Mocking axios module

jest.mock('../../../apis/fetchApi', () => ({
  FetchApi: jest.fn(),
}));

let createResult = {
    message: "Success",
    success: true
}

let generateResult = {
    data: {
        data: {
            id: "12",
            type: "email_otp",
            attributes: {}
        }
    },
    message: "OTP send successfully",
    success: true
}

describe('VerifyEmailAPI', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call FetchApi with the correct URL for create', async () => {
    const data = { email: 'test@example.com' };
    FetchApi.mockResolvedValueOnce(createResult);
    const response = await VerifyEmailAPI.create(data);
    expect(FetchApi).toHaveBeenCalledWith(VERIFY_EMAIL, 'POST', JSON.stringify(data));
    expect(response).toEqual(createResult)
  });

  it('should call FetchApi with the correct URL and headers for createTwoFactor', async () => {
    const user = { id: 123 };
    const domain = 'example.com';
    FetchApi.mockResolvedValueOnce(createResult);
    const response = await VerifyEmailAPI.createTwoFactor({ user, domain });
    expect(FetchApi).toHaveBeenCalledWith(
      VERIFY_TWOFACTOR,
      'POST',
      JSON.stringify({ user }),
      'application/json',
      false,
      true,
      { 'COMPANY-DOMAIN': domain }
    );
    expect(response).toEqual(createResult);
  });
});

describe('GenerateOtpAPI', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should call FetchApi with the correct URL for create', async () => {
      const data ={
        user: { 
        email: "an04@yopmail.com",
       }};
       FetchApi.mockResolvedValueOnce(generateResult);
       const response = await GenerateOtpAPI.create(data);
      expect(FetchApi).toHaveBeenCalledWith(RESEND_OTP, 'POST', JSON.stringify(data));
    expect(response).toEqual(generateResult)
    });
  
    it('should call FetchApi with the correct URL and headers for resend_twoFactorOtp', async () => {
      const user = { id: 789 };
      const domain = 'example.com';
      FetchApi.mockResolvedValueOnce(generateResult);
      const response = await GenerateOtpAPI.resend_twoFactorOtp({ user, domain });
      expect(FetchApi).toHaveBeenCalledWith(
        RESEND_TWOFACTOR_OTP,
        'POST',
        JSON.stringify({ user }),
        'application/json',
        false,
        true,
        { 'COMPANY-DOMAIN': domain }
      );
      expect(response).toEqual(generateResult);
    });
  });