import React from "react"
import ProductdetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent"
import { useNavigate, useParams } from "react-router-dom"

const ProductDetailsPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    return (
        <div style={{ padding: '5px', background: '#efefef', height: '100vh' }}>
            <div style={{ width: '1270px', height: '100%', margin: '0 auto' }}>
                <h5><span style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }} onClick={() => { navigate('/') }}> Chi tiết sản phẩm</span></h5>
                <ProductdetailsComponent idProduct={id} />
            </div >
        </div >
    )
}

export default ProductDetailsPage