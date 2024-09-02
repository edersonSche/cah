import { create } from "zustand";

export type GameStage = 'start' | 'lobby' | 'roundPlayer' | 'roundCzar' | 'roundResult' | 'endGame';
export type Player = {
    id: string;
    name: string;
    score: number;
}
type BlackCard = {
    description: string;
    answers: number;
}

type WhiteCards = {
    moveId: string;
    cards: string[];
    revealed: boolean;
}

type Round = {
    blackCard: BlackCard;
    czar: Player;
    whiteCards: WhiteCards[],
    roundWinner: Player | null,
}

type GameStorage = {
    stage: GameStage,
    players: Player[],
    myPlayerId: string | null,
    whiteCards: string[] | null,
    round: Round | null,
    endGameQuote: string,

    setStage: (stage: GameStage) => void,
    isMyPlayerCzar: () => boolean,
    getCzar: () => Player | undefined,
    getOrderedPlayers: () => Player[],
    addRoundWhiteCards: (whiteCards: WhiteCards) => void,
    revealWhiteCard: (moveId: string) => void,
    isAllRoundWhiteCardsRevealed: () => boolean,
}

export const useGame = create<GameStorage>()((set, get) => ({
    stage: 'start',
    players: [],
    myPlayerId: null,
    whiteCards: null,
    round: null,
    roundMoves: null,
    endGameQuote: '',

    setStage: (stage: GameStage) => set(() => ({ stage })),
    isMyPlayerCzar() {
        const { round, myPlayerId, players } = get();
        const myPlayer = players.find(player => player.id === myPlayerId);
        return myPlayer?.id === round?.czar.id;
    },
    getCzar() {
        const { round } = get();
        return round?.czar;
    },
    getOrderedPlayers() {
        const {players} = get();
        return players.sort((a, b) => b.score - a.score)
    },
    addRoundWhiteCards: (whiteCards: WhiteCards) => {
        set(() => {
            const { round } = get();
            if (round && !round?.whiteCards){
                round.whiteCards = [];
            }
            round?.whiteCards.push(whiteCards)
            return ({ round })
        })
    },
    revealWhiteCard: (moveId: string) => {
        set(() => {
            const { round } = get();
            if (round){
                const whiteCards = round.whiteCards;
                const index = whiteCards.findIndex(move => move.moveId == moveId) ?? -1;

                if (index >= 0) {
                    round.whiteCards[index].revealed = true;
                }
            }
            return ({ round })
        })
    },

    isAllRoundWhiteCardsRevealed() {
        const {round} = get();
        return round?.whiteCards.every(card => card.revealed) || false
    }
}));