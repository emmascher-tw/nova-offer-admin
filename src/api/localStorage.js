import { seedData } from './seedData.js';

const OFFERS_KEY = 'nova_offers';
const VERSIONS_KEY = 'nova_offer_versions';
const NEXT_ID_KEY = 'nova_next_id';

function init() {
  if (!localStorage.getItem(OFFERS_KEY)) {
    localStorage.setItem(OFFERS_KEY, JSON.stringify(seedData.offers));
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(seedData.offer_versions));
    localStorage.setItem(NEXT_ID_KEY, JSON.stringify({
      offers: seedData.offers.length + 1,
      versions: seedData.offer_versions.length + 1,
    }));
  }
}

function getAll(key) {
  init();
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function setAll(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function nextId(collection) {
  init();
  const ids = JSON.parse(localStorage.getItem(NEXT_ID_KEY));
  const id = ids[collection];
  ids[collection] = id + 1;
  localStorage.setItem(NEXT_ID_KEY, JSON.stringify(ids));
  return id;
}

// Simulate async like a real API
const delay = (ms = 50) => new Promise((r) => setTimeout(r, ms));

// ── Offers ──

export async function getOffers() {
  await delay();
  return getAll(OFFERS_KEY);
}

export async function getOffer(id) {
  await delay();
  const offers = getAll(OFFERS_KEY);
  const offer = offers.find((o) => o.id === Number(id));
  if (!offer) throw new Error('Offer not found');
  return offer;
}

export async function createOffer(data) {
  await delay();
  const offers = getAll(OFFERS_KEY);
  const newOffer = { id: nextId('offers'), ...data };
  offers.push(newOffer);
  setAll(OFFERS_KEY, offers);
  return newOffer;
}

export async function updateOffer(id, data) {
  await delay();
  const offers = getAll(OFFERS_KEY);
  const idx = offers.findIndex((o) => o.id === Number(id));
  if (idx === -1) throw new Error('Offer not found');
  offers[idx] = { ...offers[idx], ...data };
  setAll(OFFERS_KEY, offers);
  return offers[idx];
}

export async function deleteOffer(id) {
  await delay();
  let offers = getAll(OFFERS_KEY);
  offers = offers.filter((o) => o.id !== Number(id));
  setAll(OFFERS_KEY, offers);
  return {};
}

// ── Versions ──

export async function getVersionsByOfferId(offerId) {
  await delay();
  const versions = getAll(VERSIONS_KEY);
  return versions
    .filter((v) => v.offer_id === Number(offerId))
    .sort((a, b) => b.version - a.version);
}

export async function createVersion(data) {
  await delay();
  const versions = getAll(VERSIONS_KEY);
  const newVersion = { id: nextId('versions'), ...data };
  versions.push(newVersion);
  setAll(VERSIONS_KEY, versions);
  return newVersion;
}
