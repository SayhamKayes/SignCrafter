import { useSignatureStore } from '../../store/useSignatureStore';
import { socialsDB } from '../../utils/constants';

export default function SocialManager() {
    const { activeSocialLinks, addSocial, removeSocial, updateSocialUrl, moveSocial } = useSignatureStore();

    return (
        <>
            <h2 style={{ marginTop: '24px' }}>Social Media</h2>

            {/* Social Gallery (Click to Add) */}
            <div className="social-gallery">
                {socialsDB.map(s => (
                    <button
                        key={s.id}
                        className="social-btn"
                        style={{ backgroundColor: s.color }}
                        onClick={() => addSocial(s.id)}
                        title={`Add ${s.name}`}
                    >
                        <img src={`https://img.icons8.com/ios-filled/50/ffffff/${s.icon}.png`} alt={s.name} />
                    </button>
                ))}
            </div>

            {/* Active Social Links */}
            <div className="active-list" style={{ marginTop: '16px' }}>
                {activeSocialLinks.map((link, index) => {
                    const sData = socialsDB.find(s => s.id === link.id);
                    if (!sData) return null; // Safety check

                    return (
                        <div className="list-row" key={`${link.id}-${index}`}>
                            <div style={{ background: sData.color, borderRadius: '6px', padding: '4px', display: 'flex' }}>
                                <img src={`https://img.icons8.com/ios-filled/50/ffffff/${sData.icon}.png`} style={{ width: '16px', height: '16px' }} alt="icon" />
                            </div>

                            <input
                                type="text"
                                placeholder={`${sData.name} URL`}
                                value={link.url}
                                onChange={(e) => updateSocialUrl(index, e.target.value)}
                            />

                            <div className="action-group">
                                <button
                                    className="icon-btn"
                                    title="Move Left in Signature"
                                    onClick={() => moveSocial(index, -1)}
                                    disabled={index === 0}
                                >↑</button>
                                <button
                                    className="icon-btn"
                                    title="Move Right in Signature"
                                    onClick={() => moveSocial(index, 1)}
                                    disabled={index === activeSocialLinks.length - 1}
                                >↓</button>
                                <button
                                    className="remove-btn"
                                    title="Remove"
                                    onClick={() => removeSocial(index)}
                                >X</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}