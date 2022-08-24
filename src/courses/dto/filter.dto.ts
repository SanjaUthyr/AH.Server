export interface FilterDto {
  prices?: number[];
  categories?: string[];
  levels?: string[];
  languages?: string[];
  skills?: string[];
  durations?: string[];
  ratings?: string[];
  authorId?: string;
  sort?: Sort;
  clearAll?: boolean;

  size?: number;
  page?: number;
}
export enum Sort {
  ASC = 'ASC',
  DESC = 'DESC',
}
