export interface CheckIn {
  id: string;
  routeId: string;
  checkpointId: string | null;
  username: string;
  checkedAt: string;
}
