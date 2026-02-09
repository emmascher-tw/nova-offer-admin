# Nova Offer Configuration — Database Schema

> See also: [Entity Relationship Diagram](./erd.md)

## Overview

Three tables store offer templates, configurations, and their version history. The `offer_config` column stores the full configuration as a JSON document.

---

## Table 0: `offer_templates`

Stores **admin-managed offer templates** with versioning. Templates define the default configuration and category for each offer type.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `SERIAL` / `INT AUTO_INCREMENT` | NOT NULL (PK) | Primary key |
| `key` | `VARCHAR(100)` | NOT NULL (UNIQUE) | Machine-readable identifier (e.g., `single_dine`) — used for badge colors/labels |
| `name` | `VARCHAR(200)` | NOT NULL | Display name (e.g., "Single Dine") |
| `description` | `TEXT` | NULL | Human-readable description of this template |
| `category` | `VARCHAR(100)` | NOT NULL | Template category: `Dine-Based`, `Spend-Based`, `Frequency`, `Activity`, `Multi-Action` |
| `default_config` | `JSONB` / `JSON` | NOT NULL | Default `offer_config` values produced when this template is selected (minus `offer_id`) |
| `validation_rules` | `JSONB` / `JSON` | NULL | Per-template validation constraints (future use) |
| `version` | `INT` | NOT NULL | Template version number — increments when template defaults change |
| `status` | `VARCHAR(20)` | NOT NULL | Template status: `active` or `deprecated` |
| `created_at` | `TIMESTAMP` | NOT NULL | When the template was created |
| `updated_at` | `TIMESTAMP` | NOT NULL | When the template was last modified |
| `created_by` | `VARCHAR(255)` | NOT NULL | Email/ID of user who created it |

**Template status** is simpler than offer status — only `active` (available for new offers) or `deprecated` (hidden from selection, existing offers unaffected).

---

## Table 1: `offers`

Stores the **current state** of each offer.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `SERIAL` / `INT AUTO_INCREMENT` | NOT NULL (PK) | Primary key |
| `offer_config` | `JSONB` / `JSON` | NOT NULL | Full offer configuration document (see schema below) |
| `version` | `INT` | NOT NULL | Current version number — increments on each save |
| `status` | `VARCHAR(20)` | NOT NULL | Offer lifecycle status: `DRAFT`, `PENDING_REVIEW`, `ACTIVE`, `INACTIVE` (default: `DRAFT`) |
| `template_id` | `INT` | NULL | FK → `offer_templates.id` — which template was used to create this offer. NULL for offers built from scratch. Note: `template_type` string is retained in `offer_config` JSONB for display/backward compat |
| `created_at` | `TIMESTAMP` | NOT NULL | When the offer was first created |
| `updated_at` | `TIMESTAMP` | NOT NULL | When the offer was last modified |
| `created_by` | `VARCHAR(255)` | NOT NULL | Email/ID of user who created it |
| `parent_offer_id` | `INT` | NULL | FK → `offers.id` — set when offer was cloned from another |

### Offer Status Lifecycle

Offers follow a 4-state lifecycle:

```
DRAFT → PENDING_REVIEW → ACTIVE → INACTIVE
  ↑                                    │
  └────────────────────────────────────┘
```

| From | To | Gate |
|---|---|---|
| `DRAFT` | `PENDING_REVIEW` | Schema validation passes + business rules (title, partner, actions, dates required) |
| `PENDING_REVIEW` | `ACTIVE` | Reviewer approval |
| `ACTIVE` | `INACTIVE` | Any admin, any time |
| `INACTIVE` | `DRAFT` | Returns to draft for re-editing |

**Invalid transitions:** `DRAFT→ACTIVE` (cannot skip review), `ACTIVE→DRAFT` (must deactivate first).

---

## Table 2: `offer_versions`

Stores an **audit trail** — one row per save. Every time an offer is created or updated, a new version row is inserted.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `SERIAL` / `INT AUTO_INCREMENT` | NOT NULL (PK) | Primary key |
| `offer_id` | `INT` | NOT NULL | FK → `offers.id` |
| `version` | `INT` | NOT NULL | Version number at the time of this save |
| `offer_config_snapshot` | `JSONB` / `JSON` | NOT NULL | Full config snapshot at that point in time |
| `saved_at` | `TIMESTAMP` | NOT NULL | When this version was saved |
| `saved_by` | `VARCHAR(255)` | NOT NULL | Email/ID of user who saved |
| `change_summary` | `TEXT` | NULL | Human-readable description of what changed |

