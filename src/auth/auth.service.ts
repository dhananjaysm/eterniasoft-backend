import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { LoginInput } from "./dto/login.input";
import { RegisterInput } from "./dto/register.input";
import { JwtPayload } from "./jwt/jwt.payload";
import { compare } from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  private async _signToken(payload: JwtPayload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  private async _comparePassword(data: string, hash: string): Promise<boolean> {
    try {
      return await compare(data, hash);
    } catch (error) {
      return false;
    }
  }

  async register(registerInput: RegisterInput) {
    const { firstName, lastName, email, username, password, selectedRoles } =
      registerInput;

    const newUser = await this.userService.create({
      firstName,
      lastName,
      email,
      username,
      password,
      selectedRoles,
    });

    const payload: JwtPayload = {
      roles: newUser.roles,
      userId: newUser.id,
      username: newUser.username,
    };

    return {
      access_token: await this._signToken(payload),
      role: newUser.roles,
    };
  }

  async login(loginInput: LoginInput) {
    const user = await this.userService.findByLogin(loginInput);

    const payload: JwtPayload = {
      roles: user.roles,
      userId: user.id,
      username: user.username,
    };

    return { access_token: await this._signToken(payload), role: user.roles };
  }

  async validateUser({ userId }: JwtPayload) {
    const user = await this.userService.findOne({ id: userId });

    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }

    return user;
  }
}
