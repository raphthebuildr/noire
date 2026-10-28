export type CategorySlug =
  | "t-shirts"
  | "hoodies"
  | "shirts"
  | "trousers"
  | "jackets"
  | "accessories";

export type Category = {
  name: string;
  slug: CategorySlug;
  description: string;
  image: string;
};

export type ProductColor = {
  name: string;
  hex: string;
  image: string;
};

export type ProductImage = {
  src: string;
  alt: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  collection: "core-edition" | "new-arrivals" | "best-sellers";
  price: number;
  compareAtPrice?: number;
  shortDescription: string;
  description: string;
  details: string[];
  material: string;
  fit: string;
  care: string;
  colors: ProductColor[];
  sizes: string[];
  stock: Record<string, Record<string, number>>;
  gallery: ProductImage[];
  isNew: boolean;
  featuredRank: number;
  rating: number;
  reviewCount: number;
};

export type Variant = {
  id: string;
  product: Product;
  color: string;
  size: string;
  stock: number;
};

export const categories: Category[] = [
  {
    name: "T-Shirts",
    slug: "t-shirts",
    description: "Weighted cotton essentials.",
    image: "/images/editorial/home-b-02-editorial-lookbook-studio-shot-of-an-oversized-heavyweight-j.jpg",
  },
  {
    name: "Hoodies",
    slug: "hoodies",
    description: "Soft structure, everyday warmth.",
    image: "/images/editorial/home-b-04-premium-heavyweight-pullover-hoodie-in-heather-slate-grey-ar.jpg",
  },
  {
    name: "Shirts",
    slug: "shirts",
    description: "Relaxed tailoring and washed finishes.",
    image: "/images/editorial/home-b-06-editorial-product-shot-of-a-warm-sand-beige-linen-blend-over.jpg",
  },
  {
    name: "Trousers",
    slug: "trousers",
    description: "Clean lines, considered volume.",
    image: "/images/editorial/home-a-04-editorial-look-of-relaxed-pleated-wide-trousers-in-deep-char.jpg",
  },
  {
    name: "Jackets",
    slug: "jackets",
    description: "Light layers with a quiet edge.",
    image: "/images/editorial/home-b-08-minimalist-coach-jacket-in-matte-deep-noir-water-repellent-s.jpg",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "The finishing details.",
    image: "/images/editorial/home-b-15-editorial-flat-lay-arrangement-of-full-grain-black-leather-c.jpg",
  },
];

export const collections = [
  {
    name: "Core Edition",
    slug: "core-edition",
    description: "The pieces we return to.",
  },
  {
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "The latest from the studio.",
  },
  {
    name: "Best Sellers",
    slug: "best-sellers",
    description: "Quietly essential, worn on repeat.",
  },
];

const black = { name: "Black", hex: "#1c1c1c" };
const bone = { name: "Bone", hex: "#e8e1d3" };
const stone = { name: "Stone", hex: "#cfc8bc" };
const charcoal = { name: "Charcoal", hex: "#3b3b38" };
const sand = { name: "Sand", hex: "#c8b9a1" };
const natural = { name: "Natural", hex: "#d8cdb8" };

