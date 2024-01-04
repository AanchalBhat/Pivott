import React, { useState, useEffect } from "react";
import UpgradePlan from "./UpgradePlan";
import UpgradeOrderDetail from "./UpgradOrderDetail";
import { Box, Grid, Typography } from "@mui/material";
import SaveUptoImg from "../../../assets/save_upto.svg";
import { useNavigate } from "react-router-dom";
import { SubscriptionApi } from "../../../apis/SubscriptionApi";
import { FREE, GET_STARTED_FREE, ALREADY_IN_USE, BUY_NOW } from "../../../utils/constants";
import { CircularLoader } from "../../common/CircularLoader";

export const Upgrade = ({ landingPage = false, changeTxt }) => {
    const [subscriptionArr, setSubscriptionArr] = useState([])
    const [showOrder, setShowOrder] = useState(false)
    const [activeTab, setActiveTab] = useState('monthly');
    const [hoveredIndex, setHoveredIndex] = useState("1");
    const navigate = useNavigate();

    useEffect(() => {
        if (activeTab) {
            getSubscription();
        }
    }, [activeTab]);

    const getSubscription = () => {
        SubscriptionApi.getSubscription(activeTab)
            .then((res) => {
                if (res?.data) {
                    setSubscriptionArr(res?.data);
                }
            })
            .catch(err => console.log(err))
    }

    const handleHover = (index) => {
        setHoveredIndex(index);
    };

    const handleSubcription = () => {
        if (landingPage) {
            navigate('/login')
        } else {
            setShowOrder(true)
        }
    }

    const handleOrderDetailClose = () => {
        setShowOrder(false)
    }

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const getButtonText = (name, landingPage, changeTxt) => {
        if (landingPage && name === FREE) {
            return GET_STARTED_FREE;
        } else if (changeTxt && name === FREE) {
            return ALREADY_IN_USE;
        } else {
            return BUY_NOW;
        }
    }

    return (
            <>
                <Box container className="ma-upgrade-body">
                    <Typography variant="h2">
                        Choose the best plan for you
                    </Typography>
                    <div className="ma-tagBox-primary" style={{ cursor: "pointer" }}>
                        <div
                            className={`ma-primaryTag${activeTab === 'monthly' ? '-active' : ''}`}
                            onClick={() => handleTabClick('monthly')}
                        >
                            Monthly
                        </div>
                        <div
                            className={`ma-primaryTag${activeTab === 'yearly' ? '-active' : ''}`}
                            onClick={() => handleTabClick('yearly')}
                        >
                            Yearly
                        </div>
                    </div>
                    <div className="ma-add-ons">
                        <img src={SaveUptoImg} alt="save-upto-15" />
                    </div>
                    <Grid container spacing={2} xs={10} md={10} lg={landingPage ? 8 : 10}
                        className="ma-upgradePopup-grid">
                        {
                            subscriptionArr.length > 0 && (
                                subscriptionArr.map((elem, index) => {
                                    return (
                                        <Grid className="m-auto w-100" item xs={12} md={10} lg={6} key={index}
                                            onMouseEnter={() => handleHover(index)}
                                            onMouseLeave={() => handleHover(1)}
                                        >
                                            <UpgradePlan
                                                {...elem.attributes}
                                                btn_txt={getButtonText(elem.attributes.name, landingPage, changeTxt)}
                                                handleClick={handleSubcription}
                                            />
                                        </Grid>
                                    )
                                }))
                        }
                    </Grid>
                </Box>
                {
                    showOrder && <UpgradeOrderDetail open={showOrder} onClose={handleOrderDetailClose} />
                }
            </>
    )
} 
