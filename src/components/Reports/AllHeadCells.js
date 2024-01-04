import { Stack, Avatar, FormControlLabel } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import moment from "moment";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import IconTooltip from "../../pages/common/IconTooltip";
import Moment from "react-moment";
//import global css
import "../../styles/global/common.css";
import { returnSubstring } from "../../utils";

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    background: "#2c42b5",
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&:before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&:after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
    background: "white",
  },
  "& .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track": {
    background: "#2c42b5 !important",
    opacity: "2 !important",
  },
}));

// leads
export const leadsHeadCells = [
  {
    field: "first_name",
    sortable: true,
    headerName: "Name",
    width: 390,
    valueGetter: (params) =>
      `${params.row?.full_name ? params.row?.full_name : "N/A"}`,
    renderCell: (params) => {
      return (
        <Stack
          direction="row"
          spacing={2}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {params?.row?.profile_photo?.url && (
            <Avatar
              sx={{ width: "42px", height: "42px" }}
              alt="Remy Sharp"
              src={params?.row?.profile_photo?.url}
            />
          )}
          {!params?.row?.profile_photo?.url && (
            <Avatar sx={{ width: "42px", height: "42px" }} alt="Remy Sharp">
              {" "}
              <AccountCircleIcon></AccountCircleIcon>{" "}
            </Avatar>
          )}
          <div
            className="ma-nameTable-list"
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "7px",
            }}
          >
            <IconTooltip
              title={params?.row?.full_name}
              handleIconClick={() => {}}
            />

            <span className="ma-userPost-table">
              {returnSubstring(params?.row?.designation, 10) || "No Designation"}
            </span>
          </div>
        </Stack>
      );
    },
  },
  {
    field: "email",
    sortable: true,
    headerName: "Email",
    width: 270,
    renderCell: (params) => {
      return <span className="linkStyling">{params?.row?.email}</span>;
    },
  },
  {
    field: "lead_source",
    sortable: true,
    width: 180,
    headerName: "Lead Source",
    valueGetter: (params) =>
      params?.row?.lead_source ? `${params?.row?.lead_source}` : "N/A",
  },
  {
    field: "company_name",
    sortable: true,
    headerName: "Company",
    width: 180,
    renderCell: (params) => {
      return (
        <span>
          {" "}
          {params?.row?.company_name ? params?.row?.company_name : "N/A"}{" "}
        </span>
      );
    },
  },
  {
    field: "owner",
    sortable: true,
    width: 180,
    headerName: "Lead Owner",
    renderCell: (params) => {
      return (
        <>
          <div
            style={{
              background: "#F1F1F4",
              borderRadius: "4px",
              fontWeight: "500",
              color: "#191A47",
              fontSize: "14px",
              padding: "6px 12px",
            }}
          >
            {params?.row?.owner ? params?.row?.owner : "-"}
          </div>
        </>
      );
    },
  },
  {
    field: "website",
    sortable: true,
    width: 180,
    headerName: "Website",
    valueGetter: (params) =>
      params?.row?.website ? `${params?.row?.website}` : "N/A",
  },
  {
    field: "lead_status",
    sortable: true,
    width: 180,
    headerName: "Lead Status",
    valueGetter: (params) =>
      params?.row?.status_id ? `${params?.row?.lead_status}` : "N/A",
  },
  {
    field: "industry",
    sortable: true,
    width: 270,
    headerName: "Industry",
    valueGetter: (params) =>
      params?.row?.industry ? `${params?.row?.industry?.name}` : "N/A",
  },
];

