import { Checkbox, Form, Modal } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import {
    WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft,
    WrapperListOrder, WrapperRight, WrapperStyleHeader, WrapperTotal, WrapperInputNumber
} from './style'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import {
    decreaseAmount, increaseAmount,
    removeAllOrderProduct, removeOrderProduct,
    selectedOrder
} from '../../redux/slides/orderSlide'
import * as Message from '../../components/Message/Message'
import InputComponent from '../../components/InputComponent/InputComponent'
import * as UserServices from '../../services/UserServices'
import { updateUser } from '../../redux/slides/userSlide'
import { useNavigate } from 'react-router-dom'
import Step from '../../components/Steps/Step'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../hooks/LoadingComponent/Loading'
import { convertPrice } from '../../utils'


const OrderPage = () => {
    const order = useSelector((state) => state.order)
    const [listChecked, setListChecked] = useState([])
    const dispatch = useDispatch()

    const user = useSelector((state) => state.user)
    const [stateUserDetail, setStateUserDetail] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
    })
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)

    const [form] = Form.useForm()

    const navige = useNavigate()

    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true)
    }
    const handleAddCard = () => {
        if (!order?.orderItemsSelected?.length) {
            Message.error('Vui lòng chọn sản phẩm')
        } else if (!user?.phone || !user?.address || !user.name || !user?.city) {
            setIsOpenModalUpdateInfo(true)
        } else {
            navige('/payment')
        }
    }

    const handleCancleUpdate = () => {
        setStateUserDetail({
            name: '',
            email: '',
            phone: '',
            address: '',
            isAdmin: false,
        });
        form.resetFields()
        setIsOpenModalUpdateInfo(false)
    }

    // lay gia tri cua nguoi dung nhap vao
    const handleOnchangeDetails = (e) => {
        setStateUserDetail({
            ...stateUserDetail,
            [e.target.name]: e.target.value,
        })
    }

    // gia tri duoc dua vao mutation update product
    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data
        console.log('data', data)
        const response = UserServices.updateUser(
            id,
            { ...rests },
            token
        )
        console.log('response', response)
        return response
    })
    // mutation
    const {
        data,
        isLoading,
    } = mutationUpdate

    // khi click vao finish thi gia tri nhap vao se duoc luu vao mutation
    const handleUpdateInforUser = () => {
        const { name, address, city, phone } = stateUserDetail
        if (name && address && city && phone) {
            mutationUpdate.mutate({
                id: user?.id,
                token: user?.access_token,
                ...stateUserDetail,
            }, {
                onSuccess: () => {
                    dispatch(updateUser({ name, address, city, phone }))
                    setIsOpenModalUpdateInfo(false)
                }
            })
        }
    }


    const onChange = (e) => {
        if (listChecked.includes(e.target.value)) {
            const newListChecked = listChecked.filter(
                (item) => item !== e.target.value
            )
            setListChecked(newListChecked)
        } else {
            setListChecked([...listChecked, e.target.value])
        }
    }

    const handleChangeCount = (type, idProduct, limit) => {
        if (type === 'increase') {
            if (!limit) {
                dispatch(increaseAmount({ idProduct }));
            }
        } else {
            if (!limit) {
                dispatch(decreaseAmount({ idProduct }));
            }
        }
    }

    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({ idProduct }))
    }

    const handleOnchangeCheckAll = (e) => {
        if (e.target.checked) {
            const newListChecked = []
            order?.orderItems?.forEach((item) => {
                newListChecked.push(item?.product)
            })
            setListChecked(newListChecked)
        } else {
            setListChecked([])
        }
    }

    const handleRemoveAllOrder = () => {
        if (listChecked?.length) {
            dispatch(removeAllOrderProduct({ listChecked }))
        }
    }
    // tính tiền
    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + cur.price * cur.amount
        }, 0)
        return result
    }, [order])

    const discountMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + (cur.discount * cur.amount)
        }, 0)
        if (Number(result)) {
            return result
        }
        return 0
    }, [order])

    const DeliveryPriceMemo = useMemo(() => {
        if ((priceMemo === 0 && order?.orderItemsSelected?.length === 0) || priceMemo >= 2000000) {
            return 0
        } else if (priceMemo < 500000) {
            return 30000
        } else {
            return 15000
        }
    }, [order])

    const TotalPriceMemo = useMemo(() => {
        return (
            Number(priceMemo) + Number(DeliveryPriceMemo) - Number(discountMemo)
        )
    }, [priceMemo, discountMemo, DeliveryPriceMemo])

    const itemsDelivery = [
        {
            title: '10.000.000 VND',
            description: 'Dưới 10.000.000 VND',
        },
        {
            title: '20.000.000 VND',
            description: 'Từ 20.0000.000 VND đến dưới 50.000.000 VND',
        },
        {
            title: 'Free ship',
            description: 'Trên 50.000.000 VND',
        },
    ]
    useEffect(() => {
        dispatch(selectedOrder({ listChecked }))
    }, [listChecked])

    useEffect(() => {
        form.setFieldValue(stateUserDetail)
    }, [form, stateUserDetail])
    useEffect(() => { }, [priceMemo, DeliveryPriceMemo])
    useEffect(() => {
        if (isOpenModalUpdateInfo) {
            setStateUserDetail({
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone
            })
        }
    }, [isOpenModalUpdateInfo])

    return (
        <div style={{ background: '#f5f5fa', with: '100%', height: '100vh', padding: '10px' }}>
            <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                <h3><span style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '20px', paddingLeft: '10px' }}>Giỏ hàng</span></h3>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <WrapperLeft>
                        <div style={{ backgroundColor: "#fff", padding: '16px' }}>
                            <Step items={itemsDelivery} current={DeliveryPriceMemo === 10000 ? 2 : DeliveryPriceMemo === 20000 ? 1 : order.orderItemsSelected.length === 0 ? 0 : 3} />
                        </div>
                        <WrapperStyleHeader>
                            <span style={{ display: 'inline-block', width: '390px' }}>
                                <Checkbox
                                    onChange={handleOnchangeCheckAll}
                                    checked={listChecked?.length === order?.orderItems?.length}
                                ></Checkbox>
                                <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                            </span>

                            <div
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                <span>Đơn giá</span>
                                <span>Số lượng</span>
                                <span>Thành tiền</span>
                                <DeleteOutlined
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleRemoveAllOrder}
                                />
                            </div>
                        </WrapperStyleHeader>
                        <WrapperListOrder>
                            {order?.orderItems?.map((order) => {
                                return (
                                    <WrapperItemOrder>
                                        <div
                                            style={{
                                                width: '390px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 4
                                            }}>
                                            <Checkbox
                                                onChange={onChange}
                                                value={order?.product}
                                                checked={listChecked.includes(order?.product)}
                                            ></Checkbox>
                                            <img src={order?.image}
                                                style={{
                                                    width: '77px',
                                                    height: '79px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <div style={{
                                                width: 260,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {order?.name}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                flex: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}>
                                            <span>
                                                <span
                                                    style={{
                                                        fontSize: '13px',
                                                        color: '#242424'
                                                    }}>
                                                    {convertPrice(order?.price)}
                                                </span>
                                            </span>
                                            <WrapperCountOrder>
                                                <button
                                                    style={{
                                                        border: 'none',
                                                        background: 'transparent',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => handleChangeCount('decrease', order?.product, order?.amount === 1)}
                                                >
                                                    <MinusOutlined
                                                        style={{ color: '#000', fontSize: '10px' }} />
                                                </button>
                                                <WrapperInputNumber
                                                    defaultValue={order?.amount}
                                                    value={order?.amount}
                                                    size='small'
                                                    min={1} max={order?.countInstock}
                                                />

                                                <button
                                                    style={{
                                                        border: 'none',
                                                        background: 'transparent',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => handleChangeCount("increase", order?.product, order?.amount === order?.countInstock)
                                                    }
                                                >
                                                    <PlusOutlined
                                                        style={{ color: '#000', fontSize: '10px' }} />
                                                </button>
                                            </WrapperCountOrder>
                                            <span
                                                style={{
                                                    color: 'rgb(255, 66, 78)',
                                                    fontSize: '13px',
                                                    fontWeight: 500
                                                }}>
                                                {convertPrice(order?.price * order?.amount)}
                                            </span>

                                            <DeleteOutlined
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleDeleteOrder(order?.product)}
                                            />
                                        </div>
                                    </WrapperItemOrder>
                                )
                            })}
                        </WrapperListOrder>
                    </WrapperLeft>
                    <WrapperRight>
                        <div style={{ width: '100%' }}>
                            <WrapperInfo >
                                <div >
                                    <span style={{ fontSize: '14px' }} >Địa chỉ: </span>
                                    <span style={{ fontWeight: 'bold', padding: '5px', fontSize: '14px' }}>
                                        {`${user?.address} , ${user?.city}`}
                                    </span>
                                    <span
                                        onClick={handleChangeAddress}
                                        style={{ color: '#9255FD', cursor: 'pointer', fontSize: '14px' }}
                                    >
                                        Thay đổi
                                    </span>
                                </div>
                            </WrapperInfo>
                        </div>


                        <div style={{ width: '100%' }}>
                            <WrapperInfo style={{
                                fontSize: '14px'
                            }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        fontSize: '14px'
                                    }}>
                                    <span>Tạm tính</span>
                                    <span
                                        style={{
                                            color: '#000',
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}>{convertPrice(priceMemo)}
                                    </span>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                    <span>Giảm giá</span>
                                    <span
                                        style={{
                                            color: '#000',
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {convertPrice(discountMemo)}
                                    </span>
                                </div>


                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                    <span>Phí giao hàng</span>
                                    <span
                                        style={{
                                            color: '#000',
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {convertPrice(DeliveryPriceMemo)}
                                    </span>
                                </div>
                            </WrapperInfo>

                            <WrapperTotal style={{
                                fontSize: '14px'
                            }}>
                                <span>Tổng tiền</span>
                                <span
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',

                                    }}>
                                    <span
                                        style={{
                                            color: 'rgb(254, 56, 52)',
                                            fontSize: '24px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {convertPrice(TotalPriceMemo)}
                                    </span>
                                    <span
                                        style={{
                                            color: '#000',
                                            fontSize: '11px'
                                        }}>(Đã bao gồm VAT nếu có)
                                    </span>
                                </span>
                            </WrapperTotal>
                        </div>
                        <ButtonComponent
                            // onClick={() => handleAddCard(productDetails, numProduct)}
                            onClick={() => handleAddCard()}
                            size={40}

                            styleButton={{
                                background: 'rgb(5, 5, 7)',
                                height: '48px',
                                width: '100%',
                                borderRadius: '4px',
                                border: 'none',
                                margin: '26px 0 10px'
                            }}

                            styleTextButton={{
                                color: '#fff',
                                fontSize: '15px',
                                fontWeight: '700'
                            }}
                            textButton={'Mua hàng'}
                        ></ButtonComponent>
                    </WrapperRight>
                </div>
            </div>
            <ModalComponent
                title='Cập nhật thông tin giao hàng'
                open={isOpenModalUpdateInfo}
                onCancel={handleCancleUpdate}
                onOk={handleUpdateInforUser}
            >
                <Loading isLoading={isLoading}>
                    <Form
                        name='basic'
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        autoComplete='on'
                        form={form}
                    >
                        <Form.Item
                            label='Name'
                            name='name'
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent
                                value={stateUserDetail['name']}
                                onChange={handleOnchangeDetails}
                                name='name'
                            />
                        </Form.Item>
                        <Form.Item
                            label='City'
                            name='city'
                            rules={[{ required: true, message: 'Please input your city!' }]}
                        >
                            <InputComponent
                                value={stateUserDetail['city']}
                                onChange={handleOnchangeDetails}
                                name='city'
                            />
                        </Form.Item>
                        <Form.Item
                            label='Phone'
                            name='phone'
                            rules={[{ required: true, message: 'Please input your  phone!' }]}
                        >
                            <InputComponent
                                value={stateUserDetail.phone}
                                onChange={handleOnchangeDetails}
                                name='phone'
                            />
                        </Form.Item>

                        <Form.Item
                            label='Adress'
                            name='address'
                            rules={[
                                { required: true, message: 'Please input your  address!' },
                            ]}
                        >
                            <InputComponent
                                value={stateUserDetail.address}
                                onChange={handleOnchangeDetails}
                                name='address'
                            />
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>

        </div>
    )
}
export default OrderPage