---

## `offer_config` JSON Document Schema

This is the structure stored in `offers.offer_config` and `offer_versions.offer_config_snapshot`.

### Top-Level Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `offer_id` | `string` | Yes | Unique business identifier (e.g., `OFFER-001-DINE3X`) |
| `title` | `string` | Yes | Display name (max 200 chars) |
| `template_type` | `string` | No | Which template was used to create this offer |
| `partner_ids` | `string[]` | Yes (min 1) | Which partner(s) this offer is available for |
| `is_sequenced` | `boolean` | Yes | Whether actions must be completed in order |
| `frequency_window` | `enum` | Yes | How often the offer can be earned |
| `max_redemptions` | `int` | Yes | Maximum number of times a user can redeem (min 1) |
| `actions` | `object[]` | Yes (min 1) | Array of required qualification actions |
| `reward` | `object` | Yes | Reward configuration |
| `audience_targeting` | `object` | Yes | Who should be targeted |
| `merchant_selection` | `object` | Yes | Which merchants the offer applies to |
| `timing_rules` | `object` | Yes | When the offer is active |
| `chaining` | `object` | Yes | Links to predecessor/successor offers |
| `event_triggers` | `string[]` | Yes | Events that trigger offer assignment |
| `marketing_legal` | `object` | Yes | Marketing copy and legal content |

### `frequency_window` values

| Value | Description |
|---|---|
| `one_time` | Can only be earned once ever |
| `daily` | Resets every day |
| `weekly` | Resets every week |
| `monthly` | Resets every month |
| `quarterly` | Resets every quarter |
| `yearly` | Resets every year |
| `unlimited` | No frequency limit |

### `actions[]` — Qualification Actions

Each action defines something the customer must do to qualify.

| Field | Type | Required | Description |
|---|---|---|---|
| `action_type` | `enum` | Yes | What the customer must do (see values below) |
| `metric` | `enum` | Yes | `count` (number of times) or `amount` (dollar value) |
| `metric_value` | `number` | Yes | The target value (e.g., 3 times, $25) |
| `time_constraint_days` | `int` | No | Complete within X days (blank = no limit) |
| `merchant_scope` | `object` | No | Per-action merchant override |

**`action_type` values:**

| Value | Display Label |
|---|---|
| `dine_visit` | Dine / Visit |
| `spend` | Spend |
| `review_submitted` | Review Submitted |
| `card_linked` | Card Linked |
| `offer_activated` | Offer Activated |
| `channel_subscription` | Channel Subscription Active |
| `app_downloaded` | App Downloaded |
| `reservation_completed` | Reservation Completed |
| `enable_location` | Enable Location |

**`merchant_scope` object:**

| Field | Type | Description |
|---|---|---|
| `mode` | `enum` | `global` (use global merchant selection), `any` (any restaurant), `specific` (listed IDs), `cuisine` (by cuisine tag) |
| `merchant_ids` | `string[]` | Only when mode = `specific` |
| `cuisines` | `string[]` | Only when mode = `cuisine` |

### `reward` — Reward Configuration

| Field | Type | Required | Description |
|---|---|---|---|
| `reward_type` | `enum` | Yes | `flat` (fixed amount), `variable` (X pts/$), `multiplier` |
| `reward_value` | `number` | Yes | The reward amount or multiplier |
| `reward_unit` | `string` | No | Rate description for variable type (e.g., "pts/$1 spent") |
| `reward_currency` | `enum` | Yes | `cashback` (dollars) or `partner_currency` (points/miles/etc.) |
| `partner_currency_name` | `string` | No | Name of partner currency (e.g., "points", "miles", "stars") — only when currency = `partner_currency` |

### `audience_targeting` — Who Should Be Targeted

| Field | Type | Required | Description |
|---|---|---|---|
| `segments` | `enum[]` | No | Customer segments (see values below) |
| `states` | `string[]` | No | US state codes (e.g., `["NY", "CA"]`) |
| `regions` | `string[]` | No | Region names (e.g., `["tri-state"]`) |
| `neighborhoods` | `string[]` | No | Neighborhood names |
| `zip_code_proximity` | `object / null` | No | Zip code + radius targeting |
| `partner_tiers` | `string[]` | No | Partner tier levels (e.g., `["gold", "platinum"]`) |
| `rn_tiers` | `string[]` | No | RN tier levels |
| `min_lifetime_transactions` | `int` | No | Minimum number of lifetime transactions |

