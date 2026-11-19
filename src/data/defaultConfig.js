import dayjs from 'dayjs';
import { uid, slugify } from '../lib/utils';
import { templateById } from './templates';

/** Occasion-specific sample copy so a fresh invitation already looks complete. */
const SAMPLES = {
  wedding: {
    title: 'The Wedding of Michael & Cha', names: 'Michael & Cha', tagline: 'Together with their families',
    description: 'We are getting married! Join us as we celebrate love, laughter and the beginning of our forever.',
    story: 'We met on a rainy Tuesday over a shared umbrella. Six years, two cities and one very patient dog later, we are ready to say “I do” — and we would love for you to be there.',
    program: [['3:00 PM', 'Guest arrival'], ['3:30 PM', 'Ceremony'], ['5:00 PM', 'Cocktail hour'], ['6:30 PM', 'Dinner & toasts'], ['8:00 PM', 'Dancing']],
    dress: 'Formal attire. Garden-friendly shoes recommended.', dressColors: ['#455C50', '#D8C9B2', '#C49B72', '#F6F3EC'],
    gift: 'Your presence is the greatest gift. If you wish to give, a contribution to our honeymoon fund is warmly appreciated.',
  },
  engagement: {
    title: 'Michael & Cha Are Engaged', names: 'Michael & Cha', tagline: 'Please join us to celebrate',
    description: 'She said yes! Come toast to our engagement with food, music and good company.',
    story: 'After a surprise proposal at sunrise, we are over the moon and want to celebrate with the people we love most.',
    program: [['6:00 PM', 'Welcome drinks'], ['7:00 PM', 'Dinner'], ['8:30 PM', 'Toasts & dessert']],
    dress: 'Cocktail attire.', dressColors: ['#455C50', '#D8C9B2'], gift: 'No gifts, please — just bring your love and appetite.',
  },
  birthday: {
    title: 'Cha’s 30th Birthday', names: 'Cha turns 30', tagline: 'You are invited to celebrate',
    description: 'Thirty, flirty and thriving! Come eat cake, dance and make memories with me.',
    story: 'Another trip around the sun — and I want to spend it with my favourite people.',
    program: [['6:00 PM', 'Arrival & drinks'], ['7:00 PM', 'Dinner'], ['8:00 PM', 'Cake & games'], ['9:00 PM', 'Dance party']],
    dress: 'Come dressed to party!', dressColors: ['#FF6B8B', '#FFD36B', '#2D2A4A'], gift: 'Your company is my gift. If you insist, I would love books or plants.',
  },
  baptism: {
    title: 'The Baptism of Baby Michael', names: 'Baby Michael', tagline: 'With grateful hearts, we invite you to the christening of',
    description: 'Join our family as we welcome Michael into the church community and celebrate with a luncheon afterwards.',
    story: 'Born in spring, our little blessing is ready to begin his journey of faith.',
    program: [['10:00 AM', 'Holy Mass & baptism'], ['12:00 NN', 'Photos with family'], ['12:30 PM', 'Luncheon']],
    dress: 'Smart casual. Light colours are welcome.', dressColors: ['#DCE9F5', '#FFFFFF', '#8FB0D0'], gift: 'Your prayers and presence are our greatest gifts.',
  },
  debut: {
    title: 'Cha’s 18th Birthday', names: 'Cha', tagline: 'Join us for a night of roses and memories',
    description: 'A once-in-a-lifetime celebration of my debut. Come dance the night away with family and friends.',
    story: 'Eighteen years of love, laughter and learning. Thank you to everyone who has been part of my journey.',
    program: [['5:00 PM', 'Reception'], ['6:00 PM', '18 Roses'], ['7:00 PM', 'Dinner'], ['8:30 PM', '18 Candles & 18 Treasures'], ['9:30 PM', 'Party']],
    dress: 'Formal. Ladies in rose or champagne gowns; gentlemen in dark suits.', dressColors: ['#C0807F', '#E9C9C4', '#4A2E33'], gift: 'Your presence is enough. Monetary gifts are welcome.',
  },
  anniversary: {
    title: 'Michael & Cha · 25 Years', names: 'Michael & Cha', tagline: 'Celebrating twenty-five years of love',
    description: 'Twenty-five years, three kids and countless adventures. Celebrate our silver anniversary with us.',
    story: 'We said “I do” in a tiny chapel in 1999. Today we would like to say it again — with all of you beside us.',
    program: [['5:00 PM', 'Renewal of vows'], ['6:00 PM', 'Dinner'], ['7:30 PM', 'Slideshow & toasts'], ['8:30 PM', 'Dancing']],
    dress: 'Semi-formal. Silver accents encouraged.', dressColors: ['#8A6A4B', '#D8C9B2', '#F7EFE3'], gift: 'Your presence is our gift.',
  },
  'baby-shower': {
    title: 'Baby Cha Is Coming!', names: 'Baby Cha', tagline: 'Please shower us with your company',
    description: 'We are expecting! Join us for games, treats and sweet wishes for our little one.',
    story: 'Our family is growing and we cannot wait to share the joy with you.',
    program: [['2:00 PM', 'Welcome'], ['2:30 PM', 'Games'], ['3:30 PM', 'Lunch'], ['4:30 PM', 'Gift opening']],
    dress: 'Comfortable and cheerful. Pastels encouraged.', dressColors: ['#CDE8E0', '#F9E3B4', '#F2A65A'], gift: 'Diapers, wipes and books for the baby are welcome. Registry linked on the day.',
  },
  graduation: {
    title: 'Michael Is Graduating!', names: 'Michael', tagline: 'Please celebrate the graduation of',
    description: 'After years of hard work, it is finally time to celebrate. Join us for a party in honour of the Class of 2027.',
    story: 'Four years, countless late nights and one very large coffee budget. I could not have done it without you.',
    program: [['4:00 PM', 'Welcome'], ['5:00 PM', 'Dinner'], ['6:30 PM', 'Speeches'], ['7:30 PM', 'Party']],
    dress: 'Smart casual.', dressColors: ['#17171A', '#D9A400'], gift: 'Cards and well wishes are plenty.',
  },
  corporate: {
    title: 'Northwind Annual Summit 2027', names: 'Northwind Annual Summit', tagline: 'You are invited to',
    description: 'A full day of keynotes, workshops and networking with industry leaders. Lunch and refreshments provided.',
    story: 'Join 300+ leaders and practitioners exploring what is next in our industry.',
    program: [['8:30 AM', 'Registration & coffee'], ['9:30 AM', 'Opening keynote'], ['12:00 PM', 'Networking lunch'], ['2:00 PM', 'Breakout workshops'], ['5:00 PM', 'Closing reception']],
    dress: 'Business casual.', dressColors: ['#14213D', '#2D6CDF'], gift: '',
  },
  holiday: {
    title: 'Michael & Cha’s Christmas Party', names: 'Michael & Cha', tagline: 'Join us for an evening of cheer',
    description: 'Eat, drink and be merry! Bring your appetite and your best holiday sweater.',
    story: 'It is our favourite night of the year and we cannot wait to celebrate with you.',
    program: [['6:00 PM', 'Open house'], ['7:00 PM', 'Dinner'], ['8:00 PM', 'Gift exchange'], ['9:00 PM', 'Carols & dessert']],
    dress: 'Festive! Ugly sweaters welcome.', dressColors: ['#8E2A2A', '#B8863B', '#FBEFD9'], gift: 'Bring a wrapped gift (₱500 budget) for the exchange.',
  },
  other: {
    title: 'You Are Invited', names: 'Our Celebration', tagline: 'Please join us',
    description: 'We would be delighted to have you with us to celebrate this special occasion.',
    story: 'Thank you for being part of our story.',
    program: [['5:00 PM', 'Arrival'], ['6:00 PM', 'Main event'], ['8:00 PM', 'Celebration']],
    dress: 'Come as you are.', dressColors: [], gift: '',
  },
};

