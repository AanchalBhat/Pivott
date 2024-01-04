import { ReportsApi } from "../../../apis/ReportsApi";
import { FetchApi } from "../../../apis/fetchApi";

jest.mock("../../../apis/fetchApi", () => ({
  FetchApi: jest.fn(),
}));

describe("ReportsApi Tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should test getAll function", () => {
    const page = 1;
    const pageSize = 10;
    ReportsApi.getAll(page, pageSize);
    const expectedUrl = "/reports/?page=1&per_page=10";
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should test getReportsFilter function", () => {
    const data = { data: "test-data" };
    const compny_id = "company_id";
    const id = "folder_id";
    const page = 1;
    const pageSize = 10;

    ReportsApi.getReportsFilter(data, compny_id, id, page, pageSize);
    const expectedUrl = "/report_folders/folder_id?page=1&per_page=10";
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "GET",
      false,
      "application/json",
      false,
      false
    );
  });

  it("should test getReportSearch function", () => {
    const data = "example_data";
    const page = 1;
    const pageSize = 10;
    const check = true;

    ReportsApi.getReportSearch(data, page, pageSize, check);
    const expectedUrl =
      "/reports?report_folder_id=folder_id&report=example_data&page=1&per_page=10";
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });
  it("should test cloneReport function", () => {
    const data = { data: "test-data" };
    ReportsApi.cloneReport(data);
    const expectedUrl = "/reports/clone_report";
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "POST",
      JSON.stringify({ data: data })
    );
  });

  it("should test exportsReport function", () => {
    const data = { data: "test-data" };

    ReportsApi.exportsReport(data);
    const expectedUrl = "/reports/export_reports?per_page=1000";
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "POST",
      JSON.stringify({ data: data }),
      "application/json",
      true
    );
  });

  it("should test moveToFolder function", () => {
    const data = { data: "test-data" };
    ReportsApi.moveToFolder(data);
    const expectedUrl = "/reports/move_to_folder";
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "PUT",
      JSON.stringify({ data: data })
    );
  });

  it("should test massDelete function", () => {
    const data = { data: "test-data" };
    ReportsApi.massDelete(data);
    const expectedUrl = "/reports/report_mass_delete";
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "DELETE",
      JSON.stringify({ data: data })
    );
  });

  it("should test isReportExists function", () => {
    const data = { data: "test-data" };

    ReportsApi.isReportExists(data);
    const expectedUrl = "/reports/is_report_exists";
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "POST",
      JSON.stringify({ data: data })
    );
  });

  it("should test getOverviewTableSearch function", () => {
    const id = "123";
    const module = "module";
    const val = "value";
    const page = 1;
    const pageSize = 20;

    ReportsApi.getOverviewTableSearch(id, module, val, page, pageSize);
    const expectedUrl = "/reports/123?module=value&page=1&per_page=20";
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should test getOverviewData function", () => {
    const id = "123";
    const page = 1;
    const pageSize = 20;
    ReportsApi.getOverviewData(id, page, pageSize);
    const expectedUrl = "/reports/123?page=1&per_page=20";
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should test create function", () => {
    const data = { data: "test-data" };
    ReportsApi.create(data);
    const expectedUrl = "/reports";
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "POST",
      JSON.stringify({ data: data })
    );
  });

  it("should test update report function", () => {
    const data = { data: "test-data" };
    let id = 1;
    ReportsApi.update(data, id);
    const expectedUrl = `/reports/${id}`;
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "PUT",
      JSON.stringify({ data: data })
    );
  });

  it("should test getFolder function", () => {
    const company_id = "123";
    const val = "value";
    const page = 1;
    const pageSize = 20;
    ReportsApi.getFolder(company_id, val, page, pageSize);
    const expectedUrl =
      "/report_folders?company_id=123&page=1&per_page=20&name=value";
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "GET",
      false,
      "application/json",
      false,
      false
    );
  });

  it("should test updateNFavorite function", () => {
    const id = "123";
    const data = { data: "test-data" };
    ReportsApi.updateNFavorite(id, data);
    const expectedUrl = "/reports/123";
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "PUT",
      JSON.stringify(data)
    );
  });

  it("should test deleteReport function", () => {
    const id = "123";
    ReportsApi.deleteReport(id);
    const expectedUrl = "/reports/123";
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "DELETE");
  });

  it("should test scheduleReport function", () => {
    const id = "123";
    const data = { data: "test-data" };
    ReportsApi.scheduleReport(id, data);
    const expectedUrl = "/reports/schedule_reports?per_page=1000";
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "POST",
      JSON.stringify(data)
    );
  });

  it("should test createFolder function", () => {
    const data = { data: "test-data" };
    ReportsApi.createFolder(data);
    const expectedUrl = "/report_folders";
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "POST",
      JSON.stringify({ data: data })
    );
  });

  it('should test getReportsFilter function when data.favorite is provided', () => {
    const data = { favorite: 'favorite' };
    const company_id = null;
    const id = '123';
    const page = 1;
    const pageSize = 20;

    ReportsApi.getReportsFilter(data, company_id, id, page, pageSize);
    const expectedUrl = '/reports/get_reports?favorite=favorite&page=1&per_page=20';
    
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'GET');
  });
  it('should test getReportsFilter function when data.recent is provided', () => {
    const data = { recent: 'recent' };
    const company_id = null;
    const id = '123';
    const page = 1;
    const pageSize = 20;

    ReportsApi.getReportsFilter(data, company_id, id, page, pageSize);
    const expectedUrl = '/reports/get_reports?recent=recent&page=1&per_page=20';
    
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'GET');
  });

  it('should test getReportsFilter function when data.scheduled is provided', () => {
    const data = { scheduled: 'scheduled' };
    const company_id = null;
    const id = '123';
    const page = 1;
    const pageSize = 20;

    ReportsApi.getReportsFilter(data, company_id, id, page, pageSize);

    const expectedUrl = '/reports/get_reports?scheduled=scheduled&page=1&per_page=20';
    
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'GET');
  });

  it('should test getReportsFilter function when data.all_report is true', () => {
    const data = { all_report: true };
    const company_id = null;
    const id = '123';
    const page = 1;
    const pageSize = 20;

    ReportsApi.getReportsFilter(data, company_id, id, page, pageSize);
    const expectedUrl = '/reports?page=1&per_page=20';
    
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'GET');
  });
  it('should test getReportsFilter function when data.shared is true', () => {
    const data = { shared: true };
    const company_id = null;
    const id = '123';
    const page = 1;
    const pageSize = 20;

    ReportsApi.getReportsFilter(data, company_id, id, page, pageSize);
    const expectedUrl = '/report_folders/shared_folders?page=1&per_page=20';
    
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, 'GET', false, 'application/json', false, false);
  });
});
