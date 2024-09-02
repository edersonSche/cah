import { create } from "zustand";

type LeaderboardStorage = {
    leaderboard: boolean,

    showLeaderboard: () => void,
    closeLeaderboard: () => void,
}

export const useLeaderboard = create<LeaderboardStorage>()((set) => ({
    leaderboard: false,
    showLeaderboard: () => set(() => ({ leaderboard: true })),
    closeLeaderboard: () => set(() => ({ leaderboard: false })),
}));