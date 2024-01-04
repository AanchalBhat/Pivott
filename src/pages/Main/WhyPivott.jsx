import React, { useEffect, useState } from "react";
import HeaderRoot from "./Header";
import FooterRoot from "./Footer";
import whypivottimg from "../../assets/images/why pivott.png";
import { useNavigate } from "react-router-dom";
import explorevector from "../../assets/images/explorevector.svg";
import pivotticon from "../../assets/images/pivotticon.svg";
import crmicon from "../../assets/images/crmicon.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import { faq, industries, pivottData, trustedSales } from "./data";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Subscribe from "./Subscribe";

const WhyPivott = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(0);
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : -1);
  };
  return (
    <>
      <HeaderRoot />
      <main>
        <section className="ps-about-sec">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-5">
                <div className="sc-about-content">
                  <div className="ps-morePivott-box">
                    <h2>Bridging Gaps, Connecting Futures</h2>
                    <p>
                      Pivott automates your sales and marketing process to
                      elevate customer experiences and interactions. Switch to
                      Pivott today and get ready to craft memorable customer
                      journeys.
                    </p>
                    <div class="ps-login">
                      <button
                        class="ps-btn"
                        onClick={() => navigate("/signup")}
                      >
                        Try for Free
                      </button>
                      <a href="#demo" className="ps-seedemo-link">
                        See Demo
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="pc-whypivott-img">
                  <img src={whypivottimg} alt="image" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ps-ourMission-sec ps-bgcolor-gray">
          <div className="container">
            <div className="row">
              <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 mx-auto">
                <div className="ps-heading-title ps-smallHeading-light">
                  <h2>How CRM can benefit different company sizes? </h2>
                </div>
              </div>
              <div className="col-md-4">
                <div className="ps-crm-box ps-culture-box">
                  <h4>
                    <span>
                      <svg
                        width="68"
                        height="68"
                        viewBox="0 0 68 68"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="34" cy="34" r="34" fill="#D8CBF6" />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M44.59 25.66C45.0114 26.0818 45.248 26.6537 45.248 27.25C45.248 27.8462 45.0114 28.4181 44.59 28.84L31.09 42.34C30.6682 42.7613 30.0963 42.998 29.5 42.998C28.9038 42.998 28.3319 42.7613 27.91 42.34L23.41 37.84C23.0126 37.4134 22.7962 36.8493 22.8065 36.2664C22.8168 35.6835 23.0529 35.1273 23.4652 34.7151C23.8774 34.3029 24.4336 34.0667 25.0165 34.0564C25.5994 34.0462 26.1635 34.2625 26.59 34.66L29.5 37.57L41.41 25.66C41.8319 25.2386 42.4038 25.002 43 25.002C43.5963 25.002 44.1682 25.2386 44.59 25.66Z"
                          fill="#29008A"
                        />
                      </svg>
                    </span>
                    Startup
                  </h4>
                  <p>
                    Establishing and growing a startup comes with unique
                    challenges and requirements. However, using a powerful CRM
                    system can be a game-changer as it can help startups
                    streamline processes, enhance customer relationships, and
                    drive growth.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="ps-crm-box ps-culture-box">
                  <h4>
                    <span>
                      <svg
                        width="68"
                        height="68"
                        viewBox="0 0 68 68"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="34" cy="34" r="34" fill="#F1E0AC" />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M44.59 25.66C45.0114 26.0818 45.248 26.6537 45.248 27.25C45.248 27.8462 45.0114 28.4181 44.59 28.84L31.09 42.34C30.6682 42.7613 30.0963 42.998 29.5 42.998C28.9038 42.998 28.3319 42.7613 27.91 42.34L23.41 37.84C23.0126 37.4134 22.7962 36.8493 22.8065 36.2664C22.8168 35.6835 23.0529 35.1273 23.4652 34.7151C23.8774 34.3029 24.4336 34.0667 25.0165 34.0564C25.5994 34.0462 26.1635 34.2625 26.59 34.66L29.5 37.57L41.41 25.66C41.8319 25.2386 42.4038 25.002 43 25.002C43.5963 25.002 44.1682 25.2386 44.59 25.66Z"
                          fill="#9D7907"
                        />
                      </svg>
                    </span>
                    SME
                  </h4>
                  <p>
                    Small and medium enterprises require efficient CRM solutions
                    to boost sales, automate daily tasks, increase productivity,
                    streamline customer communication, and improve
                    collaboration. Implementing custom CRM solutions can help
                    SMEs thrive in a competitive landscape.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="ps-crm-box ps-culture-box">
                  <h4>
                    <span>
                      <svg
                        width="68"
                        height="68"
                        viewBox="0 0 68 68"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="34" cy="34" r="34" fill="#BEEDFB" />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M44.59 25.66C45.0114 26.0818 45.248 26.6537 45.248 27.25C45.248 27.8462 45.0114 28.4181 44.59 28.84L31.09 42.34C30.6682 42.7613 30.0963 42.998 29.5 42.998C28.9038 42.998 28.3319 42.7613 27.91 42.34L23.41 37.84C23.0126 37.4134 22.7962 36.8493 22.8065 36.2664C22.8168 35.6835 23.0529 35.1273 23.4652 34.7151C23.8774 34.3029 24.4336 34.0667 25.0165 34.0564C25.5994 34.0462 26.1635 34.2625 26.59 34.66L29.5 37.57L41.41 25.66C41.8319 25.2386 42.4038 25.002 43 25.002C43.5963 25.002 44.1682 25.2386 44.59 25.66Z"
                          fill="#03A8DA"
                        />
                      </svg>
                    </span>
                    Enterprise
                  </h4>
                  <p>
                    Enterprises need to manage diverse teams and complex
                    workflows. Leveraging a robust CRM system can help
                    enterprises meet the demands of complex business structures
                    and build meaningful customer relationships.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="ps-joinCompnay-sec">
          <div className="container">
            <div className="row">
              <div className="col-xxl-12">
                <div
                  className="ps-retirment-box"
                  data-aos="zoom-in"
                  data-aos-duration={1000}
                >
                  <h2>Unleash Your Growth Potential </h2>
                  <div className="ps-white-btn">
                    <button
                      className="ps-btn"
                      onClick={() => navigate("/signup")}
                    >
                      Get Started
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
        <section className="ps-otherCrm-sec">
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-xxl-12">
                <div className="ps-heading-title ps-smallHeading-light">
                  <h2>
                    Pivott <span>VS</span> Other CRM’s
                  </h2>
                </div>
              </div>
              <div className="col-md-12 col-lg-10 col-xl-10px col-xxl-8 mx-auto">
                <div className="row">
                  {pivottData.map((data, ind) => (
                    <>
                      <div className="col-xxl-12">
                        <div className="ps-vsCrm-heading">
                          <h5>{data.heading}</h5>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="ps-culture-box">
                          <img src={crmicon} />
                          <p>{data.other}</p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="ps-culture-box">
                          <img src={pivotticon} />
                          <p>{data.pivott}</p>
                        </div>
                      </div>
                    </>
                  ))}
                  <div className="col-xxl-12">
                    <div className="ps-crm-btn">
                      <button
                        className="ps-btn"
                        onClick={() => navigate("/signup")}
                      >
                        Start for Free
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="ps-salesCrm-sec">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="ps-heading-title">
                  <h2>
                    Get the Best Results with our Trusted Sales Management CRM
                  </h2>
                </div>
              </div>
              <div className="col-md-12 col-lg-10 col-xl-10px col-xxl-8 mx-auto">
                <div className="ps-salesCrm-box">
                  <ul>
                    {trustedSales.map((data, ind) => (
                      <li key={ind}>
                        <h5>{data.percentage}</h5>
                        <p>{data.item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="ps-crmExplore-sec ps-bgcolor-gray">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="ps-heading-title ps-crmEx-heading">
                  <h2>
                    CRM for different industries. Find your industry and explore
                    the benefits.
                  </h2>
                </div>
              </div>

              <div className="col-md-6">
                <>
                  <div>
                    <Swiper
                      navigation={true}
                      pagination={false}
                      mousewheel={true}
                      keyboard={true}
                      modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                      className="mySwiper"
                    >
                      {industries.map((data, ind) => (
                        <SwiperSlide key={ind}>
                          <div className="ps-culture-box">
                            <img src={data.image} alt={data.heading} />
                            <h4>{data.heading}</h4>
                            <p>{data.content}</p>
                            <div className="ps-review-rating">
                              <span>
                                <StarRateRoundedIcon />
                              </span>
                              <span>
                                <StarRateRoundedIcon />
                              </span>
                              <span>
                                <StarRateRoundedIcon />
                              </span>
                              <span>
                                <StarRateRoundedIcon />
                              </span>
                              <span>
                                <StarRateRoundedIcon />
                              </span>
                              <h6>Review on Yelp</h6>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </>
              </div>
            </div>
          </div>
        </section>

        <section className="ps-faq-sec">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="ps-heading-title">
                  <h2>FAQ</h2>
                </div>
              </div>
              <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-12 col-sm-12 mx-auto">
                <div className="ps-investing-faq">
                  {faq.map((data, index) => (
                    <Accordion
                      className="ps-border-remove"
                      key={index}
                      defaultExpanded={index === 0}
                      expanded={expanded === index}
                      onChange={handleAccordionChange(index)}
                      sx={{ boxShadow: "none" }}
                    >
                      <AccordionSummary
                        sx={{ color: "#2C42B5" }}
                        expandIcon={
                          expanded === index ? (
                            <RemoveIcon sx={{ color: "#2C42B5" }} />
                          ) : (
                            <AddIcon sx={{ color: "#2C42B5" }} />
                          )
                        }
                      >
                        <Typography>{data.title}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography sx={{ color: "#191A47" }}>
                          {data.content}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Subscribe />
      <FooterRoot />
    </>
  );
};

export default WhyPivott;
