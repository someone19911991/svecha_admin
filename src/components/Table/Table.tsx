import React, { FC, useEffect, useState } from 'react'
import styles from './tables.module.css'
import { IProduct } from '../../interfaces'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiEdit2 } from 'react-icons/fi'
import { useDeleteProductMutation } from '../../features/products/productsApiSlice'
import Notification from '../Notification/Notification'
import { useLazyGetProductQuery } from '../../features/products/productsApiSlice'
import ProductForm from '../ProductForm/ProductForm'
import Modal from '../Modal/Modal'
import Pagination from "../Pagination/Pagination";

interface IProductsPros {
    products: IProduct[]
}

const Table: FC<IProductsPros> = ({ products }) => {
    const itemsPerPage = 10
    const [active, setActive] = useState(1)
    const [productsToShow, setProductsToShow] = useState<Array<IProduct>>([])
    const [modalOpen, setModalOpen] = useState(false)
    const [notification, setNotification] = useState({ type: '', message: '' })
    const { category_name } = products[0]
    const [
        deleteProduct,
        {
            isError: isDeleteError,
            error: deleteError,
        },
    ] = useDeleteProductMutation()
    const [getProduct] = useLazyGetProductQuery()
    const [product, setProduct] = useState<IProduct>({} as IProduct)

    const deleteSingleProduct = async (product_id: number) => {
        const deleteConfirm = window.confirm(
            'Are you sure you want to delete this item?'
        )
        if (deleteConfirm) {
            deleteProduct({ category_name, product_id })
        }
    }

    const showNotification = ({
        type,
        message,
    }: {
        type: string
        message: string
    }) => {
        setNotification({ type, message })
        setTimeout(() => {
            setNotification({ type: '', message: '' })
        }, 5000)
    }

    const onClose = () => {
        setNotification({ type: '', message: '' })
    }

    const getSingleProduct = async (param: string) => {
        try {
            const res = await getProduct(param).unwrap()
            setProduct(res)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (isDeleteError) {
            showNotification({
                type: 'error',
                message: JSON.stringify(deleteError),
            })
        }
    }, [isDeleteError, deleteError])

    useEffect(() => {
        if (Object.values(product).length) {
            setModalOpen(true)
        }
    }, [product])

    useEffect(() => {
        const endIndex = itemsPerPage * active
        const startIndex = endIndex - itemsPerPage
        setProductsToShow(products.slice(startIndex, endIndex))
    }, [active, products])

    return (
        <div className={styles.wrapper}>
            <Notification
                type={notification.type}
                message={notification.message}
                onClose={onClose}
            />
            <Modal onClose={() => setModalOpen(false)} open={modalOpen}>
                <ProductForm
                    category={product.category_name}
                    onClose={onClose}
                    product={product}
                />
            </Modal>
            <table>
                <thead>
                    <tr>
                        <th>Brand</th>
                        <th>Model</th>
                        <th>Detail Num</th>
                        <th>Price Original</th>
                        <th>Price Copy</th>
                        <th>In Stock(original)</th>
                        <th>In Stock(copy)</th>
                        {category_name === 'spark_plugs' && <th>Key Type</th>}
                        {category_name === 'spark_plugs' && <th>Key Size</th>}
                        {category_name === 'spark_plugs' && <th>Seat Type</th>}
                        {category_name === 'spark_plugs' && (
                            <th>Thread Size</th>
                        )}
                        {category_name === 'spark_plugs' && (
                            <th>Thread Length</th>
                        )}
                        {category_name === 'spark_plugs' && <th>GAP</th>}
                        {category_name === 'spark_plugs' && (
                            <th>Electrodes Number</th>
                        )}
                        {category_name === 'spark_plugs' && (
                            <th>Electrode Type</th>
                        )}

                        {/*ignition coils*/}

                        {category_name === 'ignition_coils' && (
                            <th>Plugs Number</th>
                        )}
                        {category_name === 'ignition_coils' && (
                            <th>Contacts Number</th>
                        )}

                        {/*ignition coil mouthpieces*/}

                        {category_name === 'ignition_coil_mouthpieces' && (
                            <th>Contact Type</th>
                        )}
                        {category_name === 'ignition_coil_mouthpieces' && (
                            <th>Wired</th>
                        )}

                        {/*airbag cables*/}

                        {/*crankshaft_sensors*/}
                        {(category_name === 'crankshaft_sensors' ||
                            category_name === 'camshaft_sensors') && (
                            <th>Wire</th>
                        )}
                        {(category_name === 'crankshaft_sensors' ||
                            category_name === 'camshaft_sensors') && (
                            <th>Contacts Number</th>
                        )}
                        {(category_name === 'crankshaft_sensors' ||
                            category_name === 'camshaft_sensors') && (
                            <th>Connection Type</th>
                        )}
                        <th>
                            <FiEdit2 />
                        </th>
                        <th>
                            <AiOutlineDelete />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {productsToShow.map((product) => (
                        <tr key={product.product_id}>
                            <td className={styles.brand}>{product.brand}</td>
                            <td>{product.model}</td>
                            <td>{product.detail_number}</td>
                            <td>{product.price_original}</td>
                            <td>{product.price_copy}</td>
                            <td>{product.count_original}</td>
                            <td>{product.count_copy}</td>
                            {category_name === 'spark_plugs' && (
                                <td>{product.key_type}</td>
                            )}
                            {category_name === 'spark_plugs' && (
                                <td>{product.key_size}</td>
                            )}
                            {category_name === 'spark_plugs' && (
                                <td>{product.seat_type}</td>
                            )}
                            {category_name === 'spark_plugs' && (
                                <td>{product.thread_size}</td>
                            )}
                            {category_name === 'spark_plugs' && (
                                <td>{product.thread_length}</td>
                            )}
                            {category_name === 'spark_plugs' && (
                                <td>{product.gap}</td>
                            )}
                            {category_name === 'spark_plugs' && (
                                <td>{product.electrodes_number}</td>
                            )}
                            {category_name === 'spark_plugs' && (
                                <td>{product.electrode_type}</td>
                            )}

                            {/*ignition coils*/}

                            {category_name === 'ignition_coils' && (
                                <td>{product.plugs_number}</td>
                            )}
                            {category_name === 'ignition_coils' && (
                                <td>{product.contacts_number}</td>
                            )}

                            {/*ignition coil mouthpieces*/}

                            {category_name === 'ignition_coil_mouthpieces' && (
                                <td>{product.contact_type}</td>
                            )}
                            {category_name === 'ignition_coil_mouthpieces' && (
                                <td>{product.wired}</td>
                            )}
                            {/*camshaft sensors*/}
                            {(category_name === 'crankshaft_sensors' ||
                                category_name === 'camshaft_sensors') && (
                                <td>{product.wired}</td>
                            )}
                            {(category_name === 'crankshaft_sensors' ||
                                category_name === 'camshaft_sensors') && (
                                <td>{product.contact_number}</td>
                            )}
                            {(category_name === 'crankshaft_sensors' ||
                                category_name === 'camshaft_sensors') && (
                                <td>{product.connection_type}</td>
                            )}
                            <td>
                                <button
                                    onClick={() =>
                                        getSingleProduct(
                                            `${product.category_name}/${product.product_id}`
                                        )
                                    }
                                    className={styles.edit_btn}
                                >
                                    <FiEdit2 />
                                </button>
                                {/*<button className={styles.edit_btn}>*/}
                                {/*    <NavLink to={`/products/${category_name}/${product.product_id}`}><FiEdit2 /></NavLink>*/}
                            </td>
                            <td>
                                <button
                                    onClick={() =>
                                        deleteSingleProduct(product.product_id)
                                    }
                                    className={styles.delete_btn}
                                >
                                    <AiOutlineDelete />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.pagination_container}>
                <Pagination active={active} setActive={setActive} itemsCount={products.length} itemsPerPage={itemsPerPage}/>
            </div>
        </div>
    )
}

export default Table
