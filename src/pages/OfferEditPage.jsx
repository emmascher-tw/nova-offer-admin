import { useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import OfferForm from '../components/form/OfferForm.jsx';
import VersionHistoryPanel from '../components/versions/VersionHistoryPanel.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import useOffer from '../hooks/useOffer.js';
import useOfferMutation from '../hooks/useOfferMutation.js';
import useUiStore from '../stores/uiStore.js';

export default function OfferEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { offer, loading, error } = useOffer(id);
  const { update, saving } = useOfferMutation();
  const versionPanelOpen = useUiStore((s) => s.versionPanelOpen);

  const handleSubmit = async (data) => {
    try {
      await update(id, data, offer.version);
      toast.success('Offer updated');
      navigate('/offers');
    } catch {
      toast.error('Failed to update offer');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600 p-4">Error loading offer: {error.message}</div>;
  if (!offer) return <div className="text-gray-500 p-4">Offer not found.</div>;

  return (
    <div className="flex gap-0">
      <div className={`flex-1 min-w-0 ${versionPanelOpen ? 'mr-80' : ''}`}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Offer</h1>
          <p className="text-sm text-gray-500 mt-1">
            {offer.offer_config.title} — v{offer.version}
          </p>
        </div>
        <OfferForm
          defaultValues={offer.offer_config}
          onSubmit={handleSubmit}
          saving={saving}
          onCancel={() => navigate('/offers')}
          isEdit
          offerId={id}
        />
      </div>
      {versionPanelOpen && <VersionHistoryPanel offerId={id} />}
    </div>
  );
}