**`segments` values:**

| Value | Display Label |
|---|---|
| `high_churn_risk` | High Churn Risk |
| `new_member` | New Member |
| `lapsed` | Lapsed |
| `business_traveler` | Business Traveler |
| `points_collector` | Points Collector |
| `non_member` | Non-Member |

**`zip_code_proximity` object (when not null):**

| Field | Type | Description |
|---|---|---|
| `zip_code` | `string` | Target zip code |
| `radius_miles` | `number` | Radius in miles |

### `merchant_selection` — Which Merchants

| Field | Type | Required | Description |
|---|---|---|---|
| `mode` | `enum` | Yes | `all`, `cuisine`, `specific`, or `exclude` |
| `cuisines` | `string[]` | No | Cuisine/tag list — only when mode = `cuisine` |
| `merchant_ids` | `string[]` | No | Specific merchant IDs — only when mode = `specific` |
| `excluded_merchant_ids` | `string[]` | No | Merchant IDs to exclude (all others included) — only when mode = `exclude` |

### `timing_rules` — When the Offer Is Active

| Field | Type | Required | Description |
|---|---|---|---|
| `start_date` | `ISO 8601 string` | Yes | Offer start date |
| `end_date` | `ISO 8601 string` | Yes | Offer end date |
| `day_of_week` | `enum[]` | No | Active days — empty means all days. Values: `monday` through `sunday` |

### `chaining` — Offer Sequencing

| Field | Type | Required | Description |
|---|---|---|---|
| `preceded_by` | `string` | No | `offer_id` of the offer that must be completed before this one is assigned |
| `succeeded_by` | `string` | No | `offer_id` of the offer that gets assigned after this one is completed |

### `event_triggers` — Assignment Triggers

Array of event types that trigger automatic assignment of this offer to a user.

| Value | Display Label |
|---|---|
| `card_linked` | Card Linked |
| `app_download` | App Download |
| `member_enrollment` | Member Enrollment |
| `submit_review` | Submit Review |
| `make_reservation` | Make Reservation |
| `refer_a_friend` | Refer a Friend |
| `profile_completion` | Profile Completion |
| `sms_opt_in` | SMS Opt-In |
| `email_opt_in` | Email Opt-In |
| `location_services_enabled` | Location Services Enabled |
| `click_marketing_link` | Click Marketing Link |

### `marketing_legal` — Content & Legal

| Field | Type | Required | Description |
|---|---|---|---|
| `terms_and_conditions` | `string` | No | Full T&C text |
| `marketing_content_reference` | `string` | No | Reference/link to marketing asset |
| `offer_description_internal` | `string` | No | Internal-facing description |
| `offer_description_external` | `string` | No | Customer-facing description |
| `offer_group_id` | `string` | No | Grouping identifier for related offers |

---

## Sample Data

See [`src/api/seedData.js`](../src/api/seedData.js) for 3 fully populated example offers:

1. **Single Dine** — "Dine 3x to receive 500 points" (1 action, partner currency, new member segment)
2. **Dine Spend** — "Spend $25+ at any Italian restaurant, earn $5 cashback" (1 action, cashback, cuisine-based merchant selection, geo targeting)
3. **2-Action Sequenced** — "Link card + Dine to earn 1000 points" (2 sequenced actions, event trigger, time constraint)

---

## Templates

The UI supports 9 pre-built templates that pre-fill the actions and reward structure:

| Template | Category | Pre-configured Actions |
|---|---|---|
| Single Dine | Dine-Based | 1x dine_visit (count) |
| Single Dine Spend | Dine-Based | 1x spend (amount) |
| Single Spend | Spend-Based | 1x spend at specific merchant |
| Spend Across Dines | Spend-Based | 1x spend, monthly frequency |
| Frequency (Time-Based) | Frequency | 1x dine_visit with time constraint |
| Frequency (Recurring) | Frequency | 1x dine_visit, weekly, 4 max redemptions |
| Single Activity | Activity | 1x review_submitted (changeable) |
| 2-Action | Multi-Action | 2 sequenced actions |
| 3-Action | Multi-Action | 3 sequenced actions |
