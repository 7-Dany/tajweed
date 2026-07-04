import { z } from "zod"

/**
 * An `<Input type="number">` registered with react-hook-form yields "" when
 * empty, and `z.coerce.number()` turns "" into 0 (not NaN) — which would
 * silently submit `order: 0` instead of leaving it unset. This preprocesses
 * blank/undefined values to `undefined` first so "leave it blank" behaves
 * as expected.
 */
export const optionalOrderField = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) return undefined
  return Number(value)
}, z.number().int().optional())
