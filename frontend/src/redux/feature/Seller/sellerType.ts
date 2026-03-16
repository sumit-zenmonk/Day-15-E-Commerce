export interface SellerProductType {
    uuid: string;
    product_name: string;
    stock_quantity: number;
    product_img: string;
    is_admin_approved: boolean;
    created_at: string;
}

export interface SellerProductState {
    products: SellerProductType[];
    loading: boolean;
    error: string | null;
}