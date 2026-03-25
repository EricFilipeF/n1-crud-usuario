import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';

@Injectable()
export class EnderecoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEnderecoDto: CreateEnderecoDto) {
    await this.ensureUserExists(createEnderecoDto.userId);

    try {
      return await this.prisma.address.create({
        data: {
          street: createEnderecoDto.street,
          number: createEnderecoDto.number,
          city: createEnderecoDto.city,
          state: createEnderecoDto.state,
          zipCode: createEnderecoDto.zipCode,
          userId: createEnderecoDto.userId,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll() {
    return this.prisma.address.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
  }

  async findOne(id: string | number) {
    const addressId = this.normalizeUuidId(id);
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
      include: { user: true },
    });

    if (!address) {
      throw new NotFoundException('Endereço não encontrado');
    }

    return address;
  }

  async update(id: string | number, updateEnderecoDto: UpdateEnderecoDto) {
    const addressId = this.normalizeUuidId(id);
    await this.findOne(addressId);

    if (updateEnderecoDto.userId) {
      await this.ensureUserExists(updateEnderecoDto.userId);
    }

    try {
      return await this.prisma.address.update({
        where: { id: addressId },
        data: {
          street: updateEnderecoDto.street,
          number: updateEnderecoDto.number,
          city: updateEnderecoDto.city,
          state: updateEnderecoDto.state,
          zipCode: updateEnderecoDto.zipCode,
          userId: updateEnderecoDto.userId,
        },
        include: { user: true },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: string | number) {
    const addressId = this.normalizeUuidId(id);
    await this.findOne(addressId);

    return this.prisma.address.delete({
      where: { id: addressId },
      include: { user: true },
    });
  }

  private normalizeUuidId(id: string | number): string {
    if (typeof id === 'number' && Number.isNaN(id)) {
      throw new BadRequestException('ID inválido. Informe um UUID.');
    }

    const parsedId = String(id);
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(parsedId)) {
      throw new BadRequestException('ID inválido. Informe um UUID.');
    }

    return parsedId;
  }

  private async ensureUserExists(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuário informado não existe');
    }
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('Este usuário já possui um endereço cadastrado');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Endereço não encontrado');
      }
    }

    throw error;
  }
}
