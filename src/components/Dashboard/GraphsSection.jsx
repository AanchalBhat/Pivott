import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { MyTaskChart } from "./charts/MyTaskChart";
import { MeetingChart } from "./charts/MeetingChart";
import { LineChartComponent } from "./charts/LineChartComponent";
import AllLeads from "../../pages/common/DropdownFilter";
import { DashboardApi } from "../../apis/DashboardApi";
import MenuItem from "@mui/material/MenuItem";
import { LAST_SIX_MONTHS, THIS_MONTH, THIS_WEEK } from "../../utils/constants";
import { Toaster } from "../../pages/common/Toaster";
import { getMethodError } from "../../constants/errorMessages";

const taskActionData = [
  { title: "This Week", value: "this_week" },
  { title: "This Month", value: "this_month" },
];
const meetActionData = [
  { title: "This Month", value: "this_month" },
  { title: "Last Six Months", value: "last_6_months" },
];
const dealActionData = [
  { title: "This Week", value: "this_week" },
  { title: "This Month", value: "this_month" },
];
const weekNames = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
const monthNames = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

let isWeek = false;
const GraphsSection = ({ }) => {
  const [lastSixMonth, setLastSixMonth] = useState([]);
  const [weekInMonth, setWeekInMonth] = useState([]);
  const [xAxis, setXAxis] = useState([]);
  const [dealAction, setDealAction] = useState(LAST_SIX_MONTHS);
  const [taskAction, setTaskAction] = useState(LAST_SIX_MONTHS);
  const [meetingAction, setMeetingAction] = useState(THIS_WEEK);
  const [wonData, setWonData] = useState();
  const [lostData, setLostData] = useState();
  const [pendingTasks, setPendingTasks] = useState();
  const [completedTasks, setCompletedTasks] = useState();

  const [meetingChartData, setMeetingChartData] = useState([
    {
      name: "Upcoming",
      value: 1,
      fill: "#03A8DA",
    },
    {
      name: "Total",
      value: 1,
      fill: "#5C3DFB",
    },
  ]);

  useEffect(() => {
    getMeetingData();
  }, [meetingAction]);

  useEffect(() => {
    getLastSixMonth();
  }, [dealAction, taskAction]);

  useEffect(() => {
    dealGraph();
  }, [dealAction]);

  useEffect(() => {
    taskGraph();
  }, [taskAction]);
  const getMeetingData = () => {
    DashboardApi.meetingData(meetingAction).then((response) => {
      setMeetingChartData((prev) =>
        prev?.map((elem, idx) => {
          if (idx === 0) {
            return {
              ...elem,
              value: response?.upcoming_meetings,
            };
          } else {
            return {
              ...elem,
              value: response?.total_meetings,
            };
          }
        })
      );
    }).catch((error) => {
      Toaster.TOAST(getMethodError(error), "error");
      console.log(error);
    })
  };
  const dealGraph = () => {
    DashboardApi.getDealsGraph(dealAction)
      .then((res) => {
        res?.dashboard.filter((elem) => {
          if (elem?.name === "won") {
            setWonData(elem?.data);
          } else {
            setLostData(elem?.data);
          }
        });
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      })
  };

  const taskGraph = () => {
    DashboardApi.getTasksGraph(taskAction)
      .then((res) => {
        res?.dashboard.filter((elem) => {
          if (elem?.name === "pending") {
            setPendingTasks(elem?.data);
          } else {
            setCompletedTasks(elem?.data);
          }
        });
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      })
  };

  const taskFilterData = taskActionData?.map((elem, key) => {
    return (
      <MenuItem key={key} value={elem.value}>
        {elem.title}
      </MenuItem>
    );
  });

  const meetingFilterData = meetActionData?.map((elem, key) => {
    return (
      <MenuItem key={key} value={elem.value}>
        {elem.title}
      </MenuItem>
    );
  });
  const dealFilterData = dealActionData?.map((elem, key) => {
    return (
      <MenuItem key={key} value={elem.value}>
        {elem.title}
      </MenuItem>
    );
  });
  const getLastSixMonth = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const newArray = [...weekInMonth];
    const tempLastSixMonthNames = [];

    for (let i = 0; i < 6; i++) {
      tempLastSixMonthNames.push(monthNames[currentDate.getMonth()]);
      currentDate.setMonth(currentDate.getMonth() - 1);
    }
    tempLastSixMonthNames.reverse();
    getDealGraphLabel(tempLastSixMonthNames);
    getTaskGraphLabel(tempLastSixMonthNames);

    //WEEK IN MONTH
    const weeksInMonth = Math.ceil(
      (lastDayOfMonth.getDate() - firstDayOfMonth.getDate() + 1) / 7
    );
    if (!isWeek) {
      for (let i = 1; i <= weeksInMonth; i++) {
        newArray.push(`Week${i}`);
      }
      setWeekInMonth(newArray);
      isWeek = true;
    }
  };
  
  const getDealGraphLabel = (sixMonth) => {
    if (dealAction === THIS_WEEK) {
      setLastSixMonth(weekNames);
    } else if (dealAction === THIS_MONTH) {
      setLastSixMonth(weekInMonth);
    } else {
      setLastSixMonth(sixMonth);
    }
  };

  const getTaskGraphLabel = (sixMonth) => {
    if (taskAction === THIS_WEEK) {
      setXAxis(weekNames);
    } else if (taskAction === THIS_MONTH) {
      setXAxis(weekInMonth);
    } else {
      setXAxis(sixMonth);
    }
  };

  return (
    <>
      <Grid xs={12} md={4} item>
        <div className="ma-dashboardTask-box">
          <h5>My Tasks</h5>
          <div className="d-flex justify-content-end ma-zindex">
            <AllLeads
              title="Last Six Months"
              allLead={taskAction}
              handleList={(e) => setTaskAction(e.target.value)}
              leadArray={taskFilterData}
              value={LAST_SIX_MONTHS}
            />
          </div>
          <div className="ma-dashboardEmail-innerbox">
            <MyTaskChart
              completedTasks={completedTasks}
              pendingTasks={pendingTasks}
              xAxis={xAxis}
            />
          </div>
        </div>
      </Grid>

      <Grid xs={12} md={4} item>
        <div className="ma-dashboardEmail-box">
          <h5>My Meetings</h5>
          <div className="d-flex justify-content-end ma-zindex">
            <AllLeads
              title="This Week"
              allLead={meetingAction}
              handleList={(e) => setMeetingAction(e.target.value)}
              leadArray={meetingFilterData}
              value={THIS_WEEK}
            />
          </div>
          <div className="ma-dashboardEmail-innerbox">
            <MeetingChart data={meetingChartData} />
          </div>
        </div>
      </Grid>

      <Grid xs={12} md={4} item>
        <div className="ma-dashboardEmail-box">
          <h5>Deals Won vs Lost</h5>
          <div className="d-flex justify-content-end ma-zindex">
            <AllLeads
              title="Last Six Months"
              allLead={dealAction}
              handleList={(e) => setDealAction(e.target.value)}
              leadArray={dealFilterData}
              value={LAST_SIX_MONTHS}
            />
          </div>
          {/* divider space */}
          <div className="ma-dashboardEmail-innerbox">
            <LineChartComponent
              wonData={wonData}
              lostData={lostData}
              lastSixMonth={lastSixMonth}
            />
          </div>
        </div>
      </Grid>
    </>
  );
};
export default GraphsSection;
