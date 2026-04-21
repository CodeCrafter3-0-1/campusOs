import { validateCollegeEmail, isPersonalEmail } from "@/lib/colleges";

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  collegeName: string;
  collegeVerified: boolean;
  collegeDomain: string;
  course: string;
  graduationYear: number;
  resumeScore?: number;
  resumeVerdict?: string;
  resumeStrengths?: string[];
  resumeMissing?: string[];
  lastAnalyzed?: string;
}

export function saveUser(user: UserData) {
  localStorage.setItem("campusos_user", JSON.stringify(user));
}

export function getUser(): UserData | null {
  try {
    const raw = localStorage.getItem("campusos_user");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function logoutUser() {
  localStorage.removeItem("campusos_user");
}

export function isLoggedIn(): boolean {
  return !!getUser();
}

export function getAllUsers(): UserData[] {
  try {
    const raw = localStorage.getItem("campusos_all_users");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function registerUserWithPassword(data: Omit<UserData, "id">, password: string): UserData {
  // Block personal emails
  if (isPersonalEmail(data.email)) {
    throw new Error("Personal email addresses (Gmail, Yahoo, etc.) are not allowed. Please use your official college email address.");
  }
  // Validate college email
  const validation = validateCollegeEmail(data.email);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }
  // Check duplicate
  const users = getAllUsers();
  const exists = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
  if (exists) {
    throw new Error("An account with this email already exists. Please login instead.");
  }
  // Password strength check
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }
  const user: UserData = {
    ...data,
    id: "user_" + Date.now(),
    collegeName: validation.college ? validation.college.name : data.collegeName,
    collegeVerified: true,
    collegeDomain: validation.domain,
  };
  users.push(user);
  localStorage.setItem("campusos_all_users", JSON.stringify(users));
  const passwords = JSON.parse(localStorage.getItem("campusos_passwords") || "{}");
  passwords[data.email.toLowerCase()] = password;
  localStorage.setItem("campusos_passwords", JSON.stringify(passwords));
  saveUser(user);
  return user;
}

export function loginUser(email: string, password: string): UserData {
  if (!email.trim() || !password.trim()) {
    throw new Error("Please enter both email and password.");
  }
  if (isPersonalEmail(email)) {
    throw new Error("Personal email addresses are not allowed. Please use your official college email.");
  }
  const validation = validateCollegeEmail(email);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }
  const users = getAllUsers();
  const passwords = JSON.parse(localStorage.getItem("campusos_passwords") || "{}");
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error("No account found with this email. Please signup first.");
  }
  if (passwords[email.toLowerCase()] && passwords[email.toLowerCase()] !== password) {
    throw new Error("Incorrect password. Please try again.");
  }
  saveUser(user);
  return user;
}

export function updateUserResume(resumeData: Partial<UserData>) {
  const user = getUser();
  if (!user) return;
  const updated = { ...user, ...resumeData, lastAnalyzed: new Date().toLocaleDateString() };
  saveUser(updated);
  const users = getAllUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx >= 0) {
    users[idx] = updated;
    localStorage.setItem("campusos_all_users", JSON.stringify(users));
  }
  return updated;
}

// Seed demo account with valid college email
export function seedDemoAccounts() {
  if (typeof window === "undefined") return;
  const users = getAllUsers();
  const passwords = JSON.parse(localStorage.getItem("campusos_passwords") || "{}");
  const demos = [
    { email: "aarav.sharma@lpu.in", name: "Aarav Sharma", college: "Lovely Professional University", domain: "lpu.in" },
    { email: "demo.student@vit.ac.in", name: "Demo Student", college: "VIT University", domain: "vit.ac.in" },
  ];
  demos.forEach(d => {
    if (!users.find(u => u.email === d.email)) {
      const user: UserData = { id: "demo_" + d.domain.replace(".", "_"), fullName: d.name, email: d.email, collegeName: d.college, collegeVerified: true, collegeDomain: d.domain, course: "MCA", graduationYear: 2027 };
      users.push(user);
      passwords[d.email] = "CampusOS@123";
    }
  });
  localStorage.setItem("campusos_all_users", JSON.stringify(users));
  localStorage.setItem("campusos_passwords", JSON.stringify(passwords));
}