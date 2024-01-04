import { SignUpAPI } from '../../../apis/SignupApi';
import { FetchApi } from '../../../apis/fetchApi';
import { GET_EMAIL_N_COMP, SIGNUP, COMPANY } from '../../../constants/routes';

jest.mock('../../../apis/fetchApi');

let resultData = {
    data: {
        attributes: {}
    },
    message: "",
    success: true
}

let resultEmailNCompany = {
    email: "testEmail@gmail.com",
    company_name: { name: "company" }
}

let companyResult = {
    message: "",
    success: true
}

describe('SignUpAPI', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('create() with invitation_token & company_domain', async () => {
    const data = { 
        user: {
           otp_code: 1234,
         },
         invitation_token: "1234fdcsvsd", 
         company_domain: "apurva"
     };
    const invitation_token = 'invitation-token';
    const company_domain = 'company-domain';
    const expectedUrl = `${SIGNUP}?invitation_token=${invitation_token}&company_domain=${company_domain}`;
    FetchApi.mockResolvedValueOnce(resultData);

    const response = await SignUpAPI.create(data, invitation_token, company_domain);
    
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'POST', JSON.stringify(data));
    expect(response).toEqual(resultData);
  });

  it('create() without invitation_token & company_domain', async () => {
    const data = { 
        user: {
           otp_code: 1234,
         }
     };
    const expectedUrl = SIGNUP;
    FetchApi.mockResolvedValueOnce(resultData);
    const response = await SignUpAPI.create(data);
    
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'POST', JSON.stringify(data));
    expect(response).toEqual(resultData);
  });

  it('getEmailNCompany()', async () => {
    const invitation_token = 'invitation-token';
    const company_domain = 'company-domain';
    const expectedUrl = `${GET_EMAIL_N_COMP}?invitation_token=${invitation_token}&company_domain=${company_domain}`;
    FetchApi.mockResolvedValueOnce(resultEmailNCompany);
    const response = await SignUpAPI.getEmailNCompany(invitation_token, company_domain);
    
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'GET');
    expect(response).toEqual(resultEmailNCompany);
  });

  it('companyFilter()', async () => {
    const data = {
        name: "value"
      }
    const expectedUrl = COMPANY;
    FetchApi.mockResolvedValueOnce(companyResult);
    const response = await SignUpAPI.companyFilter(data);
    
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'POST', JSON.stringify(data), 'application/json', false, false);
    expect(response).toEqual(companyResult);
  });
});