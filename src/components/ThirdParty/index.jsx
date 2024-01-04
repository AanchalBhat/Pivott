import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { userApi } from "../../apis/userApi";
import { Toaster } from "../../pages/common/Toaster";
import { DataContext } from "../../context";
import "../../styles/global/common.css";
import { getMethodError } from "../../constants/errorMessages";

const ThirdParty = () => {
  const { setIsLocation } = useContext(DataContext);
  const [messagePopup, setMessagePopup] = useState();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");
  const app = localStorage.getItem("thirdparty_app");
  const webexMeet = () => {
    userApi
      .webexCodeLogin(code, state)

      .then((json) => {
        if (json?.messages?.webex_access === true) {
          setMessagePopup(
            `${app} login sucessfully please continue to create meeting`
          );
          let storedObject = JSON.parse(localStorage.getItem("user_info"));
          storedObject.webex_access = true;
          let updatedObject = JSON.stringify(storedObject);
          localStorage.setItem("user_info", updatedObject);
          setIsLocation(true);
        } else {
          setIsLocation(false);
          setMessagePopup(json?.error?.webex || json?.errors?.webex);
        }
      })
      .catch((error) => {
        localStorage.setItem("thirdparty_app", "");
        Toaster.TOAST(getMethodError(error), "error");
      });
  };
  const skypeMeet = () => {
    userApi
      .skypeCodeLogin(code, state)

      .then((json) => {
        if (json?.messages?.skype_access === true) {
          setMessagePopup(
            `${app} login sucessfull please continue to create meeting`
          );
          let storedObject = JSON.parse(localStorage.getItem("user_info"));
          storedObject.skype_access = true;
          let updatedObject = JSON.stringify(storedObject);
          localStorage.setItem("user_info", updatedObject);
          setIsLocation(true);
        } else {
          setIsLocation(false);
          setMessagePopup(json?.error?.skype || json?.errors?.skype);
        }
      })
      .catch((error) => {
        localStorage.setItem("thirdparty_app", "");
        // Toaster.TOAST(error?.response?.data?.error || error, "error");
        Toaster.TOAST(getMethodError(error), "error");
      });
  };
  const googleMeet = () => {
    userApi
      .googleCodeLogin(code)

      .then((json) => {
        if (json?.messages?.google_meet_access === true) {
          let appName = app.split("_").join(" ");
          setMessagePopup(
            `${appName} login sucessfully please continue to create meeting`
          );
          let storedObject = JSON.parse(localStorage.getItem("user_info"));
          storedObject.google_meet_access = true;
          let updatedObject = JSON.stringify(storedObject);
          localStorage.setItem("user_info", updatedObject);
          setIsLocation(true);
        } else {
          setIsLocation(false);
          setMessagePopup(json?.error?.googlemeet || json?.errors?.googlemeet);
        }
      })
      .catch((error) => {
        localStorage.setItem("thirdparty_app", "");
        // Toaster.TOAST(error?.response?.data?.error || error, "error");
        Toaster.TOAST(getMethodError(error), "error");
      });
  };
  useEffect(() => {
    if (state && code && app === "webex") {
      webexMeet();
    } else if (code && app === "skype") {
      skypeMeet();
    } else if (code && app === "google_meet") {
      googleMeet();
    } else if (error) {
      setMessagePopup(error);
    }
  }, []);

  const handleclick = () => {
    window.localStorage.setItem("loggedIn", true);
    window.close();
  };
  return (
    <>
      <div
        className="align-items-center"
        style={{
          backgroundColor: "#fff",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className="ma-createMain-form">
          {messagePopup && (
            <>
              <h3 className="mt-2" style={{ color: "#37AFA7" }}>
                {messagePopup}
              </h3>
              <button
                type="button"
                className="createlead-buttons__saveButton"
                style={{ border: "1px solid #FFF" }}
                onClick={handleclick}
              >
                OK
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default ThirdParty;
