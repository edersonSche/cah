import { Socket } from 'socket.io';
import { BlackCard, blackCards } from './data/blackCards';
import { whiteCards } from './data/whiteCards';
import { randomUUID } from 'crypto';

type Player = {
  id: string;
  name: string;
  score: number;
};
type InnerPlayer = Player & { socket: Socket };

type Round = {
  blackCard: BlackCard;
  czar: Player;
  whiteCards?: {
    playerId: string;
    moveId: string;
    cards: string[];
  }[];
};

export class Game {
  private started: boolean;
  private innerPlayers: InnerPlayer[];
  private blackCards = blackCards;
  private whiteCards = whiteCards;
  private round: Round | undefined;

  constructor() {
    this.started = false;
    this.innerPlayers = [];
    this.round = undefined;
  }

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }

    return array;
  }

  get players(): Player[] {
    return this.innerPlayers.map((player) => {
      return { ...player, socket: undefined };
    });
  }

  get isGameStarted() {
    return this.started;
  }

  get isAllRoundPlayersMoved() {
    const roundPlayers = this.players
      .filter((player) => player.id !== this.round.czar.id)
      .map((player) => player.id);
    const playersMoved = this.round.whiteCards.map((move) => move.playerId);

    return roundPlayers.every((player) => playersMoved.includes(player));
  }

  emitToAll(ev: string, data?: any) {
    const stringData = JSON.stringify(data);
    this.innerPlayers.forEach((player) => player.socket.emit(ev, stringData));
  }

  emitToPlayer(id: string, ev: string, data?: any) {
    const player = this.innerPlayers.find((player) => player.id === id);
    if (player) {
      const stringData = JSON.stringify(data);
      player.socket.emit(ev, stringData);
    }
  }

  disconnectAll() {
    this.innerPlayers.forEach((player) => {
      player.socket.disconnect();
    });
  }

  findPlayerById(id: string) {
    return this.players.find((player) => player.id === id);
  }

  addPlayer(socket: Socket, name: string) {
    this.innerPlayers.push({
      socket,
      id: socket.id,
      name,
      score: 0,
    });
  }

  removePlayer(id: string) {
    this.innerPlayers = this.innerPlayers.filter((player) => player.id !== id);
  }

  startGame() {
    this.innerPlayers = this.shuffleArray(this.innerPlayers);
    this.blackCards = this.shuffleArray(blackCards);
    this.whiteCards = this.shuffleArray(whiteCards);

    this.started = true;
  }

  startRound() {
    const whiteCards = this.players.map((player) => {
      let count = 0;
      if (!this.round) {
        count = 5;
      } else if (player.id !== this.round.czar.id) {
        count = this.round.blackCard.answers;
      }
      const cards = this.whiteCards.splice(0, count);

      return { playerId: player.id, cards };
    });

    const blackCard = this.blackCards.shift();

    let czar = this.players[0];
    if (this.round) {
      const index = this.players.findIndex(
        (player) => player.id === this.round.czar.id,
      );
      czar =
        index === this.players.length - 1
          ? this.players[0]
          : this.players[index + 1];
    }

    this.round = {
      blackCard,
      czar,
    };

    return { ...this.round, whiteCards };
  }

  addRoundWhiteCards(playerId: string, cards: string[]) {
    if (!this.round.whiteCards) {
      this.round.whiteCards = [];
    }
    const moveId = randomUUID();
    this.round.whiteCards.push({ playerId, moveId, cards });

    return {
      moveId,
      cards,
    };
  }

  setRoundWinnerByMoveId(moveId: string) {
    const move = this.round.whiteCards.find((card) => card.moveId === moveId);

    const index =
      this.players.findIndex((player) => player.id === move.playerId) ?? -1;
    this.innerPlayers[index].score += 1;

    return move && this.findPlayerById(move.playerId);
  }
}
