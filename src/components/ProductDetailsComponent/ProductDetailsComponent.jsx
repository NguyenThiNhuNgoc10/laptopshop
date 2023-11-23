import { Col, Image, Row, InputNumber, Rate } from "antd"
import React, { useEffect, useState } from "react"
import imageProduct from '../../assets/images/dell1.jpg'
import imageProductSmall from '../../assets/images/dell2.jpg'
import {
  WrapperAddressProduct, WrapperPriceProduct, WrapperPriceTextProduct, WrapperStyleCollImage, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell, WrapperQuanlityProduct, WrapperInputNumber,
  WrapperTextLight, Title, WrapContent, ContentDescription,
  AttributeItem, TableContent, AttributeValue
} from "./style"
import { MinusOutlined, PlusOutlined, StarFilled } from "@ant-design/icons"
import ButtonComponent from "../ButtonComponent/ButtonComponent"
import * as ProductService from '../../services/ProductService'
import { useQuery } from "@tanstack/react-query"
import Loading from "../../hooks/LoadingComponent/Loading"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { addOrderProduct, decreaseAmount, increaseAmount } from "../../redux/slides/orderSlide"
import { convertPrice } from "../../utils"
import * as Message from '../Message/Message'

const ProductdetailsComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1)
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [active, setActive] = useState(1)

  const onChange = (value) => {
    setNumProduct(Number(value))
  }

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1]
    if (id) {
      const res = await ProductService.getDetailsProduct(id)
      return res.data
    }
  }

  const handleChangeCount = (type, limited) => {
    if (type === 'increase') {
      if (!limited) {
        setNumProduct(numProduct + 1)
      }
    } else {
      if (!limited) {
        setNumProduct(numProduct - 1)
      }
    }
  }
  // xử lí sự kiện ấn chọn mua sản phẩm
  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate('/sign-in', { state: location?.pathname })
    } else {
      const orderRedux = order?.orderItems?.find(
        (item) => item.product === productDetails?._id
      )
      if (
        (orderRedux?.amount + numProduct) <= orderRedux?.countInstock ||
        (!orderRedux && productDetails?.countInStock > 0)
      ) {
        dispatch(
          addOrderProduct({
            orderItem: {
              name: productDetails?.name,
              amount: numProduct,
              image: productDetails?.image,
              price: productDetails?.price,
              product: productDetails?._id,
              discount: productDetails?.discount,
              countInstock: productDetails?.countInStock,
              description: productDetails?.description
            },
          })
        )
        Message.success('Đã thêm vào giỏ hàng')
      } else {
        setErrorLimitOrder(true)
      }
    }
  }

  const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailsProduct, { enabled: !!idProduct })
  console.log('productDetails', productDetails)

  const order = useSelector((state) => state.order)
  const [errorLimitOrder, setErrorLimitOrder] = useState(false)


  useEffect(() => {
    const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
    if ((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
      setErrorLimitOrder(false)
    } else if (productDetails?.countInStock === 0) {
      setErrorLimitOrder(true)
    }
  }, [numProduct])

  return (
    <Loading isLoading={isLoading}>
      <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px' }}>
        <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
          <Image src={productDetails?.image} alt="image product" preview={false} />
          {/* <WrapperStyleImageSmall style={{ height: '550px' }} src={imageProduct} alt="image product" preview="false" /> */}
          {/* <Row style={{ padding: '10px', justifyContent: 'space-between' }}>
            <WrapperStyleCollImage span={4}>
              <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview="false" />
            </WrapperStyleCollImage>
            <WrapperStyleCollImage span={4}>
              <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview="false" />
            </WrapperStyleCollImage>
            <WrapperStyleCollImage span={4}>
              <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview="false" />
            </WrapperStyleCollImage>
            <WrapperStyleCollImage span={4}>
              <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview="false" />
            </WrapperStyleCollImage>
            <WrapperStyleCollImage span={4}>
              <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview="false" />
            </WrapperStyleCollImage>

          </Row> */}
        </Col>
        <Col span={14} style={{ paddingLeft: '10px' }}>
          <WrapperStyleNameProduct >{productDetails?.name} </WrapperStyleNameProduct>
          {/* <div>{productDetails?.description}</div> */}
          <div>
            <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
            <WrapperStyleTextSell>  |  Đã bán 1000+ </WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
          </WrapperPriceProduct>
          <WrapperAddressProduct>
            <span>Giao đến </span>
            <span className="address">{user?.address}</span>
            <span style={{ padding: '4px' }} className="change-address">Đổi địa chỉ</span>
          </WrapperAddressProduct>
          <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
            <div style={{ marginBottom: '10px' }}>Số lượng</div>
            <WrapperQuanlityProduct>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', numProduct === 1)} >
                <MinusOutlined style={{ color: '#000', fontSize: '20px ' }} />
              </button>
              <WrapperInputNumber onChange={onChange} defaultValue={1} value={numProduct} size="small" />
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                disabled={errorLimitOrder}
                onClick={() => handleChangeCount(
                  'increase',
                  numProduct === productDetails?.countInStock
                )}
              >
                <PlusOutlined style={{ color: '#000', fontSize: '20px ' }} />
              </button>
            </WrapperQuanlityProduct>
            {errorLimitOrder && <div style={{ color: 'red' }}>Sản phẩm đã hết hàng</div>}
          </div>
          <div style={{ display: 'flex', alignContent: 'center', gap: '12px' }}>
            <ButtonComponent
              //  bordered="false" 
              size={40}
              styleButton={{
                background: 'rgb(5, 5, 7)',
                height: '48px',
                width: '220px',
                borderRadius: '4px',
                border: 'none'
              }}
              onClick={handleAddOrderProduct}
              textButton={'Thêm vào giỏ hàng'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>
            <ButtonComponent
              //  bordered="false"
              size={40}
              styleButton={{
                background: '#fff',
                height: '48px',
                width: '220px',
                borderRadius: '4px',
                border: '1px solid #000'
              }}
              textButton={'Mua trả sau '}
              styleTextButton={{ color: '#000', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>
          </div>
        </Col>
      </Row>


      {/* <Row style={{
        padding: '0 16px',
        background: '#fff',
        borderRadius: '8px',
        marginTop: '5px',
        boxShadow: ' 0 0 6pt 1pt #D3D3D3',
      }}
      >
        <p
          style={{
            paddingLeft: '16px',
            width: '516px',
            fontSize: '16px',
            whiteSpace: 'pre-line',
            textAlign: 'justify',
          }}
        >
        </p>
        <div
          style={{
            width: '100%',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // marginTop: '5px',
            borderRadius: '0px',
            boxShadow: ' 0 0 1pt 1pt #000',
            fontWeight: 'bold',

          }}
        >
          <Title onClick={() => setActive(1)}>Thông tin sản phẩm</Title>


        </div>
        {active === 1 ? (
          <WrapContent>
            <ContentDescription>
              {productDetails?.description}
            </ContentDescription>
          </WrapContent>
        ) : (
          <TableContent>
            <tbody>
              <tr style={{ backgroundColor: 'rgba(90, 30, 135, 0.2)' }}>
                <AttributeItem>Name</AttributeItem>
                <AttributeValue>{productDetails?.name}</AttributeValue>
              </tr>
              <tr>
                <AttributeItem>Price</AttributeItem>
                <AttributeValue>{productDetails?.price}</AttributeValue>
              </tr>
              <tr style={{ backgroundColor: 'rgba(90, 30, 135, 0.2)' }}>
                <AttributeItem>Rating</AttributeItem>
                <AttributeValue>
                  {productDetails?.rating}
                </AttributeValue>
              </tr>
              <tr>
                <AttributeItem>Discount</AttributeItem>
                <AttributeValue>{productDetails?.discount} %</AttributeValue>
              </tr>
            </tbody>
          </TableContent>
        )}
      </Row> */}


      <Row style={{
        padding: '16px',
        background: '#fff',
        borderRadius: '0',
        marginTop: '5px',
        boxShadow: ' 0 0 1pt 1pt #000',
      }}
      >
        <p
          style={{
            paddingLeft: '16px',
            width: '516px',
            fontSize: '16px',
            whiteSpace: 'pre-line',
            textAlign: 'justify',
          }}
        >
          {/* {productDetails?.name} */}
        </p>
        {/* spectification */}
        <div
          style={{
            width: '100%',
            height: '56px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px',
            borderRadius: '0',
            boxShadow: ' 0 0 1pt 1pt #000',
            fontWeight: 'bold',

          }}
        >
          <Title onClick={() => setActive(1)}>Thông tin nổi bật</Title>
          <Title onClick={() => setActive(2)}>Thông số kỹ thuật</Title>

        </div>
        {active === 1 ? (
          <WrapContent>
            <ContentDescription>
              {productDetails?.description}
            </ContentDescription>
          </WrapContent>
        ) : (
          <TableContent>
            <tbody>
              <tr style={{ backgroundColor: 'rgba(90, 30, 135, 0.2)' }}>
                {/* <AttributeItem>Name</AttributeItem>
                <AttributeValue>{productDetails?.name}</AttributeValue> */}
                <AttributeItem>Màn hình</AttributeItem>
                <AttributeValue>{productDetails?.hardDrive}</AttributeValue>
              </tr>
              <tr>
                {/* <AttributeItem>Price</AttributeItem> */}
                {/* <AttributeValue>{productDetails?.price}</AttributeValue> */}
                <AttributeItem>CPU</AttributeItem>
                <AttributeValue>{productDetails?.cpu}</AttributeValue>

              </tr>
              <tr style={{ backgroundColor: 'rgba(90, 30, 135, 0.2)' }}>
                {/* <AttributeItem>Rating</AttributeItem> */}
                <AttributeItem>RAM</AttributeItem>
                <AttributeValue>
                  {/* {productDetails?.rating} */}
                  {productDetails?.ram}
                </AttributeValue>
              </tr>
              <tr>
                {/* <AttributeItem>Discount</AttributeItem>
                <AttributeValue>{productDetails?.discount} %</AttributeValue> */}
                <AttributeItem>Ổ cứng</AttributeItem>
                <AttributeValue>{productDetails?.monitor}</AttributeValue>
              </tr>
            </tbody>
          </TableContent>
        )}
      </Row>



    </Loading >


  )
}

export default ProductdetailsComponent