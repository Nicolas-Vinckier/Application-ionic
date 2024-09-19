export interface Media {
  id: number;
  title: string;
  type: "film" | "serie";
  status: "inProgress" | "end";
  rating?: number;
  season?: number;
  episode?: number;
  imageUrl?: string;
  description?: string;
}
