import React, {PropsWithChildren} from 'react';
import styles from "./modal.module.css"
import {createPortal} from "react-dom";
import {AiOutlineCloseCircle} from "react-icons/ai"

interface IModalProps{
    onClose: () => void
    open: boolean
}
const Modal = (props: PropsWithChildren<IModalProps>) => {
    const {children, onClose, open} = props
    const portalElement = document.getElementById('portal')
    if(!portalElement || !open){
        return <></>
    }

    return createPortal(
        <div className={styles.modal_container}>
            <span className={styles.close_btn}><AiOutlineCloseCircle onClick={onClose} /></span>
            <div onClick={e => e.stopPropagation()} className={styles.modal}>{children}</div>
        </div>, portalElement
    );
};

export default Modal;