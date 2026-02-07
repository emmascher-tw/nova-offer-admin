import { v4 as uuidv4 } from 'uuid';

export function generateOfferId() {
  return `OFFER-${uuidv4().slice(0, 8).toUpperCase()}`;
}
