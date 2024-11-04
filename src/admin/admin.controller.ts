import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';

@Controller('admin')
@UseGuards(RolesGuard) // Apply RolesGuard to this controller
export class AdminController {
  @Get('dashboard')
  @Roles(UserRole.ADMIN) // Only admins can access this endpoint
  getAdminDashboard() {
    return 'Welcome to the admin dashboard!';
  }
}