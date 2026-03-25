'use client'

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { addNotification } from '@/lib/notification-store'

/**
 * Subscribe to real-time order inserts/updates for a shop.
 * Auto-invalidates the React Query 'orders' cache and fires a notification popup.
 */
export function useRealtimeOrders(shopId: string) {
  const qc = useQueryClient()
  const supabaseRef = useRef(createClient())

  useEffect(() => {
    if (!shopId) return

    const supabase = supabaseRef.current
    const channel = supabase
      .channel(`orders:${shopId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `shop_id=eq.${shopId}`,
        },
        (payload) => {
          const order = payload.new as any
          // Invalidate orders query so the list refreshes
          qc.invalidateQueries({ queryKey: ['orders', shopId] })
          // Also invalidate dashboard stats
          qc.invalidateQueries({ queryKey: ['dashboard'] })

          // Fire notification
          addNotification({
            type: 'success',
            title: 'New Order',
            message: `${order.customer_name || 'Customer'} — RM ${((order.grand_total || 0)).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`,
            link: `/orders/${order.id}`,
            source: 'new_order',
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `shop_id=eq.${shopId}`,
        },
        () => {
          // Just refresh the list on any update
          qc.invalidateQueries({ queryKey: ['orders', shopId] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [shopId, qc])
}
