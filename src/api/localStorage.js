import { seedData } from './seedData.js';
import { validateTransition } from './repository.js';

const OFFERS_KEY = 'nova_offers';
const VERSIONS_KEY = 'nova_offer_versions';
const TEMPLATES_KEY = 'nova_offer_templates';
const NEXT_ID_KEY = 'nova_next_id';
const SCHEMA_VERSION_KEY = 'nova_schema_version';

const CURRENT_SCHEMA_VERSION = '2';

function init() {
  const storedVersion = localStorage.getItem(SCHEMA_VERSION_KEY);

  // Re-seed if no data or schema version mismatch
  if (!localStorage.getItem(OFFERS_KEY) || storedVersion !== CURRENT_SCHEMA_VERSION) {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(seedData.offer_templates));
    localStorage.setItem(OFFERS_KEY, JSON.stringify(seedData.offers));
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(seedData.offer_versions));
    localStorage.setItem(NEXT_ID_KEY, JSON.stringify({
      offers: seedData.offers.length + 1,
      versions: seedData.offer_versions.length + 1,
      templates: seedData.offer_templates.length + 1,
    }));
    localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION);
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

/**
 * Transition an offer's status after validating the state machine and business rules.
 * @param {number} id - Offer ID
 * @param {string} toStatus - Target status
 * @param {Object} [context] - Optional context (e.g. { approved_by })
 * @returns {Promise<import('./repository.js').TransitionResult & { offer?: Object }>}
 */
export async function transitionOfferStatus(id, toStatus, context = {}) {
  await delay();
  const offers = getAll(OFFERS_KEY);
  const idx = offers.findIndex((o) => o.id === Number(id));
  if (idx === -1) return { valid: false, errors: ['Offer not found'] };

  const offer = offers[idx];
  const result = validateTransition(offer, toStatus);

  if (!result.valid) {
    return result;
  }

  offers[idx] = {
    ...offer,
    status: toStatus,
    updated_at: new Date().toISOString(),
  };
  setAll(OFFERS_KEY, offers);
  return { valid: true, errors: [], offer: offers[idx] };
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

// ── Templates ──

export async function getTemplates() {
  await delay();
  return getAll(TEMPLATES_KEY);
}

export async function getTemplate(id) {
  await delay();
  const templates = getAll(TEMPLATES_KEY);
  const template = templates.find((t) => t.id === Number(id));
  if (!template) throw new Error('Template not found');
  return template;
}

export async function getTemplateByKey(key) {
  await delay();
  const templates = getAll(TEMPLATES_KEY);
  const template = templates.find((t) => t.key === key);
  if (!template) throw new Error('Template not found');
  return template;
}

export async function createTemplate(data) {
  await delay();
  const templates = getAll(TEMPLATES_KEY);
  const now = new Date().toISOString();
  const newTemplate = {
    id: nextId('templates'),
    ...data,
    version: 1,
    status: 'active',
    created_at: now,
    updated_at: now,
    created_by: data.created_by || 'admin@nova.com',
  };
  templates.push(newTemplate);
  setAll(TEMPLATES_KEY, templates);
  return newTemplate;
}

export async function updateTemplate(id, data) {
  await delay();
  const templates = getAll(TEMPLATES_KEY);
  const idx = templates.findIndex((t) => t.id === Number(id));
  if (idx === -1) throw new Error('Template not found');
  templates[idx] = {
    ...templates[idx],
    ...data,
    version: templates[idx].version + 1,
    updated_at: new Date().toISOString(),
  };
  setAll(TEMPLATES_KEY, templates);
  return templates[idx];
}

export async function deprecateTemplate(id) {
  await delay();
  const templates = getAll(TEMPLATES_KEY);
  const idx = templates.findIndex((t) => t.id === Number(id));
  if (idx === -1) throw new Error('Template not found');
  templates[idx] = {
    ...templates[idx],
    status: 'deprecated',
    updated_at: new Date().toISOString(),
  };
  setAll(TEMPLATES_KEY, templates);
  return templates[idx];
}

export async function getTemplateCategories() {
  await delay();
  const templates = getAll(TEMPLATES_KEY);
  return [...new Set(templates.filter((t) => t.status === 'active').map((t) => t.category))];
}
