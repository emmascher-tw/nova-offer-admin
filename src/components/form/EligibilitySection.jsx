import AudienceRulesSubSection from './AudienceRulesSubSection.jsx';
import MerchantRulesSubSection from './MerchantRulesSubSection.jsx';

export default function TargetingSection() {
  return (
    <div className="space-y-8">
      <AudienceRulesSubSection />
      <div className="border-t border-gray-200" />
      <MerchantRulesSubSection />
    </div>
  );
}
