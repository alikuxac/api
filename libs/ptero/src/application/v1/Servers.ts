export interface ServerLimits {
  memory: number;
  swap: number;
  disk: number;
  io: number;
  cpu: number;
  thread: number | null;
}

export interface ServerFeatureLimit {
  databases: number;
  allocations: number;
  backups: number;
}

export interface ServerAttributes {
  id: number;
  external_id: string;
  identifier: string;
  name: string;
  description: string;
  suspended: boolean;
  limits: ServerLimits;
  feature_limits: ServerFeatureLimit;
  user: number;
  node: number;
  allocation: number;
  nest: number;
  egg: number;
  pack: null;
}
