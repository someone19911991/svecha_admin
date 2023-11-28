import * as yup from 'yup'

type categoryOptions = {
    [key: string]: { name: string }
}

type selectOptions = {
    [key: string]: { name: string; category_id: number }
}

type selectBrandOptions = {
    [key: string]: string
}

// export const backURL = 'http://localhost:5000'
export const backendURL = 'https://www.back.svecha.am'
export const backURL = 'https://www.back.svecha.am/api'

export const brandsArray = [
    'bosch',
    'denso',
    'champion',
    'acdelco',
    'ngk',
    'motorcraft',
    'other'
]
export const keyTypeArray = ['шестигранник', 'многогранник']
export const keySizeArray = ['14', '16', '21']
export const seatTypeArray = ['конический', 'шайбовый']
export const electrodesNumberArray = ['1', '2', '3', '4']
export const electrodesTypeArray = ['медь', 'платина', 'иридий']
export const plugsNumberArray = ['1', '2']
export const contactsNumberArray = ['1', '2', '3', '4']
export const typeArray = ['резиновый', 'фибр']
export const contactTypeArray = ['пружина', 'пружина + резистор']
export const contactNumberArray = ['1', '2', '3']
export const threadSizeArray = ['10', '12', '14']
export const connectionTypeArray = [
    'кругло-квалратный',
    'круглый',
    'квадратный',
]

export const brandsSelect: selectBrandOptions = {
    bosch: 'Bosch',
    champion: 'Champion',
    denso: 'Denso',
    acdelco: 'ACDelco',
    motorcraft: 'Motorcraft',
    ngk: 'NGK',
}

export const categoriesSelect: selectOptions = {
    ignition_coils: { name: 'Ignition Coils', category_id: 1 },
    spark_plugs: { name: 'Spark Plugs', category_id: 2 },
    airbag_cables: { name: 'Airbag Cables', category_id: 3 },
    crankshaft_sensors: { name: 'Crankshaft Sensors', category_id: 4 },
    camshaft_sensors: { name: 'Camshaft Sensors', category_id: 5 },
    ignition_coil_mouthpieces: {
        name: 'Ignition Coil Mouthpieces',
        category_id: 6,
    },
}

const refsSchema = {
    // ref_num: yup.string().required('Reference number is required'),
    ref_num: yup.string(),
    // brand: yup.string().required('Reference Brand is required'),
    brand: yup.string(),
}

const oemsSchema = {
    // oem: yup.string().required('Oem number is required'),
    oem: yup.string(),
    // model: yup.string().required('Oem Model is required'),
    model: yup.string(),
}

const MAX_FILE_SIZE = 1024 * 1024
const validFileExtensions = {
    img: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp', 'jfif'],
}

const imgsSchema = yup
    .array()
    .of(
        yup.object().shape({
            img: yup
                .mixed<FileList>()
                .test('required', 'Img is required', (value) => {
                    return !!value
                })
                .test('is-valid-type', 'Invalid file type', (value) => {
                    if (value && typeof value === 'string') {
                        return true
                    }
                    const type = value?.[0]?.type?.split('/')?.pop()

                    if (type) {
                        return validFileExtensions.img.includes(type)
                    }
                })
                .test('fileSize', 'File size is too large', (value) => {
                    if (value && typeof value === 'string') {
                        return true
                    }
                    return value && value[0].size <= MAX_FILE_SIZE // Maximum file size is 1 MB
                }),
        })
    )
    .min(1, 'Please upload at least one file.')

// @ts-ignore
const productFormSchema = {
    brand: yup
        .mixed()
        .required('Brand is required')
        .oneOf(brandsArray, 'Invalid brand'),
    // otherBrandValue: yup.string().when('brand', {is: 'other', then: yup.string().required('Brand is required'), otherwise: yup.string()}),
    otherBrandValue: yup.string().when('brand', (value, field) => {
        return value[0] === 'other' ? field.required('Brand is required') : field
    }),
    model: yup.string().required('Model is required'),
    price_original: yup.number().required('Price Original is required'),
    price_copy: yup.number().required('Price Copy is required'),
    discount: yup.number().required('Invalid discount value'),
    detail_number: yup.string().required('Detail Number is required'),
    count_original: yup.number().required('Count(original) is required'),
    count_copy: yup.number().required('Count(copy) is required'),
    refs: yup
        .array()
        .of(yup.object().shape(refsSchema)),
        // .required('Must have fields'),
    oems: yup
        .array()
        .of(yup.object().shape(oemsSchema)),
        // .required('Must have fields'),
    imgs: imgsSchema,
}

export const ignitionCoilsSchema = yup.object({
    ...productFormSchema,
    plugs_number: yup
        .mixed()
        .required('Plugs number is required')
        .oneOf(plugsNumberArray, 'Invalid plugs number'),
    contacts_number: yup
        .mixed()
        .required('Contacts number is required')
        .oneOf(contactsNumberArray, 'Invalid contacts number'),
})

