import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags,} from '@nestjs/swagger';
import { PerfilService } from './perfil.service';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@ApiTags('Perfil')
@Controller('perfil')
export class PerfilController {
  constructor(private readonly perfilService: PerfilService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um perfil' })
  @ApiBody({ type: CreatePerfilDto })
  @ApiCreatedResponse({ description: 'Perfil criado com sucesso.' })
  @ApiConflictResponse({ description: 'Já existe um perfil com esse nome.' })
  create(@Body() createPerfilDto: CreatePerfilDto) {
    return this.perfilService.create(createPerfilDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os perfis' })
  @ApiOkResponse({ description: 'Lista de perfis retornada com sucesso.' })
  findAll() {
    return this.perfilService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar perfil por ID' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'ID do perfil' })
  @ApiOkResponse({ description: 'Perfil encontrado com sucesso.' })
  @ApiNotFoundResponse({ description: 'Perfil não encontrado.' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.perfilService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar perfil por ID' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'ID do perfil' })
  @ApiBody({ type: UpdatePerfilDto })
  @ApiOkResponse({ description: 'Perfil atualizado com sucesso.' })
  @ApiNotFoundResponse({ description: 'Perfil não encontrado.' })
  @ApiConflictResponse({ description: 'Já existe um perfil com esse nome.' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePerfilDto: UpdatePerfilDto,
  ) {
    return this.perfilService.update(id, updatePerfilDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover perfil por ID' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'ID do perfil' })
  @ApiOkResponse({ description: 'Perfil removido com sucesso.' })
  @ApiNotFoundResponse({ description: 'Perfil não encontrado.' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.perfilService.remove(id);
  }
}
