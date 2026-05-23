import { Switch, Route, Redirect } from "wouter";
import { AppProvider, useApp } from "@/context/AppContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Pages
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/dashboard/Dashboard";
import StudentList from "@/pages/students/StudentList";
import Fees from "@/pages/fees/Fees";
import Reports from "@/pages/reports/Reports";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, allowedRoles }: { component: any, allowedRoles?: string[] }) {
  const { user } = useApp();

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
     return <div className="p-8 text-center">Access Denied</div>; // Or redirect
  }

  return (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
}

function Router() {
  const { user } = useApp();

  return (
    <Switch>
      <Route path="/login">
        {user ? <Redirect to="/" /> : <Login />}
      </Route>

      <Route path="/">
        <ProtectedRoute component={Dashboard} />
      </Route>

      <Route path="/students">
         <ProtectedRoute component={StudentList} allowedRoles={['ADMIN', 'TEACHER']} />
      </Route>

      <Route path="/fees">
         <ProtectedRoute component={Fees} allowedRoles={['ADMIN', 'TEACHER']} />
      </Route>

      <Route path="/reports">
         <ProtectedRoute component={Reports} allowedRoles={['ADMIN', 'PRINCIPAL']} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <AppProvider>
          <Router />
          <Toaster />
        </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
