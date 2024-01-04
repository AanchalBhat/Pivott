import { FetchApi } from "../../../apis/fetchApi";
import { NotificationsApi } from "../../../apis/notificationsApi";
import { GET_NOTIFICATION, READ_NOTIFICATION } from "../../../constants/routes";

jest.mock("../../../apis/fetchApi");

describe("NotificationsApi", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call FetchApi with correct parameters when getting data", () => {
    NotificationsApi.getData();
    GET_NOTIFICATION;
    const expectedUrl = `${GET_NOTIFICATION}`;
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "GET",
      false,
      "application/json",
      false,
      false
    );
  });

  it("should call FetchApi with correct parameters when marking a notification as read", () => {
    const notificationId = 123;

    NotificationsApi.markAsRead(notificationId);

    const expectedUrl = `${READ_NOTIFICATION}`;
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "PUT",
      JSON.stringify({ id: notificationId }),
      "application/json",
      false,
      false
    );
  });

  it("should call FetchApi with correct parameters when marking all notifications as read", () => {
    NotificationsApi.markAll();
    const expectedUrl = `${READ_NOTIFICATION}`;
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "PUT",
      false,
      "application/json",
      false,
      false
    );
  });

  it("should call FetchApi with correct parameters when getting filtered notifications", () => {
    const filterValue = "some_filter";

    NotificationsApi.getAllFilter(filterValue);

    const expectedUrl = `${GET_NOTIFICATION}?filter_by=${filterValue}`;
    expect(FetchApi).toHaveBeenCalledWith(
      expectedUrl,
      "GET",
      false,
      "application/json",
      false,
      false
    );
  });
});
