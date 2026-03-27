// @ts-nocheck
// FROZEN — no new functions. New features should use domain-specific API routes.
// See REFACTORING-PLAN.md for the migration plan.
/**
 * Client-safe DB helper — all calls go through /api/db proxy (secure, uses service role key).
 * RLS stays enabled on all tables for security.
 */

async function dbCall(body: Record<string, unknown>) {
  const res = await fetch('/api/db', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (json.error) console.warn('dbCall error:', json.error)
  return json.data
}

// Alias for reads — same proxy, just cleaner API
function dbRead(table: string, shopId: string, options?: {
  filters?: Record<string, unknown>
  select?: string
  order?: { column: string; ascending?: boolean }
  limit?: number
  single?: boolean
}) {
  return dbCall({
    action: options?.single ? 'select_single' : 'select',
    table,
    shopId,
    filters: options?.filters,
    select: options?.select,
    order: options?.order,
    limit: options?.limit,
  })
}

// ── Orders ─────────────────────────────────────────
export async function getOrders(shopId: string) {
  return dbRead('orders', shopId, { order: { column: 'created_at', ascending: false } })
}
export async function getOrderById(shopId: string, id: string) {
  return dbRead('orders', shopId, { filters: { id }, single: true })
}
export async function createOrder(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'orders', shopId, data })
}
export async function updateOrder(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'orders', shopId, id, data })
}
export async function deleteOrder(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'orders', shopId, id })
}
export async function duplicateOrder(shopId: string, id: string) {
  const original: any = await getOrderById(shopId, id)
  if (!original) throw new Error('Order not found')
  const { id: _id, seq_id: _seq, created_at: _ca, updated_at: _ua, shop_id: _sid, ...rest } = original
  return dbCall({ action: 'insert', table: 'orders', shopId, data: { ...rest, status: 'Draft' } })
}

// ── Payments ───────────────────────────────────────
export async function getPayments(shopId: string) {
  return dbRead('payments', shopId, { order: { column: 'created_at', ascending: false } })
}

// ── Inventory ──────────────────────────────────────
export async function getStockItems(shopId: string) {
  return dbRead('inventory_items', shopId)
}
export async function getStockItemById(shopId: string, id: string) {
  return dbRead('inventory_items', shopId, { filters: { id }, single: true })
}
export async function createStockItem(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'inventory_items', shopId, data })
}
export async function updateStockItem(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'inventory_items', shopId, id, data })
}
export async function deleteStockItem(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'inventory_items', shopId, id })
}
export async function getStockLogs(shopId: string) {
  return dbRead('stock_logs', shopId, { order: { column: 'created_at', ascending: false } })
}
export async function createStockLog(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'stock_logs', shopId, data })
}
export async function deleteStockLog(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'stock_logs', shopId, id })
}
export async function getSuppliers(shopId: string) {
  return dbRead('suppliers', shopId, { order: { column: 'created_at', ascending: false } })
}
export async function getSupplierById(shopId: string, id: string) {
  return dbRead('suppliers', shopId, { filters: { id }, single: true })
}
export async function createSupplier(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'suppliers', shopId, data })
}
export async function updateSupplier(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'suppliers', shopId, id, data })
}
export async function deleteSupplier(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'suppliers', shopId, id })
}

// ── Storefront ─────────────────────────────────────
export async function getStoreSettings(shopId: string) {
  return dbRead('store_settings', shopId, { single: true })
}
export async function saveStoreSettings(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'upsert', table: 'store_settings', shopId, data, filters: { onConflict: 'shop_id' } })
}
export async function getStorePages(shopId: string) {
  return dbRead('store_pages', shopId)
}
export async function getAbandonedCarts(shopId: string) {
  return dbRead('abandoned_carts', shopId, { order: { column: 'updated_at', ascending: false } })
}
export async function deleteAbandonedCart(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'abandoned_carts', shopId, id })
}
export async function clearAllAbandonedCarts(shopId: string) {
  const carts: any[] = await getAbandonedCarts(shopId) as any[] || []
  for (const c of carts) await deleteAbandonedCart(shopId, c.id)
}
export async function upsertAbandonedCart(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'upsert', table: 'abandoned_carts', shopId, data, filters: { onConflict: 'session_id' } })
}
export async function deleteAbandonedCartBySession(shopId: string, sessionId: string) {
  // select by session_id then delete by id
  const cart = await dbCall({ action: 'select_single', table: 'abandoned_carts', shopId, filters: { session_id: sessionId } })
  if (cart) return dbCall({ action: 'delete', table: 'abandoned_carts', shopId, id: cart.id })
}

