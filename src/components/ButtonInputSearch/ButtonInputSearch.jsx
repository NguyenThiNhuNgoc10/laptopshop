import React from "react"
import { Button } from 'antd'
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";



const ButtonInputSearch = (props) => {
    const {
        value,
        loading,
        cleanData,
        size, placeholder, textButton,
        bordered, backgroundColorInput = '#fff',
        backgroundColorButton = '#fff',
        colorButton = '#000'
    } = props

    return (
        <div style={{ display: 'flex', }}>
            <InputComponent
                size={size}
                placeholder={placeholder}
                bordered={bordered}
                style={{
                    borderTopRightRadius: "0",
                    borderBottomRightRadius: "0",
                    backgroundColor: backgroundColorInput
                }}
                {...props}

            // style={{
            //     borderRight: "0",
            //     borderTopRightRadius: "0",
            //     borderBottomRightRadius: "0",
            //     backgroundColor: "#fff"
            //   }}
            // style={{  backgroundColor: backgroundColorInput }} 
            />

            {value !== "" && !loading && <button style={{ border: 'none', fontSize: '20px', backgroundColor: '#fff', paddingLeft: '10px' }} onClick={() => {
                cleanData()

            }}>
                <CloseOutlined />

            </button>}




            <ButtonComponent
                size={size}
                style={{
                    background: backgroundColorButton,
                    border: !bordered && 'none',
                    borderTopLeftRadius: "0",
                    borderBottomLeftRadius: "0"
                }}
                icon={<SearchOutlined />}
                textButton={textButton}
                styleButton={{ color: colorButton }}
            />
        </div>
    )
}

export default ButtonInputSearch