import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import { v4 as uuidv4 } from 'uuid';
import { Button, Drawer, Badge, Descriptions, Divider } from "antd";
import moment from "moment";
const BookViewDetail = (props) => {
  const {
    openViewBookDetail,
    setOpenViewBookDetail,
    dataViewBookDetail,
    setDataViewBookDetail,
  } = props;

  const onClose = () => {
    setOpenViewBookDetail(false);
    setDataViewBookDetail(null);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if(dataViewBookDetail){
      let imgThumbnail = {};
      let imgSlider = [];
      if(dataViewBookDetail.thumbnail){
          imgThumbnail = {
            uid:  uuidv4(),
            name: dataViewBookDetail.thumbnail,
            status: 'done',
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataViewBookDetail.thumbnail}`,
          }
      }
      if(dataViewBookDetail.slider && dataViewBookDetail.slider.length > 0){
        dataViewBookDetail.slider.map(item =>{
            imgSlider.push({
              uid:uuidv4(),
              name:item,
              status:'done',
              url:`${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
            })
        })
      }
      setFileList([imgThumbnail, ...imgSlider]);
    }
    

  },[dataViewBookDetail])
  return (
    <>
      <Drawer
        title="Xem chi tiết Book"
        placement="right"
        onClose={onClose}
        open={openViewBookDetail}
        width={900}
      >
        <Descriptions title="Thông tin Book" bordered column={2}>
          <Descriptions.Item label="ID">
            {dataViewBookDetail?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Tên sách">
            {dataViewBookDetail?.mainText}
          </Descriptions.Item>
          <Descriptions.Item label="Tác giả">
            {dataViewBookDetail?.author}
          </Descriptions.Item>
          <Descriptions.Item label="Giá tiền">
            {dataViewBookDetail?.price}
          </Descriptions.Item>
          <Descriptions.Item label="Thể loại" span={3}>
            <Badge status="processing" text={dataViewBookDetail?.category} />
          </Descriptions.Item>
          <Descriptions.Item label="Created at">
            {moment(dataViewBookDetail?.createdAt).format(
              "DD-MM-YYYY hh:mm:ss"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Updated at">
            {moment(dataViewBookDetail?.updatedAt).format(
              "DD-MM-YYYY hh:mm:ss"
            )}
          </Descriptions.Item>
        </Descriptions>
        <Divider orientation="left">Ảnh Book </Divider>
     
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={{ showRemoveIcon: false }}
        />
        <Modal width={"55vw"} open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      </Drawer>
    </>
  );
};

export default BookViewDetail;