// ── Catalog ────────────────────────────────────────
export async function getProducts(shopId: string) {
  return dbRead('products', shopId, { order: { column: 'created_at', ascending: false } })
}
export async function getProductById(shopId: string, id: string) {
  return dbRead('products', shopId, { filters: { id }, single: true })
}
export async function getProductBySlug(shopId: string, slug: string) {
  return dbRead('products', shopId, { filters: { slug }, single: true })
}
export async function createProduct(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'products', shopId, data })
}
export async function updateProduct(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'products', shopId, id, data })
}
export async function deleteProduct(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'products', shopId, id })
}
export async function getCategories(shopId: string) {
  return dbRead('categories', shopId, { order: { column: 'name', ascending: true } })
}
export async function createCategory(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'categories', shopId, data })
}
export async function updateCategory(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'categories', shopId, id, data })
}
export async function deleteCategory(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'categories', shopId, id })
}

// ── Customers ──────────────────────────────────────
export async function getCustomers(shopId: string) {
  return dbRead('customers', shopId, { order: { column: 'created_at', ascending: false } })
}
export async function getCustomerById(shopId: string, id: string) {
  return dbRead('customers', shopId, { filters: { id }, single: true })
}
export async function createCustomer(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'customers', shopId, data })
}
export async function updateCustomer(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'customers', shopId, id, data })
}
export async function deleteCustomer(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'customers', shopId, id })
}

// ── Agents ─────────────────────────────────────────
export async function getAgents(shopId: string) {
  return dbRead('agents', shopId, { order: { column: 'created_at', ascending: false } })
}
export async function getAgentById(shopId: string, id: string) {
  return dbRead('agents', shopId, { filters: { id }, single: true })
}
export async function createAgent(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'agents', shopId, data })
}
export async function updateAgent(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'agents', shopId, id, data })
}
export async function deleteAgent(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'agents', shopId, id })
}
export async function getWalletEntries(shopId: string, agentId: string) {
  return dbCall({ action: 'select', table: 'wallet_entries', shopId, filters: { agent_id: agentId }, order: { column: 'created_at', ascending: false } })
}
export async function getTopupRequests(shopId: string, agentId?: string) {
  const filters: Record<string, unknown> = {}
  if (agentId) filters.agent_id = agentId
  return dbCall({ action: 'select', table: 'topup_requests', shopId, filters, order: { column: 'created_at', ascending: false } })
}
export async function createTopupRequest(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'topup_requests', shopId, data })
}
export async function updateTopupRequest(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'topup_requests', shopId, id, data })
}
export async function deleteTopupRequest(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'topup_requests', shopId, id })
}

// ── Affiliates ─────────────────────────────────────
export async function getAffiliates(shopId: string) {
  return dbRead('affiliates', shopId, { order: { column: 'created_at', ascending: false } })
}
export async function getAffiliateById(shopId: string, id: string) {
  return dbRead('affiliates', shopId, { filters: { id }, single: true })
}
export async function createAffiliate(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'affiliates', shopId, data })
}
export async function updateAffiliate(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'affiliates', shopId, id, data })
}
export async function deleteAffiliate(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'affiliates', shopId, id })
}
export async function getAffiliateOrders(shopId: string) {
  return dbCall({ action: 'select', table: 'affiliate_orders', shopId, order: { column: 'created_at', ascending: false } })
}
export async function getAffiliateOrdersByAffiliate(shopId: string, affiliateId: string) {
  return dbCall({ action: 'select', table: 'affiliate_orders', shopId, filters: { affiliate_id: affiliateId }, order: { column: 'created_at', ascending: false } })
}
export async function getPayoutRequests(shopId: string, affiliateId?: string) {
  const filters: Record<string, unknown> = {}
  if (affiliateId) filters.affiliate_id = affiliateId
  return dbCall({ action: 'select', table: 'payout_requests', shopId, filters, order: { column: 'created_at', ascending: false } })
}
export async function updatePayoutRequest(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'payout_requests', shopId, id, data })
}

