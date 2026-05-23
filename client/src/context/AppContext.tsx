import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/storage";

// --- Types ---

export type Role = "ADMIN" | "PRINCIPAL" | "TEACHER";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  assignedClass?: string;
}

export interface Student {
  id: string;
  name: string;
  fatherName: string;
  motherName: string;
  aadhaar: string;
  phone: string;
  dob: string;
  class: string;
  section: string;
  rollNo: string;
}

export type FeeStatus = "PAID" | "UNPAID" | "ADVANCE";

export interface FeeRecord {
  id: string;
  studentId: string;
  month: number;
  year: number;
  amount: number;
  status: FeeStatus;
  paymentDate?: string;
}

// --- Mock Data ---

const MOCK_USERS: User[] = [
  { id: "1", name: "Madhav Gautam", email: "admin@tinygems.edu", password: "admin123", role: "ADMIN" },
  { id: "2", name: "Dr. Sharma", email: "principal@tinygems.edu", password: "principal123", role: "PRINCIPAL" },
  { id: "t1", name: "Mrs. Verma (Class 10)", email: "teacher10@tinygems.edu", password: "teacher10", role: "TEACHER", assignedClass: "10" },
  { id: "t2", name: "Mr. Patel (Class 9)", email: "teacher9@tinygems.edu", password: "teacher9", role: "TEACHER", assignedClass: "9" },
  { id: "t3", name: "Ms. Singh (Class 8)", email: "teacher8@tinygems.edu", password: "teacher8", role: "TEACHER", assignedClass: "8" },
  { id: "t4", name: "Mr. Kumar (Class 7)", email: "teacher7@tinygems.edu", password: "teacher7", role: "TEACHER", assignedClass: "7" },
  { id: "t5", name: "Mrs. Gupta (Class 6)", email: "teacher6@tinygems.edu", password: "teacher6", role: "TEACHER", assignedClass: "6" },
  { id: "t6", name: "Mr. Joshi (Class 5)", email: "teacher5@tinygems.edu", password: "teacher5", role: "TEACHER", assignedClass: "5" },
];

const INITIAL_STUDENTS: Student[] = [
  { id: "s1", name: "Aarav Singh", fatherName: "Rajinder Singh", motherName: "Sunita Devi", aadhaar: "123456789012", phone: "9876543210", dob: "2010-05-15", class: "10", section: "A", rollNo: "101" },
  { id: "s2", name: "Diya Sharma", fatherName: "Amit Sharma", motherName: "Priya Sharma", aadhaar: "987654321098", phone: "9876543211", dob: "2010-08-20", class: "10", section: "A", rollNo: "102" },
  { id: "s3", name: "Ishaan Gupta", fatherName: "Rahul Gupta", motherName: "Neha Gupta", aadhaar: "456789123012", phone: "9876543212", dob: "2011-01-10", class: "9", section: "B", rollNo: "901" },
  { id: "s4", name: "Vihaan Kumar", fatherName: "Suresh Kumar", motherName: "Anita Kumar", aadhaar: "789012345678", phone: "9876543213", dob: "2012-03-25", class: "8", section: "A", rollNo: "801" },
  { id: "s5", name: "Ananya Patel", fatherName: "Vikram Patel", motherName: "Meera Patel", aadhaar: "321654987012", phone: "9876543214", dob: "2013-11-05", class: "7", section: "C", rollNo: "701" },
];

const generateFeeRecords = (students: Student[]): FeeRecord[] => {
  const records: FeeRecord[] = [];
  const currentYear = new Date().getFullYear();
  const feeAmount = 1500;

  students.forEach(student => {
    [3, 4, 5].forEach(month => {
      records.push({
        id: `f-${student.id}-${month}`,
        studentId: student.id,
        month,
        year: currentYear,
        amount: feeAmount,
        status: "PAID",
        paymentDate: `${currentYear}-0${month+1}-10`
      });
    });

    records.push({
        id: `f-${student.id}-6`,
        studentId: student.id,
        month: 6,
        year: currentYear,
        amount: feeAmount,
        status: Math.random() > 0.5 ? "PAID" : "UNPAID",
        paymentDate: Math.random() > 0.5 ? `${currentYear}-07-10` : undefined
    });

    records.push({
        id: `f-${student.id}-7`,
        studentId: student.id,
        month: 7,
        year: currentYear,
        amount: feeAmount,
        status: "UNPAID",
    });
  });

  return records;
};

// --- Context ---

