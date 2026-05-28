export type EngineStatus = 'started' | 'stopped' | 'drive';

export type EngineStartResponse = {
  velocity: number;
  distance: number;
};

export type DriveResponse = {
  success: boolean;
};
