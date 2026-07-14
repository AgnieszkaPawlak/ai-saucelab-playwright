export const PERSONA_THRESHOLDS = {
  standardLoginMaxMs: 3_000,
  glitchLoginMaxMs: 10_000,
} as const;

export const BROKEN_IMAGE_SRC_FRAGMENT = 'sl-404';

export type CartLinkCharacterization = {
  classList: string;
  hasErrorClass: boolean;
};

export function characterizeCartLink(classList: string): CartLinkCharacterization {
  return {
    classList,
    hasErrorClass: classList.split(/\s+/).includes('error'),
  };
}
