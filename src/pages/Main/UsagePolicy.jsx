import React, { useEffect } from "react";
import HeaderRoot from "./Header";
import FooterRoot from "./Footer";
import { Link } from "react-router-dom";

const UsagePolicyPage = () => {
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
                <h1 className="sc-mainheading">Website Usage Policy</h1>
              </div>
              <div className="col-md-6">
                <div className="sc-breadcrumb-list">
                  <ul>
                    <li>
                      <Link to="/">Pivott</Link>
                    </li>
                    <li>Usage Policy</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="ps-ourMission-sec">
          <div className="container">
            <div className="row">
              <div className="col-xxl-10 col-xl-10 col-lg-12 col-md-12 mx-auto">
                <div className="ps-heading-title ps-smallHeading-light">
                <h2>Website Usage Policy </h2>
                  <p>
                    This website is owned and operated by Pivott.ai. Throughout
                    the site, the terms “we”, “us” and “our” refer to Pivott. By
                    accessing or using our website, you agree to be bound by the
                    terms and conditions set forth below. These terms and
                    conditions may be updated or changed from time to time
                    without notice to you. It is your responsibility to review
                    this page periodically for any updates or changes.
                  </p>
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

export default UsagePolicyPage;
