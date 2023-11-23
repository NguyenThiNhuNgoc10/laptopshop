// import { freeze } from "@reduxjs/toolkit";
import { Row } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
width: 1270px; 
padding: 12px 0;
// background-color: #050507;
align-items: center;
gap: 16px;
flex-wrap: nowrap;
`

export const WrapperTextHeader = styled(Link)`
    font-size: 24px;
    color: #fff;
    font-weight: bold;
    text-align: left;
`

export const WrapperHeaderAccout = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
    font-size: 12px;
`
export const WrapperTextHeaderSmall = styled.span` 
    font-size: 12px;
    color: #fff;
`
export const WrapperIconHeader = styled.span` 
    font-size: 12px;
    color: #fff;
    white-space: nowrap;
`
export const WrapperContentPopup = styled.p` 
    cursor: pointer;
    &:hover {
        color: #0000ff;
    }
`