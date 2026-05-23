import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/common/StatCard";
import { Users, IndianRupee, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user, students, fees } = useApp();

  // Calculate Stats
  const totalStudents = students.length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthFees = fees.filter(f => f.month === currentMonth && f.year === currentYear);
  
  const paidCount = currentMonthFees.filter(f => f.status === "PAID").length;
  const unpaidCount = totalStudents - paidCount; // Assuming everyone should pay
  
  const collectedAmount = currentMonthFees
    .filter(f => f.status === "PAID")
    .reduce((sum, f) => sum + f.amount, 0);

  const pendingAmount = unpaidCount * 1500; // Mock 1500 fee

  // Mock Chart Data
  const data = [
    { name: 'Apr', collected: 4000, pending: 2400 },
    { name: 'May', collected: 3000, pending: 1398 },
    { name: 'Jun', collected: 2000, pending: 9800 },
    { name: 'Jul', collected: 2780, pending: 3908 },
    { name: 'Aug', collected: 1890, pending: 4800 },
    { name: 'Sep', collected: 2390, pending: 3800 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <div className="text-sm bg-accent/50 px-3 py-1 rounded-full text-accent-foreground border border-accent/20">
            Session 2024-25
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={totalStudents}
          description="Active Enrollments"
          icon={Users}
        />
        <StatCard
          title="Collected (This Month)"
          value={`₹${collectedAmount.toLocaleString()}`}
          description={`${paidCount} students paid`}
          icon={CheckCircle2}
          className="border-l-green-500"
        />
        <StatCard
          title="Pending (This Month)"
          value={`₹${pendingAmount.toLocaleString()}`}
          description={`${unpaidCount} students pending`}
          icon={AlertCircle}
          className="border-l-destructive"
        />
         <StatCard
          title="Total Revenue (YTD)"
          value="₹4,50,000"
          description="Approximate"
          icon={IndianRupee}
          className="border-l-secondary"
        />
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle>Fee Collection Trends</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888888', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#888888', fontSize: 12}} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="collected" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Collected" />
                    <Bar dataKey="pending" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="Pending" />
                    </BarChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-sm">
            <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {fees.slice(0, 5).map((fee) => {
                        const student = students.find(s => s.id === fee.studentId);
                        return (
                            <div key={fee.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium">{student?.name || "Unknown Student"}</p>
                                    <p className="text-xs text-muted-foreground">Class {student?.class}-{student?.section}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600">+ ₹{fee.amount}</p>
                                    <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                        )
                    })}
                    {fees.length === 0 && <p className="text-muted-foreground text-center py-4">No recent payments</p>}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
