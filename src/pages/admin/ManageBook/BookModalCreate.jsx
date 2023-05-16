import React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  message,
  notification,
  Divider,
  Cascader,
  InputNumber,
  Select,
  Space,
  Row,
  Col,
  Upload,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { callListCategory } from "../../../services/api";
const BookModalCreate = (props) => {
  const { openModalCreate, setOpenModalCreate } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const [listCategory, setListCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);
  const [form] = useForm();
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

  useEffect(() =>{
      const fetchCategory = async () =>{
        const res = await callListCategory();
        if(res && res.data){
          const d = res.data.map(item =>{
            return {label:item,
            value:item} 
          })
          setListCategory(d);
        }
      }
      fetchCategory();
  },[])

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info, type) => {
    if (info.file.status === 'uploading') {
      type ? setLoadingSlider(true) : setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj , (url) => {
        type ? setLoadingSlider(false) : setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const handleUpLoadFile = ({file, onSuccess, onError}) =>{
    setTimeout(() =>{
      onSuccess("OK");
    },2000)
  }
  return (
    <div>
      <Modal
        title="Thêm mới Book"
        open={openModalCreate}
        onOk={() => {
          form.submit();
        }}
        width={"50vw"}
        onText={"Tạo mới"}
        cancelText={"Hủy"}
        onCancel={() => setOpenModalCreate(false)}
        confirmLoading={isSubmit}
      >
        <Divider />
        <Form
          name="basic"
          form={form}
          // onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={15}>
            <Col span={12}>
              <Form.Item
                label="Tên sách"
                name="mainTex"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: "Vui lòng nhập tên sách" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Tên tác giả"
                name="author"
                labelCol={{ span: 24 }}
                rules={[
                  { required: true, message: "Vui lòng nhập tên tác giả !" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Giá tiền"
                name="price"
                rules={[{ required: true, message: "Vui lòng nhập giá tiền!" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  addonAfter="VND"
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Thể loại"
                name="category"
                rules={[{ required: true, message: "Vui lòng nhập thể loại!" }]}
              >
                <Select
                  
                  showSearch
                  allowClear
                   onChange={handleChange}
                  options={listCategory}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Số lượng"
                name="quantity"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Đã bán"
                name="sold"
                rules={[{ required: true, message: "Vui lòng nhập giá tiền!" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Ảnh Thumbnail"
                name="thumbnail"
              >
                <Upload
                  name="thumbnail"
                  listType="picture-card"
                  className="avatar-uploader"
                  maxCount={1}
                  multiple={false}
                  customRequest={handleUpLoadFile}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Ảnh Slider"
                name="slider"
              >
                <Upload
                  multiple
                  name="slider"
                  listType="picture-card"
                  className="avatar-uploader"
                  customRequest={handleUpLoadFile}
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, "slider")}
                >
                  <div>
                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default BookModalCreate;
