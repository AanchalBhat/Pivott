import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Button } from "@mui/material";
import "./Template.css";
import { DataContext } from "../../context";
import { useContext } from "react";

const SelectTemplateCard = ({ props, handleSelectThis }) => {
  const { attributes, id } = props;
  const navigate = useNavigate();
  const { setToPreviewData } = useContext(DataContext);
  const handlePreview = () => {
    setToPreviewData((prev) => ({
      ...prev,
      content_html: attributes.content_html,
      content_json: attributes.content_json,
    }));
    navigate(`/campaign/preview`, {
      state: {
        navigateFrom: "selectCardPreview",
      },
    });
  };
  return (
    <>
      <div className="content">
        <div>
          <div className="content-overlay"></div>
            <div className="content-image">
              <img
                src={attributes?.preview_image?.url}
                alt="template-preview"
              />
            </div>

          <div className="content-details fadeIn-bottom fadeIn-left">
            <div
              onClick={() => handlePreview()}
              className="campaign-preview-btn"
            >
              <span>
                <VisibilityIcon />{" "}
              </span>
              <p className="mt-0">Preview</p>
            </div>
            <Button
              variant="contained"
              className="campaign-selectThis-btn"
              onClick={() => handleSelectThis()}
            >
              Select This
            </Button>
          </div>
        </div>
        <div className="campaign-card-title">
          {attributes.name && attributes.name.length > 20
            ? attributes.name.substring(0, 19) + "..."
            : attributes.name}
        </div>
      </div>
    </>
  );
};

export default SelectTemplateCard;
