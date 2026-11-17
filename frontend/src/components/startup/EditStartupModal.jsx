import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const DOMAIN_OPTIONS = ['FinTech', 'EdTech', 'AgriTech', 'HealthTech', 'AI/ML', 'CleanTech', 'SaaS'];
const FUNDING_OPTIONS = ['Bootstrapped', 'Pre-Seed', 'Seed', 'Series A', 'Series B+'];
const STATE_OPTIONS = ['Rajasthan', 'Karnataka', 'Maharashtra', 'Delhi', 'Telangana', 'Gujarat', 'Tamil Nadu', 'Kerala'];

const initialFormState = {
  name: '',
  tagline: '',
  description: '',
  founderName: '',
  email: '',
  website: '',
  domain: '',
  fundingStage: '',
  city: '',
  state: '',
  foundedYear: '',
  teamSize: '',
  dpiitNumber: '',
};

const EditStartupModal = ({ startup, isOpen, onClose, onSave }) => {
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    if (startup && isOpen) {
      setForm({
        name: startup.name || '',
        tagline: startup.tagline || '',
        description: startup.description || '',
        founderName: startup.founderName || '',
        email: startup.email || '',
        website: startup.website || '',
        domain: startup.domain || '',
        fundingStage: startup.fundingStage || '',
        city: startup.location?.city || '',
        state: startup.location?.state || '',
        foundedYear: startup.foundedYear || '',
        teamSize: startup.teamSize || '',
        dpiitNumber: startup.dpiitNumber || '',
      });
    }
  }, [startup, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      location: { city: form.city, state: form.state },
      foundedYear: form.foundedYear ? Number(form.foundedYear) : undefined,
      teamSize: form.teamSize ? Number(form.teamSize) : undefined,
    };
    delete payload.city;
    delete payload.state;
    onSave(payload);
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal card */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Edit Startup Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="edit-name">Startup Name *</label>
              <input id="edit-name" name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Startup name" />
            </div>
            <div>
              <label className={labelClass} htmlFor="edit-founderName">Founder Name</label>
              <input id="edit-founderName" name="founderName" value={form.founderName} onChange={handleChange} className={inputClass} placeholder="Founder name" />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="edit-tagline">Tagline</label>
            <input id="edit-tagline" name="tagline" value={form.tagline} onChange={handleChange} className={inputClass} placeholder="A short tagline" />
          </div>

          <div>
            <label className={labelClass} htmlFor="edit-description">Description</label>
            <textarea id="edit-description" name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass} placeholder="Describe your startup" />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="edit-email">Email</label>
              <input id="edit-email" name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="contact@startup.com" />
            </div>
            <div>
              <label className={labelClass} htmlFor="edit-website">Website</label>
              <input id="edit-website" name="website" type="url" value={form.website} onChange={handleChange} className={inputClass} placeholder="https://startup.com" />
            </div>
          </div>

          {/* Row 3 — Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="edit-domain">Domain</label>
              <select id="edit-domain" name="domain" value={form.domain} onChange={handleChange} className={inputClass}>
                <option value="">Select domain</option>
                {DOMAIN_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="edit-fundingStage">Funding Stage</label>
              <select id="edit-fundingStage" name="fundingStage" value={form.fundingStage} onChange={handleChange} className={inputClass}>
                <option value="">Select stage</option>
                {FUNDING_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4 — Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="edit-city">City</label>
              <input id="edit-city" name="city" value={form.city} onChange={handleChange} className={inputClass} placeholder="City" />
            </div>
            <div>
              <label className={labelClass} htmlFor="edit-state">State</label>
              <select id="edit-state" name="state" value={form.state} onChange={handleChange} className={inputClass}>
                <option value="">Select state</option>
                {STATE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5 — Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass} htmlFor="edit-foundedYear">Founded Year</label>
              <input id="edit-foundedYear" name="foundedYear" type="number" min="1900" max="2099" value={form.foundedYear} onChange={handleChange} className={inputClass} placeholder="2024" />
            </div>
            <div>
              <label className={labelClass} htmlFor="edit-teamSize">Team Size</label>
              <input id="edit-teamSize" name="teamSize" type="number" min="1" value={form.teamSize} onChange={handleChange} className={inputClass} placeholder="10" />
            </div>
            <div>
              <label className={labelClass} htmlFor="edit-dpiitNumber">DPIIT Number</label>
              <input id="edit-dpiitNumber" name="dpiitNumber" value={form.dpiitNumber} onChange={handleChange} className={inputClass} placeholder="DPIIT12345" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStartupModal;
