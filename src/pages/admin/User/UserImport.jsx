import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";
import {
  message,
  Upload,
  Table,
  Button,
  Modal,
  Form,
  Input,
  notification,
  Divider,
} from "antd";

const { Dragger } = Upload;

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 2000);
};
const propsUpload = {
  name: "file",
  multiple: false,
  maxCount: 1,
  // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  accept:
    ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
  customRequest: dummyRequest,

  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const UserImport = (props) => {
  const { openModalCreateImport, setOpenModalCreateImport } = props;
  const [isSubmitImport, setIsSubmitImport] = useState(false);
  return (
    <div>
      <Modal
        title="Import user"
        open={openModalCreateImport}
        
        onText={"Tạo mới"}
        cancelText={"Hủy"}
        onCancel={() => setOpenModalCreateImport(false)}
        confirmLoading={isSubmitImport}
      >
        <Dragger {...propsUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from
            uploading company data or other banned files.
          </p>
        </Dragger>
        <div style={{ paddingTop: 20 }}>
          <Table
            title={() => <span>Dữ liệu upload</span>}
            columns={[
              { dataIndex: "fullName", title: "Tên hiển thị" },
              { dataIndex: "email", title: "Email" },
              { dataIndex: "phone", title: "Số điện thoại" },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
};

export default UserImport;
