import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
  return (
    <div className="min-h-screen">
      <div className="flex w-full h-full">

        {/* Sidebar */}
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
          <Sidebar />
        </div>

        <div className="lg:pl-[264px] w-full">
          <div className="mx-auto max-w-screen-2xl h-full">

            {/* Navbar */}
            <Navbar 
                title=""
                description="ProjeX - Manage your projects with ease"
            />

            <main className="h-full py-8 px-6 flex flex-col">
              {children}
            </main>

          </div>
        </div>

      </div>
    </div>
  );
};

export default WorkspaceLayout;