/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DoorContent = 'CAR' | 'GOAT';

export interface Door {
  id: number;
  content: DoorContent;
  isOpened: boolean;
  isInitiallySelected: boolean;
  isFinallySelected: boolean;
}

export type GameStage = 'INITIAL' | 'HOST_REVEALED' | 'FINISHED';

export type SimSpeed = 'WATCH' | 'FAST' | 'INSTANT';

export interface SimDataPoint {
  trial: number;
  stayWinRate: number;
  switchWinRate: number;
}

export interface UserStats {
  stayPlayCount: number;
  stayWinCount: number;
  switchPlayCount: number;
  switchWinCount: number;
}
