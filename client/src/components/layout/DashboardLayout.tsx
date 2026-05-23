import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useApp } from "@/context/AppContext";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  PieChart, 
  LogOut, 
  Menu,
  X,
  Download,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import logoImage from "@assets/generated_images/minimalist_geometric_school_logo_with_gem_and_book_elements.png";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout, exportData, importData } = useApp();
  const [location] = useLocation();
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["ADMIN", "PRINCIPAL", "TEACHER"] },
    { label: "Students", href: "/students", icon: Users, roles: ["ADMIN", "TEACHER"] },
    { label: "Fees", href: "/fees", icon: CreditCard, roles: ["ADMIN", "TEACHER"] },
    { label: "Reports", href: "/reports", icon: PieChart, roles: ["ADMIN", "PRINCIPAL"] },
  ];

  const filteredNav = navItems.filter(item => user && item.roles.includes(user.role));

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        importData(content);
        setImportDialogOpen(false);
      };
      reader.readAsText(file);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-6 flex items-center gap-3">
        <img src={logoImage} alt="Tiny Gems Logo" className="w-10 h-10 object-contain" />
        <div>
          <h1 className="font-heading font-bold text-lg leading-tight text-primary">Tiny Gems</h1>
          <p className="text-xs text-muted-foreground">Public High School</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {filteredNav.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 cursor-pointer ${
              location === item.href 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}>
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-border space-y-3">
         <div className="flex items-center gap-3 mb-3 px-2">
            <Avatar className="h-9 w-9 border border-border">
                <AvatarFallback className="bg-secondary text-secondary-foreground font-bold">
                    {user?.name.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate capitalize">{user?.role?.toLowerCase()}</p>
            </div>
         </div>

         {user?.role === "ADMIN" && (
           <>
             <Button variant="outline" className="w-full justify-start text-xs" onClick={exportData}>
               <Download size={16} className="mr-2" />
               Export Data
             </Button>
             <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
               <DialogTrigger asChild>
                 <Button variant="outline" className="w-full justify-start text-xs">
                   <Upload size={16} className="mr-2" />
                   Import Data
                 </Button>
               </DialogTrigger>
               <DialogContent>
                 <DialogHeader>
                   <DialogTitle>Import Database</DialogTitle>
                 </DialogHeader>
                 <Input type="file" accept=".json" onChange={handleImport} />
               </DialogContent>
             </Dialog>
           </>
         )}

        <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={logout}>
          <LogOut size={18} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden md:block w-64 h-full fixed left-0 top-0 z-10">
        <SidebarContent />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-20 flex items-center px-4 justify-between">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="Logo" className="w-8 h-8" />
            <span className="font-heading font-bold text-primary">Tiny Gems</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
                <SidebarContent />
            </SheetContent>
          </Sheet>
      </div>

      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto h-full">
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
           {children}
        </div>
      </main>
    </div>
  );
}
