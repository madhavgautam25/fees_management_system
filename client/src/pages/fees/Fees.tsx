import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Fees() {
  const { students, fees, markFeePaid, clearFee, user } = useApp();
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString());
  const [selectedClass, setSelectedClass] = useState<string>(user?.assignedClass || "10");
  const currentYear = new Date().getFullYear();
  const { toast } = useToast();

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper to check status
  const getFeeStatus = (studentId: string) => {
    const record = fees.find(f => 
        f.studentId === studentId && 
        f.month === parseInt(selectedMonth) && 
        f.year === currentYear
    );
    return record?.status || "UNPAID";
  };

  const filteredStudents = students.filter(s => s.class === selectedClass);

  const handleSendReminder = (studentId: string) => {
      // Simulate SMS
      toast({
          title: "SMS Sent",
          description: "Payment reminder sent successfully to parent.",
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Fees Management</h1>
          <p className="text-muted-foreground">Track and manage monthly collections</p>
        </div>
        <div className="flex gap-4">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                    {months.map((m, idx) => (
                        <SelectItem key={idx} value={idx.toString()}>{m} {currentYear}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {user?.role !== "TEACHER" && (
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                        {[10, 9, 8, 7, 6, 5].map(c => <SelectItem key={c} value={c.toString()}>Class {c}</SelectItem>)}
                    </SelectContent>
                </Select>
            )}
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
        <Table>
            <TableHeader className="bg-muted/50">
                <TableRow>
                    <TableHead className="w-[100px]">Roll No</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Father's Name</TableHead>
                    <TableHead>Fee Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => {
                        const status = getFeeStatus(student.id);
                        return (
                            <TableRow key={student.id}>
                                <TableCell className="font-medium">{student.rollNo}</TableCell>
                                <TableCell className="font-medium text-primary">{student.name}</TableCell>
                                <TableCell className="text-muted-foreground">{student.fatherName}</TableCell>
                                <TableCell>₹1,500</TableCell>
                                <TableCell>
                                    <Badge variant={status === "PAID" ? "default" : "destructive"} className={status === "PAID" ? "bg-green-600 hover:bg-green-700" : ""}>
                                        {status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {status !== "PAID" ? (
                                            <>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline"
                                                    onClick={() => handleSendReminder(student.id)}
                                                    title="Send Reminder SMS"
                                                >
                                                    <Bell className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    className="bg-green-600 hover:bg-green-700"
                                                    onClick={() => markFeePaid(student.id, parseInt(selectedMonth), currentYear)}
                                                >
                                                    <Check className="h-4 w-4 mr-1" /> Mark Paid
                                                </Button>
                                            </>
                                        ) : (
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                className="text-muted-foreground hover:text-destructive"
                                                onClick={() => clearFee(student.id, parseInt(selectedMonth), currentYear)}
                                            >
                                                <X className="h-4 w-4 mr-1" /> Clear
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                            No students found for this class.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
      </div>
    </div>
  );
}
