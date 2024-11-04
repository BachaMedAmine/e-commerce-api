import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Endpoint for user signup
  @Post('/signup')
  async signup(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signup(authCredentialsDto);
  }

  // Endpoint for user login
  @Post('/login')
  async login(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.login(authCredentialsDto);
  }

  // Endpoint to refresh the access token using the refresh token
  @Post('/refresh')
  async refreshToken(@Body() body: { userId: string; refreshToken: string }) {
    const { userId, refreshToken } = body;
    return this.authService.refreshToken(userId, refreshToken);
  }

  // Endpoint to log out by invalidating the refresh token
  @Post('/logout')
  async logout(@Body() body: { userId: string }) {
    return this.authService.logout(body.userId);
  }
}