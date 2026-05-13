import { notFound } from "next/navigation";
import { WorkspaceDetail } from "@/features/workspaces/components/workspace-detail";
import { TaskViewSwitcher } from "@/features/task/components/task-view-switcher";
import { TaskTabs } from "@/features/task/components/task-tabs";

interface WorkspacePageProps {
    params: {
        workspaceId: string;
    };
}

const WorkspacePage = async ({ params }: WorkspacePageProps) => {
    const { workspaceId } = params;

    if (!workspaceId) {
        notFound();
    }

    return (
        <div>
            <WorkspaceDetail workspaceId={workspaceId}/>
            <TaskViewSwitcher workspaceId={workspaceId} />
            <TaskTabs />
            
        </div>
    );
};

export default WorkspacePage;