import React from "react"
import { StyleNameProduct, WrapperCardStyle, WrapperPriceDiscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from "./style"
import { StarFilled, StarOutlined } from '@ant-design/icons'
import logo from '../../assets/images/logo.png'
import { useNavigate } from "react-router-dom"
import { convertPrice } from "../../utils"

const CardComponent = (props) => {
  const { countInStock, description, image, name, price, rating, type, discount, selled, id } = props
  const navigate = useNavigate()
  const handleDetailsProduct = (id) => {
    navigate(`/product-details-page/${id}`)
  }
  return (

    <WrapperCardStyle
      hoverable
      headStyle={{ width: '200px', height: '200px' }}
      style={{ width: 200 }}
      bodyStyle={{ padding: '10px' }}
      cover={<img alt="example" src={image} />}
      onClick={() => handleDetailsProduct(id)}
    >
      <img
        src={logo}
        alt="logo"
        style={{
          top: -1,
          left: -1,
          borderTopLeftRadius: '3px',
          position: 'absolute',
          height: '14px',
          width: '68px'
        }}
      />
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReportText>
        <span style={{ marginRight: '4px' }}>
          <span>{rating}</span> <StarFilled style={{ fontSize: '12px', color: 'rgb(253, 216, 54)' }} />
        </span>
        <WrapperStyleTextSell>  | Đã bán  {selled || 1000}+ </WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <span style={{ marginRight: '8px' }}>{convertPrice(price)}</span>
        {discount > 0 &&
          <WrapperPriceDiscountText style={{ marginLeft: '6px' }}>
            - {discount}%
          </WrapperPriceDiscountText>
        }
      </WrapperPriceText>
    </WrapperCardStyle>



  )
}

export default CardComponent