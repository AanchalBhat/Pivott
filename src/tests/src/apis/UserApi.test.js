import { FetchApi } from "../../../apis/fetchApi";
import { userApi } from "../../../apis/userApi";
import {
  GET_GOOGLE,
  GET_SKYPE,
  GET_USER,
  GET_WEBEX,
  GOOGLE_CODE_LOGIN,
  INVITE_USERS,
  SKYPE_CODE_LOGIN,
  WEBEX_CODE_LOGIN,
  ROLE,
} from "../../../constants/routes";

jest.mock("../../../apis/fetchApi");

describe("userApi", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const page = 5;
  const pageSize = 50;
  const check = true;

  it("should call FetchApi with correct parameters when getting users", () => {
    const val = "search_value";
    userApi.getUsers(val, page, pageSize);

    const expectedUrl = `${GET_USER}?page=${page}&per_page=${pageSize}&search[user]=${val}`;
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "GET",
      false,
      "application/json",
      false,
      false
    );
  });

  it("should call FetchApi with correct parameters when getting manage users with active_users filter", () => {
    const val = { active_users: "true" };

    userApi.getManageUsers(val, page, pageSize, check);

    const expectedUrl = `${GET_USER}/?search[active_users]=${val.active_users}&page=${page}&per_page=${pageSize}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when getting manage users with is_invited filter", () => {
    const val = { is_invited: "true" };

    userApi.getManageUsers(val, page, pageSize, check);

    const expectedUrl = `${GET_USER}?search[is_invited]=${val.is_invited}&page=${page}&per_page=${pageSize}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when getting a user by ID", () => {
    const id = 123;

    userApi.getUser(id);

    const expectedUrl = `${GET_USER}/${id}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when updating a user", () => {
    const data = {
      /* Your data object */
    };
    const id = 456;

    userApi.update(data, id);

    const expectedUrl = `${GET_USER}/${id}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "PUT", data, false);
  });

  it("should call FetchApi with correct parameters when getting roles", () => {
    userApi.getRole();

    const expectedUrl = `${ROLE}`;
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "GET",
      false,
      "application/json",
      false,
      false
    );
  });

  it("should call FetchApi with correct parameters when getting Webex URL", () => {
    const expectedRedirectUrl = `${window.location.origin}/third-party`;

    userApi.getWebexUrl();

    const expectedUrl = `${GET_WEBEX}?redirect_url=${expectedRedirectUrl}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when performing Webex code login", () => {
    const code = "webex_code";
    const state = "webex_state";
    const expectedRedirectUrl = `${window.location.origin}/third-party`;

    userApi.webexCodeLogin(code, state);

    const expectedUrl = `${WEBEX_CODE_LOGIN}?code=${code}&state=${state}&redirect_url=${expectedRedirectUrl}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when getting Skype URL", () => {
    const expectedRedirectUrl = `${window.location.origin}/third-party`;

    userApi.getSkypeUrl();

    const expectedUrl = `${GET_SKYPE}?redirect_url=${expectedRedirectUrl}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when performing Skype code login", () => {
    const code = "skype_code";
    const expectedRedirectUrl = `${window.location.origin}/third-party`;

    userApi.skypeCodeLogin(code);

    const expectedUrl = `${SKYPE_CODE_LOGIN}?code=${code}&redirect_url=${expectedRedirectUrl}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when getting Google URL", () => {
    const expectedRedirectUrl = `${window.location.origin}/third-party`;

    userApi.getGoogleUrl();

    const expectedUrl = `${GET_GOOGLE}?redirect_url=${expectedRedirectUrl}&url_type=meeting`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when performing Google code login", () => {
    const code = "google_code";
    const expectedRedirectUrl = `${window.location.origin}/third-party`;

    userApi.googleCodeLogin(code);

    const expectedUrl = `${GOOGLE_CODE_LOGIN}?code=${code}&redirect_url=${expectedRedirectUrl}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when inviting a user", () => {
    const data = { data: "test-data" };

    userApi.inviteUser(data);

    expect(FetchApi).toHaveBeenCalledWith(
      INVITE_USERS,
      "POST",
      JSON.stringify({ data: data })
    );
  });

  it("should call FetchApi with correct parameters when getting manage users with active_users filter", () => {
    const val = { active_users: "true" };

    userApi.getManageUsers(val, page, pageSize, check);

    const expectedUrl = `${GET_USER}/?search[active_users]=${val.active_users}&page=${page}&per_page=${pageSize}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when getting manage users with is_invited filter", () => {
    const val = { is_invited: "true" };
    userApi.getManageUsers(val, page, pageSize, check);

    const expectedUrl = `${GET_USER}?search[is_invited]=${val.is_invited}&page=${page}&per_page=${pageSize}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when getting manage users with deleted_user filter", () => {
    const val = { deleted_user: "true" };
    userApi.getManageUsers(val, page, pageSize, check);

    const expectedUrl = `${GET_USER}?search[is_deleted]=${val.deleted_user}&page=${page}&per_page=${pageSize}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });

  it("should call FetchApi with correct parameters when getting manage users with srch and check", () => {
    const val = { srch: "search_query" };

    const header = "&search[is_deleted]=true";

    userApi.getManageUsers(val, page, pageSize, check);

    const expectedUrl = `${GET_USER}?search[user]=${val.srch}${header}&page=${page}&per_page=${pageSize}`;
    expect(FetchApi).toHaveBeenCalledWith(expectedUrl, "GET");
  });
});
