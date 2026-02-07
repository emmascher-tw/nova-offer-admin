import { generateOfferId } from '../utils/generateOfferId.js';
import { getDefaults } from './defaults.js';

// Merge template-specific values on top of base defaults
function makeTemplate(overrides) {
  const base = getDefaults();
  return { ...base, ...overrides, offer_id: generateOfferId() };
}

export const TEMPLATES = [
  {
    key: 'single_dine',
    name: 'Single Dine',
    description: 'Dine Y times to receive X reward — specific or cross-merchant, with optional trigger',
    category: 'Dine-Based',
    build: () =>
      makeTemplate({
        title: '',
        template_type: 'single_dine',
        actions: [
          { action_type: 'dine_visit', metric: 'count', metric_value: 1, merchant_scope: { mode: 'global' }, time_constraint_days: '' },
        ],
        frequency_window: 'one_time',
        max_redemptions: 1,
        reward: { reward_type: 'flat', reward_value: 0, reward_unit: '', reward_currency: 'partner_currency', partner_currency_name: 'points' },
      }),
  },
  {
    key: 'single_dine_spend',
    name: 'Single Dine Spend',
    description: 'Spend at least $Y to receive X reward — specific or cross-merchant',
    category: 'Dine-Based',
    build: () =>
      makeTemplate({
        title: '',
        template_type: 'single_dine_spend',
        actions: [
          { action_type: 'spend', metric: 'amount', metric_value: 0, merchant_scope: { mode: 'global' }, time_constraint_days: '' },
        ],
        frequency_window: 'one_time',
        max_redemptions: 1,
        reward: { reward_type: 'flat', reward_value: 0, reward_unit: '', reward_currency: 'partner_currency', partner_currency_name: 'points' },
      }),
  },
  {
    key: 'single_spend',
    name: 'Single Spend',
    description: 'Spend $Y at a specific restaurant and earn X reward',
    category: 'Spend-Based',
    build: () =>
      makeTemplate({
        title: '',
        template_type: 'single_spend',
        actions: [
          { action_type: 'spend', metric: 'amount', metric_value: 0, merchant_scope: { mode: 'specific' }, time_constraint_days: '' },
        ],
        frequency_window: 'one_time',
        max_redemptions: 1,
        merchant_selection: { mode: 'specific', cuisines: [], merchant_ids: [], excluded_merchant_ids: [] },
        reward: { reward_type: 'flat', reward_value: 0, reward_unit: '', reward_currency: 'cashback', partner_currency_name: '' },
      }),
  },
  {
    key: 'spend_across_dines',
    name: 'Spend Across Dines',
    description: 'Spend at least $Y across multiple dines to receive X reward',
    category: 'Spend-Based',
    build: () =>
      makeTemplate({
        title: '',
        template_type: 'spend_across_dines',
        actions: [
          { action_type: 'spend', metric: 'amount', metric_value: 0, merchant_scope: { mode: 'global' }, time_constraint_days: '' },
        ],
        frequency_window: 'monthly',
        max_redemptions: 1,
        reward: { reward_type: 'flat', reward_value: 0, reward_unit: '', reward_currency: 'partner_currency', partner_currency_name: 'points' },
      }),
  },
  {
    key: 'frequency_time',
    name: 'Frequency (Time-Based)',
    description: 'Dine Y times in the next Z days to receive X reward',
    category: 'Frequency',
    build: () =>
      makeTemplate({
        title: '',
        template_type: 'frequency_time',
        actions: [
          { action_type: 'dine_visit', metric: 'count', metric_value: 2, merchant_scope: { mode: 'global' }, time_constraint_days: 30 },
        ],
        frequency_window: 'monthly',
        max_redemptions: 1,
        reward: { reward_type: 'flat', reward_value: 0, reward_unit: '', reward_currency: 'partner_currency', partner_currency_name: 'points' },
      }),
  },
  {
    key: 'frequency_recurring',
    name: 'Frequency (Recurring)',
    description: 'Go to restaurant(s) Y times per week/month, earn X reward',
    category: 'Frequency',
    build: () =>
      makeTemplate({
        title: '',
        template_type: 'frequency_recurring',
        actions: [
          { action_type: 'dine_visit', metric: 'count', metric_value: 2, merchant_scope: { mode: 'global' }, time_constraint_days: '' },
        ],
        frequency_window: 'weekly',
        max_redemptions: 4,
        reward: { reward_type: 'flat', reward_value: 0, reward_unit: '', reward_currency: 'partner_currency', partner_currency_name: 'points' },
      }),
  },
  {
    key: 'single_activity',
    name: 'Single Activity',
    description: 'Complete a single action (review, card link, subscribe, etc.) and earn a reward',
    category: 'Activity',
    build: () =>
      makeTemplate({
        title: '',
        template_type: 'single_activity',
        actions: [
          { action_type: 'review_submitted', metric: 'count', metric_value: 1, merchant_scope: { mode: 'global' }, time_constraint_days: '' },
        ],
        frequency_window: 'one_time',
        max_redemptions: 1,
        reward: { reward_type: 'flat', reward_value: 0, reward_unit: '', reward_currency: 'partner_currency', partner_currency_name: 'points' },
      }),
  },
  {
    key: 'two_action',
    name: '2-Action Template',
    description: 'Take action 1 THEN action 2 to earn Y reward',
    category: 'Multi-Action',
    build: () =>
      makeTemplate({
        title: '',
        template_type: 'two_action',
        is_sequenced: true,
        actions: [
          { action_type: 'dine_visit', metric: 'count', metric_value: 1, merchant_scope: { mode: 'global' }, time_constraint_days: '' },
          { action_type: 'dine_visit', metric: 'count', metric_value: 1, merchant_scope: { mode: 'global' }, time_constraint_days: '' },
        ],
        frequency_window: 'one_time',
        max_redemptions: 1,
        reward: { reward_type: 'flat', reward_value: 0, reward_unit: '', reward_currency: 'partner_currency', partner_currency_name: 'points' },
      }),
  },
  {
    key: 'three_action',
    name: '3-Action Template',
    description: 'Take action 1 THEN action 2 THEN action 3 to earn Y reward',
    category: 'Multi-Action',
    build: () =>
      makeTemplate({
        title: '',
        template_type: 'three_action',
        is_sequenced: true,
        actions: [
          { action_type: 'dine_visit', metric: 'count', metric_value: 1, merchant_scope: { mode: 'global' }, time_constraint_days: '' },
          { action_type: 'dine_visit', metric: 'count', metric_value: 1, merchant_scope: { mode: 'global' }, time_constraint_days: '' },
          { action_type: 'dine_visit', metric: 'count', metric_value: 1, merchant_scope: { mode: 'global' }, time_constraint_days: '' },
        ],
        frequency_window: 'one_time',
        max_redemptions: 1,
        reward: { reward_type: 'flat', reward_value: 0, reward_unit: '', reward_currency: 'partner_currency', partner_currency_name: 'points' },
      }),
  },
];

export const TEMPLATE_CATEGORIES = [...new Set(TEMPLATES.map((t) => t.category))];
