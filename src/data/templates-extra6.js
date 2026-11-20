/**
 * Batch 8 — 21 templates showcasing six new cover layouts (curtain, wreath, sunburst, vinyl, letterboard, cake)
 * and eight new animated decorations (notes, dandelions, foil, clouds, planes, shooting-stars, bokeh, fairy-lights).
 * Row: id, name, occasion, style, mood, colorFamily, layout, decor, coverEffect, titleAnim, reveal,
 *      headingFont, bodyFont, bg, text, accent, coverFrom, coverTo, coverText, blurb, [extras: fxColor, align]
 * On the curtain layout, fxColor is the curtain fabric.
 */
export default function buildExtra6(t) {
  const R = (id, name, occ, style, mood, color, layout, decor, effect, anim, reveal, hf, bf, bg, tx, ac, cf, ct, cc, blurb, x = {}) =>
    t(id, name, occ, style, mood, color, {
      fontHeading: hf, fontBody: bf, layout, decor, coverEffect: effect, titleAnim: anim, reveal,
      bgColor: bg, textColor: tx, accentColor: ac, coverFrom: cf, coverTo: ct, coverText: cc, ...x,
    }, blurb);

  return [
    /* ------------------------------------------------------------ THEATRE CURTAINS */
    R('opening-night', 'Opening Night', 'debut', 'Old Hollywood', 'Glamorous', 'red', 'curtain', 'foil', 'none', 'letters', 'zoom', 'Limelight', 'Montserrat', '#1E0A10', '#F6E6E8', '#D9A05B', '#2A0E16', '#12050A', '#FBEAEC', 'Red velvet curtains part to reveal your name, with gold foil drifting down.', { fxColor: '#9E1B32' }),
    R('curtain-call-gala', 'Midnight Curtain', 'corporate', 'Luxury', 'Sophisticated', 'black', 'curtain', 'bokeh', 'spotlight', 'blur', 'fade-up', 'Playfair Display', 'Montserrat', '#121316', '#E8E9EC', '#C8A15A', '#1A1B20', '#0B0C0E', '#F3EEDF', 'Midnight-blue curtains open on an awards night or company gala.', { fxColor: '#1F2A44' }),
    R('recital-night', 'Recital Night', 'other', 'Elegant', 'Cinematic', 'purple', 'curtain', 'notes', 'none', 'rise', 'fade-up', 'Cormorant Garamond', 'Lora', '#1A1024', '#EEE6F7', '#C9A2F2', '#24143A', '#120A1E', '#F5EEFD', 'Plum curtains and rising music notes for recitals, concerts and shows.', { fxColor: '#5B2A86' }),

    /* ------------------------------------------------------------ BOTANICAL WREATH */
    R('evergreen-wreath', 'Evergreen Wreath', 'wedding', 'Botanical', 'Serene', 'green', 'wreath', 'none', 'none', 'blur', 'fade-up', 'Cormorant Garamond', 'Lora', '#F7F8F2', '#2B3A31', '#4E7A5A', '#F2F4EC', '#E4EADB', '#2B3A31', 'A hand-drawn wreath of leaves and berries grows around your names.', { fxColor: '#C98A94' }),
    R('christmas-wreath', 'Christmas Wreath', 'christmas', 'Traditional', 'Cozy', 'green', 'wreath', 'snow', 'none', 'rise', 'fade-up', 'Fraunces', 'Lora', '#FFF9F0', '#3A1717', '#2E7D4F', '#FBF4E6', '#F1E4CB', '#3A1717', 'An evergreen wreath with red berries and a bow, dusted with snow.', { fxColor: '#C62828' }),
    R('olive-wreath', 'Olive Wreath', 'baptism', 'Botanical', 'Spiritual', 'neutral', 'wreath', 'doves', 'none', 'blur', 'fade-up', 'Cinzel', 'Lora', '#FBFAF6', '#2F3328', '#6F7C42', '#F4F2EA', '#E8E4D6', '#2F3328', 'An olive wreath with a gold bow and doves rising. Peaceful and classic.', { fxColor: '#C9A55A' }),

    /* ------------------------------------------------------------------- SUNBURST */
    R('retro-sunburst', 'Retro Sunburst', 'birthday', 'Retro', 'Joyful', 'orange', 'sunburst', 'streamers', 'none', 'flip', 'zoom', 'Shrikhand', 'Poppins', '#FFF8F1', '#40210B', '#E0620F', '#FFE7C2', '#FFD08F', '#40210B', 'Spinning sunburst rays and a starburst date badge. Groovy.', { fxColor: '#FFD166' }),
    R('deco-sunburst', 'Deco Sunburst', 'anniversary', 'Art Deco', 'Glamorous', 'gold', 'sunburst', 'foil', 'none', 'blur', 'zoom', 'Limelight', 'Montserrat', '#14130F', '#EFE6D3', '#D4AF6A', '#1B1913', '#0C0B08', '#EFE6D3', 'Gold Art Deco rays fan out behind your names as foil falls.', { fxColor: '#8A6A2E' }),
    R('little-sunshine', 'Little Sunshine', 'baby-shower', 'Playful', 'Joyful', 'gold', 'sunburst', 'clouds', 'none', 'rise', 'fade-up', 'Fredoka', 'Poppins', '#FFFDF3', '#4A3F12', '#B98A10', '#FFF2BF', '#FCE59A', '#4A3F12', 'You are my sunshine: soft rays and clouds drifting by.', { fxColor: '#F6B98A' }),

    /* ---------------------------------------------------------------- VINYL RECORD */
    R('our-song', 'Our Song', 'anniversary', 'Retro', 'Romantic', 'red', 'vinyl', 'notes', 'none', 'blur', 'fade-up', 'Playfair Display', 'Lora', '#FFF6F2', '#3D1218', '#B3203A', '#F7DDD6', '#EDC4BA', '#3D1218', 'A record spinning your song, with music notes floating up.', { fxColor: '#7A1B2E' }),
    R('spin-the-record', 'Spin the Record', 'birthday', 'Retro', 'Energetic', 'teal', 'vinyl', 'bokeh', 'gradient', 'letters', 'zoom', 'Syne', 'Space Grotesk', '#F2FBFA', '#10302C', '#FF5E8A', '#18837A', '#0E4F4A', '#FFF6E9', 'A spinning record under party lights. Drop the needle!', { fxColor: '#FFC93C' }),

    /* ---------------------------------------------------------------- LETTER BOARD */
    R('hello-little-one', 'Hello Little One', 'baby-shower', 'Modern', 'Tender', 'neutral', 'letterboard', 'dandelions', 'none', 'typewriter', 'fade-up', 'Josefin Sans', 'Inter', '#FAF8F4', '#2E2B27', '#A0714F', '#EDE6DA', '#DDD3C3', '#2E2B27', 'A felt letter board with your big news spelled out in white.', { fxColor: '#C9B8A0' }),
    R('class-notes', 'Class Notes', 'graduation', 'Modern', 'Bold', 'black', 'letterboard', 'planes', 'none', 'typewriter', 'slide', 'Bebas Neue', 'Inter', '#F7F7F5', '#1C1C1E', '#2D5BA8', '#2C3E66', '#1A2744', '#F1F4FA', 'Your news on a letter board, with paper planes taking off.', { fxColor: '#F2B705' }),
    R('we-moved', 'We Moved!', 'house-blessing', 'Scandinavian', 'Welcoming', 'neutral', 'letterboard', 'fairy-lights', 'none', 'typewriter', 'fade-up', 'Josefin Sans', 'Lora', '#F7F6F2', '#2F2C28', '#8B6F4E', '#3A3631', '#24211D', '#F2EEE6', 'A felt letter board glowing under warm fairy lights.', { fxColor: '#E8C37A' }),

    /* ----------------------------------------------------------------- TIERED CAKE */
    R('cake-day', 'Cake Day', 'birthday', 'Playful', 'Joyful', 'pink', 'cake', 'confetti', 'none', 'rise', 'zoom', 'Fredoka', 'Poppins', '#FFF8FB', '#3B1C3A', '#D63A6E', '#FFE3EC', '#FFD0DF', '#3B1C3A', 'A three-tier cake drops into place and the candles light up.', { fxColor: '#4FB6D6' }),
    R('turning-one', 'Turning One', 'birthday', 'Watercolor', 'Tender', 'blue', 'cake', 'clouds', 'watercolor', 'blur', 'fade-up', 'Fraunces', 'Poppins', '#F6FAFF', '#24395A', '#4A7EC6', '#DDEBFB', '#C6DCF6', '#24395A', 'A soft-blue cake with clouds floating by, for a first birthday.', { fxColor: '#F5C6D6' }),
    R('sweet-milestone', 'Sweet Milestone', 'anniversary', 'Elegant', 'Heartfelt', 'gold', 'cake', 'fairy-lights', 'none', 'blur', 'fade-up', 'Cormorant Garamond', 'Lora', '#FBF7EE', '#33291C', '#A97C2F', '#2F2615', '#1A140A', '#F6EBD2', 'A golden tiered cake glowing under fairy lights. Here’s to many more.', { fxColor: '#E8C37A' }),

    /* ------------------------------------------------- new decorations on other layouts */
    R('stargazer', 'Stargazer', 'engagement', 'Celestial', 'Romantic', 'blue', 'celestial', 'shooting-stars', 'none', 'blur', 'blur', 'Italiana', 'Inter', '#0E1430', '#E9ECF7', '#E4C77A', '#141B40', '#080C22', '#F3EEDC', 'Make a wish: shooting stars streak across a midnight sky.', { fxColor: '#9BB0FF' }),
    R('dandelion-wishes', 'Dandelion Wishes', 'wedding', 'Garden Party', 'Dreamy', 'neutral', 'classic', 'dandelions', 'watercolor', 'blur', 'fade-up', 'Italiana', 'Lora', '#FBFAF6', '#33302B', '#7D6D50', '#F2EFE6', '#E4DFD2', '#33302B', 'Dandelion seeds drifting up on the breeze. Make a wish.', { fxColor: '#D9CBA8' }),
    R('string-light-garden', 'String-Light Garden', 'other', 'Garden Party', 'Cozy', 'green', 'glass', 'fairy-lights', 'none', 'blur', 'fade-up', 'Caveat', 'Poppins', '#F4FBF7', '#0F3324', '#12925E', '#16402F', '#0A261B', '#F2FFF8', 'Warm string lights over a frosted card, for backyard dinners and parties.', { fxColor: '#F2C14E' }),
    R('paper-plane-send-off', 'Paper Plane Send-off', 'other', 'Modern', 'Adventurous', 'blue', 'classic', 'planes', 'none', 'rise', 'slide', 'Syne', 'Inter', '#F5F8FF', '#10224A', '#1F5BD6', '#1F5BD6', '#0F2F7A', '#FFFFFF', 'Paper planes taking off, for send-offs, farewells and bon voyage parties.', { fxColor: '#FFC93C' }),
  ];
}
