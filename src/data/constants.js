import {
  Heart, Cake, Baby, Sparkles, HeartHandshake, Gem, GraduationCap, Briefcase, TreePine, PartyPopper, Church, Droplets, House,
} from 'lucide-react';

/** Occasions the product supports. `category` groups them in the template library. */
export const OCCASIONS = [
  { id: 'wedding', label: 'Wedding', category: 'wedding', icon: Heart, namesLabel: 'Couple names', namesPlaceholder: 'Michael & Cha' },
  { id: 'birthday', label: 'Birthday', category: 'birthday', icon: Cake, namesLabel: 'Celebrant', namesPlaceholder: 'Cha turns 30' },
  { id: 'baptism', label: 'Baptism / Christening', category: 'baptism', icon: Church, namesLabel: 'Child name', namesPlaceholder: 'Baby Michael' },
  { id: 'debut', label: 'Debut', category: 'debut', icon: Sparkles, namesLabel: 'Celebrant', namesPlaceholder: 'Cha' },
  { id: 'anniversary', label: 'Anniversary', category: 'anniversary', icon: HeartHandshake, namesLabel: 'Couple names', namesPlaceholder: 'Michael & Cha' },
  { id: 'engagement', label: 'Engagement', category: 'wedding', icon: Gem, namesLabel: 'Couple names', namesPlaceholder: 'Michael & Cha' },
  { id: 'house-blessing', label: 'House Blessing', category: 'house-blessing', icon: House, namesLabel: 'Homeowners / Family', namesPlaceholder: 'Michael & Cha' },
  { id: 'baby-shower', label: 'Baby Shower', category: 'baby-shower', icon: Baby, namesLabel: 'Parents / Baby', namesPlaceholder: 'Baby Cha' },
  { id: 'graduation', label: 'Graduation', category: 'other', icon: GraduationCap, namesLabel: 'Graduate', namesPlaceholder: 'Michael' },
  { id: 'corporate', label: 'Corporate Event', category: 'corporate', icon: Briefcase, namesLabel: 'Event / Company', namesPlaceholder: 'Northwind Annual Summit' },
  { id: 'holiday', label: 'Holiday Party', category: 'other', icon: TreePine, namesLabel: 'Host / Theme', namesPlaceholder: 'Michael & Cha' },
  { id: 'other', label: 'Other Special Occasion', category: 'other', icon: PartyPopper, namesLabel: 'Names / Theme', namesPlaceholder: 'Our Celebration' },
];

export const occasionById = (id) => OCCASIONS.find((o) => o.id === id) ?? OCCASIONS[OCCASIONS.length - 1];

export const LIBRARY_CATEGORIES = [
  { id: 'wedding', label: 'Wedding', icon: Heart },
  { id: 'birthday', label: 'Birthday', icon: Cake },
  { id: 'baptism', label: 'Baptism', icon: Droplets },
  { id: 'debut', label: 'Debut', icon: Sparkles },
  { id: 'anniversary', label: 'Anniversary', icon: HeartHandshake },
  { id: 'house-blessing', label: 'House Blessing', icon: House },
  { id: 'baby-shower', label: 'Baby Shower', icon: Baby },
  { id: 'corporate', label: 'Corporate', icon: Briefcase },
  { id: 'other', label: 'Other Events', icon: PartyPopper },
];

export const DESIGN_STYLES = [
  'Minimalist', 'Elegant', 'Floral', 'Modern', 'Luxury', 'Rustic', 'Playful', 'Traditional',
  'Vintage', 'Art Deco', 'Bohemian', 'Botanical', 'Tropical', 'Futuristic', 'Retro', 'Coastal', 'Gothic', 'Editorial',
  'Neo-Brutalist', 'Watercolor', 'Scandinavian', 'Cottagecore', 'Mid-Century', 'Maximalist', 'Industrial', 'Zen',
  'Modern Farmhouse', 'Japandi', 'Mediterranean',
];
export const MOODS = [
  'Romantic', 'Festive', 'Whimsical', 'Professional', 'Serene', 'Glamorous',
  'Nostalgic', 'Cozy', 'Dreamy', 'Bold', 'Magical', 'Spiritual', 'Energetic', 'Chic', 'Adventurous',
  'Joyful', 'Sophisticated', 'Cinematic', 'Intimate', 'Mysterious', 'Regal', 'Tender', 'Rebellious',
  'Welcoming', 'Grateful',
];
export const COLOR_FAMILIES = [
  { id: 'green', label: 'Green', hex: '#455C50' },
  { id: 'gold', label: 'Gold', hex: '#C49B72' },
  { id: 'pink', label: 'Pink', hex: '#D9A0A8' },
  { id: 'blue', label: 'Blue', hex: '#7FA3C7' },
  { id: 'black', label: 'Black', hex: '#1E1E1E' },
  { id: 'red', label: 'Red', hex: '#A23B3B' },
  { id: 'purple', label: 'Purple', hex: '#6C4AB6' },
  { id: 'orange', label: 'Orange', hex: '#E8833A' },
  { id: 'teal', label: 'Teal', hex: '#2A9D8F' },
  { id: 'neutral', label: 'Neutral', hex: '#E7DFD0' },
];

