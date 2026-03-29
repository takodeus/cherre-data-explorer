export type LookupType = 'ok' | 'err' | 'warn';

export interface Lookup {
  sys: string;
  type: LookupType;
  text: string;
}

export interface Item {
  name: string;
  icon: string;
  category: string;
  lookups: Lookup[];
}

export const ITEMS: Item[] = [
  {
    name: 'Ontolo-Tea',
    icon: '🍵',
    category: 'Beverage (can)',
    lookups: [
      { sys: 'System A — By Name', type: 'ok', text: '"Beverage, Hot, Loose Leaf"\nCategory: Hot Beverages > Infusions' },
      { sys: 'System B — By Category', type: 'ok', text: '"Dry Goods > Specialty"\nAisle 7. Or possibly Aisle 12.' },
      { sys: 'System C — By SKU', type: 'err', text: 'ITEM NOT FOUND.\nDid you mean: "Onto-Tea"?\nOr: "Onto-T" (apparel, size S)?' },
      { sys: 'System D — By Vendor Code', type: 'warn', text: '"Classified as Produce."\nLocation: Aisle F, next to the apples.' },
    ],
  },
  {
    name: 'Alpha Bytes',
    icon: '🍳',
    category: 'Cereal box',
    lookups: [
      { sys: 'System A — By Name', type: 'ok', text: '"Breakfast, Grain-Based, Fortified"\nServing size: 1 cup (32g)' },
      { sys: 'System B — By Category', type: 'ok', text: '"Cereal > Kids"\nShelf life: 18 months' },
      { sys: 'System C — By SKU', type: 'warn', text: '"Snack Food, Savory"\nNOTE: Classified as chips.\n(It sounds like "bytes." So... chips?)' },
      { sys: 'System D — By Vendor Code', type: 'err', text: 'DATA NOT FOUND.\nRecord last updated: February 2003.\nPlease contact your administrator.' },
    ],
  },
  {
    name: 'Cherries',
    icon: '🍒',
    category: 'Produce',
    lookups: [
      { sys: 'System A — By Name', type: 'ok', text: '"Fruit, Stone, Fresh"\nOrigin: Pacific Northwest' },
      { sys: 'System B — By Category', type: 'ok', text: '"Produce"\nSeasonal. Price fluctuates.' },
      { sys: 'System C — By SKU', type: 'warn', text: 'Returns 3 results.\nAll vendors named "Cherre."\nAll different prices.\nAll listed as different items.' },
      { sys: 'System D — By Vendor Code', type: 'err', text: '"Software. Enterprise License.\nAnnual Subscription."\n$120,000/yr. Renews automatically.' },
    ],
  },
  {
    name: 'Parcel',
    icon: '📦',
    category: 'Shipping & Receiving',
    lookups: [
      { sys: 'System A — By Name', type: 'ok', text: '"Package, Corrugated, Brown"\nDimensions: Unknown.\nContents: Unknown.' },
      { sys: 'System B — By Category', type: 'warn', text: '"Real Property > Land > Tax Lot"\nZoned: Mixed-Use Commercial.\nOwner of record: 3 LLCs and a trust.\nAssessed value: It depends.' },
      { sys: 'System C — By SKU', type: 'err', text: 'AMBIGUOUS IDENTIFIER.\nMatched 847,000 records.\nAll called "Parcel."\nNone agree on the address.' },
      { sys: 'System D — By Vendor Code', type: 'warn', text: '"Herb, Fresh, Flat-Leaf."\nSee also: Parsley.\nSee also: Parcel (land).\nSee also: Parcel (shipping).\nSystem D regrets the confusion.' },
    ],
  },
];

export const LOOKUP_METHODS = ['By Name', 'By Category', 'By SKU', 'By Vendor'];

export const LOADING_MESSAGES = [
  'Connecting to system…',
  'Fetching record…',
  'Normalizing schema…',
  'Almost there…',
];

export const TOTAL_VALUES = [
  ['$94.17', 'Or $47.83.'],
  ['$112.50', 'Or $38.99.'],
  ['$83.40', 'Or $61.22.'],
  ['$1,200,000.00', 'Or $4.99.'],
];
