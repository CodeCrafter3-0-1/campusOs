// This seeds the demo account into localStorage on first visit
export function seedDemoAccount() {
  if (typeof window === "undefined") return;
  const users = JSON.parse(localStorage.getItem("campusos_all_users") || "[]");
  const exists = users.find((u: any) => u.email === "aarav.sharma@lpu.edu.in");
  if (!exists) {
    users.push({ id: "demo_1", fullName: "Aarav Sharma", email: "aarav.sharma@lpu.edu.in", collegeName: "Lovely Professional University", course: "MCA", graduationYear: 2027 });
    localStorage.setItem("campusos_all_users", JSON.stringify(users));
    const passwords = JSON.parse(localStorage.getItem("campusos_passwords") || "{}");
    passwords["aarav.sharma@lpu.edu.in"] = "CampusOS@123";
    localStorage.setItem("campusos_passwords", JSON.stringify(passwords));
  }
}
