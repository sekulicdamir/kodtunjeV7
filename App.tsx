
import React, { useState, useEffect, createContext, useContext, useCallback, useRef, PropsWithChildren } from 'react';
import { MenuIcon, CloseIcon, PhoneIcon, InstagramIcon, FacebookIcon, MapPinIcon, ChevronDownIcon, EmailIcon } from './components/Icons';

// --- DATA TYPES & INTERFACES ---
interface MenuItem {
  name: string;
  price: string;
}

interface Menu {
  starters: MenuItem[];
  lunch: MenuItem[];
  dinner: MenuItem[];
  dessert: MenuItem[];
}

interface OpeningHour {
  day: string;
  hours: string;
}

interface SiteData {
  heroImage: string;
  logoUrl: string;
  translations: {
    [key: string]: { [key: string]: string }
  };
  openingHours: OpeningHour[];
  menu: Menu;
  galleryImages: string[];
  sliderImages: string[];
  slider2Images: string[];
  menuImages: string[];
}

// --- DATABASE & DATA MANAGEMENT ---
const DEFAULT_SITE_DATA: SiteData = {
  heroImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
  logoUrl: "https://ik.imagekit.io/j6wdxvinv/Kod%20Tunje/Menu%20logo%20Kod%20Tunje%20small%20cut%20header.png",
  translations: {
    me: {
      logo: "Kod Tunje",
      navHome: "Početna",
      navAbout: "O Nama",
      navMenu: "Meni",
      navOffers: "Ponude",
      navEvents: "Proslave",
      heroTitle: "DOBRODOŠLI U KONOBU NA VRBANJU",
      heroCtaText: "POZOVITE NAS",
      heroCtaLink: "tel:+38267123456",
      aboutTitle: "Ako tražite iskreno gostoprimstvo, miran ambijent i pravu domaću hranu, Konoba kod Tunje je pravo mjesto za vas.",
      aboutText1: "U prijatnom ambijentu Vrbanja nudimo autentična crnogorska jela, pripremana na tradicionalan način, po receptima koji se prenose generacijama.",
      aboutText2: "Koristimo domaće namirnice i kuvamo s ljubavlju, kako bi svaki zalogaj imao pravi ukus domaće trpeze.",
      openingHours: "Radno Vrijeme",
      reserveTableText: "REZERVIŠITE STO",
      reserveTableLink: "tel:+38267123456",
      reservationsCtaText: "REZERVACIJE",
      reservationsCtaLink: "tel:+38267123456",
      quoteText: "“Ako tražite iskreno gostoprimstvo, miran ambijent i pravu domaću hranu, Konoba kod Tunje je pravo mjesto za vas.”",
      eventsTitle: "Sala za proslave, novitet u našoj ponudi!",
      eventsText: "Uživajte u kulinarskom putovanju kao nijednom drugom. Smješteni u srcu prirode, mi smo utočište za ljubitelje hrane koji traže izvanredne ukuse i nezaboravno iskustvo. Naš restoran kombinuje topao i primamljiv ambijent sa besprekornom uslugom kako bismo stvorili savršeno okruženje za svaku priliku.",
      footerDine: "Ručajte kod nas. Naručite za ponijeti. Ketering.",
      footerAddress: "Vrbanj b.b., Herceg Novi, Crna Gora",
      footerOrderText: "REZERVIŠITE ONLINE",
      footerOrderLink: "mailto:reservations@kodtunje.me",
      footerFollowUs: "PRATITE NAS",
      facebookLink: "https://www.facebook.com/",
      instagramLink: "https://www.instagram.com/konobakodtunje/",
      ourMenu: "Naš Meni",
      starters: "Predjela",
      lunch: "Ručak",
      dinner: "Večera",
      dessert: "Dezerti",

      // About Page Content
      aboutPageTitle: "O našoj priči",
      aboutPageText1: "Konoba kod Tunje je više od restorana – to je mjesto gdje se tradicija sreće sa prirodom. Smješteni u srcu Vrbanja, ponosimo se autentičnom domaćom kuhinjom koja slavi bogate ukuse Crne Gore.",
      aboutPageText2: "Naša priča počinje sa željom da sačuvamo od zaborava stare recepte i da našim gostima ponudimo iskreno gastronomsko iskustvo. Svako jelo pripremamo sa pažljivo odabranim, svježim namirnicama lokalnog porijekla, jer vjerujemo da je kvalitet na prvom mjestu.",
      contactInfoTitle: "Kontakt & Lokacija",
      companyNameLabel: "Naziv firme",
      companyNameValue: "Konoba kod Tunje DOO",
      vatNumberLabel: "PIB",
      vatNumberValue: "01234567",
      addressLabel: "Adresa",
      phoneLabel: "Telefon",
      phoneValue: "+382 67 123 456",
      directionsButtonText: "Prikaži na mapi",
      directionsButtonLink: "https://www.google.com/maps/place/Vrbanj,+Montenegro",
      
      // Legal Pages
      termsOfServiceLink: "Uslovi korišćenja",
      privacyPolicyLink: "Politika privatnosti",
      tosTitle: "Uslovi Korišćenja",
      tosContent: "Ovdje ide tekst o uslovima korišćenja. Sadržaj se može uređivati putem administratorskog panela.",
      privacyTitle: "Politika Privatnosti",
      privacyContent: "Ovdje ide tekst o politici privatnosti. Sadržaj se može uređivati putem administratorskog panela.",
      backToHome: "Nazad na početnu"
    },
    en: { /* ... English translations ... */ },
  },
  openingHours: [
    { day: 'Mon', hours: '11am - 9pm' }, { day: 'Tue', hours: '11am - 9pm' }, { day: 'Wed', hours: 'Closed' },
    { day: 'Thu', hours: '11am - 9pm' }, { day: 'Fri', hours: '11am - 10pm' }, { day: 'S&S', hours: '12am - 10pm' },
  ],
  menu: {
    starters: [{name: 'Lorem Ipsum Dolor Sit Amet', price: '$15.95'}, {name: 'Donec Sed Finibus Nisi', price: '$19.95'}],
    lunch: [{name: 'Quisque Aliquet Velit Sit Amet', price: '$9.95'}, {name: 'Morbi Tortor Nibh Fringilla', price: '$22.95'}],
    dinner: [{name: 'Curabitur Nisi Odio Vel', price: '$35.95'}],
    dessert: [{name: 'Pellentesque Congue Nec', price: '$12.95'}],
  },
  galleryImages: [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
    "https://images.unsplash.com/photo-1540189549336-e6e-99c3679fe?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
    "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
    "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
  ],
  sliderImages: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
    "https://images.unsplash.com/photo-1414235077428-338989a2e-8c0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
    "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
  ],
  slider2Images: [
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
  ],
  menuImages: [
    "https://images.unsplash.com/photo-1504754524776-8f4f37790774?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
    "https://images.unsplash.com/photo-1484980972926-ed5a6c81725b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600",
  ],
};

