const bios = [
  {
    initial: 'M',
    name: 'mandira',
    role: 'cofounder · juicebokx',
    desc: 'worked in tech. saw burnout get rebranded as a personality. now focused on what helps people when the worst week of their career arrives. believes analog objects deserve more credit than they get.',
    link: 'https://juicebokx.com',
    linkText: 'juicebokx.com →',
    avatarBg: 'var(--orange)',
    linkColor: 'var(--orange)',
  },
  {
    initial: 'Z',
    name: 'zack',
    role: 'new consensus',
    desc: 'has spent years on economic policy. now building the frameworks governments will need as AI reshapes the labor market. believes the people displaced should be part of writing what comes next. started new consensus to make that happen.',
    link: 'https://www.newconsensus.com',
    linkText: 'newconsensus.com →',
    avatarBg: '#1A4DB5',
    linkColor: '#1A4DB5',
  },
  {
    initial: 'L',
    name: 'leen',
    role: 'cofounder · juicebokx',
    desc: 'worked in tech. watched friends get laid off. got angry about it. channeled that into building tools instead of a coping mechanism. (also built the coping mechanism. it\'s a word search book. it helps.)',
    link: 'https://juicebokx.com',
    linkText: 'juicebokx.com →',
    avatarBg: 'var(--black)',
    linkColor: 'var(--orange)',
  },
]

export default function TeamBios() {
  return (
    <div style={{ background: 'var(--yellow)', borderTop: '3px solid var(--black)' }}>
      <div className="section-inner" style={{ maxWidth: 900, margin: '0 auto', padding: '80px 40px' }}>

        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: 14 }}>
          the people behind this
        </p>
        <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.0, color: 'var(--black)', marginBottom: 16 }}>
          who built this.
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.5)', lineHeight: 1.75, maxWidth: 560, marginBottom: 48 }}>
          we started with something physical. then the layoffs hit people we knew, and we built this. the goal was never a platform. it was a room full of people who can actually help each other.
        </p>

        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          {bios.map(bio => (
            <div key={bio.name} style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 12, padding: '28px 24px' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: bio.avatarBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 900, color: 'white',
                marginBottom: 14,
              }}>
                {bio.initial}
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--black)', letterSpacing: '-0.5px', marginBottom: 4 }}>
                {bio.name}
              </div>
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.4)', marginBottom: 14 }}>
                {bio.role}
              </div>
              <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)', lineHeight: 1.75, marginBottom: 18 }}>
                {bio.desc}
              </p>
              <a href={bio.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: bio.linkColor, textDecoration: 'none' }}>
                {bio.linkText}
              </a>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