// ── Bundles ────────────────────────────────────────
export async function getBundles(shopId: string) {
  return dbRead('bundles', shopId, { order: { column: 'created_at', ascending: false } })
}
export async function getBundleById(shopId: string, id: string) {
  return dbRead('bundles', shopId, { filters: { id }, single: true })
}
export async function createBundle(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'bundles', shopId, data })
}
export async function updateBundle(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'bundles', shopId, id, data })
}
export async function deleteBundle(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'bundles', shopId, id })
}

// ── Memberships ────────────────────────────────────
export async function getMemberships(shopId: string) {
  return dbRead('memberships', shopId, { order: { column: 'created_at', ascending: false } })
}
export async function createMembership(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'memberships', shopId, data })
}
export async function updateMembership(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'memberships', shopId, id, data })
}
export async function deleteMembership(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'memberships', shopId, id })
}
export async function getMembershipRequests(shopId: string) {
  return dbCall({ action: 'select', table: 'membership_requests', shopId, order: { column: 'created_at', ascending: false } })
}
export async function getMembershipRequestById(shopId: string, id: string) {
  return dbCall({ action: 'select_single', table: 'membership_requests', shopId, filters: { id } })
}
export async function createMembershipRequest(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'membership_requests', shopId, data })
}
export async function updateMembershipRequest(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'membership_requests', shopId, id, data })
}
export async function deleteMembershipRequest(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'membership_requests', shopId, id })
}

// ── Discounts ──────────────────────────────────────
export async function getDiscounts(shopId: string) {
  return dbRead('discounts', shopId, { order: { column: 'created_at', ascending: false } })
}
export async function getDiscountById(shopId: string, id: string) {
  return dbRead('discounts', shopId, { filters: { id }, single: true })
}
export async function createDiscount(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'discounts', shopId, data })
}
export async function updateDiscount(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'discounts', shopId, id, data })
}
export async function deleteDiscount(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'discounts', shopId, id })
}

// ── Content Pages ──────────────────────────────────
export async function getContentPages(shopId: string) {
  return dbRead('content_pages', shopId, { order: { column: 'created_at', ascending: false } })
}
export async function getContentPageById(shopId: string, id: string) {
  return dbRead('content_pages', shopId, { filters: { id }, single: true })
}
export async function createContentPage(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'content_pages', shopId, data })
}
export async function updateContentPage(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'content_pages', shopId, id, data })
}
export async function deleteContentPage(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'content_pages', shopId, id })
}
export async function getMessageTemplates(shopId: string) {
  return dbRead('message_templates', shopId)
}
export async function saveMessageTemplate(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'upsert', table: 'message_templates', shopId, data, filters: { onConflict: 'shop_id,type' } })
}

// ── Campaigns / Marketing ──────────────────────────
export async function getCampaigns(shopId: string) {
  return dbRead('campaigns', shopId, { order: { column: 'created_at', ascending: false } })
}
export async function getCampaignById(shopId: string, id: string) {
  return dbRead('campaigns', shopId, { filters: { id }, single: true })
}
export async function createCampaign(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'campaigns', shopId, data })
}
export async function updateCampaign(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'campaigns', shopId, id, data })
}
export async function deleteCampaign(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'campaigns', shopId, id })
}

