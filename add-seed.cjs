const fs = require("fs");
const path = "C:/Users/Dell/Desktop/campus Os/2026-04-20-you-are-a-senior-full-stack-2/apps/web/src/app/login/page.tsx";
let code = fs.readFileSync(path, "utf8");
code = code.replace(
  'import { loginUser } from "@/lib/auth";',
  'import { loginUser } from "@/lib/auth";\nimport { useEffect } from "react";'
);
code = code.replace(
  '  const [error, setError] = useState("");',
  '  const [error, setError] = useState("");\n\n  useEffect(() => {\n    const users = JSON.parse(localStorage.getItem("campusos_all_users") || "[]");\n    const exists = users.find((u: any) => u.email === "aarav.sharma@lpu.edu.in");\n    if (!exists) {\n      users.push({ id: "demo_1", fullName: "Aarav Sharma", email: "aarav.sharma@lpu.edu.in", collegeName: "Lovely Professional University", course: "MCA", graduationYear: 2027 });\n      localStorage.setItem("campusos_all_users", JSON.stringify(users));\n      const passwords = JSON.parse(localStorage.getItem("campusos_passwords") || "{}");\n      passwords["aarav.sharma@lpu.edu.in"] = "CampusOS@123";\n      localStorage.setItem("campusos_passwords", JSON.stringify(passwords));\n    }\n  }, []);'
);
fs.writeFileSync(path, code, "utf8");
console.log("Demo account seeded!");
