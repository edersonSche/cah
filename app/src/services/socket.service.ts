import { io } from 'socket.io-client';
import { useGame } from '../hooks/useGame';

const socket = io(import.meta.env.VITE_SOCKET_URL, { autoConnect: false, });

export function joinGame(name: string) {
    socket.connect();
    socket.emit('joinGame', name)
}
socket.on('playerJoinedGame', (data: string) => {
    const json = JSON.parse(data);
    useGame.setState({ players: json.players });

    //if I'm the joined player, GO to the lobby
    if (json.playerId === socket.id) {
        useGame.setState({ stage: 'lobby', myPlayerId: socket.id });
    }
});

export function exitGame() {
    socket.disconnect();
    useGame.setState({ stage: 'start' });
}
socket.on('playerDisconnected', (data: string) => {
    const json = JSON.parse(data);
    useGame.setState({ players: json.players });
});
socket.on('disconnect', () => {
    useGame.setState({ stage: 'start' });
});

export function startGame() {
    socket.emit('startGame');
}
socket.on('roundStarted', (data: string) => {
    const { blackCard, whiteCards: cards, czar } = JSON.parse(data);

    let whiteCards = useGame.getState().whiteCards || [];
    whiteCards = [...whiteCards, ...cards];

    useGame.setState({
        round: {
            blackCard,
            czar,
            whiteCards: [],
            roundWinner: null,
        },
        whiteCards,
    });

    const { isMyPlayerCzar } = useGame.getState()
    useGame.setState({ stage: isMyPlayerCzar() ? 'roundCzar' : 'roundPlayer' });

});

export function sendWhiteCards(cards: string[]) {
    socket.emit('sendWhiteCards', cards);
    let whiteCards = useGame.getState().whiteCards || [];
    whiteCards = whiteCards?.filter(card => !cards.includes(card));
    useGame.setState({ stage: 'roundResult', whiteCards })
}
socket.on('whiteCardsSended', (data: string) => {
    const { moveId, cards } = JSON.parse(data);
    useGame.getState().addRoundWhiteCards({ moveId, cards, revealed: false });
})
socket.on('czarChooseCards', () => {
    useGame.setState({ stage: 'roundResult' });
});

export function revealCard(moveId: string) {
    socket.emit('revealCard', moveId);
}
socket.on('cardRevealed', (data: string) => {
    const { moveId } = JSON.parse(data);
    useGame.getState().revealWhiteCard(moveId)
});

export function sendRoundWinner(moveId: string) {
    socket.emit('sendRoundWinner', moveId);
}
socket.on('roundWinner', (data: string) => {
    const { roundWinner, players } = JSON.parse(data);
    const { round } = useGame.getState();
    if (round) {
        round.roundWinner = roundWinner;
    }
    useGame.setState({ players, round })
});

socket.on('gameWinner', (data: string) => {
    const { quote } = JSON.parse(data);
    useGame.setState({stage: 'endGame', endGameQuote: quote })

});

export function finishGame(){
    socket.disconnect()
}
