import { credentials } from '../config/credentials';

export type UserPersona =
  | 'standard'
  | 'locked_out'
  | 'problem'
  | 'performance_glitch'
  | 'error'
  | 'visual';

export type DemoUser = {
  persona: UserPersona;
  username: string;
  password: string;
};

const DEFAULT_PASSWORD = credentials.standardPassword;

const USERNAME_BY_PERSONA: Record<UserPersona, string> = {
  standard: credentials.standardUser,
  locked_out: credentials.lockedOutUser,
  problem: process.env.PROBLEM_USER ?? 'problem_user',
  performance_glitch: process.env.PERFORMANCE_GLITCH_USER ?? 'performance_glitch_user',
  error: process.env.ERROR_USER ?? 'error_user',
  visual: process.env.VISUAL_USER ?? 'visual_user',
};

export function getUser(persona: UserPersona): DemoUser {
  return {
    persona,
    username: USERNAME_BY_PERSONA[persona],
    password: DEFAULT_PASSWORD,
  };
}

export const USERS = {
  standard: getUser('standard'),
  locked_out: getUser('locked_out'),
  problem: getUser('problem'),
  performance_glitch: getUser('performance_glitch'),
  error: getUser('error'),
  visual: getUser('visual'),
} as const;
