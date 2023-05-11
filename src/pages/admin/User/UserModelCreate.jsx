import { useState, useEffect } from "react";
import { Button, Modal,Form, Input, message, notification, Divider } from "antd";
import { callCreateUser } from "../../../services/api";


const UserModelCreate = (props) => {
  const {openModalCreate, setOpenModalCreate} = props;
  const [isSubmit, setIsSubmit] = useState(false);

  const [form] = Form.useForm();

    const onFinish =  async (values) =>{
        const {fullName, password, email, phone} = values;
        setIsSubmit(true)
        const res = await callCreateUser(fullName, password, email, phone);
        if(res && res.data){
            message.success("Thêm mới user thành công")
            form.resetFields();
            setOpenModalCreate(false);
            await props.fetchUser();
        }
        else{
            notification({
                message:'Đã có lỗi sẩy ra',
                description: res.message
            })
        }
    }


  return (
    <div>
      <Modal
        title="Thêm mới người dùng"
        open={openModalCreate}
        onOk={() => { form.submit() }}
        onText={"Tạo mới"}
        cancelText={"Hủy"}
        onCancel={() => setOpenModalCreate(false)}
        confirmLoading = {isSubmit}
      >
      <Divider/>
        <Form
    name="basic"
    form={form}
    labelCol={{ span: 24 , }}
    wrapperCol={{ span: 16 }}
    style={{ minWidth: 700 }}
    onFinish={onFinish}
    
    autoComplete="off"
  >
     <Form.Item
      label="Fullname" 
      name="fullName"
      rules={[{ required: true, message: 'Please input your fullname!' }]}
      
    >
      <Input  />
    </Form.Item>
    <Form.Item
      label="Email"
      name="email"
      rules={[{ required: true, message: 'Please input your email!' }]}
     
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="Password"
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password />
    </Form.Item>
    <Form.Item
      label="Phone"
      name="phone"
      rules={[{ required: true, message: 'Please input your phone!' }]}
    >
      <Input />
    </Form.Item>
    </Form>

      </Modal>
    </div>
  );
};

export default UserModelCreate;
