import { Badge, Button, Col, Popover } from "antd"
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccout, WrapperTextHeader, WrapperTextHeaderSmall, WrapperSearch } from "./style"
import React, { useEffect, useState, } from "react"
import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from '../../services/UserServices'
import { updateUser } from '../../redux/slides/userSlide'
import { resetUser } from '../../redux/slides/userSlide'
import Loading from "../../hooks/LoadingComponent/Loading";
import { searchProduct } from "../../redux/slides/productSlide";
import { useDebounce } from "../../hooks/useDebounce";

// import ButtonComponent from "../ButtonComponent/ButtonComponent";

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const [search, setSearch] = useState('')
    const debounceSearch = useDebounce(search, 500);
    const [isOpenPopup, setIsOpenPopup] = useState(false)
    const order = useSelector((state) => state.order)
    const [loading, setLoading] = useState(false)
    const handleNavigateLogin = () => {
        navigate('/sign-in')
    }
    const handleNavigateHome = () => {
        navigate('/')
    }
    const handleLogout = async () => {
        setLoading(true)
        await UserService.logoutUser()
        //localStorage.removeItem("access_token")
        dispatch(resetUser())

        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
        setLoading(false)
    }, [user?.name, user?.avatar])

    const content = (
        <div>
            <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>Thông tin người dùng</WrapperContentPopup>
            {user?.isAdmin && (
                <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lí hệ thống</WrapperContentPopup>
            )}
            <WrapperContentPopup onClick={() => handleClickNavigate('my-order')}>Đơn hàng của tôi</WrapperContentPopup>
            <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
        </div>
    );

    const handleClickNavigate = (type) => {
        if (type === 'profile') {
            navigate('/profile-user')
        } else if (type === 'admin') {
            navigate('/system/admin')
        } else if (type === 'my-order') {
            navigate('/my-order', {
                state: {
                    id: user?.id,
                    token: user?.access_token
                }
            })
        } else {
            handleLogout()
        }
        setIsOpenPopup(false)
    }

    useEffect(() => {
        debounceSearch.trim()
        if (debounceSearch && debounceSearch !== "") {
            dispatch(searchProduct(debounceSearch));
        }

    }, [debounceSearch])

    const onSearch = (e) => {
        setSearch(e.target.value)
    }

    const [keyword, setKeyword] = useState('')

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            const searchUrl = `/search?keyword=${encodeURIComponent(keyword)}`
            //encodeURIComponent mã hóa kí tự đặc biệt
            navigate(searchUrl)
        }
    }

    const handleChange = (event) => {
        setKeyword(event.target.value)
        dispatch(searchProduct(event.target.value))
    }


    return (
        <div style={{ width: '100%', background: 'rgb(5, 5, 7)', display: 'flex', justifyContent: 'center', position: "fixed", zIndex: 10 }}>
            <WrapperHeader>
                <div>
                    <WrapperTextHeader to='/'>
                        LAPTOPSHOP
                    </WrapperTextHeader>

                </div>
                {!isHiddenSearch && (
                    <WrapperSearch>
                        <div>
                            <ButtonInputSearch
                                size="large"
                                type='text'
                                bordered={false}
                                // textButton="Tìm kiếm"
                                isLoading={loading}
                                // cleanData={() => {
                                //     setSearch("")
                                // }}
                                // value={search}
                                placeholder="Nhập tên sản phẩm muốn tìm kiếm!"
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}

                            />

                        </div>
                    </WrapperSearch>
                )}
                <div style={{ display: 'flex', gap: ' 54px', alignItems: 'center' }}>
                    <Loading isLoading={loading}>
                        <WrapperHeaderAccout>
                            {userAvatar ? (
                                <img src={userAvatar} alt="avatar" style={{
                                    height: '30px',
                                    width: '30px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }} />
                            ) : (
                                <UserOutlined style={{
                                    fontSize: '30px',

                                }} />
                            )}
                            {user?.access_token ? (
                                <>
                                    <Popover content={content} trigger="click" open={isOpenPopup}>
                                        <div style={{ cursor: 'pointer' }} onClick={() => setIsOpenPopup((prev) => !prev)}>{userName?.length ? userName : user?.email}</div>
                                    </Popover>
                                </>
                            ) : (

                                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                                    <WrapperTextHeaderSmall style={{ fontSize: '15px' }} >Đăng nhập/Đăng kí</WrapperTextHeaderSmall>
                                    <div>
                                        <WrapperTextHeaderSmall style={{ fontSize: '15px' }} >Tài khoản</WrapperTextHeaderSmall>
                                        {/* <CaretDownOutlined /> */}
                                    </div>
                                </div>
                            )}
                        </WrapperHeaderAccout>
                    </Loading>
                    {!isHiddenCart && (
                        <div onClick={() => navigate('/order')} style={{ cursor: 'pointer' }}>
                            <Badge count={order?.orderItems?.length} size="small">
                                <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                            </Badge>
                            <WrapperTextHeaderSmall style={{ fontSize: '15px' }} >Giỏ hàng</WrapperTextHeaderSmall>
                        </div>
                    )}
                </div>
            </WrapperHeader>
        </div>
    )
}

export default HeaderComponent