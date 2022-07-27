export interface LocationAttributes {
  id: number;
  short: string;
  long: string;
  updated_at: Date;
  created_at: Date;
}

export interface LocationData {
  object: 'location';
  attributes: LocationAttributes;
}

export interface LocationPagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  links: Record<string, any>;
}

export interface LocationMeta {
  pagination: LocationPagination;
}

export interface Locations {
  object: 'list';
  data: LocationData[];
  meta: LocationMeta;
}
