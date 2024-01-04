import { render } from '@testing-library/react';
import "@testing-library/jest-dom";
import { LoginAPI,GoogleLoginAPI, MicrosoftLoginAPI  } from '../../../apis/LoginApi';
import { FetchApi } from '../../../apis/fetchApi';
import { COMPANIES, GOOGLE_LOGIN, GOOGLE_URI, MICROSOFT_LOGIN, MICROSOFT_URI } from '../../../constants/routes';




jest.mock('../../../apis/fetchApi', () => ({
  FetchApi: jest.fn(),
}));
describe('API Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should test create function of LoginAPI', () => {
    const data = { 
        username:"abc@gmail.com",
        password:"1234"
    };
    LoginAPI.create(data);
    expect(FetchApi).toHaveBeenCalledWith('/users/sign_in', 'POST', JSON.stringify(data));
  });

  it('should test getCompanyName function of LoginAPI with searchQuery', () => {
    const searchQuery = 'example';
    const page = 1;
    const pageSize = 10;
    LoginAPI.getCompanyName(searchQuery, page, pageSize);
    expect(FetchApi).toHaveBeenCalledWith(
      `${COMPANIES}?search[name]=${searchQuery}&page=${page}&per_page=${pageSize}`,
      'GET',
      false,
      'application/json',
      false,
      false
    );
  });

  it('should test getCompanyName function of LoginAPI without searchQuery', () => {
    const page = 1;
    const pageSize = 10;
    LoginAPI.getCompanyName(null, page, pageSize);
    expect(FetchApi).toHaveBeenCalledWith(
      `${COMPANIES}?page=${page}&per_page=${pageSize}`,
      'GET',
      false,
      'application/json',
      false,
      false
    );
  });

  it('should test getGoogleLogin function of GoogleLoginAPI', () => {
    const code = 'example_code';
    const redirect_url = 'example_redirect_url';
    const company = 'example_company';
    const device_id = 'example_device_id';
    const isNewComp = true;
    GoogleLoginAPI.getGoogleLogin(code, redirect_url, company, device_id, isNewComp);
    expect(FetchApi).toHaveBeenCalledWith(
      `/auths/google_omniauth?code=example_code&redirect_url=example_redirect_url/&device_id=example_company&company_name=true`,
      'GET'
    );
  });


  it('should test getMicrosoftUri function', () => {
    const redirect_url = 'example_redirect_url';

    MicrosoftLoginAPI.getMicrosoftUri(redirect_url);

    expect(FetchApi).toHaveBeenCalledWith(
      `${MICROSOFT_URI}?redirect_url=${redirect_url}/&url_type=sign_in`,
      'GET'
    );
    
  });

  it('should test getGoogleUri function', () => {
    const redirect_url = 'example_redirect_url';

    GoogleLoginAPI.getGoogleUri(redirect_url);

    expect(FetchApi).toHaveBeenCalledWith(
      `${GOOGLE_URI}?redirect_url=${redirect_url}/&url_type=sign_in`,
      'GET'
    );
    
  });

  
  it('should call FetchApi with the correct URL when isNewComp is false', () => {
    const code = 'your_code';
    const redirect_url = 'your_redirect_url';
    const device_id = 'your_device_id';

    const expectedUrl = `/auths/microsoft_auth?code=your_code&redirect_url=your_redirect_url/&device_id=your_device_id`;

    MicrosoftLoginAPI.getMicrosoftLogin(code, redirect_url, device_id, false);

    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'GET');
  });

  it('should call FetchApi with the correct URL when isNewComp is true', () => {
    const code = 'your_code';
    const redirect_url = 'your_redirect_url';
    const device_id = 'your_device_id';
    const company = 'your_company_name';

    const expectedUrl = `/auths/microsoft_auth?code=your_code&redirect_url=your_redirect_url/&device_id=your_device_id&company_name=your_company_name`; 

    MicrosoftLoginAPI.getMicrosoftLogin(code, redirect_url, device_id, true, company);

    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'GET');
  });
});
