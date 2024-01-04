import React, { useEffect, useState } from "react";
import "../../assets/css/master.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";
import customer1 from "../../assets/images/customer1.webp";
import customer2 from "../../assets/images/customer2.png";
import customer3 from "../../assets/images/customer3.png";
import customer4 from "../../assets/images/customer4.png";
import customer5 from "../../assets/images/customer5.svg";
import customer6 from "../../assets/images/customer6.png";
import customer8 from "../../assets/images/customer8.svg";
import customer9 from "../../assets/images/customer9.svg";
import customer10 from "../../assets/images/customer10.svg";
import customer11 from "../../assets/images/customer11.svg";
import customer12 from "../../assets/images/customer12.svg";
import herorightimg from "../../assets/images/herorightimg.svg";
import userinvesting from "../../assets/images/userinvesting.png";
import explorevector from "../../assets/images/explorevector.svg";
import marketing from "../../assets/images/marketing.svg";
import sales from "../../assets/images/sales.svg";
import star from "../../assets/images/star.svg";
import g2 from "../../assets/images/g2.svg";
import mdilock from "../../assets/images/mdilock.svg";
import settingsicon from "../../assets/images/settingsicon.svg";
import linevectortop from "../../assets/images/linevectortop.svg";
import relibleimg from "../../assets/images/mockup1.png";
import relibleimg1 from "../../assets/images/mockup2.png";
import relibleimg2 from "../../assets/images/mockup3.png";
import vectorplanline from "../../assets/images/vectorplanline.svg";
import vectorplanline1 from "../../assets/images/vectorplanline1.svg";
import powerbi from "../../assets/images/powerbi.svg";
import Semrushlogo from "../../assets/images/Semrushlogo.svg";
import microsoftteams from "../../assets/images/microsoftteams.svg";
import googlemeet from "../../assets/images/googlemeet.svg";
import tableau from "../../assets/images/tableau.svg";
import engage from "../../assets/images/engage.svg";
import axiomsystemsdelivering from "../../assets/images/axiomsystemsdelivering.svg";
import healthline from "../../assets/images/healthline.svg";
import linevectorbottom from "../../assets/images/linevectorbottom.svg";
import { useNavigate } from "react-router-dom";
import { resourcesData, sliderData } from "./data";
import { Accordion } from "react-bootstrap";
import HeaderRoot from "./Header";
import FooterRoot from "./Footer";
import { Link } from "react-router-dom";
import Subscribe from "./Subscribe";
import { Upgrade } from "./Subscription/Upgrade";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ImagePopup from "./ImagePopup/ImagePopup";
import CountdownTimer from "./CountDownTimer";

