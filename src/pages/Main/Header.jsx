import React, { useState } from "react";
import "../../assets/css/master.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Button } from "react-bootstrap";
import {
  faCircleInfo,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import logoImg from "../../assets/images/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";
import { HashLink } from "react-router-hash-link";
import { ButtonLoader } from "../common/ButtonLoader";
import { homeApi } from "../../apis/homeApi";
import { restMethodError } from "../../constants/errorMessages";
import { Toaster } from "../common/Toaster";
import { EMAIL_REGEX, NAMES_REGEX, NUM_REGEX } from "../../utils/regexLists";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

export default function HeaderRoot() {
  const navigate = useNavigate();
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const handleClose = () => setIsMenuOpened(false);
  const handleShow = () => setIsMenuOpened(true);
  const [show, setShow] = useState(true);
  const [show1, setShow1] = useState(false);

  const handleShow1 = () => setShow1(true);
  const handleClose1 = () => setShow1(false);
  const [email, setEmail] = useState();
  const [first_name, setFirst_name] = useState();
  const [last_name, setLast_name] = useState();
  const [job_title, setJob_title] = useState();
  const [phone_number, setPhone_number] = useState();
  const [company_size, setCompany_size] = useState();
  const [description, setDescription] = useState();
  const [emailErrMsg, setEmailErrMsg] = useState();
  const [first_nameErrMsg, setFirst_nameErrMsg] = useState();
  const [last_nameErrMsg, setLast_nameErrMsg] = useState();
  const [phone_numberErrMsg, setPhone_numberErrMsg] = useState();
  const [loading, setLoading] = useState(false);

  const handleFirstnameChanges = (e) => {
    setFirst_name(e.target.value);
    if (!e.target.value) {
      setFirst_nameErrMsg("First name can't be empty");
    } else if (!NAMES_REGEX.test(e.target.value)) {
      setFirst_nameErrMsg("Please enter a valid first name");
    } else {
      setFirst_nameErrMsg("");
    }
  };

  const handleLastnameChanges = (e) => {
    setLast_name(e.target.value);
    if (!e.target.value) {
      setLast_nameErrMsg("");
    } else if (!NAMES_REGEX.test(e.target.value)) {
      setLast_nameErrMsg("Please enter a valid last name");
    } else {
      setLast_nameErrMsg("");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!e.target.value) {
      setEmailErrMsg("Email can't be empty");
    } else if (!EMAIL_REGEX.test(e?.target?.value)) {
      setEmailErrMsg("Please enter a valid email Id");
    } else {
      setEmailErrMsg("");
    }
  };

  const handlePhone_numberChange = (e) => {
    setPhone_number(e.target.value);
    if (!e.target.value) {
      setPhone_numberErrMsg("");
    } else if (!NUM_REGEX.test(e.target.value)) {
      setPhone_numberErrMsg("Please enter a valid number");
    } else {
      setPhone_numberErrMsg("");
    }
  };

  const handleValidation = () => {
    if (!first_name) {
      setFirst_nameErrMsg("First name can't be empty");
    }
    if (!email) {
      setEmailErrMsg("Email can't be empty");
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    handleValidation();
    let data = {
      email: email,
      first_name: first_name,
      last_name: last_name,
      job_title: job_title,
      phone_number: phone_number,
      company_size: company_size,
      description: description,
    };
    if (first_name && email) {
      homeApi
        .contactUs(data)
        .then(function (response) {
          if (response?.data) {
            Toaster.TOAST("Contact Created Successfully", "success");
            setCompany_size("");
            setEmail("");
            setFirst_name("");
            setLast_name("");
            setJob_title("");
            setPhone_number("");
            setDescription("");
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          Toaster.TOAST(restMethodError(error), "error");
          console.log(error);
        });
    }
  };
  return (
    <>
      <div className="ps-main-wrapper-header">
        {show && (
          <div className="ps-top-header">
            <p>
              <span className="ps-inform">
                <FontAwesomeIcon icon={faCircleInfo} />
              </span>
              Stressed with unstructured and misaligned sales process? Switch to
              Pivott to automate your sales and marketing process! Get 90 days{" "}
              <span className="ps-inform font-weight-bolder">FREE TRIAL</span>{" "}
              today
              {/* <Link>
              Learn More
              <FontAwesomeIcon icon={faArrowRight} />
            </Link> */}
            </p>
            <span
              className="ps-cross-btn"
              style={{ cursor: "pointer" }}
              onClick={() => setShow(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </span>
          </div>
        )}
        <header className="ps-header">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <nav className="navbar navbar-light navbar-expand-lg justify-content-between ps-main-nav align-items-center">
                  <Link className="ps-logo" to="/">
                    <img src={logoImg} alt="Logo" />
                  </Link>
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-target="#offcanvasDarkNavbar"
                    onClick={handleShow}
                  >
                    <span className="navbar-toggler-icon" />
                  </button>
                  <Offcanvas
                    show={isMenuOpened}
                    onHide={handleClose}
                    placement={"end"}
                    responsive="lg"
                  >
                    <Offcanvas.Header closeButton={handleClose}>
                      <Offcanvas.Title></Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                      <div className="ps-menu offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 align-items-center">
                          <li>
                            <Link to="/">Home</Link>
                          </li>
                          <li>
                            <Link to="/about-us">About Us</Link>
                          </li>
                          <li>
                            <Link to="/why-pivott">Why Pivott?</Link>
                          </li>
                          <li>
                            <HashLink smooth to="/#pricing">
                              Pricing
                            </HashLink>
                          </li>

                          <li class="dropdown">
                            <a
                              className="dropdown-toggle"
                              role="button"
                              data-bs-toggle="dropdown"
                            >
                              Resources
                            </a>
                            <ul className="ps-tree-menu dropdown-menu">
                              <li>
                                <Link className="dropdown-item" to="/blogs">
                                  Blog
                                </Link>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <Link to="/contact-us">Contact Us</Link>
                          </li>
                        </ul>
                        <ul className="ps-navEnd-btn">
                          <li>
                            <Link>
                              <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </Link>
                          </li>
                          <li>
                            <Link to={"/login"}>SIGN IN</Link>
                          </li>
                          <li>
                            <div className="ps-login">
                              <button
                                className="ps-btn"
                                type="button"
                                onClick={() => navigate("/signup")}
                              >
                                Get Started Free
                              </button>
                            </div>
                          </li>
                          <li>
                            <div className="ps-login-blue">
                              <button
                                className="ps-btn"
                                type="button"
                                onClick={() => handleShow1()}
                              >
                                Enquiry
                              </button>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Offcanvas.Body>
                  </Offcanvas>
                </nav>
              </div>
            </div>
          </div>
          <Modal show={show1} onHide={handleClose1}>
            <Modal.Header closeButton>
              <Modal.Title>Contact Us</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <section className="contact-form py-2">
                <div className="container">
                  <div className="row">
                    <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-10 mx-auto">
                      <form>
                        <div className="row">
                          <div className="col-md-6 col-sm-12 mb-3">
                            <label className="form-label" htmlFor="name">
                              First name *
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              id="name"
                              placeholder="Enter first name"
                              value={first_name}
                              onChange={(e) => handleFirstnameChanges(e)}
                            />
                            <span className="ma-error">{first_nameErrMsg}</span>
                          </div>
                          <div className="col-md-6 col-sm-12 mb-3">
                            <label className="form-label" htmlFor="lastname">
                              Last name
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              id="lastname"
                              placeholder="Enter last name"
                              value={last_name}
                              onChange={(e) => handleLastnameChanges(e)}
                            />
                            <span className="ma-error">{last_nameErrMsg}</span>
                          </div>
                          <div className="col-md-6 col-sm-12 mb-3">
                            <label className="form-label" htmlFor="email">
                              Work email *
                            </label>
                            <input
                              className="form-control"
                              type="email"
                              id="email"
                              placeholder="Enter an email"
                              value={email}
                              onChange={(e) => handleEmailChange(e)}
                            />
                            <span className="ma-error">{emailErrMsg}</span>
                          </div>
                          <div className="col-md-6 col-sm-12 mb-3">
                            <label className="form-label" htmlFor="job-title">
                              Job Title
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Enter job title"
                              id="job-title"
                              value={job_title}
                              onChange={(e) => setJob_title(e.target.value)}
                            />
                          </div>
                          <div className="col-md-6 col-sm-12 mb-3">
                            <label className="form-label" htmlFor="phone">
                              Phone number
                            </label>
                            <input
                              className="form-control"
                              type="phone"
                              id="phone"
                              placeholder="Enter phone number"
                              maxlength="13"
                              minLength="10"
                              value={phone_number}
                              onChange={(e) => handlePhone_numberChange(e)}
                            />
                            <span className="ma-error">
                              {phone_numberErrMsg}
                            </span>
                          </div>
                          <div className="col-md-6 col-sm-12 mb-3">
                            <label className="form-label" htmlFor="email">
                              Company Size
                            </label>
                            <input
                              className="form-control"
                              placeholder="Enter company size"
                              id="number"
                              value={company_size}
                              onChange={(e) => setCompany_size(e.target.value)}
                            />
                          </div>
                          <div className="col-md-12 mb-3">
                            <label className="form-label" htmlFor="message">
                              How can our team help you
                            </label>
                            <textarea
                              className="form-control"
                              id="message"
                              placeholder="Write some description here"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                            />
                          </div>
                          <div className="col-md-12 mt-3 text-center ">
                            <div className="ps-login">
                              <ButtonLoader
                                loading={loading}
                                classStyle={"ps-btn"}
                                handleClick={() => handleSubmit()}
                                title={"SUBMIT"}
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
            </Modal.Body>
          </Modal>
        </header>
      </div>
    </>
  );
}
