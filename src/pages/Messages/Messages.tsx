import React, { FC, useState } from 'react'
import {
    useAcceptedMutation,
    useGetMessagesQuery,
} from '../../features/order/orderApiSlice'
import Notification from '../../components/Notification/Notification'
import styles from '../Notifications/notifications.module.css'
import { formDate } from '../../consts'

const Messages: FC<{ status: string }> = ({ status }) => {
    const [notification, setNotification] = useState({
        type: '',
        message: '',
        open: false,
    })
    const { data: messages, isLoading: loadingFetchMessages } =
        useGetMessagesQuery(`/order/messages/${status}`)
    const [markAsAccepted, { isLoading }] = useAcceptedMutation()
    const [acceptedOrders, setAcceptedOrders] = useState<Array<string>>([])

    const handleChange = (phoneNumber: string) => {
        if (acceptedOrders.includes(phoneNumber)) {
            const newAcceptedOrders = acceptedOrders.filter(
                (item) => item !== phoneNumber
            )
            setAcceptedOrders(newAcceptedOrders)
        } else {
            setAcceptedOrders([...acceptedOrders, phoneNumber])
        }
    }

    const showNotification = ({
        type,
        message,
    }: {
        type: string
        message: string
    }) => {
        setNotification({ type, message, open: true })
        setTimeout(
            () => setNotification({ type: '', message: '', open: false }),
            5000
        )
    }

    const handleSubmit = async () => {
        let confirmation = true
        if (status === 'accepted') {
            confirmation = window.confirm(
                'Do you really want to delete this item?'
            )
        }

        if (confirmation) {
            try {
                await markAsAccepted({ status, items: acceptedOrders })
                setAcceptedOrders([])
            } catch (err) {
                showNotification({
                    type: 'error',
                    message: JSON.stringify(err),
                })
            }
        }
    }

    if (loadingFetchMessages) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.loading}></div>
            </div>
        )
    }

    return (
        <div>
            {notification.open && (
                <Notification
                    type={notification.type}
                    onClose={() =>
                        setNotification({ type: '', message: '', open: false })
                    }
                    message={notification.message}
                />
            )}
            {!!messages?.length ? (
                <>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <td>Name</td>
                                <td>Phone</td>
                                <td>Message</td>
                                <td>Date</td>
                                <td>
                                    {status === 'accepted'
                                        ? 'Delete'
                                        : 'Mark as accepted'}
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {!!messages?.length &&
                                messages.map((message) => {
                                    return (
                                        <tr key={message.message}>
                                            <td>{message.name}</td>
                                            <td>{message.phone}</td>
                                            <td className={styles.message}>
                                                {message.message}
                                            </td>
                                            <td>
                                                {formDate(message.created_at)}
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    onChange={() =>
                                                        handleChange(
                                                            message.phone
                                                        )
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                    <div className={styles.submit_container}>
                        <button
                            className={`${
                                isLoading || !acceptedOrders.length
                                    ? styles.disabled_btn
                                    : ''
                            }`}
                            disabled={isLoading || !acceptedOrders.length}
                            onClick={handleSubmit}
                        >
                            {status === 'pending' ? 'Submit' : 'Delete'}
                        </button>
                    </div>
                </>
            ) : (
                <h1 className={styles.empty_title}>No messages</h1>
            )}
        </div>
    )
}

export default Messages
