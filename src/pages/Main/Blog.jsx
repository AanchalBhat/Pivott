import React from "react";
import { resourcesData } from "./data";
import FooterRoot from "./Footer";
import HeaderRoot from "./Header";
import { useNavigate } from "react-router-dom";
import SideBar from "./BlogDetails/SideBar";

const Blog = () => {
  const navigate = useNavigate();
  return (
    <>
      <HeaderRoot />
      <section className="ps-mainBlog-banner">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="ps-heading-title text-start mb-0">
                <h1>Our <span>Blogs</span></h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ps-resources-sec" id="resources">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="ps-heading-title text-start">
                <h2>Latest Posts</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xxl-9 col-xl-8 col-lg-8 col-md-8 col-sm-12">
              <div className="row">
                {resourcesData &&
                  resourcesData.map((data, index) => {
                    return (
                      <>
                        {
                          <div
                            onClick={() => navigate(`/blogs/${data.title}`)}
                            className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12"
                            key={indexedDB}
                          >
                            <div
                              className="ps-resources-box"
                              data-aos="fade-up"
                              data-aos-duration={data?.duration}
                            >
                              <div>
                                <img src={data?.image} alt="" />
                              </div>
                              <div className="ps-resources-content">
                                <span className="ps-chip-tag">
                                  {data?.chip}
                                </span>
                                <h5>{data.heading}</h5>
                                <p>{data?.content}</p>
                              </div>
                            </div>
                          </div>
                        }
                      </>
                    );
                  })}

                <div className="col-xxl-12">
                  <div class="ps-login text-center mt-4">
                    <button class="ps-btn" type="button">
                      View More
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <SideBar />
          </div>
        </div>
      </section>
      <FooterRoot />
    </>
  );
};

export default Blog;
