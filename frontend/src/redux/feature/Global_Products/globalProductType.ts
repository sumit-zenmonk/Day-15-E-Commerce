export interface ProductType {
    uuid: string;
    product_name: string;
    stock_quantity: number;
    product_img: string;
    is_admin_approved: boolean;
    created_at: string;
    price: number;
}

export interface GlobalProductState {
    products: ProductType[];
    loading: boolean;
    error: string | null;
}