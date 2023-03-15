import React, { useState } from "react";
import cn from "classnames";
import styles from "./alert.module.sass";
// import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
// import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
// import DangerousOutlinedIcon from '@mui/icons-material/DangerousOutlined';
// import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

const Alert = ({ className, param, onOk, onCancel, okLabel=null, cancelLabel=null}) => {

    return (
        <div className={cn(className, styles.transfer)}>
            <div className={cn("h4", styles.title)}>{param.title ? param.title : ""}</div>
            <div align="center">
                {
                    param.state && param.state === "success" && <></>
                        // <DoneOutlinedIcon  style={{fontSize : "72px"}} color="success" />
                }
                {
                    param.state && param.state === "warning" && <></>
                        // <WarningAmberOutlinedIcon  style={{fontSize : "72px"}} color="warning" />
                }
                {
                    param.state && param.state === "info" && <></>
                        // <PriorityHighOutlinedIcon  style={{fontSize : "72px"}} color="info" />
                }
                {
                    param.state && param.state === "error" && <></>
                        // <DangerousOutlinedIcon style={{fontSize : "72px"}} color="error" />
                }
            </div>
            <div className={styles.text} style={{ textAlign: "center"}}>
                {param.content}
            </div>
            <div className={styles.btns}>
                {okLabel && <button className={cn("button", styles.button)} onClick={onOk}>{okLabel}</button> }
                {cancelLabel && <button className={cn("button-stroke", styles.button)} onClick={onCancel}>{cancelLabel}</button> }
            </div>
        </div>
    );
};

export default Alert;
