import { render } from '@testing-library/react';
import { FetchApi } from '../../../apis/fetchApi';
import { NoteAPI } from '../../../apis/NoteApi';
import { NOTES } from '../../../constants/routes';

jest.mock('../../../apis/fetchApi', () => ({
  FetchApi: jest.fn(),
}));

describe('NoteAPI Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });


  it('should test create function', () => {
    const formData = { data :"test-gps"};
    NoteAPI.create({ formData });
    expect(FetchApi).toHaveBeenCalledWith(NOTES, 'POST', formData, false);
  });

  
  it('should test getAll function', () => {
    NoteAPI.getAll();
    expect(FetchApi).toHaveBeenCalledWith(NOTES, 'GET');
  });

  
  it('should test getAllId function', () => {
    const id = 'example_id';
    const type = 'example_type';
    const page = 1;
    const pageSize = 10;
    NoteAPI.getAllId(id, type, page, pageSize);
    const URL = `${NOTES}/?search[noteable_id]=${id}&search[noteable_type]=${type}&page=${page}&per_page=${pageSize}`;
    expect(FetchApi).toHaveBeenCalledWith(URL, 'GET');
  });

 
  it('should test update function', () => {
    const id = 'example_id';
    const type = 'example_type';
    const noteable_id = 'example_noteable_id';
    const formData = { data :"test-gps" };
    NoteAPI.update(id, type, noteable_id, { formData });
    const URL = `${NOTES}/${id}?noteable_type=${type}&noteable_id=${noteable_id}`;
    expect(FetchApi).toHaveBeenCalledWith(URL, 'PUT', formData, false);
  });


  it('should test delete function', () => {
    const data = {
      data: {
        id: 'example_id',
        noteable_type: 'example_noteable_type',
        noteable_id: 'example_noteable_id',
      },
    };
    NoteAPI.delete(data);
    const URL = `${NOTES}/${data.data.id}?noteable_type=${data.data.noteable_type}&noteable_id=${data.data.noteable_id}`;
    expect(FetchApi).toHaveBeenCalledWith(URL, 'DELETE', JSON.stringify(data));
  });

});
