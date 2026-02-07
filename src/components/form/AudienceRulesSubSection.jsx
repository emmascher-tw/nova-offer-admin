import { useFormContext, useWatch, Controller } from 'react-hook-form';
import FormField from '../ui/FormField.jsx';
import Input from '../ui/Input.jsx';
import TagInput from '../ui/TagInput.jsx';
import Checkbox from '../ui/Checkbox.jsx';
import { SEGMENTS, US_STATES } from '../../schemas/constants.js';

export default function AudienceRulesSubSection() {
  const { register, setValue, control, formState: { errors } } = useFormContext();
  const audienceErrors = errors.audience_targeting;
  const zipProximity = useWatch({ control, name: 'audience_targeting.zip_code_proximity' });
  const hasZip = zipProximity !== null;

  const toggleZip = () => {
    if (hasZip) {
      setValue('audience_targeting.zip_code_proximity', null);
    } else {
      setValue('audience_targeting.zip_code_proximity', { zip_code: '', radius_miles: 10 });
    }
  };

  return (
    <div className="space-y-5">
      <h4 className="text-sm font-semibold text-gray-700">Audience Targeting</h4>
      <p className="text-xs text-gray-500 -mt-3">Define who should be targeted for this offer</p>

      {/* Segments */}
      <FormField label="Customer Segments">
        <Controller
          control={control}
          name="audience_targeting.segments"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              {SEGMENTS.map((seg) => (
                <label key={seg.value} className="inline-flex items-center gap-1.5 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    value={seg.value}
                    checked={field.value?.includes(seg.value)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...(field.value || []), seg.value]
                        : (field.value || []).filter((v) => v !== seg.value);
                      field.onChange(next);
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">{seg.label}</span>
                </label>
              ))}
            </div>
          )}
        />
      </FormField>

      {/* Geographic */}
      <div className="grid grid-cols-2 gap-4">
        <FormField label="States">
          <Controller
            control={control}
            name="audience_targeting.states"
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} placeholder="Add state (e.g. NY)..." />
            )}
          />
        </FormField>
        <FormField label="Regions / Neighborhoods">
          <Controller
            control={control}
            name="audience_targeting.regions"
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} placeholder="Add region..." />
            )}
          />
        </FormField>
      </div>

      <FormField label="Neighborhoods">
        <Controller
          control={control}
          name="audience_targeting.neighborhoods"
          render={({ field }) => (
            <TagInput value={field.value} onChange={field.onChange} placeholder="Add neighborhood..." />
          )}
        />
      </FormField>

      {/* Zip Code Proximity */}
      <div className="border-t border-gray-200 pt-4">
        <Checkbox label="Enable Zip Code Proximity targeting" checked={hasZip} onChange={toggleZip} />
        {hasZip && (
          <div className="grid grid-cols-2 gap-4 mt-3 pl-6">
            <FormField label="Zip Code" error={audienceErrors?.zip_code_proximity?.zip_code?.message} required>
              <Input
                {...register('audience_targeting.zip_code_proximity.zip_code')}
                error={audienceErrors?.zip_code_proximity?.zip_code}
                placeholder="10001"
              />
            </FormField>
            <FormField label="Within X Miles" error={audienceErrors?.zip_code_proximity?.radius_miles?.message} required>
              <Input
                type="number"
                {...register('audience_targeting.zip_code_proximity.radius_miles', { valueAsNumber: true })}
                error={audienceErrors?.zip_code_proximity?.radius_miles}
              />
            </FormField>
          </div>
        )}
      </div>

      {/* Tiers */}
      <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
        <FormField label="Partner Tier">
          <Controller
            control={control}
            name="audience_targeting.partner_tiers"
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} placeholder="Add tier..." />
            )}
          />
        </FormField>
        <FormField label="RN Tier">
          <Controller
            control={control}
            name="audience_targeting.rn_tiers"
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} placeholder="Add tier..." />
            )}
          />
        </FormField>
      </div>

      {/* Lifetime transactions */}
      <FormField label="Min Lifetime Transactions" error={audienceErrors?.min_lifetime_transactions?.message}>
        <Input
          type="number"
          {...register('audience_targeting.min_lifetime_transactions', { valueAsNumber: true })}
          error={audienceErrors?.min_lifetime_transactions}
          placeholder="e.g. 5 (blank = no minimum)"
          className="max-w-xs"
        />
      </FormField>
    </div>
  );
}
