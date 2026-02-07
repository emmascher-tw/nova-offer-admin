import { useFormContext } from 'react-hook-form';
import FormField from '../ui/FormField.jsx';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import StepsFieldArray from './StepsFieldArray.jsx';
import RewardSubSection from './RewardSubSection.jsx';
import { FREQUENCY_WINDOWS } from '../../schemas/constants.js';

export default function ActionsRewardsSection() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-5">
        <FormField label="Frequency Window" error={errors.frequency_window?.message} required>
          <Select {...register('frequency_window')} error={errors.frequency_window}>
            {FREQUENCY_WINDOWS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
        </FormField>
        <FormField label="Max Redemptions" error={errors.max_redemptions?.message} required>
          <Input
            type="number"
            {...register('max_redemptions', { valueAsNumber: true })}
            error={errors.max_redemptions}
            placeholder="e.g. 1"
          />
        </FormField>
      </div>

      <StepsFieldArray />
      <RewardSubSection />
    </div>
  );
}
