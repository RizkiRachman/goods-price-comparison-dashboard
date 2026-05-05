import type { Unit } from '@/types/goods'

const UNIT_MAP: Record<string, Unit> = {
  PIECE: 'pcs',
  PCS: 'pcs',
  KG: 'kg',
  KILOGRAM: 'kg',
  GR: 'gr',
  GRAM: 'gr',
  LITER: 'liter',
  LTR: 'liter',
  ML: 'ml',
  PACK: 'pack',
  PKT: 'pack',
}

export function normalizeUnit(raw: string | null | undefined): Unit {
  if (!raw) return 'pcs'
  return UNIT_MAP[raw.toUpperCase()] ?? 'pcs'
}

export function normalizeCategory(raw: string | null | undefined): string {
  if (!raw || raw.toLowerCase() === 'unknown') return 'Uncategorized'
  return raw
}
