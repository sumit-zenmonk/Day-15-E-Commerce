export interface Product {
    uuid: string;
    product_name: string;
    stock_quantity: number;
    product_img: string;
    is_admin_approved: boolean;
    created_at: string;
}

export interface GlobalProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
}