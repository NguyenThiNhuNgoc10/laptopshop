import React, { useEffect, useState } from 'react'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import { Col, Row } from 'antd'
import CardComponent from '../../components/CardComponent/CardComponent'
import { WrapperSearchProduct } from './style'

const SearchPage = () => {
    const [keyword, setKeyword] = useState('')
    const fetchProductAll = async (keyword) => {
        // Gọi ProductService.searchProduct() với keyword
        const keywordValue1 = keyword?.queryKey && keyword?.queryKey[1]
        const response = await ProductService.searchProduct(keywordValue1)
        return response
    }
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const keywordValue = urlParams.get('keyword')
        setKeyword(keywordValue)

        // Gọi hàm fetchProductAll() với keywordValue
        fetchProductAll(keywordValue)
    }, [keyword])

    // loc product
    const {
        isLoading,
        data: products,
        isPreviousData,
    } = useQuery(['products', keyword], fetchProductAll, {
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true,
    })
    return (
        <div style={{ marginTop: '40px', width: '1270px', margin: '0px auto' }}>
            <div
                style={{
                    fontSize: '30px',
                    fontWeight: '500',
                    lineHeight: '50px',
                    marginLeft: '8px',
                    marginTop: '8px',
                    // borderBottom: '1px solid #ff761c',
                    padding: '10px 0',
                }}
            >
                {`Kết quả tìm kiếm với từ khóa: ${keyword}`}
            </div>
            <div
                style={{
                    marginTop: '20px',
                }}
            >
                <WrapperSearchProduct
                    gutter={{
                        xs: 8,
                        sm: 16,
                        md: 24,
                        lg: 32,
                    }}
                >
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
                </WrapperSearchProduct>
            </div>
            <div
                style={{
                    width: '100%',
                    marginTop: '15px',
                }}
            >
            </div>
        </div>
    )
}

export default SearchPage