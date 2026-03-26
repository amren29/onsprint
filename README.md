# Onsprint — Print Shop Management System

A **simple printshop system** built for one owner/operator, not a bloated SaaS.

## Core workflow

**Inquiry → Quote → Order → Artwork → Production → Ready → Delivered**

That's it.

You only need 6 screens.

## 1. Dashboard

Show today's work.

Cards:

* New inquiries
* Waiting for customer approval
* In production
* Ready for pickup
* Unpaid orders

Also show:

* today's due jobs
* overdue jobs
* low stock alerts

## 2. Customers

Keep it minimal.

Fields:

* name
* phone
* company
* email
* address
* notes

Useful extras:

* preferred pickup/delivery
* common order type
* tax info if needed

## 3. Quotes

This is the heart of the app.

Each quote should have:

* customer
* item name
* category
* size
* quantity
* material
* finishing
* unit price
* total price
* notes
* status: draft / sent / approved / rejected

### Suggested categories

* banner
* sticker
* flyer
* business card
* poster
* tshirt
* signage
* custom

### Pricing model

Use a flexible structure:

* base price
* material cost
* print cost
* finishing cost
* design fee
* rush fee
* discount

Formula:
`total = base + material + print + finishing + design + rush - discount`

Do not hardcode everything into one formula. Keep each piece separate.

## 4. Orders / Jobs

Once quote is approved, convert it into a job.

Fields:

* order number
* linked quote
* customer
* due date
* priority
* payment status
* production status
* assigned notes
* delivery method

### Production status

Use simple statuses:

* pending artwork
* waiting approval
* approved
* printing
* finishing
* ready
* delivered
* canceled

## 5. Artwork / Files

Very important for printshops.

Each order should allow:

* file upload
* preview link
* version number
* customer approval flag
* revision notes

Fields:

* filename
* type
* uploaded at
* version
* approved yes/no
* approved date
* comments

Keep a rule:
**Nothing goes to print until artwork is approved.**

## 6. Payments

Simple, not accounting software.

Fields:

* order total
* amount paid
* balance
* payment method
* payment date
* invoice number

Statuses:

* unpaid
* partial
* paid

---

# Recommended database tables

## customers

* id
* name
* phone
* email
* company
* address
* notes
* created_at
* updated_at

## quotes

* id
* quote_number
* customer_id
* status
* subtotal
* discount
* rush_fee
* total
* notes
* valid_until
* created_at
* updated_at

## quote_items

* id
* quote_id
* category
* item_name
* width
* height
* unit
* quantity
* material
* finishing
* unit_price
* line_total
* notes

## orders

* id
* order_number
* customer_id
* quote_id
* due_date
* priority
* status
* payment_status
* total_amount
* amount_paid
* balance
* delivery_method
* notes
* created_at
* updated_at

## order_items

* id
* order_id
* category
* item_name
* width
* height
* unit
* quantity
* material
* finishing
* unit_price
* line_total
* notes

## artwork_files

* id
* order_id
* file_url
* file_name
* version
* is_approved
* approved_at
* revision_note
* uploaded_at

## payments

* id
* order_id
* amount
* method
* reference_number
* paid_at
* notes

## inventory_items

* id
* name
* category
* unit
* quantity_on_hand
* reorder_level
* cost_per_unit
* notes

---

# Best MVP features

Build these first:

### Phase 1

* customer management
* quote creation
* quote to order conversion
* order status tracking
* payment tracking

### Phase 2

* file upload
* artwork approval
* printable job sheet
* reorder from past job

### Phase 3

* inventory deduction
* profit per order
* delivery tracking
* WhatsApp sharing for quotes/status

---

# UI layout

## Sidebar

* Dashboard
* Customers
* Quotes
* Orders
* Files
* Payments
* Inventory
* Settings

## Orders page

Table columns:

* order no
* customer
* item summary
* due date
* status
* payment
* total
* actions

## Order detail page

Sections:

* customer info
* items ordered
* artwork files
* approval history
* payment summary
* production notes
* timeline

---

# Practical rules for printshop workflow

These rules make the system useful:

### Rule 1

Quote can become order with one click.

### Rule 2

Order cannot move to printing unless artwork is approved.

### Rule 3

Balance must always auto-calculate:
`balance = total_amount - amount_paid`

### Rule 4

Overdue jobs should be highlighted.

### Rule 5

Repeat orders should be clonable.

That last one is very important in printshops.

---

# Suggested status colors

* pending: gray
* waiting approval: yellow
* printing: blue
* finishing: purple
* ready: green
* overdue: red

---

# Good starter tech decisions for your app

Since you said it's mainly for yourself:

* single user login is enough
* SQLite or Postgres both fine
* no need for multi-tenant
* no need for team roles yet
* use simple local/cloud file storage for artwork
* prioritize speed over perfection

---

# What not to build yet

Avoid these for now:

* full accounting
* HR/staff modules
* advanced analytics
* live machine integration
* customer self-service portal
* subscription billing
* complex permissions

They will slow you down.

---

# Best daily-use workflow

Use the app like this:

1. Add customer
2. Create quote
3. Customer agrees
4. Convert to order
5. Upload artwork
6. Mark approved
7. Move through production
8. Mark ready
9. Record payment
10. Mark delivered

If your app does this smoothly, it already has real value.

---

# Smart extras for later

These are high-value:

* generate PDF quote
* generate invoice
* WhatsApp "Ready for pickup"
* duplicate previous order
* search by phone number
* due-today filter
* monthly sales summary

---

# My honest recommendation

For a printshop app, your **real MVP** is:

* Customers
* Quotes
* Orders
* Artwork approval
* Payments

Everything else can wait.

If you want, next I can turn this into a **real Prisma schema + Next.js folder structure** for your app.
