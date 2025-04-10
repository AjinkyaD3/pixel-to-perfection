import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThreeDBackground from "./ThreeDBackground";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { authService } from "@/lib/api";

// Special registration codes for admin and committee roles
// In a real app, these would be managed securely, not hardcoded
const ADMIN_CODE = "ADMIN123";
const COMMITTEE_CODE = "COMMITTEE123";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student", // Default role
    rollNumber: "",
    year: "",
    division: "",
    skills: "",
    registrationCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate role-specific fields
    if (formData.role === "student") {
      if (!formData.rollNumber || !formData.year || !formData.division) {
        setError("Roll Number, Year and Division are required for students");
        setLoading(false);
        return;
      }
    } else if (formData.role === "admin") {
      // Verify admin registration code
      if (formData.registrationCode !== ADMIN_CODE) {
        setError("Invalid admin registration code");
        setLoading(false);
        return;
      }
    } else if (formData.role === "committee") {
      // Verify committee registration code
      if (formData.registrationCode !== COMMITTEE_CODE) {
        setError("Invalid committee registration code");
        setLoading(false);
        return;
      }
    }

    try {
      // Convert skills string to array
      const skillsArray = formData.skills
        ? formData.skills.split(",").map((skill) => skill.trim())
        : [];

      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        rollNumber: formData.role === 'student' ? formData.rollNumber : 'N/A',
        year: formData.role === 'student' ? formData.year : 'N/A',
        division: formData.role === 'student' ? formData.division : 'N/A',
        skills: skillsArray,
        registrationCode: formData.registrationCode,
      };

      // Make actual API call
      const data = await authService.signup(userData);

      toast({
        title: "Success",
        description:
          "Account created successfully! Please check your email to verify your account.",
      });

      // Redirect based on role
      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else if (userData.role === "committee") {
        navigate("/member/dashboard");
      } else if (userData.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/dashboard"); // Fallback default
      }
    } catch (err) {
      console.error("Signup error:", err);

      // Better error handling to show specific API error messages
      let errorMessage = "Failed to create account. Please try again.";

      if (err.response?.data?.message) {
        // If the API returns a specific error message
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorMessage = "Invalid registration code or insufficient permissions";
      } else if (err.response?.status === 409 || err.response?.status === 400) {
        errorMessage = "User with this email already exists";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Determine which role-specific fields to show
  const isStudent = formData.role === "student";
  const isAdminOrCommittee =
    formData.role === "admin" || formData.role === "committee";

  return (
    <div className="font-helvetica relative min-h-screen">
      <ThreeDBackground />
      <Navbar />
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-background/80 backdrop-blur-xl p-8 rounded-xl border border-border/50 shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-foreground">
              Create your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="email-address">Email address</Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange("role", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="committee">Committee Member</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isAdminOrCommittee && (
                <>
                  <Separator className="my-4" />
                  <h3 className="text-lg font-medium">
                    {formData.role === "admin" ? "Admin" : "Committee Member"}{" "}
                    Registration
                  </h3>

                  <div>
                    <Label htmlFor="registrationCode">Registration Code</Label>
                    <Input
                      id="registrationCode"
                      name="registrationCode"
                      type="password"
                      required={isAdminOrCommittee}
                      className="mt-1"
                      placeholder="Enter registration code"
                      value={formData.registrationCode}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Contact the system administrator to get a registration
                      code.
                    </p>
                  </div>
                </>
              )}

              {isStudent && (
                <>
                  <Separator className="my-4" />
                  <h3 className="text-lg font-medium">Student Information</h3>

                  <div>
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input
                      id="rollNumber"
                      name="rollNumber"
                      type="text"
                      required={isStudent}
                      className="mt-1"
                      placeholder="Roll Number"
                      value={formData.rollNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="year">Year</Label>
                      <Select
                        value={formData.year}
                        onValueChange={(value) =>
                          handleSelectChange("year", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FE">FE</SelectItem>
                          <SelectItem value="SE">SE</SelectItem>
                          <SelectItem value="TE">TE</SelectItem>
                          <SelectItem value="BE">BE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="division">Division</Label>
                      <Select
                        value={formData.division}
                        onValueChange={(value) =>
                          handleSelectChange("division", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select division" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  type="text"
                  className="mt-1"
                  placeholder="e.g. JavaScript, React, Node.js"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>

              <Separator className="my-4" />

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  className="mt-1"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-neon-blue hover:bg-neon-blue/90"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign up"}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
