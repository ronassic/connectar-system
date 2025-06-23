import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, QueryFailedError, IsNull, FindManyOptions } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto, FindUsersQueryDto, UpdateUserDto } from '../dto/user.dto';
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

  async findAll(query: FindUsersQueryDto = {}): Promise<User[]> {
    const { role, sortBy, order } = query;

    const findOptions: FindManyOptions<User> = {
      // Define a condição 'where' baseada no filtro de 'role', se existir
      where: role ? { role } : {},
      
      // Define a ordenação baseada nos parâmetros, ou usa um padrão
      order: sortBy ? { [sortBy]: order || 'ASC' } : { createdAt: 'DESC' },
    };

    return this.userRepository.find(findOptions);
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

  async countAdmins(): Promise<number> {
    return this.userRepository.count({ where: { role: UserRole.ADMIN } });
  }

  // Em backend/src/services/user.service.ts

async findInactiveUsers(query: FindUsersQueryDto): Promise<User[]> {
  const { role, sortBy, order } = query;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // 1. Cria um objeto de condição base que inclui o filtro de 'role', se ele existir.
  // Se 'role' for 'admin', baseWhereConditions será { role: 'admin' }.
  // Se 'role' for undefined, será {}.
  const baseWhereConditions = role ? { role } : {};

  // 2. Monta as opções de busca para o TypeORM
  const findOptions: FindManyOptions<User> = {
    // A cláusula 'where' é um array, o que significa que as condições são unidas por 'OR'
    where: [
      // CONDIÇÃO 1:
      // Encontre usuários onde (o último login é NULO E atende às condições base)
      // Ex: { lastLogin: IsNull(), role: 'admin' }
      { lastLogin: IsNull(), ...baseWhereConditions },

      // OU

      // CONDIÇÃO 2:
      // Encontre usuários onde (o último login é mais antigo que 30 dias E atende às condições base)
      // Ex: { lastLogin: LessThan(thirtyDaysAgo), role: 'admin' }
      { lastLogin: LessThan(thirtyDaysAgo), ...baseWhereConditions },
    ],

    // A ordenação continua dinâmica como já tínhamos feito
    order: sortBy ? { [sortBy]: order || 'ASC' } : { lastLogin: 'ASC' },
  };

  // 3. Executa a busca com as opções montadas dinamicamente
  return this.userRepository.find(findOptions);
}
  
}

