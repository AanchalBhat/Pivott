import { render } from '@testing-library/react';
import { FetchApi } from '../../../apis/fetchApi';
import { PotentialApi } from '../../../apis/PotentialApi';
import {
  POTENTIAL_ALL_DETAILS,
  CREATE_POTENTIAL,
  POTENTIAL_LEAD_SOURCE,
  POTENTIAL_OWNER,
  POTENTIAL_REASON,
  POTENTIAL_STAGE,
  POTENTIAL_TRANSFER,
  POTENTIAL_TYPE,
  POTENTIAL_WON,
  POTENTIAL_STAGETYPE,
} from '../../../constants/routes';


jest.mock('../../../apis/fetchApi', () => ({
  FetchApi: jest.fn(),
}));

let createResult = {
  message: "Success",
  success: true
}

describe('PotentialApi Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should test create function', () => {
    const data = { data: "test-data" };
    PotentialApi.create(data);
    expect(FetchApi).toHaveBeenCalledWith(CREATE_POTENTIAL, 'POST', JSON.stringify({ data }));
  });

  it('should test potentialWon function', () => {
    const data = { /* example data */ };
    PotentialApi.potentialWon(data);
    expect(FetchApi).toHaveBeenCalledWith(POTENTIAL_WON, 'POST', JSON.stringify({ data }));
  });

  it('should test getType function', () => {
    const company_id = 'example_company_id';
    PotentialApi.getType(company_id);
    const expectedUrl = `${POTENTIAL_TYPE}&company_id=${company_id}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'GET', false, 'application/json', false, false);
  });

  it('should test getAll function', () => {
    const page = 1;
    const pageSize = 10;
    PotentialApi.getAll(page, pageSize);
    const expectedUrl = `${CREATE_POTENTIAL}/?page=${page}&per_page=${pageSize}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'GET');
  });

  it('should test getPipelineOwnerList function', () => {
    PotentialApi.getPipelineOwnerList();
    expect(FetchApi).toHaveBeenCalledWith(POTENTIAL_OWNER, 'GET');
  });

  it('should test getStageData function', () => {
    const company_id = 'example_company_id';
    PotentialApi.getStageData(company_id);
    const expectedUrl = `${POTENTIAL_STAGE}?company_id=${company_id}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'GET', false, 'application/json', false, false);
  });

  it('should test getReasonData function', () => {
    const company_id = 'example_company_id';
    PotentialApi.getReasonData(company_id);
    const expectedUrl = `${POTENTIAL_REASON}?company_id=${company_id}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'GET');
  });

  it('should test update function', () => {
    const data = { data: "test-data" };
    const id = 'example_id';
    PotentialApi.update(data, id);
    const expectedUrl = `${CREATE_POTENTIAL}/${id}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'PUT', JSON.stringify({ data }));
  });

  it('should test getDataById function', () => {
    const id = 'example_id';
    PotentialApi.getDataById(id);
    const expectedUrl = `${CREATE_POTENTIAL}/${id}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'GET');
  });

  it('should test getShowDataById function', () => {
    const id = 'example_id';
    PotentialApi.getDataById(id);
    const expectedUrl = `${CREATE_POTENTIAL}/${id}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'GET');
  });

  it('should test updateLeadDetialsById function', () => {
    const data = { data: "test-data" };
    const id = 'example_id';
    PotentialApi.updateLeadDetialsById(data, id);
    const expectedUrl = `${CREATE_POTENTIAL}/${id}/lead_update`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'PUT', data, false);
  });
  it('should test createContactDetail function', () => {
    const data = { data: "test-data" };
    PotentialApi.createContactDetail(data);
    expect(FetchApi).toHaveBeenCalledWith(POTENTIAL_ALL_DETAILS, 'POST', JSON.stringify({ data }));
  });

  it('should test massDelete function', () => {
    const data = { data: "test-data" };
    PotentialApi.massDelete(data);
    const expectedUrl = `${CREATE_POTENTIAL}/potential_mass_delete`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'DELETE', JSON.stringify(data));
  });

  it('should test potentialTransfer function', () => {
    const data = { data: "test-data" };
    PotentialApi.potentialTransfer(data);
    expect(FetchApi).toHaveBeenCalledWith(POTENTIAL_TRANSFER, 'PUT', JSON.stringify(data));
  });


  it('should test massConvert function', () => {
    const data = { data: "test-data" };
    PotentialApi.massConvert(data);
    const expectedUrl = `${CREATE_POTENTIAL}/potential_mass_convert`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'POST', JSON.stringify(data));
  });

  it('should test getFilter function', () => {
    const data = { data: "test-data" };
    const page = 1;
    const pageSize = 10;
    const dropdownCheck = true;

    PotentialApi.getFilter(data, page, pageSize, dropdownCheck);

    const expectedUrl = '/potentials?date_from=undefined&date_to=undefined&filter_by=undefined&page=1&per_page=10';

    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'GET');
  });

  it('should test getPotentialSearch function', () => {
    const data = 'example_data';
    const page = 1;
    const pageSize = 10;
    const check = true;
    const dropdownCheck = true;

    PotentialApi.getPotentialSearch(data, page, pageSize, check, dropdownCheck);

    const expectedUrl = '/potentials?search[potential]=example_data&date_from=undefined&date_to=undefined&filter_by=undefined&page=1&per_page=10';

    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'GET');
  });

  it('should test getDropdownFilter function', () => {
    const data = 'example_data';
    const page = 1;
    const pageSize = 10;
    const check = true;

    PotentialApi.getDropdownFilter(data, page, pageSize, check);

    const expectedUrl = '/potentials?stage=example_data&page=1&per_page=10&date_from=undefined&date_to=undefined&filter_by=undefined';

    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'GET');
  });


  //dropdown crud api
  it('should call FetchApi with the correct URL for createStageData', async () => {
    const data = { data: 'test_data' };
    FetchApi.mockResolvedValueOnce(createResult);
    const response = await PotentialApi.createStageData(data);
    expect(FetchApi).toHaveBeenCalledWith(POTENTIAL_STAGE, 'POST', JSON.stringify(data), "application/json", false, false);
    expect(response).toEqual(createResult)
  });

  it('should call FetchApi with the correct URL for editStageData', async () => {
    const data = { data: 'test_data' };
    const id = 6;
    FetchApi.mockResolvedValueOnce(createResult);
    const response = await PotentialApi.editStageData(id, data);
    expect(FetchApi).toHaveBeenCalledWith(`${POTENTIAL_STAGE}/${id}`, 'PUT', JSON.stringify(data), "application/json", false, false);
    expect(response).toEqual(createResult)
  });

  it('should call FetchApi with the correct URL for deleteStageData', async () => {
    const id = 6;
    FetchApi.mockResolvedValueOnce(createResult);
    const response = await PotentialApi.deleteStageData(id);
    expect(FetchApi).toHaveBeenCalledWith(`${POTENTIAL_STAGE}/${id}`, "DELETE");
    expect(response).toEqual(createResult)
  });


  it('should call FetchApi with the correct URL for createTypeData', async () => {
    const data = { data: 'test_data' };
    FetchApi.mockResolvedValueOnce(createResult);
    const response = await PotentialApi.createTypeData(data);
    expect(FetchApi).toHaveBeenCalledWith(POTENTIAL_STAGETYPE, 'POST', JSON.stringify(data), "application/json", false, false);
    expect(response).toEqual(createResult)
  });

  it('should call FetchApi with the correct URL for editTypeData', async () => {
    const data = { data: 'test_data' };
    const id = 6;
    FetchApi.mockResolvedValueOnce(createResult);
    const response = await PotentialApi.editTypeData(id, data);
    expect(FetchApi).toHaveBeenCalledWith(`${POTENTIAL_STAGETYPE}/${id}`, 'PUT', JSON.stringify(data), "application/json", false, false);
    expect(response).toEqual(createResult)
  });

  it('should call FetchApi with the correct URL for deleteTypeData', async () => {
    const id = 6;
    FetchApi.mockResolvedValueOnce(createResult);
    const response = await PotentialApi.deleteTypeData(id);
    expect(FetchApi).toHaveBeenCalledWith(`${POTENTIAL_STAGETYPE}/${id}`, "DELETE");
    expect(response).toEqual(createResult)
  });

});
