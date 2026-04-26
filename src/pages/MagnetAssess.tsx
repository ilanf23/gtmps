import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { generateMagnetSlug } from '@/lib/magnetSlug';

const optionalUrl = z
  .string()
  .trim()
  .url('Enter a valid URL (https://…)')
  .optional()
  .or(z.literal(''));

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  role: z.string().trim().min(2, 'Please enter your role'),
  websiteUrl: z.string().trim().url('Enter a valid URL (https://…)'),
  linkedinUrl: optionalUrl,
  email: z.string().trim().email('Enter a valid email'),
  crmSize: z.enum(['under_100', '100_300', '300_700', '700_plus'], {
    errorMap: () => ({ message: 'Please select a range' }),
  }),
  dealSize: z.enum(['under_50k', '50k_150k', '150k_500k', '500k_plus'], {
    errorMap: () => ({ message: 'Please select a range' }),
  }),
  bdChallenge: z.enum(
    [
      'finding_new',
      'reengaging_past',
      'converting_warm',
      'consistent_intros',
      'generating_inbound',
    ],
    { errorMap: () => ({ message: 'Please select an option' }) },
  ),
  caseStudiesUrl: optionalUrl,
  teamPageUrl: optionalUrl,
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  'w-full bg-black/5 border border-black/10 text-[#1C1008] placeholder:text-black/30 focus:border-[#B8933A] focus:outline-none focus:ring-0 rounded-none h-12 px-4 transition-colors';

const selectClass =
  inputClass +
  ' appearance-none pr-10 bg-no-repeat bg-[length:12px_12px] bg-[right_1rem_center]';

// Inline chevron SVG used as the select arrow
const selectChevronStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M2 4l4 4 4-4' stroke='%231C1008' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
};