export function createDefaultConfig(occasionId = 'wedding', templateId) {
  const sample = SAMPLES[occasionId] ?? SAMPLES.other;
  const tpl = templateById(templateId);
  const date = dayjs().add(75, 'day').format('YYYY-MM-DD');

  return {
    version: 1,
    event: {
      title: sample.title,
      names: sample.names,
      tagline: sample.tagline,
      description: sample.description,
      date,
      startTime: '15:00',
      endTime: '22:00',
    },
    host: {
      parents: occasionId === 'wedding' || occasionId === 'engagement'
        ? 'Michael’s parents\nCha’s parents' : '',
      hosts: '',
      sponsors: '',
      acknowledgments: 'With love and gratitude to our families and friends.',
    },
    venue: {
      name: 'The Garden Pavilion',
      address: '123 Rosewood Avenue, Quezon City, Metro Manila',
      mapUrl: '',
    },
    images: { cover: '', background: '', primary: '', secondary: '', gallery: [] },
    theme: { ...tpl.theme, templateId: tpl.id },
    sections: {
      story: { enabled: true, title: occasionId === 'corporate' ? 'About the Event' : 'Our Story', text: sample.story },
      countdown: { enabled: true, title: 'Counting down' },
      program: {
        enabled: true, title: 'Program',
        items: sample.program.map(([time, title]) => ({ id: uid(), time, title, description: '' })),
      },
      entourage: {
        enabled: occasionId === 'wedding' || occasionId === 'debut',
        title: occasionId === 'debut' ? 'The Court' : 'Entourage',
        groups: [
          { id: uid(), title: 'Maid of Honor', members: 'Anna Cruz' },
          { id: uid(), title: 'Best Man', members: 'Mark Dela Peña' },
          { id: uid(), title: 'Bridesmaids', members: 'Lea Garcia\nChloe Tan\nBea Lim' },
          { id: uid(), title: 'Groomsmen', members: 'Paolo Reyes\nMiguel Santos\nDaniel Uy' },
        ],
      },
      gallery: { enabled: true, title: 'Gallery' },
      dressCode: { enabled: true, title: 'Dress Code', text: sample.dress, colors: sample.dressColors },
      gifts: { enabled: Boolean(sample.gift), title: 'Gift Guide', text: sample.gift },
      faq: {
        enabled: true, title: 'Questions & Answers',
        items: [
          { id: uid(), q: 'Can I bring a plus one?', a: 'Please refer to your invitation. Kindly indicate the number of guests when you RSVP.' },
          { id: uid(), q: 'Is there parking at the venue?', a: 'Yes, free parking is available on-site.' },
          { id: uid(), q: 'Are children welcome?', a: 'Little ones are welcome to celebrate with us.' },
        ],
      },
      location: { enabled: true, title: 'Venue & Directions', showMap: true },
      rsvp: {
        enabled: true, title: 'Kindly Reply',
        message: 'Please let us know if you can make it.',
        deadline: dayjs(date).subtract(14, 'day').format('YYYY-MM-DD'),
        allowPlusOnes: true, maxGuests: 4, mealOptions: '', collectNote: true,
      },
    },
    page: {
      seoTitle: '', seoDescription: '', ogImage: '',
      opening: true, openingText: 'Tap to open', noindex: false, hideBranding: false,
    },
    meta: { occasion: occasionId },
  };
}

export const suggestSlug = (config) => slugify(config?.event?.title || config?.event?.names || 'invitation');
