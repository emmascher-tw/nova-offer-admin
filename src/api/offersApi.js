import client from './client.js';

export const getOffers = () => client.get('/offers').then((r) => r.data);

export const getOffer = (id) => client.get(`/offers/${id}`).then((r) => r.data);

export const createOffer = (data) => client.post('/offers', data).then((r) => r.data);

export const updateOffer = (id, data) => client.patch(`/offers/${id}`, data).then((r) => r.data);

export const deleteOffer = (id) => client.delete(`/offers/${id}`).then((r) => r.data);
