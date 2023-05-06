import React, { useState } from 'react';
import './LayoutAdmin.css';
import { useDispatch, useSelector } from 'react-redux';
import { callLogout } from '../../../services/api';
import { doLogoutAction } from '../../../redux/account/accountSlice';
import { Outlet, useNavigate, Link} from 'react-router-dom';

import {
    AppstoreOutlined,
    ExceptionOutlined,
    HeartTwoTone,
    TeamOutlined,
    UserOutlined,
    DollarCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DownOutlined,
  } from '@ant-design/icons';
  import { Layout, Menu, Dropdown, Space, message } from 'antd';


const {Content, Footer,  Sider} = Layout;

const items = [
    {
        label: <Link to='/admin'>Dashboard</Link>,
        key: 'dashboard',
        icon: <AppstoreOutlined />
    },
    {
        label: <span>Manage Users</span>,
        // key: 'user',
        icon: <UserOutlined />,
        children: [
            {
                label: <Link to='/admin/user'>CRUD</Link>,
                key: 'crud',
                icon: <TeamOutlined />,
            },
            {
                label: 'Files1',
                key: 'file1',
                icon: <TeamOutlined />,
            }
        ]
    },
    {
        label: <Link to='/admin/book'>Manage Books</Link>,
        key: 'book',
        icon: <ExceptionOutlined />
    },
    {
        label: <Link to='/admin/order'>Manage Orders</Link>,
        key: 'order',
        icon: <DollarCircleOutlined />
    },

];

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard')
    const user = useSelector(state => state.account.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);

    const handleLogout = async () =>{
        const res = await callLogout();
        if(res.data && res){
            dispatch(doLogoutAction())
            message.success('Đăng xuất thành công')
            navigate('/')
        }
    }

    const itemsDropdown = [
        {
            label: <label style={{ cursor: 'pointer' }}>Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },

    ];




    return (
        <Layout
            style={{ minHeight: '100vh' }}
            className="layout-admin"
        >
            <Sider
                theme='dark'
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}>
                <h1 className='adName'>ADMIN</h1>
                <Menu
                    defaultSelectedKeys={[activeMenu]}
                    mode="inline"
                    items={items}
                    onClick={(e) => setActiveMenu(e.key)}
                    theme='dark'
                />
            </Sider>
            <Layout>
                <div className='admin-header'>
                    <span>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => setCollapsed(!collapsed),
                        })}
                    </span>
                    
      {!isAuthenticated ? 
        <span onClick={() => navigate("/login")}> Tài Khoản</span>
       : 
                    <Dropdown className='dropdown-menu' menu={{ items: itemsDropdown }} trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                Welcome {user?.fullName}
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
      }
                </div>
                <Content>
                    <Outlet />  
                </Content>
                <Footer style={{ padding: "20px", textAlign:"center" }}>
                    React Test Fresher &copy; Thiên Quân- Made with <HeartTwoTone />
                </Footer>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;
