import { useFormContext, Controller } from 'react-hook-form';
import FormField from '../ui/FormField.jsx';
import Input from '../ui/Input.jsx';
import DatePicker from '../ui/DatePicker.jsx';
import Checkbox from '../ui/Checkbox.jsx';
import { EVENT_TRIGGERS } from '../../schemas/constants.js';

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function ScheduleTriggersSection() {
  const { control, register, formState: { errors } } = useFormContext();
  const timingErrors = errors.timing_rules;

  return (
    <div className="space-y-8">
      {/* Timing Rules */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700">Schedule</h4>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start Date" error={timingErrors?.start_date?.message} required>
            <Controller
              control={control}
              name="timing_rules.start_date"
              render={({ field }) => (
                <DatePicker value={field.value} onChange={field.onChange} error={timingErrors?.start_date} />
              )}
            />
          </FormField>
          <FormField label="End Date" error={timingErrors?.end_date?.message} required>
            <Controller
              control={control}
              name="timing_rules.end_date"
              render={({ field }) => (
                <DatePicker value={field.value} onChange={field.onChange} error={timingErrors?.end_date} />
              )}
            />
          </FormField>
        </div>

        <FormField label="Active Days">
          <div className="flex flex-wrap gap-3 mt-1">
            {daysOfWeek.map((day) => (
              <Checkbox
                key={day}
                label={day.charAt(0).toUpperCase() + day.slice(1)}
                value={day}
                {...register('timing_rules.day_of_week')}
              />
            ))}
          </div>
        </FormField>
      </div>

      {/* Offer Chaining */}
      <div className="border-t border-gray-200 pt-6 space-y-4">
        <h4 className="text-sm font-semibold text-gray-700">Offer Chaining</h4>
        <p className="text-xs text-gray-500 -mt-2">
          Link offers together so completing one triggers another
        </p>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Preceded By (Offer ID)" error={errors.chaining?.preceded_by?.message}>
            <Input
              {...register('chaining.preceded_by')}
              placeholder="e.g. OFFER-ABC12345"
            />
          </FormField>
          <FormField label="Succeeded By (Offer ID)" error={errors.chaining?.succeeded_by?.message}>
            <Input
              {...register('chaining.succeeded_by')}
              placeholder="e.g. OFFER-XYZ98765"
            />
          </FormField>
        </div>
      </div>

      {/* Event Triggers */}
      <div className="border-t border-gray-200 pt-6 space-y-4">
        <h4 className="text-sm font-semibold text-gray-700">Event Triggering Assignment</h4>
        <p className="text-xs text-gray-500 -mt-2">
          Which events should trigger assignment of this offer to a user?
        </p>
        <Controller
          control={control}
          name="event_triggers"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              {EVENT_TRIGGERS.map((evt) => (
                <label key={evt.value} className="inline-flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    value={evt.value}
                    checked={field.value?.includes(evt.value)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...(field.value || []), evt.value]
                        : (field.value || []).filter((v) => v !== evt.value);
                      field.onChange(next);
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">{evt.label}</span>
                </label>
              ))}
            </div>
          )}
        />
      </div>
    </div>
  );
}
