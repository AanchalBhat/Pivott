import { render } from '@testing-library/react';
import { FetchApi } from '../../../apis/fetchApi';
import { LostLeadApi } from '../../../apis/LostLeadApi';
import {   LOST,
    LOST_CONVERT,
    LOST_DELETE,
    LOST_MANAGE,
    LOST_MASS_DELETE,
    LOST_MASS_TRANSFER,
    LOST_REASONS,
    LOST_SEARCH, } from '../../../constants/routes';



jest.mock('../../../apis/fetchApi', () => ({
  FetchApi: jest.fn(),
}));

describe('LostLeadApi Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should test getAllData function', () => {
    const page = 1;
    const pageSize = 10;
    LostLeadApi.getAllData(page, pageSize);
    expect(FetchApi).toHaveBeenCalledWith(`${LOST}/?page=${page}&per_page=${pageSize}`, 'GET');
  });

  it('should test getAllFilter function', () => {
    const id = 'example_id';
    const page = 1;
    const pageSize = 10;
    LostLeadApi.getAllFilter(id, page, pageSize);
    expect(FetchApi).toHaveBeenCalledWith(
      `${LOST}?search[reason_id]=${id}&page=${page}&per_page=${pageSize}`,
      'GET'
    );
    
  });

  it('should test getLostLeadSearch function with header', () => {
    const data = 'example_data';
    const page = 1;
    const pageSize = 10;
    const dropdownCheck = true;
    const header = "&search[reason_id]=example_id"
    LostLeadApi.getLostLeadSearch(data, page, pageSize, dropdownCheck);
    expect(FetchApi).toHaveBeenCalledWith(
      `${LOST_SEARCH}/?search[lost_lead]=${data}${header}&page=${page}&per_page=${pageSize}`,
      'GET'
    );
  });


  it('should test fetchOverview function', () => {
    const id = 'example_id';
    LostLeadApi.fetchOverview(id);
    expect(FetchApi).toHaveBeenCalledWith(`${LOST}/${id}`, 'GET');
  });


  it('should test fetchNotes function', () => {
    const id = 'example_id';
    LostLeadApi.fetchNotes(id);
    expect(FetchApi).toHaveBeenCalledWith(
      `/notes/?search[noteable_id]=${id}&search[noteable_type]=LostLead`,
      'GET'
    );
  });

  it('should test fetchTasks function', () => {
    const id = 'example_id';
    LostLeadApi.fetchTasks(id);
    expect(FetchApi).toHaveBeenCalledWith(
      `/tasks/?search[taskable_id]=${id}&search[taskable_type]=LostLead`,
      'GET'
    );
  });

  it('should test fetchMeetings function', () => {
    const id = 'example_id';
    LostLeadApi.fetchMeetings(id);
    expect(FetchApi).toHaveBeenCalledWith(
      `/meetings/?search[meetingable_id]=${id}&search[meetingable_type]=LostLead`,
      'GET'
    );
  });


  it('should test fetchCalls function', () => {
    const id = 'example_id';
    LostLeadApi.fetchCalls(id);
    expect(FetchApi).toHaveBeenCalledWith(
      `/call-informations/?search[callable_id]=${id}&search[callable_type]=LostLead`,
      'GET'
    );
  });

  it('should test convertType function', () => {
    const data = {data : "gajendra"};
    LostLeadApi.convertType(data);
    expect(FetchApi).toHaveBeenCalledWith(LOST_CONVERT, 'POST', JSON.stringify(data));
  });


  it('should test leadDelete function', () => {
    const data = { data : "gajendra" };
    LostLeadApi.leadDelete(data);
    expect(FetchApi).toHaveBeenCalledWith(LOST_DELETE, 'DELETE', JSON.stringify(data));
  });


  it('should test leadMassDelete function', () => {
    const data = { data : "gajendra"};
    LostLeadApi.leadMassDelete(data);
    expect(FetchApi).toHaveBeenCalledWith(LOST_MASS_DELETE, 'DELETE', JSON.stringify(data));
  });

  it('should test massTransfer function', () => {
    const data = { data : "gajendra" };
    LostLeadApi.massTransfer(data);
    expect(FetchApi).toHaveBeenCalledWith(LOST_MASS_TRANSFER, 'PUT', JSON.stringify(data));
  });


  it('should test getReasonData function', () => {
    const company_id = 'example_company_id';
    LostLeadApi.getReasonData(company_id);
    expect(FetchApi).toHaveBeenCalledWith(
      `${LOST_REASONS}?company_id=${company_id}`,
      'GET',
      false,
      'application/json',
      false,
      false
    );
  });

  
  it('should test getManageData function', () => {
    const type = 'example_type';
    LostLeadApi.getManageData(type);
    expect(FetchApi).toHaveBeenCalledWith(`${LOST_MANAGE}=${type}`, 'GET');
  });
});
