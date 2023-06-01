import React, { useEffect, useState } from 'react'
import styles from './products.module.css'
import {useGetProductsQuery, useLazyGetProductsQuery} from '../../features/products/productsApiSlice'
import { useParams } from 'react-router-dom'
import Table from '../../components/Table/Table'
import Loading from '../../components/Loading/Loading'
import { categoryObj } from '../../consts'
import { IoIosCreate } from 'react-icons/io'
import Notification from '../../components/Notification/Notification'
import Modal from "../../components/Modal/Modal";
import { IProduct } from '../../interfaces'
import ProductForm from "../../components/ProductForm/ProductForm";

const Products = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const category = useParams().category as string
    const [notification, setNotification] = useState({ type: '', message: '' })
    const [products, setProducts] = useState<IProduct[]>([])
    // const [getProducts, { isSuccess, isLoading }] = useLazyGetProductsQuery()
    const {data: productsData, isSuccess, isLoading, isError, error} = useGetProductsQuery(category)
    const categoryTitle = categoryObj[category].name

    const showNotification = ({type, message}: {type: string, message: string}) => {
        setNotification({type, message})
        setTimeout(() => setNotification({type: '', message: ''}), 5000)
    }

    useEffect(() => {
        if(isError){
            showNotification({ type: 'error', message: JSON.stringify(error) })
        }
    }, [isError])


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
