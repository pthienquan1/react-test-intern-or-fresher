import {
  Table,
  Row,
  Col,
  Button,
  Popconfirm,
  message,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { callFetchListBook } from "../../../services/api";

import { FaTrash } from "react-icons/fa";

import { ExportOutlined, PlusOutlined } from "@ant-design/icons";

import moment from "moment";
import * as XLSX from "xlsx";
import { BsPencilFill } from "react-icons/bs";

const ManageBook = (props) => {
  const [mainText, setMainText] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [listBook, setListBook] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(10);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const renderHeaderBook = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Table list book</span>
        <span style={{ display: "flex", gap: 15 }}>
          <Button
            icon={<ExportOutlined />}
            type="primary"
            // onClick={() => handleExportData()}
          >
            Export{" "}
          </Button>

          <Button
            icon={<PlusOutlined />}
            type="primary"
            //     onClick={handleOpenModalCreate}
          >
            Thêm mới
          </Button>
        </span>
      </div>
    );
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      width: "20%",
      render: (text, record, index) => {
        return (
          <a
            href="#"
            // onClick={() => {
            //   setDataViewDetail(record);
            //   setOpenViewDetail(true);
            // }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Tên sách",
      dataIndex: "mainText",
      sorter: true,
      width: "20%",
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      sorter: true,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "createdAt",
      sorter: true,
      render: (createdAt) => moment(createdAt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Action",
      render: (text, record, index) => {
        return (
          <>
            <span style={{ marginLeft: "20px", cursor: "pointer" }}>
              <FaTrash style={{ color: "red" }} />
            </span>

            <BsPencilFill
              style={{ color: "blue", marginLeft: "20px", cursor: "pointer" }}
              //   onClick={() => {
              //     setOpenModalUpdate(true);
              //     setDataUpdate(record);
              //   }}
            />
          </>
        );
      },
    },
  ];

  const fetchBooks = async (searchFilter, sortQuery) => {
    let query = `current=${current}&pageSize=${pageSize}`;
    if (searchFilter) {
      query += searchFilter;
    }
    if (sortQuery) {
      query += sortQuery;
    }

    const res = await callFetchListBook(query);
    if (res && res.data) {
      setListBook(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };
  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    fetchBooks(null, `&sort=${order === "ascend" ? "" : "-"}${field}`);
  };

  const onFinish = () => {
    let query = "";

    if (mainText) {
      query += `&mainText=/${mainText}/i`;
    }

    if (author) {
      query += `&author=/${author}/i`;
    }

    if (category) {
      query += `&category=/${category}/i`;
    }

    fetchUsers(query);
  };
  const onClear = () => {
    setBook("");
    setAuthor("");
    setType("");
  };

  useEffect(() => {
    fetchBooks();
  }, [current, pageSize]);

  const onChange = (pagination, sorter) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
    if (
      sorter &&
      sorter.field &&
      sorter.order &&
      (sorter.field !== sortField || sorter.order !== sortOrder)
    ) {
      handleSort(sorter.field, sorter.order);
    } else if (!sorter.field || !sorter || !sorter.order) {
      fetchBooks();
    }
  };
  return (
    <div>
      <div className="admin-container">
        <div className="admin-input">
          <h2>Tên sách</h2>
          <input
            type="text"
            placeholder="Input book"
            value={mainText}
            onChange={(e) => setBook(e.target.value)}
          ></input>
        </div>

        <div className="admin-input">
          <h2>Tác giả</h2>
          <input
            type="text"
            placeholder="Input author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          ></input>
        </div>

        <div className="admin-input">
          <h2>Thể loại</h2>
          <input
            type="text"
            placeholder="Input phone number"
            value={category}
            onChange={(e) => setType(e.target.value)}
          ></input>
        </div>

        <div className="btn-container">
          <button type="submit" onClick={onFinish}>
            Search
          </button>
          <button type="submit" className="clear" onClick={onClear}>
            Clear
          </button>
        </div>
      </div>

      <Table
        className="lstBook"
        dataSource={listBook}
        columns={columns}
        title={renderHeaderBook}
        rowKey="_id"
        onChange={onChange}
        pagination={{
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]} trên {total} bản ghi
              </div>
            );
          },
        }}
      />
    </div>
  );
};

export default ManageBook;