//potential starts
export const potentialHeadCells = [
  {
    field: "first_name",
    headerName: "Name",
    sortable: true,
    width: 390,
    valueGetter: (params) =>
      `${params?.row?.full_name ? params?.row?.full_name : "N/A"}`,
    renderCell: (cellValues) => {
      return (
        <Stack
          direction="row"
          spacing={2}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {cellValues?.row?.profile_photo?.url && (
            <Avatar
              sx={{ width: "42px", height: "42px" }}
              alt="Remy Sharp"
              src={cellValues?.row?.profile_photo?.url}
            />
          )}
          {!cellValues?.row?.profile_photo?.url && (
            <Avatar sx={{ width: "42px", height: "42px" }} alt="Remy Sharp">
              {" "}
              <AccountCircleIcon></AccountCircleIcon>{" "}
            </Avatar>
          )}
          <div
            className="ma-nameTable-list"
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "7px",
            }}
          >
            <IconTooltip
              title={cellValues?.row?.full_name}
              handleIconClick={() => {}}
            />

            <span className="ma-userPost-table">
              {returnSubstring(cellValues.row?.designation, 10) || "No Designation"}
            </span>
          </div>
        </Stack>
      );
    },
  },
  {
    field: "company_name",
    sortable: true,
    headerName: "Company",
    width: 180,
    renderCell: (params) => {
      return (
        <span className="linkStyling">
          {" "}
          {params.row?.company_name ? params.row?.company_name : "N/A"}
        </span>
      );
    },
  },
  {
    field: "email",
    sortable: true,
    headerName: "Email",
    width: 270,
    renderCell: (params) => {
      return (
        <span className="linkStyling">
          {params?.row?.email ? params?.row?.email : "N/A"}
        </span>
      );
    },
  },
  {
    field: "account_name",
    sortable: true,
    headerName: "Account Name",
    width: 180,
    valueGetter: (params) =>
      `${params.row?.account_name ? params.row?.account_name : "N/A"}`,
  },

  {
    field: "lead_source",
    sortable: true,
    width: 180,
    headerName: "Lead Source",
    valueGetter: (params) =>
      params?.row?.lead_source ? `${params?.row?.lead_source}` : "N/A",
  },
  {
    field: "owner",
    sortable: true,
    width: 180,
    headerName: "Potential Owner",
    renderCell: (params) => {
      return (
        <>
          {params?.row?.owner ? (
            <div
              style={{
                background: "#F1F1F4",
                borderRadius: "0px",
                fontWeight: "500",
                color: "#191A47",
                fontSize: "14px",
                padding: "6px 12px",
              }}
            >
              {params?.row?.owner}
            </div>
          ) : (
            "-"
          )}
        </>
      );
    },
  },
  {
    field: "potential_name",
    sortable: true,
    width: 180,
    headerName: "Potential Name",
    valueGetter: (params) =>
      `${params?.row?.potential_name ? params?.row?.potential_name : "N/A"}`,
  },
  {
    field: "amount",
    sortable: true,
    width: 180,
    headerName: "Amount",
    valueGetter: (params) =>
      params?.row?.amount ? `$ ${params?.row?.amount}` : "N/A",
  },
  {
    field: "stage",
    sortable: true,
    width: 180,
    headerName: "Stage",
    valueGetter: (params) =>
      `${params?.row?.stage ? params?.row?.stage : "N/A"}`,
  },
  {
    field: "campaign_sources",
    sortable: true,
    headerName: "Campaign sources",
    width: 180,
    valueGetter: (params) =>
      `${
        params?.row?.campaign_sources ? params?.row?.campaign_sources : "N/A"
      }`,
  },
  {
    field: "closing_date",
    sortable: true,
    width: 180,
    headerName: "Closing date",
    valueGetter: (params) =>
      `${params.row?.closing_date ? params.row?.closing_date : "N/A"}`,
  },
];

