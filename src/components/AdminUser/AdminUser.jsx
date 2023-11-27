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
import { useMutationHooks } from "../../hooks/useMutationHook"
import * as UserService from '../../services/UserServices'





const AdminUser = () => {
    // const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const user = useSelector((state) => state?.user)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [stateUserDetails, setstateUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        avatar: '',
        address: '',
        city: '',
    })



    // const mutation = useMutationHooks(
    //     (data) => {
    //         const { name,
    //             email,
    //             phone,
    //             isAdmin,
    //         } = data

    //         const res = UserService.signupUser({
    //             name,
    //             email,
    //             isAdmin,
    //             phone: +phone,
    //         })
    //         return res
    //     }
    // )

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id,
                token,
                ...rests } = data

            const res = UserService.updateUser(
                id,
                token,
                { ...rests })
            return res
        }
    )

    const mutationDeletedMany = useMutationHooks(
        (data) => {

            const { token, ...ids
            } = data

            const res = UserService.deleteManyUser(
                ids,
                token)
            return res
        },
    )

    const handleDeleteManyUsers = (ids) => {
        mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const mutationDeleted = useMutationHooks(
        (data) => {

            const { id,
                token,
            } = data

            const res = UserService.deleteUser(
                id,
                token)
            return res
        },
    )

    const getAllUsers = async () => {
        const res = await UserService.getAllUser('false', user?.access_token)
        return res
    }

    const fetchGetDetailsUser = async (rowSelected) => {
        const res = await UserService.getDetailsUser(rowSelected)
        if (res?.data) {
            setstateUserDetails({
                name: res?.data.name,
                email: res?.data?.email,
                phone: res?.data?.phone,
                isAdmin: res?.data?.isAdmin,
                address: res?.data?.address,
                avatar: res?.data?.avatar,
                city: res?.data?.city,
            })
        }
        setIsLoadingUpdate(false)
    }
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])
    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true)
            fetchGetDetailsUser(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const handleDetailsUser = () => {
        setIsOpenDrawer(true)
    }

    // const { data, isLoading, isSuccess, isError } = mutation
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany



    const queryUser = useQuery({ queryKey: ['user'], queryFn: getAllUsers })
    const { isLoading: isLoadingUsers, data: users } = queryUser
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsUser} />
            </div>
        )
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        // setSearchText(selectedKeys[0]);
        // setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        // setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                        fontSize: '15px',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
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
                setTimeout(() => searchInput.current?.select(), 100);
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
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.email.length - b.email.length,
            ...getColumnSearchProps('email')
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: (a, b) => a.address.length - b.address.length,
            ...getColumnSearchProps('address')
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
            filters: [
                {
                    text: 'True',
                    value: true,
                },
                {
                    text: 'False',
                    value: false,
                },
            ],
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone - b.phone,
            ...getColumnSearchProps('phone')
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction,
        },
    ];
    const dataTable = users?.data?.length && users?.data?.map((user) => {
        return { ...user, key: user._id, isAdmin: user.isAdmin ? 'TRUE' : 'FALSE' }
    })

    // const handleCancel = () => {
    //     // setIsModalOpen(false);
    //     setstateUser({
    //         name: '',
    //         email: '',
    //         phone: '',
    //         isAdmin: false,
    //     })
    //     form.resetFields()
    // };

    // useEffect(() => {
    //     if (isSuccess && data?.status === 'OK') {
    //         message.success()
    //         handleCancel()
    //     } else if (isError) {
    //         message.error()
    //     }
    // }, [isSuccess])

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success()
            handleCancelDelete()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccessDeleted])

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccessDeletedMany])

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setstateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        })
        form.resetFields()
    };

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success()
            handleCloseDrawer()
        } else if (isErrorUpdated) {
            message.error()
        }
    }, [isSuccessUpdated])

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteUser = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    // const onFinish = () => {
    //     mutation.mutate(stateUser, {
    //         onSettled: () => {
    //             queryUser.refetch()
    //         }
    //     })
    // }

    // const handleOnchange = (e) => {
    //     setstateUser({
    //         ...stateUser,
    //         [e.target.name]: e.target.value
    //     })
    // }

    const handleOnchangeDetails = (e) => {
        setstateUserDetails({
            ...setstateUserDetails,
            [e.target.name]: e.target.value
        })
    }


    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setstateUserDetails({
            ...stateUserDetails,
            avatar: file.preview
        })
    }
    console.log('user', user)
    const onUpdateUser = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetails }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }
    return (
        <div>
            <WrapperHeader>Quản lí người dùng</WrapperHeader>
            <div style={{ marginTop: '20px' }}>
                <TableComponent handleDeleteMany={handleDeleteManyUsers} columns={columns} isLoading={isLoadingUsers} data={dataTable} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record._id)
                        }
                    };
                }} />
            </div>
            {/* <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Loading isLoading={isLoading}>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 18,
                        }}
                        onFinish={onFinish}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your name!',
                                },
                            ]}
                        >
                            <InputComponent value={stateUser['name']} onChange={handleOnchange} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <InputComponent value={stateUser.email} onChange={handleOnchange} name="email" />
                        </Form.Item>

                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your phone!',
                                },
                            ]}
                        >
                            <InputComponent value={stateUser.phone} onChange={handleOnchange} name="phone" />
                        </Form.Item> */}

            {/* <Form.Item
                label="Image"
                name="image"
                rules={[
                    {
                        required: true,
                        message: 'Please input your count image!',
                    },
                ]}
            >
                <WrapperUploadFile maxCount={1}>
                    <Button>Select File</Button>
                    {stateUserDetails?.avatar && (
                        <img src={stateUserDetails?.avatar} style={{
                            height: '60px',
                            width: '60px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginLeft: '10px'
                        }} alt="avatar" />
                    )}
                </WrapperUploadFile>
            </Form.Item> */}


            {/* <Form.Item
                wrapperCol={{
                    offset: 20,
                    span: 16,
                }}>

                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
                </Loading >
            </ModalComponent > */}
            <DrawerComponent forceRender title="Chi tiết người dùng" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated} >
                    <Form
                        name="basic"
                        labelCol={{
                            span: 2,
                        }}
                        wrapperCol={{
                            span: 22,
                        }}
                        onFinish={onUpdateUser}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your name!',
                                },
                            ]}
                        >
                            <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <InputComponent value={stateUserDetails['email']} onChange={handleOnchangeDetails} name="email" />
                        </Form.Item>

                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your count phone',
                                },
                            ]}
                        >
                            <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
                        </Form.Item>

                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your count address',
                                },
                            ]}
                        >
                            <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
                        </Form.Item>

                        <Form.Item
                            label="Avatar"
                            name="avatar"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your count image!',
                                },
                            ]}
                        >
                            <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                                <Button>Select File</Button>
                                {stateUserDetails?.avatar && (
                                    <img src={stateUserDetails?.avatar} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px'
                                    }} alt="avatar" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>


                        <Form.Item
                            wrapperCol={{
                                offset: 20,
                                span: 16,
                            }}>

                            <Button type="primary" htmlType="submit">
                                Apply
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent forceRender title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser} >
                <Loading isLoading={isLoadingDeleted}>
                    <div>Bạn có chắc chắn muốn xóa tài khoản này không?</div>
                </Loading>
            </ModalComponent>
        </div >

    )
}

export default AdminUser
