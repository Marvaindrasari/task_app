import { z } from 'zod';

export const createMemberSchema = z.object ({
    workspaceId: z.string().trim().min(1, "Required"),
    userId: z.string().trim().min(1, "Required"),
    userName: z.string().trim().min(1, "Required"),
    joinedAt: z.coerce.date(),
    email: z.string().email("Invalid email address"),
});