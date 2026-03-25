import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, } from '@nestjs/common';
import {ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation,
  ApiParam, ApiTags} from '@nestjs/swagger';
import { EnderecoService } from './endereco.service';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';

@ApiTags('Endereco')
@Controller('endereco')
export class EnderecoController {
  constructor(private readonly enderecoService: EnderecoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um endereço' })
  @ApiBody({ type: CreateEnderecoDto })
  @ApiCreatedResponse({ description: 'Endereço criado com sucesso.' })
  @ApiNotFoundResponse({ description: 'Usuário informado não existe.' })
  @ApiConflictResponse({ description: 'Usuário já possui endereço cadastrado.' })
  create(@Body() createEnderecoDto: CreateEnderecoDto) {
    return this.enderecoService.create(createEnderecoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os endereços' })
  @ApiOkResponse({ description: 'Lista de endereços retornada com sucesso.' })
  findAll() {
    return this.enderecoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar endereço por ID' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'ID do endereço' })
  @ApiOkResponse({ description: 'Endereço encontrado com sucesso.' })
  @ApiNotFoundResponse({ description: 'Endereço não encontrado.' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.enderecoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar endereço por ID' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'ID do endereço' })
  @ApiBody({ type: UpdateEnderecoDto })
  @ApiOkResponse({ description: 'Endereço atualizado com sucesso.' })
  @ApiNotFoundResponse({ description: 'Endereço ou usuário não encontrado.' })
  @ApiConflictResponse({ description: 'Usuário já possui endereço cadastrado.' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateEnderecoDto: UpdateEnderecoDto,
  ) {
    return this.enderecoService.update(id, updateEnderecoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover endereço por ID' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'ID do endereço' })
  @ApiOkResponse({ description: 'Endereço removido com sucesso.' })
  @ApiNotFoundResponse({ description: 'Endereço não encontrado.' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.enderecoService.remove(id);
  }
}
