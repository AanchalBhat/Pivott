import { useEffect, useState, useContext } from "react";
import {
  BlockManager,
  BasicType,
  AdvancedType,
} from "easy-email-core";
import { DesktopEmailPreview, EmailEditorProvider, MobileEmailPreview } from "easy-email-editor";
import "easy-email-extensions/lib/style.css";
import "easy-email-editor/lib/style.css";
import "@arco-themes/react-easy-email-theme/css/arco.css";
import { Grid, Typography, IconButton, Divider, Box } from '@mui/material';
import { Close as CloseIcon, DesktopWindows, PhoneAndroid } from '@material-ui/icons';
import { DataContext } from "../../../context";
import { useLocation, useNavigate } from "react-router";
import VisibilityIcon from '@mui/icons-material/Visibility';
import styled from 'styled-components';
import { Tabs as MuiTabs, Tab as MuiTab } from '@mui/material';

const Heading = styled(Typography)`
  && {
    color: #191A47;
    font-family: Poppins;
    font-size: 26px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`;

const StyledSpan = styled.span`
    display: inline-flex;
    padding: 3px 10px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    color: #303159;
    font-family: Poppins;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    border-radius: 3px;
    border: 1px solid #E8E8ED;
    background: #F1F1F4;
    margin: 0px 10px;
`;

const StyledTabs = styled(MuiTabs)`
  && {
    font-size: 13px;
    color: #47486C;
  }
`;

const StyledTab = styled(MuiTab)`
  && {
    font-size: 13px;
    color: #47486C;
    min-width: 108px;
    height: 40px;
    background: #FFF;
    text-transform: capitalize;
    font-weight: 500;
    display: flex;
    gap: 4px;
    flex-direction: row;
    border: 1px solid #D1D1DA;
    padding: 4px 20px;
  }
  &.Mui-selected {
    color: #2C42B5;
    background: rgba(44, 66, 181, 0.10);
    border: 1px solid #2C42B5;
  }
  &:first-of-type {
    border-radius: 8px 0px 0px 8px;
  }
  &:last-of-type {
    border-radius: 0px 8px 8px 0px;
  }
`;

export const Preview = () => {
  const { toPreviewData, setToPreviewData } = useContext(DataContext);
  const [mobileView, setMobileView] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [defaultValues, setValues] = useState({
    subject: null,
    content: BlockManager.getBlockByType(BasicType.PAGE).create({
      children: [BlockManager.getBlockByType(AdvancedType.WRAPPER).create()],
    }),
  });

  useEffect(() => {
    if (toPreviewData.content_json) {
      const content = JSON.parse(toPreviewData.content_json);
      setValues({
        ...content,
        content: content.content,
      });
    }
  }, []);

  const handleClosePopup = () => {
    if (location?.state?.navigateFrom === "selectCardPreview") {
      setToPreviewData({});
    }
    navigate(-1);
  }

  return (

    <>
      <Grid sx={{ padding: '22px 25px' }} className="d-flex align-items-center" container lg={12} spacing={2}>

        <Grid item xs={5}>
          <Box className="d-flex align-items-center">
            <Heading variant="span">Email Content Editor</Heading>
            <Typography variant="span">
              <StyledSpan>
                <VisibilityIcon sx={{ fontSize: "12px" }} />
                Preview
              </StyledSpan>
            </Typography>
          </Box>
        </Grid>

        <Grid className="d-flex" item xs={4}>
          <Box>
            <StyledTabs value={mobileView ? 1 : 0}
              TabIndicatorProps={{
                style: { display: 'none' }
              }} textColor="primary">
              <StyledTab
                onClick={() => setMobileView(false)}
                label={
                  <>
                    <DesktopWindows sx={{ width: "22px", marginRight: "4px" }} />
                    <span>Desktop</span>
                  </>
                }
              />
              <StyledTab
                onClick={() => setMobileView(true)}
                label={
                  <>
                    <PhoneAndroid sx={{ width: "22px", marginRight: "4px" }} />
                    <span>Mobile</span>
                  </>
                }
              />
            </StyledTabs>
          </Box>
        </Grid>

        <Grid className="d-flex justify-content-end" item xs={3}>
          <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={() => handleClosePopup()} color="dark">
              <CloseIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      <Divider />
      <EmailEditorProvider
        data={defaultValues}
        height={'calc(100vh - 72px)'}
        autoComplete
        dashed={false}
      >
        {({ values }) => {
          return mobileView ? <MobileEmailPreview /> : <DesktopEmailPreview />;
        }}
      </EmailEditorProvider>
    </>
  );
}

export default Preview;
