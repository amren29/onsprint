# Onsprint - Complete Test Plan

**Version**: 1.0
**Date**: 2026-03-30
**URL**: https://onsprint.mohamedamrin07.workers.dev
**Testers**: _______________

---

## How to Use This Document

1. Go through each section in order
2. Mark each test as: ✅ Pass | ❌ Fail | ⏭️ Skipped
3. If ❌ Fail, write what happened in the Notes column
4. Screenshot any bugs

---

## SECTION 1: REGISTRATION & LOGIN

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 1.1 | Register new account | Go to /register → fill name, email, password → Submit | Account created, redirected to onboarding | | |
| 1.2 | Login with email | Go to /login → enter email + password → Log In | Redirected to /dashboard | | |
| 1.3 | Login with Google | Go to /login → click Google → authorize | Redirected to /dashboard | | |
| 1.4 | Forgot password | Go to /login → click "Forgot Password" → enter email | Reset email received | | |
| 1.5 | Logout | Click logout button in topbar | Redirected to /login | | |
| 1.6 | Invalid login | Enter wrong password → Log In | Error message shown | | |

---

## SECTION 2: ONBOARDING

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 2.1 | Shop auto-creation | After first login | Shop created automatically with "My Print Shop" name | | |
| 2.2 | Dashboard welcome banner | Go to /dashboard | Getting Started checklist visible | | |
| 2.3 | Checklist items | Complete each checklist item | Progress bar updates | | |

---

## SECTION 3: DASHBOARD

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 3.1 | Dashboard loads | Go to /dashboard | Stats cards, chart, recent orders visible | | |
| 3.2 | Revenue chart | Check chart section | Bars show with revenue/expenses | | |
| 3.3 | Stat cards | Check Total Revenue, Active Orders, Online Revenue | Numbers display correctly | | |
| 3.4 | Recent orders table | Check bottom section | Last orders shown with status badges | | |
| 3.5 | Recent customers | Check right column | Customer names with order count | | |
| 3.6 | Dark mode | Click moon icon in topbar | All elements switch to dark theme | | |
| 3.7 | Light mode | Click sun icon in topbar | All elements switch to light theme | | |

---

## SECTION 4: ORDERS

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 4.1 | Orders list | Go to /orders | Table with all orders | | |
| 4.2 | Create order | Click "+ New Order" → fill customer, items, total → Save | Order created with seq_id (ORD0001) | | |
| 4.3 | Search orders | Type in search box | Orders filtered by name/seq_id | | |
| 4.4 | Filter by status | Click status tabs (All, Pending, Confirmed) | Table filters correctly | | |
| 4.5 | View order | Click order row or 3-dot → View | Order detail modal/page opens | | |
| 4.6 | Edit order | Click 3-dot → Edit | Edit page loads with order data | | |
| 4.7 | Change status | Change order status dropdown | Status updates, badge changes | | |
| 4.8 | Delete order | Click 3-dot → Delete → Confirm | Order removed from list | | |
| 4.9 | Order with items | Create order with multiple items | All items saved, total calculated | | |

---

## SECTION 5: CUSTOMERS

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 5.1 | Customers list | Go to /customers | Table with all customers | | |
| 5.2 | Create customer | Click "+ New Customer" → fill details → Save | Customer created with seq_id (C001) | | |
| 5.3 | Search customers | Type in search box | Customers filtered | | |
| 5.4 | View customer | Click customer name | View modal opens | | |
| 5.5 | Edit customer | 3-dot → Edit | Edit page with form | | |
| 5.6 | Delete customer | 3-dot → Delete → Confirm | Customer removed | | |
| 5.7 | Customer status | Change Active/Inactive | Badge updates | | |

---

## SECTION 6: PRODUCTS & CATALOG

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 6.1 | Products list | Go to /catalog | All products shown | | |
| 6.2 | Create product | Click "+ New Product" → fill name, category, pricing → Save | Product created | | |
| 6.3 | Edit product | Click product → edit fields → Save | Changes saved | | |
| 6.4 | Product categories | Check category filter | Products filtered by category | | |
| 6.5 | Product pricing | Set volume/sqft/fixed pricing | Prices saved correctly | | |
| 6.6 | Delete product | Delete a product | Removed from list | | |

---

## SECTION 7: PAYMENTS

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 7.1 | Payments list | Go to /payments | All payments shown | | |
| 7.2 | Record payment | Create new payment for an order | Payment linked to order | | |
| 7.3 | Payment status | Check Paid/Pending/Overdue | Correct badges shown | | |

---

## SECTION 8: STOCK & INVENTORY

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 8.1 | Stock list | Go to /stock | All inventory items | | |
| 8.2 | Add stock item | Click "+ New" → fill details → Save | Item created | | |
| 8.3 | Low stock badge | Set quantity below minimum | "Low" badge appears in sidebar | | |
| 8.4 | Stock logs | Go to /stock-logs | Stock movement history | | |

