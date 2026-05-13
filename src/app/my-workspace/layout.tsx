import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

interface myWorkspaceLayoutProps { children: React.ReactNode; };

const myWorkspaceLayout = ({children}: myWorkspaceLayoutProps) => {
    return (
            <div className="min-h-screen">
                <div className="flex w-full h-full">
                    {/* Navbar */}
                    <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
                        <Sidebar />
                        
                    </div>
                    <div className="lg:pl-[264px] w-full">
                        <div className="mx-auto max-w-screen-2xl h-full">
                            {/* TODO Navbar */}
                            <Navbar title="My Workspace" description="Monitor all of your project and task here"/>
                            <main className="h-full py-8 px-6 flex flex-col">
                                { children }
                            </main>
                        </div>
                    </div>
                </div>
            </div>
        );
}

export default myWorkspaceLayout;