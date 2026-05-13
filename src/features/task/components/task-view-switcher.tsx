"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {FaPlus} from "react-icons/fa";
import Link from "next/link";

interface TaskViewSwitcherProps {
    workspaceId: string;
}

export const TaskViewSwitcher = ({ workspaceId } : TaskViewSwitcherProps) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/workspace/${workspaceId}/projects/new`);
    };

    const handleCreateTask = () => {
        router.push(`/workspace/${workspaceId}/task/new`);
    };
    
    return(
        <Tabs className="flex-1 w-full">
            <div className="h-full flex flex-col overflow-auto p-4">
                <div className="flex flex-col gap-y-2 lg:flex-row justify-end items-center">
                    <TabsList className="w-full lg:w-auto gap-x-2">
                        <Button size="sm" onClick={handleClick} className="w-full lg:w-auto cursor-pointer"> Create project
                            <FaPlus className="mr-2" />
                        </Button>
                        
                        <Button size="sm" onClick={handleCreateTask} className="w-full lg:w-auto cursor-pointer"> Create task
                            <FaPlus className="mr-2" />
                        </Button>

                    </TabsList>
                </div>
            </div>
        </Tabs>
    )
};

