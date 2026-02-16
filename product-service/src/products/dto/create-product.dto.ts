import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

// Create Product DTO //
export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsUrl()
    image: string;
}
