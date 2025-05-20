import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ProblemModule } from '@sanurb/nestia-nx-template/nest/problem'

@Module({
  imports: [ProblemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