//   //pipelines
export const pipelineHeadCells = [
  {
    field: "first_name",
    headerName: "Name",
    sortable: true,
    width: 390,
    valueGetter: (params) =>
      `${params?.row?.full_name ? params?.row?.full_name : "N/A"}`,
    renderCell: (cellValues) => {
      return (
        <Stack
          direction="row"
          spacing={2}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {cellValues?.row?.profile_photo?.url && (
            <Avatar
              sx={{ width: "42px", height: "42px" }}
              alt="Remy Sharp"
              src={cellValues?.row?.profile_photo?.url}
            />
          )}
          {!cellValues?.row?.profile_photo?.url && (
            <Avatar sx={{ width: "42px", height: "42px" }} alt="Remy Sharp">
              {" "}
              <AccountCircleIcon></AccountCircleIcon>{" "}
            </Avatar>
          )}
          <div
            className="ma-nameTable-list"
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "7px",
            }}
          >
            <IconTooltip
              title={cellValues?.row?.full_name}
              handleIconClick={() => {}}
            />
            <span className="ma-userPost-table">
              {returnSubstring(cellValues.row?.designation, 10)|| "No Designation"}
            </span>
          </div>
        </Stack>
      );
    },
  },

  {
    field: "account_name",
    sortable: true,
    headerName: "ACCOUNT NAME",
    width: 250,
    valueGetter: (params) =>
      `${params?.row?.account_name ? params?.row?.account_name : "N/A"}`,
  },

  {
    field: "campaign_sources",
    sortable: true,
    headerName: "CAMPAIGN SOURCES",
    width: 180,
    valueGetter: (params) =>
      `${
        params?.row?.campaign_sources ? params?.row?.campaign_sources : "N/A"
      }`,
  },
  {
    field: "company_name",
    sortable: true,
    headerName: "Company",
    width: 180,
    renderCell: (params) => {
      return <span> {params?.row?.company_name}</span>;
    },
  },
  {
    field: "email",
    sortable: true,
    headerName: "EMAIL",
    width: 270,
    renderCell: (params) => {
      return <span className="linkStyling">{params?.row?.email}</span>;
    },
  },
  {
    field: "expected_revenue",
    sortable: true,
    headerName: "EXPECTED REVENUE",
    width: 180,
    valueGetter: (params) =>
      `${
        params?.row?.expected_revenue
          ? "$ " + params?.row?.expected_revenue
          : "N/A"
      }`,
  },
  {
    field: "journey",
    sortable: true,
    headerName: "JOURNEY",
    width: 180,
    renderCell: (params) => {
      return (
        <>
          <span>
            {`${params?.row?.journey}` ? (
              <Moment format="MMMM Do YYYY">{params?.row?.journey}</Moment>
            ) : (
              "N/A"
            )}
          </span>
        </>
      );
    },
  },
  {
    field: "owner",
    sortable: true,
    headerName: "PIPELINE OWNER",
    width: 180,
    renderCell: (params) => {
      return (
        <>
          <div
            style={{
              background: "#F1F1F4",
              borderRadius: "4px",
              fontWeight: "500",
              color: "#191A47",
              fontSize: "14px",
              padding: "6px 12px",
            }}
          >
            {params?.row?.owner ? params?.row?.owner : "-"}
          </div>
        </>
      );
    },
  },

  {
    field: "pipeline_score",
    sortable: true,
    headerName: "SCORE(%)",
    width: 180,
    valueGetter: (params) =>
      `${params?.row?.pipeline_score ? params?.row?.pipeline_score : "N/A"}`,
  },
  {
    field: "stage",
    sortable: true,
    headerName: "STAGE",
    width: 180,
    valueGetter: (params) =>
      `${params?.row?.stage ? params?.row?.stage : "N/A"}`,
  },
];

