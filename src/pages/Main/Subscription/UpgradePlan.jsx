import React from "react";
import styled, { css } from "styled-components";

const commonStyles = css`
  border-radius: 6px;
  background: var(--ps-white-color);
  box-shadow: 4px 4px 24px 0px rgba(0, 0, 0, 0.04);
  padding: 50px 30px;
  text-align: center;
  border: 1px solid transparent;
  border-bottom: 8px solid transparent;
  transition: 0.3s;
  position: relative;
  margin-bottom: 20px;
  cursor: pointer;
`;

const hoverStyles = css`
  &:hover {
    border-radius: 6px;
    border: 1px solid #00a4bc;
    border-bottom: 8px solid #00a4bc;
    background: var(--ps-white-color);
    box-shadow: 4px 4px 24px 0px rgba(0, 0, 0, 0.04);
  }
`;

const activeStyles = css`
  &.active {
    border-radius: 6px;
    border: 1px solid #00a4bc;
    border-bottom: 8px solid #00a4bc;
    background: var(--ps-white-color);
    box-shadow: 4px 4px 24px 0px rgba(0, 0, 0, 0.04);
  }
`;

const disableStyles = css`
 pointer-events:none;
`;

const PlanBox = styled.div`
  ${commonStyles}
  ${(props) => (props.btn_txt !== "Already in use" ? hoverStyles : "")}
${(props) => (props.btn_txt !== "Already in use" ? activeStyles : "")}
${(props) => (props.btn_txt === "Already in use" ? disableStyles : "")}

  .ps-mostPopular-tag {
    position: absolute;
    top: 12px;
    right: -10px;
    background: #03a8da;
    font-size: 18px;
    font-weight: 500;
    display: inline-block;
    color: var(--ps-white-color);
    padding: 5px 15px;
    border-radius: 0 50px 50px;
  }

  .ps-rupees-amount {
    font-size: 64px;
    font-weight: 600;
  }

  h4 {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 0;
  }

  h2 {
    font-size: 44px;
    font-weight: 600;
    padding: 18px 0;
  }
  h2 sub {
    font-size: 20px;
    font-weight: 400;
    color: #5e5f7e;
    margin-right: 10px;
  }
  h2 {
    margin-bottom: 0;
  }
  h5 {
    font-size: 18px;
    font-weight: 400;
    color: #8c8da3;
    padding-bottom: 20px;
  }
  p {
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 0;
  }
  &.active .ps-blueOutline-btn .ps-btn {
    color: var(--ps-white-color);
    background: var(--ps-main-color);
    box-shadow: inset 30px 0px 0px 50px var(--ps-linear-color);
    border-color: transparent;
  }
  &.active {
    border-radius: 6px;
    border: 1px solid #00a4bc;
    border-bottom: 8px solid #00a4bc;
    background: var(--ps-white-color);
    box-shadow: 4px 4px 24px 0px rgba(0, 0, 0, 0.04);
  }
  &:hover .ps-blueOutline-btn .ps-btn {
    color: var(--ps-white-color);
    background: var(--ps-main-color);
    box-shadow: inset 30px 0px 0px 50px var(--ps-linear-color);
    border-color: transparent;
  }
  .ps-plan-desc {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60px;
    padding: 0px 36px;
  }
`;

const BtnContainer = styled.div`
  padding-bottom: 30px;

  .ps-blueOutline-btn .ps-btn {
    border: 1.5px solid var(--ps-text-main-color);
    background: var(--ps-white-color);
    color: var(--ps-text-main-color);
    width: 100%;
    max-width: 80%;
    transition: all 0.1s;
    font-size: 16px;
    font-weight: 600;
  }
  &.ps-price-firstBox {
    background: transparent;
  }
  ,
  .btn-para {
    color: #191a47;
    font-size: 16px;
    font-weight: 400;
  }
`;

const UpgradePlan = ({
  name,
  price_per_user,
  price_description,
  description,
  features,
  btn_txt,
  handleClick,
  tag,
  firstBox = false,
  active,
  subscription_type,
}) => {
  return (
    <PlanBox className="ma-list-price" btn_txt={btn_txt}>
      {tag && <span className="ps-mostPopular-tag">{tag}</span>}
      <h4>{name}</h4>
      <h2>
        <sub>Rupees</sub>
        <span className="ps-rupees-amount">
          {price_per_user ? parseInt(price_per_user) : 0}
        </span>
      </h2>

      <h5 className="ps-plan-desc">{price_description}</h5>
      <BtnContainer className="ps-price-btn">
        <div className="ps-blueOutline-btn">
          <button className="ps-btn" onClick={() => handleClick()}>
            {btn_txt}
          </button>
        </div>
      </BtnContainer>
      <ul>
        {features?.map((elem) => (
          <li>{elem}</li>
        ))}
      </ul>
    </PlanBox>
  );
};

export default UpgradePlan;
