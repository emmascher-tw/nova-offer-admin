import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Eye, X, History } from 'lucide-react';
import { offerSchema } from '../../schemas/offerSchema.js';
import useUiStore from '../../stores/uiStore.js';
import Button from '../ui/Button.jsx';
import FormTabNavigation from './FormTabNavigation.jsx';
import MetadataSection from './MetadataSection.jsx';
import ActionsRewardsSection from './TxnQualSection.jsx';
import TargetingSection from './EligibilitySection.jsx';
import ScheduleTriggersSection from './TimingRulesSubSection.jsx';
import ContentLegalSection from './ContentLegalSection.jsx';
import JsonPreviewPanel from '../json-preview/JsonPreviewPanel.jsx';

export default function OfferForm({ defaultValues, onSubmit, saving, onCancel, isEdit = false, offerId }) {
  const activeTab = useUiStore((s) => s.activeTab);
  const setActiveTab = useUiStore((s) => s.setActiveTab);
  const jsonPanelOpen = useUiStore((s) => s.jsonPanelOpen);
  const toggleJsonPanel = useUiStore((s) => s.toggleJsonPanel);
  const toggleVersionPanel = useUiStore((s) => s.toggleVersionPanel);

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(offerSchema),
    mode: 'onBlur',
  });

  const { handleSubmit, formState: { errors } } = methods;

  useEffect(() => {
    setActiveTab(0);
    useUiStore.getState().setJsonPanelOpen(false);
    useUiStore.getState().setVersionPanelOpen(false);
  }, [setActiveTab]);

  const onError = (errs) => {
    if (errs.offer_id || errs.title || errs.partner_ids) {
      setActiveTab(0);
    } else if (errs.actions || errs.frequency_window || errs.max_redemptions || errs.reward) {
      setActiveTab(1);
    } else if (errs.audience_targeting || errs.merchant_selection) {
      setActiveTab(2);
    } else if (errs.timing_rules || errs.chaining || errs.event_triggers) {
      setActiveTab(3);
    } else if (errs.marketing_legal) {
      setActiveTab(4);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex gap-0">
        <div className={`flex-1 min-w-0 ${jsonPanelOpen ? 'mr-96' : ''}`}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <FormTabNavigation errors={errors} />
              <div className="p-6">
                <div className={activeTab === 0 ? '' : 'hidden'}>
                  <MetadataSection />
                </div>
                <div className={activeTab === 1 ? '' : 'hidden'}>
                  <ActionsRewardsSection />
                </div>
                <div className={activeTab === 2 ? '' : 'hidden'}>
                  <TargetingSection />
                </div>
                <div className={activeTab === 3 ? '' : 'hidden'}>
                  <ScheduleTriggersSection />
                </div>
                <div className={activeTab === 4 ? '' : 'hidden'}>
                  <ContentLegalSection />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 py-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button type="button" variant="secondary" onClick={toggleJsonPanel}>
                  <Eye size={16} /> Preview JSON
                </Button>
                {isEdit && (
                  <Button type="button" variant="secondary" onClick={toggleVersionPanel}>
                    <History size={16} /> Version History
                  </Button>
                )}
              </div>
              <Button type="button" variant="ghost" onClick={onCancel}>
                <X size={16} /> Cancel
              </Button>
            </div>
          </form>
        </div>

        {jsonPanelOpen && <JsonPreviewPanel control={methods.control} />}
      </div>
    </FormProvider>
  );
}
