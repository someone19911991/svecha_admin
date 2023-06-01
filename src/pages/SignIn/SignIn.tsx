import React, {useState} from 'react';
import styles from "./signin.module.css"
import {useSignInMutation} from "../../features/auth/authApiSlice";
import {useAppDispatch} from "../../hooks/redux";
import {setCredentialsAction} from "../../features/auth/authSlice";
import {useForm} from "react-hook-form";
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup";
import Notification from "../../components/Notification/Notification";

type FormValues = {
    email: string
    password: string
}

const schema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required')
})

const SignIn = () => {
    const dispatch = useAppDispatch()
    const [notification, setNotification] = useState({type: '', message: ''})
    const [signIn] = useSignInMutation()
    const form = useForm<FormValues>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: yupResolver(schema)
    })
    const {register, handleSubmit, formState: {errors}} = form


    const onSubmit = async(data: FormValues) => {
        try{
            const result = await signIn(data).unwrap()
            dispatch(setCredentialsAction(result))
        }catch(err: any){
            showNotification({message: err, type: 'error'})
        }
    }

    const handleClose = () => {
        setNotification({message: '', type: ''})
    }

    const showNotification = ({type, message}: {type: string, message: string}) => {
        setNotification({type, message})
        setTimeout(() => setNotification({type: '', message: ''}), 5000)
    }

    return (
        <>
            <Notification message={notification.message} type={notification.type} onClose={handleClose}/>
            <div className={styles.form_wrapper}>
                <p className={styles.title}>Sign In</p>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.signin_form}>
                    <div>
                        <input type="email" placeholder="Email" {...register('email')} />
                        <p className={styles.error}>{errors.email?.message}</p>
                    </div>
                    <div>
                        <input type="password" placeholder="Password" {...register('password')} />
                        <p className={styles.error}>{errors.password?.message}</p>
                    </div>
                    <div>
                        <button className={`btn`} type="submit">Submit</button>
                    </div>
                </form>

            </div>
        </>
    );
};

export default SignIn;