//deals
export const dealsHeadCells = [
  {
    field: "first_name",
    headerName: "Name",
    sortable: true,
    width: 390,
    valueGetter: (params) => `${params?.row?.full_name}`,
    renderCell: (cellValues) => {
      return (
        <>
          <Stack
            direction="row"
            spacing={2}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {cellValues?.row?.profile_photo?.url && (
              <Avatar
                sx={{ width: "42px", height: "42px" }}
                alt="Remy Sharp"
                src={cellValues?.row?.profile_photo?.url}
              />
            )}
            {!cellValues?.row?.profile_photo?.url && (
              <Avatar sx={{ width: "42px", height: "42px" }} alt="Remy Sharp">
                {" "}
                <AccountCircleIcon></AccountCircleIcon>{" "}
              </Avatar>
            )}
            <div
              className="ma-nameTable-list"
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "7px",
              }}
            >
              <IconTooltip
                title={cellValues?.row?.full_name}
                handleIconClick={() => {}}
              />
              <span className="ma-userPost-table">
                {returnSubstring(cellValues?.row?.designation, 10) || "No Designation"}
              </span>
            </div>
          </Stack>
        </>
      );
    },
  },
  {
    field: "deal_name",
    sortable: true,
    headerName: "Deal Name",
    width: 150,
    valueGetter: (params) =>
      params?.row?.deal_name ? `$ ${params?.row?.deal_name}` : "N/A",
  },
  {
    field: "sign_off_date",
    sortable: true,
    headerName: "Sign Off Date",
    width: 150,
    valueGetter: (params) =>
      params?.row?.sign_off_date
        ? `${moment(params?.row?.sign_off_date).utc().format("DD MMM YYYY")}`
        : "N/A",
  },
  {
    field: "kick_off_date",
    sortable: true,
    headerName: "Kick Off Date",
    width: 150,
    valueGetter: (params) =>
      params?.row?.kick_off_date
        ? `${moment(params?.row?.kick_off_date).utc().format("DD MMM YYYY")}`
        : "N/A",
  },
  {
    field: "value",
    sortable: true,
    headerName: "Deal value",
    width: 150,
    valueGetter: (params) =>
      params?.row?.value ? `$ ${params?.row?.value}` : "N/A",
  },
  {
    field: "payment_mode",
    sortable: true,
    headerName: "Payment Mode",
    width: 150,
    valueGetter: (params) =>
      params?.row?.payment_mode ? `${params?.row?.payment_mode?.name}` : "N/A",
  },
  {
    field: "tenure",
    sortable: true,
    width: 150,
    headerName: "Deal tenure (Week)",
    valueGetter: (params) =>
      params?.row?.tenure ? `${params?.row?.tenure}` : "N/A",
  },
  {
    field: "deal_terms",
    sortable: true,
    width: 150,
    headerName: "Deal Terms ",
    valueGetter: (params) =>
      params?.row?.deal_terms ? `${params?.row?.deal_terms}` : "N/A",
  },
  {
    field: "company_name",
    headerName: "Company",
    sortable: true,
    width: 180,
    renderCell: (params) => {
      return <span> {params?.row?.company_name} </span>;
    },
  },
  {
    field: "owner",
    headerName: "Deal Owner",
    sortable: true,
    width: 180,
    renderCell: (params) => {
      return (
        <>
          {params?.row?.owner ? (
            <div
              style={{
                background: "#F1F1F4",
                borderRadius: "4px",
                fontWeight: "500",
                color: "#191A47",
                fontSize: "14px",
                padding: "6px 12px",
              }}
            >
              {params?.row?.owner}
            </div>
          ) : (
            "-"
          )}
        </>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    sortable: true,
    width: 270,
    renderCell: (params) => {
      return <span className="linkStyling">{params?.row?.email}</span>;
    },
  },
  {
    field: "campaign_sources",
    headerName: "Campaign Sources",
    sortable: true,
    width: 270,
    renderCell: (params) => {
      return (
        <span className="linkStyling">{params?.row?.campaign_sources}</span>
      );
    },
  },
];

//lostleads
export const lostLeadsHeadCells = [
  {
    field: "name",
    headerName: "Name",
    sortable: true,
    width: 390,
    valueGetter: (params) =>
      `${params.row?.full_name ? params.row?.full_name : "N/A"}`,
    renderCell: (cellValues) => {
      return (
        <>
          <Stack
            direction="row"
            spacing={2}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {cellValues?.row?.profile_photo?.url && (
              <Avatar
                sx={{ width: "42px", height: "42px" }}
                alt="Remy Sharp"
                src={cellValues?.row?.profile_photo?.url}
              />
            )}
            {!cellValues?.row?.profile_photo?.url && (
              <Avatar sx={{ width: "42px", height: "42px" }} alt="Remy Sharp">
                {" "}
                <AccountCircleIcon></AccountCircleIcon>{" "}
              </Avatar>
            )}
            <div
              className="ma-nameTable-list"
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "7px",
              }}
            >
              <IconTooltip
                title={cellValues?.row?.full_name}
                handleIconClick={() => {}}
              />
              <span className="ma-userPost-table">
                {returnSubstring(cellValues.row?.designation, 10) || "No Designation"}
              </span>
            </div>
          </Stack>
        </>
      );
    },
  },
  {
    field: "email",
    sortable: true,
    headerName: "Email",
    width: 270,
    renderCell: (params) => {
      return <span className="linkStyling">{params.row?.email}</span>;
    },
  },
  {
    field: "designation",
    sortable: true,
    headerName: "Designation",
    width: 270,
    renderCell: (params) => {
      return <span className="linkStyling">{returnSubstring(params.row?.designation, 10) || "No Designation"}</span>;
    },
  },
  {
    field: "company",
    sortable: true,
    headerName: "Company",
    width: 270,
    renderCell: (params) => {
      return <span>{params.row?.company ? params.row?.company : "N/A"}</span>;
    },
  },
  {
    field: "phone_number",
    sortable: true,
    headerName: "Phone",
    width: 180,
    valueGetter: (params) =>
      `${
        params.row?.phone_number
          ? params.row?.country_code + params.row?.phone_number
          : "-"
      }`,
  },

  {
    field: "owner",
    sortable: true,
    width: 180,
    headerName: "Lead Owner",
    renderCell: (params) => {
      return (
        <>
          {params?.row?.owner ? (
            <div
              style={{
                background: "#F1F1F4",
                borderRadius: "4px",
                fontWeight: "500",
                color: "#191A47",
                fontSize: "14px",
                padding: "6px 12px",
              }}
            >
              {params?.row?.owner}
            </div>
          ) : (
            "-"
          )}
        </>
      );
    },
  },
  {
    field: "reason",
    sortable: true,
    width: 270,
    headerName: "Reason For Lost",
    valueGetter: (params) =>
      `${params.row?.reason ? params.row?.reason : "N/A"}`,
  },
];
// ROLES ND PERMISSIONS
export const rolesPermissionsHeadCells = [
  {
    field: "name",
    headerName: "Name",
    sortable: true,
    width: 390,
    valueGetter: (params) => `${params?.row?.name}`,
    renderCell: (cellValues) => {
      let userName = cellValues?.row?.attributes?.full_name
        ? cellValues?.row?.attributes?.full_name
        : "N/A";
      return (
        <>
          <Stack
            direction="row"
            spacing={2}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {cellValues?.row?.attributes?.profile_photo?.url && (
              <Avatar
                sx={{ width: "42px", height: "42px" }}
                alt="Remy Sharp"
                src={cellValues?.row?.attributes?.profile_photo?.url}
              />
            )}
            {!cellValues?.row?.attributes?.profile_photo?.url && (
              <Avatar sx={{ width: "42px", height: "42px" }} alt="Remy Sharp">
                {" "}
                <AccountCircleIcon />{" "}
              </Avatar>
            )}
            <div
              className="ma-nameTable-list"
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "7px",
              }}
            >
              <IconTooltip title={userName} />
            </div>
          </Stack>
        </>
      );
    },
  },
  {
    field: "email",
    sortable: true,
    headerName: "Email",
    width: 250,
    renderCell: (params) => {
      return (
        <span className="linkStyling">
          {params?.row?.attributes?.email
            ? params?.row?.attributes?.email
            : "N/A"}
        </span>
      );
    },
  },
  {
    field: "role",
    sortable: true,
    headerName: "Role",
    width: 180,
    valueGetter: (params) =>
      `${
        params?.row?.attributes?.role?.name
          ? params?.row?.attributes?.role?.name
          : "N/A"
      }`,
  },
  {
    field: "designation",
    sortable: true,
    headerName: "Designation",
    width: 180,
    valueGetter: (params) =>
      `${
        returnSubstring(params?.row?.attributes?.designation, 10) || "No Designation"
      }`,
  },
  {
    field: "status",
    sortable: true,
    width: 180,
    headerName: "Status",
    renderCell: (params) => {
      return (
        <>
          <Stack
            direction="row"
            spacing={2}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={
                <Android12Switch
                  defaultChecked={
                    params?.row?.attributes?.disabled
                      ? params?.row?.attributes?.disabled
                      : "true"
                  }
                />
              }
            />
          </Stack>
        </>
      );
    },
  },
];

