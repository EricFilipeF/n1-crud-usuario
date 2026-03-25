import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePerfilDto {

	@ApiProperty({ example: 'ADMIN', description: 'Nome do perfil (ex: ADMIN, USER)' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	name: string;
}
