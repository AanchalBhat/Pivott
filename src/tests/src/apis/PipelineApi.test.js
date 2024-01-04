import { FetchApi } from "../../../apis/fetchApi";
import { PipelineApi } from "../../../apis/pipelineApi";
import {
  CREATE_PIPELINE,
  GET_PIPELINE,
  PIPELINE_ALL_DETAILS,
  PIPELINE_LOST,
  PIPELINE_OWNER,
  PIPELINE_STAGE,
  PIPELINE_TRANSFER,
  PIPELINE_TYPE,
  PIPELINE_WON,
} from "../../../constants/routes";

jest.mock('../../../apis/fetchApi', () => ({
  FetchApi: jest.fn(),
}));

let createResult = {
  message: "Success",
  success: true
}

describe("PipelineApi", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const data = "search_data";
  const check = true;
  const list_view = "some_view";
  const page = 3;
  const pageSize = 30;
  const dropdownCheck = true;
  const header = 'test123';
  const dropdownHeader = true;


  it("should call FetchApi with correct parameters when creating a pipeline", () => {

    PipelineApi.create(data);

    expect(FetchApi).toHaveBeenCalledWith(
      CREATE_PIPELINE,
      "POST",
      JSON.stringify({ data: data })
    );
  });

  it("should call FetchApi with correct parameters when creating lost data", () => {

    PipelineApi.createLostData(data);

    expect(FetchApi).toHaveBeenCalledWith(
      PIPELINE_LOST,
      "POST",
      JSON.stringify({ data: data })
    );
  });

  it("should call FetchApi with correct parameters when marking a pipeline as won", () => {

    PipelineApi.pipelineWon(data);

    expect(FetchApi).toHaveBeenCalledWith(
      PIPELINE_WON,
      "POST",
      JSON.stringify({ data: data })
    );
  });

  it("should call FetchApi with correct parameters when getting pipeline type", () => {
    const company_id = 1;
    const expectedUrl = `${PIPELINE_TYPE}&company_id=${company_id}`;
    PipelineApi.getType(company_id);

    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "GET",
      false,
      "application/json",
      false,
      false
    );
  });

  it("should call FetchApi with correct parameters when filtering by score", () => {
    const data = { data: { pipeline_score_id: 123 } };
    const page = 1;
    const pageSize = 10;
    const val = "some_value";
    const dropdownCheck = true;

    PipelineApi.getFilter(data, page, pageSize, val, dropdownCheck);

    const expectedObj = `${CREATE_PIPELINE}?list_view=${val}&pipeline_score_id=123`;
    const expectedUrl = expectedObj + `&page=${page}&per_page=${pageSize}`;

    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when filtering by probability", () => {
    const data = { data: { probability: 0.75 } };
    const page = 2;
    const pageSize = 20;
    const val = "another_value";
    const dropdownCheck = false;

    PipelineApi.getFilter(data, page, pageSize, val, dropdownCheck);

    const expectedObj = `${CREATE_PIPELINE}?list_view=${val}&probability=0.75`;
    const expectedUrl = expectedObj + `&page=${page}&per_page=${pageSize}`;

    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when dropdownCheck is false", () => {
    const data = { data: { pipeline_score_id: 123 } };
    const page = 4;
    const pageSize = 40;
    const val = "some_value";
    const dropdownCheck = false;

    PipelineApi.getFilter(data, page, pageSize, val, dropdownCheck);

    const expectedObj = `${CREATE_PIPELINE}?list_view=${val}&pipeline_score_id=123`;
    const expectedUrl = expectedObj + `&page=${page}&per_page=${pageSize}`;

    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when getting all pipelines", () => {
    PipelineApi.getAll();

    expect(FetchApi).toHaveBeenCalledWith(GET_PIPELINE, "GET");
  });

  it("should call FetchApi with correct parameters when getting pipeline owner list", () => {
    PipelineApi.getPipelineOwnerList();

    expect(FetchApi).toHaveBeenCalledWith(PIPELINE_OWNER, "GET");
  });

  it("should call FetchApi with correct parameters when getting stage data", () => {
    const company_id = 12;
    const expectedUrl = `${PIPELINE_STAGE}?company_id=${company_id}`;

    PipelineApi.getStageData(company_id);

    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET", false, "application/json", false, false);
  });

  it("should call FetchApi with correct parameters when getting contact details without search query", () => {
    const page = 1;
    const pageSize = 10;

    PipelineApi.getContactDetails(null, page, pageSize);

    const expectedUrl = PIPELINE_ALL_DETAILS + `?page=${page}&per_page=${pageSize}`;

    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET", false, "application/json", false, false);
  });

  it("should call FetchApi with correct parameters when getting contact details with search query", () => {
    const page = 2;
    const pageSize = 20;
    const srchQuery = "example_query";

    PipelineApi.getContactDetails(srchQuery, page, pageSize);

    const expectedUrl = PIPELINE_ALL_DETAILS + `?page=${page}&per_page=${pageSize}&search[contact_detail]=${srchQuery}`;

    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET", false, "application/json", false, false);
  });


  it("should call FetchApi with correct parameters when updating data", () => {

    const id = 123;
    PipelineApi.update(data, id);

    const expectedUrl = `${CREATE_PIPELINE}/${id}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "PUT", JSON.stringify({ data: data }));
  });

  it("should call FetchApi with correct parameters when getting data by ID", () => {
    const id = 456;
    PipelineApi.getDataById(id);

    const expectedUrl = `${CREATE_PIPELINE}/${id}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when getting show data by ID", () => {
    const id = 789;
    PipelineApi.getDataById(id);

    const expectedUrl = `${GET_PIPELINE}/${id}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when updating lead details by ID", () => {

    const id = 1011;
    PipelineApi.updateLeadDetialsById(data, id);

    const expectedUrl = `${CREATE_PIPELINE}/${id}/lead_update`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "PUT", data, false);
  });

  it("should call FetchApi with correct parameters when creating contact detail", () => {

    PipelineApi.createContactDetail(data);

    expect(FetchApi).toHaveBeenCalledWith(
      PIPELINE_ALL_DETAILS,
      "POST",
      JSON.stringify({ data: data })
    );
  });

  it("should call FetchApi with correct parameters when getting pipeline view", () => {
    const view = "some_view";
    const page = 1;
    const pageSize = 10;
    PipelineApi.piplineView(view, page, pageSize);

    const expectedUrl = `${CREATE_PIPELINE}?list_view=${view}&page=${page}&per_page=${pageSize}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when mass deleting data", () => {

    PipelineApi.massDelete(data);

    const expectedUrl = `${CREATE_PIPELINE}/pipeline_mass_delete`;
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "DELETE",
      JSON.stringify(data)
    );
  });

  it("should call FetchApi with correct parameters when transferring pipeline", () => {

    PipelineApi.pipelineTransfer(data);

    expect(FetchApi).toHaveBeenCalledWith(
      PIPELINE_TRANSFER,
      "PUT",
      JSON.stringify(data)
    );
  });

  it("should call FetchApi with correct parameters when mass converting data", () => {

    PipelineApi.massConvert(data);

    const expectedUrl = `${CREATE_PIPELINE}/pipeline_mass_convert`;
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "POST",
      JSON.stringify(data)
    );
  });

  it("should call FetchApi with correct parameters when getting dropdown filter data without data parameter and check is true", () => {
    const val = "some_stage";
    const data = true;
    const page = 1;
    const pageSize = 10;
    const check = false;
    const header = 'test123'

    PipelineApi.getDropdownFilter(val, data, page, pageSize, check);
    const expectedUrl = `/pipelines?list_view=true&stage=some_stage&page=1&per_page=10`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when getting dropdown filter data with data parameter and check is false", () => {
    const val = "another_stage";
    const page = 2;
    const pageSize = 20;
    const check = false;
    PipelineApi.getDropdownFilter(val, data, page, pageSize, check);
    const expectedUrl = `/pipelines?list_view=true&stage=another_stage&page=2&per_page=20`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when list_view is falsy and header and check are truthy", () => {
    const data = "abc"
    const check = false;
    const list_view = false;
    const dropdownCheck = false;
    const header = 'test'
    const page = 2;
    const pageSize = 20;
    PipelineApi.getPipelineSearch(data, check, list_view, page, pageSize, dropdownCheck);
    const expectedUrl = `/pipelines?search[pipeline]=${data}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when list_view is falsy and header and check are falsy", () => {
    const check = false;
    const list_view = null;
    const dropdownCheck = false;
    PipelineApi.getPipelineSearch(data, check, list_view, page, pageSize, dropdownCheck);
    const expectedUrl = `${GET_PIPELINE}?search[pipeline]=${data}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when list_view is truthy and all flags are truthy", () => {
    PipelineApi.getPipelineSearch(data, check, list_view, page, pageSize, dropdownCheck);
    const expectedUrl = '/pipelines?list_view=true&search[pipeline]=search_data&pipeline_score_id=123&stage=another_stage&page=3&per_page=30'
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it('should call FetchApi with the correct URL for create pipeline stage', async () => {
    const data = { data: 'test_data' };
    FetchApi.mockResolvedValueOnce(createResult);
    const response = await PipelineApi.createPipelineStage(data);
    expect(FetchApi).toHaveBeenCalledWith(PIPELINE_STAGE, 'POST', JSON.stringify(data), "application/json", false, false);
    expect(response).toEqual(createResult)
  });

  it('should call FetchApi with the correct URL for edit pipeline stage', async () => {
    const data = { data: 'test_data' };
    const id = 6;
    FetchApi.mockResolvedValueOnce(createResult);
    const response = await PipelineApi.editPipelineStage(id, data);
    expect(FetchApi).toHaveBeenCalledWith(`${PIPELINE_STAGE}/${id}`, 'PUT', JSON.stringify(data), "application/json", false, false);
    expect(response).toEqual(createResult)
  });

  it('should call FetchApi with the correct URL for delete pipeline stage', async () => {
    const id = 6;
    FetchApi.mockResolvedValueOnce(createResult);
    const response = await PipelineApi.deletePipelineStage(id);
    expect(FetchApi).toHaveBeenCalledWith(`${PIPELINE_STAGE}/${id}`, "DELETE");
    expect(response).toEqual(createResult)
  });

});
