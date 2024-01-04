import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import "./Template.css";
import { useContext } from "react";
import { DataContext } from "../../context";

const EditTemplateCard = ({ content, updateLocalStorage }) => {
    const navigate = useNavigate();
    const { toPreviewData } = useContext(DataContext);

    const handlePreview = () => {
        updateLocalStorage();
        navigate(`/campaign/preview`);
    }   
    return (
        <div className="content">
            <div>
                <div className="content-overlay"></div>
                <div className="content-image">
                    <img src={content ? content : (toPreviewData?.image)} alt="template-preview" />
                </div>
                <div className="content-details fadeIn-bottom fadeIn-left">
                    <div onClick={() => handlePreview()} className="campaign-preview-btn">
                        <span><VisibilityIcon /> </span><p className="mt-0">Preview</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditTemplateCard;