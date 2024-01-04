import React, { useEffect } from "react";
import HeaderRoot from "./Header";
import FooterRoot from "./Footer";
import { Link } from "react-router-dom";

const PrivacyPolicyPage = () => {

  useEffect(() => {
    window.scroll(0,0)
  },[])
  return (
    <>
      <HeaderRoot />
      <main>
        <div className="sc-breadcrumb sc-spacer-top sc-spacer-bottom">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h1 className="sc-mainheading">Privacy Policy</h1>
              </div>
              <div className="col-md-6">
                <div className="sc-breadcrumb-list">
                  <ul>
                    <li>
                      <Link to="/">Pivott</Link>
                    </li>
                    <li>Privacy Policy</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="ps-ourMission-sec">
          <div className="container">
            <div className="row">
              <div className="col-xxl-11 mx-auto col-md-12 col-xl-12 col-lg-12">
                <div className="ps-heading-title ps-title-list">
                  <p>
                    At Pivott.ai, we respect and protect the privacy of our
                    users. This privacy policy explains how we collect, use, and
                    safeguard the information you provide to us through our
                    website.
                  </p>
                  <ul className="ps-point-container">
                    <li className="ps-point-lister">
                      <div>
                        <span className="ps-point-numbering">1.</span>
                        <span className="ps-point-heading">
                          Information Collection and Use
                        </span>
                        <p>
                          As our website does not collect any personal
                          information, the only data collected is essential
                          usage data and anonymous analytics data to help us
                          understand how our website is being used and to make
                          improvements. None of your personal information is
                          collected or stored in any way.
                        </p>
                      </div>
                    </li>

                    <li className="ps-point-lister">
                      <div>
                        <span className="ps-point-numbering">2.</span>
                        <span className="ps-point-heading">Cookies </span>
                        <p>
                          We use cookies on our website to provide you with the
                          best browsing experience. Cookies are small data files
                          stored on your browser by our website. Only essential
                          cookies are used, which are necessary for the basic
                          functioning of the website. We also use analytics
                          cookies, which help us to understand how users
                          interact with our website, allowing us to make
                          improvements.
                        </p>
                        <p>
                          You have the option to choose the type of cookies you
                          want to be stored on your device. You can manage your
                          cookie preferences by accessing the cookie settings in
                          your browser or by visiting our website’s cookie
                          settings page. Please note that by disabling certain
                          cookies, some features of our website may not function
                          properly.
                        </p>
                      </div>
                    </li>

                    <li className="ps-point-lister">
                      <div>
                        <span className="ps-point-numbering">3.</span>
                        <span className="ps-point-heading">
                          Third-Party Analytics{" "}
                        </span>
                        <p>
                          We use third-party analytics providers to help us
                          understand how our website is being used and to make
                          improvements. These third-party providers may collect
                          anonymous usage data, but they do not collect any
                          personally identifiable information.
                        </p>
                      </div>
                    </li>
                    <li className="ps-point-lister">
                      <div>
                        <span className="ps-point-numbering">4.</span>
                        <span className="ps-point-heading">Data Security </span>
                        <p>
                          The protection of your information is important to us.
                          Although we do not collect any personally identifiable
                          information through our website, we still take
                          security measures to protect our user data. We use
                          secure servers and implement technical and
                          organizational measures, in compliance with GDPR, to
                          ensure the security and confidentiality of our
                          visitors’ data. Please bear in mind that the
                          transmission of information via the internet is never
                          completely secure, and while we strive to protect your
                          data, we cannot guarantee its absolute security.
                        </p>
                      </div>
                    </li>

                    <li className="ps-point-lister">
                      <div>
                        <span className="ps-point-numbering">4.</span>
                        <span className="ps-point-heading">Data Security </span>
                        <p>
                          The protection of your information is important to us.
                          Although we do not collect any personally identifiable
                          information through our website, we still take
                          security measures to protect our user data. We use
                          secure servers and implement technical and
                          organizational measures, in compliance with GDPR, to
                          ensure the security and confidentiality of our
                          visitors’ data. Please bear in mind that the
                          transmission of information via the internet is never
                          completely secure, and while we strive to protect your
                          data, we cannot guarantee its absolute security.
                        </p>
                      </div>
                    </li>

                    <li className="ps-point-lister">
                      <div>
                        <span className="ps-point-numbering">5.</span>
                        <span className="ps-point-heading">
                          GDPR Compliance{" "}
                        </span>
                        <p>
                          We are committed to complying with the General Data
                          Protection Regulation (GDPR) in our data processing
                          practices. Although we do not collect any personally
                          identifiable information through our website, we still
                          adhere to the principles of data protection, such as
                          processing data in a transparent manner, ensuring its
                          accuracy, and keeping it secure.
                        </p>
                      </div>
                    </li>
                  </ul>
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

export default PrivacyPolicyPage;