---

## SECTION 9: SUPPLIERS

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 9.1 | Suppliers list | Go to /suppliers | All suppliers shown | | |
| 9.2 | Create supplier | Click "+ New" → fill details → Save | Supplier created | | |
| 9.3 | Edit supplier | Click supplier → edit → Save | Changes saved | | |

---

## SECTION 10: PRODUCTION BOARD

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 10.1 | Board loads | Click "Printing Production" in sidebar | Kanban board with columns | | |
| 10.2 | 12 default columns | Check columns | New Order → Artwork Checking → ... → Done | | |
| 10.3 | Drag card | Drag an order card to next column | Card moves, status updates | | |
| 10.4 | Card details | Click a card | Card detail panel opens | | |

---

## SECTION 11: ONLINE STORE (Customer-facing)

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 11.1 | Store loads | Go to /s/{shop-slug} | Store homepage with products | | |
| 11.2 | Browse products | Click products | Product pages load | | |
| 11.3 | Product detail | Click a product | Price, description, images shown | | |
| 11.4 | Add to cart | Click "Add to Cart" | Item added, cart count updates | | |
| 11.5 | View cart | Click cart icon | Cart page with items and total | | |
| 11.6 | Customer register | Go to store → Register | Account created (no email verification) | | |
| 11.7 | Customer login | Go to store → Login | Logged in, sees account page | | |
| 11.8 | Place order | Fill checkout details → Submit | Order created, confirmation shown | | |
| 11.9 | Upload artwork | Upload file during order | File uploaded successfully | | |
| 11.10 | Track order | Go to /s/{slug}/track → enter order # | Order status shown | | |
| 11.11 | Customer account | Go to account page | Order history, wallet visible | | |

---

## SECTION 12: STOREFRONT ADMIN

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 12.1 | Store editor | Go to /storefront/editor | Visual editor loads | | |
| 12.2 | Store settings | Go to /storefront/settings | Logo, name, colors editable | | |
| 12.3 | Store products | Go to /storefront/products | Products listed for online store | | |
| 12.4 | Store orders | Go to /storefront/orders | Online orders listed | | |
| 12.5 | Store customers | Go to /storefront/customers | Store users listed | | |
| 12.6 | Analytics | Go to /storefront/analytics | Charts and metrics shown | | |
| 12.7 | Discounts | Create a discount code | Code saved | | |
| 12.8 | Bundles | Create a product bundle | Bundle saved | | |
| 12.9 | Reviews | Check reviews section | Reviews listed (if any) | | |
| 12.10 | SEO settings | Go to /storefront/seo | Meta title/description editable | | |

---

## SECTION 13: SETTINGS

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 13.1 | Profile settings | Go to /settings → Profile | Name, email, avatar shown | | |
| 13.2 | Update profile | Change name → Save | Name updated | | |
| 13.3 | Shop settings | Go to /settings → Shop | Shop name, slug editable | | |
| 13.4 | Billing section | Go to /settings → Billing | Plan info, upgrade options | | |
| 13.5 | Team members | Go to /settings → Team | Members listed with roles | | |
| 13.6 | Add team member | Invite by email | Member added | | |
| 13.7 | Notification prefs | Go to /settings → Notifications | Toggle notification types | | |

---

## SECTION 14: NOTIFICATIONS

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 14.1 | Bell icon | Click bell in topbar | Notification dropdown opens | | |
| 14.2 | Notification list | Check dropdown | Recent notifications shown | | |
| 14.3 | Mark as read | Click a notification | Marked as read | | |
| 14.4 | Mark all read | Click "Mark all read" | All cleared | | |

---

## SECTION 15: SEARCH

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 15.1 | Search palette | Press Cmd+K (or Cmd+F) | Search palette opens | | |
| 15.2 | Search orders | Type order number | Results shown | | |
| 15.3 | Search customers | Type customer name | Results shown | | |
| 15.4 | Navigate result | Click a search result | Goes to correct page | | |

---

## SECTION 16: MOBILE RESPONSIVE

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 16.1 | Mobile sidebar | Open on phone → tap hamburger | Sidebar slides in | | |
| 16.2 | Mobile close | Tap overlay or navigate | Sidebar closes | | |
| 16.3 | Mobile tables | Check tables on phone | Horizontal scroll works | | |
| 16.4 | Mobile forms | Fill forms on phone | Inputs usable, keyboard works | | |
| 16.5 | Mobile stat cards | Check dashboard on phone | Cards stack vertically | | |

---

