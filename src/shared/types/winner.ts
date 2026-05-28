export type Winner = {
  id: number;
  wins: number;
  time: number;
};

export type WinnerPayload = {
  wins: number;
  time: number;
};

export type WinnerSortField = 'wins' | 'time';

export type SortOrder = 'ASC' | 'DESC';