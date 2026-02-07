import { useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import OfferForm from '../components/form/OfferForm.jsx';
import TemplateSelector from '../components/form/TemplateSelector.jsx';
import useOfferMutation from '../hooks/useOfferMutation.js';
import { getDefaults } from '../schemas/defaults.js';

export default function OfferCreatePage() {
  const navigate = useNavigate();
  const { create, saving } = useOfferMutation();
  const [formValues, setFormValues] = useState(null);

  const handleSubmit = async (data) => {
    try {
      await create(data);
      toast.success('Offer created');
      navigate('/offers');
    } catch {
      toast.error('Failed to create offer');
    }
  };

  const handleTemplateSelect = (template) => {
    setFormValues(template.build());
  };

  const handleSkipTemplate = () => {
    setFormValues(getDefaults());
  };

  if (!formValues) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Offer</h1>
          <p className="text-sm text-gray-500 mt-1">Start from a template or build from scratch</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <TemplateSelector onSelect={handleTemplateSelect} onSkip={handleSkipTemplate} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Offer</h1>
        <p className="text-sm text-gray-500 mt-1">
          {formValues.template_type
            ? `Template: ${formValues.template_type.replace(/_/g, ' ')}`
            : 'Starting from scratch'}
        </p>
      </div>
      <OfferForm
        defaultValues={formValues}
        onSubmit={handleSubmit}
        saving={saving}
        onCancel={() => navigate('/offers')}
      />
    </div>
  );
}
