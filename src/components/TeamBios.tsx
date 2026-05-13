const bios = [
  {
    initial: 'M',
    name: 'mandira',
    role: 'cofounder · juicebokx',
    desc: 'got laid off and bought a word search book to cope. decided other people needed better tools for the worst week of their career. built this instead of updating her linkedin.',
    link: 'https://juicebokx.com',
    linkText: 'juicebokx.com →',
    avatarBg: 'var(--orange)',
    linkColor: 'var(--orange)',
  },
  {
    initial: 'Z',
    name: 'zack',
    role: 'new consensus',
    desc: 'helped write the Green New Deal. now writing the plan the next president will need on day one. believes the people losing jobs to AI are exactly the ones who should build what comes next.',
    link: 'https://www.newconsensus.com',
    linkText: 'newconsensus.com →',
    avatarBg: '#1A4DB5',
    linkColor: '#1A4DB5',
  },
  {
    initial: 'L',
    name: 'leen',
    role: 'cofounder · juicebokx',
    desc: 'watched the layoff wave hit people she cared about and decided someone should build the thing that actually helps. believes the emotional side of losing a job deserves as much attention as the practical side.',
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
          we believe screens aren't always the answer. sometimes the best thing the internet can do is help you find the humans on the other side of it.
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
