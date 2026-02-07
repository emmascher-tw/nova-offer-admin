import { useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import OffersToolbar from '../components/offers/OffersToolbar.jsx';
import OffersTable from '../components/offers/OffersTable.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import JsonPreviewModal from '../components/json-preview/JsonPreviewModal.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';
import useOffers from '../hooks/useOffers.js';
import useOfferMutation from '../hooks/useOfferMutation.js';

export default function OffersListPage() {
  const navigate = useNavigate();
  const { offers, loading, error, refetch, search, setSearch, typeFilter, setTypeFilter } = useOffers();
  const { remove, clone } = useOfferMutation();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [previewOffer, setPreviewOffer] = useState(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.id);
      toast.success('Offer deleted');
      refetch();
    } catch {
      toast.error('Failed to delete offer');
    }
    setDeleteTarget(null);
  };

  const handleClone = async (offer) => {
    try {
      const newOffer = await clone(offer);
      toast.success('Offer cloned');
      navigate(`/offers/${newOffer.id}/edit`);
    } catch {
      toast.error('Failed to clone offer');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600 p-4">Error loading offers: {error.message}</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Offers</h1>
        <p className="text-sm text-gray-500 mt-1">Manage offer configurations</p>
      </div>

      <OffersToolbar
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      {offers.length === 0 ? (
        <EmptyState
          title="No offers found"
          description={search || typeFilter ? 'Try adjusting your filters.' : 'Create your first offer to get started.'}
          action={
            !search && !typeFilter ? (
              <Button onClick={() => navigate('/offers/new')}>Create Offer</Button>
            ) : null
          }
        />
      ) : (
        <OffersTable
          data={offers}
          onEdit={(offer) => navigate(`/offers/${offer.id}/edit`)}
          onClone={handleClone}
          onDelete={(offer) => setDeleteTarget(offer)}
          onViewJson={(offer) => setPreviewOffer(offer)}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Offer"
        message={`Are you sure you want to delete "${deleteTarget?.offer_config?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <JsonPreviewModal
        open={!!previewOffer}
        onClose={() => setPreviewOffer(null)}
        data={previewOffer?.offer_config}
        title={previewOffer?.offer_config?.title}
      />
    </div>
  );
}
