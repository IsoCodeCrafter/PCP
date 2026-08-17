// Clean, dependency-free ANSI logger
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m"
};

export const logger = {
  header(text) {
    console.log(`\n${colors.bold}${colors.cyan}=== ${text} ===${colors.reset}\n`);
  },
  info(text) {
    console.log(`${colors.blue}ℹ${colors.reset} ${text}`);
  },
  success(text) {
    console.log(`${colors.green}✔${colors.reset} ${text}`);
  },
  warn(text) {
    console.log(`${colors.yellow}⚠${colors.reset} ${colors.yellow}${text}${colors.reset}`);
  },
  error(text) {
    console.log(`${colors.red}✖${colors.reset} ${colors.red}${text}${colors.reset}`);
  },
  detail(label, value) {
    console.log(`  ${colors.dim}${label}:${colors.reset} ${value}`);
  },
  dim(text) {
    console.log(`${colors.dim}${text}${colors.reset}`);
  }
};
