import React, { FC, useEffect, useMemo, useState } from 'react'
import {
    brandsSelect,
    categoriesSelect,
    electrodesTypeArray,
    keyTypeArray,
    electrodesNumberArray,
    keySizeArray,
    seatTypeArray,
    plugsNumberArray,
    contactsNumberArray,
    required_schema,
    typeArray,
    contactTypeArray,
    connectionTypeArray,
    contactNumberArray,
    brandsArray,
    threadSizeArray,
    backendURL,
} from '../../consts'
import { IProduct, IProductForm } from '../../interfaces'
import { useFieldArray, useForm, FieldValues } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import styles from './productForm.module.css'
import { AiOutlineClose, AiOutlineCloseCircle } from 'react-icons/ai'
import {
    useCreateProductMutation,
    useDeleteImgMutation,
    useDeleteRefMutation,
    useDeleteOemMutation,
} from '../../features/products/productsApiSlice'
import noImg from '../../imgs/no_img.png'
import Notification from '../Notification/Notification'

export type FormValues = FieldValues & IProductForm

interface IProductFormProps {
    category: string
    onClose: () => void
    product?: IProduct
}

const ProductForm: FC<IProductFormProps> = ({ category, onClose, product }) => {
    const [otherBrand, setOtherBrand] = useState(false)
    const [refs_, setRefs] = useState<{ [key: string]: Array<string> }>({})
    const [oems_, setOems] = useState<{ [key: string]: Array<string> }>({})
    const [refsToRemove, setRefsToRemove] = useState<{
        [key: string]: Array<string>
    }>({})
    const [oemsToRemove, setOemsToRemove] = useState<{
        [key: string]: Array<string>
    }>({})
    const [deletedImgs, setDeletedImgs] = useState<Array<string>>([])
    const [notification, setNotification] = useState({ type: '', message: '' })
    const [createProduct, { isLoading, isError, error }] =
        useCreateProductMutation()
    const [deleteImgAction] = useDeleteImgMutation()
    const [deleteRefAction] = useDeleteRefMutation()
    const [deleteOemAction] = useDeleteOemMutation()
    const [previewImgs, setPreviewImgs] = useState<Array<any>>([])
    let refsToSet: [{ ref_num: string; brand: string }] = [
        { ref_num: '', brand: '' },
    ]
    let oemsToSet: [{ model: string; oem: string }] = [{ model: '', oem: '' }]

    useMemo(() => {
        if (product) {
            type refsOemsType = { [key: string]: string }
            const refsObject: refsOemsType = {}
            const oemsObject: refsOemsType = {}
            product.refs.forEach((refItem) => {
                refsObject[refItem.brand] = refItem.ref_num
            })
            if (Object.keys(refsObject).length) {
                const refBrands = Object.keys(refsObject)
                const refNums = Object.values(refsObject)
                refBrands.forEach((brand, index) =>
                    refsToSet.push({ brand, ref_num: refNums[index] })
                )
                refsToSet.splice(0, 1)
            }

            product.oems.forEach((oemItem) => {
                oemsObject[oemItem.model] = oemItem.oem
            })
            if (Object.keys(oemsObject).length) {
                const oemModels = Object.keys(oemsObject)
                const oems = Object.values(oemsObject)
                oemModels.forEach((model, index) =>
                    oemsToSet.push({ model, oem: oems[index] })
                )
                oemsToSet.splice(0, 1)
            }
            return { refsToSet, oemsToSet }
        }
    }, [product])

    const defaultValues = useMemo(() => {
        let defaultValues: IProductForm = {
            brand: product ? (!brandsArray.includes(product.brand) ? 'other' : product.brand) : '',
            otherBrandValue: product ? (!brandsArray.includes(product.brand) ? product.brand : '') : '',
            model: product ? product.model : '',
            detail_number:
                product && `${product.detail_number}`
                    ? product.detail_number
                    : '',
            price_original:
                product && `${product.price_original}`
                    ? product.price_original
                    : '',
            count_original:
                product && `${product.count_original}`
                    ? product.count_original
                    : 0,
            count_copy:
                product && `${product.count_copy}` ? product.count_copy : 0,
            price_copy:
                product && `${product.price_copy}` ? product.price_copy : '',
            discount: product && `${product.discount}` ? product.discount : 0,
            imgs: product ? product.imgs : [{ img: '' }],
            refs: product ? refsToSet : [{ ref_num: '', brand: '' }],
            oems: product ? oemsToSet : [{ oem: '', model: '' }],
        }
        if (category === 'spark_plugs') {
            defaultValues = {
                ...defaultValues,
                electrode_type: product ? product.electrode_type : '',
                electrodes_number: product ? product.electrodes_number : '',
                thread_size:
                    product && `${product.thread_size}`
                        ? `${product.thread_size}`
                        : '',
                thread_length:
                    product && `${product.thread_length}`
                        ? product.thread_length
                        : '',
                gap: product && `${product.gap}` ? product.gap : '',
                key_type: product ? product.key_type : '',
                key_size: product ? product.key_size : '',
                seat_type: product ? product.seat_type : '',
            }
        } else if (category === 'ignition_coils') {
            defaultValues = {
                ...defaultValues,
                plugs_number: product ? product.plugs_number : '',
                contacts_number: product ? product.contacts_number : '',
            }
        } else if (category === 'airbag_cables') {
            defaultValues = {
                ...defaultValues,
                steering_axle_bore_diameter: product
                    ? product?.steering_axle_bore_diameter
                    : '',
                airbag_plugs_number: product
                    ? product?.airbag_plugs_number
                    : '',
            }
        } else if (category === 'ignition_coil_mouthpieces') {
            defaultValues = {
                ...defaultValues,
                wired: product ? product?.wired : 0,
                type_: product ? product?.type_ : '',
                contact_type: product ? product?.contact_type : '',
            }
        } else if (
            category === 'crankshaft_sensors' ||
            category === 'camshaft_sensors'
        ) {
            defaultValues = {
                ...defaultValues,
                wired: product ? product?.wired : 0,
                contact_number: product ? product?.contact_number : '',
                connection_type: product ? product?.connection_type : '',
            }
        }

        return defaultValues
    }, [product, category])
    // let defaultValues: IProductForm = {
    //     brand: product ? product.brand : '',
    //     model: product ? product.model : '',
    //     detail_number:
    //         product && `${product.detail_number}` ? product.detail_number : '',
    //     price_original:
    //         product && `${product.price_original}`
    //             ? product.price_original
    //             : '',
    //     count_original:
    //         product && `${product.count_original}` ? product.count_original : 0,
    //     count_copy: product && `${product.count_copy}` ? product.count_copy : 0,
    //     price_copy:
    //         product && `${product.price_copy}` ? product.price_copy : '',
    //     discount: product && `${product.discount}` ? product.discount : 0,
    //     imgs: product ? product.imgs : [{ img: '' }],
    //     refs: product ? refsToSet : [{ ref_num: '', brand: '' }],
    //     oems: product ? oemsToSet : [{ oem: '', model: '' }],
    // }
    // if (category === 'spark_plugs') {
    //     defaultValues = {
    //         ...defaultValues,
    //         electrode_type: product ? product.electrode_type : '',
    //         electrodes_number: product ? product.electrodes_number : '',
    //         thread_size:
    //             product && `${product.thread_size}` ? `${product.thread_size}` : '',
    //         thread_length:
    //             product && `${product.thread_length}`
    //                 ? product.thread_length
    //                 : '',
    //         gap: product && `${product.gap}` ? product.gap : '',
    //         key_type: product ? product.key_type : '',
    //         key_size: product ? product.key_size : '',
    //         seat_type: product ? product.seat_type : '',
    //     }
    // } else if (category === 'ignition_coils') {
    //     defaultValues = {
    //         ...defaultValues,
    //         plugs_number: product ? product.plugs_number : '',
    //         contacts_number: product ? product.contacts_number : '',
    //     }
    // } else if (category === 'airbag_cables') {
    //     defaultValues = {
    //         ...defaultValues,
    //         steering_axle_bore_diameter: product
    //             ? product?.steering_axle_bore_diameter
    //             : '',
    //         airbag_plugs_number: product ? product?.airbag_plugs_number : '',
    //     }
    // } else if (category === 'ignition_coil_mouthpieces') {
    //     defaultValues = {
    //         ...defaultValues,
    //         wired: product ? product?.wired : 0,
    //         type_: product ? product?.type_ : '',
    //         contact_type: product ? product?.contact_type : '',
    //     }
    // } else if (
    //     category === 'crankshaft_sensors' ||
    //     category === 'camshaft_sensors'
    // ) {
    //     defaultValues = {
    //         ...defaultValues,
    //         wired: product ? product?.wired : 0,
    //         contact_number: product ? product?.contact_number : '',
    //         connection_type: product ? product?.connection_type : '',
    //     }
    // }

    const form = useForm<FormValues>({
        defaultValues,
        resolver: yupResolver(required_schema[category]),
    })
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch,
        getValues,
        setValue,
        setError,
        reset,
        clearErrors,
    } = form
    const {
        fields: refFields,
        append: appendRef,
        update: updateRef,
        remove: removeRef,
    } = useFieldArray<FormValues>({ name: 'refs', control })
    const {
        fields: oemFields,
        append: appendOem,
        update: updateOem,
        remove: removeOem,
    } = useFieldArray<FormValues>({ name: 'oems', control })
    const {
        fields: imgFields,
        append: appendImg,
        remove: removeImg,
    } = useFieldArray<FormValues>({ name: 'imgs', control })
    const [brandOptions, setBrandOptions] = useState<JSX.Element[]>([])
    const [categoryOptions, setCategoryOptions] = useState<JSX.Element[]>([])

    const showNotification = ({
        type,
        message,
    }: {
        type: string
        message: string
    }) => {
        setNotification({ type, message })
        setTimeout(() => setNotification({ type: '', message: '' }), 5000)
    }

    const onSubmit = async (data: FormValues) => {
        let master_img = 0
        const imgMaster = document.querySelector(
            'input[type=radio][id^="img"]:checked'
        )
        if (imgMaster && imgMaster.id) {
            master_img = Number(imgMaster.id.split('_').pop())
        }
        const formData = new FormData()
        delete data.ref_brand

        if(otherBrand){
            data.brand = data.otherBrandValue
        }

        // @ts-ignore
        delete data.otherBrandValue

        for (let i in data) {
            if (i === 'imgs') {
                data.imgs.forEach((imgItem) => {
                    if (typeof imgItem.img[0] !== 'string')
                        formData.append('imgs', imgItem.img[0])
                })
            } else if (i === 'refs') {
                const refsToPass: Array<{ brand: string; ref_num: string }> = []
                for (let i in refs_) {
                    refs_[i].forEach((ref) =>
                        refsToPass.push({ brand: i, ref_num: ref })
                    )
                }

                // commented to not show that refs are required
                // if(!refsToPass.length){
                //     setError(`refs.0.brand`, { type: 'custom', message: 'At least 1 reference required' })
                //     return
                // }
                formData.append('refs', JSON.stringify(refsToPass))
            } else if (i === 'oems') {
                const oemsToPass: Array<{ model: string; oem: string }> = []
                for (let i in oems_) {
                    oems_[i].forEach((oem) =>
                        oemsToPass.push({ model: i, oem })
                    )
                }
                // commented to not show that oems are required
                // if(!oemsToPass.length){
                //     setError(`oems.0.model`, { type: 'custom', message: 'At least 1 oem required' })
                //     return
                // }

                formData.append('oems', JSON.stringify(oemsToPass))
            } else {
                formData.append(i, data[i])
            }
        }

        formData.append('category_name', category)
        formData.append(
            'category_id',
            `${categoriesSelect[category].category_id}`
        )
        formData.append('img_master', `${master_img}`)

        if (product?.product_id) {
            formData.append('product_id', `${product.product_id}`)
            formData.append('deleted_imgs', `${JSON.stringify(deletedImgs)}`)
        }

        try {
            await createProduct(formData).unwrap()
            onClose()
        } catch (err) {
            console.log({ err })
        }
    }

    useEffect(() => {
        const brandOptions_ = []
        const categoryOptions_ = []
        for (let i in brandsSelect) {
            brandOptions_.push(
                <option key={i} value={i}>
                    {brandsSelect[i]}
                </option>
            )
        }
        for (let i in categoriesSelect) {
            categoryOptions_.push(
                <option key={i} value={i}>
                    {categoriesSelect[i].name}
                </option>
            )
        }
        setBrandOptions(brandOptions_)
        setCategoryOptions(categoryOptions_)
        !!product?.imgs.length && setPreviewImgs(product.imgs)
    }, [])

    const removeImgItem = async (imgIndex: number) => {
        let imgToDelete = getValues().imgs.find(
            (imgItem, index) => index === imgIndex
        )
        if (product?.product_id) {
            if (product?.product_id && imgToDelete) {
                try {
                    if (typeof imgToDelete.img === 'string') {
                        await deleteImgAction({
                            product_id: product.product_id,
                            img: imgToDelete.img,
                        })
                    }
                } catch (err) {
                    showNotification({
                        type: 'error',
                        message: JSON.stringify(error),
                    })
                }
            }
        }

        removeImg(imgIndex)
        if (typeof previewImgs[imgIndex].img === 'string') {
            setDeletedImgs([...deletedImgs, previewImgs[imgIndex].img])
        }
        const imgSrcsToRemain = previewImgs.filter(
            (item, index) => index !== imgIndex
        )
        setPreviewImgs(imgSrcsToRemain)
    }

    const deleteImg = async (imgIndex: number) => {
        const values = getValues()
        const imgsNewValues = values.imgs.map((imgItem, index) => {
            if (index === imgIndex) {
                if (typeof imgItem.img === 'string') {
                    setDeletedImgs([...deletedImgs, imgItem.img])
                }
                return { img: '' }
            }
            return imgItem
        }) as typeof values.imgs
        setValue('imgs', imgsNewValues)
        const imgSrcsToRemain = previewImgs.map((item, index) =>
            index !== imgIndex ? item : ''
        )
        setPreviewImgs(imgSrcsToRemain)
        if (product?.product_id) {
            const imgs = getValues().imgs
            const imgToDelete = imgs.find(
                (imgItem, index) => index === imgIndex
            )
            if (product?.product_id && imgToDelete) {
                try {
                    if (typeof imgToDelete === 'string') {
                        await deleteImgAction({
                            product_id: product.product_id,
                            img: imgToDelete,
                        })
                    }
                } catch (err) {
                    showNotification({
                        type: 'error',
                        message: JSON.stringify(error),
                    })
                }
            }
        }
    }

    const removeOemItem = (type: string, index: number) => {
        if (type === 'ref') {
            // @ts-ignore
            setValue(`refs.${index}.ref_num`, '')
        } else if (type === 'oem') {
            // @ts-ignore
            setValue(`oems.${index}.oem`, '')
        }
    }

    const addOemItem = (type: string, index: number) => {
        const values = getValues()
        if (type === 'ref') {
            const refNumValueToAdd = values.refs[index].ref_num.trim()
            const refBrand = values.refs[index].brand.trim()
            if (refBrand && refNumValueToAdd) {
                const arrayToEdit = refs_[refBrand] ? refs_[refBrand] : []
                setRefs({
                    ...refs_,
                    [refBrand]: [...arrayToEdit, refNumValueToAdd],
                })
            }
        } else if (type === 'oem') {
            const oemValueToAdd = values.oems[index].oem.trim()
            const oemModel = values.oems[index].model.trim()
            if (oemValueToAdd && oemModel) {
                const arrayToEdit = oems_[oemModel] ? oems_[oemModel] : []
                setOems({
                    ...oems_,
                    [oemModel]: [...arrayToEdit, oemValueToAdd],
                })
            }
        }
    }

    const prepareToRemove = (
        type: string,
        oemRefKey: string,
        value: string
    ) => {
        if (type === 'ref') {
            let arrayToSet = refsToRemove[oemRefKey]
                ? refsToRemove[oemRefKey]
                : []
            if (refsToRemove?.[oemRefKey]?.includes(value)) {
                arrayToSet = arrayToSet.filter((item) => item !== value)
            } else {
                arrayToSet = [...arrayToSet, value]
            }
            const refsToSet = {
                ...refsToRemove,
                [oemRefKey]: arrayToSet,
            }
            if (!arrayToSet.length) {
                delete refsToSet[oemRefKey]
            }
            setRefsToRemove(refsToSet)
        } else if (type === 'oem') {
            let arrayToSet = oemsToRemove[oemRefKey]
                ? oemsToRemove[oemRefKey]
                : []
            if (oemsToRemove?.[oemRefKey]?.includes(value)) {
                arrayToSet = arrayToSet.filter((item) => item !== value)
            } else {
                arrayToSet = [...arrayToSet, value]
            }
            const oemsToSet = {
                ...oemsToRemove,
                [oemRefKey]: arrayToSet,
            }
            if (!arrayToSet.length) {
                delete oemsToSet[oemRefKey]
            }
            setOemsToRemove(oemsToSet)
        }
    }

    const clearAll = (type: string) => {
        if (type === 'ref') {
            setRefs({})
            setRefsToRemove({})
        } else if (type === 'oem') {
            setOems({})
            setOemsToRemove({})
        }
    }

    const removePreparedItems = async (type: string) => {
        try {
            type refsOemsToStay = { [key: string]: Array<string> }
            if (type === 'oem') {
                const oemsToStay: refsOemsToStay = { ...oems_ }
                const oemsToSend = []
                for (let i in oemsToRemove) {
                    const oemsToStayArray: Array<string> = []
                    const oemsToRemoveI = oemsToRemove[i].map((item) => {
                        let itemArray = item.split('_')
                        itemArray.pop()
                        const itemToPush = itemArray.join('_')
                        return itemToPush
                    })
                    oemsToSend.push(...oemsToRemoveI)
                    if (product) {
                        await deleteOemAction({
                            oems: oemsToSend,
                            product_id: product.product_id,
                        })
                    }
                    oems_[i].forEach((oemItem) => {
                        if (!oemsToRemoveI.includes(oemItem)) {
                            oemsToStayArray.push(oemItem)
                        }
                    })
                    oemsToStay[i] = oemsToStayArray
                    if (!oemsToStay[i].length) {
                        delete oemsToStay[i]
                    }
                }
                setOems(oemsToStay)
                setOemsToRemove({})
            } else if (type === 'ref') {
                const refsToStay: refsOemsToStay = { ...refs_ }
                const refsToSend = []
                for (let i in refsToRemove) {
                    const trial = refsToRemove[i].reduce(
                        (acc: Array<string>, item: string) => {
                            let itemArr = item.split('_')
                            itemArr.pop()
                            const itemToPush = itemArr.join('_')
                            acc.push(itemToPush)
                            return acc
                        },
                        []
                    )
                    refsToSend.push(...trial)
                }

                if (product) {
                    await deleteRefAction({
                        refs: refsToSend,
                        product_id: product.product_id,
                    }).unwrap()
                }

                for (let i in refsToRemove) {
                    const refsToStayArray: Array<string> = []
                    const refsToRemoveI = refsToRemove[i].map((item) => {
                        let itemArr = item.split('_')
                        itemArr.pop()
                        const itemToPush = itemArr.join('_')
                        return itemToPush
                    })
                    refs_[i].forEach((oemItem) => {
                        if (!refsToRemoveI.includes(oemItem)) {
                            refsToStayArray.push(oemItem)
                        }
                    })
                    refsToStay[i] = refsToStayArray
                    if (!refsToStay[i].length) {
                        delete refsToStay[i]
                    }
                }

                setRefs(refsToStay)
                setRefsToRemove({})
            }
        } catch (err) {
            console.log(JSON.stringify(err))
        }
    }

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name === 'brand') {
                if (value.brand === 'other') {
                    setOtherBrand(true)
                } else {
                    setOtherBrand(false)
                }
            }

            if (
                name?.startsWith('imgs') &&
                type === 'change' &&
                value?.imgs?.length
            ) {
                const imgSrcArr: any = []

                value.imgs.forEach((imgItem, index) => {
                    if (typeof imgItem?.img === 'string') {
                        if (imgItem?.img) {
                            imgSrcArr[index] = { img: imgItem?.img }
                        } else {
                            imgSrcArr[index] = { img: '' }
                        }
                    } else {
                        imgSrcArr[index] = { img: imgItem?.img?.[0] }
                    }
                })

                setPreviewImgs(imgSrcArr)
            }
        })
        return () => subscription.unsubscribe()
    }, [watch])

    useEffect(() => {
        if (isError) {
            showNotification({ type: 'error', message: JSON.stringify(error) })
        }
    }, [isError])

    useEffect(() => {
        type refsOemsType = { [key: string]: Array<string> }
        if (product) {
            const { refs, oems } = product
            const refsToSet: refsOemsType = {}
            if (refs.length) {
                refs.forEach((ref) => {
                    if (refsToSet[ref.brand]) {
                        refsToSet[ref.brand] = [
                            ...refsToSet[ref.brand],
                            ref.ref_num,
                        ]
                    } else {
                        refsToSet[ref.brand] = [ref.ref_num]
                    }
                })
                setRefs(refsToSet)
            }

            const oemsToSet: refsOemsType = {}
            if (oems.length) {
                oems.forEach((oem) => {
                    if (oemsToSet[oem.model]) {
                        oemsToSet[oem.model] = [
                            ...oemsToSet[oem.model],
                            oem.oem,
                        ]
                    } else {
                        oemsToSet[oem.model] = [oem.oem]
                    }
                })
                setOems(oemsToSet)
            }

            if(!brandsArray.includes(product.brand)){
                setOtherBrand(true)
            }
        }
    }, [product])


    return (
        <div>
            <Notification
                type={notification.type}
                onClose={() => setNotification({ type: '', message: '' })}
                message={notification.message}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.pf_form}>
                    <div>
                        <label htmlFor="brand">Brand</label>
                        <select {...register('brand')}>
                            <option disabled={true} value="">
                                Select Brand
                            </option>
                            {brandsArray.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt.toUpperCase()}
                                </option>
                            ))}
                        </select>
                        {otherBrand && (
                            <div className={styles.otherBrand}>
                                <input
                                    type="text"
                                    placeholder="Brand"
                                    {...register('otherBrandValue')}
                                />
                                <p className={styles.pf_error}>
                                    {errors.otherBrandValue?.message}
                                </p>
                            </div>
                        )}
                        <p className={styles.pf_error}>
                            {errors.brand?.message}
                        </p>
                    </div>
                    <div>
                        <label htmlFor="detail_number">Detail Number</label>
                        <input
                            id="detail_number"
                            type="text"
                            placeholder="Detail Number"
                            {...register('detail_number')}
                        />
                        <p className={styles.pf_error}>
                            {errors.detail_number?.message}
                        </p>
                    </div>
                    <div>
                        <label htmlFor="model">Model</label>
                        <input
                            type="text"
                            placeholder="Model"
                            {...register('model')}
                        />
                        <p className={styles.pf_error}>
                            {errors.model?.message}
                        </p>
                    </div>
                    <div>
                        <label htmlFor="price_original">Price Original</label>
                        <input
                            type="number"
                            min={0}
                            placeholder="Price Original"
                            {...register('price_original')}
                        />
                        <p className={styles.pf_error}>
                            {errors.price_original?.message}
                        </p>
                    </div>
                    <div>
                        <label htmlFor="price_copy">Price Copy</label>
                        <input
                            id="price_copy"
                            min={0}
                            type="number"
                            placeholder="Price Copy"
                            {...register('price_copy')}
                        />
                        <p className={styles.pf_error}>
                            {errors.price_copy?.message}
                        </p>
                    </div>
                    <div>
                        <label htmlFor="discount">Discount</label>
                        <input
                            step="0.1"
                            min={0}
                            type="number"
                            placeholder="Discount"
                            {...register('discount')}
                        />
                        <p className={styles.pf_error}>
                            {errors.discount?.message}
                        </p>
                    </div>
                    <div>
                        <label htmlFor="count">Count(original)</label>
                        <input
                            min={0}
                            type="number"
                            placeholder="Count(original)"
                            {...register('count_original')}
                        />
                        <p className={styles.pf_error}>
                            {errors.count_original?.message}
                        </p>
                    </div>
                    <div>
                        <label htmlFor="count">Count(copy)</label>
                        <input
                            min={0}
                            type="number"
                            placeholder="Count(copy)"
                            {...register('count_copy')}
                        />
                        <p className={styles.pf_error}>
                            {errors.count_copy?.message}
                        </p>
                    </div>
                    {(category === 'crankshaft_sensors' ||
                        category === 'camshaft_sensors') && (
                        <>
                            <div>
                                <label htmlFor="wire">Wire</label>
                                <input
                                    id="wire"
                                    step="0.1"
                                    min={0}
                                    type="number"
                                    placeholder="Wired"
                                    {...register('wired')}
                                />
                                <p className={styles.pf_error}>
                                    {errors?.wired?.message}
                                </p>
                            </div>
                            <div>
                                <label htmlFor="contact_number">
                                    Contact Number
                                </label>
                                <select {...register('contact_number')}>
                                    <option disabled={true} value="">
                                        Select Contact Number
                                    </option>
                                    {contactNumberArray.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <p className={styles.pf_error}>
                                    {errors?.contact_number?.message}
                                </p>
                            </div>
                            <div>
                                <label htmlFor="connection_type">
                                    Connection Type
                                </label>
                                <select {...register('connection_type')}>
                                    <option disabled={true} value="">
                                        Select Connection Type
                                    </option>
                                    {connectionTypeArray.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <p className={styles.pf_error}>
                                    {errors?.connection_type?.message}
                                </p>
                            </div>
                        </>
                    )}

                    {category === 'airbag_cables' && (
                        <>
                            <div>
                                <label htmlFor="steering_axle_bore_diameter">
                                    Steering Axle Bore Diameter
                                </label>
                                <input
                                    id="steering_axle_bore_diameter"
                                    step="0.1"
                                    min={0}
                                    type="number"
                                    placeholder="Steering Axle Bore Diameter"
                                    {...register('steering_axle_bore_diameter')}
                                />
                                <p className={styles.pf_error}>
                                    {
                                        errors?.steering_axle_bore_diameter
                                            ?.message
                                    }
                                </p>
                            </div>
                            <div>
                                <label htmlFor="airbag_plugs_number">
                                    Airbag Plugs Number
                                </label>
                                <input
                                    id="airbag_plugs_number"
                                    type="number"
                                    min={0}
                                    placeholder="Airbag Plugs Number"
                                    {...register('airbag_plugs_number')}
                                />
                                <p className={styles.pf_error}>
                                    {errors?.airbag_plugs_number?.message}
                                </p>
                            </div>
                        </>
                    )}
                    {category === 'ignition_coils' && (
                        <>
                            <div>
                                <label htmlFor="electrode_type">
                                    Plugs Number
                                </label>
                                <select {...register('plugs_number')}>
                                    <option disabled={true} value="">
                                        Select Plugs Number
                                    </option>
                                    {plugsNumberArray.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <p className={styles.pf_error}>
                                    {errors.plugs_number?.message}
                                </p>
                            </div>
                            <div>
                                <label htmlFor="contacts_number">
                                    Contacts Number
                                </label>
                                <select {...register('contacts_number')}>
                                    <option disabled={true} value="">
                                        Select Contacts Number
                                    </option>
                                    {contactsNumberArray.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <p className={styles.pf_error}>
                                    {errors.contacts_number?.message}
                                </p>
                            </div>
                        </>
                    )}

                    {category === 'ignition_coil_mouthpieces' && (
                        <>
                            <div>
                                <label htmlFor="electrode_type">Wired</label>
                                <input
                                    id="airbag_plugs_number"
                                    min={0}
                                    type="number"
                                    placeholder="Wired"
                                    {...register('wired')}
                                />
                                <p className={styles.pf_error}>
                                    {errors.wired?.message}
                                </p>
                            </div>
                            <div>
                                <label htmlFor="type_">Contacts Number</label>
                                <select {...register('type_')}>
                                    <option disabled={true} value="">
                                        Select Type
                                    </option>
                                    {typeArray.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <p className={styles.pf_error}>
                                    {errors.type_?.message}
                                </p>
                            </div>
                            <div>
                                <label htmlFor="contact_type">
                                    Contact Type
                                </label>
                                <select {...register('contact_type')}>
                                    <option disabled={true} value="">
                                        Select Contact Type
                                    </option>
                                    {contactTypeArray.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <p className={styles.pf_error}>
                                    {errors.contact_type?.message}
                                </p>
                            </div>
                        </>
                    )}

                    {category === 'spark_plugs' && (
                        <>
                            <div>
                                <label htmlFor="electrode_type">
                                    Electrode Type
                                </label>
                                <select {...register('electrode_type')}>
                                    <option disabled={true} value="">
                                        Select Electrode Type
                                    </option>
                                    {electrodesTypeArray.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <p className={styles.pf_error}>
                                    {errors.electrode_type?.message}
                                </p>
                            </div>
                            <div>
                                <label htmlFor="electrodes_number">
                                    Electrodes Number
                                </label>
                                <select {...register('electrodes_number')}>
                                    <option disabled={true} value="">
                                        Select Electrodes Number
                                    </option>
                                    {electrodesNumberArray.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <p className={styles.pf_error}>
                                    {errors.electrodes_number?.message}
                                </p>
                            </div>
                            <div>
                                <label htmlFor="key_type">Key Type</label>
                                <select {...register('key_type')}>
                                    <option disabled={true} value="">
                                        Select Key Type
                                    </option>
                                    {keyTypeArray.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <p className={styles.pf_error}>
                                    {errors.key_type?.message}
                                </p>
                            </div>
                            <div>
                                <label htmlFor="key_size">Key Size</label>
                                <select {...register('key_size')}>
                                    <option disabled={true} value="">
                                        Select Key Size
                                    </option>
                                    {keySizeArray.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <p className={styles.pf_error}>
                                    {errors.key_size?.message}
                                </p>
                            </div>
                            <div>
                                <label htmlFor="seat_type">Seat Type</label>
                                <select {...register('seat_type')}>
                                    <option disabled={true} value="">
                                        Select Seat Type
                                    </option>
                                    {seatTypeArray.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <p className={styles.pf_error}>
                                    {errors.seat_type?.message}
                                </p>
                            </div>
                            <div>
                                <label htmlFor="thread_size">Thread Size</label>
                                <select {...register('thread_size')}>
                                    <option disabled={true} value="">
                                        Select Thread Size
                                    </option>
                                    {threadSizeArray.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <p className={styles.pf_error}>
                                    {errors.thread_size?.message}
                                </p>
                            </div>
                            <div>
                                <label htmlFor="gap">Thread Length</label>
                                <input
                                    step="0.1"
                                    id="thread_length"
                                    min={0}
                                    type="number"
                                    placeholder="Thread Length"
                                    {...register('thread_length')}
                                />
                                <p className={styles.pf_error}>
                                    {errors.thread_length?.message}
                                </p>
                            </div>
                            <div>
                                <label htmlFor="gap">GAP</label>
                                <input
                                    step="0.1"
                                    id="gap"
                                    min={0}
                                    type="number"
                                    placeholder="Gap"
                                    {...register('gap')}
                                />
                                <p className={styles.pf_error}>
                                    {errors.gap?.message}
                                </p>
                            </div>
                        </>
                    )}
                    <div>
                        <div>
                            <div className={styles.refs_oems_container}>
                                <div>
                                    {refFields.map((oemItem, index) => {
                                        return (
                                            <div
                                                className={styles.ref_oem_row}
                                                key={`${index}`}
                                            >
                                                <div
                                                    className={
                                                        styles.ref_oem_field
                                                    }
                                                >
                                                    <input
                                                        type="text"
                                                        placeholder="REF BRAND"
                                                        {...register(
                                                            `refs.${index}.brand`
                                                        )}
                                                    />
                                                    <p
                                                        className={
                                                            styles.pf_error
                                                        }
                                                    >
                                                        {
                                                            errors?.refs?.[
                                                                index
                                                            ]?.brand?.message
                                                        }
                                                    </p>
                                                </div>
                                                <div
                                                    className={
                                                        styles.ref_oem_field
                                                    }
                                                >
                                                    <input
                                                        type="text"
                                                        placeholder="REF Number"
                                                        {...register(
                                                            `refs.${index}.ref_num`
                                                        )}
                                                    />
                                                    <p
                                                        className={
                                                            styles.pf_error
                                                        }
                                                    >
                                                        {
                                                            errors?.refs?.[
                                                                index
                                                            ]?.ref_num?.message
                                                        }
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        addOemItem('ref', index)
                                                        clearErrors(
                                                            'refs.0.brand'
                                                        )
                                                    }}
                                                >
                                                    ADD
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        removeOemItem(
                                                            'ref',
                                                            index
                                                        )
                                                    }}
                                                >
                                                    CANCEL
                                                </button>
                                            </div>
                                        )
                                    })}
                                    <button
                                        className={`btn_wh ${styles.oem_ref_btn}`}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            appendRef('')
                                        }}
                                    >
                                        Add Reference
                                    </button>
                                </div>
                                <div className={styles.refs_oems_list}>
                                    {Object.keys(refs_).map((refKey) => {
                                        const keyValues = refs_[refKey]
                                        return (
                                            <div key={`${refs_[refKey]}`}>
                                                <p
                                                    className={
                                                        styles.oem_ref_title
                                                    }
                                                >
                                                    {refKey}
                                                </p>
                                                <div>
                                                    {keyValues.map(
                                                        (value, index) => (
                                                            <p
                                                                onClick={() =>
                                                                    prepareToRemove(
                                                                        'ref',
                                                                        refKey,
                                                                        `${value}_${index}`
                                                                    )
                                                                }
                                                                key={`${value}_${index}`}
                                                                className={`${
                                                                    styles.oem_ref_value
                                                                }  ${
                                                                    refsToRemove[
                                                                        refKey
                                                                    ]?.includes(
                                                                        `${value}_${index}`
                                                                    )
                                                                        ? styles.to_be_deleted
                                                                        : ''
                                                                }`}
                                                            >
                                                                {value}
                                                            </p>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {!!Object.values(refs_).length && (
                                        <div
                                            className={styles.refs_oems_actions}
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    removePreparedItems('ref')
                                                }}
                                            >
                                                Remove
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    clearAll('ref')
                                                }}
                                            >
                                                Clear All
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/*<button*/}
                            {/*    className={`btn_wh ${styles.oem_ref_btn}`}*/}
                            {/*    onClick={(e) => {*/}
                            {/*        e.preventDefault()*/}
                            {/*        appendRef('')*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    Add Reference*/}
                            {/*</button>*/}
                        </div>
                    </div>
                    <div>
                        <div className={styles.refs_oems_container}>
                            <div>
                                {oemFields.map((oemItem, index) => {
                                    return (
                                        <div
                                            key={`${index}`}
                                            className={styles.ref_oem_row}
                                        >
                                            <div
                                                className={styles.ref_oem_field}
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="OEM MODEL"
                                                    {...register(
                                                        `oems.${index}.model`
                                                    )}
                                                />
                                                <p className={styles.pf_error}>
                                                    {
                                                        errors?.oems?.[index]
                                                            ?.model?.message
                                                    }
                                                </p>
                                            </div>
                                            <div
                                                className={styles.ref_oem_field}
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="OEM"
                                                    {...register(
                                                        `oems.${index}.oem`
                                                    )}
                                                />
                                                <p className={styles.pf_error}>
                                                    {
                                                        errors?.oems?.[index]
                                                            ?.oem?.message
                                                    }
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    addOemItem('oem', index)
                                                    clearErrors('oems.0.model')
                                                }}
                                            >
                                                ADD
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    removeOemItem('oem', index)
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )
                                })}
                                <button
                                    className="btn"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        appendOem('')
                                    }}
                                >
                                    Add OEM
                                </button>
                            </div>
                            <div className={styles.refs_oems_list}>
                                {Object.keys(oems_).map((oemKey) => {
                                    const keyValues = oems_[oemKey]
                                    return (
                                        <div key={oemKey}>
                                            <p className={styles.oem_ref_title}>
                                                {oemKey}
                                            </p>
                                            <div>
                                                {keyValues.map(
                                                    (value, index) => (
                                                        <p
                                                            onClick={() =>
                                                                prepareToRemove(
                                                                    'oem',
                                                                    oemKey,
                                                                    `${value}_${index}`
                                                                )
                                                            }
                                                            key={`${value}_${index}`}
                                                            className={`${
                                                                styles.oem_ref_value
                                                            } ${
                                                                oemsToRemove[
                                                                    oemKey
                                                                ]?.includes(
                                                                    `${value}_${index}`
                                                                )
                                                                    ? styles.to_be_deleted
                                                                    : ''
                                                            }`}
                                                        >
                                                            {value}
                                                        </p>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                                {!!Object.values(oems_).length && (
                                    <div className={styles.refs_oems_actions}>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                removePreparedItems('oem')
                                            }}
                                        >
                                            Remove
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                clearAll('oem')
                                            }}
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/*<button*/}
                        {/*    className="btn"*/}
                        {/*    onClick={(e) => {*/}
                        {/*        e.preventDefault()*/}
                        {/*        appendOem('')*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    Add OEM*/}
                        {/*</button>*/}
                    </div>
                    <div>
                        <label htmlFor="images">Image/s</label>
                        {imgFields.map((item, index) => {
                            return (
                                <div key={item.id}>
                                    <div className={styles.img_field}>
                                        <label
                                            className={`btn_wh ${styles.img_label}`}
                                            htmlFor={`img_${index}`}
                                        >
                                            Choose IMG
                                        </label>
                                        <input
                                            id={`img_${index}`}
                                            type="file"
                                            {...register(`imgs.${index}.img`)}
                                        />
                                        <div
                                            className={styles.img_container}
                                            title="Delete Image"
                                        >
                                            <span
                                                onClick={() => deleteImg(index)}
                                            >
                                                <AiOutlineClose />
                                            </span>
                                            <img
                                                src={
                                                    previewImgs[index]?.img &&
                                                    typeof previewImgs[index]
                                                        ?.img === 'string'
                                                        ? `${backendURL}/${previewImgs[index]?.img}`
                                                        : previewImgs[index]
                                                                ?.img &&
                                                            typeof previewImgs[
                                                                index
                                                            ]?.img !== 'string'
                                                          ? URL.createObjectURL(
                                                                previewImgs[
                                                                    index
                                                                ]?.img
                                                            )
                                                          : noImg
                                                }
                                                alt=""
                                            />
                                        </div>
                                        {imgFields.length > 1 && (
                                            <>
                                                <button
                                                    title="Remove Img item"
                                                    className={
                                                        styles.btn_remove_img
                                                    }
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        removeImgItem(index)
                                                    }}
                                                >
                                                    <AiOutlineCloseCircle />
                                                </button>
                                                <div
                                                    className={
                                                        styles.master_img
                                                    }
                                                >
                                                    {index === 0 && (
                                                        <p>Master Img</p>
                                                    )}
                                                    <input
                                                        defaultChecked={
                                                            !!product?.imgs[
                                                                index
                                                            ]?.master
                                                        }
                                                        type="radio"
                                                        name="master_img"
                                                        id={`img_${index}`}
                                                    />
                                                </div>
                                            </>
                                        )}
                                        <p className={styles.pf_error}>
                                            {
                                                errors?.imgs?.[index]?.img
                                                    ?.message
                                            }
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div>
                        <button
                            className="btn_wh"
                            onClick={(e) => {
                                e.preventDefault()
                                appendImg({ img: '' })
                            }}
                        >
                            Add Image
                        </button>
                    </div>
                </div>
                <div className={styles.submit_btn}>
                    <button className={`btn ${isLoading ? 'disabled' : ''}`}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ProductForm
