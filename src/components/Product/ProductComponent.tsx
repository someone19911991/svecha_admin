import React, { FC, useState } from 'react'
import { IProduct } from '../../interfaces'
import Modal from '../Modal/Modal'
import ProductForm from '../ProductForm/ProductForm'

interface IProductProps {
    product: IProduct
}

const ProductComponent: FC<IProductProps> = ({ product }) => {
    const [modalOpen, setModalOpen] = useState(true)

    const onClose = () => setModalOpen(false)

    return (
        <div>
            <Modal onClose={onClose} open={modalOpen}>
                <ProductForm
                    category={product.category_name}
                    onClose={onClose}
                    product={product}
                />
            </Modal>
            <p>Model: {product.model}</p>
            <p>Brand: {product.brand}</p>
            <p>In Stock(original): {product.count_original}</p>
            <p>In Stock(copy): {product.count_copy}</p>
            <p>Price Original: {product.price_original}</p>
            <p>Price Copy: {product.price_copy}</p>
        </div>
    )
}

export default ProductComponent
