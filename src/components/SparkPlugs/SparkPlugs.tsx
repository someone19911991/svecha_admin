import React from 'react';
import * as yup from "yup"
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import styles from "../ProductForm/productForm.module.css";
import {sparkPlugsSchema} from "../../consts";


type FormValues = {
    electrode_type: string
    electrodes_number: string
    thread_size: number
    thread_length: number
    gap: number
    key_type: string
    key_size: string,
    seat_type: string
}

const keyTypeArray = ['шестигранник', 'многогранник']
const keySizeArray = ['12', '16', '21']
const seatTypeArray = ['конический', 'шайбовый']
const electrodesNumberArray = ['конический', 'шайбовый']
const electrodesTypeArray = ['медь', 'платина', 'иридий']

// export const sparkPlugsSchema = yup.object({
//     key_type: yup
//         .mixed()
//         .required('Key Type is required')
//         .oneOf(keyTypeArray, 'Invalid key type'),
//     key_size: yup
//         .mixed()
//         .required('Key Size is required')
//         .oneOf(keySizeArray, 'Invalid key size'),
//     seat_type: yup
//         .mixed()
//         .required('Seat Type is required')
//         .oneOf(seatTypeArray, 'Invalid seat type'),
//     thread_size: yup.number().required('Thread size is required'),
//     thread_length: yup.number().required('Thread length is required'),
//     gap: yup.number().required('Gap is required'),
//     electrodes_number: yup
//         .mixed()
//         .required('Electrodes number is required')
//         .oneOf(electrodesNumberArray, 'Invalid electrodes number'),
//     electrodes_type: yup
//         .mixed()
//         .required('Electrodes type is required')
//         .oneOf(electrodesTypeArray, 'Invalid electrodes type'),
// })

const SparkPlugs = () => {
    const form = useForm<FormValues>({defaultValues: {
            electrode_type: '',
            electrodes_number: '',
            thread_size: 0,
            thread_length: 0,
            gap: 0,
            key_type: '',
            key_size: '',
            seat_type: '',
        }, resolver: yupResolver(sparkPlugsSchema)})

    const {register, formState: {errors}} = form

    return (
        <>
            <div>
                <select {...register('electrode_type')}>
                    <option disabled={true} value="">
                        Select Electrode Type
                    </option>
                    {electrodesTypeArray.map(opt => <option value={opt}>{opt}</option>)}
                </select>
                <p className={styles.pf_error}>{errors.electrode_type?.message}</p>
            </div>
            <div>
                <select {...register('electrodes_number')}>
                    <option disabled={true} value="">
                        Select Electrodes Number
                    </option>
                    {electrodesNumberArray.map(opt => <option value={opt}>{opt}</option>)}
                </select>
                <p className={styles.pf_error}>{errors.electrodes_number?.message}</p>
            </div>
            <div>
                <select {...register('key_type')}>
                    <option disabled={true} value="">
                        Select Key Type
                    </option>
                    {keyTypeArray.map(opt => <option value={opt}>{opt}</option>)}
                </select>
                <p className={styles.pf_error}>{errors.key_type?.message}</p>
            </div>
            <div>
                <select {...register('key_size')}>
                    <option disabled={true} value="">
                        Select Key Size
                    </option>
                    {keySizeArray.map(opt => <option value={opt}>{opt}</option>)}
                </select>
                <p className={styles.pf_error}>
                    {errors.key_size?.message}
                </p>
            </div>
            <div>
                <select {...register('seat_type')}>
                    <option disabled={true} value="">
                        Select Seat Type
                    </option>
                    {seatTypeArray.map(opt => <option value={opt}>{opt}</option>)}
                </select>
                <p className={styles.pf_error}>
                    {errors.seat_type?.message}
                </p>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Thread Size"
                    {...register('thread_size')}
                />
                <p className={styles.pf_error}>{errors.thread_size?.message}</p>
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Thread Length"
                    {...register('thread_length')}
                />
                <p className={styles.pf_error}>
                    {errors.thread_length?.message}
                </p>
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Gap"
                    {...register('gap')}
                />
                <p className={styles.pf_error}>
                    {errors.gap?.message}
                </p>
            </div>
        </>
    );
};

export default SparkPlugs;