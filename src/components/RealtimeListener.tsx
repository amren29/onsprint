'use client'

import { useShop } from '@/providers/shop-provider'
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders'

/**
 * Invisible component that subscribes to Supabase Realtime
 * for the current shop. Mount inside AppShell.
 */
export default function RealtimeListener() {
  const { shopId } = useShop()
  useRealtimeOrders(shopId)
  return null
}
