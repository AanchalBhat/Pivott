import { useCallback, useContext, useEffect, useState } from "react";
import CampaignsBar from "../../components/Email Campaigns/CampaignsBar";
import TemplatesList from "./TemplatesList";
import debouce from "lodash.debounce";
import { templateApi } from "../../apis/templateApi";
import { DataContext } from "../../context";
import { Toaster } from "../common/Toaster";
import { getMethodError } from "../../constants/errorMessages";

const Templates = () => {
  const { setGlobalTemplatesData } = useContext(DataContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [srchData, setSrchData] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loader, setLoader] = useState(false);

  const debounceSave = useCallback(
    debouce(function (e, check) {
      CallSearchApi(e, check);
    }, 600),
    []
  );

  useEffect(() => {
    if (srchData) {
      CallSearchApi(searchQuery);
    }
  }, [page]);

  const handleSearchChange = (e) => {
    let data = e.target.value;
    setSearchQuery(data);
    if (page === 1) {
      debounceSave(data);
    } else {
      setPage(1);
    }
    if (data) {
      setSrchData(true);
    } else {
      setSrchData(false);
    }
  };

  const CallSearchApi = (data) => {
    setLoader(true);
    templateApi
      .templateSearch(page, pageSize, data)

      .then((response) => {
        if (response?.data?.length > 0) {
          const attr = response?.data?.map((event, index) => {
            return event;
          });
          setGlobalTemplatesData(attr);
        } else {
          setGlobalTemplatesData([]);
        }
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };
  return (
    <>
      <div className="ma-emailMainShadow-box">
        <div>
          <CampaignsBar
            handleSearchChange={handleSearchChange}
            showActions={false}
            showAllLeads={false}
          />
          <TemplatesList
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            loader={loader}
            setLoader={setLoader}
          />
        </div>
      </div>
    </>
  );
};

export default Templates;
