// import { freeze } from "@reduxjs/toolkit";
import { Row } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
@media (max-width:1023px) {
    display: flex;
    gap: 0;
    width: 100%;
    flex-wrap: wrap;
   padding: 12px 16px;
    overflow: hidden;
    
}
display: flex;
width: 1270px; 
padding: 12px 0;
// background-color: #050507;
align-items: center;
gap: 16px;
flex-wrap: nowrap;
justify-content: space-between;

`

export const WrapperTextHeader = styled(Link)`
@media (max-width:1023px) {
    font-size: 15px;
}
    font-size: 24px;
    color: #fff;
    font-weight: bold;
    text-align: left;
`

export const WrapperHeaderAccout = styled.div`
@media (max-width:1023px) {
    display: none;
}
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
    font-size: 12px;
`
export const WrapperTextHeaderSmall = styled.span` 
@media (max-width:1023px) {
    display: none;
}
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

export const WrapperSearch = styled.div` 
@media (max-width:1023px) {
    display: flex;
    width: 200px;
    margin-left: 10px;
    // size: small;
}
   flex: 1;
    
`