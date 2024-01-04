import { Link, useNavigate } from 'react-router-dom'

export default function Subscribe() {
    const navigate = useNavigate()
  return (
    <section className="ps-newslatter-sec">
          <div className="container">
            <div className="row">
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div
                  className="ps-newslatter-box"
                  data-aos="fade-right"
                  data-aos-duration={300}
                >
                  <h2>Subscribe to our <span>newsletter</span></h2>
                  <p>
                    Get the latest news, articles, and resources straight into your
                    inbox weekly.
                  </p>
                </div>
              </div>
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <form
                  action=""
                  className="ps-heading-newlatter"
                  data-aos="fade-left"
                  data-aos-duration={800}
                >
                  <div className="ps-newlatter-form">
                    <div className="ps-filed-email">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter work email"
                      />
                    </div>
                    <div className="ps-login ps-explore-Pivott ps-newsLatter-btn">
                      <button className="ps-btn" onClick={() => navigate("/signup")}>Subscribe</button>
                    </div>
                  </div>
                  <p>
                    By filling this form you agree to our <Link to="/privacy-policy"> Privacy Policy</Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
  )
}
