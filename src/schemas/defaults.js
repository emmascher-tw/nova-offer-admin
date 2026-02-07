import { generateOfferId } from '../utils/generateOfferId.js';

export function getDefaults() {
  return {
    offer_id: generateOfferId(),
    title: '',
    template_type: '',
    partner_ids: [],
    is_sequenced: false,

    actions: [
      {
        action_type: 'dine_visit',
        metric: 'count',
        metric_value: 1,
        merchant_scope: { mode: 'global' },
        time_constraint_days: '',
      },
    ],
    frequency_window: 'one_time',
    max_redemptions: 1,
    reward: {
      reward_type: 'flat',
      reward_value: 0,
      reward_unit: '',
      reward_currency: 'cashback',
      partner_currency_name: '',
    },

    audience_targeting: {
      states: [],
      regions: [],
      neighborhoods: [],
      zip_code_proximity: null,
      partner_tiers: [],
      rn_tiers: [],
      min_lifetime_transactions: '',
      segments: [],
    },
    merchant_selection: {
      mode: 'all',
      cuisines: [],
      merchant_ids: [],
      excluded_merchant_ids: [],
    },

    timing_rules: {
      start_date: '',
      end_date: '',
      day_of_week: [],
    },
    chaining: {
      preceded_by: '',
      succeeded_by: '',
    },
    event_triggers: [],

    marketing_legal: {
      terms_and_conditions: '',
      marketing_content_reference: '',
      offer_description_internal: '',
      offer_description_external: '',
      offer_group_id: '',
    },
  };
}

export function getDefaultAction() {
  return {
    action_type: 'dine_visit',
    metric: 'count',
    metric_value: 1,
    merchant_scope: { mode: 'global' },
    time_constraint_days: '',
  };
}
