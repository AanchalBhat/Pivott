import { useEffect, useState, useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import ScheduleOverview from "../../components/Email Campaigns/Overview/ScheduleOverview";
import SentOverview from "../../components/Email Campaigns/Overview/SentOverview";
import {
  EMAIL_SCHEDULED,
  EMAIL_DRAFT,
  INVALID_ID_DATA,
} from "../../utils/constants";
import { getMethodError } from "../../constants/errorMessages";
import { Toaster } from "../common/Toaster";
import { campaignApi } from "../../apis/campaignApi";
import CreateCampaign from "../../components/Email Campaigns/CreateCampaign";
import IncorrectId from "../../components/NotFound/IncorrectId";
import { DataContext } from "../../context";

const OverviewData = () => {
  const params = useParams();
  const location = useLocation();
  const status = location.state?.campaignStatus;
  let campaign_id = params.id;
  const [overviewData, setOverviewData] = useState();
  const [loader, setLoader] = useState();
  const [Invalid_data, setInvalidData] = useState(false);
  const { overviewHeaderData, setOverviewHeaderData } = useContext(DataContext);
  const [locState, setLocState] = useState(status);

  const getCampaignOverviewData = () => {
    setLoader(true);
    campaignApi
      .getOverviewData(campaign_id)
      .then((response) => {
        setLoader(false);
        if (response?.data) {
          setOverviewData(response?.data?.attributes);
          if (
            !overviewHeaderData ||
            overviewHeaderData?.full_name !== response?.data?.attributes?.name
          ) {
            const header = {
              full_name: response?.data?.attributes.name,
              status: response?.data?.attributes?.status,
            };
            setOverviewHeaderData(header);
          }
          setLocState(response?.data?.attributes?.status);
        }
      })
      .catch((error) => {
        if (error.response?.data?.error === INVALID_ID_DATA) {
          setInvalidData(true);
          return;
        }
        setLoader(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  useEffect(() => {
    if (status !== EMAIL_DRAFT) {
      getCampaignOverviewData();
    }
  }, []);

  const overviewComponent = () => {
    if (locState === EMAIL_SCHEDULED) {
      return (
        <ScheduleOverview
          overviewData={overviewData}
          loader={loader}
          getCampaignOverviewData={getCampaignOverviewData}
        />
      );
    } else if (locState === EMAIL_DRAFT) {
      return (
        <CreateCampaign
          getCampaignOverviewData={getCampaignOverviewData}
          overviewDraftData={overviewData}
        />
      );
    }
    return (
      <SentOverview
        overviewData={overviewData}
        status={locState}
        loader={loader}
        getCampaignOverviewData={getCampaignOverviewData}
      />
    );
  };
  return Invalid_data ? <IncorrectId /> : overviewComponent();
};

export default OverviewData;
