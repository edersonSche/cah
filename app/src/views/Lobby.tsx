import { useMemo } from "react";
import { useGame } from "../hooks/useGame";
import { exitGame, startGame } from "../services/socket.service";

export function Lobby() {
    const game = useGame();
    const countPlayer = useMemo(() => game.players.length, [game.players]);
    const enabledStart = useMemo(() => game.players.length >= 3, [game.players]);

    return (
        <div className="h-full flex flex-col gap-6">
            <h1 className="text-3xl text-center">Waiting for players</h1>

            <div className="bg-zinc-400 overflow-y-auto h-full">
                <ul className="text-zinc-700 p-2 flex flex-col gap-2">
                    {game.players.map((player, i) => (
                        <li className={`p-1 ${player.id === game.myPlayerId ? 'bg-yellow-300' : 'bg-zinc-300 '}`}
                            key={i}>
                            {player.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="text-sm text-right -mt-5 font-extrabold">{countPlayer} players</div>

            <div className="flex flex-col gap-2">
                <button
                    className={
                        enabledStart ?
                            "bg-yellow-400 font-bold text-zinc-800 py-2 rounded border-2 border-yellow-700"
                            : "bg-zinc-400 font-bold text-zinc-600 italic py-2 rounded border-2 border-zinc-700 cursor-not-allowed"}
                    onClick={startGame}
                    disabled={!enabledStart}
                >
                    Start
                </button>
                <button
                    className="bg-zinc-800 font-bold text-white py-2 rounded border-2 border-white"
                    onClick={exitGame}
                >
                    Exit
                </button>
            </div>
        </div>
    )
}