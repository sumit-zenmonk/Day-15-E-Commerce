export interface AddCartPayloadType {
    product_id: string;
    quantity: number;
}

export interface ProductType {
    is_admin_approved: boolean;
    price: number;
    product_img: string;
    product_name: string;
}

export interface CartItemType {
    uuid: string;
    product_id: string;
    quantity: number;
    product: ProductType;
    user_uuid?: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}


export interface OrderProductType {
    product_id: string;
    quantity: number;
}

export interface OrderType {
    uuid: string;
    products: OrderProductType[];
    total_price: number;
    status: string;
}

export interface UserCommerceState {
    cart: CartItemType[];
    orders: OrderType[];
    loading: boolean;
    error: string | null;
    message: string | null;
}

export interface AddToCartResponse {
    cartProduct: CartItemType;
    message: string;
}