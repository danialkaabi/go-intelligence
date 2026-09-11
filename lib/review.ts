import type { ReviewFlag } from '@/data/types';

/**
 * Entity-review vocabulary.
 *
 * A name on its own does not identify a legal entity. Where the source list
 * could not pin one down, the record carries flags saying why — so the
 * uncertainty is visible on the profile rather than lost on import.
 */
export const REVIEW_FLAG_LABELS: Record<ReviewFlag, string> = {
  'ambiguous-name':
    'Generic or abbreviated name may match multiple legal entities',
  'no-flag': 'No readable flag; exact legal entity not uniquely confirmed',
  'ocr-normalised':
    'OCR spelling was normalised and should be checked against an official name',
};

export const REVIEW_FLAG_SHORT: Record<ReviewFlag, string> = {
  'ambiguous-name': 'Ambiguous name',
  'no-flag': 'Country unconfirmed',
  'ocr-normalised': 'OCR spelling',
};

/** What would settle the question, for every flagged record. */
export const REVIEW_RESOLUTION =
  'Official website, company registration number, or full registered legal name';
