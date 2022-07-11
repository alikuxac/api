export interface FilesAttributes {
  name: string;
  mode: string;
  size: number;
  is_file: boolean;
  is_symlink: boolean;
  is_editable: boolean;
  mimetype: string;
  created_at: Date;
  modified_at: Date;
}

export interface FilesData {
  object: 'file_object';
  attributes: FilesAttributes;
}

export interface Files {
  object: 'list';
  data: FilesData[];
}
