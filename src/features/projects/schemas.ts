import { z } from 'zod';
import { ProjectStatus } from './types';

export const createProjectSchemas = z.object({
    projectName: z.string().trim().min(1, "Requires"),
    description: z.string().optional(),
    workspaceId: z.string().trim().min(1, "Requires"),
    startDate: z.string().min(1, "Requires"), // Expecting date in string format (e.g., "2023-10-01")
    endDate: z.string().min(1, "Requires"),   // Expecting date in string format (e.g., "2023-10-07")
    status: z.nativeEnum(ProjectStatus), 
    search: z.string().optional(),
    projectId: z.string().trim().min(1, "Requires"),
});