import React from "react";
import logo from "./logo.png";
import "./Header.css";
import { AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Avatar, Badge, Space, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
const items = [
  {
    label: <label style={{ cursor: "pointer" }}>Quản lý tài khoản</label>,
    key: "account",
  },
  {
    label: (
      <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
        Đăng xuất
      </label>
    ),
    key: "logout",
  },
];

const Header = () => {
  return (
    <div className="header-container">
      <div className="header-logo">
        <img src={logo} />
        <p>BookStore</p>
      </div>

      <input type="text" placeholder="Bạn tìm gì hôm nay" />
      <AiOutlineSearch
        style={{
          fontSize: "2.3rem",
          marginTop: "23px",
          marginLeft: "10px",
          cursor: "pointer",
        }}
      />

      <Space size="middle">
        <Badge count={5}>
          <Avatar
            shape="square"
            size="large"
            icon={<AiOutlineShoppingCart />}
            style={{
              background: "none",
              color: "#6C9BCF",
              marginLeft: "250px",
              marginTop: "-10px",
              fontSize: "2.3rem",
              cursor: "pointer",
            }}
          />
        </Badge>
      </Space>

      <Dropdown menu={{ items }} trigger={["click"]} className="menu-dropdown">
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            Tài khoản 
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </div>
  );
};

export default Header;
