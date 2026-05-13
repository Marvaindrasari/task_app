"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createWorkspaceSchema } from "../schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DottedSeparator } from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useJoinWorkspace } from "../api/use-join-workspace";

const formSchema = z.object({
    code : z.string().min(1, "Required"),
});

interface JoinWorkspaceFormProps {
    onCancel?: () => void;
};

export const JoinWorkspaceForm = ({ onCancel }: JoinWorkspaceFormProps) => {
    const { mutate, isPending } = useJoinWorkspace();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        mutate(values);
    };

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex px-7">
                <CardTitle className="text-xl font-bold">
                    Join workspace
                </CardTitle>
            </CardHeader>
            <CardContent className="px-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                            <FormField control={form.control} name="code" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Workspace Code
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter Workspace Code"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="flex items-center justify-between">
                                <Button type="button" size="lg" variant="secondary" onClick={onCancel} disabled={isPending}>
                                    Cancel
                                </Button>
                                <Button type="submit" size="lg" disabled={isPending}>
                                    Join Workspace
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
};