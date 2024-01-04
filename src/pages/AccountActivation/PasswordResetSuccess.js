//mui
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckImage } from "../../assets/index";
import logoBlue from "../../assets/logo_blue.svg";
import "../Login/Login.css";

const paperStyle = {};
const PasswordResetSuccess = () => {
  const navigate = useNavigate();
  const get_email = localStorage.getItem("user_email")
    ? JSON.parse(localStorage.getItem("user_email"))
    : "";
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div className="ma-main-forgot">
      <Box>
        <Grid container>
          <Grid item xs={12} md={12}>
            <div className="ma-forgot-pass">
              <img className="ma-logo" src={logoBlue} alt="logo" />
            </div>
          </Grid>
        </Grid>
      </Box>
      <Box className="ma-topBottom-spacer">
        <Grid container>
          <Grid item xs={12} md={6} lg={4} sx={{ margin: "auto" }}>
            <div
              className="ma-verify-box p-5"
              elevation={10}
              style={paperStyle}
            >
              <div className="success_box">
                <img src={CheckImage} alt="mailLogo" />{" "}
              </div>
              <h3 data-testid="success">Successfull</h3>
              <p>
                Your password for{" "}
                <span className="success_mail_color">{get_email}</span> has been
                updated successfully
              </p>
              <div className="ma-verify-main ma-login-btn pt-4">
                <Button
                  data-testid="success-btn"
                  className="loginBtn w-75"
                  type="submit"
                  variant="contained"
                  color="info"
                  onClick={() => {
                    localStorage.removeItem("token");
                    if (searchParams) {
                      searchParams.delete("filter");
                      setSearchParams(searchParams);
                    }
                    navigate("/login");
                  }}
                >
                  <span>Login</span>
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default PasswordResetSuccess;
