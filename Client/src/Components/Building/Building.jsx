import React, { useEffect, useState } from "react";

// API
import { GetBuildingData, DeleteBuildingAPI } from "../../Service/BuildingAPI";
import { useNavigate } from "react-router-dom";

// Helper
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiInformationLine } from "react-icons/ri";

import { Button } from "antd";

// Styling
import "./Building.scss";
import { BsArrowLeftShort } from "react-icons/bs";

// Other Components
import NoImage from "../../Asserts/Imgs/noImg.png";
import { useSelector } from "react-redux";
import ROLES from "../../Utils/Roles";
import ConfirmationModel from "../Common/ConfirmationModel/ConfirmationModel";
import ImgURL from "../../Utils/ImgUrlGen";

export default function Building() {
  const navigate = useNavigate();

  const [refreshPage, setRefreshPage] = useState(false);
  const [BuildingData, setBuildingData] = useState([]);
  const [showFullHeading, setShowFullHeading] = useState(false);
  const [showFullDescription, setshowFullDescription] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    buildingId: null,
    loading: false,
  });

  const gettingBuildingData = async () => {
    let res = await GetBuildingData();
    if (res.error != null) {
      toast.error(res.error);
    } else {
      setBuildingData(res?.data?.result);
    }
  };
  useEffect(() => {
    gettingBuildingData();
  }, [refreshPage]);

  const handleEditBuilding = (building) => {
    navigate("/building/add", { state: { building: building } });
  };

  // Getting User Data
  const userData = useSelector((state) => state?.userData);

  const handleAddBuilding = () => {
    navigate("/building/add");
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
  const handleDeleteBuildingConfirmation = (building) => {
    setDeleteConfirmation({
      open: true,
      buildingId: building?._id,
      loading: false,
    });
  };

  //   Delete Building Handle
  const handleDeleteBuilding = async (building) => {
    setDeleteConfirmation({
      ...deleteConfirmation,
      loading: true,
    });
    const res = await DeleteBuildingAPI(deleteConfirmation?.buildingId);
    if (res?.error != null) {
      toast.error(res?.error);
    } else {
      toast.success(res?.data?.message);
      setRefreshPage(!refreshPage);
    }
    setDeleteConfirmation({
      open: false,
      buildingId: null,
      loading: false,
    });
  };
  const handleNotDeleteBuilding = () => {
    setDeleteConfirmation({
      open: false,
      buildingId: null,
      loading: false,
    });
  };

  return (
    <>
      <div className="MainBuildingWithFooter">
        <div className="buildingMainContainer">
          <div className="buildingMain">
            <div className="buildingHeader">
              <div className="headleft">
                <BsArrowLeftShort
                  className="icon cursor"
                  onClick={() => navigate(-1)}
                />
                <div className="heading">Area</div>
              </div>
              {[ROLES.Admin, ROLES.SuperAdmin].includes(userData?.role) && (
                <Button className="EditBtn" onClick={handleAddBuilding}>
                  Add Area
                </Button>
              )}
            </div>
            {BuildingData?.[0] && (
              <div className="buildingCard">
                {BuildingData?.map((data, i) => {
                  // const meterRead = data?.meterReadings
                  return (
                    <div key={i} className="buildingmain">
                      <img
                        onClick={() => {
                          navigate(`/department`, {
                            state: { buildingId: data?._id },
                          });
                          // navigate(`/dashboard?Building=${data?.buildingId}`);
                        }}
                        className="industoryimg"
                        src={
                          data?.image?.url
                            ? `http://localhost:4000/static/${data?.image?.url}`
                            : ImgURL(NoImage)
                        }
                        alt={"No Image"}
                      />
                      <div
                        className="buildingName"
                        onClick={() => {
                          navigate(`/department`, {
                            state: { buildingId: data?._id },
                          });
                        }}
                      >
                        {showFullHeading
                          ? data?.title?.replace(/<[^>]+>/g, "")
                          : shortenHeading(data?.title, 20)}
                      </div>
                      <div
                        className="buildingdetail"
                        onClick={() => {
                          navigate(`/department`, {
                            state: { buildingId: data?._id },
                          });
                        }}
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
                            onClick={() => handleEditBuilding(data)}
                          >
                            Edit
                          </Button>
                          <Button
                            className="DelBtn"
                            onClick={() =>
                              handleDeleteBuildingConfirmation(data)
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
        onOk={handleDeleteBuilding}
        onCancel={handleNotDeleteBuilding}
        confirmLoading={deleteConfirmation.loading}
        test={deleteConfirmation.buildingId}
      >
        <div className="deleteModel">
          <div className="titleBox">
            <RiInformationLine className="icon" />{" "}
            <div className="title">
              {" "}
              Are you sure you want to delete this Building?{" "}
            </div>
          </div>
        </div>
      </ConfirmationModel>
    </>
  );
}
