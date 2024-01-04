import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Menu, MenuItem } from "@mui/material";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import "./Template.css";
import { templateApi } from "../../apis/templateApi";
import { Toaster } from "../common/Toaster";
import { deleteMethodError } from "../../constants/errorMessages";
import { DataContext } from "../../context";
import { DeleteCampaign } from "../../components/Email Campaigns/Common/DeleteCampaign";

const TemplateCard = ({ props, getApiCall, setPage }) => {
  const { attributes, id } = props;
  const navigate = useNavigate();
  const [disable, setDisable] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const { setToPreviewData } = useContext(DataContext);

  const handleClick = async (popupState, callDelete) => {
    await popupState.close();
    if (callDelete) {
      if (disable !== "disableDelete") setOpenDelete(true);
    } else {
      if (disable !== "disableDuplicate") handleTemplateDuplicate();
    }
  };

  const handleTemplateDuplicate = () => {
    setDisable("disableDuplicate");
    let data = {
      email_campaign_template_id: attributes.id,
    };
    templateApi
      .duplicateTemplate(data)
      .then((response) => {
        if (response) {
          Toaster.TOAST(response?.message, "success");
          setPage(1);
          getApiCall(1);
        }
        setDisable("");
      })
      .catch((error) => {
        setDisable("");
        Toaster.TOAST(deleteMethodError(error), "error");
      });
  };

  const handlePreview = () => {
    setToPreviewData((prev) => ({
      ...prev,
      content_html: attributes.content_html,
      content_json: attributes.content_json,
    }));
    navigate(`/campaign/preview`);
  };

  return (
    <>
      <div className="content">
        <div>
          <div className="content-overlay"></div>
          <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
              <>
                <span {...bindTrigger(popupState)} className="dot-more-icon">
                  <MoreHorizIcon />
                </span>

                <div>
                  <Menu
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: 0,
                      horizontal: 100,
                    }}
                  >
                    <MenuItem
                      disable={disable === "disableDuplicate"}
                      onClick={() => handleClick(popupState, false)}
                    >
                      Duplicate
                    </MenuItem>
                    <MenuItem
                      onClick={() =>
                        navigate(`/campaign/edit-design/${id}`, {
                          state: { from: "templateEdit" },
                        })
                      }
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      disable={disable === "disableDelete"}
                      onClick={() => handleClick(popupState, true)}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </div>
              </>
            )}
          </PopupState>
          <div className="content-image">
            <img src={attributes?.preview_image?.url} alt="template-preview" />
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
          </div>
        </div>
        <div className="campaign-card-title">
          {attributes.name && attributes.name.length > 19
            ? attributes.name.substring(0, 18) + "..."
            : attributes.name}
        </div>
      </div>
      <DeleteCampaign
        title={"template"}
        content={"template"}
        openDelete={openDelete}
        handleToCloseLT={() => setOpenDelete(false)}
        deleteId={attributes.id}
        getData={getApiCall}
        setRowId={() => { }}
        campaignId={() => { }}
        setCampaignId={() => { }}
        templateDelete={true}
        setPage={setPage}
      />
    </>
  );
};

export default TemplateCard;
