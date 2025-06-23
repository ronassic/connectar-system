import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const datalogin = new Date();
      const createUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.USER,        
        lastlogin: datalogin,
        createdAt: datalogin
      };

      const user = { id: '1', ...createUserDto };
      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockResolvedValue(user);

      const result = await service.create(createUserDto);
      expect(result).toEqual(user);
      expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        name: createUserDto.name,
        email: createUserDto.email,
        role: createUserDto.role,
        lastlogin: createUserDto.lastlogin,
      }));
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: '1', name: 'User 1', email: 'user1@example.com', role: UserRole.USER },
        { id: '2', name: 'User 2', email: 'user2@example.com', role: UserRole.ADMIN },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(users),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: '1', name: 'Test User', email: 'test@example.com' };
      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne('1');
      expect(result).toEqual(user);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});

