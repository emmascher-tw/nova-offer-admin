import { useFormContext } from 'react-hook-form';
import FormField from '../ui/FormField.jsx';
import Input from '../ui/Input.jsx';
import TextArea from '../ui/TextArea.jsx';

export default function ContentLegalSection() {
  const { register, formState: { errors } } = useFormContext();
  const mlErrors = errors.marketing_legal;

  return (
    <div className="space-y-5">
      <FormField label="Offer Group ID" error={mlErrors?.offer_group_id?.message}>
        <Input
          {...register('marketing_legal.offer_group_id')}
          placeholder="e.g. GRP-2026-Q1-PIZZA"
        />
      </FormField>

      <FormField label="Offer Description (Internal)" error={mlErrors?.offer_description_internal?.message}>
        <TextArea
          {...register('marketing_legal.offer_description_internal')}
          placeholder="Internal-facing description for the team..."
          rows={3}
        />
      </FormField>

      <FormField label="Offer Description (External)" error={mlErrors?.offer_description_external?.message}>
        <TextArea
          {...register('marketing_legal.offer_description_external')}
          placeholder="Customer-facing description shown in the app..."
          rows={3}
        />
      </FormField>

      <FormField label="Marketing Content Reference" error={mlErrors?.marketing_content_reference?.message}>
        <Input
          {...register('marketing_legal.marketing_content_reference')}
          placeholder="e.g. Link or ID to marketing asset"
        />
      </FormField>

      <FormField label="Terms & Conditions" error={mlErrors?.terms_and_conditions?.message}>
        <TextArea
          {...register('marketing_legal.terms_and_conditions')}
          placeholder="Full T&C text or reference..."
          rows={5}
        />
      </FormField>
    </div>
  );
}
