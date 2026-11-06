import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserIdService } from './user-id.service';
import { CreateUserIdDto } from './create-user-id.dto';
@Controller('user-id')
export class UserIdController {
  constructor(private readonly service: UserIdService) {}

  @Post()
  @ApiOperation({ summary: '根据 id1 + id2 获取或创建 userID' })
  @ApiResponse({ status: 201, description: '返回 userID' })
  @ApiResponse({ status: 400, description: '参数缺失或格式错误' })
  async findOrCreate(@Body() dto: CreateUserIdDto): Promise<{ userID: string }> {
    const userID = await this.service.findOrCreate(dto.id1, dto.id2);
    return { userID };
  }
}