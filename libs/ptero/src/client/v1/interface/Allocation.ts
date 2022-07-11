export interface AllocationAttributes {
  id: number;
  ip: string;
  alias: string | null;
  port: number;
  notes: string | null;
  isDefault: boolean;
}

export interface AllocationData {
  object: 'allocation';
  attributes: AllocationAttributes;
}

export interface Allocation {
  object: 'list';
  data: AllocationData[];
}
