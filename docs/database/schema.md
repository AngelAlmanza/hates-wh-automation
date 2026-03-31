# Database Schema

## Overview

PostgreSQL database managed via Prisma ORM. Supports the product catalog, ingredient tracking, and order management for the WhatsApp order automation system.

---

## Enums

| Enum | Values | Description |
|------|--------|-------------|
| `DeliveryMode` | `PICKUP`, `DELIVERY` | Order delivery method |
| `PaymentMethod` | `CASH`, `TRANSFER` | Payment method |
| `OrderStatus` | `PENDING`, `IN_PREPARATION`, `READY`, `DELIVERED`, `CANCELLED` | Order lifecycle states |

### Order Status Flow

```
PENDING → IN_PREPARATION → READY → DELIVERED
                                  ↘ CANCELLED
```

---

## Entity Relationship Diagram

```
Category 1──* Product 1──* ProductVariant
                  │
                  *──* Ingredient  (via ProductIngredient)
                  │
                  1──* OrderItem *──1 Order
                         │
                         ├──* OrderItemRemovedIngredient
                         └──* OrderItemExtra

User 1──* Order
User 1──* RefreshToken
```

---

## Models

### Category

Visual grouping for products. No activation/deactivation at category level.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | |
| `name` | String | required | Category name |
| `description` | String | nullable | Optional description |
| `sort_order` | Int | default: 0 | Display order |
| `created_at` | DateTime | auto | |
| `updated_at` | DateTime | auto | |

---

### Product

Menu item that can be activated/deactivated individually.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | |
| `category_id` | UUID | FK → categories (Restrict) | Visual grouping |
| `name` | String | required | Product name |
| `description` | String | nullable | Optional description |
| `price` | Decimal(10,2) | **nullable** | Null when product has variants |
| `image_url` | String | nullable | Product image |
| `is_active` | Boolean | default: true | Controls availability in bot |
| `sort_order` | Int | default: 0 | Display order within category |
| `created_at` | DateTime | auto | |
| `updated_at` | DateTime | auto | |

**Indexes:** `category_id`, `is_active`

> **Note:** `price` is null when the product has variants — the price lives on each `ProductVariant` instead.

---

### ProductVariant

Size/type variants for a product, each with its own price.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | |
| `product_id` | UUID | FK → products (Cascade) | Parent product |
| `name` | String | required | Variant name (e.g., "Chico", "Grande") |
| `price` | Decimal(10,2) | required | Variant price |
| `is_active` | Boolean | default: true | Controls availability |
| `sort_order` | Int | default: 0 | Display order |
| `created_at` | DateTime | auto | |
| `updated_at` | DateTime | auto | |

**Index:** `product_id`

---

### Ingredient

Shared catalog of ingredients used across products.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | |
| `name` | String | unique | Ingredient name |
| `created_at` | DateTime | auto | |
| `updated_at` | DateTime | auto | |

---

### ProductIngredient

Join table: which ingredients a product contains.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | |
| `product_id` | UUID | FK → products (Cascade) | |
| `ingredient_id` | UUID | FK → ingredients (Cascade) | |

**Unique:** `[product_id, ingredient_id]`

---

### Order

A customer order (comanda) with daily consecutive folio.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | |
| `order_date` | Date | required | Date-only for folio grouping |
| `daily_folio` | Int | required | Consecutive number per day (#1, #2...) |
| `customer_name` | String | required | Customer name |
| `delivery_mode` | DeliveryMode | required | PICKUP or DELIVERY |
| `location_url` | String | nullable | Google Maps link (delivery only) |
| `status` | OrderStatus | default: PENDING | Current order status |
| `payment_method` | PaymentMethod | required | CASH or TRANSFER |
| `is_paid` | Boolean | default: false | Payment confirmed? |
| `notes` | String | nullable | General order notes |
| `created_by_id` | UUID | FK → users (SetNull), nullable | Staff who created the order |
| `created_at` | DateTime | auto | |
| `updated_at` | DateTime | auto | |

**Unique:** `[order_date, daily_folio]`
**Indexes:** `order_date`, `status`, `created_at`

#### Daily Folio Logic

The folio resets to 1 each day. Assigned in a transaction:

```typescript
const lastOrder = await tx.order.findFirst({
  where: { orderDate: today },
  orderBy: { dailyFolio: 'desc' },
});
const nextFolio = (lastOrder?.dailyFolio ?? 0) + 1;
```

The unique constraint `[order_date, daily_folio]` prevents duplicates under concurrency.

---

### OrderItem

A line item in an order. Snapshots product info for historical accuracy.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | |
| `order_id` | UUID | FK → orders (Cascade) | Parent order |
| `product_id` | UUID | FK → products (Restrict) | Referenced product |
| `variant_id` | UUID | FK → product_variants (Restrict), nullable | Referenced variant |
| `quantity` | Int | default: 1 | Item quantity |
| `unit_price` | Decimal(10,2) | required | Price snapshot at time of purchase |
| `product_name` | String | required | Product name snapshot |
| `variant_name` | String | nullable | Variant name snapshot |
| `notes` | String | nullable | Special instructions (e.g., "sin cebolla") |
| `created_at` | DateTime | auto | |

**Index:** `order_id`

> **Restrict delete:** Products/variants with order history cannot be deleted. Use `is_active = false` instead.

---

### OrderItemRemovedIngredient

Ingredients removed from an order item (no cost change).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | |
| `order_item_id` | UUID | FK → order_items (Cascade) | |
| `ingredient_id` | UUID | FK → ingredients (Restrict) | |
| `ingredient_name` | String | required | Name snapshot |

**Unique:** `[order_item_id, ingredient_id]`

---

### OrderItemExtra

Extra charges added by staff for additions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | |
| `order_item_id` | UUID | FK → order_items (Cascade) | |
| `description` | String | required | What the extra is (set by staff) |
| `price` | Decimal(10,2) | required | Extra charge (set by staff) |
| `created_at` | DateTime | auto | |

**Index:** `order_item_id`

---

## Price Calculation

```
Order Item Total = (unit_price × quantity) + SUM(extras.price)
Order Total      = SUM(all item totals)
```

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| `price` nullable on Product | When variants exist, price lives on variants |
| Snapshot fields on OrderItem | Historical accuracy even if catalog changes |
| `onDelete: Restrict` on OrderItem → Product | Prevents deleting products with order history |
| Explicit ProductIngredient join table | Extensible (can add `isRemovable` later) |
| `@db.Date` on order_date | Clean date-only for folio uniqueness |
| Separate OrderItemExtra table | Queryable and summable, not buried in JSON |
| No Customer table | Name stored directly on order per requirements |
