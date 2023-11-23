import React from 'react'
import { Image } from 'antd';
import { WrapperSliderStyle } from './style';


const SliderComponent = ({arrImages}) => {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true, 
        autoplaySpeed: 1000
      };
    return (
        <div>
            <WrapperSliderStyle {...settings}>
                {arrImages.map((item) => {
                    return (
                        <Image key={item} src={item} alt="silder" preview={false} width="100%" height="274px"/>
                    )
                })}
            </WrapperSliderStyle>
        </div>
    )
}

export default SliderComponent