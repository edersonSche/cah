import { useGame } from "../hooks/useGame";
import { finishGame } from "../services/socket.service";

export function EndGame() {
    const { endGameQuote } = useGame();

    return (
        <div className="flex flex-col gap-4">
            <h1 className="border-2 border-b-4 p-6 rounded-lg font-semibold text-2xl">{endGameQuote}</h1>

            <button
               className="bg-yellow-400 font-bold text-zinc-800 py-2 rounded border-2 border-ins border-yellow-700"
                onClick={finishGame}
            >
                Finish
            </button>
        </div>
    )
}