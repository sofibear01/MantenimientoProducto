// src/models/Product.ts
export interface Product {
    productId: string;
    productDescription: string;
    categoryProductId: number;
    stock: number;
    price: number;
    haveEcDiscount: string;
    isActive: string;
}
