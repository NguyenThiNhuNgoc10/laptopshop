import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
@media (max-width:1023px) {
    display: none;
    
    
}
    display: flex;
    align-items: center;
    gap: 24px;
    justify-content: flex-start;
    
    height: 44px;
`

export const WrapperButtonMore = styled(ButtonComponent)`
    &:hover {
        color: #fff;
        background: rgb(5, 5, 7);
        span {
            color: #fff;
        }
    }
    width: 100%;
    text-align: center;
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointers'}
`

export const WrapperProducts = styled.div`
@media (max-width:1023px) {
margin: 12px -16px;
gap: 0;
}
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    margin-top: 20px;
    justify-content: center;
`
export const WrapperContents = styled.div`
@media (max-width:1023px) {
    background-color: #efefef,
    padding: 0;
  
}
 background-color: #efefef,
  padding: 0 120px
`
