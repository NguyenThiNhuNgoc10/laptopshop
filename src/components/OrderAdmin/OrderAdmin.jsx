import React, { useEffect, useRef, useState } from "react"
import { WrapperHeader } from "../HeaderComponent/style"
import { Button, Form, Space } from "antd"
import { UploadOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons"
import TableComponent from "../TableComponent/TableComponent"
import { WrapperUploadFile } from "./style"
import ModalComponent from "../ModalComponent/ModalComponent"
import { getBase64 } from "../../utils"
import * as message from "../../components/Message/Message"
import InputComponent from "../InputComponent/InputComponent"
import Loading from "../../hooks/LoadingComponent/Loading"
import DrawerComponent from "../DrawerComponent/DrawerComponent"
import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import * as OrderService from '../../services/OrderService'
import { orderContant } from "../../contant"
import PieChartComponent from "./PieChart";

const OrderAdmin = () => {
    // const [isModalOpen, setIsModalOpen] = useState(false);
    const user = useSelector((state) => state?.user)

    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token)
        return res
    }

    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
    const { isLoading: isLoadingOrders, data: orders } = queryOrder


    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    //ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    //onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                        fontSize: '15px',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        //onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        //onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                    fontSize: '18px',
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                //setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        //     render: (text) =>
        //       searchedColumn === dataIndex ? (
        //         <Highlighter
        //           highlightStyle={{
        //             backgroundColor: '#ffc069',
        //             padding: 0,
        //           }}
        //           searchWords={[searchText]}
        //           autoEscape
        //           textToHighlight={text ? text.toString() : ''}
        //         />
        //       ) : (
        //         text
        //       ),
    });

    const columns = [
        {
            title: 'User name',
            dataIndex: 'userName',
            sorter: (a, b) => a.userName.length - b.userName.length,
            ...getColumnSearchProps('userName')
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone.length - b.phone.length,
            ...getColumnSearchProps('phone')
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: (a, b) => a.address.length - b.address.length,
            ...getColumnSearchProps('address')
        },
        {
            title: 'Paided',
            dataIndex: 'isPaided',
            sorter: (a, b) => a.isPaided.length - b.isPaided.length,
            ...getColumnSearchProps('isPaided')
        },
        {
            title: 'Shipped',
            dataIndex: 'isDelivered',
            sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
            ...getColumnSearchProps('isDelivered')
        },
        {
            title: 'Payment method',
            dataIndex: 'paymentMethod',
            sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
            ...getColumnSearchProps('paymentMethod')
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
            ...getColumnSearchProps('totalPrice')
        },
    ];

    const dataTable = orders?.data?.length && orders?.data?.map((order) => {
        return {
            ...order, key: order._id, userName: order?.shippingAddress?.fullName, phone: order?.shippingAddress?.phone,
            address: order?.shippingAddress?.address, paymentMethod: orderContant.payment[order?.paymentMethod],
            isPaided: order?.isPaided ? 'TRUE' : 'FALSE', isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE'
        }
    })

    return (
        <div>
            <WrapperHeader>Quản lí đơn hàng</WrapperHeader>
            {/* <PieChartComponent /> */}
            <div style={{ height: "200px", width: "200px" }}>
                <PieChartComponent data={orders?.data} />
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} />
            </div>
        </div >

    )
}

export default OrderAdmin
