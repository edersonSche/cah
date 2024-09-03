import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@components/Button";
import { useGame } from "@hooks/useGame";
import { joinGame } from "@services/socket.service";


export function Start() {
    const setStage = useGame((state) => state.setStage);


    const [name, setName] = useState<string>('');


    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!name) {
            alert('Please enter your name!');
            return;
        }

        // socket.emit('join', name);
        joinGame(name)

        setStage('start');
    }

    return (
        <>
            <h1 className="text-7xl font-medium">
                Cards Against Humanity
            </h1>

            <form
                className="mt-20 flex flex-col gap-2"
                onSubmit={handleSubmit}
            >
                <input
                    autoFocus
                    className="bg-zinc-300 font-bold text-zinc-800 py-2 rounded text-center"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                
                <Button type="submit" >Join</Button>
            </form>
        </>
    )
}