export default function MagnetAssess() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    mode: 'onBlur',
    defaultValues: {
      crmSize: '' as unknown as FormValues['crmSize'],
      dealSize: '' as unknown as FormValues['dealSize'],
      bdChallenge: '' as unknown as FormValues['bdChallenge'],
    },
  });

  const watched = watch();
  const {
    websiteUrl,
    crmSize,
    dealSize,
    bdChallenge,
    caseStudiesUrl,
  } = watched;

  // Weighted progress calc
  const fieldWeights: Record<string, number> = {
    name: 10,
    role: 5,
    websiteUrl: 20,
    email: 10,
    crmSize: 15,
    dealSize: 15,
    bdChallenge: 10,
    linkedinUrl: 5,
    caseStudiesUrl: 5,
    teamPageUrl: 5,
  };
  const progress = Object.entries(fieldWeights).reduce((sum, [k, w]) => {
    const v = watched[k as keyof FormValues];
    return sum + (v && String(v).trim() !== '' ? w : 0);
  }, 0);

  const getProgressLabel = (p: number): string => {
    if (p === 0) return 'Start building your breakdown →';
    if (p < 20) return 'Setting up your profile...';
    if (p < 40) return 'Mapping your firm context...';
    if (p < 60) return 'Identifying your orbits...';
    if (p < 80) return 'Calculating your Dead Zone...';
    if (p < 100) return 'Almost there, breakdown nearly ready...';
    return 'Full breakdown unlocked';
  };

  // Live Dead Zone Value (in $K)
  const crmMidpoints: Record<string, number> = {
    under_100: 75,
    '100_300': 200,
    '300_700': 500,
    '700_plus': 800,
  };
  const dealMidpoints: Record<string, number> = {
    under_50k: 35000,
    '50k_150k': 100000,
    '150k_500k': 325000,
    '500k_plus': 650000,
  };
  const deadZoneValue =
    crmSize && dealSize
      ? Math.round(
          ((crmMidpoints[crmSize] ?? 0) *
            0.81 *
            (dealMidpoints[dealSize] ?? 0) *
            0.03) /
            1000,
        )
      : null;

  // Pulse the Dead Zone badge briefly when it first appears
  const [deadZonePulsed, setDeadZonePulsed] = useState(false);
  useEffect(() => {
    if (deadZoneValue !== null && !deadZonePulsed) {
      const t = setTimeout(() => setDeadZonePulsed(true), 2000);
      return () => clearTimeout(t);
    }
  }, [deadZoneValue, deadZonePulsed]);

  const layerMap: Record<string, string> = {
    finding_new: '⊙ Starting layer: PROVE',
    reengaging_past: '⊙ Starting layer: ACTIVATE',
    converting_warm: '⊙ Starting layer: DESIGN',
    consistent_intros: '⊙ Starting layer: ACTIVATE',
    generating_inbound: '⊙ Starting layer: COMPOUND',
  };

  const badges = [
    {
      id: 'website',
      condition: Boolean(websiteUrl && String(websiteUrl).trim() !== ''),
      label: '⊙ Website: Ready to analyze',
      color:
        'border-[#1C1008]/20 bg-[#1C1008]/5 text-[#1C1008]/80',
    },
    {
      id: 'deadzone',
      condition: deadZoneValue !== null,
      label:
        deadZoneValue !== null
          ? `⊙ Dead Zone estimate: ~$${deadZoneValue}K`
          : '',
      color:
        'border-[#B8933A]/40 bg-[#B8933A]/10 text-[#8a6e2b]',
    },
    {
      id: 'layer',
      condition: Boolean(bdChallenge && bdChallenge !== ''),
      label: bdChallenge ? layerMap[bdChallenge] ?? '⊙ Starting layer: Identified' : '',
      color:
        'border-[#3D5A4A]/30 bg-[#3D5A4A]/10 text-[#3D5A4A]',
    },
    {
      id: 'proof',
      condition: Boolean(caseStudiesUrl && String(caseStudiesUrl).trim() !== ''),
      label: '⊙ Proof assets: Will be analyzed',
      color:
        'border-[#8B3A2A]/30 bg-[#8B3A2A]/10 text-[#8B3A2A]',
    },
  ];

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      const slug = generateMagnetSlug(data.email);

      const { error: insertError } = await supabase
        .from('magnet_submissions')
        .insert({
          slug,
          first_name: data.name,
          role: data.role,
          website_url: data.websiteUrl,
          linkedin_url: data.linkedinUrl || '',
          email: data.email,
          status: 'pending',
          crm_size: data.crmSize,
          deal_size: data.dealSize,
          bd_challenge: data.bdChallenge,
          case_studies_url: data.caseStudiesUrl || null,
          team_page_url: data.teamPageUrl || null,
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        toast.error('Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      // Fire and forget — do not await
      void supabase.functions
        .invoke('enrich-magnet', {
          body: {
            slug,
            crmSize: data.crmSize,
            dealSize: data.dealSize,
            bdChallenge: data.bdChallenge,
            caseStudiesUrl: data.caseStudiesUrl || null,
            teamPageUrl: data.teamPageUrl || null,
          },
        })
        .catch((err) => console.error('Enrich invoke error:', err));

      navigate(`/m/${slug}`);
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Something went wrong — please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F4] text-[#1C1008]">
      <div className="max-w-lg mx-auto px-6 py-20 md:py-28">
        <p className="text-[11px] tracking-[0.18em] font-medium text-[#B8933A]">
          GET YOUR PERSONALIZED GTM BREAKDOWN
        </p>
        <h1 className="mt-4 font-serif text-3xl md:text-4xl leading-tight">
          See exactly where your firm's revenue relationships are leaking.
        </h1>
        <p className="text-sm opacity-70 mt-2">
          Takes 90 seconds. We analyze your website and build a custom RROS map for your firm.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5" noValidate>
          <Field label="Your name" error={errors.name?.message}>
            <input
              type="text"
              autoComplete="name"
              className={inputClass}
              placeholder="Jane Doe"
              {...register('name')}
            />
          </Field>

          <Field label="Your title / role" error={errors.role?.message}>
            <input
              type="text"
              autoComplete="organization-title"
              className={inputClass}
              placeholder="Managing Partner"
              {...register('role')}
            />
          </Field>

          <Field label="Company website" error={errors.websiteUrl?.message}>
            <input
              type="url"
              autoComplete="url"
              className={inputClass}
              placeholder="https://yourfirm.com"
              {...register('websiteUrl')}
            />
          </Field>

          <Field
            label="Your LinkedIn profile (optional)"
            error={errors.linkedinUrl?.message}
          >
            <input
              type="url"
              className={inputClass}
              placeholder="https://linkedin.com/in/you"
              {...register('linkedinUrl')}
            />
          </Field>

          <Field label="Work email" error={errors.email?.message}>
            <input
              type="email"
              autoComplete="email"
              className={inputClass}
              placeholder="you@yourfirm.com"
              {...register('email')}
            />
          </Field>

          <Field
            label="How many contacts are in your CRM or contact database?"
            error={errors.crmSize?.message}
          >
            <select
              className={selectClass}
              style={selectChevronStyle}
              defaultValue=""
              {...register('crmSize')}
            >
              <option value="" disabled>
                Select a range...
              </option>
              <option value="under_100">Under 100</option>
              <option value="100_300">100 – 300</option>
              <option value="300_700">300 – 700</option>
              <option value="700_plus">700+</option>
            </select>
          </Field>

          <Field
            label="What's your typical engagement or project value?"
            error={errors.dealSize?.message}
          >
            <select
              className={selectClass}
              style={selectChevronStyle}
              defaultValue=""
              {...register('dealSize')}
            >
              <option value="" disabled>
                Select a range...
              </option>
              <option value="under_50k">Under $50K</option>
              <option value="50k_150k">$50K – $150K</option>
              <option value="150k_500k">$150K – $500K</option>
              <option value="500k_plus">$500K+</option>
            </select>
          </Field>

          <Field
            label="What's your biggest BD challenge right now?"
            error={errors.bdChallenge?.message}
          >
            <select
              className={selectClass}
              style={selectChevronStyle}
              defaultValue=""
              {...register('bdChallenge')}
            >
              <option value="" disabled>
                Select one...
              </option>
              <option value="finding_new">Finding new clients</option>
              <option value="reengaging_past">Re-engaging past clients</option>
              <option value="converting_warm">Converting warm referrals</option>
              <option value="consistent_intros">Getting consistent introductions</option>
              <option value="generating_inbound">Generating inbound</option>
            </select>
          </Field>

          <Field
            label="Link to your case studies or work page (optional)"
            helper="Helps us analyze your proof assets"
            error={errors.caseStudiesUrl?.message}
          >
            <input
              type="url"
              className={inputClass}
              placeholder="https://yourfirm.com/case-studies"
              {...register('caseStudiesUrl')}
            />
          </Field>

          <Field
            label="Link to your team or about page (optional)"
            helper="Helps us understand your firm's background"
            error={errors.teamPageUrl?.message}
          >
            <input
              type="url"
              className={inputClass}
              placeholder="https://yourfirm.com/about"
              {...register('teamPageUrl')}
            />
          </Field>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-[#B8933A] hover:bg-[#a07c2e] text-[#120D05] font-semibold tracking-wide uppercase text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-[#120D05]/30 border-t-[#120D05] animate-spin" />
                  BUILDING…
                </>
              ) : (
                'BUILD MY GTM BREAKDOWN →'
              )}
            </button>
            <p className="text-xs opacity-40 text-center mt-3">
              No spam. No sales pitch. Just your map.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  helper,
  children,
}: {
  label: string;
  error?: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider opacity-60 mb-2">
        {label}
      </label>
      {children}
      {helper && <p className="mt-1.5 text-xs opacity-50">{helper}</p>}
      {error && <p className="mt-1.5 text-xs text-[#B8933A]">{error}</p>}
    </div>
  );
}
