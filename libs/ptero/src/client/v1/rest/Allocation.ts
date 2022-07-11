import type { Allocation, AllocationData } from '../interface/Allocation';

export type RESTListAllocationsResult = Allocation;

export interface RESTSetAllocationNoteBody {
  notes: string;
}

export type RESTAsignAllocationResult = AllocationData;

export type RESTSetAllocationNoteResult = AllocationData;

export type RESTSetPrimaryAllocationResult = AllocationData;
