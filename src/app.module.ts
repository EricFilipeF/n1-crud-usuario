import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PerfilModule } from './perfil/perfil.module';
import { UsuarioModule } from './usuario/usuario.module';
import { EnderecoModule } from './endereco/endereco.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true }), PerfilModule, UsuarioModule, EnderecoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
