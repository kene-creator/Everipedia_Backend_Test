import { Module } from '@nestjs/common';
import { PinGraphqlResolver } from './pinataFile.resolver';
import { PinataService } from './pinataFile.service';

@Module({
    providers: [PinGraphqlResolver, PinataService],
})
export class PinataFileModule {}
