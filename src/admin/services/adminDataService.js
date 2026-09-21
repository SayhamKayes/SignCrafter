// Admin Data Service - Firebase Firestore synchronization with transparent Local Fallback
import { 
  db, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc 
} from '../../firebase';

const LOCAL_STORAGE_KEYS = {
  TEMPLATES: 'signcrafter_admin_templates',
  SOCIALS: 'signcrafter_admin_socials',
  CONTACTS: 'signcrafter_admin_contacts'
};

// Safe helper for local storage
const getLocalData = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setLocalData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('LocalStorage write failed:', err);
  }
};

// =========================================================================
// 1. TEMPLATES (CRUD)
// =========================================================================

export const fetchCustomTemplates = async () => {
  if (db) {
    try {
      const colRef = collection(db, 'signcrafter_templates');
      const snapshot = await getDocs(colRef);
      if (!snapshot.empty) {
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setLocalData(LOCAL_STORAGE_KEYS.TEMPLATES, items);
        return items;
      }
    } catch (err) {
      console.warn('Firestore fetchCustomTemplates fallback to local:', err?.message || err);
    }
  }
  return getLocalData(LOCAL_STORAGE_KEYS.TEMPLATES, []);
};

export const saveCustomTemplate = async (template) => {
  const templateId = String(template.id || `custom_${Date.now()}`);
  const payload = {
    ...template,
    id: templateId,
    updatedAt: new Date().toISOString()
  };

  // 1. Update local storage immediately for fast UI
  const current = getLocalData(LOCAL_STORAGE_KEYS.TEMPLATES, []);
  const existingIdx = current.findIndex(t => String(t.id) === templateId);
  if (existingIdx >= 0) {
    current[existingIdx] = payload;
  } else {
    current.push(payload);
  }
  setLocalData(LOCAL_STORAGE_KEYS.TEMPLATES, current);

  // 2. Persist to Firestore if available
  if (db) {
    try {
      const docRef = doc(db, 'signcrafter_templates', templateId);
      await setDoc(docRef, payload, { merge: true });
    } catch (err) {
      console.warn('Firestore saveCustomTemplate fallback:', err?.message || err);
    }
  }

  return payload;
};

export const deleteCustomTemplate = async (templateId) => {
  const strId = String(templateId);

  // 1. Local update
  const current = getLocalData(LOCAL_STORAGE_KEYS.TEMPLATES, []);
  const filtered = current.filter(t => String(t.id) !== strId);
  setLocalData(LOCAL_STORAGE_KEYS.TEMPLATES, filtered);

  // 2. Firestore delete if available
  if (db) {
    try {
      const docRef = doc(db, 'signcrafter_templates', strId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore deleteCustomTemplate fallback:', err?.message || err);
    }
  }
  return true;
};

// =========================================================================
// 2. SOCIAL MEDIA PLATFORMS & COLOR SETS (CRUD)
// =========================================================================

export const fetchCustomSocials = async () => {
  if (db) {
    try {
      const colRef = collection(db, 'signcrafter_socials');
      const snapshot = await getDocs(colRef);
      if (!snapshot.empty) {
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setLocalData(LOCAL_STORAGE_KEYS.SOCIALS, items);
        return items;
      }
    } catch (err) {
      console.warn('Firestore fetchCustomSocials fallback to local:', err?.message || err);
    }
  }
  return getLocalData(LOCAL_STORAGE_KEYS.SOCIALS, []);
};

export const saveCustomSocial = async (social) => {
  const socialId = String(social.id || social.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));
  const payload = {
    ...social,
    id: socialId,
    updatedAt: new Date().toISOString()
  };

  // 1. Local update
  const current = getLocalData(LOCAL_STORAGE_KEYS.SOCIALS, []);
  const existingIdx = current.findIndex(s => s.id === socialId);
  if (existingIdx >= 0) {
    current[existingIdx] = payload;
  } else {
    current.push(payload);
  }
  setLocalData(LOCAL_STORAGE_KEYS.SOCIALS, current);

  // 2. Firestore update if available
  if (db) {
    try {
      const docRef = doc(db, 'signcrafter_socials', socialId);
      await setDoc(docRef, payload, { merge: true });
    } catch (err) {
      console.warn('Firestore saveCustomSocial fallback:', err?.message || err);
    }
  }

  return payload;
};

export const deleteCustomSocial = async (socialId) => {
  const strId = String(socialId);
  const current = getLocalData(LOCAL_STORAGE_KEYS.SOCIALS, []);
  const filtered = current.filter(s => s.id !== strId);
  setLocalData(LOCAL_STORAGE_KEYS.SOCIALS, filtered);

  if (db) {
    try {
      const docRef = doc(db, 'signcrafter_socials', strId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore deleteCustomSocial fallback:', err?.message || err);
    }
  }
  return true;
};

// =========================================================================
// 3. CONTACT ICONS (CRUD)
// =========================================================================

export const fetchCustomContacts = async () => {
  if (db) {
    try {
      const colRef = collection(db, 'signcrafter_contacts');
      const snapshot = await getDocs(colRef);
      if (!snapshot.empty) {
        const items = snapshot.docs.map(d => ({ key: d.id, ...d.data() }));
        setLocalData(LOCAL_STORAGE_KEYS.CONTACTS, items);
        return items;
      }
    } catch (err) {
      console.warn('Firestore fetchCustomContacts fallback to local:', err?.message || err);
    }
  }
  return getLocalData(LOCAL_STORAGE_KEYS.CONTACTS, []);
};

export const saveCustomContact = async (contact) => {
  const key = String(contact.key);
  const payload = {
    ...contact,
    key,
    updatedAt: new Date().toISOString()
  };

  const current = getLocalData(LOCAL_STORAGE_KEYS.CONTACTS, []);
  const existingIdx = current.findIndex(c => c.key === key);
  if (existingIdx >= 0) {
    current[existingIdx] = payload;
  } else {
    current.push(payload);
  }
  setLocalData(LOCAL_STORAGE_KEYS.CONTACTS, current);

  if (db) {
    try {
      const docRef = doc(db, 'signcrafter_contacts', key);
      await setDoc(docRef, payload, { merge: true });
    } catch (err) {
      console.warn('Firestore saveCustomContact fallback:', err?.message || err);
    }
  }
  return payload;
};

export const deleteCustomContact = async (key) => {
  const current = getLocalData(LOCAL_STORAGE_KEYS.CONTACTS, []);
  const filtered = current.filter(c => c.key !== key);
  setLocalData(LOCAL_STORAGE_KEYS.CONTACTS, filtered);

  if (db) {
    try {
      const docRef = doc(db, 'signcrafter_contacts', key);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore deleteCustomContact fallback:', err?.message || err);
    }
  }
  return true;
};

// =========================================================================
// 4. DATABASE HEALTH CHECK
// =========================================================================
export const testDatabaseConnection = async () => {
  if (!db) {
    return { 
      success: false, 
      mode: 'local_fallback', 
      message: 'Firebase credentials missing in Vercel environment variables. Running safely in Local Resilience Mode.' 
    };
  }
  try {
    const colRef = collection(db, 'signcrafter_health');
    const docRef = doc(colRef, 'ping');
    await setDoc(docRef, { ping: true, timestamp: Date.now() }, { merge: true });
    return { success: true, mode: 'cloud', message: 'Firebase Cloud Firestore Connected' };
  } catch (err) {
    return { 
      success: false, 
      mode: 'local_fallback', 
      message: `Firestore offline or permission pending (${err?.message || 'Access notice'}). Operating in Local Storage mode.` 
    };
  }
};
