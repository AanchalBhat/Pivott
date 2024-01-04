import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import { resourcesData } from "../data";

const SideBar = () => {
  return (
    <div class="col-xxl-3 col-xl-4 col-md-4 col-sm-12">
      <div class="ph-blog-sidebar">
        <div class="ph-search-bar">
          <input type="search" name="search" placeholder="Search title..." />
          <span class="ph-search-icon">
            <SearchIcon />
          </span>
        </div>
        <div class="ph-side-widget">
          <h6 class="ph-title-widget">Categories</h6>
          <ul>
            <li>
              <span>Marketing Automation</span>
            </li>
            <li>
              <span>Sales</span>
            </li>
            <li>
              <span>Email Marketing</span>
            </li>
            <li>
              <span>CRM</span>
            </li>
          </ul>
        </div>
        <div class="ph-newletter-blog">
          <h6 class="ph-newLatter-heading">Newsletter</h6>
          <div class="ph-newsLatter-content">
            <p>
              Subscribe to Weekly - Get five biggest headlines in blockchain
              straight to your inbox
            </p>
            <div class="ph-search-bar">
              <input
                type="text"
                name="newslatter"
                placeholder="Enter Email Id"
              />
              <a href="#send" class="ph-search-icon">
                <SendIcon />
              </a>
            </div>
          </div>
        </div>

        <div class="ph-trending-blog">
          <h5>
            Trending Blog <TrendingUpIcon />
          </h5>
          <div class="ph-thumbnail-box">
            <div class="ph-thumbnail-img">
              <img src={resourcesData[0]?.image} alt="" />
            </div>
            <div class="ph-thumbnail-content">
              <h6>10 January, 2023</h6>
              <p>How Technology Is Transforming The Logistics Business?</p>
            </div>
          </div>
          <div class="ph-thumbnail-box">
            <div class="ph-thumbnail-img">
              <img src={resourcesData[1]?.image} alt="" />
            </div>
            <div class="ph-thumbnail-content">
              <h6>10 January, 2023</h6>
              <p>How Technology Is Transforming The Logistics Business?</p>
            </div>
          </div>
          <div class="ph-explore-more mb-3">
            <a href="#more">
              Explore More <EastRoundedIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
