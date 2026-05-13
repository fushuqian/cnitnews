const fs = require('fs');
const p = 'C:\\Users\\fushu\\Documents\\trae_projects\\cnitnews\\src\\data\\articles.ts';
let c = fs.readFileSync(p, 'utf-8');

// Build the content as a TS template literal
const paras = [
  "## Three Lines of Bash That Shook the AI World",
  "",
  "A sheep farmer in Australia wrote three lines of bash. Eleven days later, OpenAI, Anthropic, and Hermes had all integrated his idea into their flagship AI coding tools.",
  "",
  "This is the story of how Geoffrey Huntley, a shepherd who spends more time with sheep than with servers, accidentally reshaped the future of AI programming.",
  "",
  "### The Problem That Everyone Ignored",
  "",
  "AI coding agents in 2026 are smart. Scary smart. They can write entire functions, debug complex systems, and refactor codebases in minutes.",
  "",
  'But they have one fatal flaw: they never finish the job.',
  "",
  'You give an agent a task. It runs three rounds, edits two files, then stops and asks: "What would you like me to do next?"',
  "",
  "The bug isnt fixed. The feature isnt complete. But the AI is perfectly happy to move on.",
  "",
  "Every major AI lab had this problem. None of them had solved it. Then a farmer stepped in.",
  "",
  "### The Ralph Loop",
  "",
  "Geoffrey Huntleys solution was brutally simple:",
  "",
  'while : do',
  '  cat PROMPT.md | claude-code --continue',
  'done',
  "",
  "Thats it. An infinite loop that keeps feeding the same prompt to Claude Code over and over. Progress is tracked in the file system and git history. When context fills up, start a new instance and keep going.",
  "",
  'He called it the Ralph Loop, named after Ralph Wiggum from The Simpsons, that perpetually clueless but endlessly persistent kid who never gives up.',
  "",
  "Raw. Inelegant. Devastatingly effective.",
  "",
  "### 11 Days That Changed AI Coding",
  "",
  "On April 30, OpenAIs Codex launched goal. Greg Brockman posted on X: Codex now has built-in Ralph loop++.",
  "",
  "A week later, Hermes Agent followed. Then Claude Code. Eleven days. Three companies. Same command. Same inspiration.",
  "",
  "But their implementations could not be more different.",
  "",
  "Codex Never Forgets OpenAIs approach is the cleanest. goal creates a persistent workflow object stored in a local database. Close your terminal. Shut down your laptop. Restart your system. The goal survives. One user ran a device driver project for 14 hours straight, slept for 5 hours, and Codex resumed exactly where it left off.",
  "",
  "Hermes Agent Never Quits Hermes went biggest. Their goal is just the tip of a multi-agent kanban system built on SQLite. You create a task card, Hermes breaks it into subtasks and assigns them to different agent workers, each with its own identity, model config, and working directory. It comes with five layers of anti-quitting protection, including heartbeat detection, zombie reclamation, hallucination interception (actually verifying files were created), and retry budgets.",
  "",
  "Claude Code Doesnt Lie to Itself An throws approach is the cleverest. After each round, Claude Code doesnt get to decide if its done. Instead, it sends the conversation record and completion criteria to a separate small model (Haiku) to judge. The judge model doesnt use tools, doesnt read files, doesnt run commands. It just reads the conversation and decides: is the job actually done? The coder and the verifier are never the same entity.",
  "",
  "### Why This Matters",
  "",
  "AI coding is shifting from generating code to closing the loop. The most important breakthrough of 2026 might not be a bigger, smarter model. It might be a three-line bash script written by a man who spends his days herding sheep.",
];

const contentValue = paras.join('\n');

const newArticle = [
  "  {",
  "    id: '22',",
  "    title: 'A Sheep Farmer Just Changed How AI Codes: The goal Revolution That Took 11 Days',",
  "    slug: 'australian-sheep-farmer-ai-goal-mode',",
  "    summary: 'Geoffrey Huntley 3-line bash script inspired OpenAI, Anthropic, and Nous Research to adopt goal mode within 11 days, proving the key to AGI might not be smarter models but models that finish the job.',",
  "    content: `" + contentValue + "`,",
  "    category: 'ai',",
  "    tags: ['AI', 'Claude Code', 'OpenAI', 'AI Programming', 'Innovation'],",
  "    author: 'CN Geeker',",
  "    publishedAt: '2026-05-14',",
  "    imageUrl: '/images/articles/claude-code-goal-mode.jpg',",
  "  },",
].join('\n');

// Find article 22 and replace
const startIdx = c.indexOf("id: '22'");
const endIdx = c.indexOf("  },\n", c.indexOf("imageUrl:", startIdx));
const nextEnd = c.indexOf("  },\n", endIdx + 4);

if (startIdx > 0 && nextEnd > startIdx) {
  c = c.substring(0, startIdx) + newArticle + '\n' + c.substring(nextEnd);
  fs.writeFileSync(p, c, 'utf-8');
  console.log('✅ Article 22 rewritten');
} else {
  console.log('❌ Could not find article 22 boundaries');
}
