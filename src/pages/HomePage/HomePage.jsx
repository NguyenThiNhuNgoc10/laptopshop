import React, { useEffect, useRef, useState } from "react"
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct, WrapperContents } from "./style"
import SliderComponent from "../../components/SliderComponent/SliderComponent"
import slider_2 from "../../assets/images/slider_2.webp"
import slider_1 from "../../assets/images/slider_1.png"
import slider_5 from "../../assets/images/slider_5.jpg"
import slider_4 from "../../assets/images/slider_4.jpg"
import CardComponent from "../../components/CardComponent/CardComponent"
import { useQuery } from "@tanstack/react-query"
import * as ProductService from "../../services/ProductService"
import { useSelector } from "react-redux"
import Loading from "../../hooks/LoadingComponent/Loading"
import { useDebounce } from "../../hooks/useDebounce"
import Footer from "../../components/Footer/Footer"


const HomePage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const refSearch = useRef()
    const [loading, setLoading] = useState(false)
    const [limit, setLimit] = useState(5)
    const [typeProducts, setTypeProducts] = useState([])
    const fetchProductAll = async (context) => {
        console.log('context', context)
        const limit = context?.queryKey && context.queryKey[1]
        // const search = context?.queryKey && context.queryKey[2]
        const res = await ProductService.getAllProduct('', limit)

        return res
    }

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        if (res?.status === 'OK') {
            setTypeProducts(res?.data)
        }
    }

    const { isLoading, data: products, isPreviousData } = useQuery(['products', limit], fetchProductAll, { retry: 3, retryDelay: 1000, keepPreviousData: true })

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])

    return (
        <Loading isLoading={isLoading || loading}>
            <div style={{ width: '1270px', margin: '0 auto' }}>
                <WrapperTypeProduct>
                    {typeProducts.map((item) => {
                        return (
                            <TypeProduct name={item} key={item} />
                        )
                    })}
                </WrapperTypeProduct>
            </div>
            <div className='body' style={{ with: '100%', backgroundColor: '#efefef', }}>
                <WrapperContents id="container" >
                    <span><SliderComponent arrImages={[slider_2, slider_1, slider_5, slider_4]} /></span>
                    <WrapperProducts>
                        {products?.data?.map((product) => {
                            return (
                                <CardComponent
                                    key={product._id}
                                    countInStock={product.countInStock}
                                    description={product.description}
                                    image={product.image}
                                    name={product.name}
                                    price={product.price}
                                    rating={product.rating}
                                    type={product.type}
                                    selled={product.selled}
                                    discount={product.discount}
                                    id={product._id}
                                />
                            )
                        })}
                    </WrapperProducts>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <WrapperButtonMore
                            textButton={isPreviousData ? 'Tải thêm' : "Xem Thêm"} type="outline" styleButton={{
                                border: '1px solid rgb(5, 5, 7)',
                                color: `${products?.total === products?.data?.length ? '#ccc' : 'rgb(5, 5, 7)'}`,
                                width: '240px',
                                height: '38px', borderRadius: '4px'
                            }}
                            disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                            styleTextButton={{ fontWeight: 500, color: products?.total === products?.data?.length && "#fff" }}
                            onClick={() => setLimit((prev) => prev + 5)}
                        />
                    </div>
                </WrapperContents>
            </div>
            {/* <div style={{ textAlign: "center" }}>
                <iframe
                    style={{ borderRadius: "20px", marginTop: "20px" }}
                    src='https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d23651.30408792001!2d106.62409558413344!3d10.868459536359174!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1690950899112!5m2!1svi!2s'

                    allowfullscreen=""
                    loading="lazy"
                    width="800"
                    height="450"
                ></iframe>
            </div> */}
            <Footer />
        </Loading >

    )
}

export default HomePage