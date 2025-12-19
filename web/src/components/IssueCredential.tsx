import React, { useState } from 'react';
import './IssueCredential.css';

interface IssueCredentialProps {
  userAddress: string;
}

function IssueCredential({ userAddress }: IssueCredentialProps) {
  const [formData, setFormData] = useState({
    studentAddress: '',
    institutionId: '0',
    credentialType: '',
    credentialData: '',
    metadataUri: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validate inputs
      if (!formData.studentAddress.startsWith('SP') && !formData.studentAddress.startsWith('SM')) {
        throw new Error('Invalid Stacks address');
      }

      if (!formData.credentialType.trim()) {
        throw new Error('Credential type is required');
      }

      if (!formData.credentialData.trim()) {
        throw new Error('Credential data is required');
      }

      // In a real app, this would call the smart contract
      // For now, we'll show a success message
      setMessage({
        type: 'success',
        text: `Credential issued successfully! Hash: ${Math.random().toString(16).slice(2)}`,
      });

      // Reset form
      setFormData({
        studentAddress: '',
        institutionId: '0',
        credentialType: '',
        credentialData: '',
        metadataUri: '',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to issue credential',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="issue-credential">
      <h2>Issue Credential</h2>
      <p className="subtitle">Create a new credential on the blockchain</p>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="studentAddress">Student Address *</label>
          <input
            type="text"
            id="studentAddress"
            name="studentAddress"
            placeholder="SP2J6ZY48GV6RRZRVXF44FYRSTCG9KJDM3NZ8KXY"
            value={formData.studentAddress}
            onChange={handleChange}
            required
          />
          <small>Stacks address of the student</small>
        </div>

        <div className="form-group">
          <label htmlFor="institutionId">Institution ID *</label>
          <input
            type="number"
            id="institutionId"
            name="institutionId"
            value={formData.institutionId}
            onChange={handleChange}
            min="0"
            required
          />
          <small>ID of the issuing institution</small>
        </div>

        <div className="form-group">
          <label htmlFor="credentialType">Credential Type *</label>
          <input
            type="text"
            id="credentialType"
            name="credentialType"
            placeholder="Bachelor of Science in Computer Science"
            value={formData.credentialType}
            onChange={handleChange}
            required
          />
          <small>Type of credential (e.g., degree, certificate)</small>
        </div>

        <div className="form-group">
          <label htmlFor="credentialData">Credential Data *</label>
          <textarea
            id="credentialData"
            name="credentialData"
            placeholder="Student: John Doe, Program: BSc CS, Year: 2024, Grade: A"
            value={formData.credentialData}
            onChange={handleChange}
            rows={4}
            required
          />
          <small>Credential details (will be hashed)</small>
        </div>

        <div className="form-group">
          <label htmlFor="metadataUri">Metadata URI</label>
          <input
            type="url"
            id="metadataUri"
            name="metadataUri"
            placeholder="https://metadata.example.com/credential-001"
            value={formData.metadataUri}
            onChange={handleChange}
          />
          <small>URI to credential metadata (optional)</small>
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Issuing...' : '🎓 Issue Credential'}
        </button>
      </form>

      <div className="info-box">
        <h3>ℹ️ How it works</h3>
        <ol>
          <li>Enter student's Stacks address</li>
          <li>Provide credential details</li>
          <li>Click "Issue Credential"</li>
          <li>Credential is stored on blockchain</li>
          <li>SHA-256 hash is generated</li>
          <li>Event is tracked in Chainhooks</li>
        </ol>
      </div>
    </div>
  );
}

export default IssueCredential;