export const sparkPlugsSchema = yup.object({
    ...productFormSchema,
    key_type: yup
        .mixed()
        .required('Key Type is required')
        .oneOf(keyTypeArray, 'Invalid key type'),
    key_size: yup
        .mixed()
        .required('Key Size is required')
        .oneOf(keySizeArray, 'Invalid key size'),
    seat_type: yup
        .mixed()
        .required('Seat Type is required')
        .oneOf(seatTypeArray, 'Invalid seat type'),
    thread_size: yup
        .mixed()
        .required('Thread size is required')
        .oneOf(threadSizeArray, 'Invalid Thread Size'),
    thread_length: yup.number().required('Thread length is required'),
    gap: yup.number().required('Gap is required'),
    electrodes_number: yup
        .mixed()
        .required('Electrodes number is required')
        .oneOf(electrodesNumberArray, 'Invalid electrodes number'),
    electrode_type: yup
        .mixed()
        .required('Electrodes type is required')
        .oneOf(electrodesTypeArray, 'Invalid electrodes type'),
})

export const airbagCablesSchema = yup.object({
    ...productFormSchema,
    steering_axle_bore_diameter: yup
        .number()
        .required('Plugs number is required'),
    airbag_plugs_number: yup.number().required('Contacts number is required'),
})

export const ignitionCoilMouthpiecesSchema = yup.object({
    ...productFormSchema,
    wired: yup.number().required('Wired is required'),
    type_: yup
        .mixed()
        .required('Type is required')
        .oneOf(typeArray, 'Invalid Type'),
    contact_type: yup
        .mixed()
        .required('Contact Type is required')
        .oneOf(contactTypeArray, 'Invalid Contact Type'),
})

export const crankshaftCamshaftSensorsSchema = yup.object({
    ...productFormSchema,
    wired: yup.number().required('Wired is required'),
    contact_number: yup
        .mixed()
        .required('Type is required')
        .oneOf(contactNumberArray, 'Invalid Contact Type'),
    connection_type: yup
        .mixed()
        .required('Connection Type is required')
        .oneOf(connectionTypeArray, 'Invalid Connection Type'),
})

export const createModelSchema = yup.object({
    name: yup.string().trim().required('Model Name is required'),
    img: yup
    .mixed<FileList>()
    .test('required', 'Img is required', (value) => {
        return !!value
    })
    .test('is-valid-type', 'Invalid file type', (value) => {
        if (value && typeof value === 'string') {
            return true
        }
        const type = value?.[0]?.type?.split('/')?.pop()

        if (type) {
            return validFileExtensions.img.includes(type)
        }
    })
    .test('fileSize', 'File size is too large', (value) => {
        if (value && typeof value === 'string') {
            return true
        }
        return value && value[0].size <= MAX_FILE_SIZE // Maximum file size is 1 MB
    })
})

export const updateModelSchema = yup.object({
    name: yup.string().trim().required('Model Name is required'),
    img: yup
        .mixed<FileList>()
        .test('is-valid-type', 'Invalid file type', (value) => {
            if(!value){
                return true
            }
            if (value && typeof value === 'string') {
                return true
            }
            const type = value?.[0]?.type?.split('/')?.pop()

            if (type) {
                return validFileExtensions.img.includes(type)
            }
        })
        .test('fileSize', 'File size is too large', (value) => {
            if(!value){
                return true
            }
            if (value && typeof value === 'string') {
                return true
            }
            return value && value[0].size <= MAX_FILE_SIZE // Maximum file size is 1 MB
        })
})

type schemaType<T> = {
    [key: string]: T
}

export const required_schema: schemaType<
    | typeof ignitionCoilsSchema
    | typeof sparkPlugsSchema
    | typeof airbagCablesSchema
    | typeof ignitionCoilMouthpiecesSchema
    | typeof crankshaftCamshaftSensorsSchema
> = {
    ignition_coils: ignitionCoilsSchema,
    spark_plugs: sparkPlugsSchema,
    airbag_cables: airbagCablesSchema,
    ignition_coil_mouthpieces: ignitionCoilMouthpiecesSchema,
    crankshaft_sensors: crankshaftCamshaftSensorsSchema,
    camshaft_sensors: crankshaftCamshaftSensorsSchema,
}

export const categoryObj: categoryOptions = {
    ignition_coils: { name: 'Ignition Coil' },
    ignition_coil_mouthpieces: { name: 'Ignition Coil Mouthpiece' },
    spark_plugs: { name: 'Spark Plug' },
    airbag_cables: { name: 'Airbag Cable' },
    crankshaft_sensors: { name: 'Crankshaft Sensor' },
    camshaft_sensors: { name: 'Camshaft Sensor' },
}


export const months = [
    'January',
    'February',
    'Mart',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

export const categoryNames = ['Spark Plugs', 'Ignition Coils', 'Airbag Cables', 'Crankshaft Sensors', 'Camshaft Sensors', 'Ignition Coil Mouthpieces']
export const categoryLabels = ['spark_plugs', 'ignition_coils', 'airbag_cables', 'crankshaft_sensors', 'camshaft_sensors', 'ignition_coil_mouthpieces']