interface AppContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  students: Student[];
  addStudent: (student: Omit<Student, "id">) => void;
  updateStudent: (id: string, student: Omit<Student, "id">) => void;
  deleteStudent: (id: string) => void;
  fees: FeeRecord[];
  markFeePaid: (studentId: string, month: number, year: number) => void;
  clearFee: (studentId: string, month: number, year: number) => void;
  exportData: () => void;
  importData: (jsonString: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from storage on mount
  useEffect(() => {
    const storedStudents = storage.getStudents();
    const storedFees = storage.getFees();

    if (storedStudents.length === 0) {
      storage.saveStudents(INITIAL_STUDENTS);
      storage.saveFees(generateFeeRecords(INITIAL_STUDENTS));
      setStudents(INITIAL_STUDENTS);
      setFees(generateFeeRecords(INITIAL_STUDENTS));
    } else {
      setStudents(storedStudents);
      setFees(storedFees);
    }
    
    setIsInitialized(true);
  }, []);

  const login = (email: string, password: string) => {
    const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (mockUser) {
      setUser(mockUser);
      toast({ title: `Welcome back, ${mockUser.name}`, description: `Logged in as ${mockUser.role}` });
    } else {
      toast({ title: "Login Failed", description: "Invalid email or password", className: "bg-destructive text-white" });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const addStudent = (newStudent: Omit<Student, "id">) => {
    const id = `s${Date.now()}`;
    const studentWithId = { ...newStudent, id };
    const updatedStudents = [...students, studentWithId];
    setStudents(updatedStudents);
    storage.saveStudents(updatedStudents);
    toast({ title: "Student Added", description: `${newStudent.name} has been enrolled.` });
  };

  const updateStudent = (id: string, updatedData: Omit<Student, "id">) => {
    const updatedStudents = students.map(s => s.id === id ? { ...s, ...updatedData } : s);
    setStudents(updatedStudents);
    storage.saveStudents(updatedStudents);
    toast({ title: "Student Updated", description: `${updatedData.name}'s details have been updated.` });
  };

  const deleteStudent = (id: string) => {
    const studentName = students.find(s => s.id === id)?.name || "Student";
    const updatedStudents = students.filter(s => s.id !== id);
    const updatedFees = fees.filter(f => f.studentId !== id);
    setStudents(updatedStudents);
    setFees(updatedFees);
    storage.saveStudents(updatedStudents);
    storage.saveFees(updatedFees);
    toast({ title: "Student Deleted", description: `${studentName} has been removed from the system.`, className: "bg-destructive text-white" });
  };

  const markFeePaid = (studentId: string, month: number, year: number) => {
    const updatedFees = fees.map(f => {
      if (f.studentId === studentId && f.month === month && f.year === year) {
        return { ...f, status: "PAID" as FeeStatus, paymentDate: new Date().toISOString().split('T')[0] };
      }
      return f;
    });

    const exists = updatedFees.some(f => f.studentId === studentId && f.month === month && f.year === year);
    if (!exists) {
      updatedFees.push({
        id: `f-${studentId}-${month}-${Date.now()}`,
        studentId,
        month,
        year,
        amount: 1500,
        status: "PAID",
        paymentDate: new Date().toISOString().split('T')[0]
      });
    }

    setFees(updatedFees);
    storage.saveFees(updatedFees);
    toast({ title: "Fee Updated", description: "Marked as Paid.", className: "bg-green-500 text-white" });
  };

  const clearFee = (studentId: string, month: number, year: number) => {
    const updatedFees = fees.map(f => {
      if (f.studentId === studentId && f.month === month && f.year === year) {
        return { ...f, status: "UNPAID" as FeeStatus, paymentDate: undefined };
      }
      return f;
    });
    setFees(updatedFees);
    storage.saveFees(updatedFees);
    toast({ title: "Fee Cleared", description: "Payment status reset." });
  };

  const exportData = () => {
    storage.exportData();
    toast({ title: "Exported", description: "Database exported as JSON file." });
  };

  const importData = (jsonString: string) => {
    const success = storage.importData(jsonString);
    if (success) {
      const newStudents = storage.getStudents();
      const newFees = storage.getFees();
      setStudents(newStudents);
      setFees(newFees);
      toast({ title: "Imported", description: "Data imported successfully." });
    } else {
      toast({ title: "Import Failed", description: "Invalid JSON format." });
    }
    return success;
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <AppContext.Provider value={{ user, login, logout, students, addStudent, updateStudent, deleteStudent, fees, markFeePaid, clearFee, exportData, importData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}