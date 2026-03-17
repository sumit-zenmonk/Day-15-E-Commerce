import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength } from "class-validator";

export class CreateAddressDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    street_address: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    apartment_suite?: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    city: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    state_province: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    postal_code: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    country: string;

    @IsBoolean()
    @IsOptional()
    is_default?: boolean;
}
