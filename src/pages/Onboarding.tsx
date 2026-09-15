import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, UploadCloud } from 'lucide-react';
import { api, ApiError } from '../lib/api';

type DashboardOrderStatus = { order: { status: string } | null };

const initialForm = {
  companyName: '',
  businessType: '',
  websiteUrl: '',
  instagram: '',
  primaryGoal: '',
  targetAudience: '',
  brandColors: '',
  additionalNotes: '',
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [logo, setLogo] = useState<File | null>(null);
  const [brandAssets, setBrandAssets] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    api
      .get<DashboardOrderStatus>('/dashboard')
      .then((data) => {
        if (data.order?.status !== 'PAID') {
          navigate('/plans', { replace: true });
          return;
        }
        setCheckingAccess(false);
      })
      .catch(() => navigate('/plans', { replace: true }));
  }, [navigate]);

  const update = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (logo) formData.append('logo', logo);
      brandAssets.forEach((file) => formData.append('brandAssets', file));

      await api.postForm('/onboarding', formData);
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not submit your information. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAccess) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading…</div>;
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle2 size={64} className="text-emerald-500 mx-auto" />
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900 mt-5">
            You&apos;re set — status: Deployment Ready
          </h1>
          <p className="text-slate-500 mt-3 text-[15px]">
            Our team has everything needed to start deploying your system. Track progress from your dashboard.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-7 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold px-7 py-3.5 rounded-full transition-all"
          >
            Go to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ASTER-50/60 via-white to-white py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display font-extrabold text-3xl text-ink-900">Let&apos;s set up your system</h1>
        <p className="text-slate-500 mt-2">Tell us about your business so we can deploy the right system for you.</p>

        <form onSubmit={onSubmit} className="mt-8 bg-white rounded-[28px] card-shadow border border-ASTER-100 p-7 sm:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Company name" required value={form.companyName} onChange={update('companyName')} />
            <Field label="Business type" required value={form.businessType} onChange={update('businessType')} placeholder="e.g. Retail, SaaS, Services" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Website URL" value={form.websiteUrl} onChange={update('websiteUrl')} placeholder="https://" />
            <Field label="Instagram" value={form.instagram} onChange={update('instagram')} placeholder="@yourbrand" />
          </div>
          <Field label="Primary goal" required value={form.primaryGoal} onChange={update('primaryGoal')} placeholder="What should this system achieve first?" />
          <Field label="Target audience" required value={form.targetAudience} onChange={update('targetAudience')} placeholder="Who are you building this for?" />
          <Field label="Brand colors" value={form.brandColors} onChange={update('brandColors')} placeholder="e.g. #5b2ee5, #d8ff3e" />

          <div className="grid sm:grid-cols-2 gap-5">
            <FileField
              label="Upload logo"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={(files) => setLogo(files[0] ?? null)}
              hint={logo?.name}
            />
            <FileField
              label="Upload brand assets"
              accept="image/png,image/jpeg,image/svg+xml,image/webp,application/pdf"
              multiple
              onChange={(files) => setBrandAssets(files)}
              hint={brandAssets.length ? `${brandAssets.length} file(s) selected` : undefined}
            />
          </div>

          <div>
            <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Additional notes</label>
            <textarea
              value={form.additionalNotes}
              onChange={update('additionalNotes')}
              rows={4}
              className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3.5 text-[15px] outline-none transition-colors resize-none"
            />
          </div>

          {error && <p className="text-rose-500 text-sm font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-4 rounded-full transition-all"
          >
            {submitting ? 'Submitting…' : 'Submit and deploy'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[13px] font-bold text-ink-900 block mb-1.5">
        {label} {required && '*'}
      </label>
      <input
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3.5 text-[15px] outline-none transition-colors placeholder:text-slate-300"
      />
    </div>
  );
}

function FileField({
  label,
  accept,
  multiple,
  onChange,
  hint,
}: {
  label: string;
  accept: string;
  multiple?: boolean;
  onChange: (files: File[]) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-[13px] font-bold text-ink-900 block mb-1.5">{label}</label>
      <label className="flex items-center gap-2.5 border-2 border-dashed border-ASTER-200 hover:border-ASTER-400 rounded-2xl px-4 py-3.5 text-[15px] text-slate-400 cursor-pointer transition-colors">
        <UploadCloud size={18} className="text-ASTER-600 shrink-0" />
        <span className="truncate">{hint ?? 'Click to upload'}</span>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => onChange(Array.from(e.target.files ?? []))}
          className="hidden"
        />
      </label>
    </div>
  );
}
