import { contactIconsDB, socialsDB } from './constants';

export const generateSignatureHTML = (state) => {
    const {
        currentTemplate,
        images,
        personalDetails: data,
        colors,
        fonts,
        iconStyles,
        activeContacts,
        activeSocialLinks
    } = state;

    // --- Dynamic Typography Engine ---
    const fName = `font-family: ${fonts.name.family}; font-style: ${fonts.name.style}; font-weight: ${fonts.name.weight}; text-transform: ${fonts.name.transform};`;
    const fTitle = `font-family: ${fonts.title.family}; font-style: ${fonts.title.style}; font-weight: ${fonts.title.weight}; text-transform: ${fonts.title.transform};`;
    const fCompany = `font-family: ${fonts.company.family}; font-style: ${fonts.company.style}; font-weight: ${fonts.company.weight}; text-transform: ${fonts.company.transform};`;
    const fContact = `font-family: ${fonts.contact.family}; font-style: ${fonts.contact.style}; font-weight: ${fonts.contact.weight}; text-transform: ${fonts.contact.transform};`;

    // --- Icon Styling Logic ---
    const getIconStyle = (styleType, themeColor) => {
        const styles = {
            'square': { radius: '0px', bg: themeColor, imgColor: 'ffffff' },
            'rounded': { radius: '4px', bg: themeColor, imgColor: 'ffffff' },
            'circle': { radius: '50%', bg: themeColor, imgColor: 'ffffff' },
            'transparent': { radius: '0px', bg: 'transparent', imgColor: themeColor.replace('#', '') }
        };
        return styles[styleType] || styles['rounded'];
    };

    const sStyle = getIconStyle(iconStyles.socialStyle, colors.social);
    const cStyle = getIconStyle(iconStyles.contactStyle, colors.conIcon);

    // --- Build Social HTML (Global) ---
    let socialHTML = '<table cellpadding="0" cellspacing="0" border="0"><tr>';
    activeSocialLinks.forEach(link => {
        if (link.url) {
            const customSoc = (state.customSocials || []).find(cs => cs.id === link.id);
            const sData = customSoc || socialsDB.find(s => s.id === link.id);
            if (sData) {
                const iconSrc = sData.cloudinaryIconUrl || `https://img.icons8.com/ios-filled/50/${sStyle.imgColor}/${sData.icon || sData.id}.png`;
                socialHTML += `
                    <td width="28" height="28" align="center" bgcolor="${sStyle.bg}" style="border-radius: ${sStyle.radius};">
                        <a href="${link.url}" target="_blank" style="display: block; line-height: 28px;">
                            <img src="${iconSrc}" width="16" height="16" style="display: inline-block; vertical-align: middle; border: 0;" alt="${sData.name || ''}">
                        </a>
                    </td>
                    <td width="5"></td>
                `;
            }
        }
    });
    socialHTML += '</tr></table>';

    // Check for custom dynamic template from Admin
    const customTpl = (state.customTemplates || []).find(t => String(t.id) === String(currentTemplate));
    if (customTpl && customTpl.html) {
        let contactsHTML = '';
        activeContacts.forEach(contact => {
            const iconData = contactIconsDB[contact.type] || {};
            const customContact = (state.customContacts || []).find(c => c.key === contact.type);
            const iconUrl = customContact?.cloudinaryIconUrl || `https://img.icons8.com/ios-filled/50/${colors.conIcon?.replace('#', '') || '3b82f6'}/${iconData.icon || 'link'}.png`;
            
            const content = contact.isLink !== false && iconData.isLink !== false
                ? `<a href="${(iconData.prefix || '') + (contact.value || contact.label)}" target="_blank" style="color: ${colors.contact || '#334155'}; text-decoration: none;">${contact.label}</a>`
                : `<span style="color: ${colors.contact || '#334155'};">${contact.label}</span>`;
            
            contactsHTML += `
                <div style="margin-bottom: 4px;">
                    <img src="${iconUrl}" width="14" height="14" style="vertical-align: middle; margin-right: 6px; display: inline-block;" alt="${iconData.name || ''}" />
                    ${content}
                </div>
            `;
        });

        let compiled = customTpl.html
            .replace(/{{name}}/g, data.name || '')
            .replace(/{{title}}/g, data.title || '')
            .replace(/{{company}}/g, data.company || '')
            .replace(/{{primaryColor}}/g, colors.name || '#3B82F6')
            .replace(/{{fontFamily}}/g, fonts.name.family || 'Arial, sans-serif')
            .replace(/{{profileImg}}/g, images.profile || '')
            .replace(/{{logoImg}}/g, images.company || '')
            .replace(/{{bannerImg}}/g, images.banner || '')
            .replace(/{{contacts}}/g, contactsHTML)
            .replace(/{{socials}}/g, socialHTML);

        return compiled;
    }

    let html = ``;

    // ----------------------------------------------------
    // T1: Executive Minimal
    // ----------------------------------------------------
    if (currentTemplate === 1) {
        let t1CustomContacts = '';
        activeContacts.forEach(c => {
            if (!c.label) return;
            const db = contactIconsDB[c.type];
            if (!db) return; // Safely exit if type missing

            if (db.isLink) {
                t1CustomContacts += `
                <tr>
                    <td style="width: 100%;height: 20px;">
                        <p style="margin: 0;padding: 0;font-size: 12px; color: ${colors.conText}; ${fContact}">${db.name}: <a href="${db.prefix}${c.value}" style="color: ${colors.conText};text-decoration: none;" target="_blank">${c.label}</a></p>
                    </td>
                </tr>`;
            } else {
                t1CustomContacts += `
                <tr>
                    <td style="width: 100%; padding-top: 10px; padding-bottom: 10px;">
                        <p style="margin: 0;padding: 0;font-size: 13px;color: ${colors.conText}; line-height: 1.4; ${fContact}">${c.label}</p>
                    </td>
                </tr>`;
            }
        });

        html = `
        <table style="width: 400px; max-width: 100%;" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td style="width: 100%;">
                    <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
                        <tr><td style="width: 100%;height: 20px;"></td></tr>
                        <tr>
                            <td style="width: 100%;height: 20px;">
                                <h1 style="margin: 0;padding: 0;font-size: 14px; ${fName}">
                                    <span style="color: ${colors.name};">${data.name}</span> <span style="color: ${colors.title}; ${fTitle}">| ${data.title}</span>
                                </h1>
                            </td>
                        </tr>
                        <tr><td style="width: 100%;height: 20px;"></td></tr>
                        <tr>
                            <td style="width: 100%; padding-bottom: 15px;">
                                <table cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td style="vertical-align: middle;">
                                            <img src="${images.company}" alt="logo" width="${images.companyWidth}" style="display: block; border: none;">
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        ${t1CustomContacts}
                        <tr><td style="width: 100%;height: 10px;"></td></tr>
                        <tr>
                            <td style="width: 100%;height: 20px;">${socialHTML}</td>
                        </tr>
                        <tr><td style="width: 100%;height: 20px;"></td></tr>
                    </table>
                </td>
            </tr>
        </table>`;
    }

    // ----------------------------------------------------
    // T2: Professional Split
    // ----------------------------------------------------
    else if (currentTemplate === 2) {
        const safeCompanyWidth = Math.min(images.companyWidth, 145);

        let t2CustomContacts = '';
        activeContacts.forEach(c => {
            if (!c.label) return;
            const db = contactIconsDB[c.type];
            if (!db) return; 
            
            const linkHref = db.isLink ? `${db.prefix}${c.value}` : '#';
            const textHTML = db.isLink
                ? `<a href="${linkHref}" style="color: ${colors.conText};text-decoration: none;" target="_blank">${c.label}</a>`
                : `<span style="color: ${colors.conText};">${c.label}</span>`;

            t2CustomContacts += `
            <tr>
                <td style="width: 100%;height: 26px;">
                    <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td style="width: 8%; vertical-align: middle;">
                                <div style="background: ${cStyle.bg}; border-radius: ${cStyle.radius}; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">
                                    <img src="https://img.icons8.com/ios-filled/50/${cStyle.imgColor}/${db.icon}.png" alt="" width="12" style="display:block; border:0;">
                                </div>
                            </td>
                            <td style="width: 92%; padding-left: 8px; vertical-align: middle;">
                                <p style="margin: 0;padding: 0;font-size: 12px; ${fContact}">${textHTML}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>`;
        });

        let t2SocialHTML = '<table cellpadding="0" cellspacing="0" border="0"><tr>';
        activeSocialLinks.forEach(link => {
            if (link.url) {
                const sData = socialsDB.find(s => s.id === link.id);
                if (sData) {
                    t2SocialHTML += `
                        <td style="padding-right: 10px;">
                            <a href="${link.url}" target="_blank" style="display: block;">
                                <div style="background: ${sStyle.bg}; border-radius: ${sStyle.radius}; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                                    <img src="https://img.icons8.com/ios-filled/50/${sStyle.imgColor}/${sData.icon}.png" width="14" height="14" style="display: inline-block; vertical-align: middle; border: 0;">
                                </div>
                            </a>
                        </td>
                    `;
                }
            }
        });
        t2SocialHTML += '</tr></table>';

        html = `
        <div style="${fContact}">
            <table style="width: 420px; max-width: 100%; height: 80px;" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="width: 100%;height: 20px;">
                        <span style="margin: 0;padding: 0;font-size: 16px; color: ${colors.conText}; ${fContact}">Kind regards,</span>
                    </td>
                </tr>
                <tr>
                    <td style="width: 100%;height: 30px;">
                        <span style="margin: 0;padding: 0;font-size: 20px; color: ${colors.name}; ${fName}">${data.name}</span>
                    </td>
                </tr>
                <tr>
                    <td style="width: 100%;height: 20px;">
                        <span style="margin: 0;padding: 0;font-size: 16px; color: ${colors.title}; ${fTitle}">${data.title}</span>
                    </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
            </table>

            <table style="width: 420px; max-width: 100%; height: 120px;" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td align="center" valign="middle" style="width: 35%; height: 120px; text-align: center; vertical-align: middle;">
                        <!-- Bulletproof Centering Table -->
                        <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                            <tr>
                                <td align="center">
                                    <img src="${images.company}" width="${safeCompanyWidth}" style="width: ${safeCompanyWidth}px; max-width: 145px; display: block; border: 0;" alt="logo">
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td style="width: 5%; height: 120px; text-align: center; vertical-align: middle;">
                        <div style="width: 2px; height: 110px; background-color: ${colors.line}; margin: 0 auto;"></div>
                    </td>
                    <td style="width: 60%; height: 120px; vertical-align: middle;">
                        <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
                            <tr><td style="height: 5px;"></td></tr>
                            <tr>
                                <td style="display: block;">
                                    <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
                                        ${t2CustomContacts}
                                    </table>
                                </td>
                            </tr>
                            <tr><td style="height: 5px;"></td></tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table style="width: 420px; max-width: 100%; height: 50px;" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="vertical-align: middle;">${t2SocialHTML}</td>
                </tr>
            </table>
        </div>`;
    }

    // ----------------------------------------------------
    // T3: Vibrant Modern
    // ----------------------------------------------------
    else if (currentTemplate === 3) {
        const safeCompanyWidth1 = Math.min(images.companyWidth, 75);

        let t3SocialHTML = '';
        activeSocialLinks.forEach(link => {
            if (link.url) {
                const sData = socialsDB.find(s => s.id === link.id);
                if(sData) {
                    t3SocialHTML += `
                    <td style="padding-right: 8px;">
                        <a href="${link.url}" style="display: inline-block; padding: 0px;">
                            <div style="background-color: ${sStyle.bg}; border-radius: ${sStyle.radius}; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
                                <img src="https://img.icons8.com/ios-filled/50/${sStyle.imgColor}/${sData.icon}.png" width="12" style="display: block;">
                            </div>
                        </a>
                    </td>`;
                }
            }
        });

        let t3CustomContacts = '';
        activeContacts.forEach(c => {
            if (!c.label) return;
            const db = contactIconsDB[c.type];
            if (!db) return;

            const linkHref = db.isLink ? `${db.prefix}${c.value}` : '#';
            const textHTML = db.isLink
                ? `<a href="${linkHref}" style="text-decoration: none; color: ${colors.conText}; font-size: 10px;"><span>${c.label}</span></a>`
                : `<span style="color: ${colors.conText}; font-size: 10px;"><span>${c.label}</span></span>`;

            t3CustomContacts += `
            <tr height="20" style="vertical-align: middle;">
                <td width="24" style="vertical-align: bottom;">
                    <table cellpadding="0" cellspacing="0" style="vertical-align: -webkit-baseline-middle; font-size: medium; ${fContact}">
                        <tbody>
                            <tr>
                                <td style="vertical-align: bottom;">
                                    <span style="display: inline-block; background-color: ${cStyle.bg}; border-radius: ${cStyle.radius}; width: 16px; height: 16px; text-align: center; line-height: 16px;">
                                        <img src="https://img.icons8.com/ios-filled/50/${cStyle.imgColor}/${db.icon}.png" width="10" style="display: inline-block; vertical-align: middle;">
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td style="padding: 0px; ${fContact}">${textHTML}</td>
            </tr>`;
        });

        html = `
        <table cellpadding="0" cellspacing="0" style="vertical-align: -webkit-baseline-middle; font-size: medium; ${fContact}">
            <tbody>
                <tr>
                    <td bgcolor="${colors.line}" style="padding: 10px; border-radius: 8px;">
                        <table cellpadding="0" cellspacing="0" style="vertical-align: -webkit-baseline-middle; font-size: medium; ${fContact}">
                            <tbody>
                                <tr>
                                    <td width="10"><div></div></td>
                                    <td style="vertical-align: middle;">
                                        <table cellpadding="0" cellspacing="0" style="vertical-align: -webkit-baseline-middle; font-size: medium; ${fContact}">
                                            <tbody>
                                                <tr>
                                                    <td align="center" valign="middle" style="text-align: center; vertical-align: middle;">
                                                        <!-- Bulletproof Centering Table -->
                                                        <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                                                            <tr>
                                                                <td align="center">
                                                                    <img src="${images.company}" width="${safeCompanyWidth1}" style="width: ${safeCompanyWidth1}px; max-width: 75px; display: block; border: 0; object-fit: contain;" alt="logo">
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr><td height="20"></td></tr>
                                                <tr>
                                                    <td style="text-align: center;">
                                                        <table cellpadding="0" cellspacing="0" style="display: inline-block; vertical-align: -webkit-baseline-middle; font-size: medium; ${fContact}">
                                                            <tbody>
                                                                <tr style="text-align: center;">${t3SocialHTML}</tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td width="20"><div></div></td>
                                    <td>
                                        <div style="width: 2px; height: 120px; background-color: ${colors.company};"></div>
                                    </td>
                                    <td width="20"><div></div></td>
                                    <td style="padding: 0px; vertical-align: middle;">
                                        <h2 style="margin: 0px; font-size: 13px; color: ${colors.name}; ${fName}"><span>${data.name}</span></h2>
                                        <div style="width: 100px; height: 1px; background-color: ${colors.company};"></div>
                                        <p style="margin: 0px; color: ${colors.title}; font-size: 11px; line-height: 22px; ${fTitle}"><span>${data.title}</span></p>
                                        <table cellpadding="0" cellspacing="0" style="width: 100%; vertical-align: -webkit-baseline-middle; font-size: medium; ${fContact}">
                                            <tbody><tr><td height="10"></td></tr></tbody>
                                        </table>
                                        <table cellpadding="0" cellspacing="0" style="vertical-align: -webkit-baseline-middle; font-size: medium; ${fContact}">
                                            <tbody>${t3CustomContacts}</tbody>
                                        </table>
                                    </td>
                                    <td width="10"><div></div></td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>`;
    }

    // ----------------------------------------------------
    // T4: Header Banner
    // ----------------------------------------------------
    else if (currentTemplate === 4) {
        let t4SocialHTML = '';
        activeSocialLinks.forEach(link => {
            if (link.url) {
                const sData = socialsDB.find(s => s.id === link.id);
                if(sData) {
                    t4SocialHTML += `
                    <a href="${link.url}" target="_blank" style="display: inline-block; margin-right: 8px;">
                        <div style="background-color: ${sStyle.bg}; border-radius: ${sStyle.radius}; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                            <img src="https://img.icons8.com/ios-filled/50/${sStyle.imgColor}/${sData.icon}.png" width="14" style="display: block;">
                        </div>
                    </a>`;
                }
            }
        });

        let t4CustomContacts = '';
        activeContacts.forEach(c => {
            if (!c.label) return;
            const db = contactIconsDB[c.type];
            if (!db) return;

            const linkHref = db.isLink ? `${db.prefix}${c.value}` : '#';
            const textHTML = db.isLink
                ? `<a href="${linkHref}" style="color: ${colors.conText}; text-decoration: none;" target="_blank">${c.label}</a>`
                : `<span style="color: ${colors.conText};">${c.label}</span>`;

            t4CustomContacts += `
            <tr>
                <td style="width: 100%; height: 25px;">
                    <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td style="width: 10%; vertical-align: middle;">
                                <div style="background-color: ${cStyle.bg}; border-radius: ${cStyle.radius}; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;">
                                    <img src="https://img.icons8.com/ios-filled/50/${cStyle.imgColor}/${db.icon}.png" width="10" style="display: block;">
                                </div>
                            </td>
                            <td style="width: 90%; vertical-align: middle; padding-left: 5px;">
                                <p style="margin: 0; padding: 0; font-size: 12px; ${fContact}">${textHTML}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>`;
        });

        html = `
        <div style="${fContact}">
            <table style="width: 400px; max-width: 100%; height: 70px;" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="width: 100%; height: auto; vertical-align: middle;">
                        <img src="${images.company}" width="${images.companyWidth}" style="display: block; border: none; max-width: 100%;" alt="Logo">
                    </td>
                </tr>
            </table>
            
            <table style="width: 400px; max-width: 100%;" cellpadding="0" cellspacing="0" border="0">
                <tr><td height="5" style="font-size: 1px; line-height: 5px;">&nbsp;</td></tr>
                <tr>
                    <td bgcolor="${colors.line}" height="4" style="font-size: 4px; line-height: 4px; width: 100%;">&nbsp;</td>
                </tr>
                <tr><td height="5" style="font-size: 1px; line-height: 5px;">&nbsp;</td></tr>
            </table>

            <table style="width: 400px; max-width: 100%; margin-top: 10px;" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="width: 46%; vertical-align: top;">
                        <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="width: 100%; height: 30px; vertical-align: middle;">
                                    <span style="margin: 0; padding: 0; font-size: 20px; color: ${colors.name}; ${fName}">${data.name}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 100%; height: 20px; vertical-align: top;">
                                    <span style="margin: 0; padding: 0; font-size: 14px; color: ${colors.title}; ${fTitle}">${data.title}</span><br>
                                    <span style="margin: 0; padding: 0; font-size: 12px; color: ${colors.company}; ${fCompany}">${data.company}</span>
                                </td>
                            </tr>
                            <tr><td style="height: 10px;"></td></tr>
                            <tr>
                                <td style="height: 40px; vertical-align: middle;">${t4SocialHTML}</td>
                            </tr>
                        </table>
                    </td>
                    <td style="width: 54%; vertical-align: top;">
                        <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
                            ${t4CustomContacts}
                        </table>
                    </td>
                </tr>
            </table>
        </div>`;
    }

    // ----------------------------------------------------
    // T5: Corporate Formal
    // ----------------------------------------------------
    else if (currentTemplate === 5) {
        const safeCompanyWidth2 = Math.min(images.companyWidth, 150);

        let t5CustomContacts = '';
        activeContacts.forEach(c => {
            if (!c.label) return;
            const db = contactIconsDB[c.type];
            if (!db) return;

            const linkHref = db.isLink ? `${db.prefix}${c.value}` : '#';
            const textHTML = db.isLink
                ? `<a href="${linkHref}" style="color: ${colors.conText}; text-decoration: none;" target="_blank">${c.label}</a>`
                : `<span style="color: ${colors.conText};">${c.label}</span>`;

            t5CustomContacts += `
            <tr>
                <td style="width: 100%; height: 25px;">
                    <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td style="width: 8%; vertical-align: middle;">
                                <div style="background-color: ${cStyle.bg}; border-radius: ${cStyle.radius}; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;">
                                    <img src="https://img.icons8.com/ios-filled/50/${cStyle.imgColor}/${db.icon}.png" width="10" style="display: block;">
                                </div>
                            </td>
                            <td style="width: 92%; vertical-align: middle; padding-left: 4px;">
                                <p style="margin: 0; padding: 0; font-size: 11px; ${fContact}">${textHTML}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>`;
        });

        let t5SocialHTML = '<table cellpadding="0" cellspacing="0" border="0" style="margin-top: 10px;"><tr>';
        activeSocialLinks.forEach(link => {
            if (link.url) {
                const sData = socialsDB.find(s => s.id === link.id);
                if (sData) {
                    t5SocialHTML += `
                        <td style="padding-right: 8px;">
                            <a href="${link.url}" target="_blank" style="display: block;">
                                <div style="background: ${sStyle.bg}; border-radius: ${sStyle.radius}; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
                                    <img src="https://img.icons8.com/ios-filled/50/${sStyle.imgColor}/${sData.icon}.png" width="12" style="display: block;">
                                </div>
                            </a>
                        </td>`;
                }
            }
        });
        t5SocialHTML += '</tr></table>';

        html = `
        <div style="${fContact}">
            <table width="450" border="0" cellspacing="0" cellpadding="0" align="left" style="max-width:450px;">
                <tbody>
                    <tr>
                        <td valign="top">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tbody>
                                    <tr>
                                        <td align="center" valign="top" width="150" style="width: 150px; text-align: center; vertical-align: top; line-height: 1px;">
                                            <!-- Bulletproof Centering Table -->
                                            <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                                                <tr>
                                                    <td align="center">
                                                        <img src="${images.company}" width="${safeCompanyWidth2}" style="width: ${safeCompanyWidth2}px; max-width: 150px; display: block; border: 0;" alt="logo">
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td width="23" style="font-size:1px; line-height:1px; border:0px; padding:0px; margin:0px;"></td>
                                        <td align="left" valign="top" style="font-size: 13pt; line-height:100%; text-align:left;">
                                            <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td>
                                                        <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
                                                            <tr>
                                                                <td style="width: 100%;">
                                                                    <strong style="color: ${colors.name}; font-size: 16px; ${fName}">${data.name}</strong>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-top: 4px;">
                                                        <span style="font-size: 12px; color: ${colors.title}; ${fTitle}">${data.title}</span><br>
                                                        <span style="font-size: 11px; color: ${colors.company}; ${fCompany}">${data.company}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-top: 8px; padding-bottom: 8px;">
                                                        <hr style="margin: 0; border: none; border-top: 2px solid ${colors.line};">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="display: block;">
                                                        <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
                                                            ${t5CustomContacts}
                                                        </table>
                                                        ${t5SocialHTML}
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr><td height="15" style="font-size:1px; line-height:1px; border:0px; padding:0px; margin:0px;"></td></tr>
                    <tr>
                        <td align="justify">
                            <p style="font-size: 10px; line-height: 1.4; color: #888888; text-align:justify; border-top: 1px solid #E2E8F0; padding-top: 10px; ${fContact}">
                                This e-mail and any attachments may contain confidential and privileged information that
                                is protected from disclosure. Such information is intended only for the sole use of the intended recipient(s).
                                If you have received this communication in error, please notify us immediately by replying to the message 
                                and deleting it from your computer.
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>`;
    }

    // ----------------------------------------------------
    // T6: Banner & Vertical Split
    // ----------------------------------------------------
    else if (currentTemplate === 6) {
        const safeCompanyWidth3 = Math.min(images.companyWidth, 170);
        const safebannerWidth = Math.min(images.bannerWidth, 268);

        let t6CustomContacts = '';
        activeContacts.forEach(c => {
            if (!c.label) return;
            const db = contactIconsDB[c.type];
            if (!db) return;

            const linkHref = db.isLink ? `${db.prefix}${c.value}` : '#';
            const textHTML = db.isLink
                ? `<a href="${linkHref}" style="color: ${colors.conText}; text-decoration: none;" target="_blank">${c.label}</a>`
                : `<span style="color: ${colors.conText};">${c.label}</span>`;

            t6CustomContacts += `
            <tr>
                <td style="width: 100%; height: 23px;">
                    <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td style="width: 20px; vertical-align: middle;">
                                <div style="background-color: ${cStyle.bg}; border-radius: ${cStyle.radius}; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;">
                                    <img src="https://img.icons8.com/ios-filled/50/${cStyle.imgColor}/${db.icon}.png" width="9" style="display: block;">
                                </div>
                            </td>
                            <td style="vertical-align: middle; padding-left: 5px;">
                                <p style="margin: 0; padding: 0; font-size: 13px; ${fContact}">${textHTML}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>`;
        });

        let t6SocialHTML = '<table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;"><tr>';
        activeSocialLinks.forEach(link => {
            if (link.url) {
                const sData = socialsDB.find(s => s.id === link.id);
                if (sData) {
                    t6SocialHTML += `
                    <td style="padding: 0 4px;">
                        <a href="${link.url}" target="_blank" style="display: block;">
                            <div style="background-color: ${sStyle.bg}; border-radius: ${sStyle.radius}; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                                <img src="https://img.icons8.com/ios-filled/50/${sStyle.imgColor}/${sData.icon}.png" width="14" style="display: block;">
                            </div>
                        </a>
                    </td>`;
                }
            }
        });
        t6SocialHTML += '</tr></table>';

        const bannerSection = images.banner ? `
        <table style="width: 450px; max-width: 100%; margin-top: 15px; border: 2px solid ${colors.line};" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td align="center" valign="middle" style="width: 60%; text-align: center; vertical-align: middle;">
                    <!-- Bulletproof Centering Table -->
                    <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto; width: 100%;">
                        <tr>
                            <td align="center">
                                <img src="${images.banner}" width="${safebannerWidth}" height="80" style="width: 100%; max-width: ${safebannerWidth}px; height: 80px; display: block; border: 0;" alt="Banner">
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="width: 40%; background: #ffffff; text-align: center; vertical-align: middle; padding: 10px;">
                    ${t6SocialHTML}
                    <table align="center" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-top: 10px;">
                        <tr>
                            <td align="center" valign="middle" style="text-align: center; font-size: 12px; font-weight: bold; color: ${colors.company}; ${fCompany}">
                                <p align="center" style="margin: 10px 0 0 0; padding: 0; font-size: 12px; font-weight: bold; text-align: center; color: ${colors.company}; ${fCompany}">
                                    ${data.company}
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>` : '';

        html = `
        <div style="${fContact}">
            <table style="width: 450px; max-width: 100%; min-height: 150px;" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <!-- Left side: Logo -->
                    <td align="center" valign="middle" style="width: 40%; text-align: center; vertical-align: middle; padding-right: 10px;">
                        <!-- Bulletproof Centering Table -->
                        <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                            <tr>
                                <td align="center">
                                    <img src="${images.company}" width="${safeCompanyWidth3}" style="width: ${safeCompanyWidth3}px; max-width: 100%; display: block; border: 0;" alt="logo">
                                </td>
                            </tr>
                        </table>
                    </td>

                    <!-- Spacing / Vertical Line -->
                    <td style="width: 4%; vertical-align: middle; text-align: center;">
                        <div style="width: 2px; height: 120px; background-color: ${colors.line}; margin: 0 auto;"></div>
                    </td>

                    <!-- Right side: Details -->
                    <td style="width: 56%; vertical-align: middle; padding-left: 10px;">
                        <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td>
                                    <h1 style="margin: 0; padding: 0; font-size: 16px; color: ${colors.name}; ${fName}">${data.name}</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-top: 4px;">
                                    <h3 style="margin: 0; padding: 0; font-size: 14px; color: ${colors.title}; ${fTitle}">${data.title}</h3>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-top: 8px; padding-bottom: 8px;">
                                    <div style="height: 2px; width: 100%; background-color: ${colors.line};"></div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
                                        ${t6CustomContacts}
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- Dynamic Banner Section -->
            ${bannerSection}
        </div>`;
    }

    // ----------------------------------------------------
    // T7: Profile, Details, Logo & Call-to-Action Button
    // ----------------------------------------------------
    else if (currentTemplate === 7) {
        const safeprofileWidth = Math.min(images.profileWidth, 108);
        const safecompanyWidth4 = Math.min(images.companyWidth, 94);

        let t7CustomContacts = '';

        // --- default button ---
        let buttonLabel = "CTA Button"; 
        let buttonUrl = "#"; 
        let hasButton = false;

        activeContacts.forEach(c => {
            if (!c.label) return;

            // --- CTA Button ---
            if (c.type === 'ctaButton') {
                buttonLabel = c.label;
                buttonUrl = `${contactIconsDB['ctaButton'].prefix}${c.value}`;
                hasButton = true;
                return;
            }

            const db = contactIconsDB[c.type];
            if (!db) return;

            const linkHref = db.isLink ? `${db.prefix}${c.value}` : '#';
            const textHTML = db.isLink
                ? `<a href="${linkHref}" style="color: ${colors.conText}; text-decoration: none;" target="_blank">${c.label}</a>`
                : `<span style="color: ${colors.conText};">${c.label}</span>`;

            t7CustomContacts += `
            <tr>
                <td style="width: 100%; height: 24px;">
                    <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td style="width: 18px; vertical-align: middle;">
                                <div style="background-color: ${cStyle.bg}; border-radius: ${cStyle.radius}; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center;">
                                    <img src="https://img.icons8.com/ios-filled/50/${cStyle.imgColor}/${db.icon}.png" width="8" style="display: block;">
                                </div>
                            </td>
                            <td style="vertical-align: middle; padding-left: 5px;">
                                <p style="margin: 0; padding: 0; font-size: 11px; ${fContact}">${textHTML}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>`;
        });

        let t7SocialHTML = '<table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;"><tr>';
        activeSocialLinks.forEach(link => {
            if (link.url) {
                const sData = socialsDB.find(s => s.id === link.id);
                if (sData) {
                    t7SocialHTML += `
                    <td style="padding: 0 4px;">
                        <a href="${link.url}" target="_blank" style="display: block;">
                            <div style="background-color: ${sStyle.bg}; border-radius: ${sStyle.radius}; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">
                                <img src="https://img.icons8.com/ios-filled/50/${sStyle.imgColor}/${sData.icon}.png" width="12" style="display: block;">
                            </div>
                        </a>
                    </td>`;
                }
            }
        });
        t7SocialHTML += '</tr></table>';

        const buttonHTML = hasButton ? `
            <a href="${buttonUrl}" target="_blank" style="display: inline-block; background-color: ${colors.line}; color: #ffffff; padding: 8px 14px; border-radius: 4px; text-decoration: none; font-size: 11px; font-weight: bold; ${fContact}">
                ${buttonLabel}
            </a>
        ` : '';

        html = `
        <div style="${fContact}">
            <table style="width: 400px; max-width: 100%; height: 160px;" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <!-- Left side: Profile & Socials -->
                    <td style="width: 27%; vertical-align: middle; text-align: center;">
                        <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td align="center" valign="middle" style="text-align: center; padding-bottom: 12px;">
                                    <!-- Bulletproof Centering Table -->
                                    <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                                        <tr>
                                            <td align="center">
                                                <img src="${images.profile}" width="${safeprofileWidth || 90}" style="width: ${safeprofileWidth || 90}px; max-width: 100%; border-radius: 50%; display: block; border: 0; object-fit: cover;" alt="Profile">
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: center;">
                                    ${t7SocialHTML}
                                </td>
                            </tr>
                        </table>
                    </td>
                    
                    <!-- Divider -->
                    <td style="width: 4%; vertical-align: middle; text-align: center;">
                        <div style="width: 2px; height: 130px; background-color: ${colors.company}; margin: 0 auto;"></div>
                    </td>

                    <!-- Middle side: Details -->
                    <td style="width: 43%; vertical-align: middle; padding-left: 10px;">
                        <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="padding-bottom: 2px;">
                                    <h2 style="margin: 0; padding: 0; color: ${colors.name}; font-size: 16px; ${fName}">${data.name}</h2>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-bottom: 10px;">
                                    <h3 style="margin: 0; padding: 0; color: ${colors.title}; font-size: 13px; ${fTitle}">${data.title}</h3>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
                                        ${t7CustomContacts}
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>

                    <!-- Right side: Logo & Button -->
                    <td style="width: 26%; vertical-align: middle; text-align: center; padding-left: 10px;">
                        <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td align="center" valign="middle" style="text-align: center; padding-bottom: 15px;">
                                    <!-- Bulletproof Centering Table -->
                                    <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                                        <tr>
                                            <td align="center">
                                                <img src="${images.company}" width="${safecompanyWidth4}" style="width: ${safecompanyWidth4}px; max-width: 100%; display: block; border: 0; object-fit: contain;" alt="Logo">
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: center;">                                    
                                    <a href="${buttonUrl}" target="_blank" style="display: inline-block; background-color: ${colors.line}; color: #ffffff; padding: 8px 14px; border-radius: 4px; text-decoration: none; font-size: 11px; font-weight: bold; ${fContact}">
                                    ${buttonLabel}
                                    </a>
                                    
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- Disclaimer -->
            <table style="width: 400px; max-width: 100%; margin-top: 15px;" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="border-top: 1px solid #E2E8F0; padding-top: 10px;">
                        <h2 style="font-size: 11px; margin: 0 0 5px 0; color: #888888; ${fContact}">
                            Important: Coverages are not bound or accepted through email unless you receive a confirmation from an employee or agent of ${data.company}.
                        </h2>
                        <p style="font-size: 10px; margin: 0; line-height: 1.3; color: #888888; text-align: justify; ${fContact}">
                            This e-mail and any attachments may contain confidential and privileged information that is protected from disclosure. Such information is intended only for the sole use of the intended recipient(s). If you have received this communication in error, please notify us immediately by replying to the message and deleting it from your computer.
                        </p>
                    </td>
                </tr>
            </table>
        </div>`;
    }

    return html;
};