import React, { useEffect, useState } from "react";
import { BsPencilFill } from "react-icons/bs";
import { InboxOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import {
  Modal,
  Form,
  Input,
  Col,
  Divider,
  InputNumber,
  message,
  notification,
  Row,
  Select,
  Upload,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  callListCategory,
  callUpdateBook,
  callUploadBookImg,
} from "../../../services/api";
const BookUpdate = (props) => {
  const [isSubmitUpdate, setIsSubmitUpdate] = useState(false);
  const {
    openModalUpdate,
    setOpenModalUpdate,
    dataUpdate,
    setDataUpdate,
    fetchBooks,
  } = props;
  const [listCategory, setListCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [dataThumbnail, setDataThumbnail] = useState([]);
  const [dataSlider, setDataSlider] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [form] = Form.useForm();
  const [initForm, setInitForm] = useState("");

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await callListCategory();
      if (res && res.data) {
        const d = res.data.map((item) => {
          return { label: item, value: item };
        });
        setListCategory(d);
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    if (dataUpdate?._id) {
      const arrThumbnail = [
        {
          uid: uuidv4(),
          name: dataUpdate.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataUpdate.thumbnail
          }`,
        },
      ];

      const arrSlider = dataUpdate?.slider?.map((item) => {
        return {
          uid: uuidv4(),
          name: item,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
        };
      });

      const init = {
        _id: dataUpdate._id,
        mainText: dataUpdate.mainText,
        author: dataUpdate.author,
        price: dataUpdate.price,
        category: dataUpdate.category,
        quantity: dataUpdate.quantity,
        sold: dataUpdate.sold,
        thumbnail: { fileList: arrThumbnail },
        slider: { fileList: arrSlider },
      };
      setInitForm(init);
      setDataThumbnail(arrThumbnail);
      setDataSlider(arrSlider);
      form.setFieldValue(init);
    }
    return () => {
      form.resetFields();
    };
  }, [dataUpdate]);

  useEffect(() => {
    form.setFieldsValue(dataUpdate);
  }, [dataUpdate]);
  const handlePreview = async (file) => {
    if (file.url && !file.originFileObj) {
      setPreviewImage(file.url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
      return;
    }
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    });
  };
  const handleCancel = () => setPreviewOpen(false);
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info, type) => {
    if (info.file.status === "uploading") {
      type ? setLoadingSlider(true) : setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        type ? setLoadingSlider(false) : setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const handleUpLoadFileThumbnail = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBookImg(file);
    if (res && res.data) {
      setDataThumbnail([
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi khi upload file");
    }
  };

  const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBookImg(file);
    if (res && res.data) {
      //copy previous state => upload multiple images
      setDataSlider((dataSlider) => [
        ...dataSlider,
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi khi upload file");
    }
  };

  const handleRemoveFile = (file, type) => {
    if (type === "thumbnail") {
      setDataThumbnail([]);
    }
    if (type === "slider") {
      const newSlider = dataSlider.filter((x) => x.uid !== file.uid);
      setDataSlider(newSlider);
    }
  };

  const onFinish = async (values) => {
    if (dataThumbnail.length === 0) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: "Ảnh thumbnail không được để trống",
      });
      return;
    }

    if (dataSlider.length === 0) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: "Ảnh slider không được để trống",
      });
      return;
    }

    const { _id, mainText, author, price, sold, quantity, category } = values;
    const thumbnail = dataThumbnail[0].name;
    const slider = dataSlider.map((item) => item.name);
    setIsSubmitUpdate(true);

    const res = await callUpdateBook(
      _id,
      thumbnail,
      slider,
      mainText,
      author,
      price,
      sold,
      quantity,
      category
    );
    console.log(res);
    if (res) {
      message.success("Update thành công");
      form.resetFields();
      setDataSlider([]);
      setDataThumbnail([]);
      setInitForm(null);
      setOpenModalUpdate(false);
      await fetchBooks();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };
  return (
    <div>
      <Modal
        title="Cập nhật sách"
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
        width={"50vw"}
      >
        <Divider />
        <Form name="basic" form={form} onFinish={onFinish} autoComplete="off">
          <Row gutter={15}>
            <Col span={12}>
              <Form.Item
                label="Tên sách"
                name="mainText"
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
                  // defaultValue={null}
                  showSearch
                  allowClear
                  // onChange={handleChange}
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
                <InputNumber min={0} style={{ width: "100%" }} />
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
                  customRequest={handleUpLoadFileThumbnail}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  onPreview={handlePreview}
                  onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                  defaultFileList={initForm?.thumbnail?.fileList ?? []}
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
                  customRequest={handleUploadFileSlider}
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, "slider")}
                  onRemove={(file) => handleRemoveFile(file, "slider")}
                  onPreview={handlePreview}
                  defaultFileList={initForm?.slider?.fileList ?? []}
                >
                  <div>
                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="ID" name="_id" labelCol={{ span: 24 }} hidden>
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
          width={"60vw"}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Modal>
    </div>
  );
};

export default BookUpdate;
