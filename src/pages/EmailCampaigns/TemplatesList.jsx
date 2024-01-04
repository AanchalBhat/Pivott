import { useContext, useEffect, useState } from "react";
import { CircularProgress, Grid, Paper } from "@mui/material";
import AddTemplate from "../../assets/add-template.svg";
import TemplateCard from "./TemplateCard";
import AddTemplateCard from "./AddTemplateCard";
import SelectTemplateDialog from "./TemplateDialogBox";
import { templateApi } from "../../apis/templateApi";
import { getMethodError } from "../../constants/errorMessages";
import { Toaster } from "../common/Toaster";
import SkeletonBlocks from "./SkeletonBlocks";
import InfiniteScroll from "react-infinite-scroll-component";
import "./Template.css";
import { DataContext } from "../../context";
import { CircularLoader } from "../common/CircularLoader";
const TemplatesList = ({ page, setPage, pageSize, loader, setLoader }) => {
  const { globalTemplatesData, setGlobalTemplatesData } =
    useContext(DataContext);
  const [openPopup, setOpenPopup] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(null);

  const handleAddTemplate = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const getTemplates = (listpage) => {
    let lspage = listpage ? listpage : page;
    setLoader(true);
    templateApi
      .getTemplates(lspage, pageSize)
      .then((response) => {
        if (response.data) {
          if (lspage === 1) {
            setGlobalTemplatesData(response.data);
          } else {
            setGlobalTemplatesData((prev) => [...prev, ...response?.data]);
          }
          setHasNextPage(response?.meta?.next_page);
        }
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        Toaster.TOAST(getMethodError(error), "error");
        console.log(error);
      });
  };

  const handleScroll = () => {
    setPage((page) => page + 1);
  };

  useEffect(() => {
    if (page > 1 && !openPopup) {
      getTemplates();
    }
  }, [page, openPopup]);

  useEffect(() => {
    if (page === 1 && !openPopup) getTemplates();
  }, [openPopup]);

  return (
    <>
      <div>
        <Paper
          className="ma-campignShadow-hide"
          sx={{ boxShadow: "none", borderRadius: "0px", padding: "36px 24px" }}
          id="scrollableDiv"
        >
          <InfiniteScroll
            dataLength={globalTemplatesData?.length}
            next={handleScroll}
            style={{ flexDirection: "row-reverse" }}
            hasMore={hasNextPage ? true : false}
            height={650}
            loader={loader && <CircularLoader />}
            scrollableTarget="scrollableDiv"
          >
            <div className="ma-campaignMain-form">
              <Grid
                container
                rowSpacing={3}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid onClick={handleAddTemplate} item xs={6} md={3}>
                  <AddTemplateCard image={AddTemplate} title="Add Template" />
                </Grid>
                {loader ? (
                  <SkeletonBlocks />
                ) : (
                  <>
                    {globalTemplatesData &&
                      globalTemplatesData.map((elem, idx) => {
                        return (
                          <Grid key={idx} item xs={6} md={3}>
                            <TemplateCard
                              props={elem}
                              getApiCall={getTemplates}
                              setPage={setPage}
                            />
                          </Grid>
                        );
                      })}
                  </>
                )}
              </Grid>
            </div>
          </InfiniteScroll>
        </Paper>
      </div>
      <SelectTemplateDialog
        navigateFrom="Templates"
        title="Start from a blank or use templates"
        openPopup={openPopup}
        handleClosePopup={() => handleClosePopup()}
      />
    </>
  );
};

export default TemplatesList;
