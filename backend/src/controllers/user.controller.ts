import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto, FindUsersQueryDto } from '../dto/user.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { AuditService } from '../services/audit.service';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService,
  private readonly auditService: AuditService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully.' })
  findAll(@Query() query: FindUsersQueryDto) { // <-- USA O DTO
    return this.userService.findAll(query); // <-- PASSA O DTO PARA O SERVIÇO
  }

  @Get('inactive')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get inactive users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Inactive users retrieved successfully.' })
  findInactiveUsers(@Query() query: FindUsersQueryDto) { // <-- USA O DTO
    console.log('Query recebida no controller:', query);
    return this.userService.findInactiveUsers(query); // <-- PASSA O DTO PARA O SERVIÇO
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string, @Request() req: any) {

    const user = await this.userService.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    
    // Users can only access their own data unless they are admin
    if (req.user.role !== UserRole.ADMIN && req.user.id !== id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    
    const { password, ...result } = user;
    return result;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    // Bloqueia se não for admin nem o próprio usuário
    if (req.user.role !== UserRole.ADMIN && req.user.id !== id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    // Bloqueia se o admin estiver tentando remover sua própria role de admin
    if (
      req.user.id === id && // está editando a si mesmo
      updateUserDto.role && // está tentando alterar a role
      updateUserDto.role !== UserRole.ADMIN // e quer deixar de ser admin
    ) {
      throw new HttpException(
        'Você não pode remover sua própria role de Admin.',
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.userService.update(id, updateUserDto);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // ? LOG DE AUDITORIA
    this.auditService.log({
      performedBy: req.user.id,
      action: 'UPDATE_USER',
      targetUser: id,
      changes: updateUserDto,
    });

    const { password, ...result } = user;
    return result;
  }


  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(@Param('id') id: string, @Request() req: any) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    
    await this.userService.remove(id);

  // ? LOG DE AUDITORIA
  this.auditService.log({
    performedBy: req.user.id,
    action: 'DELETE_USER',
    targetUser: id,
  });

    return { message: 'User deleted successfully' };
  }
}

