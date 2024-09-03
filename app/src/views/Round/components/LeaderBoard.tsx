import { useGame } from "@hooks/useGame";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { Button } from "@components/Button";


export function LeaderBoard() {
    const { closeLeaderboard } = useLeaderboard();
    const { getOrderedPlayers } = useGame();

    return (
        <>
            <div onClick={closeLeaderboard}
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="flex flex-col bg-zinc-700 rounded w-full lg:max-w-xl m-3 p-3 gap-5">
                    <div className="text-2xl text-center">
                        🏆 Leaderboard
                    </div>
                    <hr className="h-0.5 bg-gray-200" />
                    <div className="overflow-y-auto h-full">
                        <ul className="text-zinc-700 py-2 flex flex-col gap-2">
                            {getOrderedPlayers().map((player, i) => (
                                <li className="text-white py-1"
                                    key={i}>
                                    <div className="flex gap-2 items-center">
                                        <div className="bg-zinc-800 text-white size-7 rounded flex items-center justify-center">{i + 1}</div>
                                        <div className="flex-1">{player.name}</div>
                                        <div className="text-zinc-800 bg-white size-7 rounded-full flex items-center justify-center">{player.score}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <hr className="h-0.5 bg-gray-200" />
                    
                    <Button variant="secondary" onClick={closeLeaderboard}>Exit</Button>
                </div>
            </div>
            <div className="opacity-60 fixed inset-0 z-40 bg-black " />
        </>
    )
}