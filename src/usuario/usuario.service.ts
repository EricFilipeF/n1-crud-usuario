import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    await this.ensureProfileExists(createUsuarioDto.profileId);
    const addressData = this.extractAddressData(createUsuarioDto);

    try {
      return await this.prisma.user.create({
        data: {
          email: createUsuarioDto.email,
          password: createUsuarioDto.password,
          name: createUsuarioDto.name,
          profileId: createUsuarioDto.profileId,
          address: addressData
            ? {
                create: addressData,
              }
            : undefined,
        },
        select: this.userSelect,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: this.userSelect,
    });
  }

  async findOne(id: string | number) {
    const userId = this.normalizeUuidId(id);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: this.userSelect,
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: string | number, updateUsuarioDto: UpdateUsuarioDto) {
    const userId = this.normalizeUuidId(id);
    await this.findOne(userId);
    const addressData = this.extractAddressData(updateUsuarioDto);

    if (updateUsuarioDto.profileId) {
      await this.ensureProfileExists(updateUsuarioDto.profileId);
    }

    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          email: updateUsuarioDto.email,
          password: updateUsuarioDto.password,
          name: updateUsuarioDto.name,
          profileId: updateUsuarioDto.profileId,
          address: addressData
            ? {
                upsert: {
                  create: addressData,
                  update: addressData,
                },
              }
            : undefined,
        },
        select: this.userSelect,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: string | number) {
    const userId = this.normalizeUuidId(id);
    await this.findOne(userId);

    return this.prisma.user.delete({
      where: { id: userId },
      select: this.userSelect,
    });
  }

  private readonly userSelect = {
    id: true,
    email: true,
    name: true,
    profileId: true,
    createdAt: true,
    updatedAt: true,
    profile: true,
    address: true,
  } satisfies Prisma.UserSelect;

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

  private async ensureProfileExists(profileId: string): Promise<void> {
    const profile = await this.prisma.profile.findUnique({ where: { id: profileId } });
    if (!profile) {
      throw new NotFoundException('Perfil informado não existe');
    }
  }

  private extractAddressData(dto: CreateUsuarioDto | UpdateUsuarioDto):
    | {
        street: string;
        number: number;
        city: string;
        state: string;
        zipCode: string;
      }
    | undefined {
    const hasAddress = dto.address !== undefined;
    const hasAdress = dto.adress !== undefined;

    if (hasAddress && hasAdress) {
      throw new BadRequestException(
        "Envie apenas um campo de endereço: 'address' ou 'adress'.",
      );
    }

    const payload = dto.address ?? dto.adress;
    if (!payload) {
      return undefined;
    }

    return {
      street: payload.street,
      number: payload.number,
      city: payload.city,
      state: payload.state,
      zipCode: payload.zipCode,
    };
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('Já existe um usuário com esse email');
      }
    }

    throw error;
  }
}
