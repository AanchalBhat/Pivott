import { createContext, useState } from "react";

const DataContext = createContext({});

const DataProvider = ({ children }) => {
  const [isStage, setIsStage] = useState(false);
  const [isType, setIsType] = useState(false);
  const [globalArchiveCampaign, setGlobalArchiveCampaign] = useState([]);
  const [globalEmailCampaign, setGlobalEmailCampaign] = useState([]);
  const [globalHead, setGlobalHead] = useState([]);
  const [globalLeads, setGlobalLeads] = useState([]);
  const [globalDeals, setGlobalDeals] = useState([]);
  const [globalPotential, setGlobalPotential] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [notes, setNotes] = useState([]);
  const [deals, setDeals] = useState([]);
  const [globalPipeline, setGlobalPipeline] = useState([]);
  const [globalBoard, setGlobalBoard] = useState([]);
  const [emailCampaignData, setEmailCampaignData] = useState();
  const [campaignTableReload, setCampaignTableReload] = useState(false);
  const [leadData, setLeadData] = useState();
  const [dealData, setDealData] = useState();
  const [pipelineData, setPipelineData] = useState();
  const [potentialData, setPotentialData] = useState();
  const [lostLeadData, setLostLeadData] = useState();
  const [archiveCampaignId, setArchiveCampaignId] = useState([]);
  const [emailCampaignId, setEmailCampaignId] = useState([]);
  const [emailCampaignObj, setEmailCampaignObj] = useState([]);
  const [leadPopupid, setLeadPopupId] = useState([]);
  const [pipelineid, setPipelineId] = useState([]);
  const [reportId, setReportId] = useState([]);
  const [lostLeadId, setLostLeadId] = useState([]);
  const [potentialid, setPotenialeId] = useState([]);
  const [globalLostLeads, setGlobalLostLeads] = useState([]);
  const [dealPopupId, setDealPopupId] = useState([]);
  const [lostLeadPopupId, setLostLeadPopupId] = useState([]);
  const [lostLeadUserId, setLostLeadUserId] = useState([]);
  const [overviewId, setOverviewId] = useState();
  const [reportFolderId, setReportFolderId] = useState("");
  const [reportFolderName, setReportFolderName] = useState("");
  const [createModuleFields, setCreateModuleFields] = useState({});
  const [manageStateCopy, setManageStateCopy] = useState();
  const [overviewHeaderData, setOverviewHeaderData] = useState();
  const [globalTemplatesData, setGlobalTemplatesData] = useState([]);
  const [manageLabel, setManageLabel] = useState({
    name: 1,
    description: 1,
    last_accessed_date: 1,
    updated_at: 1,
    report_folder_id: 1,
    primary_module: 1,
    created_by: 1,
  });
  const [manageOverviewLabel, setManageOverviewLabel] = useState({
    company_name: 1,
    email: 1,
    phone_number: 1,
    lead_source_id: 1,
    first_name: 1,
    last_name: 1,
    owner: 1,
    stage: 1,
    amount: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // global array lead status, source and users
  const [globalManageUser, setGlobalManageUser] = useState([]);
  const [deactivateUserId, setDeactivateUserId] = useState([]);
  const [isCompName, setIsCompName] = useState(false);
  const [deviceAddr, setDeviceAddress] = useState("");
  const [counter, setCounter] = useState(0);
  const [crudField, setCrudField] = useState("");
  const [isMoveFolder, setIsMoveFolder] = useState(false);
  const [userDataCall, setuserDataCall] = useState("");
  const [globalDraftData, setGlobalDraftData] = useState([]);
  const [draftDataId, setDraftDataId] = useState([]);
  const [toPreviewData, setToPreviewData] = useState({});
  const [allListOptions, setAllListOptions] = useState([]);
  
  const dataState = {
    globalEmailCampaign, setGlobalEmailCampaign,
    globalArchiveCampaign, setGlobalArchiveCampaign,
    emailCampaignData, setEmailCampaignData,
    emailCampaignId, setEmailCampaignId,
    globalDraftData, setGlobalDraftData,
    draftDataId, setDraftDataId,
    archiveCampaignId, setArchiveCampaignId,
    setuserDataCall,
    userDataCall,
    setOverviewHeaderData,
    overviewHeaderData,
    isStage,
    setIsStage,
    isType,
    setIsType,
    isMoveFolder,
    setIsMoveFolder,
    searchTerm,
    setSearchTerm,
    globalDeals,
    createModuleFields,
    setCreateModuleFields,
    setGlobalBoard,
    globalBoard,
    setReportFolderId,
    reportFolderId,
    setReportFolderName,
    reportFolderName,
    manageStateCopy,
    setManageStateCopy,
    manageLabel,
    setManageLabel,
    setGlobalDeals,
    manageOverviewLabel,
    setManageOverviewLabel,
    globalManageUser,
    setGlobalManageUser,
    overviewId,
    globalHead,
    setGlobalHead,
    setOverviewId,
    deals,

    setDeals,
    dealPopupId,
    setDealPopupId,
    dealData,
    setDealData,
    globalLeads,
    setGlobalLeads,
    tasks,
    setTasks,
    meetings,
    setMeetings,
    leadPopupid,
    setLeadPopupId,
    notes,
    setNotes,
    leadData,
    setLeadData,
    pipelineData,
    setPipelineData,
    globalPipeline,
    setGlobalPipeline,
    pipelineid,
    setPipelineId,
    reportId,
    setReportId,
    potentialData,
    setPotentialData,
    potentialid,
    setPotenialeId,
    globalPotential,
    setGlobalPotential,
    globalLostLeads,
    setGlobalLostLeads,
    lostLeadData,
    setLostLeadData,
    lostLeadId,
    setLostLeadId,
    lostLeadPopupId,
    setLostLeadPopupId,
    lostLeadUserId,
    setLostLeadUserId,
    // lead status, source and users
    isCompName, setIsCompName,
    deactivateUserId, setDeactivateUserId,
    setDeviceAddress, deviceAddr,
    counter, setCounter,
    crudField, setCrudField,
    emailCampaignObj, setEmailCampaignObj,
    campaignTableReload, setCampaignTableReload,
    globalTemplatesData, setGlobalTemplatesData,
    toPreviewData, setToPreviewData,
    allListOptions, setAllListOptions,
  };

  return (
    <DataContext.Provider value={dataState}>{children}</DataContext.Provider>
  );
};

export { DataContext, DataProvider };
