import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import FormField from '../ui/FormField.jsx';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';
import TagInput from '../ui/TagInput.jsx';
import { ACTION_TYPES, ACTION_METRICS, MERCHANT_SCOPE_MODES } from '../../schemas/constants.js';
import { getDefaultAction } from '../../schemas/defaults.js';

export default function StepsFieldArray() {
  const { register, control, watch, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'actions' });
  const actionsErrors = errors.actions;
  const isSequenced = watch('is_sequenced');

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-gray-700">Actions</h4>
          <p className="text-xs text-gray-500">Define what the customer must do to qualify</p>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={() => append(getDefaultAction())}>
          <Plus size={14} /> Add Action
        </Button>
      </div>

      {actionsErrors?.message && (
        <p className="text-sm text-red-600 mb-2">{actionsErrors.message}</p>
      )}

      <div className="space-y-3">
        {fields.map((field, idx) => {
          const stepErrors = actionsErrors?.[idx];
          const scopeMode = watch(`actions.${idx}.merchant_scope.mode`);

          return (
            <div key={field.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GripVertical size={14} className="text-gray-300" />
                  <span className="text-sm font-medium text-gray-600">
                    {isSequenced ? `Step ${idx + 1}` : `Action ${idx + 1}`}
                  </span>
                  {isSequenced && idx > 0 && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">THEN</span>
                  )}
                </div>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(idx)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <FormField label="Action Type" error={stepErrors?.action_type?.message}>
                  <Select {...register(`actions.${idx}.action_type`)} error={stepErrors?.action_type}>
                    {ACTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </Select>
                </FormField>
                <FormField label="Metric" error={stepErrors?.metric?.message}>
                  <Select {...register(`actions.${idx}.metric`)} error={stepErrors?.metric}>
                    {ACTION_METRICS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </Select>
                </FormField>
                <FormField label="Value" error={stepErrors?.metric_value?.message}>
                  <Input
                    type="number"
                    step="any"
                    {...register(`actions.${idx}.metric_value`, { valueAsNumber: true })}
                    error={stepErrors?.metric_value}
                    placeholder="e.g. 3 times or $25"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Time Constraint (days)" error={stepErrors?.time_constraint_days?.message}>
                  <Input
                    type="number"
                    {...register(`actions.${idx}.time_constraint_days`, { valueAsNumber: true })}
                    placeholder="e.g. 30 (blank = no limit)"
                  />
                </FormField>
                <FormField label="Merchant Scope">
                  <Select {...register(`actions.${idx}.merchant_scope.mode`)}>
                    {MERCHANT_SCOPE_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </Select>
                </FormField>
              </div>

              {scopeMode === 'specific' && (
                <div className="mt-3">
                  <FormField label="Merchant IDs (for this action)">
                    <Controller
                      control={control}
                      name={`actions.${idx}.merchant_scope.merchant_ids`}
                      render={({ field: f }) => (
                        <TagInput value={f.value || []} onChange={f.onChange} placeholder="Add merchant ID..." />
                      )}
                    />
                  </FormField>
                </div>
              )}
              {scopeMode === 'cuisine' && (
                <div className="mt-3">
                  <FormField label="Cuisines (for this action)">
                    <Controller
                      control={control}
                      name={`actions.${idx}.merchant_scope.cuisines`}
                      render={({ field: f }) => (
                        <TagInput value={f.value || []} onChange={f.onChange} placeholder="Add cuisine..." />
                      )}
                    />
                  </FormField>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
