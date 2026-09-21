import { create } from 'zustand';
import { uploadImage as uploadToCloudinary } from '../cloudinary';
import { auth, signOut, onAuthStateChanged } from '../firebase';
import { fetchCustomTemplates, fetchCustomSocials, fetchCustomContacts } from '../admin/services/adminDataService';

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('app_theme');
    if (saved) return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
};

const initialTheme = getInitialTheme();
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-theme', initialTheme);
}

export const useSignatureStore = create((set, get) => ({
  // --- AUTH STATE ---
  currentUser: null,
  authModalOpen: false,
  pendingUpload: null,

  openAuthModal: (pending = null) => set({ authModalOpen: true, pendingUpload: pending }),
  closeAuthModal: () => set({ authModalOpen: false, pendingUpload: null }),
  setCurrentUser: (user) => set({ currentUser: user }),
  logoutUser: async () => {
    try {
      if (auth) await signOut(auth);
      set({ currentUser: null });
    } catch (err) {
      console.error("Sign out error:", err);
    }
  },

  // --- THEME ---
  theme: initialTheme,
  isOnboardingComplete: false,
  emailClient: 'other', 
  currentTemplate: 1,
  uploadingField: null, 

  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('app_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    return { theme: nextTheme };
  }),

  setTheme: (newTheme) => {
    localStorage.setItem('app_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    set({ theme: newTheme });
  },

  images: {
    profile: 'https://ui-avatars.com/api/?name=Profile+Photo&background=E2E8F0&color=333&size=150',
    company: 'https://ui-avatars.com/api/?name=Logo&background=0F172A&color=fff&size=100',
    banner: 'https://ui-avatars.com/api/?name=Banner&background=E2E8F0&color=333&size=400',
    profileWidth: 100,
    companyWidth: 150,
    bannerWidth: 400,
  },

  imageNames: {
    profile: '',
    company: '',
    banner: ''
  },

  customImages: [], // State for unlimited custom badges

  personalDetails: {
    name: "Jon Doe",
    title: "Creative Professional",
    company: "SKz Lab"
  },

  fonts: {
    name: { family: 'Arial, Helvetica, sans-serif', style: 'normal', weight: 'bold', transform: 'none' },
    title: { family: 'Arial, Helvetica, sans-serif', style: 'normal', weight: 'normal', transform: 'none' },
    company: { family: 'Arial, Helvetica, sans-serif', style: 'normal', weight: 'normal', transform: 'none' },
    contact: { family: 'Arial, Helvetica, sans-serif', style: 'normal', weight: 'normal', transform: 'none' }
  },
  
  colors: {
    name: "#000000",
    title: "#3B82F6",
    company: "#666666",
    line: "#F3F00A",
    conIcon: "#3B82F6",
    conText: "#333333",
    social: "#3B82F6",
  },

  iconStyles: {
    socialStyle: 'rounded',
    contactStyle: 'rounded'
  },

  activeContacts: [
    { type: 'phone', label: '+880 1234 567 890', value: '+880 1234 567 890' },
    { type: 'email', label: 'contact@skzlab.com', value: 'contact@skzlab.com' },
    { type: 'domain', label: 'www.skzlab.com', value: 'https://www.skzlab.com' },
    { type: 'address', label: 'Dhaka, Bangladesh', value: 'Dhaka, Bangladesh' }
  ],

  activeSocialLinks: [
    { id: 'linkedin', url: 'https://linkedin.com/in/' },
    { id: 'github', url: 'https://github.com/' }
  ],

  // --- UPLOAD ACTION (SINGLE IMAGES) ---
  uploadImage: async (file, imageType) => {
    set({ uploadingField: imageType }); 

    // ---> Save the file name to the store <---
    set((state) => ({
      imageNames: { ...state.imageNames, [imageType]: file.name }
    }));

    try {
      const { currentUser } = get();
      // Passes the imageType and current user's UID to organize in Cloudinary
      const imageUrl = await uploadToCloudinary(file, imageType, currentUser?.uid); 
      set((state) => ({
        images: {
          ...state.images,
          [imageType]: imageUrl
        }
      }));
    } catch (error) {
      alert(`Failed to upload image. Please try again.`);
    } finally {
      set({ uploadingField: null }); 
    }
  },

  setImageUrl: (imageType, url, name = '') => set((state) => ({
    images: { ...state.images, [imageType]: url },
    imageNames: name ? { ...state.imageNames, [imageType]: name } : state.imageNames
  })),

  // // --- UPLOAD ACTION (UNLIMITED CUSTOM IMAGES) ---
  // uploadCustomImages: async (files) => {
  //   set({ uploadingField: 'custom' }); 
  //   try {
  //     const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file, 'custom'));
  //     const newUrls = await Promise.all(uploadPromises);
      
  //     set((state) => ({
  //       customImages: [...state.customImages, ...newUrls]
  //     }));
  //   } catch (error) {
  //     alert("Failed to upload custom images.");
  //   } finally {
  //     set({ uploadingField: null }); 
  //   }
  // },

  // // --- ACTIONS ---
  // removeCustomImage: (index) => set((state) => ({
  //   customImages: state.customImages.filter((_, i) => i !== index)
  // })),

  setCompanyWidth: (width) => set((state) => ({
    images: { ...state.images, companyWidth: width }
  })),

  setProfileWidth: (size) => set((state) => ({
    images: { ...state.images, profileWidth: size }
  })),

  setBannerWidth: (width) => set((state) => ({
    images: { ...state.images, bannerWidth: width }
  })),

  completeOnboarding: () => set({ isOnboardingComplete: true }),
  
  setEmailClient: (client) => set({ emailClient: client }),

  setIndustryAndTitle: (industry) => set((state) => {
    let newTitle = "Creative Professional";
    if (industry === 'Software / IT') newTitle = "Software Engineer";
    if (industry === 'Design') newTitle = "UI/UX Designer";
    if (industry === 'Marketing') newTitle = "Marketing Manager";
    return { personalDetails: { ...state.personalDetails, title: newTitle } };
  }),

  setInitialSocials: (socialIds) => set(() => {
    const newSocials = socialIds.map(id => ({ id, url: `https://${id}.com/in/` }));
    return { activeSocialLinks: newSocials };
  }),

  setTemplate: (id) => set({ currentTemplate: id }),

  updatePersonalDetails: (field, value) => set((state) => ({
    personalDetails: { ...state.personalDetails, [field]: value }
  })),

  updateColor: (field, value) => set((state) => ({
    colors: { ...state.colors, [field]: value }
  })),

  updateIconStyle: (field, value) => set((state) => ({
    iconStyles: { ...state.iconStyles, [field]: value }
  })),

  addContact: (contact) => set((state) => ({
    activeContacts: [...state.activeContacts, contact]
  })),

  moveContact: (index, direction) => set((state) => {
    const newContacts = [...state.activeContacts];
    if (direction === -1 && index > 0) {
      [newContacts[index], newContacts[index - 1]] = [newContacts[index - 1], newContacts[index]];
    } else if (direction === 1 && index < newContacts.length - 1) {
      [newContacts[index], newContacts[index + 1]] = [newContacts[index + 1], newContacts[index]];
    }
    return { activeContacts: newContacts };
  }),

  removeContact: (index) => set((state) => ({
    activeContacts: state.activeContacts.filter((_, i) => i !== index)
  })),

  updateContact: (index, field, value) => set((state) => {
    const newContacts = [...state.activeContacts];
    newContacts[index][field] = value;
    return { activeContacts: newContacts };
  }),

  addSocial: (id) => set((state) => {
    if (!state.activeSocialLinks.find(s => s.id === id)) {
      return { activeSocialLinks: [...state.activeSocialLinks, { id, url: '' }] };
    }
    return state;
  }),

  removeSocial: (index) => set((state) => ({
    activeSocialLinks: state.activeSocialLinks.filter((_, i) => i !== index)
  })),

  updateSocialUrl: (index, url) => set((state) => {
    const newLinks = [...state.activeSocialLinks];
    newLinks[index].url = url;
    return { activeSocialLinks: newLinks };
  }),

  moveSocial: (index, direction) => set((state) => {
    const newLinks = [...state.activeSocialLinks];
    if (direction === -1 && index > 0) {
      [newLinks[index], newLinks[index - 1]] = [newLinks[index - 1], newLinks[index]];
    } else if (direction === 1 && index < newLinks.length - 1) {
      [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
    }
    return { activeSocialLinks: newLinks };
  }),

  updateFont: (element, field, value) => set((state) => ({
    fonts: {
      ...state.fonts,
      [element]: {
        ...state.fonts[element],
        [field]: value
      }
    }
  })),

  // --- DYNAMIC ADMIN DATA ---
  customTemplates: [],
  customSocials: [],
  customContacts: [],

  setCustomTemplates: (templates) => set({ customTemplates: templates }),
  setCustomSocials: (socials) => set({ customSocials: socials }),
  setCustomContacts: (contacts) => set({ customContacts: contacts }),

  loadAdminData: async () => {
    try {
      const [tpls, socs, conts] = await Promise.all([
        fetchCustomTemplates(),
        fetchCustomSocials(),
        fetchCustomContacts()
      ]);
      set({
        customTemplates: tpls || [],
        customSocials: socs || [],
        customContacts: conts || []
      });
    } catch (err) {
      console.warn('Could not load dynamic admin data:', err);
    }
  }
}));

// Synchronize Firebase Auth state automatically across page reloads
if (typeof window !== 'undefined') {
  if (auth) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        useSignatureStore.getState().setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      } else {
        useSignatureStore.getState().setCurrentUser(null);
      }
    });
  }

  // Load dynamic templates and icons from Admin DB / cache
  useSignatureStore.getState().loadAdminData();
}