export const products: Product[] = [
  {
    id: "prod-01",
    slug: "heavyweight-oversized-tee",
    name: "Heavyweight Oversized Tee",
    category: "t-shirts",
    collection: "core-edition",
    price: 65,
    shortDescription:
      "A dense 260gsm cotton tee cut with a dropped shoulder and a generous, architectural drape.",
    description:
      "The Heavyweight Oversized Tee is built from compact combed cotton with a dry, structured hand. A wide body, dropped shoulder and ribbed crew neck keep the silhouette clean without feeling oversized for the sake of it.",
    details: [
      "260gsm compact combed cotton",
      "Dropped shoulder with a wide body",
      "Ribbed crew neck",
      "Pre-shrunk and garment-washed",
    ],
    material: "100% combed cotton",
    fit: "Oversized. Size down for a closer fit.",
    care: "Machine wash cold with like colours. Hang dry. Warm iron if needed.",
    colors: [
      { ...black, image: "/images/products/stitch-01-heavyweight-oversized-tee.jpg" },
      {
        ...bone,
        image:
          "/images/editorial/home-a-02-editorial-still-life-of-a-pristine-heavyweight-boxy-t-shirt.jpg",
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: {
      Black: { S: 12, M: 18, L: 20, XL: 14, XXL: 8 },
      Bone: { S: 10, M: 16, L: 12, XL: 6, XXL: 0 },
    },
    gallery: [
      {
        src: "/images/editorial/home-b-03-fashion-model-wearing-a-relaxed-black-oversized-heavyweight.jpg",
        alt: "Model wearing the Heavyweight Oversized Tee with stone trousers",
      },
      {
        src: "/images/editorial/home-a-03-close-up-fashion-angle-of-a-model-wearing-a-heavyweight-boxy.jpg",
        alt: "Close-up of the heavyweight cotton collar and shoulder seam",
      },
    ],
    isNew: true,
    featuredRank: 1,
    rating: 4.8,
    reviewCount: 24,
  },
  {
    id: "prod-02",
    slug: "everyday-crew-tee",
    name: "Everyday Crew Tee",
    category: "t-shirts",
    collection: "core-edition",
    price: 45,
    shortDescription:
      "The everyday tee: soft, clean and cut to sit close without clinging.",
    description:
      "A midweight cotton crew neck with a neat body and a slightly shorter length. Designed to layer or wear alone, with a smooth hand that softens with every wash.",
    details: [
      "180gsm combed cotton jersey",
      "Tubular body to prevent twisting",
      "Ribbed crew neck",
      "Slightly shorter body length",
    ],
    material: "100% combed cotton",
    fit: "Regular. True to size.",
    care: "Machine wash cold. Tumble dry low. Warm iron if needed.",
    colors: [
      { ...black, image: "/images/products/stitch-01-heavyweight-oversized-tee.jpg" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: {
      Black: { S: 14, M: 22, L: 24, XL: 16, XXL: 10 },
    },
    gallery: [
      {
        src: "/images/editorial/home-b-10-atmospheric-high-fashion-photograph-of-stacked-heavyweight-c.jpg",
        alt: "Stacked heavyweight cotton tees in charcoal and ivory",
      },
      {
        src: "/images/editorial/home-a-03-close-up-fashion-angle-of-a-model-wearing-a-heavyweight-boxy.jpg",
        alt: "Close-up of a heavyweight cotton tee",
      },
    ],
    isNew: false,
    featuredRank: 6,
    rating: 4.7,
    reviewCount: 31,
  },
  {
    id: "prod-03",
    slug: "heavyweight-pullover-hoodie",
    name: "Heavyweight Pullover Hoodie",
    category: "hoodies",
    collection: "core-edition",
    price: 110,
    shortDescription:
      "A 480gsm French terry hoodie with a double-layer hood and a clean, dropped shoulder.",
    description:
      "Built for repeat wear, the Heavyweight Pullover Hoodie uses dense brushed-back French terry and a double-layer hood without drawstrings. The body is roomy but controlled, with a ribbed hem that holds its shape.",
    details: [
      "480gsm brushed-back French terry",
      "Double-layer hood without drawstrings",
      "Dropped shoulder",
      "Ribbed cuffs and hem",
    ],
    material: "100% cotton French terry",
    fit: "Relaxed. True to size.",
    care: "Machine wash cold inside out. Hang dry. Do not tumble dry.",
    colors: [
      {
        ...black,
        image: "/images/products/generated-black-pullover-hoodie.jpg",
      },
      {
        ...stone,
        image: "/images/products/stitch-07-heavyweight-pullover-hoodie.jpg",
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: {
      Black: { S: 6, M: 10, L: 8, XL: 4, XXL: 2 },
      Stone: { S: 8, M: 12, L: 10, XL: 6, XXL: 3 },
    },
    gallery: [
      {
        src: "/images/editorial/home-b-04-premium-heavyweight-pullover-hoodie-in-heather-slate-grey-ar.jpg",
        alt: "Heavyweight pullover hoodie in heather slate",
      },
      {
        src: "/images/editorial/home-b-05-editorial-portrait-of-a-model-in-a-heather-slate-heavyweight.jpg",
        alt: "Model wearing the heavyweight pullover hoodie",
      },
    ],
    isNew: true,
    featuredRank: 2,
    rating: 4.9,
    reviewCount: 18,
  },
  {
    id: "prod-04",
    slug: "relaxed-zip-hoodie",
    name: "Relaxed Zip Hoodie",
    category: "hoodies",
    collection: "core-edition",
    price: 115,
    compareAtPrice: 135,
    shortDescription:
      "A relaxed zip-through hoodie in brushed fleece with a clean, uncomplicated line.",
    description:
      "The Relaxed Zip Hoodie is cut with a little extra room through the body and sleeve. A two-way zip and a soft double-layer hood make it an easy layer for transitional weather.",
    details: [
      "420gsm brushed cotton fleece",
      "Two-way metal zip",
      "Double-layer hood",
      "Ribbed cuffs and hem",
    ],
    material: "100% cotton fleece",
    fit: "Relaxed. Size down for a closer fit.",
    care: "Machine wash cold. Hang dry. Warm iron if needed.",
    colors: [
      {
        ...charcoal,
        image: "/images/products/stitch-02-relaxed-zip-hoodie.jpg",
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: {
      Charcoal: { S: 10, M: 14, L: 12, XL: 8, XXL: 4 },
    },
    gallery: [
      {
        src: "/images/editorial/home-a-08-editorial-still-shot-of-a-structured-raglan-hoodie-in-washed.jpg",
        alt: "Structured raglan hoodie in washed slate",
      },
      {
        src: "/images/editorial/home-a-09-model-posing-in-a-washed-slate-hoodie-with-architectural-sho.jpg",
        alt: "Model wearing a washed slate hoodie",
      },
    ],
    isNew: false,
    featuredRank: 5,
    rating: 4.8,
    reviewCount: 12,
  },
  {
    id: "prod-05",
    slug: "relaxed-oxford-shirt",
    name: "Relaxed Oxford Shirt",
    category: "shirts",
    collection: "core-edition",
    price: 95,
    shortDescription:
      "A softened cotton oxford with a relaxed collar and an easy, lived-in line.",
    description:
      "The Relaxed Oxford Shirt is cut from washed cotton oxford with a natural drape. A relaxed collar, single chest pocket and curved hem make it equally at home open over a tee or buttoned to the top.",
    details: [
      "Washed cotton oxford",
      "Relaxed point collar",
      "Single chest pocket",
      "Curved hem",
    ],
    material: "100% cotton oxford",
    fit: "Relaxed. True to size.",
    care: "Machine wash cold. Hang dry. Warm iron if needed.",
    colors: [
      {
        ...bone,
        image: "/images/products/stitch-08-structured-work-shirt.jpg",
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: {
      Bone: { S: 8, M: 12, L: 10, XL: 6, XXL: 0 },
    },
    gallery: [
      {
        src: "/images/editorial/home-b-12-close-up-still-life-photograph-of-raw-linen-shirt-fabric-wea.jpg",
        alt: "Close-up of washed cotton shirting and horn buttons",
      },
      {
        src: "/images/editorial/about-04-twill-detail.jpg",
        alt: "Detail of matte horn button and single-needle stitching",
      },
    ],
    isNew: false,
    featuredRank: 8,
    rating: 4.6,
    reviewCount: 9,
  },
  {
    id: "prod-06",
    slug: "linen-blend-overshirt",
    name: "Linen Blend Overshirt",
    category: "shirts",
    collection: "new-arrivals",
    price: 95,
    shortDescription:
      "A warm-weather overshirt in a textured linen blend with horn buttons and dual chest pockets.",
    description:
      "Cut with the ease of a shirt and the utility of a light jacket, the Linen Blend Overshirt is made from a breathable linen-cotton weave. It softens with wear and works open over a tank or closed as a standalone layer.",
    details: [
      "Linen-cotton blend",
      "Dual chest flap pockets",
      "Natural horn buttons",
      "Straight hem with side vents",
    ],
    material: "55% linen, 45% cotton",
    fit: "Relaxed. True to size.",
    care: "Machine wash cold. Hang dry. Warm iron while slightly damp.",
    colors: [
      {
        ...sand,
        image: "/images/products/stitch-03-linen-blend-overshirt.jpg",
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: {
      Sand: { S: 10, M: 14, L: 12, XL: 6, XXL: 4 },
    },
    gallery: [
      {
        src: "/images/editorial/home-b-06-editorial-product-shot-of-a-warm-sand-beige-linen-blend-over.jpg",
        alt: "Linen blend overshirt on a sculptural steel frame",
      },
      {
        src: "/images/editorial/home-b-07-model-wearing-the-linen-blend-overshirt-open-over-a-white-ta.jpg",
        alt: "Model wearing the linen blend overshirt open over a tank",
      },
    ],
    isNew: true,
    featuredRank: 3,
    rating: 4.8,
    reviewCount: 15,
  },
  {
    id: "prod-07",
    slug: "straight-leg-trousers",
    name: "Straight Leg Trousers",
    category: "trousers",
    collection: "core-edition",
    price: 110,
    shortDescription:
      "A clean straight-leg trouser in heavy cotton twill, cut to fall with a precise line.",
    description:
      "The Straight Leg Trouser is built from a dry cotton twill with enough weight to hold a crease. A mid rise and straight leg create a simple, architectural line that works with tees, knits and shirting.",
    details: [
      "Heavy cotton twill",
      "Mid rise with a straight leg",
      "Pressed front crease",
      "Belt loops and side pockets",
    ],
    material: "100% cotton twill",
    fit: "Straight. True to size.",
    care: "Machine wash cold. Hang dry. Warm iron if needed.",
    colors: [
      {
        ...black,
        image: "/images/products/generated-black-straight-trousers.jpg",
      },
    ],
    sizes: ["28", "30", "32", "34", "36"],
    stock: {
      Black: { "28": 8, "30": 12, "32": 14, "34": 10, "36": 6 },
    },
    gallery: [
      {
        src: "/images/products/stitch-09-tailored-cropped-trouser.jpg",
        alt: "Tailored trouser in slate cotton",
      },
      {
        src: "/images/editorial/home-b-13-editorial-shot-focused-on-wide-leg-tailored-trousers-in-heav.jpg",
        alt: "Tailored trousers falling over leather boots",
      },
    ],
    isNew: false,
    featuredRank: 7,
    rating: 4.7,
    reviewCount: 14,
  },
  {
    id: "prod-08",
    slug: "pleated-wide-trousers",
    name: "Pleated Wide Trousers",
    category: "trousers",
    collection: "core-edition",
    price: 120,
    shortDescription:
      "Relaxed wide-leg trousers with a single front pleat and a fluid, tailored drape.",
    description:
      "The Pleated Wide Trouser is cut from a soft wool blend with a single front pleat and a high rise. The leg falls wide and clean, with enough movement for everyday wear and enough structure for evening.",
    details: [
      "Wool-blend suiting",
      "Single front pleat",
      "High rise with a wide leg",
      "Side seam pockets",
    ],
    material: "68% wool, 32% polyester",
    fit: "Wide. True to size.",
    care: "Dry clean only.",
    colors: [
      {
        ...charcoal,
        image: "/images/products/stitch-04-pleated-wide-trousers.jpg",
      },
    ],
    sizes: ["28", "30", "32", "34", "36"],
    stock: {
      Charcoal: { "28": 6, "30": 10, "32": 8, "34": 6, "36": 0 },
    },
    gallery: [
      {
        src: "/images/editorial/home-a-04-editorial-look-of-relaxed-pleated-wide-trousers-in-deep-char.jpg",
        alt: "Pleated wide trousers in deep charcoal",
      },
      {
        src: "/images/editorial/home-a-05-full-body-shot-of-a-model-walking-in-charcoal-pleated-wide-t.jpg",
        alt: "Model walking in charcoal pleated wide trousers",
      },
    ],
    isNew: true,
    featuredRank: 4,
    rating: 4.9,
    reviewCount: 21,
  },
  {
    id: "prod-09",
    slug: "coach-jacket",
    name: "Coach Jacket",
    category: "jackets",
    collection: "core-edition",
    price: 135,
    shortDescription:
      "A matte water-repellent coach jacket with a snap front and a clean pointed collar.",
    description:
      "A minimal take on the coach jacket, cut in a matte water-repellent shell. The snap front, pointed collar and clean hem keep the line sharp, while a light lining makes it easy to layer.",
    details: [
      "Water-repellent matte shell",
      "Snap button front",
      "Pointed collar",
      "Lightweight lining",
    ],
    material: "100% recycled polyester shell",
    fit: "Relaxed. True to size.",
    care: "Wipe clean or machine wash cold on a gentle cycle. Hang dry.",
    colors: [
      {
        ...black,
        image: "/images/products/stitch-05-minimalist-coach-jacket.jpg",
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: {
      Black: { S: 6, M: 10, L: 8, XL: 4, XXL: 2 },
    },
    gallery: [
      {
        src: "/images/editorial/home-b-08-minimalist-coach-jacket-in-matte-deep-noir-water-repellent-s.jpg",
        alt: "Minimalist coach jacket in deep noir",
      },
      {
        src: "/images/editorial/home-b-09-urban-editorial-image-of-a-figure-walking-in-the-city-wearin.jpg",
        alt: "Coach jacket worn in the city",
      },
    ],
    isNew: false,
    featuredRank: 9,
    rating: 4.8,
    reviewCount: 11,
  },
  {
    id: "prod-10",
    slug: "lightweight-bomber",
    name: "Lightweight Bomber",
    category: "jackets",
    collection: "new-arrivals",
    price: 140,
    compareAtPrice: 165,
    shortDescription:
      "A light, insulated bomber with a clean ribbed collar and a quiet, technical finish.",
    description:
      "The Lightweight Bomber is cut with a little extra room through the body and finished with a ribbed collar, cuffs and hem. A light insulation makes it a useful layer without the bulk.",
    details: [
      "Lightly insulated technical shell",
      "Ribbed collar, cuffs and hem",
      "Two-way front zip",
      "Interior pocket",
    ],
    material: "Recycled nylon shell with recycled polyester fill",
    fit: "Relaxed. True to size.",
    care: "Machine wash cold on a gentle cycle. Hang dry. Do not iron.",
    colors: [
      {
        ...charcoal,
        image: "/images/products/stitch-10-insulated-bomber-jacket.jpg",
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: {
      Charcoal: { S: 8, M: 12, L: 10, XL: 6, XXL: 4 },
    },
    gallery: [
      {
        src: "/images/editorial/home-b-14-editorial-look-of-a-structured-charcoal-wool-blend-overcoat.jpg",
        alt: "Structured charcoal outerwear in motion",
      },
      {
        src: "/images/editorial/home-b-09-urban-editorial-image-of-a-figure-walking-in-the-city-wearin.jpg",
        alt: "Outerwear in an urban setting",
      },
    ],
    isNew: true,
    featuredRank: 10,
    rating: 4.7,
    reviewCount: 7,
  },
  {
    id: "prod-11",
    slug: "canvas-tote",
    name: "Canvas Tote",
    category: "accessories",
    collection: "core-edition",
    price: 40,
    shortDescription:
      "A sturdy washed-canvas tote with a wide base and clean, reinforced handles.",
    description:
      "The Canvas Tote is made from a heavy washed canvas with a wide base and reinforced handles. It holds a laptop, a notebook and the rest of the day without losing its shape.",
    details: [
      "Heavy washed cotton canvas",
      "Wide base with interior pocket",
      "Reinforced handles",
      "Natural undyed finish",
    ],
    material: "100% cotton canvas",
    fit: "One size. 42cm x 36cm x 14cm.",
    care: "Spot clean with cold water. Air dry.",
    colors: [
      {
        ...natural,
        image: "/images/products/stitch-11-washed-canvas-tote-bag.jpg",
      },
    ],
    sizes: ["One Size"],
    stock: {
      Natural: { "One Size": 25 },
    },
    gallery: [
      {
        src: "/images/editorial/cart-05-a-durable-washed-canvas-tote-bag-in-warm-ecru-and-charcoal-s.jpg",
        alt: "Washed canvas tote in warm ecru",
      },
      {
        src: "/images/editorial/home-b-15-editorial-flat-lay-arrangement-of-full-grain-black-leather-c.jpg",
        alt: "Accessories flat lay with canvas and leather",
      },
    ],
    isNew: false,
    featuredRank: 11,
    rating: 4.6,
    reviewCount: 19,
  },
  {
    id: "prod-12",
    slug: "six-panel-cotton-cap",
    name: "Six-Panel Cotton Cap",
    category: "accessories",
    collection: "new-arrivals",
    price: 35,
    shortDescription:
      "A six-panel cotton cap with a soft crown, curved brim and subtle brass eyelets.",
    description:
      "A quiet everyday cap in washed cotton twill. The six-panel construction gives it a clean shape, while the curved brim and adjustable back keep it comfortable.",
    details: [
      "Washed cotton twill",
      "Six-panel construction",
      "Curved brim",
      "Adjustable back strap",
    ],
    material: "100% cotton twill",
    fit: "One size. Adjustable back strap.",
    care: "Spot clean with cold water. Air dry.",
    colors: [
      {
        ...stone,
        image: "/images/products/generated-stone-cap.jpg",
      },
    ],
    sizes: ["One Size"],
    stock: {
      Stone: { "One Size": 20 },
    },
    gallery: [
      {
        src: "/images/editorial/home-b-15-editorial-flat-lay-arrangement-of-full-grain-black-leather-c.jpg",
        alt: "Accessories flat lay with a stone cap",
      },
    ],
    isNew: true,
    featuredRank: 12,
    rating: 4.5,
    reviewCount: 6,
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getFeaturedProducts(limit = 4) {
  return [...products]
    .sort((a, b) => a.featuredRank - b.featuredRank)
    .slice(0, limit);
}

export function getNewArrivals(limit = 4) {
  return products.filter((product) => product.isNew).slice(0, limit);
}

export function getProductsByCategory(category: string) {
  return products.filter((product) => product.category === category);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        (candidate.category === product.category ||
          candidate.collection === product.collection),
    )
    .slice(0, limit);
}

export function getColorImage(product: Product, colorName?: string) {
  const color = product.colors.find((item) => item.name === colorName);
  return color?.image ?? product.colors[0].image;
}

export function getProductGallery(product: Product, colorName?: string) {
  return [
    {
      src: getColorImage(product, colorName),
      alt: `${product.name} in ${colorName ?? product.colors[0].name}`,
    },
    ...product.gallery,
  ];
}

export function getVariantSku(
  product: Product,
  colorName: string,
  size: string,
) {
  return [product.slug, colorName, size]
    .join("-")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-");
}

export function getVariant(
  product: Product,
  colorName: string,
  size: string,
): Variant | undefined {
  const stock = product.stock[colorName]?.[size];
  if (stock === undefined) return undefined;

  return {
    id: `${product.slug}--${slugify(colorName)}--${slugify(size)}`,
    product,
    color: colorName,
    size,
    stock,
  };
}

export function getDefaultVariant(product: Product) {
  for (const color of product.colors) {
    for (const size of product.sizes) {
      const variant = getVariant(product, color.name, size);
      if (variant && variant.stock > 0) return variant;
    }
  }
  return getVariant(product, product.colors[0].name, product.sizes[0]);
}

export function getColorSizes(product: Product, colorName: string) {
  return product.sizes.map((size) => ({
    size,
    stock: product.stock[colorName]?.[size] ?? 0,
  }));
}

export function isProductInStock(product: Product) {
  return product.colors.some((color) =>
    product.sizes.some((size) => (product.stock[color.name]?.[size] ?? 0) > 0),
  );
}

export function getPriceRange(product: Product) {
  return product.price;
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function searchProducts(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return products.filter((product) => {
    const haystack = [
      product.name,
      product.shortDescription,
      product.description,
      product.material,
      product.category,
      ...product.colors.map((color) => color.name),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const allSizes = Array.from(
  new Set(products.flatMap((product) => product.sizes)),
);

export const allColors = Array.from(
  new Set(products.flatMap((product) => product.colors.map((color) => color.name))),
);
