# Nova Offer Configuration — Entity Relationship Diagram

## ERD

```mermaid
erDiagram
    offer_templates {
        SERIAL id PK
        VARCHAR_100 key UK "e.g. single_dine"
        VARCHAR_200 name
        TEXT description
        VARCHAR_100 category
        JSONB default_config
        JSONB validation_rules
        INT version
        VARCHAR_20 status "active | deprecated"
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
        VARCHAR_255 created_by
    }

    offers {
        SERIAL id PK
        JSONB offer_config
        INT version
        VARCHAR_20 status "DRAFT | PENDING_REVIEW | ACTIVE | INACTIVE"
        INT template_id FK "nullable"
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
        VARCHAR_255 created_by
        INT parent_offer_id FK "nullable, self-ref"
    }

    offer_versions {
        SERIAL id PK
        INT offer_id FK
        INT version
        JSONB offer_config_snapshot
        TIMESTAMPTZ saved_at
        VARCHAR_255 saved_by
        TEXT change_summary
    }

    offer_templates ||--o{ offers : "template_id"
    offers ||--o{ offer_versions : "offer_id"
    offers ||--o{ offers : "parent_offer_id"
```

## Relationships

| From | To | Cardinality | FK Column | On Delete | Description |
|---|---|---|---|---|---|
| `offer_templates` | `offers` | One-to-many | `offers.template_id` | `SET NULL` | Template used to create the offer. Nullable for offers built from scratch. |
| `offers` | `offer_versions` | One-to-many | `offer_versions.offer_id` | `CASCADE` | Audit trail — one version row per save. Deleting an offer deletes its history. |
| `offers` | `offers` | Self-referencing | `offers.parent_offer_id` | `SET NULL` | Tracks clone lineage. Nullable — only set when an offer was cloned from another. |

## Notes

- `offer_config` JSONB retains `template_type` string for display/backward compatibility. The `template_id` FK is the authoritative relationship.
- `offer_templates.status` uses lowercase (`active`/`deprecated`), while `offers.status` uses uppercase (`DRAFT`/`ACTIVE`/etc.) to distinguish the two lifecycles.
- Unique constraint on `(offer_versions.offer_id, offer_versions.version)` prevents duplicate version entries.
