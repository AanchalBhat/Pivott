import { useParams } from "react-router-dom";
import Blog1 from "./BlogDetails/Blog1";
import Blog2 from "./BlogDetails/Blog2";
import Blog3 from "./BlogDetails/Blog3";
import Blog4 from "./BlogDetails/Blog4";
import Blog5 from "./BlogDetails/Blog5";
import PageNotFound from "../../components/NotFound/PageNotFound";
import FooterRoot from "./Footer";
import SideBar from "./BlogDetails/SideBar";
import HeaderRoot from "./Header";
import blog1 from "../../assets/images/resource1.jpg";
import blog2 from "../../assets/images/resource2.jpg";
import blog3 from "../../assets/images/resource3.jpg";
import blog4 from "../../assets/images/resource4.jpg";
import blog5 from "../../assets/images/resource5.jpg";
import { resourcesData } from "./data";

const BlogDetails = () => {
    const params = useParams();
    const title = params?.title;

    const handleMapping = () => {
        let data = resourcesData.filter(elem => elem.title === title)
        return data[0].heading;
    }

    const renderData = (flag) => {
        switch (title) {
            case "What-is-Marketing-Automation":
                return flag ? <Blog1 /> : blog1;
            case "How-Marketing-Automation-Boosts-Lead-Generation":
                return flag ? <Blog2 /> : blog2;
            case "Creating-Personalized-Customer-Journeys-with-Marketing-Automation":
                return flag ? <Blog3 /> : blog3;
            case "Leveraging-AI-in-Marketing-Automation":
                return flag ? <Blog4 /> : blog4;
            case "Discover-The-Benefits-Of-Sales-CRM-In-Insurance-Industry":
                return flag ? <Blog5 /> : blog5;
            default:
                return <PageNotFound />
        }
    };
    return (
        <>
            <HeaderRoot />
            <section className="ps-blogDetial-banner ps-bgcolor-gray">
                <div className="container">
                    <div className="row">
                        <div className="col-xxl-9 col-lg-10 col-md-12 col-sm-12 mx-auto ">
                            <div className="ps-heading-title mb-0">
                                <h2>{resourcesData && handleMapping()}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="ps-resources-sec" id="resources">
                <div className="container">
                    <div className="row">
                        <div className="col-xxl-9 col-xl-8 col-lg-8 col-md-8 col-sm-12">
                            <div className="ps-blog-detail">
                                <div className="ps-detail-img">
                                    <div>
                                        <img src={renderData(false)} alt="blog-img" />
                                    </div>
                                </div>
                                {renderData(true)}
                            </div>
                        </div>
                        <SideBar />
                    </div>
                </div>
            </section>
            <FooterRoot />
        </>
    )
}

export default BlogDetails;
