import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@ApiTags('Usuario')
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um usuário' })
  @ApiBody({ type: CreateUsuarioDto })
  @ApiCreatedResponse({ description: 'Usuário criado com sucesso.' })
  @ApiConflictResponse({ description: 'Já existe um usuário com esse email.' })
  @ApiNotFoundResponse({ description: 'Perfil informado não existe.' })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiOkResponse({ description: 'Lista de usuários retornada com sucesso.' })
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'ID do usuário' })
  @ApiOkResponse({ description: 'Usuário encontrado com sucesso.' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usuarioService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário por ID' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'ID do usuário' })
  @ApiBody({ type: UpdateUsuarioDto })
  @ApiOkResponse({ description: 'Usuário atualizado com sucesso.' })
  @ApiNotFoundResponse({ description: 'Usuário ou perfil não encontrado.' })
  @ApiConflictResponse({ description: 'Já existe um usuário com esse email.' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover usuário por ID' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'ID do usuário' })
  @ApiOkResponse({ description: 'Usuário removido com sucesso.' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usuarioService.remove(id);
  }
}