## SECTION 17: SUPER ADMIN - LOGIN & ACCESS

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 17.1 | SA login page | Go to /superadmin/login | Blue-themed login page | | |
| 17.2 | SA Google login | Click Google → authorize | Logged in to /superadmin | | |
| 17.3 | SA email login | Enter admin email + password → Log In | Logged in to /superadmin | | |
| 17.4 | Non-admin blocked | Login as non-admin user | "Access denied" message | | |
| 17.5 | No shop needed | SA user goes to /login | Redirected to /superadmin (not onboarding) | | |

---

## SECTION 18: SUPER ADMIN - DASHBOARD

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 18.1 | Dashboard loads | Go to /superadmin | Stats cards, chart, recent shops, activity | | |
| 18.2 | Stat cards | Check Total Shops, Active Subs, Revenue, New | Numbers correct | | |
| 18.3 | Revenue chart | Check dual-bar chart | Bars with tooltips on hover | | |
| 18.4 | Recent shops | Check table | Last registered shops shown | | |
| 18.5 | Activity feed | Check right column | Recent audit actions shown | | |

---

## SECTION 19: SUPER ADMIN - SHOPS

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 19.1 | Shops list | Go to /superadmin/shops | All shops listed | | |
| 19.2 | Search shops | Type in search box | Filtered by name/slug | | |
| 19.3 | Filter by plan | Select plan from dropdown | Filtered correctly | | |
| 19.4 | Create shop | "+ Create Shop" → fill name, email, plan → Create | Shop created | | |
| 19.5 | Shop detail | Click a shop row | Detail page with stats, members, orders | | |
| 19.6 | Change plan | Detail → change plan dropdown → Save | Plan updated | | |
| 19.7 | Suspend shop | Detail → Suspend | Shop marked suspended | | |
| 19.8 | Unsuspend shop | Detail → Unsuspend | Shop active again | | |
| 19.9 | Send notification | Detail → Notify → fill title + message → Send | Notification sent | | |
| 19.10 | Impersonate | Detail → Impersonate → Confirm | Redirected to shop's dashboard | | |
| 19.11 | Transfer ownership | Detail → Transfer → enter email → Transfer | Owner changed | | |
| 19.12 | Delete shop | Detail → Danger Zone → type slug → Delete | Shop soft-deleted | | |
| 19.13 | Bulk select | Check multiple shops | Bulk action bar appears | | |
| 19.14 | Bulk suspend | Select shops → "Suspend Selected" → Confirm | All selected suspended | | |
| 19.15 | Bulk notify | Select shops → "Send Notification" → fill → Send | Notifications sent | | |
| 19.16 | Row menu | Click 3-dot on shop row | View/Delete options shown | | |

---

## SECTION 20: SUPER ADMIN - ORDERS, USERS, SUPPORT

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 20.1 | Orders list | Go to /superadmin/orders | All orders across all shops | | |
| 20.2 | Filter orders | Filter by status | Filtered correctly | | |
| 20.3 | Search orders | Search by order # or customer | Results shown | | |
| 20.4 | View order | 3-dot → View | ViewModal with order details | | |
| 20.5 | Users - Shop Admins | Go to /superadmin/users → "Shop Admins" tab | Only shop owners/admins | | |
| 20.6 | Users - Store Customers | Click "Store Customers" tab | Only store users | | |
| 20.7 | Users - Platform Admins | Click "Platform Admins" tab | Only super admins | | |
| 20.8 | Reset password | 3-dot → Reset Password → Confirm | Reset email sent | | |
| 20.9 | View user | 3-dot → View | User detail modal | | |
| 20.10 | Support tickets | Go to /superadmin/support | Tickets listed | | |
| 20.11 | Ticket detail | Click a ticket | Chat-style conversation | | |
| 20.12 | Reply to ticket | Type reply → Send | Message appears | | |
| 20.13 | Change ticket status | Change status dropdown | Status updated | | |
| 20.14 | Close ticket | 3-dot → Close Ticket → Confirm | Ticket closed | | |

---

## SECTION 21: SUPER ADMIN - FINANCE

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 21.1 | Subscriptions | Go to /superadmin/subscriptions | MRR, active/trial/expired stats | | |
| 21.2 | Subscription table | Check shop list | Plan, status, billing, expiry shown | | |
| 21.3 | Create coupon | Billing → Coupons → fill code, type, value → Create | Coupon created | | |
| 21.4 | Deactivate coupon | 3-dot → Deactivate → Confirm | Coupon inactive | | |
| 21.5 | Payment history | Billing → Payments tab | Transactions listed | | |
| 21.6 | Revenue share | Go to /superadmin/revenue-share | Shops with share % and earnings | | |
| 21.7 | Edit share % | Click % → type new value → Save | % updated, earnings recalculated | | |

---

