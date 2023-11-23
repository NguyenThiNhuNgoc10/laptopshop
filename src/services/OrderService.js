import { axiosJWT } from "./UserServices"

export const createOrder = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create-order`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getDetailsOrder = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-order-details/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getOrderByUserId = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order-details/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const cancelOrder = async (id, access_token, orderItems) => {
    const response = await
        axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/cancel-order/${id}`,
            { data: orderItems },
            {
                headers: {
                    token: `Bearer ${access_token}`,
                }
            })
    return response.data
}

export const getAllOrder = async (access_token) => {
    const response = await
        axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order`,
            {
                headers: {
                    token: `Bearer ${access_token}`,
                }
            })
    return response.data
}