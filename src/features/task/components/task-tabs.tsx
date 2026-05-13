"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectTable from "@/features/projects/components/project-table";
import TaskTable from "./task-table";
import StatusTable from "@/features/status/components/status-table";
import CalendarTable from "@/features/calendar/components/calendar-table";

export const TaskTabs = () => {
    return(
        <Tabs defaultValue="project" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4"> 
                <TabsTrigger value="project">Project</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>

            <TabsContent value="project">
                <ProjectTable />
            </TabsContent>

            <TabsContent value="tasks">
                <TaskTable />
            </TabsContent>

            <TabsContent value="status">
                <StatusTable />
            </TabsContent>

            <TabsContent value="calendar">
                <CalendarTable />
            </TabsContent>
        </Tabs>
        
    )
};