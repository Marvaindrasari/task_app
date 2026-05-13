//ini buat deklarasiin types enum di schemas.ts
export enum ProjectStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
    IN_REVIEW = "IN_REVIEW",
}

//tipe data project
// TIPE DATA PROJECT
export type Project = {
  projectName: string;
  description?: string;
  workspaceId: string;
  userId: string;
  startDate?: string;
  endDate?: string;
  status?: ProjectStatus;
  search?: string;
  projectId: string;
};

