import client from './client.js';

export const getVersionsByOfferId = (offerId) =>
  client
    .get('/offer_versions', {
      params: { offer_id: offerId, _sort: 'version', _order: 'desc' },
    })
    .then((r) => r.data);

export const createVersion = (data) =>
  client.post('/offer_versions', data).then((r) => r.data);
