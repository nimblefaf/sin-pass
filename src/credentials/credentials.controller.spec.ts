import { Test, TestingModule } from '@nestjs/testing';
import { CredentialsController } from './credentials.controller';
import { Roles } from '../auth/roles.decorator';
import { UserRole, User } from '../users/users.entity';
import { AccessService } from '../access/access.service';
import { Credential } from './credential.entity/credential.entity';

@Roles(UserRole.Admin)
@Post(':id/access/:userId')
grantAccess(@Request() req, @Param('id') credentialId: string, @Param('userId') userId: string) {
  return this.service.grantAccessToUser(req.user, credentialId, userId);
}

// describe('CredentialsController', () => {
//   let controller: CredentialsController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [CredentialsController],
//     }).compile();

//     controller = module.get<CredentialsController>(CredentialsController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });
