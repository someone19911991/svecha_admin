import React, { FC } from 'react'
import styles from './notification.module.css'
// import { FaCheck, AiOutlineWarning, BiErrorCircle } from 'react-icons/all'
import { FaCheck } from 'react-icons/fa'
import {BiErrorCircle} from "react-icons/bi"
import {AiOutlineWarning, AiOutlineCloseCircle} from "react-icons/ai"

interface INotificationProps {
    message: string
    type: string
    onClose: () => void
}

const Notification: FC<INotificationProps> = ({ message, type, onClose }) => {
    if (type && message) {
        return (
            <div className={`${styles.notification_wrapper} ${styles[type]}`}>
                <p className={styles.message}>
                    <span>
                        {type === 'success' ? (
                            <FaCheck />
                        ) : type === 'error' ? (
                            <BiErrorCircle />
                        ) : (
                            <AiOutlineWarning />
                        )}
                    </span>
                    {message}
                </p>
                <span >
                    <AiOutlineCloseCircle className={styles.close_btn} onClick={onClose}/>
                </span>
            </div>
        )
    }

    return <></>
}

export default Notification