export default function Root() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [displayImg, setDisplayImg] = useState(false);
  const navigate = useNavigate();
  const NOW_IN_MS = new Date().getTime();

  // Set the desired date (December 1, 2023)
  const desiredDate = new Date(2023, 11, 1); // Months are 0-based in JavaScript, so 11 is December

  const dateTimeAfterThreeDays = desiredDate.getTime();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setDisplayImg(true);
  };
  const handleClosePopup = () => {
    setSelectedImage(null);
    setDisplayImg(false);
  };

  return (
    <>
      <HeaderRoot />
      <main>
        <section className="ps-heroBanner-sec">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 me-auto">
                <div className="ps-banner-wrapper">
                  <h1 data-aos="fade-up" data-aos-duration={500}>
                    Experience the power of AI in your sales and Marketing
                    operations with Pivott
                  </h1>
                  <p data-aos="fade-up" data-aos-duration={1000}>
                    Most advanced customer life cycle management Software
                    designed to automate your business.
                  </p>
                  <div
                    className="ps-tryTo-free"
                    data-aos="fade-up"
                    data-aos-duration={1500}
                  >
                    <button
                      className="ps-btn"
                      type="button"
                      onClick={() => navigate("/signup")}
                      style={{ hover: "none" }}
                    >
                      Get Started Free
                    </button>
                    {/* <form>
                      <div className="form-group">
                        <input type="text" placeholder="Email Address*" />
                        <button type="submit" className="btn btn-primary">
                          Get Started
                        </button>
                      </div>
                    </form> */}
                  </div>
                  <p className="ps-sub-rating">
                    {" "}
                    <img src={g2} alt="g2-logo" /> <img src={star} alt="star" />{" "}
                    4.8 from 1000+ review |{" "}
                    <img src={mdilock} alt="mdilock icon" /> soc2 Compliant
                  </p>
                </div>
              </div>
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div
                  className="ps-heroImg-box"
                  data-aos="zoom-in"
                  data-aos-duration={1000}
                >
                  <img src={herorightimg} alt="hero-image" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <CountdownTimer targetDate={dateTimeAfterThreeDays} />

        {/* <section className="ps-trusted-customers">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xxl-8 mx-auto">
                <div className="ps-heading-title">
                  <h2>
                    Frontrunners of sales and Marketing Automation through
                    Pivott.
                  </h2>
                </div>
                <div className="ps-trustedBox-log">
                  <div className="ps-slider-logo">
                    <div className="ps-slide-track">
                      <div className="ps-slider">
                        <img src={customer1} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={customer2} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={customer3} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={customer4} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={customer5} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={customer6} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={customer1} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={customer2} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={customer3} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={customer4} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={customer5} alt="" />
                      </div>
                    </div>
                  </div>
                  <div className="ps-slider-logo">
                    <div className="ps-slide-track1">
                      <div className="ps-slider">
                        <img src={customer11} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={customer10} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={customer9} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={customer8} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={customer6} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={customer12} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={customer10} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={customer9} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={customer8} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={customer6} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
        <section className="ps-investing-sec">
          <div className="container">
            <div className="row">
              <div className="col-xxl-7 col-xl-8 col-lg-8 col-md-10 col-sm-12 mx-auto">
                <div className="ps-heading-title">
                  <h2 data-aos="fade-up" data-aos-duration={500}>
                    Make Every Interaction Count with Pivott
                  </h2>
                  <p data-aos="fade-up" data-aos-duration={1000}>
                    Centralize the entire documentation process by sending
                    trackable quotes, proposals and contracts from within
                    Pivott.
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xxl-7 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="ps-investing-box">
                  <img
                    src={userinvesting}
                    alt="user"
                    data-aos="zoom-in"
                    data-aos-duration={3000}
                  />
                  <ul>
                    <li>
                      <h3>+40%</h3>
                      <p>Enjoy better sales revenue with Pivott</p>
                    </li>
                    <li>
                      <h3>+38%</h3>
                      <p>Get better forecasting with Pivott</p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xxl-5 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="ps-investing-faq">
                  <Accordion defaultActiveKey={"0"} flush>
                    <Accordion.Item
                      eventKey="0"
                      data-aos="fade-up"
                      data-aos-duration={500}
                    >
                      <Accordion.Header>
                        <img src={marketing} alt="sales icon" />
                        1. Setup Your Pipeline
                      </Accordion.Header>
                      <Accordion.Body>
                        Drive pipeline like never before with us. Our sales
                        pipeline consists of all the different stages that
                        prospects go through to become customers. It gives a
                        clear picture of the sales process by showing deals that
                        a salesperson is handling and at what stage the sales
                        process of your prospects is.
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item
                      eventKey="1"
                      data-aos="fade-up"
                      data-aos-duration={1000}
                    >
                      <Accordion.Header>
                        <img src={marketing} alt="sales icon" />
                        2. Track Progress
                      </Accordion.Header>
                      <Accordion.Body>
                        Our CRM allows you to track your progress and streamline
                        your business operations. It provides insights so your
                        team can optimize strategies, enhance customer
                        satisfaction, and cultivate lasting relationships.
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item
                      eventKey="2"
                      data-aos="fade-up"
                      data-aos-duration={1500}
                    >
                      <Accordion.Header>
                        <img src={sales} alt="sales icon" />
                        3. Automate Growth
                      </Accordion.Header>
                      <Accordion.Body>
                        Our CRM reduces the need for manual tasks by automating
                        processes through enhanced collaboration, centralized
                        customer data, and communication.
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="ps-retirment-sec">
          <div className="container">
            <div className="row">
              <div className="col-xxl-12">
                <div
                  className="ps-retirment-box"
                  data-aos="zoom-in"
                  data-aos-duration={1000}
                >
                  <h2>Build a high potential sales Funnel with Pivott</h2>
                  <div className="ps-white-btn">
                    <button
                      className="ps-btn"
                      onClick={() => navigate("/signup")}
                    >
                      Get a Free Start Today!
                    </button>
                  </div>
                  <span>
                    <img src={explorevector} alt="vector img" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="ps-relible-sec pb-0">
          <div className="container">
            <div className="row">
              <div className="col-xxl-8 mx-auto">
                <div className="ps-heading-title ps-small-heading">
                  <h6 data-aos="fade-up" data-aos-duration={500}>
                    Attain Deep and Real-Time Insights
                  </h6>
                  <h2 data-aos="fade-up" data-aos-duration={1000}>
                    Increase your sales and marketing Productivity with Pivott
                  </h2>
                </div>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="ps-relible-content">
                  <span data-aos="fade-up" data-aos-duration={300}>
                    <img src={settingsicon} alt="icon" />
                  </span>
                  <h3 data-aos="fade-up" data-aos-duration={600}>
                    Visual Sales Pipeline
                  </h3>
                  <p data-aos="fade-up" data-aos-duration={900}>
                    See the pipeline of each salesperson to easily manage your
                    deals from start to finish. Our tool lets you create
                    different stages in the pipeline or even track the deal at
                    every stage.
                  </p>
                  <div
                    className="ps-login ps-explore-Pivott"
                    data-aos="fade-up"
                    data-aos-duration={1200}
                  >
                    <button
                      className="ps-btn"
                      onClick={() => navigate("/signup")}
                    >
                      Try for Free
                    </button>
                  </div>
                </div>
                <div className="ps-relible-point">
                  <ul>
                    <li data-aos="fade-up" data-aos-duration={1300}>
                      Gives a clear overview of prospects, leads, opportunities,
                      and deals
                    </li>
                    <li data-aos="fade-up" data-aos-duration={1400}>
                      Allows team to track progress, allocate resources, and
                      make informed decisions
                    </li>
                    <li data-aos="fade-up" data-aos-duration={1500}>
                      Optimizes sales process and maximizes revenue
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 order-first order-md-1">
                <div className="ps-relible-image">
                  <div
                    className="ps-relible-img"
                    data-aos="fade-right"
                    data-aos-duration={3000}
                  >
                    <img src={relibleimg} alt="image" />
                  </div>
                  <div
                    onClick={() => handleImageClick(relibleimg)}
                    className="image-preview-btn content-details fadeIn-bottom fadeIn-left"
                  >
                    <span>
                      <VisibilityIcon />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <div className="col-xxl-12">
              <div
                className="ps-linevector text-center"
                data-aos="fade-zoom-in"
                data-aos-easing="ease-in-back"
                data-aos-delay={300}
              >
                <img
                  src={linevectortop}
                  alt="line image"
                  className="text-center"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="ps-relible-sec py-0">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="ps-relible-image">
                  <div
                    className="ps-relible-img"
                    data-aos="fade-right"
                    data-aos-duration={3000}
                  >
                    <img src={relibleimg1} alt="image" />
                  </div>
                  <div
                    onClick={() => handleImageClick(relibleimg1)}
                    className="image-preview-btn content-details fadeIn-bottom fadeIn-left"
                  >
                    <span>
                      <VisibilityIcon />
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="ps-relible-content">
                  <span data-aos="fade-up" data-aos-duration={300}>
                    <img src={settingsicon} alt="icon" />
                  </span>
                  <h3 data-aos="fade-up" data-aos-duration={600}>
                    Customizable Sales Pipeline
                  </h3>
                  <p data-aos="fade-up" data-aos-duration={900}>
                    Enhance and manage your sales process through the
                    customizable sales pipeline. You can streamline lead
                    tracking, deal progression, and customer interactions to
                    achieve better sales clarity.
                  </p>
                  <div
                    className="ps-login"
                    data-aos="fade-up"
                    data-aos-duration={1200}
                  >
                    <button
                      className="ps-btn"
                      onClick={() => navigate("/signup")}
                    >
                      Try for Free
                    </button>
                  </div>
                </div>
                <div className="ps-relible-point">
                  <ul>
                    <li data-aos="fade-up" data-aos-duration={1300}>
                      Add, edit, or delete deal stages in a pipeline
                    </li>
                    <li data-aos="fade-up" data-aos-duration={1400}>
                      Assign/restrict access to deals
                    </li>
                    <li data-aos="fade-up" data-aos-duration={1500}>
                      Customize properties in each deal stage
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <div className="col-xxl-12">
              <div
                className="ps-linevector text-center"
                data-aos="fade-zoom-in"
                data-aos-easing="ease-in-back"
                data-aos-delay={300}
              >
                <img
                  src={linevectorbottom}
                  alt="line image"
                  className="text-center"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="ps-relible-sec pt-0">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="ps-relible-content">
                  <span data-aos="fade-up" data-aos-duration={200}>
                    <img src={settingsicon} alt="icon" />
                  </span>
                  <h3 data-aos="fade-up" data-aos-duration={600}>
                    Segment Leads
                  </h3>
                  <p data-aos="fade-up" data-aos-duration={900}>
                    Categorize your potential customers based on characteristics
                    like demographics, behavior, and preferences. It allows you
                    to enhance your business's conversion rates and build
                    stronger relationships.
                  </p>
                  <div
                    className="ps-login ps-explore-Pivott"
                    data-aos="fade-up"
                    data-aos-duration={1200}
                  >
                    <button
                      className="ps-btn"
                      onClick={() => navigate("/signup")}
                    >
                      Try for Free
                    </button>
                  </div>
                </div>
                <div className="ps-relible-point">
                  <ul>
                    <li data-aos="fade-up" data-aos-duration={1300}>
                      Setup touchpoints and map out your user's journey
                    </li>
                    <li data-aos="fade-up" data-aos-duration={1400}>
                      Understand the unique pain points, challenges, and
                      interests of lead groups
                    </li>
                    <li data-aos="fade-up" data-aos-duration={1500}>
                      Analyze the behavior and interaction of different lead
                      segments
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 order-first order-md-1">
                <div className="ps-relible-image">
                  <div
                    className="ps-relible-img"
                    data-aos="fade-right"
                    data-aos-duration={3000}
                  >
                    <img src={relibleimg2} alt="image" />
                  </div>
                  <div
                    onClick={() => handleImageClick(relibleimg2)}
                    className="image-preview-btn content-details fadeIn-bottom fadeIn-left"
                  >
                    <span>
                      <VisibilityIcon />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          {displayImg && (
            <ImagePopup imageUrl={selectedImage} onClose={handleClosePopup} />
          )}
        </section>
        <section className="ps-buyPlan-sec">
          <div className="container">
            <div className="row">
              <div className="col-xxl-12">
                <div className="ps-plan-box">
                  <h2 data-aos="fade-up" data-aos-duration={300}>
                    Improve Customer Satisfaction
                  </h2>
                  <h2 data-aos="fade-up" data-aos-duration={500}>
                    with Powerful CRM Processes
                  </h2>
                  <p data-aos="fade-up" data-aos-duration={800}>
                    A Reliable CRM Platform that Customer Loves
                  </p>
                  <div
                    className="ps-white-btn"
                    data-aos="fade-up"
                    data-aos-duration={1200}
                  >
                    <button
                      className="ps-btn"
                      onClick={() => navigate("/signup")}
                    >
                      Get Started Free
                    </button>
                  </div>
                  <span className="ps-vectorplan-line">
                    <img src={vectorplanline} alt="vector img" />
                  </span>
                  <span className="ps-vectorplan1-line">
                    <img src={vectorplanline1} alt="vector img" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="ps-morePivott-sec">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xxl-5 col-xl-5 col-lg-6 col-md-12 col-sm-12">
                <div className="ps-morePivott-box">
                  <h2 data-aos="fade-up" data-aos-duration={300}>
                    Integrate Pivott CRM with over 10+ apps
                  </h2>
                  <p data-aos="fade-up" data-aos-duration={500}>
                    Pivott CRM can be integrated with 10+ apps so your data can
                    flow to, from, or between them. This way, you have a
                    complete picture of your customers and business.
                  </p>
                  <div
                    className="ps-login"
                    data-aos="fade-up"
                    data-aos-duration={800}
                  >
                    <button
                      className="ps-btn"
                      onClick={() => navigate("/signup")}
                    >
                      Try for Free
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-xxl-7 col-xl-7 col-lg-6 col-md-12 col-sm-12">
                <div className="ps-trustedBox-topbottom">
                  <div className="ps-slidertopBottom-slide">
                    <div className="ps-slide-track">
                      <div className="ps-slider">
                        {/* <img src={zoomusmeet} /> */}
                      </div>
                      <div className="ps-slider">
                        <img src={powerbi} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={Semrushlogo} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={microsoftteams} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={googlemeet} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={tableau} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={engage} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={axiomsystemsdelivering} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={Semrushlogo} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={microsoftteams} />
                      </div>
                    </div>
                  </div>
                  <div className="ps-slidertopBottom-slide">
                    <div className="ps-slider">
                      <img src={microsoftteams} alt="" />
                    </div>
                    <div className="ps-slider">
                      <img src={googlemeet} alt="" />
                    </div>
                    <div className="ps-slider">
                      <img src={tableau} alt="" />
                    </div>
                    <div className="ps-slider">
                      <img src={engage} alt="" />
                    </div>
                    <div className="ps-slider">
                      <img src={axiomsystemsdelivering} alt="" />
                    </div>
                    <div className="ps-slider">
                      {/* <img src={zoomusmeet} /> */}
                    </div>
                    <div className="ps-slider">
                      <img src={powerbi} />
                    </div>
                    <div className="ps-slider">
                      {/* <img src={zoomusmeet} /> */}
                    </div>
                    <div className="ps-slider">
                      <img src={Semrushlogo} alt="" />
                    </div>
                    <div className="ps-slider">
                      <img src={microsoftteams} alt="" />
                    </div>
                  </div>
                  <div className="ps-slidertopBottom-slide">
                    <div className="ps-slide-track1">
                      <div className="ps-slider">
                        <img src={tableau} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={engage} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={axiomsystemsdelivering} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={Semrushlogo} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={microsoftteams} alt="" />
                      </div>
                      <div className="ps-slider">
                        {/* <img src={zoomusmeet} /> */}
                      </div>
                      <div className="ps-slider">
                        <img src={powerbi} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={Semrushlogo} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={microsoftteams} alt="" />
                      </div>
                      <div className="ps-slider">
                        <img src={googlemeet} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <section className="ps-testmonial-sec" id="testimonials">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xxl-12">
                <div className="ps-heading-title ps-small-heading d-flex justify-content-between align-items-center text-left mb-0">
                  <div className="text-start">
                    <h6>Testimonials</h6>
                    <h2>What Our Customers Say</h2>
                  </div>
                  <div className="ps-blue-btn ps-explore-Pivott">
                    <button className="ps-btn">View All Stories</button>
                  </div>
                </div>
                <div className="swiper ps-testmonialSwiper">
                  <div className="swiper-wrapper">
                    <Swiper
                      spaceBetween={40}
                      slidesPerView={3.5}
                      speed={1000}
                      autoplay={{
                        delay: 2000,
                      }}
                      pagination={{
                        clickable: true,
                      }}
                      modules={[Pagination, Autoplay]}
                      onSlideChange={() => {}}
                      onSwiper={(swiper) => {}}
                      breakpoints={{
                        340: {
                          slidesPerView: 1,
                        },
                        568: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        768: {
                          slidesPerView: 2.5,
                          spaceBetween: 20,
                        },
                        1024: {
                          slidesPerView: 3.5,
                          spaceBetween: 30,
                        },
                      }}
                    >
                      {sliderData &&
                        sliderData.map((data) => {
                          return (
                            <SwiperSlide>
                              <div className="ps-testmonial-box" key={data?.id}>
                                <img src={data.image} alt="" />
                                <div className="ps-testmonial-innerbox">
                                  <h2>{data?.percentage}</h2>
                                  <p>{data?.heading}</p>
                                </div>
                                <p>{data?.content}</p>
                                <h6>{data?.name}</h6>
                                <div className="ps-position-user">
                                  {data?.poition}
                                </div>
                                <a href="javascript:;">
                                  Read Customer Story
                                  <FontAwesomeIcon icon={faArrowRight} />
                                </a>
                              </div>
                            </SwiperSlide>
                          );
                        })}
                    </Swiper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
        <section className="ps-price-sec" id="pricing">
          <Upgrade landingPage={true} />
        </section>
        <section className="ps-resources-sec" id="resources">
          <div className="container">
            <div className="row">
              <div className="col-xxl-8 mx-auto">
                <div className="ps-heading-title ps-small-heading pb-0">
                  <h6>Resources</h6>
                  <h2>The Pivott Resource Center Connects Community</h2>
                </div>
              </div>
            </div>
            <div className="row">
              {/* <div className="swiper ps-testmonialSwiper-col">
                <div className="swiper-wrapper"> */}
              <Swiper
                spaceBetween={40}
                slidesPerView={3.5}
                speed={1000}
                autoplay={{
                  delay: 2000,
                }}
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination, Autoplay]}
                onSlideChange={() => {}}
                onSwiper={(swiper) => {}}
                breakpoints={{
                  340: {
                    slidesPerView: 1,
                  },
                  568: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2.5,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                }}
              >
                {resourcesData &&
                  resourcesData.map((data, index) => {
                    return (
                      <SwiperSlide>
                        <div className="ps-hieght-fix" key={indexedDB}>
                          <div
                            onClick={() => navigate(`/blogs/${data.title}`)}
                            className="ps-resources-box"
                            data-aos="fade-up"
                            data-aos-duration={data?.duration}
                          >
                            <div>
                              <img src={data?.image} alt="" />
                            </div>
                            <div className="ps-resources-content">
                              <span className="ps-chip-tag">{data?.chip}</span>
                              <h5>{data.heading}</h5>
                              <p>{data?.content}</p>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  })}
              </Swiper>
            </div>
          </div>
        </section>
        <section className="ps-healthplan-sec">
          <span className="ps-healthline-right">
            <img src={healthline} alt="line vector" />
          </span>
          <div className="container">
            <div className="row">
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="ps-health-plan">
                  <h2 data-aos="fade-up" data-aos-duration={300}>
                    Track Leads | Seal Opportunities | Take Better Decisions
                  </h2>
                  <p data-aos="fade-up" data-aos-duration={800}>
                    Increase your business’s efficiency by using Pivott. Our
                    robust cloud software allows you to streamline complex
                    business processes and build strong relationships with your
                    customers.
                  </p>
                  <div
                    className="ps-login"
                    data-aos="fade-up"
                    data-aos-duration={1200}
                  >
                    <button
                      className="ps-btn"
                      onClick={() => navigate("/signup")}
                    >
                      Signup Today!
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="ps-healthPlan-point">
                  <ul>
                    <li>Military Grade Data Security</li>
                    <li>Quick and Efficient Decision Making</li>
                    <li>Higher Customer Retention Rate</li>
                    <li>Achieve Inflated ROI’s.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Subscribe />
        <FooterRoot />
      </main>
    </>
  );
}
