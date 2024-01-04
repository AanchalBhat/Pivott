import PageNotFoundImage from "../../assets/404-page.svg";
import "./notFound.css";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/login");
  };
  return (
    <div className="ma-404container">
      <div className="ma-404-box">
        <h1 data-testid="not-found">Whoops!</h1>
        <img src={PageNotFoundImage} alt="404" className="img-fluid" />
        <div className="ma-404Content-box">
          <h2>Page Not Found</h2>
          <p>
            The page you are looking for might not exists or is not available
            right now. Please check the URL mistakes and try again.
          </p>
          <a onClick={handleNavigate}>Back to Home</a>
        </div>
      </div>
    </div>
  );
};
export default PageNotFound;
