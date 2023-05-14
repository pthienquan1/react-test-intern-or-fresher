import React, { useEffect, useState } from "react";
import { BsPencilFill } from "react-icons/bs";
import { InboxOutlined } from "@ant-design/icons";

import {
  message,
  Modal,
  Form,
  Input,
  notification,
  Divider
} from "antd";
import { callUpdateUser } from "../../../services/api";

const UserUpdate = (props) => {
  const { openModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate,fetchUsers } = props;
  const [isSubmitUpdate, setIsSubmitUpdate] = useState(false);
  
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { _id, fullName, phone, avatar } = values;
    setIsSubmitUpdate(true);
    const res = await callUpdateUser(_id, fullName, phone, avatar);
    if (res) {
      message.success("Cập nhật user thành công");
      setOpenModalUpdate(false)
      await fetchUsers();
     
      
    } else {
      notification.error({
        description: res.message,
        message: "Đã có lỗi sẩy ra",
        
      });
    }
    setIsSubmitUpdate(false);
  };

  useEffect(() => {
    form.setFieldsValue(dataUpdate);
  }, [dataUpdate]);
  return (
    <div>
      <Modal
        title="Cập nhật người dùng"
        open={openModalUpdate}
        onOk={() => {
          form.submit();
        }}  
        okText={"Cập nhật"}
        cancelText={"Hủy"}
        onCancel={() => {
          setOpenModalUpdate(false);
          setDataUpdate(null);
        }}
        confirmLoading={isSubmitUpdate}
        width={530}
      >
      <Divider/>

        <Form 
        form={form}
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 16 }}
          style={{ minWidth: 700 }}
          onFinish={onFinish}
          autoComplete="off"
          
        >
          <Form.Item
            label="ID"
            name="_id"
            rules={[{ required: true, message: "id" }]}
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên hiển thị"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Please input your name you want to change!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input your phone you want to change!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="avatar"
            name="avatar"
            rules={[{ required: true, message: "Please input your email!" }]}
            hidden
          >
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserUpdate;
