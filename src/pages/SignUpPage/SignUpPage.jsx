import React, { useEffect, useState } from "react"
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent"
import { WrapperTextLight } from "../TypeProductPage/style"
import InputForm from "../../components/InputForm/InputForm"
import { WrapperContainerLeft, WrapperContainerRight } from "../SignInPage/style"
import { Image } from "antd"
import imageLogo from "../../assets/images/sign-in.png"
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import * as UserService from '../../services/UserServices'
import { useMutationHooks } from "../../hooks/useMutationHook"
import Loading from "../../hooks/LoadingComponent/Loading"
import * as message  from "../../components/Message/Message"




const SignUpPage = () => {
    const navigate = useNavigate()
    const [ isShowConfirmpassword, SetIsShowConfirmpassword ]  = useState(false)
    const [ isShowPassword, SetIsShowPassword ]  = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')



    const handleOnchangeEmail = (value) => {
        setEmail(value)

    }

    const mutation = useMutationHooks(
        data => UserService.signupUser(data)
      )
      
        const { data, isLoading, isSuccess, isError} = mutation

        useEffect(() => {
            if (isSuccess) {
              message.success()
              handleNavigateSignIn()
            } else if (isError) {
              message.error()
            }
          }, [isError, isSuccess]);

    const handleOnchangePassword = (value) => {
        setPassword(value)

    }

    const handleOnchangeConfirmPassword = (value) => {
        setConfirmPassword(value)

    }

    const handleNavigateSignIn = () => {
        navigate('/sign-in')
    }

    const handleSignUp = () => {
        mutation.mutate({ email, password, confirmPassword })
        console.log('sign-up', email, password, confirmPassword)
    }
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',  background: 'linear-gradient(136deg, rgb(240, 248, 255) -1%, rgb(219, 238, 255) 85%)' , height: '100vh'}}>  
            <WrapperContainerLeft>
            <Image src={imageLogo} preview={false} alt="sign-in" height="auto" math-width="540px"></Image>
            </WrapperContainerLeft>
            <div style={{ width: '500px', height: '445px',  borderRadius: '6px', background: '#fff'}}>
            
            <WrapperContainerRight>
                <h1 >Xin Chào</h1>
                <p style={{ fontSize: '16px' }}>Vui lòng đăng nhập vào tài khoản</p>
                <InputForm  style={{ marginBottom: '10px'}} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail}/>
                <div style={{ position: 'relative' }}>
                    <span 
                     onClick={() => SetIsShowPassword(!isShowPassword)}
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
                    <InputForm style={{ marginBottom: '10px'}} placeholder="password" type={isShowPassword ? "text" : "password"} 
                    value={password} onChange={handleOnchangePassword} />
                </div>
                <div style={{ position: 'relative' }}>
                    <span 
                    onClick={() => SetIsShowConfirmpassword(!isShowConfirmpassword)}
                        style={{ 
                            zIndex: 10,
                            position: 'absolute',
                            top: '10px',
                            right: '8px',
                            fontSize: '12px'
                        }}
                    >{
                        isShowConfirmpassword ? (
                            <EyeFilled />
                        ) : (
                            <EyeInvisibleFilled />
                        )
                    }  
                    </span>
                    <InputForm placeholder="confirm password" type={isShowConfirmpassword ? "text" : "password"} 
                    value={confirmPassword} onChange={handleOnchangeConfirmPassword} />
                </div>
                {data?.status === 'ERR' && <span style={{ color: 'red', fontSize: '16px' }}>{data?.message}</span>}
                <Loading isLoading={isLoading}>
                <ButtonComponent
                disabled={!email.length || !password.length || !confirmPassword.length}
                onClick={handleSignUp}
                    bordered="false"
                        size={40}
                        styleButton={{
                        background: 'rgb(5, 5, 7)',
                        height: '48px',
                        width: '100%',
                        borderRadius: '4px',
                        border: 'none',   
                        margin: '26px 0 10px'
                    }}
                    textButton={'Đăng ký'}
                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>
                </Loading>
                    <p style={{ fontSize: '16px'}}>Bạn đã có tài khoản?<WrapperTextLight onClick={handleNavigateSignIn}> Đăng nhập</WrapperTextLight></p>
            </WrapperContainerRight>
            </div>
        </div>
    )
} 

export default SignUpPage