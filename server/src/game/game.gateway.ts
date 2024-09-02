import {
  WebSocketGateway,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Game } from './game';
import { getEndGameQuote } from './data/endGameQuotes';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  private game: Game;

  constructor() {
    this.game = new Game();
  }

  handleConnection(socket: any) {
    console.log(`Client connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);

    //if client already joined the game, notify everybody
    const player = this.game.findPlayerById(socket.id);
    if (player) {
      this.game.removePlayer(socket.id);
      this.game.emitToAll('playerDisconnected', {
        players: this.game.players,
      });

      //not enough players -> disconnect all
      if (this.game.players.length <= 2) {
        this.game.disconnectAll();
        this.game = null;
        delete this.game;
        this.game = new Game();
      }
    }
  }

  @SubscribeMessage('joinGame')
  handleJoinGame(socket: Socket, name: string) {
    //if game aready started, ban new players
    if (this.game.isGameStarted) {
      socket.disconnect();
      return;
    }

    //verify if name aready exists
    const player = this.game.players.find(
      (item) => item.name.toLowerCase() === name.toLowerCase(),
    );
    if (!player) {
      this.game.addPlayer(socket, name);
      this.game.emitToAll('playerJoinedGame', {
        playerId: socket.id,
        players: this.game.players,
      });
      return;
    }

    socket.disconnect();
  }

  private startRound() {
    const { whiteCards, ...round } = this.game.startRound();
    whiteCards.forEach((item) =>
      this.game.emitToPlayer(item.playerId, 'roundStarted', {
        ...round,
        whiteCards: item.cards,
      }),
    );
  }

  @SubscribeMessage('startGame')
  handleStartGame() {
    this.game.startGame();
    this.startRound();
  }

  @SubscribeMessage('sendWhiteCards')
  handleSendWhiteCards(socket: Socket, cards: string[]) {
    const move = this.game.addRoundWhiteCards(socket.id, cards);
    this.game.emitToAll('whiteCardsSended', move);

    if (this.game.isAllRoundPlayersMoved) {
      this.game.emitToAll('czarChooseCards');
    }
  }

  @SubscribeMessage('revealCard')
  handleRevealCard(_: Socket, moveId: string) {
    this.game.emitToAll('cardRevealed', { moveId });
  }

  @SubscribeMessage('sendRoundWinner')
  handleSendRoundWinner(_: Socket, moveId: string) {
    const player = this.game.setRoundWinnerByMoveId(moveId);

    if (player.score === 7) {
      const quote = getEndGameQuote(player.name);
      this.game.emitToAll('gameWinner', { gameWinner: player, quote });
      return;
    }

    this.game.emitToAll('roundWinner', {
      roundWinner: player,
      players: this.game.players,
    });

    setTimeout(() => this.startRound(), 5000);
  }
}
