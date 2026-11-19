/**
 * Batch 5 — 15 house-blessing / housewarming templates, with three new design styles
 * (Modern Farmhouse, Japandi, Mediterranean) and two new themes (Welcoming, Grateful).
 * Row: id, name, occasion, style, mood, colorFamily, layout, decor, coverEffect, titleAnim, reveal,
 *      headingFont, bodyFont, bg, text, accent, coverFrom, coverTo, coverText, blurb, [extras: fxColor, align]
 */
export default function buildExtra3(t) {
  const R = (id, name, occ, style, mood, color, layout, decor, effect, anim, reveal, hf, bf, bg, tx, ac, cf, ct, cc, blurb, x = {}) =>
    t(id, name, occ, style, mood, color, {
      fontHeading: hf, fontBody: bf, layout, decor, coverEffect: effect, titleAnim: anim, reveal,
      bgColor: bg, textColor: tx, accentColor: ac, coverFrom: cf, coverTo: ct, coverText: cc, ...x,
    }, blurb);
  const H = 'house-blessing';

  return [
    /* ------------------------------------------------------- MODERN FARMHOUSE (3) */
    R('open-door', 'Open Door', H, 'Modern Farmhouse', 'Welcoming', 'green', 'doorway', 'leaves', 'none', 'blur', 'fade-up', 'Fraunces', 'Lora', '#F7F4EC', '#34402F', '#B26A3B', '#DDE5D2', '#C7D4BA', '#2F3A2B', 'A sage front door with a leafy wreath and a welcome mat. Come on in.'),
    R('farmhouse-grace', 'Farmhouse Grace', H, 'Modern Farmhouse', 'Grateful', 'neutral', 'frame', 'leaves', 'none', 'rise', 'fade-up', 'Playfair Display', 'Inter', '#FAF8F4', '#2E2E2B', '#A47C57', '#2F3430', '#232723', '#F4EFE6', 'Black-window farmhouse: charcoal, linen and warm oak.'),
    R('hearth-and-home', 'Hearth & Home', H, 'Modern Farmhouse', 'Cozy', 'red', 'vintage', 'leaves', 'none', 'typewriter', 'fade-up', 'Fraunces', 'Lora', '#FBF3E8', '#4A2A22', '#B5482F', '#E9D7BC', '#D8BF9A', '#4A2A22', 'A postcard sent home: brick red, cream and woodsmoke.'),

    /* ------------------------------------------------------------------ JAPANDI (3) */
    R('kyoto-hearth', 'Kyoto Hearth', H, 'Japandi', 'Serene', 'neutral', 'minimal', 'none', 'none', 'rise', 'fade-up', 'Josefin Sans', 'Lora', '#F6F2EA', '#2B2A27', '#A0714F', '#EAE3D6', '#DDD4C4', '#2B2A27', 'Oak, linen and a single clay accent. Calm, low and quiet.', { align: 'left' }),
    R('oak-and-linen', 'Oak & Linen', H, 'Japandi', 'Grateful', 'neutral', 'house', 'none', 'none', 'blur', 'blur', 'Cormorant Garamond', 'Inter', '#F7F4EE', '#33302B', '#8B6F4E', '#E8E1D3', '#D9D0BE', '#33302B', 'A one-line house drawing itself onto warm linen.'),
    R('wabi-sabi-home', 'Wabi-Sabi Home', H, 'Japandi', 'Intimate', 'neutral', 'split', 'none', 'grain', 'rise', 'slide', 'Josefin Sans', 'Lora', '#F3EEE6', '#2F2923', '#C79A6B', '#3A332C', '#2B251F', '#EFE7DA', 'Imperfect clay, charred wood and film grain. Beautiful because it is lived in.', { align: 'left' }),

    /* ------------------------------------------------------------ MEDITERRANEAN (3) */
    R('terracotta-courtyard', 'Terracotta Courtyard', H, 'Mediterranean', 'Welcoming', 'orange', 'arch', 'floral', 'none', 'rise', 'fade-up', 'Playfair Display', 'Poppins', '#FFF7EE', '#4A2A1C', '#D2693A', '#F6D9BF', '#EBBF9C', '#4A2A1C', 'Sun-baked terracotta and a cobalt accent around a courtyard arch.', { fxColor: '#2F5FA8' }),
    R('olive-terrace', 'Olive Terrace', H, 'Mediterranean', 'Grateful', 'green', 'doorway', 'leaves', 'none', 'blur', 'fade-up', 'Cormorant Garamond', 'Lora', '#F8F6EC', '#353A22', '#6F7C2E', '#D8DCB3', '#C2C98F', '#2F3520', 'Olive leaves, linen and warm light for a home among the trees.'),
    R('blue-shutters', 'Blue Shutters', H, 'Mediterranean', 'Welcoming', 'blue', 'frame', 'none', 'waves', 'rise', 'slide', 'Playfair Display', 'Montserrat', '#F8FBFD', '#1F3B5C', '#2E6DB4', '#EAF3FB', '#CFE3F5', '#1F3B5C', 'Whitewashed walls, cobalt shutters and a sea breeze through the window.'),

    /* ------------------------------------------------------------------ MORE HOMES (6) */
    R('home-sweet-blessing', 'Home Sweet Blessing', H, 'Traditional', 'Welcoming', 'gold', 'house', 'ornament', 'none', 'rise', 'fade-up', 'Cormorant Garamond', 'Lora', '#FBF6EC', '#4A3624', '#B7873F', '#F3E4C8', '#E6CFA4', '#4A3624', 'A cream-and-gold little house that draws itself, then lights its windows.'),
    R('bahay-kubo', 'Bahay Kubo', H, 'Rustic', 'Welcoming', 'green', 'house', 'leaves', 'none', 'letters', 'fade-up', 'Fraunces', 'Lora', '#F6F1E1', '#3B3A1F', '#B07A2B', '#A9C07A', '#8DAA5C', '#2A3515', 'Leaf green and bamboo gold: a home that begins simple and warm.'),
    R('lantern-light-home', 'Lantern Light', H, 'Elegant', 'Grateful', 'gold', 'medallion', 'lanterns', 'shine', 'blur', 'zoom', 'Cinzel', 'Cormorant Garamond', '#19130C', '#F1E6D0', '#E3B35A', '#3A2A14', '#1E150A', '#F6EBD4', 'Warm lantern glow on a deep walnut seal. A blessing at dusk.'),
    R('first-keys', 'First Keys', H, 'Playful', 'Joyful', 'teal', 'bold', 'confetti', 'none', 'letters', 'zoom', 'Fredoka', 'Poppins', '#FFF9EE', '#1F3A3D', '#FF6B3D', '#3CC0B0', '#2A9D8F', '#0F2E2C', 'We got the keys! Bright teal, tangerine and a shower of confetti.'),
    R('morning-blessing', 'Morning Blessing', H, 'Watercolor', 'Grateful', 'blue', 'classic', 'petals', 'watercolor', 'blur', 'fade-up', 'Great Vibes', 'Lora', '#FAFCFE', '#34506E', '#5E93C7', '#F4F9FF', '#E4EEF9', '#34506E', 'Soft sky washes and drifting petals for a first-light blessing.', { fxColor: '#F5C9A8' }),
    R('new-address', 'New Address', H, 'Editorial', 'Chic', 'black', 'magazine', 'none', 'none', 'flip', 'slide', 'Abril Fatface', 'Montserrat', '#F4F1EC', '#141414', '#D9482B', '#141414', '#0A0A0A', '#F4F1EC', 'Issue no. 1 of a new address: a bold masthead for the housewarming of the year.'),
  ];
}
