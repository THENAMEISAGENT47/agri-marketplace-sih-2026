/**
 * Centralized Commodity Image & Data Architecture
 * Single source of truth for produce visual assets, alt text, and metadata.
 */

export interface CommodityVisualMetadata {
  name: string
  image: string
  alt: string
  category: 'vegetables' | 'cereals' | 'pulses_oilseeds' | 'spices'
  defaultVariety: string
}

export const COMMODITY_CATALOG: Record<string, CommodityVisualMetadata> = {
  tomatoes: {
    name: 'Tomatoes',
    image: '/images/tomatoes.jpg',
    alt: 'Fresh harvest red tomatoes ready for institutional bulk procurement',
    category: 'vegetables',
    defaultVariety: 'Roma / Hybrid',
  },
  onions: {
    name: 'Onions',
    image: '/images/onions.jpg',
    alt: 'Cured red onions from Lasalgaon FPO cluster',
    category: 'vegetables',
    defaultVariety: 'Red Garwa',
  },
  potatoes: {
    name: 'Potatoes',
    image: '/images/potatoes.jpg',
    alt: 'Clean Jyoti ware potatoes from Indore agri cluster',
    category: 'vegetables',
    defaultVariety: 'Jyoti Ware',
  },
  rice: {
    name: 'Rice',
    image: '/images/rice.jpg',
    alt: 'Premium long-grain Basmati rice for institutional bulk procurement',
    category: 'cereals',
    defaultVariety: 'Basmati',
  },
  wheat: {
    name: 'Wheat',
    image: '/images/wheat.jpg',
    alt: 'Clean golden Lokwan wheat grain consignment',
    category: 'cereals',
    defaultVariety: 'Lokwan',
  },
  maize: {
    name: 'Maize',
    image: '/images/maize.jpg',
    alt: 'Golden hybrid feed and food-grade maize kernels',
    category: 'cereals',
    defaultVariety: 'Hybrid',
  },
  groundnut: {
    name: 'Groundnut',
    image: '/images/groundnut.jpg',
    alt: 'Bold-grade groundnut peanuts in shell and raw kernels',
    category: 'pulses_oilseeds',
    defaultVariety: 'Bold 80/90',
  },
  soybean: {
    name: 'Soybean',
    image: '/images/soybean.jpg',
    alt: 'High-protein JS 335 yellow soybeans for bulk processing',
    category: 'pulses_oilseeds',
    defaultVariety: 'JS 335',
  },
  chillies: {
    name: 'Green Chillies',
    image: '/images/chillies.jpg',
    alt: 'Fresh spicy green chillies G4 hot grade from Kolhapur cluster',
    category: 'spices',
    defaultVariety: 'G4 Hot',
  },
  carrots: {
    name: 'Carrots',
    image: '/images/carrots.jpg',
    alt: 'Fresh harvest crunchy orange carrots from Pune farm cluster',
    category: 'vegetables',
    defaultVariety: 'Orange Kuroda',
  },
  cabbage: {
    name: 'Cabbage',
    image: '/images/cabbage.jpg',
    alt: 'Crisp green farm-fresh cabbage heads ready for institutional transport',
    category: 'vegetables',
    defaultVariety: 'Golden Acre',
  },
  cauliflower: {
    name: 'Cauliflower',
    image: '/images/cauliflower.jpg',
    alt: 'Snow-white compact cauliflower heads sorted and graded',
    category: 'vegetables',
    defaultVariety: 'Snowball',
  },
  brinjal: {
    name: 'Brinjal / Eggplant',
    image: '/images/brinjal.jpg',
    alt: 'Glossy fresh purple brinjal eggplants sorted for wholesale delivery',
    category: 'vegetables',
    defaultVariety: 'Manjari Gota',
  },
  cucumbers: {
    name: 'Cucumbers',
    image: '/images/cucumbers.jpg',
    alt: 'Fresh crispy green farm cucumbers sorted for institutional catering',
    category: 'vegetables',
    defaultVariety: 'Malini Hybrid',
  },
  jowar: {
    name: 'Jowar',
    image: '/images/jowar.jpg',
    alt: 'High-fiber sorghum jowar grains from Maharashtra millet cluster',
    category: 'cereals',
    defaultVariety: 'Maldandi',
  },
  bajra: {
    name: 'Bajra',
    image: '/images/bajra.jpg',
    alt: 'Nutrient-rich pearl millet bajra grains for bulk food procurement',
    category: 'cereals',
    defaultVariety: 'Pioneer Hybrid',
  },
  barley: {
    name: 'Barley',
    image: '/images/barley.jpg',
    alt: 'Clean golden food and malt grade barley grains',
    category: 'cereals',
    defaultVariety: 'RD 2035',
  },
  ragi: {
    name: 'Ragi / Finger Millet',
    image: '/images/ragi.jpg',
    alt: 'Rich whole finger millet ragi seeds ready for food processing',
    category: 'cereals',
    defaultVariety: 'GPU-28 / Indaf',
  },
  foxtail_millet: {
    name: 'Foxtail Millet',
    image: '/images/foxtail-millet.jpg',
    alt: 'Golden nutrient-dense foxtail millet grains wholesale lot',
    category: 'cereals',
    defaultVariety: 'SiA 3088',
  },
  kodo_millet: {
    name: 'Kodo Millet',
    image: '/images/kodo-millet.jpg',
    alt: 'Dehusked polished wholesome kodo millet grain consignment',
    category: 'cereals',
    defaultVariety: 'TNAU 86',
  },
  little_millet: {
    name: 'Little Millet / Kutki',
    image: '/images/little-millet.jpg',
    alt: 'Traditional pale little millet kutki grains from tribal farmer collectives',
    category: 'cereals',
    defaultVariety: 'CO 4 / Local',
  },
}

