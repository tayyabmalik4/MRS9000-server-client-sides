import React, { useEffect, useState } from "react";

// Building API's
import {
  CreateBuildingAPI,
  UpdateBuildingAPI,
} from "../../../Service/BuildingAPI";

// Asserts | ICONS :
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { BsArrowLeftShort } from "react-icons/bs";
import { Button, Image, Input, Select, Upload } from "antd";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import NoImage from "../../../Asserts/Imgs/noImg.png";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

// import Style this page
import "./AddBuilding.scss";
import { Building, DocumentUpload, DollarSquare, Subtitle } from "iconsax-react";
import ReactQuill from "react-quill";
import ImgURL from "../../../Utils/ImgUrlGen";
import { useNavigate } from "react-router-dom";

// these functions is for image uploading
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader?.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    return console.log("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    return console.log("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

export default function AddBuilding() {
  const navigate = new useNavigate();
  const { TextArea } = Input;
  const [formData, setFormData] = useState({
    title: "",
    detail: "",
    isImgDel: "",
  });
  const [formError, setFormError] = useState({
    title: null,
    detail: null,
    isImgDel: null,
  });

  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    bookId: null,
    loading: false
})
  const location = new useLocation();
  const selectedBuilding = location?.state?.building;

  useEffect(() => {
    if (selectedBuilding) {
      setFormData({
        title: selectedBuilding?.title,
        detail: selectedBuilding?.detail,
      });
      setImageUrl(
        selectedBuilding?.image?.url &&
          `http://localhost:4000/static/${selectedBuilding?.image?.url}`
      );
    } else {
      setFormData({
        title: "",
        detail: "",
      });
      setImageUrl();
    }
  }, [selectedBuilding]);
  const enterFormData = (event) => {
    let { name, value } = event.target;

    switch (name) {
      case "file":
        if (value.length <= 0) {
          setFormError({
            ...formError,
            file: "A file is requried.",
          });
        } else {
          setFormError({
            ...formError,
            file: null,
          });
        }
        break;
      case "title":
        if (value.length <= 0) {
          setFormError({
            ...formError,
            title: "A Title is requried.",
          });
        } else {
          setFormError({
            ...formError,
            title: null,
          });
        }
        break;
      case "detail":
        if (value.length <= 0) {
          setFormError({
            ...formError,
            detail: "A Detail is requried.",
          });
        } else {
          setFormError({
            ...formError,
            detail: null,
          });
        }
        break;
      default:
        break;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUploadChange = (info) => {
    getBase64(info.file.originFileObj, (url) => {
      setImageUrl(url);
    });
    setFile(info?.file?.originFileObj || null);
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const handleUploadBuilding = async () => {
    setLoading(true);
    let fData = new FormData();
    Object.keys(formData).map((key) => {
      if (formData[key]) {
        fData.append(key, formData[key]);
      }
    });
    if (file) {
      fData.append("file", file);
    }
    let res;
    if (selectedBuilding) {
      fData.append("_method", "PATCH");
      res = await UpdateBuildingAPI(selectedBuilding?._id, fData);
    } else {
      res = await CreateBuildingAPI(fData);
    }
    if (res?.error != null) {
      toast.error(res.error);
    } else {
      toast.success(res?.data?.message);
      navigate(-1);
    }
    setLoading(false);
  };



  return (
    <>
      <div className="AddBuildingFormContainer">
        <div className="headingAddBuilding">
          <div className="headerleft heading upper flexLine">
            <BsArrowLeftShort
              className="icon cursor"
              onClick={() => navigate(-1)}
            />
            <div className="heading">
              {selectedBuilding ? "Edit Area" : "Add Area"}
            </div>
          </div>
        </div>
        <div className="AddBuildingBodyArea">
          <Upload
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleUploadChange}
          >
            {imageUrl ? (
              <div className="imgBox">
                <img
                  src={imageUrl}
                  //   src={`http://localhost:4000/static/${formData?.image?.url}`}
                  alt={NoImage}
                  style={{
                    width: "100%",
                  }}
                />
              </div>
            ) : (
              uploadButton
            )}
          </Upload>
          <div className="InputFields">
            <div className="Inputfield">
              <div className="field1 field">
                <Input
                  prefix={<Subtitle />}
                  size="large"
                  className="buildingInput"
                  type="text"
                  placeholder="Building Title"
                  name="title"
                  onChange={enterFormData}
                  value={formData?.title}
                />
                {formError?.title && (
                  <div className="errorMessage">{formError?.title}</div>
                )}
              </div>
            </div>
            {/* <div className="Inputfield">
                            <div className="field1 field">
                                <Input prefix={<Building />} size='large' className='buildingInput' type="text" placeholder='Building Publisher' name="publisher" onChange={enterFormData} value={formData?.publisher} />
                                {formError?.publisher && <div className="errorMessage">{formError?.publisher}</div>}
                            </div>
                            <div className="field2 field">
                                <Input prefix={<DollarSquare />} size='large' className='buildingInput' type="text" placeholder='Building Price' name="price" onChange={enterFormData} defaultValue={0} value={formData?.price} />
                                {formError?.price && <div className="errorMessage">{formError?.price}</div>}
                            </div>
                        </div> */}
            <div className="field2 field descriptionMain">
              <div className="descriptionHeader heading">Area Description</div>
              <div className="descriptionPara">
                <TextArea
                  rows={6}
                  className="contentPara TextAreaAddBuilding"
                  placeholder="Enter Description"
                  name="detail"
                  value={formData?.detail}
                  onChange={enterFormData}
                />
              </div>
            </div>
            {
              <Button
                className="UploadBtn"
                onClick={handleUploadBuilding}
              >
                {selectedBuilding ? "Update" : "Upload"}
              </Button>
            }
          </div>
        </div>
      </div>


    </>
  );
}
