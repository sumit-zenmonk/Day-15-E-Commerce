export interface SellerProductType {
    uuid: string;
    product_name: string;
    stock_quantity: number;
    product_img: string;
    is_admin_approved: boolean;
    price:number;
    created_at: string;
}

export interface SellerProductState {
    products: SellerProductType[];
    orders: OrderType[];
    loading: boolean;
    error: string | null;
}

export interface UpdateSellerProductPayload {
    product_id: string;
    product_name?: string;
    stock_quantity?: number;
    product_img?: string;
    price?: number;
}


export interface ProductType {
    is_admin_approved: boolean;
    price: number;
    product_img: string;
    product_name: string;
    uuid: string;
}

export interface OrderUserType {
    uuid: string;
    username: string;
    email: string;
}

export interface OrderItemType {
    uuid: string;
    price: number;
    quantity: number;
    product: ProductType;
}

export interface OrderType {
    uuid: string;
    total_price: number;
    address: string;
    order_status: string;
    order_stage: string;
    items: OrderItemType[];
    user: OrderUserType;
    created_at: string;
}