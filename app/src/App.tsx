import { useGame } from "./hooks/useGame"
import { Round } from "./views/Round";
import { Lobby } from "./views/Lobby";
import { Start } from "./views/Start";
import { EndGame } from "./views/EndGame";

export default function App() {
  const stage = useGame((store) => store.stage);

  function handleStage() {
    switch (stage) {
      case "start":
        return <Start />

      case "lobby":
        return <Lobby />

      case "roundPlayer":
      case "roundCzar":
      case "roundResult":
        return <Round />

      case "endGame":
        return <EndGame />

      default:
        return (
          <div className="text-center">
            <p>Ops! Something's missing.</p>
            <p>Try to refresh the app!</p>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col justify-center w-full lg:max-w-2xl">
      {handleStage()}
    </div>
  )
}
