import React from "react";
import logo from "./logo.png";
import "./Header.css";
import { AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Avatar, Badge, Space, Dropdown, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { callLogout } from "../../services/api";
import { doLogoutAction } from "../../redux/account/accountSlice";

const Header = () => {
  const itemsHeader = [
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

  const itemsHeaderAnonymous = [
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
          Đăng nhập
        </label>
      ),
      key: "login",
    },
    {
      label: (
        <label
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Đăng ký
        </label>
      ),
      key: "register",
    },
  ];

  const user = useSelector((state) => state.account.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công");

      navigate("/");
    }
  };
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

      {!isAuthenticated ? (
        <Dropdown
          className="dropdown-menu"
          menu={{ items: itemsHeaderAnonymous }}
          trigger={["click"]}
        >
          <a onClick={(e) => e.preventDefault()}>
            <div style={{ cursor: "pointer" }}>
              Tài khoản
              <DownOutlined />
            </div>
          </a>
        </Dropdown>
      ) : (
        <Dropdown
          className="dropdown-menu"
          menu={{ items: itemsHeader }}
          trigger={["click"]}
        >
          <a onClick={(e) => e.preventDefault()}>
            <div style={{ cursor: "pointer" }}>
              Welcome {user?.fullName}
              <DownOutlined />
            </div>
          </a>
        </Dropdown>
      )}
    </div>
  );
};

export default Header;
