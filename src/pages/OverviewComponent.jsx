import LeadsOverview from "./Leads/Overview";
import PipelinesOverview from "./Pipeline/Overview";
import PotentialsOverview from "./Potential/Overview";
import DealsOverview from "./Deals/Overview";
import LostsOverview from "./LostLeads/Overview";

const OverviewChild = ({ type }) => {
    let OverviewType = type;
    const overviewComponent = () => {
        if (OverviewType === "Pipeline") {
          return <PipelinesOverview />;
        } else if (OverviewType === "Potential") {
          return <PotentialsOverview />;
        } else if (OverviewType === "Deal") {
          return <DealsOverview />;
        } else if (OverviewType === "Lead") {
          return <LeadsOverview />;
        } else {
          return <LostsOverview />;
        }
      };

    return (
        <>
            { overviewComponent() }
        </>
    )
}

export default OverviewChild;