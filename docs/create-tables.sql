-- ============================================================
-- Nova Offer Configuration — Table Definitions
-- ============================================================
-- Two tables: offers (current state) and offer_versions (audit trail).
-- The offer configuration itself is stored as a JSON document.
-- Syntax below is PostgreSQL. For MySQL, replace JSONB with JSON
-- and SERIAL with INT AUTO_INCREMENT.
-- ============================================================

-- Table 1: Current state of each offer
CREATE TABLE offers (
    id                SERIAL        PRIMARY KEY,
    offer_config      JSONB         NOT NULL,       -- Full offer configuration document
    version           INT           NOT NULL DEFAULT 1,
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    created_by        VARCHAR(255)  NOT NULL,
    parent_offer_id   INT           NULL REFERENCES offers(id) ON DELETE SET NULL
);

CREATE INDEX idx_offers_created_by    ON offers (created_by);
CREATE INDEX idx_offers_updated_at    ON offers (updated_at DESC);
CREATE INDEX idx_offers_parent        ON offers (parent_offer_id) WHERE parent_offer_id IS NOT NULL;

-- GIN index for querying inside the JSON document
CREATE INDEX idx_offers_config        ON offers USING GIN (offer_config);


-- Table 2: Audit trail — one row per save
CREATE TABLE offer_versions (
    id                      SERIAL        PRIMARY KEY,
    offer_id                INT           NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    version                 INT           NOT NULL,
    offer_config_snapshot   JSONB         NOT NULL,  -- Full config at time of save
    saved_at                TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    saved_by                VARCHAR(255)  NOT NULL,
    change_summary          TEXT          NULL,

    UNIQUE (offer_id, version)
);

CREATE INDEX idx_versions_offer_id   ON offer_versions (offer_id, version DESC);
CREATE INDEX idx_versions_saved_at   ON offer_versions (saved_at DESC);


-- ============================================================
-- Sample queries
-- ============================================================

-- Get all offers with their titles
SELECT id, version, offer_config->>'title' AS title, updated_at
FROM offers
ORDER BY updated_at DESC;

-- Get offers for a specific partner
SELECT id, offer_config->>'title' AS title
FROM offers
WHERE offer_config->'partner_ids' ? 'partner_1';

-- Get offers using a specific template
SELECT id, offer_config->>'title' AS title
FROM offers
WHERE offer_config->>'template_type' = 'single_dine';

-- Get offers targeting new members
SELECT id, offer_config->>'title' AS title
FROM offers
WHERE offer_config->'audience_targeting'->'segments' ? 'new_member';

-- Get full version history for an offer
SELECT version, saved_at, saved_by, change_summary
FROM offer_versions
WHERE offer_id = 1
ORDER BY version DESC;

-- Get offers with cashback rewards
SELECT id, offer_config->>'title' AS title,
       offer_config->'reward'->>'reward_value' AS reward_value
FROM offers
WHERE offer_config->'reward'->>'reward_currency' = 'cashback';
