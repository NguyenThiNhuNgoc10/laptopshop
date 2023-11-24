import React from "react"
import HeaderComponent from "../HeaderComponent/HeaderComponent"

const DefaultComponent = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh' }}>
            <HeaderComponent />
            <div style={{ paddingBottom: '20px', paddingTop: "60px" }}>
                {children}
            </div>

        </div>
    )
}

export default DefaultComponent