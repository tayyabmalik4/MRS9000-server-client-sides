import React, { useEffect, useState } from "react";

// Department API's
import {
  CreateDepartmentAPI,
  UpdateDepartmentAPI,
} from "../../../Service/DepartmentAPI";

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
import "./AddDepartment.scss";
import {
  Department,
  DocumentUpload,
  DollarSquare,
  Subtitle,
} from "iconsax-react";
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

// --------------------------------Start Component-----------------------------------------
export default function AddDepartment() {
  const navigate = new useNavigate();
  const location = new useLocation();
  const selectedDepartment = location?.state?.department;
  const buildingId = location?.state?.buildingId;
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

  useEffect(() => {
    if (selectedDepartment) {
      setFormData({
        title: selectedDepartment?.title,
        detail: selectedDepartment?.detail,
      });
      setImageUrl(
        selectedDepartment?.image?.url &&
          `http://localhost:4000/static/${selectedDepartment?.image?.url}`
      );
    } else {
      setFormData({
        title: "",
        detail: "",
      });
      setImageUrl();
    }
  }, [selectedDepartment]);
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

  const handleUploadDepartment = async () => {
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
    if (buildingId) {
      fData.append("buildingId", buildingId);
    }
    let res;
    if (selectedDepartment) {
      fData.append("_method", "PATCH");
      res = await UpdateDepartmentAPI(selectedDepartment?._id, fData);
    } else {
      res = await CreateDepartmentAPI(fData);
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
      <div className="AddDepartmentFormContainer">
        <div className="headingAddDepartment">
          <div className="headerleft heading upper flexLine">
            <BsArrowLeftShort
              className="icon cursor"
              onClick={() => navigate(-1)}
            />
            <div className="heading">
              {selectedDepartment ? "Edit Department" : "Add Department"}
            </div>
          </div>
        </div>
        <div className="AddDepartmentBodyArea">
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
                  className="departmentInput"
                  type="text"
                  placeholder="Department Title"
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
                                <Input prefix={<Department />} size='large' className='departmentInput' type="text" placeholder='Department Publisher' name="publisher" onChange={enterFormData} value={formData?.publisher} />
                                {formError?.publisher && <div className="errorMessage">{formError?.publisher}</div>}
                            </div>
                            <div className="field2 field">
                                <Input prefix={<DollarSquare />} size='large' className='departmentInput' type="text" placeholder='Department Price' name="price" onChange={enterFormData} defaultValue={0} value={formData?.price} />
                                {formError?.price && <div className="errorMessage">{formError?.price}</div>}
                            </div>
                        </div> */}
            <div className="field2 field descriptionMain">
              <div className="descriptionHeader heading">
                Department Description
              </div>
              <div className="descriptionPara">
                <TextArea
                  rows={6}
                  className="contentPara TextAreaAddDepartment"
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
                onClick={handleUploadDepartment}
              >
                {selectedDepartment ? "Update" : "Upload"}
              </Button>
            }
          </div>
        </div>
      </div>
    </>
  );
}
