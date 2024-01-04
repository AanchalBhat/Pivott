import { Stack, Avatar, Tooltip } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import moment from "moment";
//import global css
import "../../styles/global/common.css";
import { returnSubstring } from "../../utils";

// leads
export const leadsHeadCells = [
  {
    field: "first_name",
    sortable: true,
    headerName: "Name",
    width: 390,
    renderCell: (params) => {
      return (
        <Stack
          direction="row"
          spacing={2}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {params?.row?.attributes?.lead_owner?.profile_photo?.url && (
            <Avatar
              sx={{ width: "42px", height: "42px" }}
              alt="Remy Sharp"
              src={params?.row?.attributes?.lead_owner?.profile_photo?.url}
            />
          )}
          {!params?.row?.attributes?.lead_owner?.profile_photo?.url && (
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
            <Tooltip
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "common.black",
                    "& .MuiTooltip-arrow": {
                      color: "common.black",
                    },
                    fontWeight: 400,
                  },
                },
              }}
              arrow
              title={"leads"}
              placement="top-start"
            >
              <span className="ma-userName-table">
                {params?.row?.attributes?.contact_detail?.full_name
                  ? params?.row?.attributes?.contact_detail?.full_name
                  : "N/A"}
              </span>
            </Tooltip>

            <span className="ma-userPost-table">
              {returnSubstring(params?.row?.attributes?.contact_detail?.designation, 10) || "No Designation"}
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
      return (
        <span className="linkStyling">
          {params?.row?.attributes?.contact_detail?.email
            ? params?.row?.attributes?.contact_detail?.email
            : "N/A"}
        </span>
      );
    },
  },
  {
    field: "phone_number",
    sortable: true,
    headerName: "Phone",
    width: 180,
    valueGetter: (params) =>
      `${
        params?.row?.attributes?.contact_detail?.country_code
          ? params?.row?.attributes?.contact_detail?.country_code
          : ""
      } ${
        params?.row?.attributes?.contact_detail?.phone_number
          ? params?.row?.attributes?.contact_detail?.phone_number
          : "N/A"
      }`,
  },
  {
    field: "lead_source",
    sortable: true,
    width: 180,
    headerName: "Lead Source",
    valueGetter: (params) =>
      params?.row?.attributes?.lead_source?.name
        ? `${params?.row?.attributes?.lead_source?.name}`
        : "N/A",
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
          {params?.row?.attributes?.contact_detail?.company_name
            ? params?.row?.attributes?.contact_detail?.company_name
            : "N/A"}{" "}
        </span>
      );
    },
  },
];

// pipelines
export const pipelineHeadCells = [
  {
    field: "first_name",
    headerName: "Name",
    sortable: true,
    width: 390,
    renderCell: (params) => {
      return (
        <>
          <Stack
            direction="row"
            spacing={2}
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {params?.row?.attributes?.lead_owner?.profile_photo?.url && (
              <Avatar
                sx={{ width: "42px", height: "42px" }}
                alt="Remy Sharp"
                src={params?.row?.attributes?.lead_owner?.profile_photo?.url}
              />
            )}
            {!params?.row?.attributes?.lead_owner?.profile_photo?.url && (
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
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "common.black",
                      "& .MuiTooltip-arrow": {
                        color: "common.black",
                      },
                      fontWeight: 400,
                    },
                  },
                }}
                arrow
                title={params?.row?.attributes?.contact_detail?.full_name}
                placement="top-start"
              >
                <span className="ma-userName-table">
                  {params?.row?.attributes?.contact_detail?.full_name
                    ? params?.row?.attributes?.contact_detail?.full_name
                    : "N/A"}
                </span>
              </Tooltip>

              <span className="ma-userPost-table">
                {returnSubstring(params?.row?.attributes?.contact_detail?.designation, 10) || "No Designation"}
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
    headerName: "EMAIL",
    width: 270,
    renderCell: (params) => {
      return (
        <span className="linkStyling">
          {params?.row?.attributes?.contact_detail?.email
            ? params?.row?.attributes?.contact_detail?.email
            : "N/A"}
        </span>
      );
    },
  },
  {
    field: "phone_number",
    sortable: true,
    headerName: "Phone",
    width: 180,

    valueGetter: (params) =>
      `${params?.row?.attributes?.contact_detail?.country_code} ${params?.row?.attributes?.contact_detail?.phone_number}`,
    // "124-452-855"
  },
  {
    field: "stage",
    sortable: true,
    headerName: "STAGE",
    width: 180,
    valueGetter: (params) =>
      `${
        params?.row?.attributes?.stage ? params?.row?.attributes?.stage : "N/A"
      }`,
  },
  {
    field: "pipeline_score",
    sortable: true,
    headerName: "SCORE(%)",
    width: 180,
    valueGetter: (params) =>
      `${
        params?.row?.attributes?.pipeline_score
          ? params?.row?.attributes?.pipeline_score?.name
          : "N/A"
      }`,
  },
];

