import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, QueryFailedError, IsNull } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError && (error as any).code === '23505') {
        throw new ConflictException('E-mail já registrado.');
      }
      throw new InternalServerErrorException('Erro ao criar usuário.');
    }
  }

  async findAll(role?: UserRole, sortBy?: string, order?: 'ASC' | 'DESC'): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder('user');
    
    if (role) {
      query.where('user.role = :role', { role });
    }

    if (sortBy && order) {
      query.orderBy(`user.${sortBy}`, order);
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<User | null> {
    
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    const requestId = Math.random().toString(36).substring(2, 8); // Adiciona um ID único para esta chamada
    console.log(`[REQ ID: ${requestId}] entrou aqui 3: Recebido email para busca: "${email}"`);

    try { // <<<<<<<<<<<<<<<<<<<<<<<< INÍCIO DO TRY BLOCK <<<<<<<<<<<<<<<<<<<<<<<<
      const user = await this.userRepository.findOne({ where: { email } });

      // Loga o objeto exato retornado por findOne, mesmo se for null/undefined
      console.log(`[REQ ID: ${requestId}] DEBUG findByEmail: Resultado da query findOne:`, user);

      if (user) {
        console.log(`[REQ ID: ${requestId}] DEBUG findByEmail: Usuário encontrado para o email: "${user.email}"`);
      } else {
        console.log(`[REQ ID: ${requestId}] DEBUG findByEmail: Usuário NÃO encontrado para o email: "${email}"`);
      }

      return user;

    } catch (error: unknown) { // <<<<<<<<<<<<<<<<<<<<<<<< INÍCIO DO CATCH BLOCK <<<<<<<<<<<<<<<<<<<<<<<<
      let errorMessage = `Ocorreu um erro em findByEmail para o email: "${email}"`;
      if (error instanceof Error) {
        errorMessage += ` - ${error.message}`;
      }      
      // Loga o objeto de erro completo para mais detalhes
      console.error(`[REQ ID: ${requestId}] ERRO COMPLETO em findByEmail:`, error);

      // Re-lançar uma exceção do NestJS, talvez um InternalServerErrorException, ou apenas o erro original
      throw new InternalServerErrorException('Erro interno ao buscar usuário por e-mail.');
      // OU: throw error; // Re-lança o erro original, que será capturado pelo try/catch no AuthService
    } // <<<<<<<<<<<<<<<<<<<<<<<< FIM DO CATCH BLOCK <<<<<<<<<<<<<<<<<<<<<<<<
  }

  async updateLastLogin(userId: string): Promise<void> {
    try {
      await this.userRepository.update(userId, { lastLogin: new Date() });
      console.log(`DEBUG UserService: lastLogin atualizado para o usuário ID: ${userId}`);
    } catch (error) {
      console.error(`ERRO ao atualizar lastLogin para o usuário ID: ${userId}`, error);
      throw new InternalServerErrorException('Erro ao atualizar data de último login.');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }


  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }



  async findInactiveUsers(): Promise<User[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.userRepository.find({
      where: [
        { lastLogin: IsNull() },
        { lastLogin: LessThan(thirtyDaysAgo) },
      ],
      order: { lastLogin: 'ASC' },
    });
  }


  
}

