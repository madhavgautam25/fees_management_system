import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Share2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Reports() {
  const { students, fees } = useApp();
  const { toast } = useToast();

  const handleShare = () => {
    toast({
      title: "Report Shared",
      description: "Report summary sent via WhatsApp.",
    });
  };

  // --- Data Processing for Charts ---
  
  // 1. Fee Collection by Class
  const classData = [10, 9, 8, 7, 6, 5].map(cls => {
      const clsStudents = students.filter(s => s.class === cls.toString());
      const studentIds = clsStudents.map(s => s.id);
      
      // Count fees for current month for these students
      const currentMonthFees = fees.filter(f => 
          f.month === new Date().getMonth() && 
          f.year === new Date().getFullYear() &&
          studentIds.includes(f.studentId) &&
          f.status === "PAID"
      );
      
      return {
          name: `Class ${cls}`,
          students: clsStudents.length,
          collected: currentMonthFees.reduce((sum, f) => sum + f.amount, 0)
      }
  });

  // 2. Paid vs Unpaid Pie Chart (Current Month)
  const currentMonthFees = fees.filter(f => f.month === new Date().getMonth());
  const paidCount = currentMonthFees.filter(f => f.status === "PAID").length;
  // Approximation for total needed vs paid
  const totalExpected = students.length; 
  const unpaidCount = totalExpected - paidCount;

  const pieData = [
    { name: 'Paid', value: paidCount },
    { name: 'Unpaid', value: unpaidCount },
  ];
  const COLORS = ['#22c55e', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">Detailed insights on fees and enrollment</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast({ title: "Downloaded", description: "PDF Report downloaded." })}>
                <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" /> Share on WhatsApp
            </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
         {/* Class-wise Collection */}
         <Card className="col-span-2 md:col-span-1 shadow-sm">
            <CardHeader>
                <CardTitle>Class-wise Collection</CardTitle>
                <CardDescription>Fee collected this month per class</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={classData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                            <Tooltip formatter={(value) => `₹${value}`} cursor={{fill: 'transparent'}} />
                            <Bar dataKey="collected" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
         </Card>

         {/* Paid vs Unpaid Status */}
         <Card className="col-span-2 md:col-span-1 shadow-sm">
            <CardHeader>
                <CardTitle>Payment Status</CardTitle>
                <CardDescription>Current Month Overview</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
         </Card>
      </div>

      {/* Summary Table */}
      <Card>
          <CardHeader>
              <CardTitle>Monthly Summary Report</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="bg-muted/30 p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
{`TINY GEMS PUBLIC HIGH SCHOOL
MONTHLY FEE REPORT - ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}

----------------------------------------
Total Students:       ${students.length}
Fee Per Student:      ₹1,500
Total Expected:       ₹${(students.length * 1500).toLocaleString()}
----------------------------------------
Collected Amount:     ₹${(paidCount * 1500).toLocaleString()}
Pending Amount:       ₹${(unpaidCount * 1500).toLocaleString()}
----------------------------------------
Collection Rate:      ${Math.round((paidCount / students.length) * 100)}%
----------------------------------------

Generated on: ${new Date().toLocaleString()}`}
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
