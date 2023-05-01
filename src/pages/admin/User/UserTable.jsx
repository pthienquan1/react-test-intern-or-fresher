import "./UserTable.css";
import { Table, Row, Col } from "antd";
import React, { useEffect, useState } from "react";
import "./UserTable.css";
import { current } from "@reduxjs/toolkit";
import { callFetchAccount, callFetchListUser } from "../../../services/api";

const columns = [
  {
    title: "ID",
    dataIndex: "_id",
    width: "20%",
  },
  {
    title: "Tên hiển thị",
    dataIndex: "fullName",

    width: "20%",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
  },
  {
    title: "Action",
    render: (text, record, index) => {
      return (
        <>
          <button>Delete</button>
        </>
      );
    },
  },
];

const UserTable = () => {
  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [total, setTotal] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const fetchUsers = async (searchFilter) => {
    setIsLoading(true);

    let query = `current=${current}&pageSize=${pageSize}`;

    if (searchFilter) {
      query += searchFilter;
    }

    const res = await callFetchListUser(query);

    if (res && res.data) {
      setListUser(res.data.result);
      setTotal(res.data.meta.total);
    }

    setIsLoading(false);
  };

  // const handleSearch = (query) =>{
  //     fetchUser(query);
  // }
  const onFinish = () => {
    let query = "";

    if (name) {
      query += `&fullName=/${name}/i`;
    }

    if (email) {
      query += `&email=/${email}/i`;
    }

    if (phone) {
      query += `&phone=/${phone}/i`;
    }

    fetchUsers(query);
  };

  const onChange = (pagination) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
    console.log(">>CHECK", pagination);
  };

  useEffect(() => {
    fetchUser();
  }, [current, pageSize]);

  const fetchUser = async () => {
    const query = `current=${current}&pageSize=${pageSize}`;
    const res = await callFetchListUser(query);
    if (res && res.data) {
      setListUser(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };
  return (
    <>
      <div className="admin-container">
        <div className="admin-input">
          <h2>Name</h2>
          <input
            type="text"
            placeholder="Input name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>

        <div className="admin-input">
          <h2>Email</h2>
          <input
            type="text"
            placeholder="Input email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>

        <div className="admin-input">
          <h2>Số điện thoại</h2>
          <input
            type="text"
            placeholder="Input phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          ></input>
        </div>

        <button type="submit" onClick={onFinish}>
          Search
        </button>
      </div>

      <Table
        className="def"
        columns={columns}
        dataSource={listUser}
        onChange={onChange}
        loading={isLoading}
        rowKey="_id"
        pagination={{
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
        }}
      />
    </>
  );
};

export default UserTable;
