import React, { useEffect, useState } from "react";

// API
import {
  GetDepartmentData,
  DeleteDepartmentAPI,
} from "../../Service/DepartmentAPI";
import { useLocation, useNavigate } from "react-router-dom";

// Helper
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiInformationLine } from "react-icons/ri";

// Styling
import "./Department.scss";

// Asserts
import NoImage from "../../Asserts/Imgs/noImg.png";

// Other Components
import { useSelector } from "react-redux";
import { Button } from "antd";
import ROLES from "../../Utils/Roles";
import ConfirmationModel from "../Common/ConfirmationModel/ConfirmationModel";
import ImgURL from "../../Utils/ImgUrlGen";
import { BsArrowLeftShort } from "react-icons/bs";

export default function Department() {
  const navigate = useNavigate();
  const location = useLocation();
  const [refreshPage, setRefreshPage] = useState(false);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [showFullHeading, setShowFullHeading] = useState(false);
  const [showFullDescription, setshowFullDescription] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    departmentId: null,
    loading: false,
  });

  const buildingId = location?.state?.buildingId;

  const gettingDepartmentData = async () => {
    let payload = {
      buildingId: buildingId,
    };
    let res = await GetDepartmentData(payload);
    if (res?.error != null) {
      toast.error(res.error);
    } else {
      setDepartmentData(res?.data?.result);
    }
  };
  useEffect(() => {
    gettingDepartmentData();
  }, [refreshPage]);

  const handleEditDepartment = (department) => {
    navigate("/department/add", {
      state: { department: department, buildingId: buildingId },
    });
  };
  const goNext = (data) => {
    navigate(
      `/machine`, {state : {departmentId : data?._id, buildingId : buildingId}}
    )};

  // Getting User Data
  const userData = useSelector((state) => state?.userData);

  const handleAddDepartment = () => {
    navigate("/department/add", { state: { buildingId: buildingId } });
  };

  const shortenHeading = (text, maxLength) => {
    if (text?.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    } else {
      return text;
    }
  };
  const shortenDescription = (text, maxLength) => {
    if (text?.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    } else {
      return text;
    }
  };
  const handleDeleteDepartmentConfirmation = (department) => {
    setDeleteConfirmation({
      open: true,
      departmentId: department?._id,
      loading: false,
    });
  };

  //   Delete Department Handle
  const handleDeleteDepartment = async (department) => {
    setDeleteConfirmation({
      ...deleteConfirmation,
      loading: true,
    });
    const res = await DeleteDepartmentAPI(deleteConfirmation?.departmentId);
    if (res?.error != null) {
      toast.error(res.error);
    } else {
      toast.success(res?.data?.message);
      setRefreshPage(!refreshPage);
    }
    setDeleteConfirmation({
      open: false,
      departmentId: null,
      loading: false,
    });
  };
  const handleNotDeleteDepartment = () => {
    setDeleteConfirmation({
      open: false,
      departmentId: null,
      loading: false,
    });
  };

  return (
    <>
      <div className="MainDepartmentWithFooter">
        <div className="departmentMainContainer">
          <div className="departmentMain">
            <div className="departmentHeader">
              <div className="headleft">
                <BsArrowLeftShort
                  className="icon cursor"
                  onClick={() => navigate(-1)}
                />
                <div className="heading">Department</div>
              </div>
              {[ROLES.Admin, ROLES.SuperAdmin].includes(userData?.role) && (
                <Button className="EditBtn" onClick={handleAddDepartment}>
                  Add Department
                </Button>
              )}
            </div>
            {DepartmentData?.[0] && (
              <div className="departmentCard">
                {DepartmentData?.map((data, i) => {
                  // const meterRead = data?.meterReadings
                  return (
                    <div key={i} className="departmentmain">
                      <img
                        onClick={()=>goNext(data)}
                        className="industoryimg"
                        src={
                          data?.image?.url
                            ? `http://localhost:4000/static/${data?.image?.url}`
                            : ImgURL(NoImage)
                        }
                        alt={"No Image"}
                      />

                      <div
                        className="departmentName"
                        onClick={()=>goNext(data)}
                      >
                        {showFullHeading
                          ? data?.title?.replace(/<[^>]+>/g, "")
                          : shortenHeading(data?.title, 20)}
                      </div>
                      <div
                        className="departmentdetail"
                        onClick={()=>goNext(data)}
                      >
                        {showFullDescription
                          ? data?.detail?.replace(/<[^>]+>/g, "")
                          : shortenDescription(
                              data?.detail?.replace(/<[^>]+>/g, ""),
                              100
                            )}
                      </div>
                      {[ROLES.Admin, ROLES.SuperAdmin].includes(
                        userData?.role
                      ) && (
                        <div className="cartBtns">
                          <Button
                            className="EditBtn"
                            onClick={() => handleEditDepartment(data)}
                          >
                            Edit
                          </Button>
                          <Button
                            className="DelBtn"
                            onClick={() =>
                              handleDeleteDepartmentConfirmation(data)
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModel
        open={deleteConfirmation.open}
        onOk={handleDeleteDepartment}
        onCancel={handleNotDeleteDepartment}
        confirmLoading={deleteConfirmation.loading}
        test={deleteConfirmation?.departmentId}
      >
        <div className="deleteModel">
          <div className="titleBox">
            <RiInformationLine className="icon" />{" "}
            <div className="title">
              {" "}
              Are you sure you want to delete this Department?{" "}
            </div>
          </div>
        </div>
      </ConfirmationModel>
    </>
  );
}
