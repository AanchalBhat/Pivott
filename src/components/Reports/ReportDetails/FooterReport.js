import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import "../../../styles/global/common.css";
import { ButtonLoader } from "../../../pages/common/ButtonLoader";

const useStyles = makeStyles({
  buttonStyles: {
      background: `linear-gradient(180deg, #00bda4 0%, #00a4bc 100%)`,
      borderRadius: "4px",
      width: "100%",
      minWidth: "150px",
      maxWidth: "150px",
      height: "42px",
      color: "#FFF",
      fontWeight: 600,
      lineHeight: "24px",
      fontFamily: "Poppins",
      boxShadow: "none !important",
      cursor: "pointer",
  }
})

export default function FooterReport({
  phoneErrorMessage,
  handleSubmit,
  setActiveStep,
  setDiscard_open,
  setCreateModuleFields,
  loading
}) {
  const classes = useStyles();
  const params = useParams();
  const reportId = params?.id;

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setCreateModuleFields({});
  };

  return (
    <>
      <div className="createlead-buttons ma-login-btn">
        <ButtonLoader
          loading={loading}
          classStyle={classes.buttonStyles}
          btnType={"submit"}
          handleClick={() => handleSubmit()}
          testid={"submit"}
          title={reportId ? "UPDATE" : "CREATE"}
          id={"submit-btn"}
        />
        <Button
          data-testid="back"
          className="cancelbtn"
          type="button"
          variant="outlined"
          onClick={() => handleBack()}
        >
          BACK
        </Button>
        <Button
          className="cancelbtn"
          type="button"
          data-testid="cancel"
          variant="outlined"
          onClick={() => setDiscard_open(true)}
        >
          CANCEL
        </Button>
      </div>
    </>
  );
}
