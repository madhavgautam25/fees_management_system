import { Student, FeeRecord, User } from "@/context/AppContext";

const STORAGE_KEYS = {
  STUDENTS: "tinygems_students",
  FEES: "tinygems_fees",
  USERS: "tinygems_users",
};

export const storage = {
  // Students
  getStudents: (): Student[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveStudents: (students: Student[]) => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students, null, 2));
  },

  // Fees
  getFees: (): FeeRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FEES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveFees: (fees: FeeRecord[]) => {
    localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(fees, null, 2));
  },

  // Users
  getUsers: (): User[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users, null, 2));
  },

  // Export all data as JSON
  exportData: () => {
    const data = {
      students: storage.getStudents(),
      fees: storage.getFees(),
      users: storage.getUsers(),
      exportedAt: new Date().toISOString(),
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tinygems_db_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  // Import data from JSON
  importData: (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.students) storage.saveStudents(data.students);
      if (data.fees) storage.saveFees(data.fees);
      if (data.users) storage.saveUsers(data.users);
      return true;
    } catch (error) {
      console.error("Import failed:", error);
      return false;
    }
  },

  // Clear all data
  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.FEES);
    localStorage.removeItem(STORAGE_KEYS.USERS);
  },
};
