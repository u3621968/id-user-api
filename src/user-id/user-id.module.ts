import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserId } from './user-id.entity';
import { UserIdService } from './user-id.service';
import { UserIdController } from './user-id.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserId])],
  controllers: [UserIdController],
  providers: [UserIdService],
})
export class UserIdModule {}