/**
 * Returns the verified local image path for any commodity name
 */
export function getCommodityImage(productName?: string): string {
  if (!productName) return '/images/tomatoes.jpg'
  const key = productName.trim().toLowerCase()

  if (key.includes('tomato')) return COMMODITY_CATALOG.tomatoes.image
  if (key.includes('onion')) return COMMODITY_CATALOG.onions.image
  if (key.includes('potato')) return COMMODITY_CATALOG.potatoes.image
  if (key.includes('rice')) return COMMODITY_CATALOG.rice.image
  if (key.includes('wheat')) return COMMODITY_CATALOG.wheat.image
  if (key.includes('maize') || key.includes('corn')) return COMMODITY_CATALOG.maize.image
  if (key.includes('groundnut') || key.includes('peanut')) return COMMODITY_CATALOG.groundnut.image
  if (key.includes('soybean') || key.includes('soya')) return COMMODITY_CATALOG.soybean.image
  if (key.includes('chilli') || key.includes('chili') || key.includes('pepper')) return COMMODITY_CATALOG.chillies.image
  if (key.includes('carrot')) return COMMODITY_CATALOG.carrots.image
  if (key.includes('cabbage')) return COMMODITY_CATALOG.cabbage.image
  if (key.includes('cauliflower')) return COMMODITY_CATALOG.cauliflower.image
  if (key.includes('brinjal') || key.includes('eggplant') || key.includes('aubergine')) return COMMODITY_CATALOG.brinjal.image
  if (key.includes('cucumber')) return COMMODITY_CATALOG.cucumbers.image
  if (key.includes('jowar') || key.includes('sorghum')) return COMMODITY_CATALOG.jowar.image
  if (key.includes('bajra')) return COMMODITY_CATALOG.bajra.image
  if (key.includes('barley')) return COMMODITY_CATALOG.barley.image
  if (key.includes('ragi') || key.includes('finger millet')) return COMMODITY_CATALOG.ragi.image
  if (key.includes('foxtail')) return COMMODITY_CATALOG.foxtail_millet.image
  if (key.includes('kodo')) return COMMODITY_CATALOG.kodo_millet.image
  if (key.includes('little') || key.includes('kutki')) return COMMODITY_CATALOG.little_millet.image

  return '/images/tomatoes.jpg'
}

