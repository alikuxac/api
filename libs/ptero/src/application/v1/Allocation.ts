export interface AllocationAttributes {
  id: number;
  ip: string;
  alias: null | string;
  port: number;
  notes: string | null;
  assigned: boolean;
}

export interface AllocationData {
  object: 'allocation';
  attributes: AllocationAttributes;
}

export interface AllocationPagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  links: Record<string, any>;
}

export interface AllocationMeta {
  pagination: AllocationPagination;
}

export interface Allocation {
  object: 'list';
  data: AllocationData[];
  meta: AllocationMeta;
}
