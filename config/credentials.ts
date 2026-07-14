function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env and set credentials.`,
    );
  }
  return value;
}

function envOrDefault(name: string, defaultValue: string): string {
  return process.env[name] ?? defaultValue;
}

export const credentials = {
  password: requireEnv('SAUCE_PASSWORD'),
  standardUser: envOrDefault('STANDARD_USER', 'standard_user'),
  lockedOutUser: envOrDefault('LOCKED_OUT_USER', 'locked_out_user'),
  problemUser: envOrDefault('PROBLEM_USER', 'problem_user'),
  performanceGlitchUser: envOrDefault('PERFORMANCE_GLITCH_USER', 'performance_glitch_user'),
  errorUser: envOrDefault('ERROR_USER', 'error_user'),
  visualUser: envOrDefault('VISUAL_USER', 'visual_user'),
} as const;
