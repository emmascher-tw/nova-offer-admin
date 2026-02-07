export const PARTNERS = [
  { id: 'partner_1', name: 'Partner 1' },
  { id: 'partner_2', name: 'Partner 2' },
  { id: 'partner_3', name: 'Partner 3' },
  { id: 'partner_4', name: 'Partner 4' },
  { id: 'partner_5', name: 'Partner 5' },
  { id: 'partner_6', name: 'Partner 6' },
  { id: 'partner_7', name: 'Partner 7' },
  { id: 'partner_8', name: 'Partner 8' },
  { id: 'partner_9', name: 'Partner 9' },
  { id: 'partner_10', name: 'Partner 10' },
  { id: 'partner_11', name: 'Partner 11' },
  { id: 'partner_12', name: 'Partner 12' },
  { id: 'partner_13', name: 'Partner 13' },
  { id: 'partner_14', name: 'Partner 14' },
  { id: 'partner_15', name: 'Partner 15' },
  { id: 'partner_16', name: 'Partner 16' },
  { id: 'partner_17', name: 'Partner 17' },
];

export const ACTION_TYPES = [
  { value: 'dine_visit', label: 'Dine / Visit' },
  { value: 'spend', label: 'Spend' },
  { value: 'review_submitted', label: 'Review Submitted' },
  { value: 'card_linked', label: 'Card Linked' },
  { value: 'offer_activated', label: 'Offer Activated' },
  { value: 'channel_subscription', label: 'Channel Subscription Active' },
  { value: 'app_downloaded', label: 'App Downloaded' },
  { value: 'reservation_completed', label: 'Reservation Completed' },
  { value: 'enable_location', label: 'Enable Location' },
];

export const ACTION_METRICS = [
  { value: 'count', label: 'Count (# of times)' },
  { value: 'amount', label: 'Amount ($)' },
];

export const MERCHANT_SCOPE_MODES = [
  { value: 'global', label: 'Use global merchant selection' },
  { value: 'any', label: 'Any restaurant' },
  { value: 'specific', label: 'Specific merchant(s)' },
  { value: 'cuisine', label: 'By cuisine' },
];

export const REWARD_TYPES = [
  { value: 'flat', label: 'Flat (fixed amount)' },
  { value: 'variable', label: 'Variable (X pts/$)' },
  { value: 'multiplier', label: 'Multiplier' },
];

export const REWARD_CURRENCIES = [
  { value: 'cashback', label: 'Cashback ($)' },
  { value: 'partner_currency', label: 'Partner Currency (points, miles, etc.)' },
];

export const FREQUENCY_WINDOWS = [
  { value: 'one_time', label: 'One Time' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'unlimited', label: 'Unlimited' },
];

export const MERCHANT_MODES = [
  { value: 'all', label: 'All Merchants' },
  { value: 'cuisine', label: 'By Cuisine / Tag' },
  { value: 'specific', label: 'Specific Merchant IDs' },
  { value: 'exclude', label: 'All Except (exclude specific)' },
];

export const SEGMENTS = [
  { value: 'high_churn_risk', label: 'High Churn Risk' },
  { value: 'new_member', label: 'New Member' },
  { value: 'lapsed', label: 'Lapsed' },
  { value: 'business_traveler', label: 'Business Traveler' },
  { value: 'points_collector', label: 'Points Collector' },
  { value: 'non_member', label: 'Non-Member' },
];

export const EVENT_TRIGGERS = [
  { value: 'card_linked', label: 'Card Linked' },
  { value: 'app_download', label: 'App Download' },
  { value: 'member_enrollment', label: 'Member Enrollment' },
  { value: 'submit_review', label: 'Submit Review' },
  { value: 'make_reservation', label: 'Make Reservation' },
  { value: 'refer_a_friend', label: 'Refer a Friend' },
  { value: 'profile_completion', label: 'Profile Completion' },
  { value: 'sms_opt_in', label: 'SMS Opt-In' },
  { value: 'email_opt_in', label: 'Email Opt-In' },
  { value: 'location_services_enabled', label: 'Location Services Enabled' },
  { value: 'click_marketing_link', label: 'Click Marketing Link' },
];

export const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];
