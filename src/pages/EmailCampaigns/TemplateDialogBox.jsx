import { useContext, useEffect, useState } from "react";
import SelectTemplateCard from "./SelectTemplateCard";
import AddTemplateCard from "./AddTemplateCard";
import AddTemplate from "../../assets/add-template.svg";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { templateApi } from "../../apis/templateApi";
import { Toaster } from "../common/Toaster";
import { getMethodError } from "../../constants/errorMessages";
import SkeletonBlocks from "./SkeletonBlocks";
import InfiniteScroll from "react-infinite-scroll-component";
import { DataContext } from "../../context";
import { CircularLoader } from "../common/CircularLoader";
import "./Template.css";
import NotFound from "../../components/NotFound/NotFound";

const SelectTemplateDialog = ({
  navigateFrom,
  openPopup,
  handleClosePopup,
  title = "",
  showFirstCard = true,
  masterTemplate = false,
}) => {
  const navigate = useNavigate();
  const [templatesData, setTemplatesData] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loader, setLoader] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(null);
  const { setToPreviewData } = useContext(DataContext);

  const getAllTemplates = () => {
    // setLoader(true);
    let apiEndPoint = masterTemplate
      ? templateApi.getMasterTemplates(page, pageSize)
      : templateApi.getTemplates(page, pageSize);

    if (!apiEndPoint) {
      setLoader(false);
      return;
    }
    apiEndPoint
      .then((response) => {
        setLoader(false);
        if (response.data) {
          if (page === 1) {
            setTemplatesData(response.data);
          } else {
            setTemplatesData((prev) => [...prev, ...response?.data]);
          }
          setHasNextPage(response?.meta?.next_page);
        }
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
    if (page > 1 && openPopup) {
      getAllTemplates();
    }
  }, [page, openPopup]);

  useEffect(() => {
    if (page === 1 && openPopup) getAllTemplates();
  }, [openPopup]);

  const handleBlankStart = () => {
    setToPreviewData({});
    navigate("/campaign/design/template", {
      state: {
        from: navigateFrom,
      },
    });
  };
  const handleClick = (html, json) => {
    handleClosePopup();
    setToPreviewData({
      content_html: html,
      content_json: json,
    });
    navigate("/campaign/design/load", {
      state: {
        from: navigateFrom,
      },
    });
  };

  return (
    <>
      <Dialog
        open={openPopup}
        className="ma-addTemplate-popup"
        onClose={handleClosePopup}
      >
        <DialogTitle className="ma-campaign-leadTransferTitle">
          <label>{title}</label>
          <DialogActions sx={{ padding: "0" }}>
            <Button
              className="ma-campaignCross-btn"
              onClick={handleClosePopup}
              color="primary"
              autoFocus
            >
              <CloseIcon></CloseIcon>
            </Button>
          </DialogActions>{" "}
        </DialogTitle>
        <InfiniteScroll
          dataLength={templatesData?.length}
          next={handleScroll}
          hasMore={hasNextPage ? true : false}
          height={600}
          loader={<CircularLoader />}
        >
          <div>
            <div className="ma-campaignMain-form">
              <Grid
                container
                rowSpacing={3}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                sx={{ padding: "36px 18px" }}
              >
                {showFirstCard && (
                  <Grid onClick={handleBlankStart} item xs={6} md={3}>
                    <AddTemplateCard
                      image={AddTemplate}
                      title="Start from blank"
                    />
                  </Grid>
                )}
                {loader ? (
                  showFirstCard ? (
                    <SkeletonBlocks />
                  ) : (
                    <CircularLoader />
                  )
                ) : (
                  <>
                    {templatesData &&
                      templatesData.map((elem, idx) => {
                        return (
                          <Grid key={idx} item xs={6} md={3}>
                            <SelectTemplateCard
                              props={elem}
                              handleSelectThis={() =>
                                handleClick(
                                  elem.attributes.content_html,
                                  elem.attributes.content_json
                                )
                              }
                            />
                          </Grid>
                        );
                      })}
                  </>
                )}
              </Grid>
            </div>
          </div>
          {templatesData?.length <= 0 && !loader && !showFirstCard && (
            <Box container sx={{ height: "80%" }}>
              <NotFound value="No templates found" showImage={true} />
            </Box>
          )}
        </InfiniteScroll>
      </Dialog>
    </>
  );
};

export default SelectTemplateDialog;
