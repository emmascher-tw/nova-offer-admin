import { useFormContext, useWatch } from 'react-hook-form';
import FormField from '../ui/FormField.jsx';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import { REWARD_TYPES, REWARD_CURRENCIES } from '../../schemas/constants.js';

export default function RewardSubSection() {
  const { register, control, formState: { errors } } = useFormContext();
  const rewardErrors = errors.reward;
  const rewardCurrency = useWatch({ control, name: 'reward.reward_currency' });
  const rewardType = useWatch({ control, name: 'reward.reward_type' });

  return (
    <div className="p-4 bg-indigo-50/50 rounded-lg border border-indigo-200">
      <h4 className="text-sm font-semibold text-gray-700 mb-4">Reward</h4>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Reward Type" error={rewardErrors?.reward_type?.message} required>
          <Select {...register('reward.reward_type')} error={rewardErrors?.reward_type}>
            {REWARD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
        </FormField>
        <FormField
          label={rewardType === 'multiplier' ? 'Multiplier' : 'Reward Value'}
          error={rewardErrors?.reward_value?.message}
          required
        >
          <Input
            type="number"
            step="any"
            {...register('reward.reward_value', { valueAsNumber: true })}
            error={rewardErrors?.reward_value}
            placeholder={rewardType === 'multiplier' ? 'e.g. 2x' : 'e.g. 500'}
          />
        </FormField>
        <FormField label="Reward Currency" error={rewardErrors?.reward_currency?.message} required>
          <Select {...register('reward.reward_currency')} error={rewardErrors?.reward_currency}>
            {REWARD_CURRENCIES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
        </FormField>
        {rewardCurrency === 'partner_currency' && (
          <FormField label="Currency Name" error={rewardErrors?.partner_currency_name?.message}>
            <Input
              {...register('reward.partner_currency_name')}
              placeholder="e.g. points, miles, stars"
            />
          </FormField>
        )}
        {rewardType === 'variable' && (
          <FormField label="Rate Unit" error={rewardErrors?.reward_unit?.message}>
            <Input
              {...register('reward.reward_unit')}
              placeholder="e.g. pts/$1 spent"
            />
          </FormField>
        )}
      </div>
    </div>
  );
}