// ── Reviews ────────────────────────────────────────
export async function getReviews(shopId: string) {
  return dbRead('reviews', shopId, { order: { column: 'created_at', ascending: false } })
}
export async function getReviewById(shopId: string, id: string) {
  return dbRead('reviews', shopId, { filters: { id }, single: true })
}
export async function updateReview(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'reviews', shopId, id, data })
}
export async function deleteReview(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'reviews', shopId, id })
}

// ── Notifications ──────────────────────────────────
export async function getUnreadCount(shopId: string) {
  const rows = await dbCall({ action: 'select', table: 'notifications', shopId, filters: { read: false }, select: 'id' })
  return rows?.length ?? 0
}
export async function getNotifications(shopId: string) {
  return dbRead('notifications', shopId, { order: { column: 'created_at', ascending: false } })
}
export async function addNotification(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'notifications', shopId, data })
}
export async function markRead(shopId: string, id: string) {
  return dbCall({ action: 'update', table: 'notifications', shopId, id, data: { read: true } })
}
export async function markUnread(shopId: string, id: string) {
  return dbCall({ action: 'update', table: 'notifications', shopId, id, data: { read: false } })
}
export async function markAllRead(shopId: string) {
  // Select all unread, then update each
  const rows = await dbCall({ action: 'select', table: 'notifications', shopId, filters: { read: false }, select: 'id' })
  if (rows) for (const r of rows) await markRead(shopId, r.id)
}
export async function toggleStar(shopId: string, id: string, starred: boolean) {
  return dbCall({ action: 'update', table: 'notifications', shopId, id, data: { starred } })
}
export async function deleteNotification(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'notifications', shopId, id })
}
export async function bulkMarkRead(shopId: string, ids: string[]) {
  for (const id of ids) await markRead(shopId, id)
}
export async function bulkMarkUnread(shopId: string, ids: string[]) {
  for (const id of ids) await markUnread(shopId, id)
}
export async function bulkStar(shopId: string, ids: string[], starred: boolean) {
  for (const id of ids) await toggleStar(shopId, id, starred)
}
export async function bulkDelete(shopId: string, ids: string[]) {
  for (const id of ids) await deleteNotification(shopId, id)
}
export async function saveNotifPrefs(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'upsert', table: 'notification_prefs', shopId, data, filters: { onConflict: 'shop_id' } })
}

// ── Production ─────────────────────────────────────
export async function getBoards(shopId: string) {
  return dbRead('boards', shopId)
}
export async function getColumns(shopId: string, boardId: string) {
  return dbCall({ action: 'select', table: 'board_columns', shopId, filters: { board_id: boardId }, order: { column: 'position', ascending: true } })
}
export async function getCards(shopId: string, boardId: string) {
  return dbCall({ action: 'select', table: 'board_cards', shopId, filters: { board_id: boardId } })
}
export async function createCard(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'board_cards', shopId, data })
}
export async function updateCard(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'board_cards', shopId, id, data })
}
export async function moveCard(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'board_cards', shopId, id, data })
}
export async function addColumn(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'board_columns', shopId, data })
}
export async function renameColumn(shopId: string, id: string, data: Record<string, unknown>) {
  return dbCall({ action: 'update', table: 'board_columns', shopId, id, data })
}
export async function deleteColumn(shopId: string, id: string) {
  return dbCall({ action: 'delete', table: 'board_columns', shopId, id })
}

// ── Proofs ─────────────────────────────────────────
export async function getProofsByCard(shopId: string, cardId: string) {
  return dbCall({ action: 'select', table: 'proofs', shopId, filters: { card_id: cardId }, order: { column: 'created_at', ascending: true } })
}
export async function getProdCardState(shopId: string, cardId: string) {
  return dbCall({ action: 'select_single', table: 'prod_card_states', shopId, filters: { card_id: cardId } })
}
export async function setProdCardState(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'upsert', table: 'prod_card_states', shopId, data, filters: { onConflict: 'card_id' } })
}
export async function saveProof(shopId: string, data: Record<string, unknown>) {
  return dbCall({ action: 'insert', table: 'proofs', shopId, data })
}
