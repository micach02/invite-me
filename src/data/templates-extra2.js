/**
 * Batch 4 — 40 templates, one new design style + one new theme each.
 * Row: id, name, occasion, style, mood, colorFamily, layout, decor, coverEffect, titleAnim, reveal,
 *      headingFont, bodyFont, bg, text, accent, coverFrom, coverTo, coverText, blurb, [extras: fxColor, align]
 */
export default function buildExtra2(t) {
  const R = (id, name, occ, style, mood, color, layout, decor, effect, anim, reveal, hf, bf, bg, tx, ac, cf, ct, cc, blurb, x = {}) =>
    t(id, name, occ, style, mood, color, {
      fontHeading: hf, fontBody: bf, layout, decor, coverEffect: effect, titleAnim: anim, reveal,
      bgColor: bg, textColor: tx, accentColor: ac, coverFrom: cf, coverTo: ct, coverText: cc, ...x,
    }, blurb);

  return [
    /* ------------------------------------------------------ NEO-BRUTALIST (5) */
    R('brutal-bash', 'Brutal Bash', 'birthday', 'Neo-Brutalist', 'Rebellious', 'orange', 'brutal', 'none', 'none', 'flip', 'zoom', 'Syne', 'Space Grotesk', '#FFFDF0', '#111111', '#FF4D8D', '#FFD93D', '#FFD93D', '#111111', 'Flat yellow, hard black borders and a hard drop shadow. Loud on purpose.'),
    R('concrete-vows', 'Concrete Vows', 'wedding', 'Neo-Brutalist', 'Rebellious', 'neutral', 'brutal', 'none', 'none', 'rise', 'slide', 'Space Grotesk', 'Space Mono', '#F6F3EC', '#151515', '#E4572E', '#CFCFCB', '#CFCFCB', '#151515', 'Raw concrete grey and a single orange stamp. Anti-fussy, very sure of itself.'),
    R('sticker-sheet', 'Sticker Sheet', 'graduation', 'Neo-Brutalist', 'Joyful', 'blue', 'brutal', 'confetti', 'none', 'letters', 'zoom', 'Syne', 'Poppins', '#FFFFFF', '#101010', '#2D6CFF', '#7CF29C', '#7CF29C', '#101010', 'Mint, cobalt and thick outlines — like a laptop covered in stickers.'),
    R('loud-launch', 'Loud Launch', 'corporate', 'Neo-Brutalist', 'Joyful', 'purple', 'brutal', 'memphis', 'none', 'flip', 'zoom', 'Space Grotesk', 'Inter', '#FFFFFF', '#0E0E0E', '#8A4DFF', '#FFB4E1', '#FFB4E1', '#0E0E0E', 'A bubblegum-pink product launch with zero corporate polish.', { fxColor: '#FFD93D' }),
    R('raw-reel', 'Raw Reel', 'other', 'Neo-Brutalist', 'Cinematic', 'black', 'brutal', 'none', 'grain', 'typewriter', 'slide', 'Space Mono', 'Space Grotesk', '#EDEDE8', '#0B0B0B', '#FF3B1F', '#1A1A1A', '#1A1A1A', '#F3F3EE', 'A film-festival slate: mono type, grain and a red record light.'),

    /* ----------------------------------------------------------- WATERCOLOR (5) */
    R('watercolor-bloom', 'Watercolor Bloom', 'wedding', 'Watercolor', 'Tender', 'pink', 'classic', 'petals', 'watercolor', 'blur', 'fade-up', 'Great Vibes', 'Lora', '#FFFAF8', '#5A3A44', '#D9769A', '#FFF1EE', '#FDE4E1', '#5A3A44', 'Blush and sky-blue washes that bleed and drift like wet paint.', { fxColor: '#9CC7E8' }),
    R('aquarelle-baby', 'Aquarelle Baby', 'baby-shower', 'Watercolor', 'Tender', 'blue', 'arch', 'bubbles', 'watercolor', 'rise', 'fade-up', 'Dancing Script', 'Poppins', '#F7FBFF', '#3B5878', '#6FA8DC', '#F2F8FF', '#E8F1FB', '#34506E', 'Powder blue and rose washes behind a soft arch.', { fxColor: '#F4B6C8' }),
    R('sunwash-party', 'Sunwash Party', 'birthday', 'Watercolor', 'Joyful', 'orange', 'classic', 'confetti', 'watercolor', 'letters', 'zoom', 'Pacifico', 'Poppins', '#FFFAF1', '#4A3220', '#F28C38', '#FFF6E6', '#FFEBCB', '#4A3220', 'Tangerine and raspberry splashes. A birthday that looks hand-painted.', { fxColor: '#F2708D' }),
    R('soft-wash', 'Soft Wash', 'baptism', 'Watercolor', 'Tender', 'purple', 'medallion', 'stars', 'watercolor', 'blur', 'blur', 'Cormorant Garamond', 'Lora', '#FBF9FF', '#46386B', '#A58BD8', '#F5F0FF', '#EAE0FA', '#46386B', 'Lilac and aqua washes drifting behind a quiet seal.', { fxColor: '#9FD3E6' }),
    R('ink-and-wash', 'Ink & Wash', 'anniversary', 'Watercolor', 'Intimate', 'teal', 'frame', 'none', 'watercolor', 'rise', 'fade-up', 'Playfair Display', 'Montserrat', '#F8FBFA', '#1F4B49', '#3FA39B', '#F1FAF8', '#DDF1EC', '#1F4B49', 'Sea-glass teal with a peach bloom — years of quiet closeness.', { fxColor: '#F2B8A0' }),

    /* --------------------------------------------------------- SCANDINAVIAN (5) */
    R('nordic-morning', 'Nordic Morning', 'wedding', 'Scandinavian', 'Intimate', 'neutral', 'minimal', 'none', 'none', 'rise', 'fade-up', 'Josefin Sans', 'Inter', '#FAF9F7', '#2B2B2B', '#8E9AA6', '#F2F0EC', '#E8E5DF', '#2B2B2B', 'Pale oat, slate and a lot of air. Small ceremony, big feeling.', { align: 'left' }),
    R('fika-afternoon', 'Fika Afternoon', 'baby-shower', 'Scandinavian', 'Tender', 'neutral', 'arch', 'none', 'none', 'blur', 'fade-up', 'Josefin Sans', 'Inter', '#FBFAF8', '#3A3F44', '#C98E7B', '#EFEAE3', '#E5DED4', '#3A3F44', 'Coffee, cardamom and clay tones for a slow afternoon.'),
    R('hygge-evening', 'Hygge Evening', 'christmas', 'Scandinavian', 'Intimate', 'red', 'frame', 'snow', 'none', 'rise', 'fade-up', 'Josefin Sans', 'Lora', '#FAF8F5', '#33302C', '#B04A3A', '#3B3A38', '#2A2927', '#F4EFE8', 'Charcoal, candle-red and falling snow. Everyone squeezed onto one sofa.'),
    R('clean-summit', 'Clean Summit', 'corporate', 'Scandinavian', 'Sophisticated', 'blue', 'split', 'none', 'none', 'rise', 'slide', 'Josefin Sans', 'Inter', '#F6F8FA', '#1B2733', '#4A7FA7', '#DCE6EE', '#C7D7E3', '#1B2733', 'Fjord blue and quiet confidence for a design-led event.', { align: 'left' }),
    R('birch-and-berry', 'Birch & Berry', 'birthday', 'Scandinavian', 'Joyful', 'pink', 'polaroid', 'none', 'none', 'flip', 'fade-up', 'Josefin Sans', 'Poppins', '#FBF9F7', '#34302D', '#D9667C', '#EDE8E1', '#E3DDD3', '#34302D', 'A birch-pale snapshot with one cheerful lingonberry accent.'),

    /* ----------------------------------------------------------- COTTAGECORE (5) */
    R('wildflower-cottage', 'Wildflower Cottage', 'wedding', 'Cottagecore', 'Tender', 'green', 'arch', 'petals', 'none', 'blur', 'fade-up', 'Fraunces', 'Lora', '#FBF8EF', '#4B4A2E', '#B9774B', '#E6EBCF', '#D3DDB2', '#43472A', 'Sage, butter and clay under a cottage arch. Picked, not bought.'),
    R('meadow-picnic', 'Meadow Picnic', 'engagement', 'Cottagecore', 'Intimate', 'green', 'vintage', 'leaves', 'none', 'typewriter', 'fade-up', 'Fraunces', 'Lora', '#FBF7EC', '#4A3F2A', '#C6603F', '#8EA37A', '#6F8760', '#FBF7EC', 'A gingham-and-basket postcard sent from the long grass.'),
    R('honey-and-thyme', 'Honey & Thyme', 'anniversary', 'Cottagecore', 'Intimate', 'gold', 'frame', 'leaves', 'none', 'rise', 'fade-up', 'Fraunces', 'Lora', '#FBF6E9', '#4B3C1E', '#C48A1C', '#E9D9A8', '#D9C27E', '#4B3C1E', 'Beeswax gold and herb sprigs for a long, sweet marriage.'),
    R('mushroom-tea', 'Mushroom Tea Party', 'birthday', 'Cottagecore', 'Joyful', 'red', 'polaroid', 'autumn', 'none', 'flip', 'zoom', 'Fraunces', 'Poppins', '#FBF4EA', '#4A2E22', '#C8503A', '#F0DFC6', '#E5CBA6', '#4A2E22', 'Toadstool red, teacups and leaves tumbling past a snapshot.'),
    R('moss-and-moon', 'Moss & Moon', 'debut', 'Cottagecore', 'Mysterious', 'green', 'medallion', 'fireflies', 'aurora', 'blur', 'blur', 'Fraunces', 'Lora', '#0F1A14', '#E3EEDC', '#A8D58A', '#1C2F22', '#0A130E', '#E6F1DE', 'A witchy-woods seal with fireflies and green moonlight.', { fxColor: '#7ED9A0' }),

    /* ------------------------------------------------------------ MID-CENTURY (5) */
    R('atomic-age', 'Atomic Age', 'birthday', 'Mid-Century', 'Joyful', 'teal', 'bold', 'memphis', 'none', 'rise', 'zoom', 'DM Serif Display', 'Josefin Sans', '#FFF8EA', '#1F3B3A', '#E9703A', '#4CB8A8', '#2E9A8C', '#FFF8EA', 'Turquoise, tangerine and boomerang shapes straight out of 1958.'),
    R('highball-gala', 'Highball Gala', 'corporate', 'Mid-Century', 'Sophisticated', 'gold', 'vintage', 'none', 'none', 'typewriter', 'fade-up', 'DM Serif Display', 'Josefin Sans', '#F5EFE3', '#2A2418', '#B8742E', '#3C3426', '#2A241A', '#F5EFE3', 'Walnut brown and brass. Somebody is definitely pouring an old-fashioned.'),
    R('sputnik-shower', 'Sputnik Shower', 'baby-shower', 'Mid-Century', 'Tender', 'blue', 'arch', 'stars', 'none', 'blur', 'fade-up', 'DM Serif Display', 'Josefin Sans', '#FBF8EF', '#2C3B4E', '#E9A23B', '#C9DDF0', '#A9C8E6', '#243649', 'Space-age blue with starburst accents for a little astronaut.'),
    R('drive-in-night', 'Drive-In Night', 'engagement', 'Mid-Century', 'Cinematic', 'red', 'poster', 'stars', 'gradient', 'rise', 'slide', 'DM Serif Display', 'Josefin Sans', '#FFF4E3', '#2A1B1B', '#D6402E', '#1F2A44', '#12182C', '#FFF4E3', 'A double-feature poster under a twilight sky.', { fxColor: '#D6402E', align: 'left' }),
    R('swinging-sixty', 'Swinging Sixty', 'anniversary', 'Mid-Century', 'Rebellious', 'orange', 'magazine', 'none', 'none', 'blur', 'slide', 'DM Serif Display', 'Josefin Sans', '#FFF6E6', '#2B1D12', '#E0662B', '#2B1D12', '#1A1008', '#FFF6E6', 'A mod, burnt-orange magazine cover for sixty years of trouble.'),

    /* ------------------------------------------------------------- MAXIMALIST (5) */
    R('peacock-parlour', 'Peacock Parlour', 'wedding', 'Maximalist', 'Regal', 'teal', 'frame', 'floral', 'aurora', 'rise', 'zoom', 'Abril Fatface', 'Cormorant Garamond', '#0C2420', '#F0E8D0', '#E8B94A', '#0F4A44', '#082A27', '#F3EAD0', 'More is more: jewel teal, gold, florals and a magenta glow.', { fxColor: '#E0489C' }),
    R('baroque-ball', 'Baroque Ball', 'debut', 'Maximalist', 'Regal', 'purple', 'medallion', 'ornament', 'shine', 'blur', 'zoom', 'Playfair Display', 'Cormorant Garamond', '#17102A', '#EFE6FA', '#E3B64F', '#3A1F6B', '#1A0F33', '#F6EEFF', 'Royal purple, gold scrollwork and a spinning seal.'),
    R('jewel-box', 'Jewel Box', 'anniversary', 'Maximalist', 'Regal', 'red', 'classic', 'stars', 'gradient', 'letters', 'zoom', 'Abril Fatface', 'Lora', '#FBF0EE', '#3A0E1C', '#D9A441', '#8E1538', '#4E0A22', '#FFE9D2', 'Garnet, sapphire and gold — opened like a velvet jewellery case.', { fxColor: '#2A6F8F' }),
    R('carnival-royale', 'Carnival Royale', 'holiday', 'Maximalist', 'Joyful', 'red', 'bold', 'confetti', 'gradient', 'letters', 'zoom', 'Abril Fatface', 'Poppins', '#FFF7EA', '#2B1030', '#E63E6D', '#FFB703', '#E63E6D', '#2B1030', 'Marigold, magenta and confetti. A parade in invitation form.', { fxColor: '#8338EC' }),
    R('velvet-curtain', 'Velvet Curtain', 'corporate', 'Maximalist', 'Mysterious', 'purple', 'frame', 'stars', 'spotlight', 'blur', 'blur', 'Cinzel', 'Cormorant Garamond', '#14091F', '#F0E4F7', '#D8A24A', '#3B0F4F', '#160620', '#F6EAFB', 'The curtain is about to rise. A single spotlight and a lot of drama.'),

    /* -------------------------------------------------------------- INDUSTRIAL (5) */
    R('warehouse-wedding', 'Warehouse Wedding', 'wedding', 'Industrial', 'Cinematic', 'black', 'split', 'none', 'grain', 'typewriter', 'slide', 'Space Mono', 'Space Grotesk', '#EDEBE7', '#161616', '#E5792B', '#2A2A2A', '#161616', '#EDEBE7', 'Exposed brick energy: mono type, grain and safety orange.', { align: 'left' }),
    R('steel-summit', 'Steel Summit', 'corporate', 'Industrial', 'Sophisticated', 'neutral', 'ticket', 'geometric', 'none', 'rise', 'slide', 'Space Grotesk', 'Space Mono', '#F0F0EE', '#1B1D1F', '#D2691E', '#3A3F44', '#24282B', '#F0F0EE', 'Gunmetal and rust for engineers who like their events precise.', { align: 'left' }),
    R('loft-launch', 'Loft Launch', 'birthday', 'Industrial', 'Rebellious', 'orange', 'poster', 'none', 'grain', 'rise', 'slide', 'Bebas Neue', 'Space Mono', '#EFEDE8', '#181818', '#FF6A1A', '#1B1B1B', '#101010', '#EFEDE8', 'A warehouse-party flyer: condensed caps and gritty grain.', { align: 'left' }),
    R('night-shift', 'Night Shift', 'graduation', 'Industrial', 'Mysterious', 'blue', 'neon', 'geometric', 'grain', 'typewriter', 'zoom', 'Space Mono', 'Space Grotesk', '#0D1117', '#E6EDF3', '#58A6FF', '#161B22', '#0D1117', '#E6EDF3', 'Terminal-blue glow and grain for the all-nighters who made it.'),
    R('foundry-dinner', 'Foundry Dinner', 'corporate', 'Industrial', 'Cinematic', 'gold', 'classic', 'none', 'shine', 'blur', 'fade-up', 'Cinzel', 'Space Mono', '#12100E', '#EFE6D8', '#D98E2B', '#2B2622', '#14110F', '#EFE6D8', 'Molten amber on cast-iron black, lit by a slow sweep of light.'),

    /* ------------------------------------------------------------------------ ZEN (5) */
    R('quiet-garden', 'Quiet Garden', 'wedding', 'Zen', 'Sophisticated', 'green', 'minimal', 'none', 'none', 'blur', 'fade-up', 'Cormorant Garamond', 'Josefin Sans', '#F6F5F0', '#2E3A33', '#7A8F7E', '#E3E8DF', '#D3DBCE', '#2E3A33', 'Moss grey, one thin line, and nothing you do not need.'),
    R('tea-ceremony', 'Tea Ceremony', 'anniversary', 'Zen', 'Intimate', 'green', 'arch', 'none', 'none', 'rise', 'fade-up', 'Cormorant Garamond', 'Josefin Sans', '#F5F4EE', '#3A3A2F', '#8A9A6A', '#E4E6D8', '#D5D9C4', '#3A3A2F', 'Matcha green and a still doorway. Slow down; you are together.'),
    R('stone-and-ripple', 'Stone & Ripple', 'baptism', 'Zen', 'Tender', 'blue', 'medallion', 'bubbles', 'watercolor', 'blur', 'blur', 'Cormorant Garamond', 'Josefin Sans', '#F6F8F8', '#2E4046', '#7FA6B0', '#E6EEF0', '#D2E1E5', '#2E4046', 'Pond-water blue and rising ripples around a quiet seal.', { fxColor: '#BFD8DE' }),
    R('ink-moon', 'Ink Moon', 'debut', 'Zen', 'Mysterious', 'black', 'medallion', 'stars', 'spotlight', 'blur', 'blur', 'Cormorant Garamond', 'Josefin Sans', '#0E0F12', '#E8E8E4', '#C9C2A8', '#1C1E24', '#0B0C0F', '#ECECE6', 'Sumi-ink black and a moon of pale light.'),
    R('hanami', 'Hanami', 'engagement', 'Zen', 'Tender', 'pink', 'arch', 'petals', 'none', 'rise', 'fade-up', 'Cormorant Garamond', 'Josefin Sans', '#FFF9F9', '#4A3A3E', '#D8869A', '#FDEBEF', '#F8D7DE', '#4A3A3E', 'Blossom-viewing season: petals falling over a pale pink arch.'),
  ];
}
