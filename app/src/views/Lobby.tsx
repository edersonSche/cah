import { useMemo } from "react";
import { Button } from "@components/Button";
import { useGame } from "@hooks/useGame";
import { exitGame, startGame } from "@services/socket.service";


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
                <Button disabled={!enabledStart} onClick={startGame}>Start</Button>
                <Button variant="secondary" onClick={exitGame}>Exit</Button>
                
            </div>
        </div>
    )
}