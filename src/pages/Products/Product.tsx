import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useGetProductQuery} from "../../features/products/productsApiSlice"
import styles from "./products.module.css";
import ProductComponent from "../../components/Product/ProductComponent";
import Notification from "../../components/Notification/Notification";

const Product = () => {
    const [notification, setNotification] = useState({type: '', message: ''})
    const {category_name, product_id} = useParams()
    const {data: product, isSuccess, isError, error, isLoading} = useGetProductQuery(`${category_name}/${product_id}`)

    const onClose = () => {
        setNotification({type: '', message: ''})
    }

    const showNotification = ({type, message}: {type: string, message: string}) => {
        setNotification({type, message})
        setTimeout(() => {
            setNotification({type: '', message: ''})
        }, 5000)
    }

    useEffect(() => {
        if(isError){
            showNotification({type: 'error', message: JSON.stringify(error)})
        }
    }, [isError])

    return (
        <div>
            <Notification type={notification.type} message={notification.message} onClose={onClose}/>
            {isSuccess && !product && <p className={styles.title}>No Products available</p>}
            {isSuccess && !!product && <ProductComponent product={product} />}
        </div>
    );
};

export default Product;