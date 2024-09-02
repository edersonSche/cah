import { Module } from '@nestjs/common';

import { GameGatewayModule } from './game/game.module';

@Module({
  imports: [GameGatewayModule],
})
export class AppModule {}
