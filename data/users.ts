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

const USERNAME_BY_PERSONA: Record<UserPersona, string> = {
  standard: credentials.standardUser,
  locked_out: credentials.lockedOutUser,
  problem: credentials.problemUser,
  performance_glitch: credentials.performanceGlitchUser,
  error: credentials.errorUser,
  visual: credentials.visualUser,
};

export function getUser(persona: UserPersona): DemoUser {
  return {
    persona,
    username: USERNAME_BY_PERSONA[persona],
    password: credentials.password,
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
