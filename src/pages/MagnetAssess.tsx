import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { generateMagnetSlug } from '@/lib/magnetSlug';

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  role: z.string().trim().min(2, 'Please enter your role'),
  websiteUrl: z.string().trim().url('Enter a valid URL (https://…)'),
  linkedinUrl: z.string().trim().url('Enter a valid LinkedIn URL'),
  email: z.string().trim().email('Enter a valid email'),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  'w-full bg-black/5 border border-black/10 text-[#1C1008] placeholder:text-black/30 focus:border-[#B8933A] focus:outline-none focus:ring-0 rounded-none h-12 px-4 transition-colors';

export default function MagnetAssess() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

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
          linkedin_url: data.linkedinUrl,
          email: data.email,
          status: 'pending',
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        toast.error('Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      // Fire and forget — do not await
      void supabase.functions
        .invoke('enrich-magnet', { body: { slug } })
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

          <Field label="Your LinkedIn profile" error={errors.linkedinUrl?.message}>
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
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider opacity-60 mb-2">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-[#B8933A]">{error}</p>}
    </div>
  );
}
