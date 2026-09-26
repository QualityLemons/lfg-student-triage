import { ShieldAlert, Phone, Mail, UserRound } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export function SafeguardingHelp() {
  return <Dialog>
    <DialogTrigger asChild>
      <button type="button" className="safeguarding-help-trigger">
        <ShieldAlert size={19} aria-hidden="true" /> Safeguarding help
      </button>
    </DialogTrigger>
    <DialogContent style={{ background: '#fffdf7', color: '#243f3c', fontFamily: 'DM Sans, sans-serif', width: 'calc(100% - 32px)', maxHeight: '85dvh', overflowY: 'auto', borderRadius: 16 }}>
      <div style={{ color: '#943831', display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}><ShieldAlert size={19}/> Safeguarding support</div>
      <DialogTitle style={{ fontSize: 24 }}>Speak to the safeguarding lead</DialogTitle>
      <DialogDescription style={{ color: '#536662', lineHeight: 1.6 }}>You do not need to complete a report before seeking help. Use your school’s approved safeguarding contact route.</DialogDescription>
      <section style={{ padding: 18, background: '#f0f4ef', border: '1px solid #d6dfd8', borderRadius: 10 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontWeight: 700 }}><UserRound size={20}/> Designated Safeguarding Lead (DSL)</div>
        <p style={{ marginTop: 10, fontSize: 14 }}>School contact not configured</p>
        <p style={{ fontSize: 13, lineHeight: 1.6, marginTop: 6 }}>This mock-up does not yet have an approved name, telephone number, email address or location. Ask reception or consult your school’s safeguarding contact list now.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
          <button disabled style={{ padding: '10px 14px', border: '1px solid #bdcbc3', borderRadius: 7, display: 'flex', gap: 8, alignItems: 'center', opacity: .6 }}><Phone size={15}/> Call DSL — not set</button>
          <button disabled style={{ padding: '10px 14px', border: '1px solid #bdcbc3', borderRadius: 7, display: 'flex', gap: 8, alignItems: 'center', opacity: .6 }}><Mail size={15}/> Email DSL — not set</button>
        </div>
      </section>
      <div style={{ fontSize: 13, lineHeight: 1.7 }}><strong>If the DSL is unavailable</strong><p>Contact the deputy DSL or follow your school’s escalation procedure. Do not wait for an email reply about an urgent concern.</p></div>
      <div style={{ padding: 16, background: '#faeae6', borderRadius: 10, fontSize: 14, lineHeight: 1.6 }}><strong>Immediate danger or a life-threatening emergency?</strong><p>Call <a href="tel:999" style={{ fontWeight: 800, textDecoration: 'underline' }}>999</a> in the UK. This opens your device’s dialler; it does not place a call automatically.</p></div>
      <p style={{ fontSize: 12, color: '#61736d', lineHeight: 1.6 }}>Prototype only. Opening this panel does not send a concern, notify anyone or confirm a handover. Do not enter sensitive details here.</p>
    </DialogContent>
    <style>{`
      .safeguarding-help-trigger {position:fixed;right:24px;bottom:24px;z-index:40;display:flex;align-items:center;gap:9px;min-height:48px;padding:13px 19px;background:#943831;color:#fff;border:1px solid #7b2d28;border-radius:100px;box-shadow:0 5px 20px #40201b25;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer}
      .safeguarding-help-trigger:hover {background:#782c26}
      .safeguarding-help-trigger:focus-visible {outline:3px solid #943831;outline-offset:4px}
      .triage-shell {padding-bottom:88px}
      @media(max-width:600px){.safeguarding-help-trigger{right:16px;bottom:max(16px,env(safe-area-inset-bottom));font-size:13px;padding:12px 16px}}
    `}</style>
  </Dialog>;
}