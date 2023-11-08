import React from 'react'
import styles from './header.module.css'
import userImg from '../../imgs/saro.jpg'
import { IoIosNotificationsOutline } from 'react-icons/io'
import { MdOutlineMessage } from 'react-icons/md'
import { AiOutlineLogout } from 'react-icons/ai'
import { Link, NavLink } from 'react-router-dom'
import { useLogoutMutation } from '../../features/auth/authApiSlice'
import { useAppDispatch } from '../../hooks/redux'
import { logoutAction } from '../../features/auth/authSlice'
import {
    useGetNotificationsQuery,
    useGetMessagesQuery,
} from '../../features/order/orderApiSlice'

const Header = () => {
    const [logout] = useLogoutMutation()
    const dispatch = useAppDispatch()
    const handleLogout = () => {
        logout()
            .unwrap()
            .then(() => dispatch(logoutAction()))
    }
    const { data } = useGetNotificationsQuery('/order/notifications/pending')
    const { data: messages } = useGetMessagesQuery('/order/messages/pending')

    return (
        <div className={styles.header_container}>
            <NavLink to="/" className={({ isActive }) => ''}>
                <h1 className={styles.logo}>SVECHA.AM</h1>
            </NavLink>
            <div className={styles.header_main}>
                <span className={`${styles.notification} ${styles.icon}`}>
                    <Link to="/notifications">
                        <IoIosNotificationsOutline className={styles.icon} />
                        {!!data?.phoneCount?.length && <span className={styles.iconAfter}>
                            {data?.phoneCount?.length}
                        </span>}
                    </Link>
                </span>
                <span className={`${styles.message} ${styles.icon}`}>
                    <Link to="/messages">
                        <MdOutlineMessage className={styles.icon} />
                        {!!messages?.length && <span className={styles.iconMessagesAfter}>
                            {messages?.length}
                        </span>}
                    </Link>
                </span>
                <div className={styles.user}>
                    <img src={userImg} alt="" />
                    Saro
                    <button
                        className={styles.logout_btn}
                        onClick={handleLogout}
                    >
                        <AiOutlineLogout />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header
