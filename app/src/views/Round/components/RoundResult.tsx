import { useState } from "react";
import { useGame } from "../../../hooks/useGame"
import { revealCard, sendRoundWinner } from "../../../services/socket.service";

export function RoundResult() {
    const { round, isMyPlayerCzar, isAllRoundWhiteCardsRevealed } = useGame();
    const [cardSelected, setCardSelected] = useState('');

    function handleCardClick(moveId: string) {
        setCardSelected(moveId);
        revealCard(moveId);
    }

    return (
        <>
            {!round?.roundWinner &&
                <>
                    <div className="flex flex-col gap-2">
                        {round?.whiteCards?.filter(move => isMyPlayerCzar() ? true : move.revealed).map(move => (
                            <div
                                key={move.moveId}
                                onClick={() => isMyPlayerCzar() ? handleCardClick(move.moveId) : null}
                                className={`py-3 px-2 rounded-lg relative                            
                            ${isMyPlayerCzar() ? 'cursor-pointer' : ''}
                            ${cardSelected === move.moveId ?
                                        'bg-yellow-200' :
                                        'bg-white'}
                            ${move.revealed ?
                                        'bg-white text-zinc-800 font-semibold' :
                                        'bg-zinc-200 text-zinc-500 italic'}
                        `}
                            >
                                {move.revealed
                                    ? move.cards.join(' / ')
                                    : isMyPlayerCzar()
                                        ? 'Click to reveal the card...'
                                        : ''
                                }
                            </div>
                        ))}
                    </div>
                    {isMyPlayerCzar() &&
                        <button
                            className={
                                isAllRoundWhiteCardsRevealed() && cardSelected ?
                                    "bg-yellow-400 font-bold text-zinc-800 py-2 rounded border-2 border-yellow-700 cursor-pointer"
                                    : "bg-zinc-400 font-bold text-zinc-600 italic py-2 rounded border-2 border-zinc-700 cursor-not-allowed"}
                            onClick={() => sendRoundWinner(cardSelected)}
                            disabled={!isAllRoundWhiteCardsRevealed() || !cardSelected}
                        >
                            Send
                        </button>
                    }
                    {!isMyPlayerCzar() &&
                        <div className='italic text-center text-xl py-2 rounded animate-pulse'>
                            Czar's thinking ...
                        </div>
                    }
                </>
            }

            {round?.roundWinner && (
                <div className="text-center font-semibold text-2xl animate-bounce py-8">
                    🎉 {round.roundWinner.name.toUpperCase()} WON!
                </div>
            )}
        </>
    )
}