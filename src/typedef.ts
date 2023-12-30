export const GAME_TYPES = ["classic", "pente"] as const;
export const ROUND_TYPES = ["one-round", "two-out-of-three", "three-out-of-five"] as const;
export const DIRECTIONS = ["NW", "N", "NE", "W", "E", "SW", "S", "SE"] as const;

export type Coordinate = [number, number];
export type Directions = (typeof DIRECTIONS)[number];
export type RoundType = (typeof ROUND_TYPES)[number];
export type GameType = (typeof GAME_TYPES)[number];
export type Route = {
  query: Game.Setup;
};

export declare namespace Game {
  type Status = {
    winner: string;
    lastPlacement: string;
    gameType: GameType;
    isTurnWhite: boolean;
    isTimeOut: boolean;
    indexEnabled: boolean;
    players: [string, string];
    winCounts: number[];
    captures: number[];
    round: number;
    goalScore: number;
  };
  type Setup = {
    size: number;
    sec: number;
    players: [string, string];
    roundType: RoundType;
    gameType: GameType;
  };
}
