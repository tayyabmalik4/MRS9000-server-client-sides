import React from "react";

// ANT-D | MUI :
import { Button, Modal, Space } from 'antd';

// CSS :
import "./ConfirmationModel.scss";





const ConfirmationModel = ({title, open, onOk, onCancel, confirmLoading = false, test, children}) => {
    return (
        <>
            <Modal title={title} open={open} onOk={onOk} onCancel={onCancel} confirmLoading={confirmLoading} centered>
                {children}
            </Modal>
        </>
    )
}

export default ConfirmationModel;