export const credentials = {
  standardUser: process.env.STANDARD_USER ?? 'standard_user',
  standardPassword: process.env.STANDARD_PASSWORD ?? 'secret_sauce',
  lockedOutUser: process.env.LOCKED_OUT_USER ?? 'locked_out_user',
} as const;
