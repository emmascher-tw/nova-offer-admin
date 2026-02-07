import { z } from 'zod';

// ── Action (qualification step) ──
const actionSchema = z.object({
  action_type: z.enum([
    'dine_visit',
    'spend',
    'review_submitted',
    'card_linked',
    'offer_activated',
    'channel_subscription',
    'app_downloaded',
    'reservation_completed',
    'enable_location',
  ]),
  metric: z.enum(['count', 'amount']),
  metric_value: z.coerce.number().min(0, 'Must be >= 0'),
  // Per-action merchant scope (optional override of global merchant selection)
  merchant_scope: z
    .object({
      mode: z.enum(['global', 'specific', 'cuisine', 'any']),
      merchant_ids: z.array(z.string()).optional(),
      cuisines: z.array(z.string()).optional(),
    })
    .optional(),
  // Optional time constraint (e.g. "in the next Z days")
  time_constraint_days: z.coerce.number().int().min(0).optional().or(z.literal('')),
});

// ── Reward ──
const rewardSchema = z.object({
  reward_type: z.enum(['flat', 'variable', 'multiplier']),
  reward_value: z.coerce.number().min(0, 'Must be >= 0'),
  reward_unit: z.string().optional(), // e.g. "pts/$1" for variable
  reward_currency: z.enum(['cashback', 'partner_currency']),
  partner_currency_name: z.string().optional().or(z.literal('')),
});

// ── Merchant Selection (global) ──
const merchantSelectionSchema = z.object({
  mode: z.enum(['all', 'cuisine', 'specific', 'exclude']),
  cuisines: z.array(z.string()),
  merchant_ids: z.array(z.string()),
  excluded_merchant_ids: z.array(z.string()),
});

// ── Audience Targeting ──
const zipCodeProximitySchema = z
  .object({
    zip_code: z.string().min(1, 'Zip code required'),
    radius_miles: z.coerce.number().min(1, 'Must be >= 1'),
  })
  .nullable();

const audienceTargetingSchema = z.object({
  states: z.array(z.string()),
  regions: z.array(z.string()),
  neighborhoods: z.array(z.string()),
  zip_code_proximity: zipCodeProximitySchema,
  partner_tiers: z.array(z.string()),
  rn_tiers: z.array(z.string()),
  min_lifetime_transactions: z.coerce.number().int().min(0).optional().or(z.literal('')),
  segments: z.array(
    z.enum([
      'high_churn_risk',
      'new_member',
      'lapsed',
      'business_traveler',
      'points_collector',
      'non_member',
    ])
  ),
});

// ── Timing Rules ──
const timingRulesSchema = z.object({
  start_date: z.string().min(1, 'Start date required'),
  end_date: z.string().min(1, 'End date required'),
  day_of_week: z.array(
    z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
  ),
});

// ── Offer Chaining ──
const chainingSchema = z.object({
  preceded_by: z.string().optional().or(z.literal('')),
  succeeded_by: z.string().optional().or(z.literal('')),
});

// ── Event Triggers ──
const eventTriggersSchema = z.array(
  z.enum([
    'card_linked',
    'app_download',
    'member_enrollment',
    'submit_review',
    'make_reservation',
    'refer_a_friend',
    'profile_completion',
    'sms_opt_in',
    'email_opt_in',
    'location_services_enabled',
    'click_marketing_link',
  ])
);

// ── Marketing & Legal ──
const marketingLegalSchema = z.object({
  terms_and_conditions: z.string().optional().or(z.literal('')),
  marketing_content_reference: z.string().optional().or(z.literal('')),
  offer_description_internal: z.string().optional().or(z.literal('')),
  offer_description_external: z.string().optional().or(z.literal('')),
  offer_group_id: z.string().optional().or(z.literal('')),
});

// ── Root Schema ──
export const offerSchema = z.object({
  offer_id: z.string().min(1, 'Offer ID is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Max 200 characters'),
  template_type: z.string().optional().or(z.literal('')),
  partner_ids: z.array(z.string()).min(1, 'At least one partner required'),
  is_sequenced: z.boolean(),

  // Actions & Rewards
  actions: z.array(actionSchema).min(1, 'At least one action is required'),
  frequency_window: z.enum(['one_time', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'unlimited']),
  max_redemptions: z.coerce.number().int().min(1, 'Must be >= 1'),
  reward: rewardSchema,

  // Targeting
  audience_targeting: audienceTargetingSchema,
  merchant_selection: merchantSelectionSchema,

  // Timing & Triggers
  timing_rules: timingRulesSchema,
  chaining: chainingSchema,
  event_triggers: eventTriggersSchema,

  // Marketing & Legal
  marketing_legal: marketingLegalSchema,
});
