import { useState } from 'react';
import { useSignatureStore } from '../../store/useSignatureStore';
import { contactIconsDB } from '../../utils/constants';

export default function ContactManager() {
    const { activeContacts, addContact, removeContact, updateContact, moveContact, customContacts } = useSignatureStore();

    // Merge default contacts with any custom/updated contacts from Admin
    const allContactsDB = { ...contactIconsDB };
    (customContacts || []).forEach(cc => {
        allContactsDB[cc.key] = { ...allContactsDB[cc.key], ...cc };
    });

    // Local state for the "Add Contact" input fields
    const [newType, setNewType] = useState('phone');
    const [newLabel, setNewLabel] = useState('');
    const [newValue, setNewValue] = useState('');

    const handleAdd = () => {
        const label = newLabel.trim();
        const val = newValue.trim() || label;

        if (activeContacts.length >= 6) {
            alert("To keep your signature looking professional, you can only add up to 6 contacts.");
            return;
        }

        if (label) {
            addContact({ type: newType, label, value: val });
            setNewLabel('');
            setNewValue('');
        } else {
            alert("Please enter some Display Text for your contact.");
        }
    };

    return (
        <>
            <h3 style={{ marginTop: '24px' }}>Contact Info</h3>

            {/* Input Row */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <select
                    style={{ width: 'auto' }}
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                >
                    {Object.entries(allContactsDB).map(([k, c]) => (
                        <option key={k} value={k}>{c.name}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Display text..."
                    style={{ flex: 1 }}
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <input
                    type="text"
                    placeholder="Link/URL..."
                    style={{ flex: 1 }}
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button className="btn" style={{ width: 'auto' }} onClick={handleAdd}>Add</button>
            </div>

            {/* Render Active Contacts */}
            <div className="active-list">
                {activeContacts.map((contact, index) => {
                    const iconData = allContactsDB[contact.type] || contactIconsDB[contact.type];
                    const iconUrl = iconData?.cloudinaryIconUrl || `https://img.icons8.com/ios-filled/50/ffffff/${iconData?.icon || 'link'}.png`;

                    return (
                        <div className="list-row" key={`${contact.type}-${index}`}>
                            <div style={{ background: '#475569', borderRadius: '6px', padding: '4px', display: 'flex' }} title={iconData?.name}>
                                <img src={iconUrl} style={{ width: '16px', height: '16px' }} alt="icon" />
                            </div>

                            <input
                                type="text"
                                placeholder="Display Text"
                                value={contact.label}
                                onChange={(e) => updateContact(index, 'label', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Link/URL"
                                value={contact.value}
                                onChange={(e) => updateContact(index, 'value', e.target.value)}
                            />

                            <div className="action-group">
                                <button
                                    className="icon-btn"
                                    title="Move Up"
                                    onClick={() => moveContact(index, -1)}
                                    disabled={index === 0}
                                >↑</button>
                                <button
                                    className="icon-btn"
                                    title="Move Down"
                                    onClick={() => moveContact(index, 1)}
                                    disabled={index === activeContacts.length - 1}
                                >↓</button>
                                <button
                                    className="remove-btn"
                                    title="Remove"
                                    onClick={() => removeContact(index)}
                                >X</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}