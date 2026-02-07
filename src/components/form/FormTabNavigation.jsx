import Tabs from '../ui/Tabs.jsx';
import useUiStore from '../../stores/uiStore.js';

const tabNames = [
  'Offer Setup',
  'Actions & Rewards',
  'Targeting',
  'Schedule & Triggers',
  'Content & Legal',
];

export default function FormTabNavigation({ errors = {} }) {
  const activeTab = useUiStore((s) => s.activeTab);
  const setActiveTab = useUiStore((s) => s.setActiveTab);

  const tabErrors = {
    0: !!(errors.offer_id || errors.title || errors.partner_ids),
    1: !!(errors.actions || errors.frequency_window || errors.max_redemptions || errors.reward),
    2: !!(errors.audience_targeting || errors.merchant_selection),
    3: !!(errors.timing_rules || errors.chaining || errors.event_triggers),
    4: !!(errors.marketing_legal),
  };

  return <Tabs tabs={tabNames} activeTab={activeTab} onChange={setActiveTab} errors={tabErrors} />;
}
