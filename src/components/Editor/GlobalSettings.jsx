import { useSignatureStore } from '../../store/useSignatureStore';

export default function GlobalSettings() {
    const { colors, updateColor, iconStyles, updateIconStyle } = useSignatureStore();

    return (
        <>
            <h2>Global Settings</h2>

            <h3>Color Palette</h3>
            <div className="color-grid">
                <div className="form-group">
                    <label>Name</label>
                    <input type="color" value={colors.name} onChange={(e) => updateColor('name', e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Title</label>
                    <input type="color" value={colors.title} onChange={(e) => updateColor('title', e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Company/Lines</label>
                    <input type="color" value={colors.company} onChange={(e) => updateColor('company', e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Lines/Borders/Backgrounds</label>
                    <input type="color" value={colors.line} onChange={(e) => updateColor('line', e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Contact Icons</label>
                    <input type="color" value={colors.conIcon} onChange={(e) => updateColor('conIcon', e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Contact Text</label>
                    <input type="color" value={colors.conText} onChange={(e) => updateColor('conText', e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Social Icons</label>
                    <input type="color" value={colors.social} onChange={(e) => updateColor('social', e.target.value)} />
                </div>
            </div>

            <h3 style={{ marginTop: '24px' }}>Icon Styling</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Social Icon Shape</label>
                    <select value={iconStyles.socialStyle} onChange={(e) => updateIconStyle('socialStyle', e.target.value)}>
                        <option value="square">Square</option>
                        <option value="rounded">Rounded</option>
                        <option value="circle">Circle</option>
                        <option value="transparent">Transparent</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Contact Icon Shape</label>
                    <select value={iconStyles.contactStyle} onChange={(e) => updateIconStyle('contactStyle', e.target.value)}>
                        <option value="square">Square</option>
                        <option value="rounded">Rounded</option>
                        <option value="circle">Circle</option>
                        <option value="transparent">Transparent</option>
                    </select>
                </div>
            </div>
        </>
    );
}