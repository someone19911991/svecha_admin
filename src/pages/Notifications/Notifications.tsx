import React, {FC, Fragment, useEffect, useState} from 'react'
import { IOrderedProduct } from '../../interfaces'
import {
    useGetNotificationsQuery,
    useSoldMutation,
} from '../../features/order/orderApiSlice'
import styles from './notifications.module.css'
import Notification from '../../components/Notification/Notification'

const Notifications: FC<{status: string}> = ({status}) => {
    console.log({status})
    const [notification, setNotification] = useState({
        type: '',
        message: '',
        open: false,
    })
    const [markedPhones, setMarkedPhones] = useState<Array<string>>([])
    const { data } = useGetNotificationsQuery(`/order/notifications/${status}`)
    const [orders, setOrders] = useState<{
        [key: string]: Array<IOrderedProduct>
    }>({})
    const [orderCount, setOrderCount] = useState<{
        [key: string]: number
    }>({})
    const [markAsSold, { isLoading }] = useSoldMutation()

    const handleSubmit = async () => {
        let confirmation = true
        if(status === 'sold') {
            confirmation = window.confirm('Do you really want to delete this item?')
        }
        if(confirmation){
            try {
                await markAsSold({status, items: markedPhones}).unwrap()
                setMarkedPhones([])
            } catch (err) {
                showNotification({ type: 'error', message: JSON.stringify(err) })
            }
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

    const markPhoneNumber = (phoneNumber: string) => {
        if (markedPhones.includes(phoneNumber)) {
            const newMarkedPhones = markedPhones.filter(
                (phoneNum) => phoneNum !== phoneNumber
            )
            setMarkedPhones(newMarkedPhones)
        } else {
            setMarkedPhones([...markedPhones, phoneNumber])
        }
    }

    useEffect(() => {
        if (data) {
            const { orderedProducts, phoneCount } = data
            const dataToSet: { [key: string]: Array<IOrderedProduct> } = {}
            orderedProducts.forEach((product) => {
                if (dataToSet[product.phone]) {
                    dataToSet[product.phone] = [
                        ...dataToSet[product.phone],
                        product,
                    ]
                } else {
                    dataToSet[product.phone] = [product]
                }
            })
            const orderCountToSet: { [key: string]: number } = {}
            phoneCount.forEach((phoneItem) => {
                orderCountToSet[phoneItem.phone] = phoneItem.phone_count
            })
            setOrderCount(orderCountToSet)
            setOrders(dataToSet)
        }
    }, [data])

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
            {!!Object.values(orders).length ? (
                <>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Model</th>
                                <th>Type</th>
                                <th>Count</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Sum</th>
                                <th>Phone</th>
                                <th>{status === 'sold' ? 'Delete' : 'Mark as sold'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!!Object.values(orders).length &&
                                Object.values(orders).map(
                                    (orderItemArr, index) => {
                                        return (
                                            <Fragment
                                                key={`${JSON.stringify(
                                                    orderItemArr
                                                )}_${index}`}
                                            >
                                                {orderItemArr.map(
                                                    (orderItem, index) => {
                                                        return (
                                                            <tr
                                                                key={`${orderItem}_${index}`}
                                                            >
                                                                <td>
                                                                    {
                                                                        orderItem.model
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        orderItem.product_type
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        orderItem.count
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        orderItem.product_price
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        orderItem.discount
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        orderItem.sum
                                                                    }
                                                                </td>
                                                                {index ===
                                                                    0 && (
                                                                    <td
                                                                        rowSpan={
                                                                            orderCount[
                                                                                orderItem
                                                                                    .phone
                                                                            ]
                                                                        }
                                                                    >
                                                                        {
                                                                            orderItem.phone
                                                                        }
                                                                    </td>
                                                                )}
                                                                {index ===
                                                                    0 && (
                                                                    <td
                                                                        rowSpan={
                                                                            orderCount[
                                                                                orderItem
                                                                                    .phone
                                                                            ]
                                                                        }
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            onChange={() =>
                                                                                markPhoneNumber(
                                                                                    orderItem.phone
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                )}
                                                            </tr>
                                                        )
                                                    }
                                                )}
                                            </Fragment>
                                        )
                                    }
                                )}
                        </tbody>
                    </table>
                    <div className={styles.submit_container}>
                        <button className={`${isLoading || !markedPhones.length ? styles.disabled_btn : ''}`} disabled={isLoading} onClick={handleSubmit}>
                            {status === 'pending' ? 'Submit' : 'Delete'}
                        </button>
                    </div>
                </>
            ) : (
                <h1 className={styles?.empty_title}>No Orders</h1>
            )}
        </div>
    )
}

export default Notifications
