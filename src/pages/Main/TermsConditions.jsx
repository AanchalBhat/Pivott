import React, { useEffect } from "react";
import HeaderRoot from "./Header";
import FooterRoot from "./Footer";
import { Link } from "react-router-dom";

const TermsConditionsPage = () => {

  useEffect(() => {
    window.scroll(0,0)
  },[])
  return (
    <>
      <HeaderRoot />
      <div class="sc-breadcrumb sc-spacer-top sc-spacer-bottom">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-6">
              <h1 class="sc-mainheading">Terms and Conditions</h1>
            </div>
            <div class="col-md-6">
              <div class="sc-breadcrumb-list">
                <ul>
                  <li>
                    <Link to="/">Pivott</Link>
                  </li>
                  <li>Terms & Conditions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="ps-T&C-sec">
        <div className="container">
          <div className="row">
            <div className="col-xxl-11 col-xl-12 col-lg-12 col-md-12 mx-auto">
              <div className="ps-T&C-box">
                <h5>1. Intellectual Property Rights</h5>
                <p>
                  All content on this website, including but not limited to
                  text, graphics, images, logos, and other material, is the
                  exclusive property of Pivott.ai or its licensors and is
                  protected under applicable copyright, trademark, and other
                  intellectual property laws. Unauthorized use, reproduction,
                  distribution, or modification of any content, in whole or in
                  part, is strictly prohibited without our express written
                  permission.
                </p>
                <h5>2. Website Use and Restrictions</h5>
                <p className="pb-0 mb-0">
                  You are free to use our website for any lawful purpose.
                  However, you are prohibited from:{" "}
                </p>
                <ul>
                  <li>
                    Engaging in any activity that interferes with the proper
                    working of our website or servers.{" "}
                  </li>
                  <li>
                    Copying, duplicating, or distributing any content without
                    our written permission.{" "}
                  </li>
                  <li>
                    Accessing or using our website for any purpose that is
                    unlawful or that violates these terms and conditions.
                  </li>
                  <li>
                    Using any automated data mining or extraction tools to
                    gather, extract, or download any content from our website
                    without our express written permission.
                  </li>
                </ul>
                <h5>3. External Links </h5>
                <p>
                  Our website may contain links to external websites not owned
                  or controlled by us. Pivott.ai is not responsible for the
                  content, policies, or practices of any linked websites. We do
                  not endorse or assume any responsibility for any external
                  websites or their content. Clicking on external links is at
                  your own risk.
                </p>
                <h5>4. Limitation of Liability </h5>
                <p>
                  To the maximum extent permitted by law, Pivott.ai disclaims
                  any liability for any damages, losses, or injuries of any
                  kind, whether direct, indirect, incidental, consequential, or
                  otherwise, arising out of or in connection with the use of our
                  website or any content contained therein. Your use of our
                  website is at your sole risk.
                </p>
                <h5>5. Indemnification </h5>
                <p>
                  By using our website, you agree to indemnify, defend, and hold
                  harmless Pivott.ai, its affiliates, officers, directors,
                  employees, agents, and licensors from and against any and all
                  claims, losses, expenses, damages, and costs, including
                  reasonable attorneys’ fees, arising out of or in connection
                  with your use of our website or any violation of these terms
                  and conditions.
                </p>
                <h5>6. Governing Law </h5>
                <p>
                  These terms and conditions and any dispute arising from or in
                  connection with them will be governed by and construed in
                  accordance with the laws of the jurisdiction where Pivott.ai
                  is registered, without regard to its conflict of law
                  provisions.
                </p>
                <h5>7. Changes to This Policy </h5>
                <p>
                  We reserve the right to modify these terms and conditions or
                  our privacy policy at any time, without providing you with
                  notice. Changes will be effective immediately upon their
                  posting on our website. It is your responsibility to review
                  these terms and conditions and the privacy policy periodically
                  to stay informed about any updates or changes.{" "}
                </p>
                <h5>8. Contact Us </h5>
                <p>
                  If you have any questions or concerns about these terms and
                  conditions or our privacy policy, please contact us at
                  <span> <Link to="mailto: digital@pivott.ai">digital@pivott.ai</Link></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterRoot />
    </>
  );
};

export default TermsConditionsPage;
