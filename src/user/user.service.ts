import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { compare } from "bcrypt";
import { LoginInput } from "src/auth/dto/login.input";
import { StatusResult } from "src/common/entities/status-result.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { User } from "./entities/user.entity";
import { Role } from "./enums/role.enum";

type Where = FindOptionsWhere<User>;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async findOne(where: Where): Promise<User> {
    return await this.userRepo.findOne({ where });
  }

  async findByLogin(loginInput: LoginInput): Promise<User> {
    const { username, password } = loginInput;

    const user = await this.findOne({ username });

    if (!user) {
      throw new BadRequestException("username is invalid");
    }

    const comparePassword = await compare(password, user.password);

    if (!comparePassword) {
      throw new BadRequestException("password is invalid");
    }

    return user;
  }
  async create(createUserInput: CreateUserInput): Promise<User> {
    const { firstName, lastName, email, password, username, selectedRoles } =
      createUserInput;

    await this.checkIfExists("email", email, "Email already exists");
    await this.checkIfExists("username", username, "Username already exists");

    // Determine user roles
    const roles: Role[] = await this.determineRoles(selectedRoles, email);

    // Create user entity
    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;
    user.roles = roles;

    // Save user to the database
    return this.userRepo.save(user);
  }

  private async checkIfExists(
    field: "email" | "username",
    value: string,
    errorMessage: string
  ): Promise<void> {
    const condition = { [field]: value };
    const userInDb = await this.userRepo.findOne({where:condition});

    if (userInDb) {
      throw new BadRequestException(errorMessage);
    }
  }

  private async determineRoles(
    selectedRoles: Role[],
    email: string
  ): Promise<Role[]> {
    if (email.endsWith("@adityabirla.com")) {
      return [Role.Internal, ...selectedRoles];
    }

    return selectedRoles;
  }

  async update(
    user: User,
    updateUserInput: UpdateUserInput
  ): Promise<StatusResult> {
    const statusResult: StatusResult = {
      message: "edited successfully",
      success: true,
    };
    const { firstName, lastName, password } = updateUserInput;

    await this.userRepo.update(
      { id: user.id },
      { firstName, lastName, password }
    );

    return statusResult;
  }

  async remove(id: string): Promise<StatusResult> {
    const statusResult: StatusResult = {
      success: true,
      message: "user removed successfully",
    };

    await this.userRepo.delete({ id });

    return statusResult;
  }

  async count(): Promise<number> {
    return this.userRepo.count();
  }

  
  // async sendPackageRequest(userId: string, packageId: string): Promise<void> {
  //   // Check if the user and package exist
  //   const user = await this.userRepo.findOne({where:{id:userId}});
  //   const pkg = await this.packageService.findOne(packageId);

  //   if (!user || !pkg) {
  //     throw new Error('User or pkg not found');
  //   }

  //   // Create a request
  //   await this.requestService.createRequest(user, pkg);
  // }

  
}
