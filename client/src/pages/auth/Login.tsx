import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { LogIn } from "lucide-react";
import logoImage from "@assets/generated_images/minimalist_geometric_school_logo_with_gem_and_book_elements.png";

const DEMO_ACCOUNTS = [
  { label: "Admin (Madhav Gautam)", email: "admin@tinygems.edu", password: "admin123" },
  { label: "Principal (Dr. Sharma)", email: "principal@tinygems.edu", password: "principal123" },
  { label: "Teacher Class 10 (Mrs. Verma)", email: "teacher10@tinygems.edu", password: "teacher10" },
  { label: "Teacher Class 9 (Mr. Patel)", email: "teacher9@tinygems.edu", password: "teacher9" },
  { label: "Teacher Class 8 (Ms. Singh)", email: "teacher8@tinygems.edu", password: "teacher8" },
  { label: "Teacher Class 7 (Mr. Kumar)", email: "teacher7@tinygems.edu", password: "teacher7" },
  { label: "Teacher Class 6 (Mrs. Gupta)", email: "teacher6@tinygems.edu", password: "teacher6" },
  { label: "Teacher Class 5 (Mr. Joshi)", email: "teacher5@tinygems.edu", password: "teacher5" },
];

export default function Login() {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showManualLogin, setShowManualLogin] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login(email, password);
    }
  };

  const handleQuickLogin = (acc: typeof DEMO_ACCOUNTS[0]) => {
    login(acc.email, acc.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <img src={logoImage} alt="Tiny Gems Logo" className="w-14 h-14 object-contain" />
          </div>
          <div>
            <CardTitle className="text-2xl font-heading text-primary">Tiny Gems High School</CardTitle>
            <CardDescription>School Fees Management System</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showManualLogin ? (
            <>
              <div className="text-center text-sm text-muted-foreground">
                Click on an account to login
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {DEMO_ACCOUNTS.map((account) => (
                  <Button
                    key={account.email}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 hover:bg-primary/5"
                    onClick={() => handleQuickLogin(account)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{account.label}</div>
                      <div className="text-xs text-muted-foreground">{account.email}</div>
                    </div>
                  </Button>
                ))}
              </div>
              <Button 
                variant="ghost" 
                className="w-full text-sm text-muted-foreground"
                onClick={() => setShowManualLogin(true)}
              >
                Or enter credentials manually
              </Button>
            </>
          ) : (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input 
                    type="email" 
                    placeholder="teacher@tinygems.edu" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input 
                    type="password" 
                    placeholder="Enter password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Button>
              </form>
              <Button 
                variant="ghost" 
                className="w-full text-sm"
                onClick={() => {
                  setShowManualLogin(false);
                  setEmail("");
                  setPassword("");
                }}
              >
                Back to Quick Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}