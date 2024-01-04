import React, { useEffect, useState } from "react";
import HeaderRoot from "./Header";
import FooterRoot from "./Footer";
import aboutimg from "../../assets/images/about.jpg";
import reliblestart from "../../assets/images/mockup1.png";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import ImagePopup from "./ImagePopup/ImagePopup";
import VisibilityIcon from "@mui/icons-material/Visibility";

const AboutUsPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [displayImg, setDisplayImg] = useState(false);

  useEffect(() => {
    window.scroll(0, 0);
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
        <div className="sc-breadcrumb sc-spacer-top sc-spacer-bottom">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h1 className="sc-mainheading">About us</h1>
              </div>
              <div className="col-md-6">
                <div className="sc-breadcrumb-list">
                  <ul>
                    <li>
                      <Link to="/">Pivott</Link>
                    </li>
                    <li>About Us</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="ps-about-sec">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="sc-about-content">
                  <div className="ps-morePivott-box">
                    <h3 className="sc-subheading">About Us</h3>
                    <h2>
                      We are Here to Transform Your Data into Delightful
                      Customer Experiences{" "}
                    </h2>
                    <p>
                      Want to take control of your sales, track every
                      interaction you have with your clients, and keep contact
                      details up-to-date? Switch to Pivott. We have helped
                      thousands of clients grow better! As the most loved CRM
                      platform, we take pride in simplifying business challenges
                      and offering exceptional support. Your processes, teams,
                      and tools can work together on Pivott to scale and
                      optimize.{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="sc-about-img-wrap">
                  <div className="sc-about-img">
                    <img src={aboutimg} alt="image" />
                    <div className="sc-about-call">
                      <div className="sc-about-call-icon">
                        <a href="tel:917314035927">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M13,1a1,1,0,0,1,1-1A10.011,10.011,0,0,1,24,10a1,1,0,0,1-2,0,8.009,8.009,0,0,0-8-8A1,1,0,0,1,13,1Zm1,5a4,4,0,0,1,4,4,1,1,0,0,0,2,0,6.006,6.006,0,0,0-6-6,1,1,0,0,0,0,2Zm9.093,10.739a3.1,3.1,0,0,1,0,4.378l-.91,1.049c-8.19,7.841-28.12-12.084-20.4-20.3l1.15-1A3.081,3.081,0,0,1,7.26.906c.031.031,1.884,2.438,1.884,2.438a3.1,3.1,0,0,1-.007,4.282L7.979,9.082a12.781,12.781,0,0,0,6.931,6.945l1.465-1.165a3.1,3.1,0,0,1,4.281-.006S23.062,16.708,23.093,16.739Zm-1.376,1.454s-2.393-1.841-2.424-1.872a1.1,1.1,0,0,0-1.549,0c-.027.028-2.044,1.635-2.044,1.635a1,1,0,0,1-.979.152A15.009,15.009,0,0,1,5.9,9.3a1,1,0,0,1,.145-1S7.652,6.282,7.679,6.256a1.1,1.1,0,0,0,0-1.549c-.031-.03-1.872-2.425-1.872-2.425a1.1,1.1,0,0,0-1.51.039l-1.15,1C-2.495,10.105,14.776,26.418,20.721,20.8l.911-1.05A1.121,1.121,0,0,0,21.717,18.193Z"></path>
                          </svg>
                        </a>
                      </div>
                      <div className="sc-about-call-text">
                        <a href="tel:917314035927">+91-731-123456</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="ps-pivottStart-sec ps-bg-color">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="ps-relible-image">
                  <div
                    className="ps-relible-img"
                    data-aos="fade-right"
                    data-aos-duration={3000}
                  >
                    <img src={reliblestart} alt="image" />
                  </div>
                  <div
                    onClick={() => handleImageClick(reliblestart)}
                    className="campaign-preview-btn content-details fadeIn-bottom fadeIn-left"
                  >
                    <span>
                      <VisibilityIcon />
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="ps-morePivott-box">
                  <h2>How did Pivott start? </h2>
                  <p className="pt-0">
                    Founded in 2023, Pivott’s inception can be traced to a
                    simple yet profound idea of managing opportunities. It
                    started with a group of passionate individuals who came
                    together to build a platform to fulfill an unmet need in the
                    market.{" "}
                  </p>
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
        <section className="ps-ourMission-sec">
          <div className="container">
            <div className="row">
              <div className="col-xxl-10 col-xl-10 col-lg-12 col-md-12 mx-auto">
                <div className="ps-heading-title ps-smallHeading-light">
                  <h2>Our Mission </h2>
                  <h4>Get ready for a better future with Pivott!</h4>
                  <p>
                    At Pivott, we are on a mission to make a positive difference
                    by simplifying business complications so companies and
                    customers can easily create connections. Our team believes
                    that effective customer relationship management is more than
                    just a business strategy. It also helps companies succeed in
                    today's competitive landscape.
                  </p>
                  <p>
                    Our focus revolves around customers. We put them at the
                    center to deliver exceptional service that makes a
                    difference. We provide you with the most advanced tools so
                    you can connect and engage your customer base to achieve
                    sustainable success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="ps-pivottStart-sec ps-bg-color">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="ps-heading-title ps-smallHeading-light">
                  <h2>Our Cultures and Values </h2>
                  <p>
                    When you partner with Pivott, you partner with a CRM pioneer
                    who can smoothly transform your business.{" "}
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="ps-culture-box">
                  <h4>Transparency and Trust</h4>
                  <p>
                    Maintaining transparency and honesty in all our dealings
                    allows us to build trust. We consider data as the core of
                    our identity and an essential part of our platform. By
                    providing access to data, we give total freedom so you can
                    work better together.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="ps-culture-box">
                  <h4>Speed and execution</h4>
                  <p>
                    We are eager to try and improve to offer you better
                    services. We believe the quicker you execute, the quicker
                    you learn and improve. We regularly seek feedback, both
                    internally and externally, to outdo our best.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="ps-culture-box">
                  <h4>Customer-Centric Approach</h4>
                  <p>
                    As a team, our primary focus is on customers. We take pride
                    in understanding their unique needs to provide them with
                    tailored CRM solutions to drive success. For us, our clients
                    are our partners, with whom we share a journey towards
                    growth and excellence.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="ps-culture-box">
                  <h4>Product-First</h4>
                  <p>
                    Our product is designed to work for customers and not the
                    other way around. The features of our product combine
                    together to deliver the best user experience.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="ps-culture-box">
                  <h4>Inclusivity</h4>
                  <p>
                    One of our core company values is inclusivity because our
                    platform is open to everyone. Inclusion and diversity help
                    us create better teams and, ultimately, a better product.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="ps-culture-box">
                  <h4>Continuous Learning</h4>
                  <p>
                    We put great emphasis on continuous learning and growth.
                    Every member of our team is committed to staying up-to-date
                    with the best industry practices to provide impactful
                    solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="ps-ourMission-sec">
          <div className="container">
            <div className="row">
              <div className="col-md-10 mx-auto">
                <div className="ps-morePivott-box text-center">
                  <h2>Our Commitment to Excellence </h2>
                  <p className="p-0">
                    At Pivott, we combine creativity and data to meet and exceed
                    every expectation of clients. Our commitment to excellence
                    and success defines who we are, how we operate, and what we
                    deliver to our valued customers.
                  </p>
                  <p>
                    We thrive on creativity and innovation, which motivates us
                    to foster a culture of innovation that encourages our team
                    to think outside the box, explore new ideas, and embrace
                    change.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="ps-Action-sec ps-bg-color">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="ps-callAction-box">
                  <div className="ps-heading-title ps-smallHeading-light mb-0">
                    <h2>Join Us On Our Journey</h2>
                    <h4>Unlock the power of customer experiences</h4>
                    <div className="ps-login">
                      <button
                        className="ps-btn"
                        onClick={() => navigate("/signup")}
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterRoot />
    </>
  );
};

export default AboutUsPage;
