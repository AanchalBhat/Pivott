import React, { useState } from "react";
import { GoogleLoginAPI, MicrosoftLoginAPI } from "../../apis/LoginApi";
import googleImage from "../../assets/google_logo.svg";
import microsoftImage from "../../assets/microsoft_logo.svg";
import "./Login.css";
import { ButtonLoader } from "../common/ButtonLoader";
import { getMethodError } from "../../constants/errorMessages";
import { Toaster } from "../common/Toaster";

const SocialLogin = ({ title }) => {
  const [googleLoginLoader, setGoogleLoginLoader] = useState(false);
  const [microsoftLoginLoader, setMicrosoftLoginLoader] = useState(false);
  const url = `${window.location.origin}/auth-callback`;
  const handleGoogleLogin = () => {
    setGoogleLoginLoader(true);
    GoogleLoginAPI.getGoogleUri(url)
      .then((res) => {
        if (res.url) {
          localStorage.setItem("social_title", title)
          window.location.href = res.url;
        }
        setGoogleLoginLoader(false);
      })
      .catch((error) => {
        setGoogleLoginLoader(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };
  const handleMicrosoftLogin = () => {
    setMicrosoftLoginLoader(true);
    MicrosoftLoginAPI.getMicrosoftUri(url)
      .then((res) => {
        if (res.url) {
          localStorage.setItem("social_title", title)
          window.location.href = res.url;
        }
        setMicrosoftLoginLoader(false);
      })
      .catch((error) => {
        setMicrosoftLoginLoader(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };
  return (
    <>
      <div className="ma-socialBtn-main">
        <ButtonLoader
          disabled={googleLoginLoader}
          classStyle={""}
          btnType={"submit"}
          handleClick={() => handleGoogleLogin()}
          testid={"google-btn"}
          title={`${title} with Google`}
          variant={"outlined"}
          fullWidth={true}
          style={{
            backgroundColor: "#F1F1F4",
            color: "#000",
            border: "1px solid #D1D1DA",
          }}
          img={<img src={googleImage} />}
        />
        <ButtonLoader
          disabled={microsoftLoginLoader}
          classStyle={""}
          btnType={"submit"}
          handleClick={() => handleMicrosoftLogin()}
          testid={"microsoft-btn"}
          title={`${title} with Microsoft`}
          variant={"outlined"}
          fullWidth={true}
          style={{
            backgroundColor: "#F1F1F4",
            color: "#000",
            border: "1px solid #D1D1DA",
          }}
          img={<img src={microsoftImage} />}
        />
      </div>
    </>
  );
};
export default SocialLogin;
