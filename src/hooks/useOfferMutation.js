import { useState } from 'react';
import { createOffer, updateOffer, deleteOffer } from '../api/offersApi.js';
import { createVersion } from '../api/versionsApi.js';
import { buildOfferPayload, buildVersionPayload } from '../utils/buildOfferPayload.js';
import { generateOfferId } from '../utils/generateOfferId.js';

export default function useOfferMutation() {
  const [saving, setSaving] = useState(false);

  const create = async (formData, { templateId = null } = {}) => {
    setSaving(true);
    try {
      const payload = buildOfferPayload(formData, { templateId });
      const created = await createOffer(payload);
      await createVersion(buildVersionPayload(created.id, 1, formData));
      return created;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id, formData, currentVersion) => {
    setSaving(true);
    try {
      const payload = buildOfferPayload(formData, { isEdit: true, currentVersion });
      const updated = await updateOffer(id, payload);
      await createVersion(
        buildVersionPayload(id, updated.version, formData)
      );
      return updated;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    return deleteOffer(id);
  };

  const clone = async (sourceOffer) => {
    const config = structuredClone(sourceOffer.offer_config);
    config.offer_id = generateOfferId();
    config.title = `Copy of ${config.title}`;

    const payload = buildOfferPayload(config, { templateId: sourceOffer.template_id || null });
    payload.parent_offer_id = sourceOffer.id;
    const created = await createOffer(payload);
    await createVersion(buildVersionPayload(created.id, 1, config, 'Cloned from ' + sourceOffer.offer_config.offer_id));
    return created;
  };

  return { create, update, remove, clone, saving };
}
