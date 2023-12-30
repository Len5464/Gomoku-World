import { GAME_TYPES, GameType } from "../typedef";

export function formatSecToMMSS(sec: number) {
  return `
    ${Math.floor(sec / 60 / 10)}${Math.floor((sec / 60) % 10)}
    :
    ${Math.floor((sec % 60) / 10)}${Math.floor((sec % 60) % 10)}
    `;
}
export function isGameType(str: string | undefined): str is GameType {
  return GAME_TYPES.includes(str as GameType);
}