export const dashboardHeadCells = [
  {
    field: "first_name",
    headerName: "Name",
    sortable: true,
    width: 390,
    valueGetter: (params) =>
      `${
        params?.row?.contact_detail?.first_name +
        " " +
        params?.row?.contact_detail?.last_name
      }`,
    renderCell: (cellValues) => {
      let userName = cellValues?.row?.name
        ? cellValues?.row?.name
        : cellValues?.row?.contact_detail?.first_name +
          " " +
          cellValues?.row?.contact_detail?.last_name;
      return (
        <>
          <Stack
            direction="row"
            spacing={2}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {cellValues?.row?.profile_photo?.url && (
                <Avatar
                  sx={{ width: "42px", height: "42px" }}
                  alt="Remy Sharp"
                  src={cellValues?.row?.profile_photo?.url}
                />
              )}
              {!cellValues?.row?.profile_photo?.url && (
                <Avatar sx={{ width: "42px", height: "42px" }} alt="Remy Sharp">
                  {" "}
                  <AccountCircleIcon></AccountCircleIcon>{" "}
                </Avatar>
              )}
              <div
                className="ma-nameTable-list"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "7px",
                }}
              >
                <IconTooltip title={userName} />

                <span className="ma-userPost-table">
                  {cellValues.row?.designation
                    ? returnSubstring(cellValues.row?.designation, 10) || "No Designation"
                    : returnSubstring(cellValues.row?.contact_detail?.designation, 10)
                    || "No Designation"}
                </span>
              </div>
            </div>
            <div
              className="ma-iconTable-list"
              style={{ color: "#8C8DA3", paddingLeft: "15px" }}
            >
              <IconTooltip
                title="Email"
                //handleIconClick={() => handleIconClick("email", cellValues?.id, cellValues?.row?.contact_detail?.email)}
                icon={<MailOutlineIcon sx={{ width: "20px" }} />}
              />
              <IconTooltip
                title="Calls"
                //handleIconClick={() => handleIconClick("call_information", cellValues?.id)}
                icon={<CallOutlinedIcon sx={{ width: "20px" }} />}
              />
              <IconTooltip
                title="Notes"
                //handleIconClick={() => handleIconClick("note", cellValues?.id)}
                icon={<TaskOutlinedIcon sx={{ width: "20px" }} />}
              />
              <IconTooltip
                title="Meetings"
                //handleIconClick={() => handleIconClick("meeting", cellValues?.id)}
                icon={<DescriptionOutlinedIcon sx={{ width: "20px" }} />}
              />
            </div>
          </Stack>
        </>
      );
    },
  },
  {
    field: "email",
    sortable: true,
    headerName: "Email",
    width: 350,
    renderCell: (params) => {
      return (
        <span className="linkStyling">
          {params.row?.email
            ? params.row?.email
            : params.row?.contact_detail?.email
            ? params.row?.contact_detail?.email
            : "N/A"}
        </span>
      );
    },
  },
  {
    field: "From",
    sortable: true,
    width: 220,
    headerName: "From",
    renderCell: (params) => {
      return <span>{params.row?.created_at}</span>;
    },
  },
  {
    field: "company_name",
    sortable: true,
    headerName: "Company",
    width: 220,
    renderCell: (params) => {
      return (
        <span>
          {" "}
          {params.row?.company
            ? params.row?.company
            : params.row?.contact_detail?.company_name
            ? params.row?.contact_detail?.company_name
            : "N/A"}{" "}
        </span>
      );
    },
  },
  {
    field: "owner",
    sortable: true,
    width: 220,
    headerName: "Sales Owner",
    renderCell: (params) => {
      return (
        <div
          style={{
            background: "#F1F1F4",
            borderRadius: "4px",
            fontWeight: "500",
            color: "#191A47",
            fontSize: "14px",
            padding: "6px 12px",
          }}
        >
          {params.row?.lead_owner?.full_name
            ? params.row?.lead_owner?.full_name
            : params.row?.pipeline_owner?.full_name
            ? params.row?.pipeline_owner?.full_name
            : params.row?.potential_owner?.full_name
            ? params.row?.potential_owner?.full_name
            : params.row?.deal_owner?.full_name
            ? params.row?.deal_owner?.full_name
            : params.row?.lead_owner
            ? params.row?.lead_owner
            : "-"}
        </div>
      );
    },
  },
];
