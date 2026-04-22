export type LookupType = 'ok' | 'err' | 'warn';

export interface Lookup {
  sys: string;
  type: LookupType;
  text: string;
}

export interface Item {
  name: string;
  icon: string;
  images?: string[];    // optional product images — first is thumbnail, rest shown in gallery
  category: string;
  price: string;        // canonical price (System A/B agree)
  conflictPrice: string; // absurd price from the worst lookup
  description?: string; // realistic product description (ingredients, nutrition, etc.)
  lookups: Lookup[];
}

export const ITEMS: Item[] = [
  {
    name: 'Ontolo-Tea',
    icon: '🫙',
    images: ['ontolo with a8185e.png', '1can back mockup NBG.png'],
    category: 'Beverage (can)',
    price: '$4.99',
    conflictPrice: 'or $12.50?',
    description: 'Functional cold-brew tea, lightly sparkling. 12 fl oz aluminum can.\nIngredients: Filtered water, organic black tea, organic cane sugar, citric acid, natural cherry flavor, L-theanine.\nNutrition (per can): 60 cal · 14g sugar · 0g fat · 25mg caffeine.',
    lookups: [
      { sys: 'System A — By Name', type: 'ok', text: '"Beverage, Cold, Canned"\nCategory: RTD > Tea > Functional' },
      { sys: 'System B — By Category', type: 'ok', text: '"Beverages > Canned > Ambient"\nRefrigerated or shelf-stable?\nSystem B is not sure.' },
      { sys: 'System C — By SKU', type: 'err', text: 'ITEM NOT FOUND.\nDid you mean: "Onto-Tea"?\nOr: "Onto-T" (apparel, size S)?' },
      { sys: 'System D — By Vendor Code', type: 'warn', text: '"Classified as Produce."\nLocation: Aisle F, next to the apples.' },
    ],
  },
  {
    name: "Cherre O's",
    icon: '🥣',
    images: ['Cherre-Os.png', 'cherre-os-back.png'],
    category: 'Cereal box',
    price: '$5.49',
    conflictPrice: 'or $3.99?',
    description: 'Crunchy whole-grain oat rings with a hint of cherry. 12 oz box.\nIngredients: Whole grain oats, sugar, corn starch, salt, dried cherry powder, vitamin E (mixed tocopherols).\nNutrition (1 cup / 32g): 120 cal · 24g carbs · 9g sugar · 3g fiber · 3g protein.',
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
    images: ['cherries-front.png', 'cherries-back.png'],
    category: 'Produce',
    price: '$6.99',
    conflictPrice: 'or $120,000/yr',
    description: 'Picked for clarity. Packed for decisions.\nContents: resolved entities, shared ontology, traceable lineage, validated inputs.\nQuality check: no duplicates, no conflicting definitions, no guesswork.\nOrigin: sourced across systems. Unified at the core.\nBest used for: portfolio visibility, cross-system alignment, decision-ready data.\nNote: the data did not change. The meaning did.\nNo disconnected silos. No mystery numbers.',
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
    images: ['parcel-front.png', 'parcel-back.png'],
    category: 'Shipping & Receiving',
    price: '$3.49',
    conflictPrice: 'or assessed value?',
    description: 'For the smooth flow of portfolio data. 8" × 8" × 8" corrugated kraft box.\nUses: resolves duplicate assets, aligns definitions, improves visibility.\nContents: resolved entities, shared ontology, traceable lineage, validated inputs.\nWarning: may expose spreadsheet dependency.\nNo disconnected silos. No mystery numbers.',
    lookups: [
      { sys: 'System A — By Name', type: 'ok', text: '"Package, Corrugated, Brown"\nDimensions: Unknown.\nContents: Unknown.' },
      { sys: 'System B — By Category', type: 'warn', text: '"Real Property > Land > Tax Lot"\nZoned: Mixed-Use Commercial.\nOwner of record: 3 LLCs and a trust.\nAssessed value: It depends.' },
      { sys: 'System C — By SKU', type: 'err', text: 'AMBIGUOUS IDENTIFIER.\nMatched 847,000 records.\nAll called "Parcel."\nNone agree on the address.' },
      { sys: 'System D — By Vendor Code', type: 'warn', text: '"Herb, Fresh, Flat-Leaf."\nSee also: Parsley.\nSee also: Parcel (land).\nSee also: Parcel (shipping).\nSystem D regrets the confusion.' },
    ],
  },
  {
    name: 'Bag of Flour',
    icon: '🌾',
    images: ['flour-front.png', 'flour-back.png'],
    category: 'Baking & Pantry',
    price: '$4.29',
    conflictPrice: 'or $0.42?',
    description: 'For baking structure into your data.\n\nUSES\n• Standardizes inputs\n• Reduces variability\n• Improves consistency\n\nMILLING PROCESS\n• Clean inputs\n• Defined measures\n• Repeatable workflows\n\nRESULT\nFrom raw ingredients to reliable outputs.\n\nNo guesswork.\nNo inconsistent results.',
    lookups: [
      { sys: 'System A — By Name', type: 'ok', text: '"Baking, Dry Goods, Milled Grain"\nUnit: 5 lb paper sack' },
      { sys: 'System B — By Category', type: 'warn', text: '"Powder, White, Bulk"\nMatched 14 records.\nIncludes: sugar, salt, drywall compound.' },
      { sys: 'System C — By SKU', type: 'err', text: 'WEIGHT MISMATCH.\nExpected: 5 lb.\nReceived: 5 lb (per scale).\nDiscrepancy unresolved.' },
      { sys: 'System D — By Vendor Code', type: 'ok', text: '"Wheat Flour, All-Purpose, Enriched"\nMill code: WF-002\nLot stable.' },
    ],
  },
  {
    name: 'Sardines',
    icon: '🐟',
    images: ['sardines-front.png', 'sardines-back.png'],
    category: 'Canned Seafood',
    price: '$2.79',
    conflictPrice: 'or $14.00?',
    description: 'Wild-caught Atlantic sardines packed in olive oil. 3.75 oz (106g) tin.\nIngredients: Sardines, olive oil, salt.\nNutrition (1 can drained / 75g): 190 cal · 11g fat (1.5g sat) · 380mg sodium · 22g protein · 27% DV calcium · 25% DV vitamin D · 1,400mg omega-3 (EPA+DHA).\nContains: fish. Product of Portugal.',
    lookups: [
      { sys: 'System A — By Name', type: 'ok', text: '"Fish, Small, Preserved in Oil"\nNet weight: 3.75 oz' },
      { sys: 'System B — By Category', type: 'warn', text: '"Pet Food > Cat > Wet"\nNOTE: Cats love it.\nHumans also eat it. Confusing.' },
      { sys: 'System C — By SKU', type: 'ok', text: '"Canned Sardines in Olive Oil"\nOrigin: Portugal\nBest by: 2029-04' },
      { sys: 'System D — By Vendor Code', type: 'err', text: 'BARCODE MISREAD.\nReturned: "Yacht, 42ft, Used."\nMSRP: $14,000.\nPlease rescan.' },
    ],
  },
  {
    name: 'Cherre Cola',
    icon: '🥤',
    images: ['cherre-cola-front.png', 'cherre-cola-back.png'],
    category: 'Beverage (bottle)',
    price: '$1.99',
    conflictPrice: 'or $0.05 deposit?',
    description: 'Classic cherry cola in a 12 fl oz (355mL) returnable glass bottle.\nIngredients: Carbonated water, cane sugar, caramel color, natural cherry flavor, phosphoric acid, caffeine.\nNutrition (per bottle): 150 cal · 0g fat · 30mg sodium · 39g carbs · 39g sugar (incl. 39g added sugars) · 35mg caffeine.\n$0.05 bottle deposit included. Return at any kiosk.',
    lookups: [
      { sys: 'System A — By Name', type: 'warn', text: '"Soft Drink, Carbonated, Cherry"\nDid you mean: "Cherre O\'s"?\nDid you mean: "Cherries"?' },
      { sys: 'System B — By Category', type: 'ok', text: '"Beverages > Soda > Cola"\n12 fl oz glass bottle' },
      { sys: 'System C — By SKU', type: 'err', text: 'TRADEMARK CONFLICT.\nName too similar to: "Cherre" (vendor).\nLegal hold: 1998–present.' },
      { sys: 'System D — By Vendor Code', type: 'ok', text: '"Bottled Cola, Cherry Flavor"\nDeposit: $0.05/bottle\nReturn at any kiosk.' },
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
  ['$178.30', 'Or $52.14.'],
];
