import React, { useEffect, useState } from "react";

// Machine API's
import {
  CreateDeviceAPI,
  UpdateDeviceAPI,
} from "../../../Service/DeviceAPI.js";

// Asserts | ICONS :
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { BsArrowLeftShort } from "react-icons/bs";
import { Button, Input, Select } from "antd";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

// import Style this page
import "./AddDevice.scss";
import { Subtitle } from "iconsax-react";
import { useNavigate } from "react-router-dom";

// these functions is for image uploading
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader?.result));
  reader.readAsDataURL(img);
};

// --------------------------------Start Component-----------------------------------------
export default function AddDevice() {
  const navigate = new useNavigate();
  const location = new useLocation();
  const [title, setTitle] = useState("")
  const [formData, setFormData] = useState({
    title: title,
    Device_ID: "",
    MQTT_ID: "",
    isImgDel: "",
  });
  const [formError, setFormError] = useState({
    title: null,
    Device_ID: null,
    MQTT_ID: null,
    isImgDel: null,
  });

  const handleSelectTitle = (value) =>{
    setTitle(value)
  }

  const selectedDevice = location?.state?.device;
  const machineId = location?.state?.machineId;
  const buildingId = location?.state?.buildingId;
  const departmentId = location?.state?.departmentId;

  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDevice) {
      setFormData({
        title: selectedDevice?.title,
        Device_ID: selectedDevice?.Device_ID,
        MQTT_ID: selectedDevice?.MQTT_ID,
      });
      setImageUrl(
        selectedDevice?.image?.url &&
          `http://localhost:4000/static/${selectedDevice?.image?.url}`
      );
    } else {
      setFormData({
        title: "",
        Device_ID: "",
        MQTT_ID: "",
      });
      setImageUrl();
    }
  }, [selectedDevice]);
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
      case "Device_ID":
        if (value.length <= 0) {
          setFormError({
            ...formError,
            Device_ID: "A Device_ID is requried.",
          });
        } else {
          setFormError({
            ...formError,
            Device_ID: null,
          });
        }
        break;
      case "MQTT_ID":
        if (value.length <= 0) {
          setFormError({
            ...formError,
            MQTT_ID: "A MQTT_ID is requried.",
          });
        } else {
          setFormError({
            ...formError,
            MQTT_ID: null,
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
    console.log("this is formData",formData)
  };


  const handleUploadDevice = async () => {
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
    if(title){
      fData.append('title', title)
    }
    if (machineId) {
      fData.append("machineId", machineId);
    }
    if (buildingId) {
      fData.append("buildingId", buildingId);
    }
    if (departmentId) {
      fData.append("departmentId", departmentId);
    }
    let res;
    if (selectedDevice) {
      fData.append("_method", "PATCH");
      res = await UpdateDeviceAPI(selectedDevice?._id, fData);
    } else {
      res = await CreateDeviceAPI(fData);
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
      <div className="AddDeviceFormContainer">
        <div className="headingAddDevice">
          <div className="headerleft heading upper flexLine">
            <BsArrowLeftShort
              className="icon cursor"
              onClick={() => navigate(-1)}
            />
            <div className="heading">
              {selectedDevice ? "Edit Device" : "Add Device"}
            </div>
          </div>
        </div>
        <div className="AddDeviceBodyArea">
          <div className="InputFields">
            <div className="Inputfield">
              <div className="field1 field">
                <Select
                  defaultValue="Select Device..."
                  // name="title"
                  className="deviceInput selectDevice"
                  onChange={handleSelectTitle}
                  options={[
                    { value: "none", label: "None" },
                    { value: "Gas Flow Meter", label: "Gas Flow Meter" },
                    { value: "Steam Flow Meter", label: "Steam Flow Meter" },
                    { value: "Water Flow Meter", label: "Water Flow Meter" },
                    { value: "Energy", lable: "Energy" },
                    { value: "Production", label: "Production" },
                  ]}
                />
              </div>
            </div>
            <div className="Inputfield">
              <div className="field1 field">
                <Input
                  prefix={<Subtitle />}
                  size="large"
                  className="deviceInput"
                  type="text"
                  placeholder="Device ID"
                  name="Device_ID"
                  onChange={enterFormData}
                  value={formData?.Device_ID}
                />
                {formError?.Device_ID && (
                  <div className="errorMessage">{formError?.Device_ID}</div>
                )}
              </div>
              <div className="field2 field">
                <Input
                  prefix={<Subtitle />}
                  size="large"
                  className="deviceInput"
                  type="text"
                  placeholder="MQTT ID"
                  name="MQTT_ID"
                  onChange={enterFormData}
                  value={formData?.MQTT_ID}
                />
                {formError?.MQTT_ID && (
                  <div className="errorMessage">{formError?.MQTT_ID}</div>
                )}
              </div>
            </div>
            {
              <Button className="UploadBtn" onClick={handleUploadDevice}>
                {selectedDevice ? "Update" : "Upload"}
              </Button>
            }
          </div>
        </div>
      </div>
    </>
  );
}
