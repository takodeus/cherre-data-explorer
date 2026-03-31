interface TeamMember {
  name: string;
  title: string;
  bio: string;
  initials: string;
  linkedinUrl: string;
}

const TEAM: TeamMember[] = [
  {
    name: 'Alex Rivera',
    title: 'Senior Account Executive',
    bio: 'Helps real estate firms turn fragmented data into decisions. 8 years in proptech.',
    initials: 'AR',
    linkedinUrl: 'https://linkedin.com/in/placeholder',
  },
  {
    name: 'Jordan Kim',
    title: 'Solutions Engineer',
    bio: 'Architects data pipelines for institutional investors and fund admins.',
    initials: 'JK',
    linkedinUrl: 'https://linkedin.com/in/placeholder',
  },
  {
    name: 'Morgan Chen',
    title: 'Customer Success Lead',
    bio: 'Onboards and scales Cherre deployments across alternative asset managers.',
    initials: 'MC',
    linkedinUrl: 'https://linkedin.com/in/placeholder',
  },
];

// Minimal inline QR placeholder — three corner squares + dot fill
// Replace linkedinUrl with real QR SVG per team member before Realcomm
const QRPlaceholder = ({ size = 56 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
    <rect width="52" height="52" fill="white" rx="3" />
    <g fill="currentColor">
      {/* TL corner */}
      <rect x="2"  y="2"  width="16" height="16" rx="2" />
      <rect x="4"  y="4"  width="12" height="12" fill="white" rx="1" />
      <rect x="6"  y="6"  width="8"  height="8"  rx="1" />
      {/* TR corner */}
      <rect x="34" y="2"  width="16" height="16" rx="2" />
      <rect x="36" y="4"  width="12" height="12" fill="white" rx="1" />
      <rect x="38" y="6"  width="8"  height="8"  rx="1" />
      {/* BL corner */}
      <rect x="2"  y="34" width="16" height="16" rx="2" />
      <rect x="4"  y="36" width="12" height="12" fill="white" rx="1" />
      <rect x="6"  y="38" width="8"  height="8"  rx="1" />
      {/* Data dots */}
      <rect x="20" y="2"  width="4"  height="4" />
      <rect x="26" y="2"  width="4"  height="4" />
      <rect x="20" y="8"  width="4"  height="4" />
      <rect x="26" y="14" width="4"  height="4" />
      <rect x="20" y="20" width="12" height="4" />
      <rect x="34" y="20" width="4"  height="4" />
      <rect x="40" y="20" width="8"  height="4" />
      <rect x="34" y="26" width="4"  height="8" />
      <rect x="40" y="28" width="8"  height="4" />
      <rect x="20" y="26" width="4"  height="4" />
      <rect x="26" y="26" width="4"  height="4" />
      <rect x="20" y="32" width="8"  height="4" />
      <rect x="20" y="38" width="4"  height="8" />
      <rect x="26" y="40" width="8"  height="4" />
      <rect x="36" y="34" width="4"  height="8" />
      <rect x="42" y="34" width="6"  height="4" />
      <rect x="44" y="40" width="4"  height="8" />
    </g>
  </svg>
);

interface TeamScreenProps {
  onContinue: () => void;
}

const TeamScreen = ({ onContinue }: TeamScreenProps) => {
  return (
    <div
      className="flex flex-col"
      style={{ position: 'absolute', inset: 0, background: 'hsl(var(--background))' }}
    >
      {/* Header */}
      <div className="bg-primary px-10 pt-5 pb-5 flex items-end justify-between flex-shrink-0">
        <div>
          <div className="text-[11px] font-semibold tracking-wide uppercase text-primary-foreground/70 mb-1">
            Meet the team
          </div>
          <div
            className="text-primary-foreground font-extrabold tracking-tight"
            style={{ fontSize: 'clamp(18px, 3vw, 26px)' }}
          >
            We're right here. Let's talk.
          </div>
        </div>
        <div className="pill-badge text-[10px]" style={{ background: 'hsl(var(--primary-deep))' }}>
          Step 5 of 6
        </div>
      </div>

      {/* Team cards */}
      <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4">
        {TEAM.map((member) => (
          <div
            key={member.name}
            className="flex items-center gap-5 bg-card border border-border rounded-2xl px-6 py-5 shadow-sm"
          >
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center flex-shrink-0"
            >
              <span className="text-primary font-black text-lg tracking-tight">
                {member.initials}
              </span>
            </div>

            {/* Bio */}
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-bold text-foreground">{member.name}</div>
              <div className="text-[10px] font-semibold tracking-wide uppercase text-primary/70 mt-0.5">
                {member.title}
              </div>
              <div className="text-[12px] text-muted-foreground leading-snug mt-1.5">
                {member.bio}
              </div>
            </div>

            {/* QR + label */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className="text-primary rounded-lg overflow-hidden shadow-sm">
                <QRPlaceholder size={56} />
              </div>
              <span className="text-[9px] text-muted-foreground/50 font-mono tracking-wide text-center">
                LinkedIn
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-8 py-4 border-t border-border bg-card flex-shrink-0 flex justify-end">
        <button
          onClick={onContinue}
          className="bg-primary text-primary-foreground border-none rounded-xl px-8 py-3 font-sans text-xs font-bold tracking-wide uppercase cursor-pointer transition-all hover:bg-primary-light shadow-md hover:shadow-lg active:scale-[0.97]"
        >
          Complete checkout →
        </button>
      </div>
    </div>
  );
};

export default TeamScreen;