// Custom hook for localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) { console.error(error); return initialValue; }
  });
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) { console.error(error); }
  };
  return [storedValue, setValue];
}

// Custom hook for sessionStorage (for auth)
function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) { console.error(error); return initialValue; }
  });
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) { console.error(error); }
  };
  return [storedValue, setValue];
}


// --- CONTEXT PROVIDERS & HOOKS ---
type LangCode = 'me' | 'en' | 'sr' | 'hr' | 'ru' | 'de' | 'uk' | 'tr' | 'es' | 'zh-HK' | 'zh-CN' | 'ja' | 'hi';
type LanguageDetails = { name: string; short: string; flag: string; };
const languageMap: Record<LangCode, LanguageDetails> = {
  me: { name: 'Montenegrin', short: 'ME', flag: '🇲🇪' }, sr: { name: 'Serbian', short: 'SR', flag: '🇷🇸' }, hr: { name: 'Croatian', short: 'HR', flag: '🇭🇷' }, en: { name: 'English', short: 'EN', flag: '🇬🇧' }, ru: { name: 'Russian', short: 'RU', flag: '🇷🇺' }, de: { name: 'German', short: 'DE', flag: '🇩🇪' }, uk: { name: 'Ukrainian', short: 'UA', flag: '🇺🇦' }, tr: { name: 'Turkish', short: 'TR', flag: '🇹🇷' }, es: { name: 'Spanish', short: 'ES', flag: '🇪🇸' }, 'zh-HK': { name: 'Cantonese', short: 'HK', flag: '🇭🇰' }, 'zh-CN': { name: 'Mandarin', short: 'CN', flag: '🇨🇳' }, ja: { name: 'Japanese', short: 'JP', flag: '🇯🇵' }, hi: { name: 'Hindi', short: 'IN', flag: '🇮🇳' },
};

