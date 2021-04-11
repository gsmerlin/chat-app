export interface IChatMessage {
  username: string;
  room: string;
  message?: string;
  url?: string;
  createdAt: string;
}
