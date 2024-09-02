import { useMemo, useState } from "react";
import { useGame } from "../../../hooks/useGame"
import { sendWhiteCards } from "../../../services/socket.service";

export function RoundPlayer() {
    const { round, whiteCards } = useGame();
    const [cardsSelected, setCardsSelected] = useState<string[]>([]);

    const canSend = useMemo(() => cardsSelected.length === (round?.blackCard.answers), [round, cardsSelected]);

    function selectCard(card: string) {
        if (round?.blackCard.answers === 1) {
            setCardsSelected([card]);
            return;
        }

        if (cardsSelected.length >= (round?.blackCard.answers || 0)) {
            alert(`Select exact ${round?.blackCard.answers} card(s)!`)
            return;
        }

        setCardsSelected([...cardsSelected, card])
    }

    function unselectCard(card: string) {
        setCardsSelected(cardsSelected.filter(item => item !== card))
    }

    function send() {
        sendWhiteCards(cardsSelected)
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 overflow-x-auto pt-4">
                {whiteCards?.map((card, i) => (
                    <div key={i}
                        className={`min-w-32 h-48 cursor-pointer p-2 rounded-lg relative
                                    ${cardsSelected.includes(card) ?
                                'bg-yellow-200 bottom-4' :
                                'bg-white'}
                                    text-zinc-800 font-semibold`}
                        onClick={() => cardsSelected.includes(card) ? unselectCard(card) : selectCard(card)}>
                        {card}
                    </div>
                ))}
            </div>

            <button
                className={
                    canSend ?
                        "bg-yellow-400 font-bold text-zinc-800 py-2 rounded border-2 border-yellow-700"
                        : "bg-zinc-400 font-bold text-zinc-600 italic py-2 rounded border-2 border-zinc-700 cursor-not-allowed"}
                onClick={send}
                disabled={!canSend}
            >
                Send
            </button>
        </div>
    )
}