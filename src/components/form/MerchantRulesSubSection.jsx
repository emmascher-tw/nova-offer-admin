import { useFormContext, useWatch, Controller } from 'react-hook-form';
import FormField from '../ui/FormField.jsx';
import Select from '../ui/Select.jsx';
import TagInput from '../ui/TagInput.jsx';
import { MERCHANT_MODES } from '../../schemas/constants.js';

export default function MerchantRulesSubSection() {
  const { register, control } = useFormContext();
  const mode = useWatch({ control, name: 'merchant_selection.mode' });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-700">Merchant Selection</h4>
      <p className="text-xs text-gray-500 -mt-2">
        Choose which merchants this offer applies to. Individual actions can override this.
      </p>

      <FormField label="Selection Mode">
        <Select {...register('merchant_selection.mode')}>
          {MERCHANT_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </Select>
      </FormField>

      {mode === 'cuisine' && (
        <FormField label="Cuisines / Tags">
          <Controller
            control={control}
            name="merchant_selection.cuisines"
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} placeholder="Add cuisine or tag (e.g. pizza, sushi)..." />
            )}
          />
        </FormField>
      )}

      {mode === 'specific' && (
        <FormField label="Merchant IDs">
          <Controller
            control={control}
            name="merchant_selection.merchant_ids"
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} placeholder="Add merchant ID..." />
            )}
          />
        </FormField>
      )}

      {mode === 'exclude' && (
        <FormField label="Excluded Merchant IDs">
          <p className="text-xs text-gray-500 mb-1">Offer applies to all merchants EXCEPT these</p>
          <Controller
            control={control}
            name="merchant_selection.excluded_merchant_ids"
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} placeholder="Add merchant ID to exclude..." />
            )}
          />
        </FormField>
      )}

      {mode === 'all' && (
        <p className="text-sm text-gray-500 italic">This offer applies to all merchants.</p>
      )}
    </div>
  );
}
