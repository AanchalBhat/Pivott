import '../../assets/css/master.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faYoutube, faFacebook, faSquareInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import "swiper/css/navigation";
import "swiper/css/pagination";
import 'swiper/css';
import { discover, pivott, product } from './data';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

export default function FooterRoot() {
  return (
    <>
      <footer className="ps-footer">
        <div className="container">
          <div className="row">
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-6">
              <div className="ps-footer-box">
                <h6>Pivott</h6>
                <ul>
                  {pivott.map((pivote,index) =>
                    <li key={index}>
                      <HashLink smooth to={pivote.url}>{pivote.name}</HashLink>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-6">
              <div className="ps-footer-box">
                <h6>Product</h6>
                <ul>
                  {product.map((product,index) =>
                    <li key={index}>
                      <HashLink smooth to={product.url}>{product.name}</HashLink>
                    </li>
                  )}
                </ul> 
              </div>
            </div>
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-6">
              <div className="ps-footer-box">
                <h6>Discover</h6>
                <ul>
                  {discover.map((discover,index) =>
                    <li key={index}>
                      <HashLink smooth to={discover.url}>{discover.name}</HashLink>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            {/* <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-4 col-sm-6">
              <div className="ps-footer-box">
                <h6>Help Center</h6>
                <ul>
                  {helpCenter && helpCenter.map(data =>
                    <li>
                      <Link to="/">{data}</Link>
                    </li>
                  )}
                </ul>
              </div>
            </div> */}
          </div>
        </div>
      </footer>
      <section className="ps-footer-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-6 col-sm-12">
              <div className="ps-bottom-footer">
                <p>
                  © 2023 Pivott. All rights reserved.
                  {/* <Link to="/privacyPolicy">Privacy Policy</Link>
                  <Link to="/tnc">Terms of Use</Link> */}
                  {/* <Link>Cookies Setting</Link> */}
                </p>
              </div>
            </div>
            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-6 col-sm-12">
              <div className="ps-chat-btn">
                <div className="ps-bottomsSocial-media">
                  <ul>
                    <li>
                      <Link to="https://www.linkedin.com/company/pivott-marketing-automation-tool/?viewAsMember=true" target="_blank">
                        <FontAwesomeIcon icon={faLinkedin} />
                      </Link>
                    </li>
                    <li>
                      <Link to="https://www.youtube.com/channel/UC3yFnWO0mEcAqL9dz9AVQHA" target="_blank">
                        <FontAwesomeIcon icon={faYoutube} />
                      </Link>
                    </li>
                    <li>
                      <Link to="https://www.facebook.com/profile.php?id=100094292059164" target="_blank">
                        <FontAwesomeIcon icon={faFacebook} />
                      </Link>
                    </li>
                    <li>
                      <Link to="https://www.instagram.com/pivott_ai/" target="_blank">
                        <FontAwesomeIcon icon={faSquareInstagram} />
                      </Link>
                    </li>
                    <li>
                      <Link to="https://twitter.com/PivottAi" target="_blank">
                        <FontAwesomeIcon icon={faTwitter} />
                      </Link>
                    </li>
                  </ul>
                </div>
                <span className='d-flex justify-content-between align-items-center'>
                  <FontAwesomeIcon icon={faComment} />
                  English (United States)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
