import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/schemas/user.schema';
import { AuthCredentialsDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Method for user signup
  async signup(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;

    // Check if the username already exists
    const existingUser = await this.userModel.findOne({ username }).lean();
    if (existingUser) {
      throw new UnauthorizedException('Username is already taken');
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new this.userModel({
      username,
      password: hashedPassword,
    });

    return user.save();
  }




    // Login method to authenticate user and generate tokens
  async login(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { username, password } = authCredentialsDto;

    // Find the user by username
    const user = await this.userModel.findOne({ username }).lean(); // Use .lean() to get a plain object

    if (user && (await bcrypt.compare(password, user.password))) {
      // Add role to the JWT payload along with username and user ID
      const payload = { username: user.username, sub: user._id, role: user.role };
      const accessToken = this.jwtService.sign(payload);

      // Generate the refresh token with a separate secret and expiration
      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
      });

      // Store the refresh token in the database (optional, if your setup requires it)
      await this.userModel.updateOne({ _id: user._id }, { refreshToken });

      return { accessToken, refreshToken };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  // Method to refresh the access token using a valid refresh token
  async refreshToken(userId: string, refreshToken: string): Promise<{ accessToken: string }> {
    const user = await this.userModel.findById(userId).lean();

    // Check if the provided refresh token matches the stored one
    if (user && user.refreshToken === refreshToken) {
      const payload = { username: user.username, sub: user._id };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // Optional: Method to handle logout by invalidating the refresh token
  async logout(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
  }
}