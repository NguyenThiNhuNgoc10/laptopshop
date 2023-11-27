import { Col, Divider, Row } from 'antd'
import React from 'react'
import {
    FacebookFilled, GithubFilled, MailFilled,
    PhoneFilled, PushpinFilled,
} from '@ant-design/icons'
import { ContainerFooter, FooterItem, FooterList, WrapperFooter } from './style'
import { useNavigate } from 'react-router-dom'

const FooterComponent = () => {
    const navige = useNavigate()
    const handleAddress = () => {
        navige('/map')
    }
    const handleFacebookClick = () => {
        window.open('https://www.facebook.com/', '_blank')
    }
    const handleGithubClick = () => {
        window.open('https://www.github.com/', '_blank')
    }
    return (
        <ContainerFooter>
            <WrapperFooter
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
                <Col style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }} span={6}>
                    <span style={{
                        fontSize: '40px',
                        fontWeight: 'bold',
                        color: 'rgb(5,5,7)',
                        cursor: 'pointer'
                    }}>
                        Laptopshop
                    </span>
                    <span style={{
                        marginTop: '5px',
                        fontStyle: 'oblique',
                        fontWeight: '300'
                    }}></span>
                </Col>
                <Col xs={24} xl={6}>
                    <FooterList style={{ cursor: 'pointer', paddingBottom: "10px" }}>Địa chỉ
                        <div style={{ textAlign: 'left' }}>
                            <iframe
                                style={{ marginTop: "20px", marginRight: "20px" }}
                                // className='expandable-iframe'
                                src='https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d23651.30408792001!2d106.62409558413344!3d10.868459536359174!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1690950899112!5m2!1svi!2s'
                                allowFullScreen=''
                                loading='lazy'
                                width='250'
                                height='200'
                                paddingTop='20px'

                            ></iframe>
                        </div>
                    </FooterList>
                    {/* <FooterItem style={{ cursor: 'pointer', }} onClick={handleAddress}>
                        <PushpinFilled style={{
                            color: '#000',
                            paddingRight: '5px',
                            fontSize: '15px',
                            cursor: 'pointer',
                        }}
                        />
                        <span style={{ color: '#000' }}>Thành Phố Hồ Chí Minh</span>
                    </FooterItem> */}
                </Col >
                <Col xs={24} xl={6}>
                    <FooterList style={{ cursor: 'pointer' }}>Liên Hệ</FooterList>
                    <FooterItem style={{ cursor: 'pointer' }}>
                        <MailFilled style={{
                            color: '#000',
                            paddingRight: '5px', fontSize: '15px'
                        }} />
                        <span style={{ color: '#000' }}>2051120271@ut.edu.vn</span>
                    </FooterItem>
                    <FooterItem style={{ cursor: 'pointer' }}>
                        <PhoneFilled style={{
                            color: '#000',
                            paddingRight: '5px', fontSize: '15px'
                        }} />
                        <span style={{ color: '#000' }}>0123456789</span>
                    </FooterItem>
                </Col>
                <Col xs={24} xl={6} >
                    <FooterList style={{ cursor: 'pointer' }}>Mạng Xã Hội</FooterList>
                    <FooterItem onClick={handleFacebookClick} style={{ cursor: 'pointer' }}>
                        <FacebookFilled style={{
                            color: '#000',
                            paddingRight: '5px', fontSize: '15px'
                        }} />
                        <span style={{ color: '#000' }}>Laptopshop</span>
                    </FooterItem>
                    <FooterItem style={{ cursor: 'pointer' }} onClick={handleGithubClick} >
                        <GithubFilled style={{
                            color: '#000',
                            paddingRight: '5px', fontSize: '15px'
                        }} />
                        <span style={{ color: '#000' }}>Laptopshop</span>
                    </FooterItem>
                </Col>
            </WrapperFooter>
            {/* <Divider /> */}
            {/* <span style={{
                display: 'block',
                textAlign: 'center',
                color: '#8d8d8d',
                fontSize: '12px',
                fontWeight: '400'
            }}>@2023 - Duy Bảo - Trung Hiếu</span> */}


        </ContainerFooter >
    )
}

export default FooterComponent