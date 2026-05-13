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
import { useCreateWorkspace } from "../api/use-create-workspace";
import { on } from "events";

interface CreateWorkspaceFormProps {
    onCancel?: () => void;
};

function workspaceCode(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = ''; //ini buat menyimpan hasilnya
    //looping
    for(let i = 0; i < length; i++){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
    const { mutate, isPending } = useCreateWorkspace();


    const form = useForm<z.infer<typeof createWorkspaceSchema>>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
        const code = workspaceCode();
        mutate({ json: {...values, code} },
            {
            onSuccess: () => {
                window.location.reload();
            },
        }
        );
    };

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex px-7">
                <CardTitle className="text-xl font-bold">
                    Create a new workspace
                </CardTitle>
            </CardHeader>
            <CardContent className="px-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Workspace Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter Workspace Name"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="flex items-center justify-between">
                                <Button type="button" size="lg" variant="secondary" onClick={onCancel} disabled={isPending}>
                                    Cancel
                                </Button>
                                <Button type="submit" size="lg" className="cursor-pointer" disabled={isPending}>
                                    Create Workspace
                                </Button>
                    
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
};