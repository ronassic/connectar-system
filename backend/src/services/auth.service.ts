import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto } from '../dto/user.dto'; // Cuidado com o caminho do DTO, o meu era '../dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    const { password, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    // Adicionando um ID de requisição para facilitar o rastreamento em logs
    const requestId = Math.random().toString(36).substring(2, 8);

    try { // <<<<<<<<<<<<<<<<<<<<<<<< INÍCIO DO TRY BLOCK <<<<<<<<<<<<<<<<<<<<<<<<
      const user = await this.userService.findByEmail(loginDto.email);

      // Log para ver o valor exato de 'user'

      if (!user) { // Usando !user para verificar se é null ou undefined
        // Não lançaremos erro aqui temporariamente, para ver o fluxo completo
        throw new UnauthorizedException('Credenciais inválidas - Usuário não encontrado'); // Mude para UnauthorizedException
      }
      const plainPassword = loginDto.password;
      const trimmedPlainPassword = plainPassword.trim();
      const isPasswordValid = await bcrypt.compare(trimmedPlainPassword, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciais inválidas - Senha incorreta'); // Mude para UnauthorizedException
      }      

      const payload = { email: user.email, sub: user.id, role: user.role };
      const accessToken = this.jwtService.sign(payload);

      // Atualiza o lastLogin
      user.lastLogin = new Date();
      await this.userService.updateLastLogin(user.id);

      return {
        access_token: accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };

    } catch (error: unknown) { // Você pode explicitamente tipar como unknown se não for o padrão
      let errorMessage = 'An unknown error occurred during login.';

      if (error instanceof Error) { // Verifica se 'error' é uma instância de Error
        errorMessage = error.message;
      }
      // Se você sabe que pode vir outras exceções específicas, pode adicionar mais 'instanceof'
      // Ex: if (error instanceof CustomAuthError) { errorMessage = error.customMessage; }

      console.error(`[REQ ID: ${requestId}] ERRO NO LOGIN:`, errorMessage);

      // Você pode logar o erro completo para mais detalhes
      // console.error(`[REQ ID: ${requestId}] ERRO COMPLETO:`, error);

      // Re-lançar uma exceção do NestJS para que o erro seja tratado corretamente
      if (error instanceof UnauthorizedException) {
        throw error; // Re-lança a exceção de autenticação personalizada
      }
      // Para qualquer outro erro inesperado que não seja uma UnauthorizedException já tratada, lance uma nova
      throw new UnauthorizedException(errorMessage); // Usa a mensagem de erro que verificamos
    }
  }

  async validateUser(payload: any) {
    return this.userService.findOne(payload.sub);
  }
}