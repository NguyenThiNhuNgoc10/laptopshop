import { Col, Button } from 'antd'
import styled from "styled-components";

export const WrapperProducts = styled.div`
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 10px;
`

export const WrapperNavbar = styled(Col)`
    background: #fff; 
    margin-right: 10px;
    padding: 10px;
    border-radius: 6px;
    height: fit-content;
`

export const WrapperTextLight = styled.span`
    color: rgb(0, 113, 227);
    font-size: 16px;
`
export const WrapButton = styled(Button)`
    margin-top: 10px;
`