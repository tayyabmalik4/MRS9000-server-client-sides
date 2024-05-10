import React, { useEffect, useState } from "react";

// API
import {
  GetMachineData,
  DeleteMachineAPI,
} from "../../Service/MachinesAPI";
import { useLocation, useNavigate } from "react-router-dom";

// Helper
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiInformationLine } from "react-icons/ri";

// Styling
import './Machine.scss'
// Asserts
import NoImage from "../../Asserts/Imgs/noImg.png";

// Other Components
import { useSelector } from "react-redux";
import { Button } from "antd";
import ROLES from "../../Utils/Roles";
import ConfirmationModel from "../Common/ConfirmationModel/ConfirmationModel";
import ImgURL from "../../Utils/ImgUrlGen";
import { BsArrowLeftShort } from "react-icons/bs";

export default function Machine() {
  const navigate = useNavigate();
  const location = useLocation();
  const [refreshPage, setRefreshPage] = useState(false);
  const [machineData, setMachineData] = useState([]);
  const [showFullHeading, setShowFullHeading] = useState(false);
  const [showFullDescription, setshowFullDescription] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    machineId: null,
    loading: false,
  });

  const departmentId = location?.state?.departmentId;
  const buildingId = location?.state?.buildingId;

  const gettingMachineData = async () => {
    let payload = {
      departmentId: departmentId,
    };
    let res = await GetMachineData(payload);
    if (res?.error != null) {
      toast.error(res.error);
    } else {
      setMachineData(res?.data?.result);
    }
  };
  useEffect(() => {
    gettingMachineData();
  }, [refreshPage]);

  const handleEditMachine = (machine) => {
    navigate("/machine/add", {
      state: { machine: machine, departmentId: departmentId , buildingId : buildingId},
    });
  };

  // Getting User Data
  const userData = useSelector((state) => state?.userData);

  const handleAddMachine = () => {
    navigate("/machine/add", { state: { departmentId: departmentId  , buildingId : buildingId} });
  };

  const goNext = (data) =>{
      navigate(
        `/device`, {state : {machine : data, departmentId: departmentId  , buildingId : buildingId }}
      );
  }

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
  const handleDeleteMachineConfirmation = (machine) => {
    setDeleteConfirmation({
      open: true,
      machineId: machine?._id,
      loading: false,
    });
  };

  //   Delete Machine Handle
  const handleDeleteMachine = async (machine) => {
    setDeleteConfirmation({
      ...deleteConfirmation,
      loading: true,
    });
    const res = await DeleteMachineAPI(deleteConfirmation?.machineId);
    if (res?.error != null) {
      toast.error(res.error);
    } else {
      toast.success(res?.data?.message);
      setRefreshPage(!refreshPage);
    }
    setDeleteConfirmation({
      open: false,
      machineId: null,
      loading: false,
    });
  };
  const handleNotDeleteMachine = () => {
    setDeleteConfirmation({
      open: false,
      machineId: null,
      loading: false,
    });
  };

  return (
    <>
      <div className="MainMachineWithFooter">
        <div className="machineMainContainer">
          <div className="machineMain">
            <div className="machineHeader">
              <div className="headleft">
                <BsArrowLeftShort
                  className="icon cursor"
                  onClick={() => navigate(-1)}
                />
                <div className="heading">Machine</div>
              </div>
              {[ROLES.Admin, ROLES.SuperAdmin].includes(userData?.role) && (
                <Button className="EditBtn" onClick={handleAddMachine}>
                  Add Machine
                </Button>
              )}
            </div>
            {machineData?.[0] && (
              <div className="machineCard">
                {machineData?.map((data, i) => {
                  // const meterRead = data?.meterReadings
                  return (
                    <div key={i} className="machinemain">
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
                        className="machineName"
                        onClick={()=>goNext(data)}
                      >
                        {showFullHeading
                          ? data?.title?.replace(/<[^>]+>/g, "")
                          : shortenHeading(data?.title, 20)}
                      </div>
                      <div
                        className="machinedetail"
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
                            onClick={() => handleEditMachine(data)}
                          >
                            Edit
                          </Button>
                          <Button
                            className="DelBtn"
                            onClick={() =>
                              handleDeleteMachineConfirmation(data)
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
        onOk={handleDeleteMachine}
        onCancel={handleNotDeleteMachine}
        confirmLoading={deleteConfirmation.loading}
        test={deleteConfirmation?.machineId}
      >
        <div className="deleteModel">
          <div className="titleBox">
            <RiInformationLine className="icon" />{" "}
            <div className="title">
              {" "}
              Are you sure you want to delete this Machine?{" "}
            </div>
          </div>
        </div>
      </ConfirmationModel>
    </>
  );
}
