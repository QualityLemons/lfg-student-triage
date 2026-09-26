export type Passport = {
  reviewed: string;
  important: string;
  communication: string;
  help: string;
  likes: string;
  dislikes: string;
};

// Fictional individual guidance, not copied from the person in the NHS example.
export const demoPassport: Passport = {
  reviewed: '21 September 2026',
  important: 'Unexpected changes can feel overwhelming. Tell me what will happen next before asking me to move.',
  communication: 'I speak, but when I am overwhelmed I may prefer to write or point to a choice. Give me time to respond.',
  help: 'Use short, clear instructions, one step at a time. Offer a written timetable and check my understanding privately.',
  likes: 'Drawing, quiet spaces and knowing which trusted adult I can speak to.',
  dislikes: 'Loud, crowded spaces, sudden changes and being asked questions in front of a group.',
};

export function CommunicationPassport({ passport, manager }: { passport?: Passport; manager: string }) {
  return <section aria-label="Communication Passport" className="triage-info-box" style={{ marginBottom: 20, borderLeft: '3px solid #32635d' }}>
    <p className="triage-box-eyebrow">Student profile · communication needs</p>
    <h3>Communication Passport</h3>
    {passport ? <>
      <p style={{ marginTop: 8 }}><span className="triage-badge track">Passport available</span> · Reviewed {passport.reviewed}</p>
      <p style={{ marginTop: 10 }}>Read how this student communicates and what helps before reporting, triage or reintegration.</p>
      <details key={passport.reviewed + manager} style={{ marginTop: 12 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#285b55', padding: '8px 0' }}>Read communication guidance</summary>
        <div className="triage-two-col" style={{ marginTop: 12 }}>
          {[
            ['Important things to know about me', passport.important],
            ['How I communicate', passport.communication],
            ['Things you can do to help me', passport.help],
            ['Things I like', passport.likes],
            ['Things I don’t like', passport.dislikes],
          ].map(([heading, text]) => <div className="triage-info-box" key={heading}><h3 style={{ fontSize: 17 }}>{heading}</h3><p>{text}</p></div>)}
        </div>
        <p style={{ marginTop: 12 }}>Contact: {manager}, Link Manager. Fictional guidance for this prototype; no student passport document is stored.</p>
        <a className="triage-text-button" href="https://www.oxfordhealth.nhs.uk/wp-content/uploads/oxtc/resources/Communication-passport-example01.pdf" target="_blank" rel="noopener noreferrer">View Oxford Health example (PDF, new tab)</a>
      </details>
    </> : <>
      <p style={{ marginTop: 8 }}><span className="triage-badge">No passport recorded</span></p>
      <p style={{ marginTop: 10 }}>Check with {manager}, the student and their family whether a passport exists or would be helpful. This does not mean the student has no communication support needs.</p>
    </>}
  </section>;
}