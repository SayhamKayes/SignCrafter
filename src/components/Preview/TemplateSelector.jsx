import { useSignatureStore } from '../../store/useSignatureStore';

export default function TemplateSelector() {
    const { currentTemplate, setTemplate } = useSignatureStore();

    const templates = [
        { id: 1, name: 'Executive Minimal' },
        { id: 2, name: 'Professional Split' },
        { id: 3, name: 'Vibrant Modern' },
        { id: 4, name: 'Header Banner' },
        { id: 5, name: 'Corporate Formal' },
        { id: 6, name: 'Business Promotional' },
        { id: 7, name: 'Personal Portfolio' },
    ];

    // A fallback image just in case your local assets aren't hooked up yet
    const fallbackImg = "https://ui-avatars.com/api/?name=T&background=E2E8F0&color=94A3B8&size=100";

    return (
        <>
            <h2>Select Template</h2>
            <div className="template-selector">
                {templates.map((tpl) => (
                    <button
                        key={tpl.id}
                        className={`template-btn ${currentTemplate === tpl.id ? 'active' : ''}`}
                        onClick={() => setTemplate(tpl.id)}
                    >
                        <img
                            src={`./templates/preview-${tpl.id}.png`}
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