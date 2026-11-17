import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Building2,
  User,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createStartup } from '../services/api';

const DOMAINS = ['FinTech', 'EdTech', 'AgriTech', 'HealthTech', 'AI/ML', 'CleanTech', 'SaaS'];
const FUNDING_STAGES = ['Bootstrapped', 'Pre-Seed', 'Seed', 'Series A', 'Series B+'];

const initialForm = {
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

const validateForm = (form) => {
  const errors = {};

  if (!form.name.trim()) errors.name = 'Startup name is required';
  if (!form.founderName.trim()) errors.founderName = 'Founder name is required';

  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (form.website.trim() && !/^https?:\/\/.+/i.test(form.website.trim())) {
    errors.website = 'Website must start with http:// or https://';
  }

  if (!form.domain) errors.domain = 'Domain is required';
  if (!form.fundingStage) errors.fundingStage = 'Funding stage is required';

  if (form.foundedYear) {
    const year = parseInt(form.foundedYear, 10);
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
      errors.foundedYear = `Year must be between 1900 and ${new Date().getFullYear()}`;
    }
  }

  if (form.teamSize) {
    const size = parseInt(form.teamSize, 10);
    if (isNaN(size) || size < 1) {
      errors.teamSize = 'Team size must be at least 1';
    }
  }

  return errors;
};

const InputField = ({ label, icon: Icon, error, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
      {Icon && <Icon className="w-4 h-4 text-gray-400" />}
      {label}
    </label>
    {children}
    {error && (
      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5" />
        {error}
      </p>
    )}
  </div>
);

const inputClasses = (hasError) =>
  `w-full px-3 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
    hasError ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
  }`;

const StartupRegisterPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        tagline: form.tagline.trim(),
        description: form.description.trim(),
        founderName: form.founderName.trim(),
        email: form.email.trim(),
        website: form.website.trim(),
        domain: form.domain,
        fundingStage: form.fundingStage,
        location: {
          city: form.city.trim(),
          state: form.state.trim(),
        },
        foundedYear: form.foundedYear ? parseInt(form.foundedYear, 10) : undefined,
        teamSize: form.teamSize ? parseInt(form.teamSize, 10) : undefined,
        dpiitNumber: form.dpiitNumber.trim(),
      };

      const res = await createStartup(payload);
      const data = res.data || res;
      const newId = data._id || data.id;
      navigate(`/startup/${newId}`);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || err.message || 'Failed to register startup. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Register Your Startup</h1>
          </div>
          <p className="text-gray-500 ml-13">
            Fill in the details to get your startup listed on the platform
          </p>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-red-800">Registration Failed</h4>
              <p className="text-sm text-red-700 mt-0.5">{submitError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Section 1: Basic Info */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Startup Information
            </h2>
            <div className="space-y-4">
              <InputField label="Startup Name *" icon={Building2} error={errors.name}>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. InnovateTech Solutions"
                  className={inputClasses(errors.name)}
                />
              </InputField>

              <InputField label="Tagline" icon={Briefcase} error={errors.tagline}>
                <input
                  type="text"
                  name="tagline"
                  value={form.tagline}
                  onChange={handleChange}
                  placeholder="A brief one-liner about your startup"
                  className={inputClasses(errors.tagline)}
                />
              </InputField>

              <InputField label="Description" icon={Briefcase} error={errors.description}>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe what your startup does, the problem you solve, and your vision"
                  className={inputClasses(errors.description)}
                />
              </InputField>
            </div>
          </div>

          {/* Section 2: Founder & Contact */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Founder & Contact
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Founder Name *" icon={User} error={errors.founderName}>
                <input
                  type="text"
                  name="founderName"
                  value={form.founderName}
                  onChange={handleChange}
                  placeholder="Full name of the founder"
                  className={inputClasses(errors.founderName)}
                />
              </InputField>

              <InputField label="Email *" icon={Mail} error={errors.email}>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="founder@startup.com"
                  className={inputClasses(errors.email)}
                />
              </InputField>

              <div className="sm:col-span-2">
                <InputField label="Website" icon={Globe} error={errors.website}>
                  <input
                    type="url"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://www.yourstartup.com"
                    className={inputClasses(errors.website)}
                  />
                </InputField>
              </div>
            </div>
          </div>

          {/* Section 3: Domain & Stage */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Domain & Funding
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Domain *" icon={Briefcase} error={errors.domain}>
                <select
                  name="domain"
                  value={form.domain}
                  onChange={handleChange}
                  className={inputClasses(errors.domain)}
                >
                  <option value="">Select domain</option>
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </InputField>

              <InputField label="Funding Stage *" icon={Briefcase} error={errors.fundingStage}>
                <select
                  name="fundingStage"
                  value={form.fundingStage}
                  onChange={handleChange}
                  className={inputClasses(errors.fundingStage)}
                >
                  <option value="">Select funding stage</option>
                  {FUNDING_STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </InputField>
            </div>
          </div>

          {/* Section 4: Location & Details */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Location & Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="City" icon={MapPin} error={errors.city}>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore"
                  className={inputClasses(errors.city)}
                />
              </InputField>

              <InputField label="State" icon={MapPin} error={errors.state}>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="e.g. Karnataka"
                  className={inputClasses(errors.state)}
                />
              </InputField>

              <InputField label="Founded Year" icon={Calendar} error={errors.foundedYear}>
                <input
                  type="number"
                  name="foundedYear"
                  value={form.foundedYear}
                  onChange={handleChange}
                  placeholder={`e.g. ${new Date().getFullYear()}`}
                  min="1900"
                  max={new Date().getFullYear()}
                  className={inputClasses(errors.foundedYear)}
                />
              </InputField>

              <InputField label="Team Size" icon={Users} error={errors.teamSize}>
                <input
                  type="number"
                  name="teamSize"
                  value={form.teamSize}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  min="1"
                  className={inputClasses(errors.teamSize)}
                />
              </InputField>

              <div className="sm:col-span-2">
                <InputField label="DPIIT Recognition Number" icon={Briefcase} error={errors.dpiitNumber}>
                  <input
                    type="text"
                    name="dpiitNumber"
                    value={form.dpiitNumber}
                    onChange={handleChange}
                    placeholder="e.g. DIPP12345"
                    className={inputClasses(errors.dpiitNumber)}
                  />
                </InputField>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registering…
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Register Startup
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartupRegisterPage;
