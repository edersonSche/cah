import { Button } from "@components/Button";
import { useGame } from "@hooks/useGame";
import { finishGame } from "@services/socket.service";

export function EndGame() {
    const { endGameQuote } = useGame();

    return (
        <div className="flex flex-col gap-4">
            <h1 className="border-2 border-b-4 p-6 rounded-lg font-semibold text-2xl">{endGameQuote}</h1>

            <Button onClick={finishGame}>Finish</Button>
        </div>
    )
}