const LanguageContext = createContext(null);
const LanguageProvider = ({ children, translations }: PropsWithChildren<{ translations: any }>) => {
  const [lang, setLang] = useState<LangCode>('me');
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    if (Object.keys(languageMap).includes(browserLang)) setLang(browserLang as LangCode);
  }, []);
  const t = useCallback((key: string) => translations[lang]?.[key] || translations['me'][key] || key, [lang, translations]);
  return <LanguageContext.Provider value={{ lang, setLang, t, translations }}>{children}</LanguageContext.Provider>;
};
const useTranslation = () => useContext(LanguageContext);

const DataContext = createContext<SiteData | null>(null);
const useSiteData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useSiteData must be used within a DataProvider');
  return context;
};

// --- ADMIN COMPONENTS ---
const LoginPage = ({ onLogin }: {onLogin: () => void}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'DonDada' && password === '$ekulaMNE!!!2026CG') onLogin();
        else setError('Invalid username or password');
    };
    return (<div className="flex items-center justify-center min-h-screen bg-gray-100"><div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md"><h1 className="text-3xl font-bold text-center text-gray-800">Admin Login</h1><form onSubmit={handleSubmit} className="space-y-6"><div><label className="block text-sm font-medium text-gray-700">Username</label><input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required/></div><div><label className="block text-sm font-medium text-gray-700">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required/></div>{error && <p className="text-sm text-red-600">{error}</p>}<button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Login</button></form></div></div>);
};

