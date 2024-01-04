import React, { useEffect, useState } from "react";
import HeaderRoot from "./Header";
import FooterRoot from "./Footer";
import { Link } from "react-router-dom";
import { homeApi } from "../../apis/homeApi";
import { Toaster } from "../common/Toaster";
import { EMAIL_REGEX, NAMES_REGEX, NUM_REGEX } from "../../utils/regexLists";
import { ButtonLoader } from "../common/ButtonLoader";
import { restMethodError } from "../../constants/errorMessages";

const ContactUsPage = () => {
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

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <>
      <HeaderRoot />
      <main>
        <div className="sc-breadcrumb sc-spacer-top sc-spacer-bottom">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h1 className="sc-mainheading">Contact Us</h1>
              </div>
              <div className="col-md-6">
                <div className="sc-breadcrumb-list">
                  <ul>
                    <li>
                      <Link to="/">Pivott</Link>
                    </li>
                    <li>Contact Us</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="contact-form">
          <div className="container">
            <div className="row">
              <div className="col-xxl-8 col-xl-8 col-lg-10 col-md-10 mx-auto">
                <h2 className="mb-5 mt-2 text-center">Contact Us</h2>
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
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
                    <div className="col-md-6 mb-3">
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
                    <div className="col-md-6 mb-3">
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
                    <div className=" col-md-6 mb-3">
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
                    <div className=" col-md-6 mb-3">
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
                      <span className="ma-error">{phone_numberErrMsg}</span>
                    </div>
                    <div className=" col-md-6 mb-3">
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
      </main>
      <FooterRoot />
    </>
  );
};

export default ContactUsPage;
