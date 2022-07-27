export interface NodesAttributes {
  id: string;
  uuid: string;
  public: boolean;
  name: string;
  description: string;
  location_id: number;
  fqdn: string;
  scheme: string;
  behind_proxy: boolean;
  maintenance_mode: boolean;
  memory: number;
  memory_overallocate: number;
  disk: number;
  disk_overallocate: number;
  upload_size: number;
  daemon_listen: number;
  daemon_sftp: number;
  daemon_base: string;
  created_at: Date;
  updated_at: Date;
}

export interface NodesData {
  object: 'node';
  attributes: NodesAttributes;
}

export interface NodesPagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  links: Record<string, any>;
}

export interface NodesMeta {
  pagination: NodesPagination;
}

export interface Nodes {
  object: 'list';
  data: NodesData[];
  meta: NodesMeta;
}