const AdminDashboard = ({ data, onSave }: {data: SiteData, onSave: (data: SiteData) => void}) => {
    const [formData, setFormData] = useState<SiteData>(JSON.parse(JSON.stringify(data)));
    const [message, setMessage] = useState('');
    const handleSave = () => { onSave(formData); setMessage('Changes saved successfully!'); setTimeout(() => setMessage(''), 3000); };
    const handleTextChange = (lang: string, key: string, value: string) => { setFormData(prev => ({...prev, translations: {...prev.translations, [lang]: {...prev.translations[lang], [key]: value}}})); };
    const handleFieldChange = (field: keyof SiteData, value: any) => { setFormData(prev => ({...prev, [field]: value})); };
    const handleListChange = (list: keyof SiteData, index: number, value: any, category: keyof Menu | null = null) => {
      if (category && list === 'menu') {
        setFormData(prev => {
            const newItems = [...prev.menu[category]];
            newItems[index] = value;
            return {...prev, menu: {...prev.menu, [category]: newItems }};
        });
      } else if (list !== 'menu' && Array.isArray(formData[list])) {
        setFormData(prev => {
            const newList = [...(prev[list] as any[])];
            newList[index] = value;
            return ({ ...prev, [list]: newList });
        });
      }
    };
    const addListItem = (list: string) => {
        if (list === 'menu') {
            const category = prompt("Enter category (starters, lunch, dinner, dessert):", "starters") as keyof Menu | null;
            if (category && formData.menu[category]) {
                const newItem: MenuItem = { name: 'New Item', price: '$0.00' };
                setFormData(prev => ({...prev, menu: {...prev.menu, [category]: [...prev.menu[category], newItem]}}));
            }
        } else if (['galleryImages', 'sliderImages', 'slider2Images', 'menuImages'].includes(list)) {
            const newItem = 'https://via.placeholder.com/800';
            setFormData(prev => ({ ...prev, [list]: [...(prev[list as keyof SiteData] as string[]), newItem] }));
        }
    };
    const removeListItem = (list: string, index: number, category: keyof Menu | null = null) => {
      if(category && list === 'menu') { setFormData(prev => ({...prev, menu: {...prev.menu, [category]: prev.menu[category].filter((_, i) => i !== index)}}));
      } else if (['galleryImages', 'sliderImages', 'slider2Images', 'menuImages'].includes(list)) { setFormData(prev => ({ ...prev, [list]: (prev[list as keyof SiteData] as string[]).filter((_, i) => i !== index) })); }
    };
    const handleOpeningHoursChange = (index: number, field: keyof OpeningHour, value: string) => {
        setFormData(prev => {
            const newHours = [...prev.openingHours];
            newHours[index] = { ...newHours[index], [field]: value };
            return { ...prev, openingHours: newHours };
        });
    };
    const addOpeningHourItem = () => { setFormData(prev => ({...prev, openingHours: [...prev.openingHours, { day: 'New Day', hours: 'Closed' }]})); };
    const removeOpeningHourItem = (index: number) => { setFormData(prev => ({...prev, openingHours: prev.openingHours.filter((_, i) => i !== index)})); };
    
    return (<div className="bg-gray-100 min-h-screen p-4 sm:p-8"><div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-xl"><div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 border-b pb-4"><h1 className="text-3xl font-bold text-gray-800 text-center sm:text-left">Admin Dashboard</h1><div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"><a href="/#" className="text-blue-600 hover:underline w-full sm:w-auto text-center">← Back to Site</a><button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg w-full sm:w-auto">Save</button></div></div>{message && <div className="bg-green-100 border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}<div className="mb-8 p-4 border rounded-lg"><h2 className="text-2xl font-semibold mb-4 text-gray-700">General Settings</h2><div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-600">Logo Image URL</label><input value={formData.logoUrl} onChange={e => handleFieldChange('logoUrl', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/></div><div><label className="block text-sm font-medium text-gray-600">Hero Image URL</label><input value={formData.heroImage} onChange={e => handleFieldChange('heroImage', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/></div></div></div><div className="mb-8 p-4 border rounded-lg"><h2 className="text-2xl font-semibold mb-4 text-gray-700">Page Content (Montenegrin)</h2><div className="grid md:grid-cols-2 gap-4">{Object.keys(formData.translations.me).map(key => (<div key={key}><label className="block text-sm font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label><textarea value={formData.translations.me[key]} onChange={e => handleTextChange('me', key, e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/></div>))}</div></div><div className="grid md:grid-cols-2 gap-8 mb-8"><div className="p-4 border rounded-lg"><h2 className="text-2xl font-semibold mb-4 text-gray-700">Slider Images</h2>{/* FIX: Add Array.isArray check to ensure formData.sliderImages is an array before mapping over it. */}
{Array.isArray(formData.sliderImages) && formData.sliderImages.map((url, i) => (<div key={i} className="flex items-center mb-2"><input value={url} onChange={e => handleListChange('sliderImages', i, e.target.value)} className="flex-grow p-2 border rounded-l-md"/><button onClick={() => removeListItem('sliderImages', i)} className="bg-red-500 text-white px-3 py-2 rounded-r-md">X</button></div>))}<button onClick={() => addListItem('sliderImages')} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md">+ Add</button></div><div className="p-4 border rounded-lg"><h2 className="text-2xl font-semibold mb-4 text-gray-700">Gallery Images</h2>{/* FIX: Add Array.isArray check to ensure formData.galleryImages is an array before mapping over it. */}
{Array.isArray(formData.galleryImages) && formData.galleryImages.map((url, i) => (<div key={i} className="flex items-center mb-2"><input value={url} onChange={e => handleListChange('galleryImages', i, e.target.value)} className="flex-grow p-2 border rounded-l-md"/><button onClick={() => removeListItem('galleryImages', i)} className="bg-red-500 text-white px-3 py-2 rounded-r-md">X</button></div>))}<button onClick={() => addListItem('galleryImages')} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md">+ Add</button></div></div>
{/* FIX: Added Array.isArray check to ensure formData.slider2Images is an array before mapping over it. */}
<div className="mb-8 p-4 border rounded-lg"><h2 className="text-2xl font-semibold mb-4 text-gray-700">Slider 2 Images</h2>{Array.isArray(formData.slider2Images) && formData.slider2Images.map((url, i) => (<div key={i} className="flex items-center mb-2"><input value={url} onChange={e => handleListChange('slider2Images', i, e.target.value)} className="flex-grow p-2 border rounded-l-md"/><button onClick={() => removeListItem('slider2Images', i)} className="bg-red-500 text-white px-3 py-2 rounded-r-md">X</button></div>))}<button onClick={() => addListItem('slider2Images')} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md">+ Add</button></div>
{/* FIX: Added Array.isArray check to ensure formData.menuImages is an array before mapping over it. */}
<div className="mb-8 p-4 border rounded-lg"><h2 className="text-2xl font-semibold mb-4 text-gray-700">Menu Block Images</h2>{Array.isArray(formData.menuImages) && formData.menuImages.map((url, i) => (<div key={i} className="flex items-center mb-2"><input value={url} onChange={e => handleListChange('menuImages', i, e.target.value)} className="flex-grow p-2 border rounded-l-md"/><button onClick={() => removeListItem('menuImages', i)} className="bg-red-500 text-white px-3 py-2 rounded-r-md">X</button></div>))}<button onClick={() => addListItem('menuImages')} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md">+ Add</button></div><div className="mb-8 p-4 border rounded-lg"><h2 className="text-2xl font-semibold mb-4 text-gray-700">Opening Hours</h2>{formData.openingHours.map((item, i) => (<div key={i} className="flex flex-col sm:flex-row gap-2 mb-2"><input value={item.day} onChange={e => handleOpeningHoursChange(i, 'day', e.target.value)} className="w-full sm:w-1/3 p-2 border rounded-md" placeholder="Day"/><input value={item.hours} onChange={e => handleOpeningHoursChange(i, 'hours', e.target.value)} className="w-full sm:w-2/3 p-2 border rounded-md" placeholder="Hours"/><button onClick={() => removeOpeningHourItem(i)} className="bg-red-500 text-white px-3 py-2 rounded-md w-full sm:w-auto">X</button></div>))}<button onClick={addOpeningHourItem} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md">+ Add</button></div><div className="p-4 border rounded-lg"><h2 className="text-2xl font-semibold mb-4 text-gray-700">Menu</h2><button onClick={() => addListItem('menu')} className="mb-4 bg-green-500 text-white px-4 py-2 rounded-md">+ Add</button><div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-4">{Object.entries(formData.menu).map(([cat, items]) => (<div key={cat}><h3 className="font-bold capitalize text-lg mb-2">{cat}</h3>{items.map((item, i) => (<div key={i} className="flex flex-col sm:flex-row gap-2 mb-2"><input value={item.name} onChange={e => handleListChange('menu', i, {...item, name: e.target.value}, cat as keyof Menu)} className="w-full sm:w-2/3 p-1 border rounded-md"/><input value={item.price} onChange={e => handleListChange('menu', i, {...item, price: e.target.value}, cat as keyof Menu)} className="w-full sm:w-1/3 p-1 border rounded-md"/><button onClick={() => removeListItem('menu', i, cat as keyof Menu)} className="bg-red-500 text-white px-3 py-1 rounded-md w-full sm:w-auto">X</button></div>))}</div>))}</div></div></div></div>);
};

// --- PUBLIC SITE COMPONENTS ---
const HomePage = () => {
    const data = useSiteData(); const { t } = useTranslation();
    return (<main><section className="h-screen bg-cover bg-center flex items-center justify-center text-white" style={{ backgroundImage: `url('${data.heroImage}')` }}><div className="bg-black bg-opacity-60 text-center p-8 rounded-lg max-w-4xl mx-auto"><h1 className="text-4xl md:text-7xl font-bold mb-4">{t('heroTitle')}</h1><a href={t('heroCtaLink')} className="bg-[#075e54] hover:bg-[#054c43] text-white font-bold py-3 px-8 rounded-md inline-flex items-center justify-center mt-4"><PhoneIcon className="w-5 h-5 mr-2" /><span>{t('heroCtaText')}</span></a></div></section><section className="py-16 md:py-24 bg-[#D02752] text-white"><div className="container mx-auto px-4 text-center max-w-4xl"><h2 className="text-3xl md:text-4xl font-bold mb-6">{t('aboutTitle')}</h2><p className="mb-4 text-lg text-gray-300">{t('aboutText1')}</p><p className="text-lg text-gray-300">{t('aboutText2')}</p></div></section><section className="w-full bg-black"><div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">{data.sliderImages.map((src, i) => (<div key={i} className="flex-shrink-0 w-full h-[70vh] snap-center relative"><img src={src} alt={`R view ${i + 1}`} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black bg-opacity-20"></div></div>))}</div></section><section className="py-16 bg-[#F8F5F2]"><div className="container mx-auto px-4 text-center"><a href={t('reservationsCtaLink')} className="bg-[#075e54] hover:bg-[#054c43] text-white font-bold py-4 px-10 text-2xl rounded-lg inline-flex items-center justify-center transition-transform hover:scale-105"><PhoneIcon className="w-6 h-6 mr-3" /><span>{t('reservationsCtaText')}</span></a></div></section><section className="bg-black text-white py-20 md:py-28"><div className="container mx-auto px-4 text-center max-w-3xl"><p className="text-3xl md:text-4xl font-bold">{t('quoteText')}</p></div></section><section className="container mx-auto px-4 py-16 md:py-24"><div className="grid grid-cols-2 md:grid-cols-3 gap-4">{data.galleryImages.map((src, i) => (<div key={i} className="aspect-square overflow-hidden rounded-lg shadow-lg"><img src={src} alt={`G image ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform"/></div>))}</div></section><section className="w-full bg-black"><div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">{data.menuImages.map((src, i) => (<div key={i} className="flex-shrink-0 w-full h-[70vh] snap-center relative"><img src={src} alt={`Menu Image ${i + 1}`} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black bg-opacity-20"></div></div>))}</div></section><section className="py-16 md:py-24 bg-[#F8F5F2]"><div className="container mx-auto px-4 text-center"><h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-2xl mx-auto">{t('eventsTitle')}</h2><p className="text-lg max-w-3xl mx-auto">{t('eventsText')}</p></div></section><section className="w-full bg-black"><div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">{data.slider2Images.map((src, i) => (<div key={i} className="flex-shrink-0 w-full h-[70vh] snap-center relative"><img src={src} alt={`Slider 2 Image ${i + 1}`} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black bg-opacity-20"></div></div>))}</div></section><section className="py-16 md:py-24 bg-[#F8F5F2]"><div className="container mx-auto px-4 flex justify-center"><div className="max-w-md w-full"><OpeningHoursCard hours={data.openingHours} /></div></div></section></main>);
};

const MenuPage = () => {
    const data = useSiteData(); const { t } = useTranslation();
    return (<main className="py-24 pt-8 bg-white" style={{minHeight: 'calc(100vh - 80px)'}}><div className="container mx-auto px-4 max-w-4xl"><h1 className="text-4xl md:text-6xl font-bold mb-12 text-center">{t('ourMenu')}</h1><div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mb-16">{Object.entries(data.menu).map(([category, items]) => (<div key={category}><h2 className="text-3xl font-semibold mb-4 capitalize border-b-2 border-[#D02752] pb-2">{t(category) || category}</h2><ul className="space-y-4">{items.map((item, index) => (<li key={index} className="flex justify-between items-baseline"><span className="text-lg text-gray-800 pr-4">{item.name}</span><span className="text-lg font-bold text-[#075e54]">{item.price}</span></li>))}</ul></div>))}</div></div><section className="w-full bg-black"><div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">{data.menuImages.map((src, i) => (<div key={i} className="flex-shrink-0 w-full h-[70vh] snap-center relative"><img src={src} alt={`Menu Image ${i + 1}`} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black bg-opacity-20"></div></div>))}</div></section></main>);
};

const AboutPage = ({ navigateToTos, navigateToPrivacy }: {navigateToTos: () => void; navigateToPrivacy: () => void;}) => {
    const { t } = useTranslation();
    return (<main className="py-24 pt-8 bg-white" style={{minHeight: 'calc(100vh - 80px)'}}><div className="container mx-auto px-4 max-w-4xl"><h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">{t('aboutPageTitle')}</h1><p className="text-lg mb-6 text-gray-700">{t('aboutPageText1')}</p><p className="text-lg mb-12 text-gray-700">{t('aboutPageText2')}</p><div className="bg-[#F8F5F2] p-8 rounded-lg shadow-md mb-12"><h2 className="text-3xl font-bold mb-6">{t('contactInfoTitle')}</h2><div className="space-y-4 text-lg"><p><strong>{t('companyNameLabel')}:</strong> {t('companyNameValue')}</p><p><strong>{t('vatNumberLabel')}:</strong> {t('vatNumberValue')}</p><p><strong>{t('addressLabel')}:</strong> {t('footerAddress')}</p><p><strong>{t('phoneLabel')}:</strong> <a href={`tel:${t('phoneValue')}`} className="text-[#075e54] hover:underline">{t('phoneValue')}</a></p></div><a href={t('directionsButtonLink')} target="_blank" rel="noopener noreferrer" className="bg-[#075e54] hover:bg-[#054c43] text-white font-bold py-3 px-6 rounded-md inline-flex items-center justify-center mt-8 transition-transform hover:scale-105"><MapPinIcon className="w-5 h-5 mr-2" /><span>{t('directionsButtonText')}</span></a></div><div className="text-center text-gray-500"><a href="#" onClick={(e) => { e.preventDefault(); navigateToTos(); }} className="hover:underline mx-4">{t('termsOfServiceLink')}</a><span>|</span><a href="#" onClick={(e) => { e.preventDefault(); navigateToPrivacy(); }} className="hover:underline mx-4">{t('privacyPolicyLink')}</a></div></div></main>);
};

const TermsPage = ({ navigateToAbout }: {navigateToAbout: () => void}) => {
    const { t } = useTranslation();
    return (<main className="py-24 pt-8 bg-white" style={{minHeight: 'calc(100vh - 80px)'}}><div className="container mx-auto px-4 max-w-4xl"><h1 className="text-4xl md:text-6xl font-bold mb-8">{t('tosTitle')}</h1><div className="text-lg text-gray-700 space-y-4"><p>{t('tosContent')}</p></div><a href="#" onClick={(e) => { e.preventDefault(); navigateToAbout(); }} className="text-[#075e54] hover:underline mt-12 inline-block font-semibold">&larr; {t('navAbout')}</a></div></main>)
}

const PrivacyPage = ({ navigateToAbout }: {navigateToAbout: () => void}) => {
    const { t } = useTranslation();
    return (<main className="py-24 pt-8 bg-white" style={{minHeight: 'calc(100vh - 80px)'}}><div className="container mx-auto px-4 max-w-4xl"><h1 className="text-4xl md:text-6xl font-bold mb-8">{t('privacyTitle')}</h1><div className="text-lg text-gray-700 space-y-4"><p>{t('privacyContent')}</p></div><a href="#" onClick={(e) => { e.preventDefault(); navigateToAbout(); }} className="text-[#075e54] hover:underline mt-12 inline-block font-semibold">&larr; {t('navAbout')}</a></div></main>)
}

const OpeningHoursCard = ({ hours }: { hours: OpeningHour[] }) => {
    const { t } = useTranslation();
    return (<div className="bg-white p-8 border border-gray-200 shadow-lg"><h3 className="text-2xl font-bold mb-6 text-center">{t('openingHours')}</h3><div className="space-y-3 text-lg text-gray-600 mb-8">{hours.map(item => (<div key={item.day} className="flex justify-between"><span>{item.day}:</span><span className="font-medium">{item.hours}</span></div>))}</div><a href={t('reserveTableLink')} className="w-full text-center bg-[#075e54] hover:bg-[#054c43] text-white font-bold py-3 px-8 rounded-md flex items-center justify-center"><PhoneIcon className="w-5 h-5 mr-2" /><span>{t('reserveTableText')}</span></a></div>);
};

const Header = ({ navigateToHome, navigateToAbout, navigateToMenu }: {navigateToHome: () => void, navigateToAbout: () => void, navigateToMenu: () => void}) => {
    const { logoUrl } = useSiteData(); const { lang, setLang, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false); const [langOpen, setLangOpen] = useState(false); const [visible, setVisible] = useState(false);
    const [hasScrolledUpOnce, setHasScrolledUpOnce] = useState(false); const langRef = useRef(null); const lastScrollY = useRef(0);
    const navItems = [{ page: 'home', label: t('navHome'), action: navigateToHome }, { page: 'menu', label: t('navMenu'), action: navigateToMenu }, { page: 'about', label: t('navAbout'), action: navigateToAbout }];
    const handleScroll = useCallback(() => { const currentScrollY = window.scrollY; const isScrollingUp = currentScrollY < lastScrollY.current; if (isScrollingUp && !hasScrolledUpOnce) { setHasScrolledUpOnce(true); setVisible(true); } else if (hasScrolledUpOnce) { setVisible(currentScrollY <= 100 || isScrollingUp); } lastScrollY.current = currentScrollY; }, [hasScrolledUpOnce]);
    useEffect(() => { window.addEventListener('scroll', handleScroll, { passive: true }); return () => window.removeEventListener('scroll', handleScroll); }, [handleScroll]);
    useEffect(() => { const handleClickOutside = (e: MouseEvent) => { if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false); }; document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [langRef]);
    return (<header className={`bg-black shadow-md fixed bottom-0 w-full z-40 transition-transform ${visible ? 'translate-y-0' : 'translate-y-full'}`}>{isOpen && (<div className="absolute bottom-full w-full bg-black pb-4 border-t border-gray-700">{navItems.map(item => <a key={item.page} href="#" onClick={(e) => { e.preventDefault(); item.action(); setIsOpen(false); }} className="block text-center py-2 text-lg text-gray-300 hover:text-[#097267]">{item.label}</a>)}</div>)}<div className="container mx-auto px-4 h-20 flex justify-between items-center relative"><div className="relative" ref={langRef}><button onClick={() => setLangOpen(!langOpen)} className="flex items-center text-gray-300 hover:text-[#097267]"><span className="mr-2 text-lg">{languageMap[lang].flag}</span>{languageMap[lang].short}<ChevronDownIcon className={`w-5 h-5 ml-1 transition-transform ${langOpen ? 'rotate-180' : ''}`} /></button>{langOpen && (<div className="absolute bottom-full left-0 mb-2 py-2 w-56 bg-white rounded-md shadow-xl z-50">{Object.entries(languageMap).map(([code, { name, short, flag }]) => (<a key={code} href="#" onClick={(e) => { e.preventDefault(); setLang(code as LangCode); setLangOpen(false);}} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#D4E9E7] w-full"><span className="mr-3 text-lg">{flag}</span><span>{short} - {name}</span></a>))}</div>)}</div><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><a href="#" onClick={(e) => { e.preventDefault(); navigateToHome(); }}><img src={logoUrl} alt="Kod Tunje Logo" className="h-16 w-auto"/></a></div><div><nav className="hidden md:flex items-center space-x-6 text-gray-300">{navItems.map(item => <a key={item.page} href="#" onClick={(e) => { e.preventDefault(); item.action(); }} className="hover:text-[#097267] font-medium">{item.label}</a>)}</nav><button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <CloseIcon className="w-8 h-8"/> : <MenuIcon className="w-8 h-8"/>}</button></div></div></header>);
};

const Footer = () => {
  const { t } = useTranslation();
  return (<footer className="bg-black text-white py-12 pb-32"><div className="container mx-auto px-4 text-center"><h3 className="text-2xl font-semibold mb-4">{t('footerDine')}</h3><p className="text-lg text-gray-400 mb-6">{t('footerAddress')}</p><a href={t('footerOrderLink')} className="bg-[#075e54] hover:bg-[#054c43] text-white font-bold py-3 px-8 rounded-md mb-8 inline-flex items-center justify-center"><EmailIcon className="w-5 h-5 mr-2" /><span>{t('footerOrderText')}</span></a><div className="flex justify-center space-x-6 mb-2"><a href={t('facebookLink')} target="_blank" rel="noopener noreferrer" className="hover:text-[#097267]"><FacebookIcon/></a><a href={t('instagramLink')} target="_blank" rel="noopener noreferrer" className="hover:text-[#097267]"><InstagramIcon/></a></div><p className="text-sm uppercase tracking-widest text-gray-400">{t('footerFollowUs')}</p></div></footer>);
};

const PublicSite = ({ data }: { data: SiteData }) => {
    const [page, setPage] = useState('home');
    useEffect(() => { window.scrollTo(0, 0); }, [page]);
    const navigateToHome = () => setPage('home'); const navigateToMenu = () => setPage('menu'); const navigateToAbout = () => setPage('about');
    const navigateToTos = () => setPage('tos'); const navigateToPrivacy = () => setPage('privacy');
    return (
        <LanguageProvider translations={data.translations}>
            <DataContext.Provider value={data}>
                <Header navigateToHome={navigateToHome} navigateToAbout={navigateToAbout} navigateToMenu={navigateToMenu}/>
                {page === 'home' && <HomePage />}
                {page === 'menu' && <MenuPage />}
                {page === 'about' && <AboutPage navigateToTos={navigateToTos} navigateToPrivacy={navigateToPrivacy} />}
                {page === 'tos' && <TermsPage navigateToAbout={navigateToAbout} />}
                {page === 'privacy' && <PrivacyPage navigateToAbout={navigateToAbout} />}
                <Footer />
            </DataContext.Provider>
        </LanguageProvider>
    );
}

// --- MAIN APP ROUTER ---
const App = () => {
    const [route, setRoute] = useState(window.location.hash);
    const [siteData, setSiteData] = useLocalStorage<SiteData>('kod-tunje-data', DEFAULT_SITE_DATA);
    const [isAuthenticated, setIsAuthenticated] = useSessionStorage<boolean>('isAuthenticated', false);
    useEffect(() => {
        const handleHashChange = () => setRoute(window.location.hash);
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    if (route === '#/admin') {
        if (isAuthenticated) return <AdminDashboard data={siteData} onSave={setSiteData} />;
        return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
    }
    return <PublicSite data={siteData} />;
};

export default App;
