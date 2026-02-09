/**
 * Nova Offer Configuration — Repository Layer Contracts
 *
 * Defines data contracts (JSDoc typedefs), the offer status state machine,
 * transition validation, and documented repository interfaces.
 */

// ── Data Contracts ──

/**
 * @typedef {Object} OfferRecord
 * @property {number} id
 * @property {Object} offer_config - Full offer configuration document
 * @property {number} version
 * @property {'DRAFT'|'PENDING_REVIEW'|'ACTIVE'|'INACTIVE'} status
 * @property {number|null} template_id - FK to offer_templates
 * @property {string} created_at - ISO 8601
 * @property {string} updated_at - ISO 8601
 * @property {string} created_by
 * @property {number|null} parent_offer_id - Self-referencing FK for cloned offers
 */

/**
 * @typedef {Object} TemplateRecord
 * @property {number} id
 * @property {string} key - Unique machine-readable key (e.g. 'single_dine')
 * @property {string} name
 * @property {string|null} description
 * @property {string} category
 * @property {Object} default_config - Default offer_config for this template
 * @property {Object|null} validation_rules - Per-template constraints (future)
 * @property {number} version
 * @property {'active'|'deprecated'} status
 * @property {string} created_at - ISO 8601
 * @property {string} updated_at - ISO 8601
 * @property {string} created_by
 */

/**
 * @typedef {Object} VersionRecord
 * @property {number} id
 * @property {number} offer_id
 * @property {number} version
 * @property {Object} offer_config_snapshot
 * @property {string} saved_at - ISO 8601
 * @property {string} saved_by
 * @property {string|null} change_summary
 */

/**
 * @typedef {Object} OfferFilter
 * @property {string} [status] - Filter by offer status
 * @property {string} [templateKey] - Filter by template key
 * @property {string} [search] - Search title, offer_id, description
 * @property {string} [category] - Filter by template category
 */

/**
 * @typedef {Object} TransitionResult
 * @property {boolean} valid - Whether the transition is allowed
 * @property {string[]} errors - List of validation error messages (empty if valid)
 */

// ── Status State Machine ──

/**
 * Valid offer status transitions.
 * Key = current status, Value = array of valid target statuses.
 * @type {Record<string, string[]>}
 */
export const VALID_TRANSITIONS = {
  DRAFT: ['PENDING_REVIEW'],
  PENDING_REVIEW: ['ACTIVE'],
  ACTIVE: ['INACTIVE'],
  INACTIVE: ['DRAFT'],
};

/**
 * Validates whether an offer can transition to a given status.
 * For DRAFT → PENDING_REVIEW, also checks business rules:
 * - Title must be non-empty
 * - At least one partner selected
 * - At least one action defined
 * - Timing rules must have start/end dates
 * - Reward value must be > 0
 *
 * @param {OfferRecord} offer - The current offer record
 * @param {string} toStatus - The target status
 * @returns {TransitionResult}
 */
export function validateTransition(offer, toStatus) {
  const errors = [];
  const fromStatus = offer.status;

  // Check state machine
  const allowed = VALID_TRANSITIONS[fromStatus];
  if (!allowed || !allowed.includes(toStatus)) {
    errors.push(`Cannot transition from ${fromStatus} to ${toStatus}`);
    return { valid: false, errors };
  }

  // Business rules for DRAFT → PENDING_REVIEW
  if (fromStatus === 'DRAFT' && toStatus === 'PENDING_REVIEW') {
    const config = offer.offer_config;

    if (!config.title || !config.title.trim()) {
      errors.push('Title is required');
    }

    if (!config.partner_ids || config.partner_ids.length === 0) {
      errors.push('At least one partner must be selected');
    }

    if (!config.actions || config.actions.length === 0) {
      errors.push('At least one action is required');
    }

    if (!config.timing_rules?.start_date) {
      errors.push('Start date is required');
    }

    if (!config.timing_rules?.end_date) {
      errors.push('End date is required');
    }

    if (!config.reward?.reward_value || config.reward.reward_value <= 0) {
      errors.push('Reward value must be greater than 0');
    }
  }

  return { valid: errors.length === 0, errors };
}

// ── Repository Interfaces (documented for future implementation) ──

/**
 * OfferRepository Interface
 *
 * @interface OfferRepository
 * @method getAll(filter?: OfferFilter) → Promise<OfferRecord[]>
 * @method getById(id: number) → Promise<OfferRecord>
 * @method create(data: Partial<OfferRecord>) → Promise<OfferRecord>
 * @method update(id: number, data: Partial<OfferRecord>) → Promise<OfferRecord>
 * @method delete(id: number) → Promise<void>
 * @method transitionStatus(id: number, toStatus: string, context?: object) → Promise<TransitionResult>
 */

/**
 * TemplateRepository Interface
 *
 * @interface TemplateRepository
 * @method getAll(filter?: {status?: string, category?: string}) → Promise<TemplateRecord[]>
 * @method getById(id: number) → Promise<TemplateRecord>
 * @method getByKey(key: string) → Promise<TemplateRecord>
 * @method create(data: Partial<TemplateRecord>) → Promise<TemplateRecord>
 * @method update(id: number, data: Partial<TemplateRecord>) → Promise<TemplateRecord>
 * @method deprecate(id: number) → Promise<TemplateRecord>
 * @method getCategories() → Promise<string[]>
 */

/**
 * VersionRepository Interface
 *
 * @interface VersionRepository
 * @method getByOfferId(offerId: number) → Promise<VersionRecord[]>
 * @method create(data: Partial<VersionRecord>) → Promise<VersionRecord>
 */
