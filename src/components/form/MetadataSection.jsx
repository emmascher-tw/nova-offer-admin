import { useFormContext, Controller } from 'react-hook-form';
import FormField from '../ui/FormField.jsx';
import Input from '../ui/Input.jsx';
import Checkbox from '../ui/Checkbox.jsx';
import { PARTNERS } from '../../schemas/constants.js';

export default function MetadataSection() {
  const { register, control, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-5">
        <FormField label="Offer ID" error={errors.offer_id?.message} required>
          <Input {...register('offer_id')} error={errors.offer_id} placeholder="OFFER-XXXXXXXX" />
        </FormField>
        <FormField label="Template" error={errors.template_type?.message}>
          <Input {...register('template_type')} disabled className="bg-gray-50" placeholder="Selected from template" />
        </FormField>
      </div>

      <FormField label="Title" error={errors.title?.message} required>
        <Input {...register('title')} error={errors.title} placeholder="e.g. Dine 3x to receive 500 points" />
      </FormField>

      <Checkbox label="Sequenced offer (actions must be completed in order)" {...register('is_sequenced')} />

      <div className="border-t border-gray-200 pt-5">
        <FormField label="Partner(s)" error={errors.partner_ids?.message} required>
          <p className="text-xs text-gray-500 mb-2">Select which partner(s) this offer is available for</p>
          <Controller
            control={control}
            name="partner_ids"
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 bg-gray-50 rounded-lg border border-gray-200">
                {PARTNERS.map((p) => (
                  <label key={p.id} className="inline-flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      value={p.id}
                      checked={field.value?.includes(p.id)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...(field.value || []), p.id]
                          : (field.value || []).filter((v) => v !== p.id);
                        field.onChange(next);
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-700">{p.name}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </FormField>
      </div>
    </div>
  );
}
