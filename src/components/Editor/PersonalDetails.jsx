import { useSignatureStore } from '../../store/useSignatureStore';

export default function PersonalDetails() {
    const { personalDetails, updatePersonalDetails } = useSignatureStore();

    const handleChange = (e) => {
        updatePersonalDetails(e.target.name, e.target.value);
    };

    return (
        <>
            <h2>Personal Details</h2>
            <div className="form-grid">
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={personalDetails.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Job Title</label>
                    <input
                        type="text"
                        name="title"
                        value={personalDetails.title}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group full">
                    <label>Company</label>
                    <input
                        type="text"
                        name="company"
                        value={personalDetails.company}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </>
    );
}