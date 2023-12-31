import Card from "antd/es/card/Card";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
    
    max-width: 16.66667%;
    flex: 0 0 16.66667%;
    & img {
        height: 200px;
        width: 200px;
    },
    position: relative;
    background-color: ${props => props.disabled ? '#ccc' : '#fff'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    @media (max-width:1023px) {
        max-width: 50%;
        flex: 0 0 50%;
        padding: 0 16px;
        margin: 8px 8px;
        & img {
            height: 150px;
            width: 150px;
        },
        & .ant-card-cover >* {
            width: 180px;
        }
    }

`



export const StyleNameProduct = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: rgb(56, 56, 61);
    font-weight: 400;
`

export const WrapperReportText = styled.div`
    font-size: 11px;
    color: rgb(128, 128, 137);
    display: flex;
    align-items: center;
    margin: 6px 0 4px;
`


export const WrapperPriceText = styled.div`
    color: rgb(255, 66, 78);
    font-size: 16px;
    font-weight: 500;
    
`

export const WrapperPriceDiscountText = styled.span`
    color: rgb(255, 66, 78);
    font-size: 12px;
    font-weight: 500;
`

export const WrapperStyleTextSell = styled.span`
    color: rgb(120, 120, 120);
    font-size: 15px;
    line-height: 24px;
`


