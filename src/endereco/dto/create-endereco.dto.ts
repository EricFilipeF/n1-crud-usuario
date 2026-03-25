import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateEnderecoDto {
	@ApiProperty({ example: 'Rua das Flores', description: 'Rua/Avenida' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(120)
	street: string;

	@ApiProperty({ example: 123, description: 'Número' })
	@IsInt()
	@Min(1)
	number: number;

	@ApiProperty({ example: 'São Paulo', description: 'Cidade' })
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

	@ApiProperty({
		example: '550e8400-e29b-41d4-a716-446655440000',
		description: 'ID do usuário associado ao endereço',
		format: 'uuid',
	})
	@IsUUID('4')
	@IsNotEmpty()
	userId: string;
}
