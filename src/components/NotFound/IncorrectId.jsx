import panaImage from "../../assets/images/pana.png";
import "./notFound.css";
import { useOutletContext } from "react-router-dom";

const IncorrectId = () => {
  const [
    open,
  ] = useOutletContext();
  return (
    <div className="ma-404container">
      <div className={open ? "ma-invalid-box" : "ma-404-box"}>
        <img src={panaImage} alt="incorect-pic" />
        <div className={"ma-404Content-box"}>
          <h3>This item is either not within your view or does not exist.</h3>
          <p>
            If you believe that you should have access to this item, we kindly
            request that you contact company's administrator for further
            assistance.
          </p>
        </div>
      </div>
    </div>
  );
};
export default IncorrectId;
