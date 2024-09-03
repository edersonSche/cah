import { RoundCzar } from "./components/RoundCzar";
import { RoundPlayer } from "./components/RoundPlayer";
import { LeaderBoard } from "./components/LeaderBoard";
import { RoundResult } from "./components/RoundResult";
import { Button } from "@components/Button";
import { useGame } from "@hooks/useGame";
import { useLeaderboard } from "./hooks/useLeaderboard";

export function Round() {
    const { stage, getCzar, round } = useGame();
    const czar = getCzar();
    const { leaderboard, showLeaderboard } = useLeaderboard()


    function handleStage() {
        switch (stage) {
            case "roundCzar":
                return <RoundCzar />
            case "roundPlayer":
                return <RoundPlayer />
            case "roundResult":
                return <RoundResult />
        }
    }

    return (
        <>
            <div className="h-full flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <Button variant="secondary" size="sm" onClick={showLeaderboard}>🏆 Leaderboard</Button>
                    <div className="flex gap-2  items-center text-yellow-400 font-bold">
                        <span>{czar?.name}</span>
                        <span>👑</span>
                    </div>
                </div>

                <hr className="h-0.5 bg-gray-200" />

                <div className="flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-2 border rounded-lg p-2 border-b-4">
                        <span className="text-xl font-semibold">
                            {round?.blackCard.description}
                        </span>
                        <div className="flex gap-2 items-center self-end">
                            <span>PICK</span>
                            <span className="bg-white text-zinc-800 w-5 h-5 rounded-full  flex justify-center items-center">
                                {round?.blackCard.answers}
                            </span>
                        </div>
                    </div>
                </div>

                {handleStage()}
            </div>

            {leaderboard && <LeaderBoard />}
        </>
    )
}