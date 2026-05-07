export default function Nav() {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '16px 40px', background: 'var(--bg)', position: 'sticky',
      top: 0, zIndex: 100, borderBottom: '1.5px solid rgba(0,0,0,0.08)'
    }}>
      <a href="https://juicebokx.com" style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.5px', color: 'var(--black)', textDecoration: 'none' }}>
        juicebokx
      </a>
      <ul style={{ display: 'flex', gap: 24, listStyle: 'none' }}>
        {[
          ['#am-i-next', 'am i next'],
          ['#confessions', 'confessions'],
          ['#checklist', 'checklist'],
          ['#severance', 'severance'],
          ['#what-now', 'what now'],
          ['#timeline', 'timeline'],
        ].map(([href, label]) => (
          <li key={href}>
            <a href={href} style={{ fontSize: 12, fontWeight: 600, color: 'var(--black)', textDecoration: 'none', opacity: 0.55 }}>
              {label}
            </a>
          </li>
        ))}
        <li>
          <a href="https://juicebokx.com/im-so-tired" style={{
            background: 'var(--orange)', color: '#fff', padding: '7px 16px',
            borderRadius: 6, fontWeight: 700, fontSize: 12, textDecoration: 'none'
          }}>
            join waitlist
          </a>
        </li>
      </ul>
    </nav>
  )
}
