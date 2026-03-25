/**
 * Membership tiers — fetched from Supabase via /api/db proxy.
 * Replaces the old Zustand localStorage store.
 */
import { useQuery } from '@tanstack/react-query'
import { getMemberships } from '@/lib/db/client'

export interface MembershipTier {
  id: string
  name: string
  price: number
  discountRate: number
  durationMonths: number
  description: string
  features?: string[]
  active?: boolean
}

function toTier(row: any): MembershipTier {
  return {
    id: row.id,
    name: row.name ?? '',
    price: row.price ?? 0,
    discountRate: row.discount_rate ?? 0,
    durationMonths: row.duration_months ?? 12,
    description: row.description ?? '',
    features: row.features ?? [],
    active: row.active ?? true,
  }
}

export function useMembershipTiers(shopId: string) {
  return useQuery<MembershipTier[]>({
    queryKey: ['memberships', shopId],
    queryFn: async () => {
      const rows = await getMemberships(shopId)
      return (rows ?? []).map(toTier)
    },
    enabled: !!shopId,
    staleTime: 60_000,
  })
}

// Backward compat — old useMembershipStore hook (returns empty tiers, consumers should migrate)
export const useMembershipStore = (selector: (s: { tiers: MembershipTier[]; isHydrated: boolean }) => any) => {
  return selector({ tiers: [], isHydrated: true })
}
