import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Injectable()
export class PerfilService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPerfilDto: CreatePerfilDto) {
    try {
      return await this.prisma.profile.create({
        data: {
          name: createPerfilDto.name,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll() {
    return this.prisma.profile.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string | number) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: String(id) },
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    return profile;
  }

  async update(id: string | number, updatePerfilDto: UpdatePerfilDto) {
    await this.findOne(id);

    try {
      return await this.prisma.profile.update({
        where: { id: String(id) },
        data: {
          name: updatePerfilDto.name,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: string | number) {
    await this.findOne(id);

    return this.prisma.profile.delete({
      where: { id: String(id) },
    });
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('Já existe um perfil com esse nome');
      }
    }

    throw error;
  }
}
