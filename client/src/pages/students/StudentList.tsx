import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, FileSpreadsheet, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StudentList() {
  const { students, addStudent, updateStudent, deleteStudent, user } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [newStudent, setNewStudent] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    aadhaar: "",
    phone: "",
    dob: "",
    class: "",
    section: "",
    rollNo: ""
  });

  const [editStudent, setEditStudent] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    aadhaar: "",
    phone: "",
    dob: "",
    class: "",
    section: "",
    rollNo: ""
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.rollNo.includes(searchTerm);
    const matchesClass = classFilter === "all" || student.class === classFilter;
    
    if (user?.role === "TEACHER" && user.assignedClass) {
        return matchesSearch && student.class === user.assignedClass;
    }

    return matchesSearch && matchesClass;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent(newStudent);
    setIsAddOpen(false);
    setNewStudent({
        name: "", fatherName: "", motherName: "", aadhaar: "", phone: "", dob: "", class: "", section: "", rollNo: ""
    });
  };

  const handleEditClick = (student: typeof students[0]) => {
    setEditingStudentId(student.id);
    setEditStudent({
      name: student.name,
      fatherName: student.fatherName,
      motherName: student.motherName,
      aadhaar: student.aadhaar,
      phone: student.phone,
      dob: student.dob,
      class: student.class,
      section: student.section,
      rollNo: student.rollNo
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudentId) {
      updateStudent(editingStudentId, editStudent);
      setIsEditOpen(false);
      setEditingStudentId(null);
    }
  };

  const handleDeleteConfirm = (id: string) => {
    const student = students.find(s => s.id === id);
    if (student) {
      deleteStudent(id);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Students</h1>
          <p className="text-muted-foreground">Manage student records</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" onClick={() => toast({ title: "Exporting...", description: "Student list downloaded as CSV." })}>
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Export
            </Button>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Student
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add New Student</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit} className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Student Name</Label>
                            <Input required value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Date of Birth</Label>
                            <Input type="date" required value={newStudent.dob} onChange={e => setNewStudent({...newStudent, dob: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Father's Name</Label>
                            <Input required value={newStudent.fatherName} onChange={e => setNewStudent({...newStudent, fatherName: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Mother's Name</Label>
                            <Input required value={newStudent.motherName} onChange={e => setNewStudent({...newStudent, motherName: e.target.value})} />
                        </div>
                         <div className="space-y-2">
                            <Label>Aadhaar Number</Label>
                            <Input required maxLength={12} placeholder="12 digits" value={newStudent.aadhaar} onChange={e => setNewStudent({...newStudent, aadhaar: e.target.value})} />
                        </div>
                         <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input required maxLength={10} placeholder="10 digits" value={newStudent.phone} onChange={e => setNewStudent({...newStudent, phone: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Class</Label>
                            <Select onValueChange={(v) => setNewStudent({...newStudent, class: v})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 9, 8, 7, 6, 5].map(c => <SelectItem key={c} value={c.toString()}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Section</Label>
                            <Select onValueChange={(v) => setNewStudent({...newStudent, section: v})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Section" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["A", "B", "C"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label>Roll Number</Label>
                            <Input required value={newStudent.rollNo} onChange={e => setNewStudent({...newStudent, rollNo: e.target.value})} />
                        </div>

                        <div className="col-span-2 mt-4 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                            <Button type="submit">Save Student</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center bg-card p-4 rounded-lg border border-border">
        <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search by name or roll no..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        {user?.role !== "TEACHER" && (
            <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Class" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {[10, 9, 8, 7, 6, 5].map(c => <SelectItem key={c} value={c.toString()}>Class {c}</SelectItem>)}
                </SelectContent>
            </Select>
        )}
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Parents</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Aadhaar</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                        <TableRow key={student.id} className="hover:bg-muted/50 cursor-pointer">
                            <TableCell className="font-medium">{student.rollNo}</TableCell>
                            <TableCell>
                                <div className="font-medium text-primary">{student.name}</div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                <div>F: {student.fatherName}</div>
                                <div>M: {student.motherName}</div>
                            </TableCell>
                            <TableCell>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {student.class}-{student.section}
                                </span>
                            </TableCell>
                            <TableCell>{student.phone}</TableCell>
                            <TableCell className="text-right font-mono text-xs">{student.aadhaar}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEditClick(student)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  title="Edit student"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setDeleteConfirmId(student.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  title="Delete student"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                            No students found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {students.find(s => s.id === deleteConfirmId)?.name}? This action cannot be undone and will remove all associated fee records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConfirmId && handleDeleteConfirm(deleteConfirmId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Student Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Student Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Student Name</Label>
              <Input required value={editStudent.name} onChange={e => setEditStudent({...editStudent, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" required value={editStudent.dob} onChange={e => setEditStudent({...editStudent, dob: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Father's Name</Label>
              <Input required value={editStudent.fatherName} onChange={e => setEditStudent({...editStudent, fatherName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Mother's Name</Label>
              <Input required value={editStudent.motherName} onChange={e => setEditStudent({...editStudent, motherName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Aadhaar Number</Label>
              <Input required maxLength={12} placeholder="12 digits" value={editStudent.aadhaar} onChange={e => setEditStudent({...editStudent, aadhaar: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input required maxLength={10} placeholder="10 digits" value={editStudent.phone} onChange={e => setEditStudent({...editStudent, phone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={editStudent.class} onValueChange={(v) => setEditStudent({...editStudent, class: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {[10, 9, 8, 7, 6, 5].map(c => <SelectItem key={c} value={c.toString()}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Section</Label>
              <Select value={editStudent.section} onValueChange={(v) => setEditStudent({...editStudent, section: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  {["A", "B", "C"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Roll Number</Label>
              <Input required value={editStudent.rollNo} onChange={e => setEditStudent({...editStudent, rollNo: e.target.value})} />
            </div>

            <div className="col-span-2 mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit">Update Student</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}