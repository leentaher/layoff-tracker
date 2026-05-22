export default function Nav() {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '16px 40px', background: 'var(--bg)', position: 'sticky',
      top: 0, zIndex: 100, borderBottom: '1.5px solid rgba(0,0,0,0.08)'
    }}>
      <a href="https://directory.juicebokx.com" style={{ textDecoration: 'none', lineHeight: 1.2, display: 'inline-block' }}>
        <div style={{ fontWeight: 900, fontSize: 24, color: 'var(--black)', width: '100%', textAlign: 'justify', textAlignLast: 'justify' }}>navigate</div>
        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.08em', color: 'rgba(0,0,0,0.4)', textTransform: 'lowercase', whiteSpace: 'nowrap' }}>juicebokx × new consensus</div>
      </a>
      <ul style={{ display: 'flex', gap: 24, listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
        {[
          ['#tools',      'tools'],
          ['#tracker',    'tracker'],
          ['#community',  'directory'],
        ].map(([href, label]) => (
          <li key={href} className="nav-link-item">
            <a href={href} style={{ fontSize: 12, fontWeight: 600, color: 'var(--black)', textDecoration: 'none', opacity: 0.55 }}>
              {label}
            </a>
          </li>
        ))}
        <li>
          <a href="#community" style={{
            background: 'var(--orange)', color: '#fff', padding: '7px 16px',
            borderRadius: 6, fontWeight: 700, fontSize: 12, textDecoration: 'none'
          }}>
            join the directory
          </a>
        </li>
      </ul>
    </nav>
  )
}
