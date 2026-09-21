import { useSignatureStore } from '../../store/useSignatureStore';

export default function TemplateSelector() {
    const { currentTemplate, setTemplate, customTemplates } = useSignatureStore();

    const builtInTemplates = [
        { id: 1, name: 'Executive Minimal', preview: './templates/preview-1.png' },
        { id: 2, name: 'Professional Split', preview: './templates/preview-2.png' },
        { id: 3, name: 'Vibrant Modern', preview: './templates/preview-3.png' },
        { id: 4, name: 'Header Banner', preview: './templates/preview-4.png' },
        { id: 5, name: 'Corporate Formal', preview: './templates/preview-5.png' },
        { id: 6, name: 'Business Promotional', preview: './templates/preview-6.png' },
        { id: 7, name: 'Personal Portfolio', preview: './templates/preview-7.png' },
    ];

    const allTemplates = [
        ...builtInTemplates,
        ...(customTemplates || []).map(ct => ({
            id: ct.id,
            name: ct.name,
            preview: ct.preview || './templates/preview-1.png',
            isCustom: true
        }))
    ];

    // A fallback image just in case your local assets aren't hooked up yet
    const fallbackImg = "https://ui-avatars.com/api/?name=T&background=E2E8F0&color=94A3B8&size=100";

    return (
        <>
            <h2>Select Template</h2>
            <div className="template-selector">
                {allTemplates.map((tpl) => (
                    <button
                        key={tpl.id}
                        className={`template-btn ${String(currentTemplate) === String(tpl.id) ? 'active' : ''}`}
                        onClick={() => setTemplate(tpl.id)}
                    >
                        <img
                            src={tpl.preview}
                            alt={tpl.name}
                            className="template-img"
                            onError={(e) => { e.target.onerror = null; e.target.src = fallbackImg; }}
                        />
                        <span>{tpl.name}</span>
                    </button>
                ))}
            </div>
        </>
    );
}