//deals
export const dealsHeadCells = [
  {
    field: "first_name",
    headerName: "Name",
    sortable: true,
    width: 390,
    renderCell: (cellValues) => {
      return (
        <>
          <Stack
            direction="row"
            spacing={2}
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {cellValues?.row?.attributes?.lead_owner?.profile_photo?.url && (
              <Avatar
                sx={{ width: "42px", height: "42px" }}
                alt="Remy Sharp"
                src={
                  cellValues?.row?.attributes?.lead_owner?.profile_photo?.url
                }
              />
            )}
            {!cellValues?.row?.attributes?.lead_owner?.profile_photo?.url && (
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
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "common.black",
                      "& .MuiTooltip-arrow": {
                        color: "common.black",
                      },
                      fontWeight: 400,
                    },
                  },
                }}
                arrow
                title={cellValues?.row?.attributes?.contact_detail?.full_name}
                placement="top-start"
              >
                <span className="ma-userName-table">
                  {cellValues?.row?.attributes?.contact_detail?.full_name
                    ? cellValues?.row?.attributes?.contact_detail?.full_name
                    : "N/A"}
                </span>
              </Tooltip>
              <span className="ma-userPost-table">
                {returnSubstring(cellValues?.row?.attributes?.contact_detail?.designation, 10) || "No Designation"}
              </span>
            </div>
          </Stack>
        </>
      );
    },
  },
  {
    field: "sign_off_date",
    sortable: true,
    headerName: "Sign Off Date",
    width: 200,
    valueGetter: (params) =>
      params?.row.attributes?.sign_off_date
        ? `${moment(params?.row?.attributes?.sign_off_date)
            .utc()
            .format("DD MMM YYYY")}`
        : "N/A",
  },
  {
    field: "value",
    sortable: true,
    headerName: "Deal value",
    width: 200,
    valueGetter: (params) =>
      params?.row?.attributes?.value
        ? `$ ${params?.row?.attributes?.value}`
        : "N/A",
  },
  {
    field: "payment_mode",
    sortable: true,
    headerName: "Payment Mode",
    width: 270,
    valueGetter: (params) =>
      params?.row?.attributes?.payment_mode
        ? `${params?.row?.attributes?.payment_mode?.id}`
        : "N/A",
  },
  {
    field: "tenure",
    sortable: true,
    width: 270,
    headerName: "Deal tenure",
    valueGetter: (params) =>
      params?.row?.attributes?.tenure
        ? `${params?.row?.attributes?.tenure}`
        : "N/A",
  },
];

