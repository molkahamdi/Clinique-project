import { IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateInvoiceDto {
  @Type(() => Number)
  @IsNumber()
  consultationFee: number;

  @Type(() => Number)
  @IsNumber()
  tax: number;

  @Type(() => Number)
  @IsNumber()
  totalFinal: number;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
