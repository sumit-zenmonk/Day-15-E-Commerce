export interface ProductFormType {
    product_name: string;
    stock_quantity: number;
    product_img: string;
    price: number;
}

export interface UpdateProductFormType {
    product_name: string;
    stock_quantity: number;
    price: number;
}