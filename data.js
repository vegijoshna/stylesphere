// ============================================================
// STYLESPHERE — EXTENDED PRODUCT DATA (40 Products)
// ============================================================

const generateProducts = () => {
  const categories = ['Men', 'Women', 'Kids', 'Accessories'];
  const baseProducts = [
    // Men (1-10)
    { name: "Classic Oxford Shirt", cat: "Men", price: 1299, old: 2199, img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80", tag: "shirt", badge: "sale" },
    { name: "Slim Fit Chinos", cat: "Men", price: 1799, old: 2499, img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=500&q=80", tag: "pants", badge: "new" },
    { name: "Graphic Oversized Tee", cat: "Men", price: 699, old: 999, img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&q=80", tag: "tshirt", badge: "hot" },
    { name: "Linen Blazer", cat: "Men", price: 3499, old: 5499, img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80", tag: "formal", badge: "sale" },
    { name: "Jogger Pants", cat: "Men", price: 999, old: 1499, img: "https://images.unsplash.com/photo-1556821840-3a63f8550ec9?auto=format&fit=crop&w=500&q=80", tag: "casual", badge: "" },
    { name: "Denim Jacket", cat: "Men", price: 2499, old: 3999, img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=500&q=80", tag: "denim", badge: "hot" },
    { name: "Formal Trousers", cat: "Men", price: 1599, old: 2199, img: "https://images.unsplash.com/photo-1594938298603-ebaa3b57b05b?auto=format&fit=crop&w=500&q=80", tag: "formal", badge: "" },
    { name: "Polo T-Shirt", cat: "Men", price: 899, old: 1299, img: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=500&q=80", tag: "tshirt", badge: "new" },
    { name: "Winter Bomber", cat: "Men", price: 2999, old: 4999, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&q=80", tag: "winter", badge: "sale" },
    { name: "Track Suit", cat: "Men", price: 1999, old: 2999, img: "https://images.unsplash.com/photo-1512327428889-607eeb19efe8?auto=format&fit=crop&w=500&q=80", tag: "sports", badge: "" },

    // Women (11-20)
    { name: "Floral Wrap Dress", cat: "Women", price: 1899, old: 2999, img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=500&q=80", tag: "dress", badge: "hot" },
    { name: "High-Rise Skinny Jeans", cat: "Women", price: 1699, old: 2299, img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=80", tag: "denim", badge: "new" },
    { name: "Boho Midi Skirt", cat: "Women", price: 1299, old: 1799, img: "https://images.unsplash.com/photo-1583496661160-fb5974ca0edd?auto=format&fit=crop&w=500&q=80", tag: "skirt", badge: "sale" },
    { name: "Structured Blazer", cat: "Women", price: 2999, old: 4499, img: "https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?auto=format&fit=crop&w=500&q=80", tag: "formal", badge: "" },
    { name: "Linen Palazzo Pants", cat: "Women", price: 1499, old: 2099, img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=500&q=80", tag: "ethnic", badge: "new" },
    { name: "Embroidered Kurti", cat: "Women", price: 999, old: 1599, img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80", tag: "ethnic", badge: "hot" },
    { name: "Silk Saree", cat: "Women", price: 4599, old: 6999, img: "https://images.unsplash.com/photo-1610189013227-2c992795f590?auto=format&fit=crop&w=500&q=80", tag: "saree", badge: "sale" },
    { name: "Crop Top", cat: "Women", price: 599, old: 899, img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=500&q=80", tag: "casual", badge: "" },
    { name: "Evening Gown", cat: "Women", price: 3999, old: 5999, img: "https://images.unsplash.com/photo-1566160980209-66c3a2f7c00e?auto=format&fit=crop&w=500&q=80", tag: "dress", badge: "new" },
    { name: "Cardigan Sweater", cat: "Women", price: 1299, old: 1899, img: "https://images.unsplash.com/photo-1434389678369-bd410f27c427?auto=format&fit=crop&w=500&q=80", tag: "winter", badge: "" },

    // Kids (21-30)
    { name: "Cartoon Print T-Shirt", cat: "Kids", price: 399, old: 699, img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=500&q=80", tag: "tshirt", badge: "sale" },
    { name: "Denim Dungaree", cat: "Kids", price: 899, old: 1299, img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=500&q=80", tag: "denim", badge: "hot" },
    { name: "Princess Frock", cat: "Kids", price: 799, old: 1199, img: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=500&q=80", tag: "dress", badge: "new" },
    { name: "Kids' Zip Hoodie", cat: "Kids", price: 699, old: 999, img: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=500&q=80", tag: "hoodie", badge: "" },
    { name: "Boys Cargo Pants", cat: "Kids", price: 599, old: 899, img: "https://images.unsplash.com/photo-1601646876127-d4218a4a5840?auto=format&fit=crop&w=500&q=80", tag: "casual", badge: "" },
    { name: "Girls Ethnic Lehenga", cat: "Kids", price: 1499, old: 2299, img: "https://images.unsplash.com/photo-1596434416550-93ed96365c19?auto=format&fit=crop&w=500&q=80", tag: "ethnic", badge: "hot" },
    { name: "Toddler Romper", cat: "Kids", price: 499, old: 799, img: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=500&q=80", tag: "casual", badge: "new" },
    { name: "School Uniform Set", cat: "Kids", price: 899, old: 1199, img: "https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=500&q=80", tag: "formal", badge: "" },
    { name: "Winter Beanie", cat: "Kids", price: 299, old: 499, img: "https://images.unsplash.com/photo-1544837517-802c6114eb91?auto=format&fit=crop&w=500&q=80", tag: "winter", badge: "sale" },
    { name: "Kids Sneakers", cat: "Kids", price: 799, old: 1299, img: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=500&q=80", tag: "sneakers", badge: "" },

    // Accessories (31-40)
    { name: "Aviator Sunglasses", cat: "Accessories", price: 799, old: 1299, img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500&q=80", tag: "sunglasses", badge: "sale" },
    { name: "Leather Tote Bag", cat: "Accessories", price: 2299, old: 3499, img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&q=80", tag: "bag", badge: "new" },
    { name: "Silk Scarf", cat: "Accessories", price: 599, old: 999, img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=500&q=80", tag: "scarf", badge: "" },
    { name: "Minimalist Watch", cat: "Accessories", price: 3499, old: 5999, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80", tag: "watch", badge: "sale" },
    { name: "Canvas Sneakers", cat: "Accessories", price: 1199, old: 1799, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80", tag: "sneakers", badge: "hot" },
    { name: "Beaded Bracelet Set", cat: "Accessories", price: 349, old: 599, img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=500&q=80", tag: "jewellery", badge: "new" },
    { name: "Gold Plated Necklace", cat: "Accessories", price: 899, old: 1499, img: "https://images.unsplash.com/photo-1599643478514-4a820cbf311e?auto=format&fit=crop&w=500&q=80", tag: "jewellery", badge: "" },
    { name: "Leather Belt", cat: "Accessories", price: 499, old: 799, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80", tag: "casual", badge: "" },
    { name: "Travel Backpack", cat: "Accessories", price: 1899, old: 2999, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80", tag: "bag", badge: "hot" },
    { name: "Fedora Hat", cat: "Accessories", price: 699, old: 999, img: "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=500&q=80", tag: "casual", badge: "sale" }
  ];

  return baseProducts.map((p, i) => {
    // Generate derived properties
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5 to 5.0
    const reviewsCount = Math.floor(Math.random() * 800) + 20;
    
    let sizes = ["S", "M", "L", "XL"];
    if (p.cat === 'Accessories' && p.tag !== 'sneakers') sizes = ["One Size"];
    if (p.tag === 'sneakers') sizes = ["6", "7", "8", "9", "10"];
    if (p.cat === 'Kids') sizes = ["2Y", "4Y", "6Y", "8Y"];

    return {
      id: i + 1,
      name: p.name,
      category: p.cat,
      price: p.price,
      originalPrice: p.old,
      image: p.img,
      emoji: "🛍️", // Fallback
      rating: parseFloat(rating),
      reviews: reviewsCount,
      badge: p.badge,
      isNew: p.badge === 'new',
      inStock: Math.random() > 0.1, // 90% chance to be in stock
      sizes: sizes,
      description: `Upgrade your style with this premium ${p.name.toLowerCase()}. Crafted with care for maximum comfort and durability. Perfect for any occasion.`,
      features: ["Premium Quality", "Comfortable Fit", "Easy Care", "Stylish Design"],
      tags: [p.tag, p.cat.toLowerCase(), "fashion", "trendy"]
    };
  });
};

const PRODUCTS = generateProducts();

// Coupon codes
const COUPONS = {
  "STYLE10": { discount: 10, type: "percent", label: "10% off" },
  "STYLE50": { discount: 50, type: "percent", label: "50% off" },
  "FLAT200": { discount: 200, type: "flat", label: "₹200 off" },
  "FLAT500": { discount: 500, type: "flat", label: "₹500 off" },
  "NEWUSER": { discount: 15, type: "percent", label: "15% off for new users" },
  "SHIP0":  { discount: 0, type: "shipping", label: "Free Shipping" },
};
