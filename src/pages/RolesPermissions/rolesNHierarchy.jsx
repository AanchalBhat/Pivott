import React, { useState, useEffect, useContext } from "react";
import { TreeTable } from "primereact/treetable";
import { useNavigate } from "react-router-dom";
import { Column } from "primereact/column";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { RolesApi } from "../../apis/RolesApi";
import { Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "../../styles/global/common.css";
import { DataContext } from "../../context";
import { CircularLoader } from "../common/CircularLoader";
import { getMethodError } from "../../constants/errorMessages";
import { Toaster } from "../common/Toaster";
import { returnSubstring } from "../../utils";

export default function RolesNHierarchy({ addNewUserClick }) {
  const [nodes, setNodes] = useState([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [loader, setLoader] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
  const { setOverviewHeaderData } = useContext(DataContext);
  const user_info = JSON.parse(localStorage.getItem("user_info"));
  const role = user_info.role.role_name;
  const userID = user_info.id;

  useEffect(() => {
    getParentData();
  }, [page, addNewUserClick]);

  const getParentData = () => {
    setLoader(true);
    RolesApi.getParents(page, pageSize)
      .then((response) => {
        setLoader(false);
        if (response?.data) {
          const _nodes = response?.data?.map((elem) => {
            return {
              key: elem.id,
              data: {
                name: elem.attributes.full_name,
                email: elem.attributes.email,
                role: elem.attributes.role.name,
                profile_photo: elem.attributes.profile_photo?.url,
                designation: elem.attributes.designation,
              },
              leaf: !elem.attributes.has_children,
            };
          });
          setTotalRecords(response.meta.total_records);
          setNodes(_nodes);
        }
      })
      .catch((error) => {
        setLoader(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const reccur = (ancestry, level, node, lazyNode) => {
    if (level > ancestry?.length) {
      return;
    }
    const size = ancestry?.length;
    return node.map((elem) => {
      if (elem.key === ancestry[level - 1]) {
        if (level === size) {
          elem = lazyNode;
        } else {
          elem.children = reccur(ancestry, level + 1, elem.children, lazyNode);
        }
      }
      return elem;
    });
  };

  const getChildNodes = (lazyNode, key) => {
    RolesApi.getChilds(key)
      .then((response) => {
        if (response.data) {
          lazyNode.children = response.data.map((elem) => {
            return {
              key: elem.id,
              data: {
                name: elem.attributes.full_name,
                email: elem.attributes.email,
                role: elem.attributes.role.name,
                profile_photo: elem.attributes.profile_photo?.url,
                designation: elem.attributes.designation,
              },
              leaf: !elem.attributes.has_children,
            };
          });
          let ancestry;
          if (role === "manager") {
            const temp = response?.data[0]?.attributes?.ancestry?.split("/");
            const newAncestry = [];
            let flag = false;
            for (let i = 0; i < temp?.length; i++) {
              if (+temp[i] === userID) {
                flag = true;
              }
              if (flag) {
                newAncestry.push(temp[i]);
              }
            }
            ancestry = newAncestry;
          } else {
            ancestry = response?.data[0]?.attributes?.ancestry?.split("/");
          }
          let _nodes = reccur(ancestry, 1, nodes, lazyNode);
          setNodes(_nodes);
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const onExpand = (event) => {
    if (!event.node.children) {
      let lazyNode = { ...event.node };
      getChildNodes(lazyNode, event.node.key);
    }
  };

  const onPage = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    setPage(event.page + 1);
  };

  const togglerTemplate = (node, options) => {
    if (!node) {
      return;
    }

    const style1 = {
      border: "none",
      borderRadius: "50%",
      marginRight: "10px",
    };

    const style2 = {
      padding: "3px",
      borderRadius: "50%",
      width: "23px",
      height: "23px",
      border: "none",
      color: "#fff",
    };

    return (
      <button
        type="button"
        data-testid="arrowKey-btn"
        style={{ ...options.buttonStyle, ...style1 }}
        tabIndex={-1}
        onClick={options.onClick}
      >
        <span
        // aria-hidden="true"
        >
          {!options.expanded ? (
            <KeyboardArrowDownIcon
              data-testId="expand-btn"
              sx={{ ...style2, background: "#bebfca" }}
            />
          ) : (
            <KeyboardArrowUpIcon
              data-testId="expand-more-btn"
              sx={{ ...style2, background: "#2c42b5" }}
            />
          )}
        </span>
      </button>
    );
  };

  const representativeBodyTemplate = (rowData) => {
    const representative = rowData.data;
    return (
      <div className="ma-treeTable-container">
        {representative?.profile_photo && (
          <Avatar
            className="ms-1 me-1"
            sx={{ verticalAlign: "middle" }}
            alt="Remy Sharp"
            src={representative?.profile_photo}
          />
        )}
        {!representative?.profile_photo && (
          <Avatar
            className="ms-1 me-1"
            sx={{ verticalAlign: "middle" }}
            alt="Remy Sharp"
          >
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
          <span className="ms-1 image-text">{representative.name}</span>
          <span className="ma-userPost-table" style={{ marginLeft: "7px" }}>
            {returnSubstring(representative.designation, 10) || "No Designation"}
          </span>
        </div>
      </div>
    );
  };

  const handleRowClick = (event) => {
    const header = {
      full_name: event?.node?.data?.name,
      email: event?.node?.data?.email,
      sub_head: event?.node?.data?.role,
    };
    setOverviewHeaderData(header);
    navigate(
      `/roles-permissions/manage-users/user-details/${event?.node?.key}`,
      {
        state: {
          title: "hierarchy",
        },
      }
    );
  };

  return (
    <div style={{ width: "100%", overflow: "hidden", overflowX: "auto" }}>
      {loader ? (
        <CircularLoader />
      ) : (
        <>
          <TreeTable
            indentation="10"
            value={nodes}
            lazy
            paginator
            totalRecords={totalRecords}
            first={first}
            rows={rows}
            onPage={onPage}
            onExpand={onExpand}
            className="ma-treeTable-box"
            togglerTemplate={togglerTemplate}
            onRowClick={(event) => handleRowClick(event)}
          >
            <Column
              headerClassName="ma-treeTable-column-header"
              bodyClassName="ma-treeTable-column-body"
              field="name"
              header="Name"
              body={representativeBodyTemplate}
              expander
            ></Column>
            <Column
              headerStyle={{ width: "30%" }}
              bodyClassName="linkStyling"
              field="email"
              header="Email"
            ></Column>
            <Column
              headerStyle={{ width: "20%" }}
              bodyStyle={{ fontWeight: 500 }}
              field="role"
              header="Role"
            ></Column>
          </TreeTable>
        </>
      )}
    </div>
  );
}
