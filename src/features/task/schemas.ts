import { z } from "zod";
import { TaskStatus } from "./types";
import { Search } from "lucide-react";

export const createTaskSchema = z.object({
    name: z.string().trim().min(1, "Required"),
    status: z.nativeEnum(TaskStatus, {required_error: "Required"}),
    workspaceId : z.string().trim().min(1, "Required"),
    projectId : z.string().trim().min(1, "Required"),
    dueDate : z.coerce.date(),
    assigneeId: z.string().trim().min(1, "Required"),
    description: z.string().optional(),
    
});

export const createProjectSchema = z.object({
    projectName : z.string().trim().min(1, "Required"),
    description : z.string().optional(),
    workspaceId : z.string().trim().min(1, "Required"),
    userId : z.string().trim().min(1, "Required"),
    startDate : z.coerce.date(),
    endDate : z.coerce.date(),
    status : z.enum(["To Do", "In Progress", "In Review", "Done"], {required_error: "Required"}),
    projectId : z.string().trim().min(1, "Required"),
    createdAt : z.coerce.date(),
    updatedAt : z.coerce.date(), 
});