//meetings
export const meetingsHeadCells = [
  {
    field: "organizer",
    headerName: "Organizer",
    sortable: true,
    width: 420,
    valueGetter: (params) =>
      `${params?.row?.full_name ? params?.row?.full_name : "N/A"}`,
    renderCell: (cellValues) => {
      return (
        <>
          <Stack
            direction="row"
            spacing={2}
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {cellValues?.row?.attributes?.organizer?.profile_photo?.url && (
              <Avatar
                sx={{}}
                alt="Remy Sharp"
                src={cellValues?.row?.attributes?.organizer?.profile_photo?.url}
              />
            )}
            {!cellValues?.row?.attributes?.organizer?.profile_photo?.url && (
              <Avatar sx={{}} alt="Remy Sharp">
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
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "common.black",
                      "& .MuiTooltip-arrow": {
                        color: "common.black",
                      },
                      fontWeight: 400,
                    },
                  },
                }}
                arrow
                title={`${cellValues?.row?.attributes?.organizer.full_name}`}
                placement="top-start"
              >
                <span className="ma-userName-table">
                  {cellValues?.row?.attributes?.organizer?.full_name?.length <
                  10
                    ? cellValues?.row?.attributes?.organizer?.full_name
                    : cellValues?.row?.attributes?.organizer?.full_name?.substring(
                        0,
                        10
                      ) + "..."}
                </span>
              </Tooltip>
            </div>
          </Stack>
        </>
      );
    },
  },
  {
    field: "title",
    sortable: true,
    headerName: "Title",
    width: 270,
    renderCell: (params) => {
      return (
        <span>
          {params?.row?.attributes?.title
            ? params?.row?.attributes?.title
            : "N/A"}
        </span>
      );
    },
  },
  {
    field: "date",
    sortable: true,
    headerName: "Date",
    width: 270,
    renderCell: (params) => {
      return (
        <span>
          {params?.row?.attributes?.date
            ? params?.row?.attributes?.date
            : "N/A"}
        </span>
      );
    },
  },
  {
    field: "timezone",
    sortable: true,
    headerName: "Timezone",
    width: 180,
    renderCell: (params) => {
      return (
        <span>
          {params?.row?.attributes?.organizer?.timezone
            ? params?.row?.attributes?.organizer?.timezone
            : "N/A"}
        </span>
      );
    },
  },
  {
    field: "meeting_mode",
    sortable: true,
    headerName: "Meeting mode",
    width: 180,
    valueGetter: (params) => {
      const meeting_mode = params?.row?.attributes?.meeting_mode;
      return meeting_mode ? `${meeting_mode}` : "N/A";
    },
  },
];
//potential
export const potientialHeadCells = [
  {
    field: "first_name",
    sortable: true,
    headerName: "Name",
    width: 390,
    renderCell: (params) => {
      return (
        <Stack
          direction="row"
          spacing={2}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {params?.row?.attributes?.lead_owner?.profile_photo?.url && (
            <Avatar
              sx={{ width: "42px", height: "42px" }}
              alt="Remy Sharp"
              src={params?.row?.attributes?.lead_owner?.profile_photo?.url}
            />
          )}
          {!params?.row?.attributes?.lead_owner?.profile_photo?.url && (
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
            <Tooltip
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "common.black",
                    "& .MuiTooltip-arrow": {
                      color: "common.black",
                    },
                    fontWeight: 400,
                  },
                },
              }}
              arrow
              title={"leads"}
              placement="top-start"
            >
              <span className="ma-userName-table">
                {params?.row?.attributes?.contact_detail?.full_name
                  ? params?.row?.attributes?.contact_detail?.full_name
                  : "N/A"}
              </span>
            </Tooltip>

            <span className="ma-userPost-table">
              {returnSubstring(params?.row?.attributes?.contact_detail?.designation, 10) || "No Designation"}
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
      return (
        <span className="linkStyling">
          {params?.row?.attributes?.contact_detail?.email
            ? params?.row?.attributes?.contact_detail?.email
            : "N/A"}
          {/* abc@g.com */}
        </span>
      );
    },
  },
  {
    field: "phone_number",
    sortable: true,
    headerName: "Phone",
    width: 180,
    valueGetter: (params) =>
      `${
        params?.row?.attributes?.contact_detail?.country_code
          ? params?.row?.attributes?.contact_detail?.country_code
          : ""
      } ${
        params?.row?.attributes?.contact_detail?.phone_number
          ? params?.row?.attributes?.contact_detail?.phone_number
          : "N/A"
      }`,
  },
  {
    field: "lead_source",
    sortable: true,
    width: 180,
    headerName: "Lead Source",
    valueGetter: (params) =>
      params?.row?.attributes?.lead_source?.name
        ? `${params?.row?.attributes?.lead_source?.name}`
        : "N/A",
  },
  {
    field: "company_name",
    sortable: true,
    headerName: "Company",
    width: 180,
    renderCell: (params) => {
      return (
        <span>
          {params?.row?.attributes?.contact_detail?.company_name
            ? params?.row?.attributes?.contact_detail?.company_name
            : "N/A"}{" "}
        </span>
      );
    },
  },
];
//reports
export const reportsHeadCells = [
  {
    field: "name",
    sortable: true,
    headerName: "Name",
    width: 270,
    renderCell: (params) => {
      return params?.row?.attributes?.name;
    },
  },
  {
    field: "description",
    sortable: true,
    headerName: "Description",
    width: 180,
    valueGetter: (params) =>
      `${
        params?.row?.attributes?.description
          ? params?.row?.attributes?.description
          : "N/A"
      }`,
  },
  {
    field: "report_folder",
    sortable: true,
    width: 180,
    headerName: "Report Folder",
    valueGetter: (params) =>
      params?.row?.attributes?.report_folder
        ? `${params?.row?.attributes?.report_folder}`
        : "N/A",
  },
  {
    field: "created_by",
    sortable: true,
    headerName: "Report Owner",
    width: 180,
    renderCell: (params) => {
      return (
        <span className="linkStyling">
          {" "}
          {params?.row?.attributes?.created_by
            ? params?.row.attributes?.created_by
            : "N/A"}{" "}
        </span>
      );
    },
  },
  {
    field: "updated_at",
    sortable: true,
    headerName: "Last Accessed Date",
    width: 180,
    renderCell: (params) => {
      return (
        <span>
          {params?.row?.attributes?.updated_at
            ? params?.row?.attributes?.updated_at
            : "N/A"}
        </span>
      );
    },
  },
];
// notes
export const notesHeadCells = [
  {
    field: "title",
    sortable: true,
    headerName: "Title",
    width: 270,
    valueGetter: (params) =>
      `${
        params?.row?.attributes?.title ? params?.row?.attributes?.title : "N/A"
      }`,
  },
  {
    field: "description",
    sortable: true,
    headerName: "Description",
    width: 180,
    valueGetter: (params) =>
      `${
        params?.row?.attributes?.description
          ? params?.row?.attributes?.description
          : "N/A"
      }`,
    // "124-452-855"
  },
  {
    field: "created_at",
    sortable: true,
    width: 180,
    headerName: "Created at",
    valueGetter: (params) =>
      params?.row?.attributes?.created_at
        ? `${params?.row?.attributes?.created_at}`
        : "N/A",
  },
  {
    field: "noteable_type",
    sortable: true,
    headerName: "Noteable type",
    width: 180,
    renderCell: (params) => {
      return (
        <span className="linkStyling">
          {" "}
          {params?.row?.attributes?.noteable_type
            ? params?.row?.attributes?.noteable_type
            : "N/A"}{" "}
        </span>
      );
    },
  },
  {
    field: "updated_at",
    sortable: true,
    headerName: "Updated at",
    width: 180,
    renderCell: (params) => {
      return (
        <span>
          {params?.row?.attributes?.updated_at
            ? params?.row?.attributes?.updated_at
            : "N/A"}
        </span>
      );
    },
  },
];
//callinformation
export const callinfoHeadCells = [
  {
    field: "sunject",
    sortable: true,
    headerName: "Subject",
    width: 270,
    renderCell: (params) => {
      return `${
        params?.row?.attributes?.subject
          ? params?.row?.attributes?.subject
          : "N/A"
      }`;
    },
  },
  {
    field: "status",
    sortable: true,
    headerName: "Status",
    width: 180,
    valueGetter: (params) =>
      `${
        params?.row?.attributes?.status
          ? params?.row?.attributes?.status
          : "N/A"
      }`,
    // "124-452-855"
  },
  {
    field: "created_at",
    sortable: true,
    width: 180,
    headerName: "Created at",
    valueGetter: (params) =>
      params?.row?.attributes?.created_at
        ? `${params?.row?.attributes?.created_at}`
        : "N/A",
  },
  {
    field: "callable_type",
    sortable: true,
    headerName: "Call type",
    width: 180,
    renderCell: (params) => {
      return (
        <span className="linkStyling">
          {" "}
          {params?.row?.attributes?.callable_type
            ? params?.row?.attributes?.callable_type
            : "N/A"}{" "}
        </span>
      );
    },
  },
  {
    field: "updated_at",
    sortable: true,
    headerName: "Updated at",
    width: 180,
    renderCell: (params) => {
      return (
        <span>
          {params?.row?.attributes?.updated_at
            ? params?.row?.attributes?.updated_at
            : "N/A"}
        </span>
      );
    },
  },
];
// task

