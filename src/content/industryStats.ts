import type { VerticalSlug } from '@/content/verticals';

export type IndustryStat = {
  value: string;
  label: string;
  source: string;
};

// Best-effort public-source figures. Values flagged [SOURCE PENDING] should be
// fact-checked by Adam against the cited primary source before publish.
export const INDUSTRY_STATS: Record<VerticalSlug, IndustryStat[]> = {
  consulting: [
    { value: '150K+', label: 'Total US firms', source: 'IBISWorld 2024 [SOURCE PENDING]' },
    { value: '8,200', label: 'Firms $5M to $100M revenue', source: 'Kennedy Research [SOURCE PENDING]' },
    { value: '$320B', label: 'US industry revenue', source: 'IBISWorld 2024 [SOURCE PENDING]' },
    { value: '4.2%', label: 'Annual growth rate', source: 'IBISWorld 2024 [SOURCE PENDING]' },
  ],
  law: [
    { value: '450K+', label: 'Active US law firms', source: 'ABA Profile of the Profession 2023' },
    { value: '6,800', label: 'Firms $5M to $100M revenue', source: 'Altman Weil [SOURCE PENDING]' },
    { value: '$390B', label: 'US legal services revenue', source: 'ABA / IBISWorld 2024 [SOURCE PENDING]' },
    { value: '3.5%', label: 'Annual growth rate', source: 'Altman Weil 2024 [SOURCE PENDING]' },
  ],
  accounting: [
    { value: '140K+', label: 'US CPA firms', source: 'AICPA 2024' },
    { value: '5,400', label: 'Firms $5M to $100M revenue', source: 'Inside Public Accounting [SOURCE PENDING]' },
    { value: '$160B', label: 'US accounting revenue', source: 'AICPA / IBISWorld 2024 [SOURCE PENDING]' },
    { value: '5.1%', label: 'Annual growth rate', source: 'Inside Public Accounting 2024 [SOURCE PENDING]' },
  ],
  msp: [
    { value: '40K+', label: 'US MSPs', source: 'ChannelE2E 2024 [SOURCE PENDING]' },
    { value: '3,900', label: 'MSPs $5M to $100M revenue', source: 'ConnectWise State of SMB 2024 [SOURCE PENDING]' },
    { value: '$220B', label: 'US managed services revenue', source: 'ChannelE2E 2024 [SOURCE PENDING]' },
    { value: '12.5%', label: 'Annual growth rate', source: 'ConnectWise 2024 [SOURCE PENDING]' },
  ],
  advisory: [
    { value: '15K+', label: 'US RIA firms', source: 'Cerulli Associates 2024 [SOURCE PENDING]' },
    { value: '2,100', label: 'RIAs $5M to $100M AUM tier', source: 'Cerulli Associates 2024 [SOURCE PENDING]' },
    { value: '$128T', label: 'US wealth AUM', source: 'Cerulli Associates 2024 [SOURCE PENDING]' },
    { value: '7.8%', label: 'Annual AUM growth', source: 'Cerulli Associates 2024 [SOURCE PENDING]' },
  ],
  ae: [
    { value: '110K+', label: 'US A&E firms', source: 'ZweigWhite 2024 [SOURCE PENDING]' },
    { value: '4,500', label: 'Firms $5M to $100M revenue', source: 'ZweigWhite 2024 [SOURCE PENDING]' },
    { value: '$420B', label: 'US A&E industry revenue', source: 'ENR 2024 [SOURCE PENDING]' },
    { value: '5.4%', label: 'Annual growth rate', source: 'ZweigWhite 2024 [SOURCE PENDING]' },
  ],
  recruiting: [
    { value: '12K+', label: 'US executive search firms', source: 'AESC 2024 [SOURCE PENDING]' },
    { value: '1,400', label: 'Firms $5M to $100M revenue', source: 'AESC 2024 [SOURCE PENDING]' },
    { value: '$22B', label: 'US executive search revenue', source: 'AESC 2024 [SOURCE PENDING]' },
    { value: '6.3%', label: 'Annual growth rate', source: 'AESC 2024 [SOURCE PENDING]' },
  ],
  agency: [
    { value: '60K+', label: 'US marketing agencies', source: 'AdAge Agency Report 2024 [SOURCE PENDING]' },
    { value: '4,800', label: 'Agencies $5M to $100M revenue', source: 'Provoke Insights 2024 [SOURCE PENDING]' },
    { value: '$275B', label: 'US agency revenue', source: 'AdAge 2024 [SOURCE PENDING]' },
    { value: '6.8%', label: 'Annual growth rate', source: 'Provoke Insights 2024 [SOURCE PENDING]' },
  ],
};
