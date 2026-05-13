import { UserButton } from "@/features/auth/components/user-button";
import { MobileSidebar } from "./mobile-sidebar";

type NavbarProps = {
    title: string;
    description: string;
}

export const Navbar = ({title, description}: NavbarProps) => {
    return (
        <nav className="pt-4 px-6 flex items-center justify-between">
            <div className="flex-col hidden lg:flex">
                <h1 className="text-2xl font-semibold">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
            </div>
            <MobileSidebar />
            <UserButton />
        </nav>
    );
};