export const taskHeadCells = [
  {
    field: "subject",
    sortable: true,
    headerName: "Subject",
    width: 270,
    valueGetter: (params) => {
      return `${
        params?.row?.attributes?.subject
          ? params?.row?.attributes?.subject
          : "N/A"
      }`;
    },
  },
  {
    field: "status",
    sortable: true,
    headerName: "Status",
    width: 180,
    valueGetter: (params) => {
      const status = (params?.row?.attributes?.status).replace(/_/g, " ");
      return `${status ? status : "N/A"}`;
    },
  },
  {
    field: "created_at",
    sortable: true,
    width: 180,
    headerName: "Created at",
    valueGetter: (params) =>
      params?.row?.attributes?.created_at
        ? `${params?.row?.attributes?.created_at}`
        : "N/A",
  },
  {
    field: "taskable_type",
    sortable: true,
    headerName: "Taskable type",
    width: 180,
    renderCell: (params) => {
      return (
        <span className="linkStyling">
          {" "}
          {params?.row?.attributes?.taskable_type
            ? params?.row?.attributes?.taskable_type
            : "N/A"}{" "}
        </span>
      );
    },
  },
  {
    field: "updated_at",
    sortable: true,
    headerName: "Updated at",
    width: 180,
    renderCell: (params) => {
      return (
        <span>
          {params?.row?.attributes?.updated_at
            ? params?.row?.attributes?.updated_at
            : "N/A"}
        </span>
      );
    },
  },
];

//lost Leads
export const LostleadsHeadCells = [
  {
    field: "created_at",
    sortable: true,
    headerName: "Created At",
    width: 250,
    valueGetter: (params) =>
      params?.row?.attributes?.created_at
        ? `${params?.row?.attributes?.created_at}`
        : "N/A",
  },
  {
    field: "description",
    sortable: true,
    width: 250,
    headerName: "Description",
    valueGetter: (params) =>
      params?.row?.attributes?.description
        ? `${params?.row?.attributes?.description}`
        : "N/A",
  },
  {
    field: "updated_at",
    sortable: true,
    headerName: "Updated At",
    width: 250,
    renderCell: (params) => {
      return (
        <span className="linkStyling">
          {" "}
          {params?.row?.attributes?.updated_at
            ? params?.row?.attributes?.updated_at
            : "N/A"}{" "}
        </span>
      );
    },
  },
];
