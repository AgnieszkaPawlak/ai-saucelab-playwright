function requireEnv(name: string, aliases: readonly string[] = []): string {
  const candidates = [name, ...aliases];
  for (const candidate of candidates) {
    const value = process.env[candidate];
    if (value) {
      return value;
    }
  }

  throw new Error(
    `Missing required environment variable ${name}. Copy .env.example to .env locally, or configure secrets.SAUCE_PASSWORD in GitHub Actions.`,
  );
}

function envOrDefault(name: string, defaultValue: string): string {
  return process.env[name] ?? defaultValue;
}

export const credentials = {
  password: requireEnv('SAUCE_PASSWORD', ['STANDARD_PASSWORD']),
  standardUser: envOrDefault('STANDARD_USER', 'standard_user'),
  lockedOutUser: envOrDefault('LOCKED_OUT_USER', 'locked_out_user'),
  problemUser: envOrDefault('PROBLEM_USER', 'problem_user'),
  performanceGlitchUser: envOrDefault('PERFORMANCE_GLITCH_USER', 'performance_glitch_user'),
  errorUser: envOrDefault('ERROR_USER', 'error_user'),
  visualUser: envOrDefault('VISUAL_USER', 'visual_user'),
} as const;
