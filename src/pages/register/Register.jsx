import { useState } from "react";
import './Register.css';
import { Button,Form, Input, message, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister } from "../../services/api";


const Register = () => {
  const navigate = useNavigate();

  const [isSubmit, setSubmit] = useState(false);

  const onFinish =  async (values) =>{
    const {fullName, email, password, phone} = values;
    setSubmit(true);
    const res = await callRegister(fullName, email, password, phone)
    setSubmit(false)
    if(res?.data?._id){
      message.success('Đăng ký tài khoản thành công !')
      navigate('/login')
    }
    else{
      notification.error({
        message: 'Có lỗi sẩy ra !',
        description: res.message ,
        duration:5
      })
    }
  };
  

  return (
    <div className="register-container">
     <h1>Registration</h1>
     <Form className="form-register"
    name="basic"
    labelCol={{ span: 24 , }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
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
    
    <Form.Item wrapperCol={{ offset: 8, span: 16 }} style={{  marginRight:'90px'}}>
      <Button type="primary" htmlType="submit" loading={isSubmit} >
        Đăng ký
      </Button>
    </Form.Item>
    
    <div className="existAccount"> Đã có tài khoản?   
      <span>
        <Link to="/login">   Login ngay </Link>
      </span>
    </div>
    </Form>
    </div>
  );
};

export default Register;
