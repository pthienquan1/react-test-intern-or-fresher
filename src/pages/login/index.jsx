import React from "react";
import { useState } from "react";
import "./Login.css";
import { Button, Form, Input, message, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { callRegister } from "../../services/api";
import { callLogin } from "../../services/api";
import { useDispatch } from "react-redux";
import { doLoginAction } from "../../redux/account/accountSlice";
const LoginPage = () => {

    const[isLogin, setLogin] = useState(false);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const onFinishLogin = async (values) =>{
        const {username,password} = values;
        setLogin(true);
        const res =  await callLogin(username,password);
        setLogin(false)
        if(res?.data){
          console.log(res);
          localStorage.setItem('access_token', res.data.access_token)
          dispatch(doLoginAction(res.data.user));
            message.success("Đăng nhập thành công !")
            navigate('/')
        }
        else{
            notification.error({
                message:"Có lỗi xảy ra",
                description: res.message,
                duration:2
            })
        }
    }
  return (
    <div className="login-container">
      <h1>Login Page</h1>
      <Form
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        autoComplete="off"
        className="form-login"
        onFinish={onFinishLogin}
      >
        <Form.Item
          label="Email"
          name="username"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }} style={{  marginRight:'90px'}}>
      <Button type="primary" htmlType="submit" loading={isLogin} >
        Login
      </Button>
    </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
