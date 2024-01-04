import { render } from '@testing-library/react';
import { FetchApi } from '../../../apis/fetchApi';
import { DeleteUsers, personalApi,profileManageData } from '../../../apis/PersonalApi';
import { ACTIVE_USERS, MANAGE_DATA_ROLES, SESSIONS_LOGOUT } from '../../../constants/routes';

jest.mock('../../../apis/fetchApi', () => ({
    FetchApi: jest.fn(),
  }));

describe('API Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });



  it('should test logOutSessions function', () => {
    personalApi.logOutSessions();
    expect(FetchApi).toHaveBeenCalledWith(SESSIONS_LOGOUT, 'DELETE');
    
  });

  it('should test DeleteUsers function', () => {
    const id = 'example_id';
    const data = {
      data: {
        user_ids: id,
      },
    };
    DeleteUsers(id);
    expect(FetchApi).toHaveBeenCalledWith(
      `${ACTIVE_USERS}/delete_users`,
      'DELETE',
      JSON.stringify(data)
    );
  });

  it('should test profileManageData function', () => {
    const data = { data:'test-data'};
    const id = 'example_manage_id';
    localStorage.setItem('manage_id', id);
    profileManageData(data);
    expect(FetchApi).toHaveBeenCalledWith(
      `${MANAGE_DATA_ROLES}/${id}`,
      'PATCH',
      JSON.stringify(data)
    );
    
  });

 

});