export const HEADING_FONTS = [
  { value: 'Cormorant Garamond', label: 'Cormorant — Elegant serif' },
  { value: 'Playfair Display', label: 'Playfair — High contrast serif' },
  { value: 'Lora', label: 'Lora — Warm serif' },
  { value: 'Great Vibes', label: 'Great Vibes — Formal script' },
  { value: 'Dancing Script', label: 'Dancing Script — Casual script' },
  { value: 'Montserrat', label: 'Montserrat — Clean sans' },
  { value: 'Poppins', label: 'Poppins — Geometric sans' },
  { value: 'Fredoka', label: 'Fredoka — Playful rounded' },
  { value: 'Cinzel', label: 'Cinzel — Roman capitals' },
  { value: 'Bebas Neue', label: 'Bebas Neue — Poster condensed' },
  { value: 'Syne', label: 'Syne — Bold modern' },
  { value: 'Space Grotesk', label: 'Space Grotesk — Techy sans' },
  { value: 'Abril Fatface', label: 'Abril Fatface — Fashion display' },
  { value: 'Pacifico', label: 'Pacifico — Retro script' },
  { value: 'Fraunces', label: 'Fraunces — Soft storybook serif' },
  { value: 'DM Serif Display', label: 'DM Serif Display — Mid-century serif' },
  { value: 'Josefin Sans', label: 'Josefin Sans — Geometric Scandinavian' },
  { value: 'Space Mono', label: 'Space Mono — Industrial monospace' },
];

export const BODY_FONTS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Lora', label: 'Lora' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
  { value: 'Space Grotesk', label: 'Space Grotesk' },
  { value: 'Josefin Sans', label: 'Josefin Sans' },
  { value: 'Space Mono', label: 'Space Mono' },
];

export const DECOR_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'floral', label: 'Floral' },
  { value: 'leaves', label: 'Botanical leaves' },
  { value: 'geometric', label: 'Geometric' },
  { value: 'stars', label: 'Sparkles' },
  { value: 'confetti', label: 'Confetti' },
  { value: 'ornament', label: 'Classic ornament' },
  { value: 'hearts', label: 'Floating hearts ✦ animated' },
  { value: 'snow', label: 'Falling snow ✦ animated' },
  { value: 'bubbles', label: 'Rising bubbles ✦ animated' },
  { value: 'balloons', label: 'Floating balloons ✦ animated' },
  { value: 'petals', label: 'Falling petals ✦ animated' },
  { value: 'autumn', label: 'Autumn leaves ✦ animated' },
  { value: 'lanterns', label: 'Paper lanterns ✦ animated' },
  { value: 'fireflies', label: 'Fireflies ✦ animated' },
  { value: 'fireworks', label: 'Fireworks ✦ animated' },
  { value: 'memphis', label: 'Memphis shapes ✦ animated' },
];

export const COVER_LAYOUTS = [
  { value: 'classic', label: 'Classic' },
  { value: 'frame', label: 'Framed' },
  { value: 'arch', label: 'Arch photo' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'bold', label: 'Bold' },
  { value: 'split', label: 'Split' },
  { value: 'neon', label: 'Neon sign' },
  { value: 'poster', label: 'Poster' },
  { value: 'ticket', label: 'Ticket' },
  { value: 'polaroid', label: 'Polaroid' },
  { value: 'vintage', label: 'Vintage postcard' },
  { value: 'magazine', label: 'Magazine cover' },
  { value: 'medallion', label: 'Medallion' },
  { value: 'glass', label: 'Frosted glass' },
  { value: 'diagonal', label: 'Diagonal split' },
  { value: 'brutal', label: 'Neo-brutalist' },
  { value: 'house', label: 'Little house' },
  { value: 'doorway', label: 'Front door' },
];

export const COVER_EFFECTS = [
  { value: 'none', label: 'None' },
  { value: 'aurora', label: 'Aurora glow' },
  { value: 'gradient', label: 'Shifting gradient' },
  { value: 'shine', label: 'Light sweep' },
  { value: 'spotlight', label: 'Roaming spotlight' },
  { value: 'waves', label: 'Rolling waves' },
  { value: 'shimmer', label: 'Shimmering title' },
  { value: 'watercolor', label: 'Watercolor wash' },
  { value: 'grain', label: 'Film grain' },
  { value: 'kenburns', label: 'Slow photo zoom (needs cover photo)' },
];

export const TITLE_ANIMS = [
  { value: 'none', label: 'None' },
  { value: 'rise', label: 'Words rise' },
  { value: 'letters', label: 'Letter by letter' },
  { value: 'blur', label: 'Blur in' },
  { value: 'typewriter', label: 'Typewriter' },
  { value: 'flip', label: '3D flip' },
];

export const REVEALS = [
  { value: 'fade-up', label: 'Fade up' },
  { value: 'zoom', label: 'Zoom in' },
  { value: 'slide', label: 'Slide in' },
  { value: 'blur', label: 'Blur in' },
];

export const ATTENDING_LABEL = { yes: 'Attending', no: 'Declined', maybe: 'Maybe' };
