const fs = require("fs");
const path = "C:/Users/Dell/Desktop/campus Os/2026-04-20-you-are-a-senior-full-stack-2/apps/web/src/components/app/app-shell.tsx";
let code = fs.readFileSync(path, "utf8");

code = code.replace(
  'import { Bell, Search } from "lucide-react";',
  'import { Bell, Search } from "lucide-react";\nimport { AIChatbot } from "@/components/app/ai-chatbot";'
);

code = code.replace(
  '      </div>\n    </div>\n  );\n}',
  '      </div>\n      <AIChatbot />\n    </div>\n  );\n}'
);

fs.writeFileSync(path, code, "utf8");
console.log("Chatbot added to app-shell!");
