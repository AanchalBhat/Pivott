import { render } from '@testing-library/react';
import { FetchApi } from '../../../apis/fetchApi';
import { MeetingApi } from '../../../apis/MeetingApi';
import { LANGUAGES, MEETINGS, TIMEZONE  } from '../../../constants/routes';

jest.mock('../../../apis/fetchApi', () => ({
  FetchApi: jest.fn(),
}));

describe('MeetingApi Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

 
  it('should test create function', () => {
    const data = {data : "gps"};
    MeetingApi.create(data);
    expect(FetchApi).toHaveBeenCalledWith(MEETINGS, 'POST', JSON.stringify(data));
    MEETINGS
  });


  it('should test getAll function', () => {
    MeetingApi.getAll();
    expect(FetchApi).toHaveBeenCalledWith(MEETINGS, 'GET');
  });

  it('should test getTimezones function', () => {
    MeetingApi.getTimezones();
    expect(FetchApi).toHaveBeenCalledWith(TIMEZONE, 'GET', false, 'application/json', false, false);
  });

 
  it('should test update function', () => {
    const id = 'example_id';
    const meetingable_id = 'example_meetingable_id';
    const type = 'example_type';
    const data = { data : "gps"};
    MeetingApi.update(id, meetingable_id, type, data);
    expect(FetchApi).toHaveBeenCalledWith(
      `${MEETINGS}/${id}?meetingable_id=${meetingable_id}&meetingable_type=${type}`,
      'PUT',
      JSON.stringify(data)
    );
  });

  it('should test delete function', () => {
    const id = 'example_id';
    const meeting_id = 'example_meeting_id';
    const type = 'example_type';
    MeetingApi.delete(id, meeting_id, type);
    expect(FetchApi).toHaveBeenCalledWith(
      `${MEETINGS}/${id}?meetingable_id=${meeting_id}&meetingable_type=${type}`,
      'DELETE'
    );
  });

  it('should test getAllId function', () => {
    const id = 'example_id';
    const type = 'example_type';
    const page = 1;
    const pageSize = 10;
    MeetingApi.getAllId(id, type, page, pageSize);
    expect(FetchApi).toHaveBeenCalledWith(
      `${MEETINGS}/?search[meetingable_type]=${type}&search[meetingable_id]=${id}&page=${page}&per_page=${pageSize}`,
      'GET'
    );
  });

  it('should test getLanguages function', () => {
    MeetingApi.getLanguages();
    expect(FetchApi).toHaveBeenCalledWith(LANGUAGES, 'GET');
  });

});
