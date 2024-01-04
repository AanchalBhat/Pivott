import { RolesApi } from "../../../apis/RolesApi";
import { FetchApi } from "../../../apis/fetchApi";

jest.mock("../../../apis/fetchApi", () => ({
  FetchApi: jest.fn(),
}));

describe("RolesApi Tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should test toggleDeactivateUser function when value is "deactivate_user"', () => {
    const body = { userId: "123" };
    const value = "deactivate_user";
    RolesApi.toggleDeactivateUser(body, value);
    const expectedUrl = "/users/deactivate_users";
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "PUT", body);
  });

  it('should test toggleDeactivateUser function when value is "activate_user"', () => {
    const body = { userId: "123" };
    const value = "activate_user";
    RolesApi.toggleDeactivateUser(body, value);
    const expectedUrl = "/users/activate_users";
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "PUT", body);
  });

  it("should test getPermission function", () => {
    const userId = "123";
    RolesApi.getPermission(userId);
    const expectedUrl = "/permissions/123";
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should test updatePermission function", () => {
    const userId = "123";
    const data = { permission: "read" };
    RolesApi.updatePermission(userId, data);
    const expectedUrl = "/permissions/123";
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "PUT",
      JSON.stringify(data)
    );
  });

  it("get parent nodes", () => {
    const page = 1;
    const pageSize = 10;
    RolesApi.getParents(page, pageSize);
    const expectedUrl = `/user_manager_hierarchy?page=${page}&per_page=${pageSize}`;
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "GET",
    );
  });

  it("get parent nodes", () => {
    const userId = "123";
    RolesApi.getChilds(userId);
    const expectedUrl = `/user_manager_hierarchy/show_children?user_id=${userId}`;
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "GET",
    );
  });
});
