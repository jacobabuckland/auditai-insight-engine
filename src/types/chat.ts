
export type MessageType = {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  actions?: ActionGroup[];
};

export type ActionGroup = {
  category: string;
  actions: Action[];
};

export type Action = {
  id: string;
  title: string;
  description: string;
};
