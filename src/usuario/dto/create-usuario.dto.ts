import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsEmail,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
	Min,
	MinLength,
	ValidateNested,
} from 'class-validator';

class CreateUsuarioAddressDto {
	@ApiProperty({ example: 'Rua das Flores', description: 'Rua/Avenida' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(120)
	street: string;

	@ApiProperty({ example: 123, description: 'Número' })
	@IsInt()
	@Min(1)
	number: number;

	@ApiProperty({ example: 'Sao Paulo', description: 'Cidade' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(80)
	city: string;

	@ApiProperty({ example: 'SP', description: 'Estado' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(2)
	state: string;

	@ApiProperty({ example: '01001-000', description: 'CEP' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(9)
	zipCode: string;
}

export class CreateUsuarioDto {
	@ApiProperty({ example: 'usuario@email.com', description: 'Email do usuário (único)' })
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ example: '123456', description: 'Senha do usuário' })
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(100)
	password: string;

	@ApiProperty({ example: 'João Silva', description: 'Nome completo do usuário' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	name: string;

	@ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID do perfil associado ao usuário', format: 'uuid' })
	@IsUUID('4')
	@IsNotEmpty()
	profileId: string;

	@ApiPropertyOptional({
		description: 'Endereco opcional do usuario',
		type: CreateUsuarioAddressDto,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateUsuarioAddressDto)
	address?: CreateUsuarioAddressDto;

	@ApiPropertyOptional({
		description: "Alias legado para 'address'",
		type: CreateUsuarioAddressDto,
		deprecated: true,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateUsuarioAddressDto)
	adress?: CreateUsuarioAddressDto;

}
