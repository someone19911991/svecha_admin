import React, { useEffect, useState } from 'react'
import styles from './products.module.css'
import {useGetProductsQuery} from '../../features/products/productsApiSlice'
import { useParams } from 'react-router-dom'
import Table from '../../components/Table/Table'
import Loading from '../../components/Loading/Loading'
import { IoIosCreate } from 'react-icons/io'
import Notification from '../../components/Notification/Notification'
import Modal from "../../components/Modal/Modal";
import ProductForm from "../../components/ProductForm/ProductForm";

const Products = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const category = useParams().category as string
    const [notification, setNotification] = useState({ type: '', message: '' })
    const {data: productsData, isSuccess, isLoading, isError, error} = useGetProductsQuery(category)

    const showNotification = ({type, message}: {type: string, message: string}) => {
        setNotification({type, message})
        setTimeout(() => setNotification({type: '', message: ''}), 5000)
    }

    useEffect(() => {
        if(isError){
            showNotification({ type: 'error', message: JSON.stringify(error) })
        }
    }, [isError, error])


    if (isLoading) {
        return <Loading />
    }

    return (
        <div className={styles.products}>
            <Notification
                type={notification.type}
                onClose={() => setNotification({ type: '', message: '' })}
                message={notification.message}
            />
            <Modal onClose={() => setModalOpen(false)} open={modalOpen}><ProductForm category={category} onClose={() => setModalOpen(false)} /></Modal>
            <button className={`btn ${styles.create_btn}`} onClick={() => setModalOpen(true)}>
                Create <IoIosCreate />
            </button>
            {isSuccess && !productsData.length && (
                <p className={styles.title}>No Products available</p>
            )}
            {isSuccess && !!productsData.length && <Table products={productsData} />}
        </div>
    )
}

export default Products
