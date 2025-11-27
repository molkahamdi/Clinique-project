import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length, Matches, IsOptional } from "class-validator"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string
    
    @IsString()
    @IsNotEmpty()
    lastName: string
    
    @IsEmail()
    email: string
    
    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9]{8}$/, { message: 'Le numéro de téléphone doit contenir exactement 8 chiffres' })
    phone: string;
    
    @IsString()
    @IsNotEmpty()
    @Length(6, 20)
    password: string

    @IsString()
    @IsOptional()
    speciality?: string;
}