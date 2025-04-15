export interface AppData {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  demoUrl: string;
  githubUrl: string | null;
  creator: [string];
  hackathon: string;
}

export type Category = string;
