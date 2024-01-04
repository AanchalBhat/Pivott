import "./Template.css";

const AddTemplateCard = ({ image, title }) => {
    return (
        <div className="add-content">
            <div className="add-contentImage-box">
                <img className="add-content-image" src={image} alt="add-template" />
            </div>
            <div className="campaign-card-title">{title}</div>
        </div>
    )
}

export default AddTemplateCard;