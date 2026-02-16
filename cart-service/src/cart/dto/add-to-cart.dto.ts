import { IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';

// Add to Cart DTO //
export class AddToCartDto {
    @IsNotEmpty()
    @IsUUID()
    productId: string;

    @IsInt()
    @Min(1)
    quantity: number = 1;
}