/**
 * Returns descriptive alt text for accessibility
 */
export function getCommodityAlt(productName?: string, variety?: string): string {
  if (!productName) return 'Agricultural commodity lot'
  const key = productName.trim().toLowerCase()
  const varietyText = variety ? ` (${variety} variety)` : ''

  if (key.includes('tomato')) return `${COMMODITY_CATALOG.tomatoes.alt}${varietyText}`
  if (key.includes('onion')) return `${COMMODITY_CATALOG.onions.alt}${varietyText}`
  if (key.includes('potato')) return `${COMMODITY_CATALOG.potatoes.alt}${varietyText}`
  if (key.includes('rice')) return `${COMMODITY_CATALOG.rice.alt}${varietyText}`
  if (key.includes('wheat')) return `${COMMODITY_CATALOG.wheat.alt}${varietyText}`
  if (key.includes('maize') || key.includes('corn')) return `${COMMODITY_CATALOG.maize.alt}${varietyText}`
  if (key.includes('groundnut') || key.includes('peanut')) return `${COMMODITY_CATALOG.groundnut.alt}${varietyText}`
  if (key.includes('soybean') || key.includes('soya')) return `${COMMODITY_CATALOG.soybean.alt}${varietyText}`
  if (key.includes('chilli') || key.includes('chili') || key.includes('pepper')) return `${COMMODITY_CATALOG.chillies.alt}${varietyText}`
  if (key.includes('carrot')) return `${COMMODITY_CATALOG.carrots.alt}${varietyText}`
  if (key.includes('cabbage')) return `${COMMODITY_CATALOG.cabbage.alt}${varietyText}`
  if (key.includes('cauliflower')) return `${COMMODITY_CATALOG.cauliflower.alt}${varietyText}`
  if (key.includes('brinjal') || key.includes('eggplant')) return `${COMMODITY_CATALOG.brinjal.alt}${varietyText}`
  if (key.includes('cucumber')) return `${COMMODITY_CATALOG.cucumbers.alt}${varietyText}`
  if (key.includes('jowar') || key.includes('sorghum')) return `${COMMODITY_CATALOG.jowar.alt}${varietyText}`
  if (key.includes('bajra')) return `${COMMODITY_CATALOG.bajra.alt}${varietyText}`
  if (key.includes('barley')) return `${COMMODITY_CATALOG.barley.alt}${varietyText}`
  if (key.includes('ragi') || key.includes('finger millet')) return `${COMMODITY_CATALOG.ragi.alt}${varietyText}`
  if (key.includes('foxtail')) return `${COMMODITY_CATALOG.foxtail_millet.alt}${varietyText}`
  if (key.includes('kodo')) return `${COMMODITY_CATALOG.kodo_millet.alt}${varietyText}`
  if (key.includes('little') || key.includes('kutki')) return `${COMMODITY_CATALOG.little_millet.alt}${varietyText}`

  return `${productName}${varietyText} - Agricultural commodity lot`
}

/**
 * Returns canonical display category for any commodity name
 */
export function getCommodityCategory(productName?: string): string {
  if (!productName) return 'Vegetables'
  const key = productName.trim().toLowerCase()
  if (key.includes('potato')) {
    return 'Tubers'
  }
  if (
    key.includes('wheat') || 
    key.includes('rice') || 
    key.includes('maize') || 
    key.includes('corn') ||
    key.includes('jowar') ||
    key.includes('sorghum') ||
    key.includes('bajra') ||
    key.includes('millet') ||
    key.includes('barley') ||
    key.includes('ragi') ||
    key.includes('foxtail') ||
    key.includes('kodo') ||
    key.includes('kutki')
  ) {
    return 'Grains / Cereals'
  }
  if (key.includes('soybean') || key.includes('soya') || key.includes('groundnut') || key.includes('peanut')) {
    return 'Pulses & Oilseeds'
  }
  if (key.includes('chilli') || key.includes('chili') || key.includes('pepper') || key.includes('spice')) {
    return 'Spices'
  }
  return 'Vegetables'
}
