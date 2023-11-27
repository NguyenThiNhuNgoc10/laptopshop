import React, { useEffect, useState } from "react"
import { WrapperContainerLeft, WrapperContainerRight } from "./style"
import InputForm from "../../components/InputForm/InputForm"
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent"
import imageLogo from "../../assets/images/sign-in.png"
import { Image } from "antd"
import { WrapperTextLight } from "../TypeProductPage/style"
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import * as UserService from '../../services/UserServices'
import { useMutationHooks } from "../../hooks/useMutationHook"
import Loading from "../../hooks/LoadingComponent/Loading"
import * as message from "../../components/Message/Message"
import jwt_decode from "jwt-decode";
import { updateUser } from '../../redux/slides/userSlide'
import { useDispatch } from 'react-redux'
import * as Message from '../../components/Message/Message'

const SignInPage = () => {
    const [isShowPassword, setIsShowpassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const location = useLocation()

    const navigate = useNavigate();

    const mutation = useMutationHooks(
        (data) => UserService.loginUser(data)
    )

    const { data, isLoading, isSuccess, isError } = mutation



    const handleGetDetailsUser = async (id, token) => {
        const storage = localStorage.getItem('refresh_token')
        const refreshToken = JSON.stringify(storage)
        // lay duoc du lieu tu backend
        const response = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...response?.data, access_token: token, refreshToken }))
    }
    useEffect(() => {
        if (data?.status === 'OK') {

            navigate('/')
            localStorage.setItem('access_token', JSON.stringify(data?.access_token))
            localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
            if (data?.access_token && typeof data?.access_token === 'string') {
                const decoded = jwt_decode(data?.access_token)
                if (decoded?.id) {
                    handleGetDetailsUser(decoded?.id, data?.access_token)
                }
            }

        } else if (data?.status === 'ERR') {
            Message.error(data?.message)
        }
    }, [data?.status])


    const handleNavigateSignUp = () => {
        navigate('/sign-up')
    }

    const handleOnchangeEmail = (value) => {
        setEmail(value)

    }

    const handleOnchangePassword = (value) => {
        setPassword(value)

    }

    const handleSignIn = () => {
        mutation.mutate({
            email,
            password
        })
        console.log('sign-in', email, password)
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(136deg, rgb(240, 248, 255) -1%, rgb(219, 238, 255) 85%)', height: '100vh' }}>
            <div>
            </div>
            <WrapperContainerLeft>
                <Image src={imageLogo} preview={false} alt="sign-in" height="auto" math-width="540px"></Image>
            </WrapperContainerLeft>
            <div style={{ width: '500px', height: '445px', borderRadius: '6px', background: '#fff' }}>

                <WrapperContainerRight>
                    <h1 >Xin Chào</h1>
                    <p style={{ fontSize: '16px' }}>Vui lòng đăng nhập vào tài khoản</p>
                    <InputForm style={{ marginBottom: '10px' }} placeholder="@gmail.com" value={email} onChange={handleOnchangeEmail} />
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setIsShowpassword(!isShowPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '10px',
                                right: '8px',
                                fontSize: '12px'
                            }}
                        >{
                                isShowPassword ? (
                                    <EyeFilled />
                                ) : (
                                    <EyeInvisibleFilled />
                                )
                            }
                        </span>
                        <InputForm placeholder="password" type={isShowPassword ? "text" : "password"} value={[password]} onChange={handleOnchangePassword} />
                    </div>
                    {data?.status === 'ERR' && <span style={{ color: 'red', fontSize: '16px' }}>{data?.message}</span>}
                    <Loading isLoading={isLoading}>
                        <ButtonComponent
                            disabled={!email.length || !password.length}
                            onClick={handleSignIn}
                            // bordered={false} 
                            size={40}
                            styleButton={{
                                background: 'rgb(5, 5, 7)',
                                height: '48px',
                                width: '100%',
                                borderRadius: '4px',
                                border: 'none',
                                margin: '26px 0 10px'
                            }}
                            textButton={'Đăng nhập'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </Loading>
                    <p style={{ fontSize: '16px' }}><WrapperTextLight>Quên mật khẩu</WrapperTextLight></p>
                    <p style={{ fontSize: '16px' }} onClick={handleNavigateSignUp}>Chưa có tài khoản?<WrapperTextLight> Tạo tài khoản</WrapperTextLight></p>
                </WrapperContainerRight>
            </div>
        </div>
    )
}

export default SignInPage