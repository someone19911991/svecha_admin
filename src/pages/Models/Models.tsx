import React, {useEffect, useState} from 'react';
import styles from "./models.module.css"
import {useCreateModelMutation, useGetModelsQuery, useUpdateModelMutation, useDeleteModelMutation} from "../../features/models/modelApiSlice";
import {FiUpload} from "react-icons/fi"
import {createModelSchema, updateModelSchema} from "../../consts";
import {FieldValues, useForm} from 'react-hook-form'
import {yupResolver} from "@hookform/resolvers/yup";
import {MdModeEditOutline} from "react-icons/md"
import {MdDelete} from "react-icons/md"
import {AiOutlineClose} from "react-icons/ai"

interface ModelForm{
    name: string
    img: string
}

type FormValues = FieldValues & ModelForm

const backURL = 'https://www.back.svecha.am'

interface IImgToEdit{
    oldImgName: string, id: string
}

const Models = () => {
    const [previewImg, setPreviewImg] = useState('')
    const defaultValues = {name: '', img: ''}
    const [modelToEdit, setModelToEdit] = useState<IImgToEdit>({oldImgName: '', id: ''})

    const form = useForm<FormValues>({
        defaultValues,
        resolver: yupResolver(modelToEdit.id ? updateModelSchema : createModelSchema),
    })
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        resetField,
        watch,
        setValue
    } = form
    const [name, setName] = useState('')
    const [img, setImg] = useState<File | null>(null)
    const [createModel, {isLoading: createLoading}] = useCreateModelMutation()
    const [updateModel, {isLoading: updateLoading}] = useUpdateModelMutation()
    const [deleteModel, {error}] = useDeleteModelMutation()
    const {data: models, isLoading} = useGetModelsQuery()

    const onSubmit = async(data: FormValues) => {
        const formData = new FormData()
        if(modelToEdit.id){
            if(data.img){
                formData.append('img', data.img[0])
            }
            formData.append('id', modelToEdit.id)
            formData.append('oldImgName', modelToEdit.oldImgName)
        }else{
            formData.append('img', data.img[0])
        }

        formData.append('name', data.name)

        try{
            if(modelToEdit.id){
                await updateModel(formData).unwrap()
            }else{
                await createModel(formData).unwrap()
            }

            reset()
            setPreviewImg('')
        }catch(err: any){
            console.log({err})
        }
    }

    const handleEditModel = (id: number) => {
        const currentModel = models?.find(model => model.id === id)
        if(currentModel){
            setValue('name', currentModel.name)
            setModelToEdit({...modelToEdit, id: `${currentModel.id}`, oldImgName: currentModel.img})
        }

    }

    const handleDeleteModel = async(id: number) => {
        try{
            const deleteModel_ = window.confirm('Are you sure you want to delete this model?')
            if(deleteModel_){
                await deleteModel({id: `${id}`})
            }
        }catch(err){
            console.log(err)
        }
    }

    const resetImg = () => {
        resetField('img')
        setPreviewImg('')
    }

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (
                name === 'img'
            ) {
                const img = value.img && value.img[0]
                if(img){
                    // @ts-ignore
                    const imageURL = URL.createObjectURL(img);
                    setPreviewImg(imageURL);
                }
            }
        })
        return () => subscription.unsubscribe()
    }, [watch])


    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <h3 className={styles.title}>Create Model</h3>
                <div className={styles.input_container}>
                    <input className={styles.input_field} {...register('name')} type="text" placeholder="Name"/>
                    <p className={styles.error}>{errors.name && errors.name.message}</p>
                </div>
                <div className={styles.input_container}>
                    <div className={styles.upload_img}>
                        <label className={styles.input_label} htmlFor="imgInput"><FiUpload className={styles.file_upload_icon} /></label>
                        <input className={styles.file_input} id="imgInput" type="file" {...register('img')} placeholder="Name"/>
                        {previewImg && <div className={styles.preview_container}><div className={styles.delete_selected_img}><AiOutlineClose onClick={resetImg} className={styles.delete_icon} /></div><img className={styles.preview} src={previewImg}/></div>}
                    </div>

                    <p className={styles.error}>{errors.img && errors.img.message}</p>
                </div>
                <button disabled={createLoading || updateLoading} className={styles.submit_btn}>{(createLoading || updateLoading) ? 'Submitting...' : (modelToEdit.id ? 'Update' : 'Create')}</button>
            </form>
            <div className={styles.models}>
                {models && models.map(model => <div key={model.img} className={styles.model}>
                    <div className={styles.model_img}>
                        <div className={styles.actions_container}>
                            <MdModeEditOutline onClick={() => handleEditModel(model.id)} className={`${styles.action_icon} ${styles.edit}`}/>
                            <MdDelete onClick={() => handleDeleteModel(model.id)} className={`${styles.action_icon} ${styles.delete}`}/>
                        </div>
                        <img src={`${backURL}/${model.img}`} alt={model.name}/>
                    </div>
                    <p className={styles.model_name}>{model.name}</p>
                </div>)}
            </div>
        </div>
    );
};

export default Models;