// Cart Response DTO //
export class CartResponseDto {
    items: CartItemDto[];
    totalItems: number;
    totalPrice: number;
}

// Cart Item DTO //
export class CartItemDto {
    id: string;
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
    };
    quantity: number;
}
