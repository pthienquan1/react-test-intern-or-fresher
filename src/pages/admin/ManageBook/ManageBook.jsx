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
import { callDeleteBook, callFetchListBook } from "../../../services/api";

import { FaTrash } from "react-icons/fa";

import { ExportOutlined, PlusOutlined } from "@ant-design/icons";

import moment from "moment";
import * as XLSX from "xlsx";
import { BsPencilFill } from "react-icons/bs";
import BookViewDetail from "./BookViewDetail";
import BookModalCreate from "./BookModalCreate";
import BookUpdate from "./BookUpdate";

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
  const [openViewBookDetail, setOpenViewBookDetail] = useState(false);
  const [dataViewBookDetail, setDataViewBookDetail] = useState("");
  const [openModalCreate, setOpenModalCreate] = useState(false);

  //Update
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);

  const handleOpenModalCreate = () => {
    setOpenModalCreate(true);
  };

  const renderHeaderBook = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
          Table list book (Ấn vào ID của từng cuốn sách để xem chi tiết)
        </span>
        <span style={{ display: "flex", gap: 15 }}>
          <Button
            icon={<ExportOutlined />}
            type="primary"
            onClick={() => handleExportData()}
          >
            Export{" "}
          </Button>

          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={handleOpenModalCreate}
          >
            Thêm mới
          </Button>
          <BookModalCreate
            openModalCreate={openModalCreate}
            setOpenModalCreate={setOpenModalCreate}
            fetchBooks={fetchBooks}
            listBook={listBook}
            setListBook={setListBook}
          />

          <BookUpdate
            openModalUpdate={openModalUpdate}
            setOpenModalUpdate={setOpenModalUpdate}
            dataUpdate={dataUpdate}
            setDataUpdate={setDataUpdate}
            fetchBooks={fetchBooks}
          />
        </span>
      </div>
    );
  };
  const columnsBooks = [
    {
      title: "ID",
      dataIndex: "_id",
      width: "20%",
      render: (text, record, index) => {
        return (
          <a
            href="#"
            onClick={() => {
              setDataViewBookDetail(record);
              setOpenViewBookDetail(true);
            }}
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
            <Popconfirm 
            placement="rightTop"
              title={"Xác nhận xóa sách này"}
              description={"Bạn có chắc chắn muốn xóa quyển sách này không?"}
              onConfirm={() => handleDeleteBook(record._id)}
              okText="Xóa"
              cancelText="Quay lại">
              <span style={{ marginLeft: "20px", cursor: "pointer" }}>
                <FaTrash style={{ color: "red" }} />
              </span>
            </Popconfirm>
            <BsPencilFill
              style={{ color: "blue", marginLeft: "20px", cursor: "pointer" }}
              onClick={() => {
                setOpenModalUpdate(true);
                setDataUpdate(record);
              }}
            />
          </>
        );
      },
    },
  ];

  const handleDeleteBook = async (id) =>{
    const res = await callDeleteBook(id);
    if(res && res.data){
      message.success("Xóa thành công");
       fetchBooks();
    }
    else{
        notification.error({
          message:"có lỗi rồi",
          description:res.message
        })
    }
  }
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

    fetchBooks(query);
  };
  const onClear = () => {
    setMainText("");
    setAuthor("");
    setCategory("");
  };

  useEffect(() => {
    fetchBooks();
  }, [current, pageSize]);

  const onChange = (pagination, filters, sorter) => {
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
    } 
   
    console.log(">>CHECK", pagination, "sort", sorter);
  };

  const handleExportData = () => {
    if (listBook.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(listBook);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "ExportFile.xlsx");
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
            onChange={(e) => setMainText(e.target.value)}
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
            onChange={(e) => setCategory(e.target.value)}
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
        className="def"
        dataSource={listBook}
        columns={columnsBooks}
        title={renderHeaderBook}
        rowKey="_id"
        loading={isLoading}
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

      <BookViewDetail
        openViewBookDetail={openViewBookDetail}
        setOpenViewBookDetail={setOpenViewBookDetail}
        dataViewBookDetail={dataViewBookDetail}
        setDataViewBookDetail={setDataViewBookDetail}
      />
    </div>
  );
};

export default ManageBook;
