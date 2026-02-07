export function buildOfferPayload(formData, { isEdit = false, currentVersion = 0 } = {}) {
  const now = new Date().toISOString();
  const payload = {
    offer_config: formData,
    updated_at: now,
  };
  if (!isEdit) {
    payload.version = 1;
    payload.created_at = now;
    payload.created_by = 'admin@nova.com';
    payload.parent_offer_id = null;
  } else {
    payload.version = currentVersion + 1;
  }
  return payload;
}

export function buildVersionPayload(offerId, version, offerConfig, summary = '') {
  return {
    offer_id: Number(offerId),
    version,
    offer_config_snapshot: offerConfig,
    saved_at: new Date().toISOString(),
    saved_by: 'admin@nova.com',
    change_summary: summary || (version === 1 ? 'Initial creation' : 'Updated offer configuration'),
  };
}