## SECTION 22: SUPER ADMIN - PLATFORM

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 22.1 | Broadcast | Announcements → fill title, message → Broadcast | Sent to all shops | | |
| 22.2 | Announcement history | Check history table | Past announcements listed | | |
| 22.3 | Create template | Email Templates → "+ New Template" → fill → Save | Template saved | | |
| 22.4 | Edit template | 3-dot → Edit → change subject → Save | Template updated | | |
| 22.5 | Delete template | 3-dot → Delete → Confirm | Template removed | | |
| 22.6 | Add category | Catalog → type name → "Add to All Shops" | Category added to all shops | | |
| 22.7 | Rename category | Click Rename → type new name → Save | Name updated across shops | | |
| 22.8 | Create flag | Feature Flags → "+ New Flag" → fill → Create | Flag created | | |
| 22.9 | Toggle flag | Click toggle switch | Flag enabled/disabled | | |
| 22.10 | Delete flag | 3-dot → Delete → Confirm | Flag removed | | |
| 22.11 | Whitelabel config | Select shop → set domain + brand → Save | Settings saved | | |

---

## SECTION 23: SUPER ADMIN - SYSTEM

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 23.1 | Audit log | Go to /superadmin/audit | Actions logged with timestamps | | |
| 23.2 | Filter audit | Filter by action type | Filtered correctly | | |
| 23.3 | Health check | Go to /superadmin/health | Green status for database, auth, activity | | |
| 23.4 | Health refresh | Wait 30s or click Refresh | Auto-updates | | |
| 23.5 | Schedule maintenance | Maintenance → "+ Schedule" → fill → Schedule | Window created | | |
| 23.6 | Disable maintenance | 3-dot → Disable | Status changes to "Disabled" | | |
| 23.7 | Delete maintenance | 3-dot → Delete → Confirm | Window removed | | |
| 23.8 | Export shops | Exports → Shops → Download CSV | CSV file downloads | | |
| 23.9 | Export orders | Exports → Orders → Download CSV | CSV file downloads | | |
| 23.10 | Export revenue | Exports → Revenue → Download CSV | CSV file downloads | | |
| 23.11 | Add admin | Settings → type email → "Add Admin" | Admin added to table | | |
| 23.12 | Remove admin | Click Remove on another admin | Admin removed | | |
| 23.13 | Can't remove self | Check your own row | No Remove button | | |

---

## SECTION 24: SUPER ADMIN - ANALYTICS & SEARCH

| # | Test | Steps | Expected Result | Status | Notes |
|---|------|-------|-----------------|--------|-------|
| 24.1 | Revenue tab | Analytics → Revenue | Chart + total/previous/change stats | | |
| 24.2 | Period filter | Change to 7d/30d/90d/1y | Data updates | | |
| 24.3 | Growth tab | Analytics → Growth | Monthly growth table | | |
| 24.4 | Leaderboard tab | Analytics → Leaderboard | Top shops ranked | | |
| 24.5 | Churn tab | Analytics → Churn | At-risk + churned shops | | |
| 24.6 | Onboarding funnel | Go to /superadmin/onboarding | Funnel bars with % | | |
| 24.7 | Global search | Press Cmd+K → type query | Categorized results dropdown | | |
| 24.8 | Click search result | Click a result | Navigates to correct page | | |
| 24.9 | Bell notification | Check bell icon in topbar | Shows open ticket count | | |
| 24.10 | Bell dropdown | Click bell | Recent tickets listed | | |

---

## BUG REPORT TEMPLATE

If you find a bug, please fill this out:

| Field | Details |
|-------|---------|
| **Test #** | (e.g., 19.4) |
| **Page URL** | |
| **What you did** | |
| **What happened** | |
| **What should happen** | |
| **Screenshot** | (attach) |
| **Browser** | Chrome / Safari / Firefox |
| **Device** | Desktop / Mobile |

---

## SUMMARY

| Section | Total Tests | Pass | Fail | Skipped |
|---------|-----------|------|------|---------|
| Registration & Login | 6 | | | |
| Onboarding | 3 | | | |
| Dashboard | 7 | | | |
| Orders | 9 | | | |
| Customers | 7 | | | |
| Products & Catalog | 6 | | | |
| Payments | 3 | | | |
| Stock & Inventory | 4 | | | |
| Suppliers | 3 | | | |
| Production Board | 4 | | | |
| Online Store | 11 | | | |
| Storefront Admin | 10 | | | |
| Settings | 7 | | | |
| Notifications | 4 | | | |
| Search | 4 | | | |
| Mobile Responsive | 5 | | | |
| SA - Login & Access | 5 | | | |
| SA - Dashboard | 5 | | | |
| SA - Shops | 16 | | | |
| SA - Orders/Users/Support | 14 | | | |
| SA - Finance | 7 | | | |
| SA - Platform | 11 | | | |
| SA - System | 13 | | | |
| SA - Analytics & Search | 10 | | | |
| **TOTAL** | **173** | | | |
