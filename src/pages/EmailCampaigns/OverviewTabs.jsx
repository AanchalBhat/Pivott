import { useEffect, useState, useContext } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import OverviewTab from "../common/OverviewTab";
import Actions from "../common/Actions";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  CAMPAIGN_ARCHIVE,
  CAMPAIGN_EMAIL,
  EMAIL_CANCELLED,
  EMAIL_SCHEDULED,
  EMAIL_SENDING,
  EMAIL_SENT,
} from "../../utils/constants";
import { Toaster } from "../common/Toaster";
import { campaignApi } from "../../apis/campaignApi";
import { ARCHIVE_CAMPAIGNS, CANCEL_ARCHIVE } from "../../constants/routes";
import { restMethodError } from "../../constants/errorMessages";
import { DeleteCampaign } from "../../components/Email Campaigns/Common/DeleteCampaign";
import RenameCampaign from "../../components/Email Campaigns/Common/RenameCampagin";
import "../../styles/custom/EmailCampaigns/List.css";
import { DataContext } from "../../context";
import AllLeads from "../common/DropdownFilter";

const OverviewTabs = ({ showTabs, ...props }) => {
  const location = useLocation();
  const { overviewHeaderData, allListOptions } = useContext(DataContext);
  const status = location.state?.campaignStatus;
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  const navigate = useNavigate();
  const params = useParams();
  const [actionData, setActionData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [openRename, setOpenRename] = useState(false);
  const [rowId, setRowId] = useState("");
  const [campaginName, setCampaginName] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [newStatus, setNewStatus] = useState(status);
  const [searchParams] = useSearchParams();
  const id = params.id;
  const actionId = parseInt(id);

  const route_name = location.state?.name;

  const isViewingDraft = !!props?.overviewData;
  useEffect(() => {
    if (props?.overviewData?.status) {
      setNewStatus(props?.overviewData?.status);
    }
  }, [props?.overviewData]);

  const navigationData = [
    {
      handleClick: () => {
        if (searchParams.get("filter")) {
          navigate(
            `/campaign/overview/${id}?filter=${searchParams.get("filter")}&page=${searchParams.get("page")}`,
            { state: { name: route_name, campaignStatus: newStatus } }
          );
        } else {
          navigate(`/campaign/overview/${id}`, {
            state: { name: route_name, campaignStatus: newStatus },
          });
        }
      },
      title: "Overview",
      listItemIconTxt: "overview",
    },
    {
      handleClick: () => {
        if (searchParams.get("filter")) {
          navigate(
            `/campaign/overview-list/${id}?filter=${searchParams.get(
              "filter"
            )}&page=${searchParams.get("page")}`,
            {
              state: {
                value: props?.overviewData,
                name: route_name,
                campaignStatus: newStatus,
              },
            }
          );
        } else {
          navigate(`/campaign/overview-list/${id}`, {
            state: {
              value: props?.overviewData,
              name: route_name,
              campaignStatus: newStatus,
            },
          });
        }
      },
      title: "Recipients List",
      listItemIconTxt: "overview-list",
    },
  ];

  const backNavigation = () => {
    navigate("/campaign/lists");
    if (route_name === CAMPAIGN_EMAIL) {
      if (searchParams.get("filter")) {
        navigate(`/campaign/lists?filter=${searchParams.get("filter")}&page=${searchParams.get("page")}`);
      } else {
        navigate("/campaign/lists");
      }
    } else if (route_name === CAMPAIGN_ARCHIVE) {
      if (searchParams.get("filter")) {
        navigate(`/campaign/archive?filter=${searchParams.get("filter")}&page=${searchParams.get("page")}`);
      } else {
        navigate("/campaign/archive");
      }
    } else {
      navigate("/campaign/lists");
    }
  };

  const overviewRecipientsData = [
    {
      id: 1,
      value: `open`,
      label: `Opened`,
      key: 'open_count'
    },
    {
      id: 2,
      value: `delivered`,
      label: `Delivered`,
    },
    {
      id: 3,
      value: `bounce`,
      label: `Bounced`,
    },
    {
      id: 4,
      value: `click`,
      label: `Clicked`,
    },
    {
      id: 5,
      value: `un_opened`,
      label: `Unopened`,
    },
    {
      id: 6,
      value: `unsubscribe`,
      label: `Unsubscribed`,
    },
  ];

   const dropdownFilterData = allListOptions?.map((elem, key) => {
    return (
      <MenuItem sx={{ textTransform: "capitalize" }} key={key} value={elem?.value}>
        {elem?.label}
      </MenuItem>
    );
  });
  
  const renameActions = [
    {
      id: 1,
      value: "rename",
      handleClick: () => {
        handleChangeRename(props?.overviewData?.name);
      },
      title: "Rename",
    },
  ];

  const duplicateAction = [
    {
      id: 2,
      value: "duplicate",
      handleClick: () => {
        handleDuplicate();
      },
      title: "Duplicate",
    },
  ];

  const scheduledActions = [
    {
      id: 3,
      value: "cancel",
      handleClick: () => {
        handleCancel();
      },
      title: "Cancel",
    },
    {
      id: 4,
      value: "cancel and archive",
      handleClick: () => {
        handleCancelArchive();
      },
      title: "Cancel & Move to Archive",
    },
  ];

  const deleteActions = [
    {
      id: 5,
      value: "delete",
      handleClick: () => {
        handleDelete();
      },
      title: "Delete",
    },
  ];

  const sentCancelledActions = [
    {
      id: 6,
      value: "move to archive",
      handleClick: () => {
        handleArchive();
      },
      title: "Move to Archive",
    },
  ];

  function updateActionsData() {
    if (splitLocation[2] === "overview") {
      handleOverviewAction();
    } else {
      handleRecipientsAction();
    }
  }

  useEffect(() => {
    updateActionsData();
  }, [isViewingDraft, newStatus]);

  const handleOverviewAction = () => {
    let updatedActionsData = [...duplicateAction];

    if (newStatus === EMAIL_SCHEDULED) {
      updatedActionsData = [
        ...updatedActionsData,
        ...renameActions,
        ...scheduledActions,
        ...deleteActions,
      ];
    }
    if (newStatus === EMAIL_SENDING) {
      updatedActionsData = [...updatedActionsData];
    }

    if (newStatus === EMAIL_SENT || newStatus === EMAIL_CANCELLED) {
      updatedActionsData = [
        ...updatedActionsData,
        ...renameActions,
        ...sentCancelledActions,
        ...deleteActions,
      ];
    }

    setActionData(updatedActionsData);
  };

  const handleRecipientsAction = () => {
    if (newStatus == EMAIL_SENT || newStatus == EMAIL_SENDING) {
      setActionData(overviewRecipientsData);
    }
  };

  const handleAllDropdown = (e) => {
    let val = e.target.value;
    props?.setRecipientListData(val);
  };

  const handleCancelArchive = () => {
    let data = {
      data: {
        email_campaign_ids: [actionId],
      },
    };
    moveAPI(data, CANCEL_ARCHIVE);
  };

  const handleArchive = () => {
    let data = {
      data: {
        email_campaign_ids: [actionId],
      },
    };
    moveAPI(data, ARCHIVE_CAMPAIGNS);
  };

  const handleChangeRename = (name) => {
    setRowId(id);
    setCampaginName(name);
    setOpenRename(true);
  };

  const handleDelete = () => {
    setRowId(id);
    setOpenDelete(true);
  };

  const handleToCloseLT = () => {
    setOpenRename(false);
  };

  const handleDuplicate = () => {
    navigate(`/campaign/create`, {
      state: {
        is_duplicate: true,
        duplicate_id: id,
      },
    });
  };

  const moveAPI = (data, value) => {
    campaignApi
      .archiveCampaign(data, value)
      .then((response) => {
        props?.getCampaignOverviewData();
        setRowId("");
        Toaster.TOAST(response.message, "success");
      })
      .catch((error) => {
        setLoader(false);
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error)
      });
  };

  const handleCancel = () => {
    campaignApi
      .cancelCampaign(id)
      .then((res) => {
        Toaster.TOAST(res?.message, "success");
        backNavigation();
      })
      .catch((error) => {
        setLoader(false);
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };

  const shouldShowActions = () => {
    if (splitLocation[2] === "overview-list") {
      if (newStatus == EMAIL_SENT || newStatus == EMAIL_SENDING) {
        return true;
      } else {
        return false;
      }
    }
  };

  return (
    <Box>
      <Card
        variant="outlined"
        className="ma-leads-box border-0 overflow-visible"
      >
        <Box>
          <div className="tobNavigation ma-overview-heading">
            <div className="border-0">
              <Typography className="createlead-heading p-0 border-0">
                <ArrowBackIcon
                  className="Arrowbtn-mr"
                  onClick={backNavigation}
                />
                <span className="d-flex align-items-center">
                  <span className="campaign-heading">
                    {isViewingDraft
                      ? props?.overviewData?.name
                      : location?.state?.value?.name
                        ? location?.state?.value?.name
                        : overviewHeaderData?.full_name}
                  </span>{" "}
                  <span className={`overview-status-class ma-${newStatus}`}>
                    {newStatus}
                  </span>
                </span>{" "}
              </Typography>
            </div>
          </div>
          <CardContent className="p-0 border-0 mr-2">
            {showTabs && <OverviewTab navigationData={navigationData} />}
            <Box
            sx={!shouldShowActions() && splitLocation[2] !== "overview" && {display: "none"}}
            className="ma-campaignActions-bar ma-campaignDivider-bar">
              {splitLocation[2] !== "overview" ?
                shouldShowActions() && (
                  <div className="campaign-searchFilterDiv p-0 border-0">
                  <AllLeads
                    alignParam={["bottom", 25, "top", "right"]}
                    title="All"
                    allLead={props?.recipientListData}
                    handleList={handleAllDropdown}
                    leadArray={dropdownFilterData}
                  />
                  </div>
                  )
                :
                (
                  <Actions
                    actionsData={actionData}
                    isTrue={
                      isViewingDraft ? props?.overviewData?.is_archived : false
                    }
                  />
                )}
              {/* ) : null} */}
              <Button className="d-none">
                <MoreHorizIcon />
              </Button>
            </Box>
          </CardContent>
        </Box>
      </Card>

      <RenameCampaign
        title={"email"}
        openLT={openRename}
        handleToCloseLT={() => handleToCloseLT()}
        popupDialogID={rowId}
        getData={() => props?.getCampaignOverviewData()}
        campaignName={campaginName}
      />
      <DeleteCampaign
        title={"email campaign"}
        content={"email campaign"}
        overviewDelete={true}
        openDelete={openDelete}
        handleToCloseLT={() => setOpenDelete(false)}
        deleteId={rowId}
        getData={props?.getCampaignOverviewData}
        setRowId={setRowId}
      />
    </Box>
  );
};

export default OverviewTabs;
