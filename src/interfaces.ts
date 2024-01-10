export interface IUser {
    id: number
    email: string
    username: string
}

export interface IAuth {
    accessToken: string
    user: IUser
}

export interface IProduct {
    id: number
    product_id: number
    brand: string
    otherBrandValue: string
    model: string
    price_original: number
    price_copy: number
    detail_number: number
    ref_brand?: string
    category_name: string
    category_id: number
    discount: number
    count_original: number
    count_copy: number
    // refs: [{ ref_num: string; brand: string; master: 0 | 1, product_id?: number, ref_id?: number }]
    // oems: [{ oem: number; model: string; master: 0 | 1, product_id?: number, oem_id?: number }]
    refs: [{ref_num: string, brand: string}]
    oems: [{oem: string, model: string}]
    imgs: [{ img: FileList | string, master?: number }]
    wired?: number
    contact_number?: string
    connection_type?: string
    type_?: string
    contact_type?: string
    plugs_number?: string
    contacts_number?: string
    key_type?: string
    key_size?: string
    seat_type?: string
    thread_size?: string
    thread_length?: number
    gap?: number
    electrodes_number?: string
    electrode_type?: string
    steering_axle_bore_diameter?: number
    airbag_plugs_number?: number
    total_count?: number
}

// Omit<IProductForm, 'product_id' | 'id' | 'category_name' | 'category_id'>
export type IProductForm = {
    brand: string
    otherBrandValue: string
    model: string
    price_original: number | ''
    price_copy: number | ''
    detail_number: number | ''
    ref_brand?: string
    discount: number | ''
    count_original: number | ''
    count_copy: number | ''
    // refs: [{ ref_num: string; brand: string; master: 0 | 1 }]
    // oems: [{ oem: number | ''; model: string; master: 0 | 1 }]
    refs: [{ref_num: string, brand: string}]
    oems: [{oem: string, model: string}]
    imgs: [{ img: FileList | string, master?: number }]
    wired?: number | ''
    contact_number?: string
    connection_type?: string
    type_?: string
    contact_type?: string
    plugs_number?: string
    contacts_number?: string
    key_type?: string
    key_size?: string
    seat_type?: string
    thread_size?: string
    thread_length?: number | ''
    gap?: number | ''
    electrodes_number?: string
    electrode_type?: string
    steering_axle_bore_diameter?: number | '',
    airbag_plugs_number?: number | '',
}

export interface IOrderedProduct{
    product_id: number
    model: string
    product_type: string
    count: number
    phone: string
    product_price: number
    discount: number
    sum: number
    status: string
    created_at: string
}

export interface IPhoneCount{
    phone_count: number
    phone: string
}

export interface IMessage{
    name: string,
    phone: string,
    message: string
    created_at: string
}