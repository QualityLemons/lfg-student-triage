import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ClipboardCheck, FileText, ShieldAlert } from 'lucide-react';
import './ConcernRecord.css';

export type ConcernRecordData = {
  studentName: string; year: string; form: string; dateOfBirth: string; gender: string;
  incidentAt: string; completedAt: string; reporter: string; position: string; visitorContact: string;
  location: string; present: string; observed: string; childWords: string; response: string;
  injuries: string; otherPeople: string; previous: string; professionalViews: string;
  safeguardingLead: string; handoffAt: string; manager: string;
};
export type DslActionData = {
  dsl: string; completedAt: string; response: string; risk: string; parentContact: string;
  parentResponse: string; parentNotInformedReason: string; childFeedback: string;
  requestSupport: string; agency: string; rationale: string; referralConsent: string;
  consentReason: string; reporterFeedback: string; staffFeedback: string; furtherAction: string;
};

const blank: ConcernRecordData = {
  studentName: '', year: 'Year 7', form: '', dateOfBirth: '', gender: '', incidentAt: '',
  completedAt: '', reporter: '', position: '', visitorContact: '', location: '', present: '',
  observed: '', childWords: '', response: '', injuries: '', otherPeople: '', previous: '',
  professionalViews: '', safeguardingLead: '', handoffAt: '', manager: 'Amira Patel',
};

const source = 'Hertfordshire CPSLO Service · Example and guidance for Record of Concern · 2023–2024 v1, pp. 1–3';

function Line({ label, value }: { label: string; value?: string }) {
  return <div className="concern-line"><span>{label}</span><strong className={!value ? 'concern-unrecorded' : ''}>{value || 'Not recorded in this prototype'}</strong></div>;
}

function Block({ label, value, hint }: { label: string; value?: string; hint?: string }) {
  return <div className="concern-block"><h4>{label}</h4>{hint && <small>{hint}</small>}<p className={!value ? 'concern-unrecorded' : ''}>{value || 'Not recorded in this prototype.'}</p></div>;
}

export function RecordOfConcern({ record, dslAction, legacy, onSummary, onSaveDsl }: {
  record?: ConcernRecordData;
  dslAction?: DslActionData;
  legacy: { studentName: string; year: string; form: string; concern: string; context: string; voice: string; reporter: string; reported: string; manager: string };
  onSummary: () => void;
  onSaveDsl: (data: DslActionData) => void;
}) {
  const [dslOpen, setDslOpen] = useState(false);
  return <div className="concern-view">
    <div className="concern-heading"><div><span className="concern-kicker">01 / Reporter's record</span><h3>Record of concern</h3><p>A factual account, distinct from the DSL/DDSL response.</p></div><span className="concern-status"><Check size={13}/> Submitted · read-only</span></div>
    <div className="concern-safety"><ShieldAlert size={18}/><div><strong>Safeguarding concerns need immediate human attention.</strong><p>This is a fictional, local prototype. Recording here does not notify a DSL, submit a referral, or replace your school’s safeguarding procedures. If a child may be at immediate risk, use your established escalation route now.</p></div></div>
    {!record && <div className="concern-legacy">This pre-existing fictional case predates the structured record. Unavailable fields are shown as not recorded; they have not been inferred.</div>}
    <div className="concern-paper">
      <div className="concern-paper-top"><div><span className="concern-kicker">Record 01 · Reporter</span><h4>Concern &amp; disclosure</h4></div><span className="concern-paper-mark"><FileText size={18}/></span></div>
      <div className="concern-section"><span className="concern-index">01 — Identify</span><div className="concern-grid">
        <Line label="Child" value={record?.studentName || legacy.studentName}/><Line label="Year / class / form" value={`${record?.year || legacy.year} · ${record?.form || legacy.form}`}/>
        <Line label="Date of birth" value={record?.dateOfBirth}/><Line label="Gender (if relevant)" value={record?.gender}/>
        <Line label="Incident date & time" value={record?.incidentAt}/><Line label="Report completed" value={record?.completedAt || legacy.reported}/>
        <Line label="Reporter & role" value={record ? `${record.reporter} · ${record.position}` : legacy.reporter}/><Line label="Visitor contact (if applicable)" value={record?.visitorContact}/>
      </div></div>
      <div className="concern-section"><span className="concern-index">02 — What happened</span><div className="concern-grid">
        <Block label="Location" value={record?.location}/>
        <Block label="Who else was present" value={record?.present}/>
        <Block label="Original concern summary" value={record ? undefined : legacy.concern}/>
        <Block label="What I saw or heard" value={record?.observed || legacy.context} hint="Describe observations, not conclusions or labels."/>
        <Block label="Child’s exact words or actions" value={record?.childWords || (legacy.voice !== 'Student perspective not yet recorded.' ? legacy.voice : '')} hint="Where possible, preserve the child’s words as spoken."/>
        <Block label="My response and any open questions" value={record?.response}/>
        <Block label="Injuries or pain" value={record?.injuries} hint="If relevant, follow your school’s body-map procedure separately."/>
        <Block label="Other children or adults involved" value={record?.otherPeople}/>
        <Block label="Previous similar concerns" value={record?.previous}/>
        <Block label="Professional views, clearly attributed" value={record?.professionalViews}/>
      </div></div>
      <div className="concern-section concern-section-last"><span className="concern-index">03 — Pass it on</span><div className="concern-grid">
        <Line label="Passed to (DSL / DDSL)" value={record?.safeguardingLead}/>
        <Line label="Handover date & time" value={record?.handoffAt}/>
        <Line label="Link Manager (case owner)" value={record?.manager || legacy.manager}/>
        <Line label="Reporter sign-off" value={record ? 'Name captured for demonstration only — no signature' : undefined}/>
      </div></div>
    </div>
    <div className="concern-handoff"><div className="concern-step-number">02</div><div><strong>DSL / DDSL action record</strong><p>Separate from the reporter’s account: immediate response, risk, parent/carer contact, feedback, Request for Support and rationale, referral consent, further actions and sign-off. {dslAction ? 'A fictional prototype entry is shown below.' : 'No DSL action is recorded for this case.'}</p></div><span className={dslAction ? 'concern-status' : 'concern-pending'}>{dslAction ? 'Demo entry' : 'Not recorded'}</span></div>
    {dslAction && <div className="concern-paper concern-dsl-readonly">
      <div className="concern-paper-top"><div><span className="concern-kicker">DSL/DDSL action form · illustrative</span><h4>Actions &amp; decision</h4></div><ClipboardCheck size={20}/></div>
      <div className="concern-section"><div className="concern-grid">
        <Block label="Immediate response / information gathered" value={dslAction.response}/><Block label="Immediate risk assessment" value={dslAction.risk}/>
        <Block label="Parent/carer contact" value={dslAction.parentContact}/><Block label="Their response" value={dslAction.parentResponse}/>
        <Block label="Reason not informed, if applicable" value={dslAction.parentNotInformedReason}/><Block label="Feedback to child" value={dslAction.childFeedback}/>
        <Block label="Request for Support?" value={`${dslAction.requestSupport}${dslAction.agency ? ` · ${dslAction.agency}` : ''}`}/><Block label="Rationale for decision" value={dslAction.rationale}/>
        <Block label="Referral consent" value={dslAction.referralConsent}/><Block label="Reason consent not obtained, if applicable" value={dslAction.consentReason}/>
        <Block label="Feedback to reporting staff" value={dslAction.reporterFeedback}/><Block label="Feedback to other staff" value={dslAction.staffFeedback}/>
        <Block label="Further actions agreed" value={dslAction.furtherAction}/><Block label="DSL / DDSL name and completion" value={`${dslAction.dsl} · ${dslAction.completedAt.replace('T',' · ')}`}/>
      </div></div>
    </div>}
    {!dslAction && <div className="concern-dsl-action"><button className="triage-secondary" onClick={()=>setDslOpen(v=>!v)}>{dslOpen ? 'Close DSL form' : 'Explore DSL action form'} <ArrowRight size={13}/></button><span>Illustrative only · no role verification, referral or signature</span></div>}
    {dslOpen && !dslAction && <DslActionForm onCancel={()=>setDslOpen(false)} onSave={data=>{onSaveDsl(data);setDslOpen(false)}}/>}
    <div className="concern-source"><ClipboardCheck size={15}/><div><strong>Basis for this design</strong><p>{source}. Example guidance, not a certification of compliance; a school’s current safeguarding policy, local authority requirements and DSL review take precedence.</p></div><button className="triage-secondary" onClick={onSummary}>Case summary</button></div>
  </div>;
}

const blankDsl: DslActionData = { dsl:'',completedAt:'',response:'',risk:'',parentContact:'',parentResponse:'',parentNotInformedReason:'',childFeedback:'',requestSupport:'Not decided',agency:'',rationale:'',referralConsent:'Not applicable',consentReason:'',reporterFeedback:'',staffFeedback:'',furtherAction:'' };

function DslActionForm({ onCancel, onSave }: { onCancel:()=>void; onSave:(data:DslActionData)=>void }) {
  const [form, setForm] = useState<DslActionData>(blankDsl);
  const [error,setError] = useState('');
  const put = (key:keyof DslActionData,value:string) => setForm(prev=>({...prev,[key]:value}));
  const field = (key:keyof DslActionData,label:string,hint?:string) => <Field label={label} hint={hint}><textarea rows={2} value={form[key]} onChange={e=>put(key,e.target.value)}/></Field>;
  const save = () => {
    if (!form.dsl.trim() || !form.completedAt || !form.response.trim() || !form.risk.trim() || form.requestSupport==='Not decided' || !form.rationale.trim()) { setError('Complete the DSL name, completion time, immediate response, risk, support decision and rationale.'); return; }
    if (form.requestSupport==='Yes' && !form.agency.trim()) { setError('Name the agency/service for a Request for Support.'); return; }
    if ((form.parentContact==='Not informed' && !form.parentNotInformedReason.trim()) || (form.requestSupport==='Yes' && form.referralConsent==='No' && !form.consentReason.trim())) { setError('Record the rationale when parents were not informed or referral consent was not obtained.'); return; }
    setError(''); onSave(form);
  };
  return <div className="concern-dsl-form">
    <div className="concern-safety"><ShieldAlert size={18}/><div><strong>DSL / DDSL only — illustrative interface.</strong><p>This prototype cannot verify your role or fulfil your school’s safeguarding obligations. In the actual workflow, access must be restricted and actions, conversations, consent, referral and acknowledgement independently evidenced.</p></div></div>
    <div className="concern-form-section"><span className="concern-index">DSL action form · page 1</span><h3>Immediate response</h3><div className="concern-form-grid">
      {field('response','Actions taken & information gathered *','Include whom you spoke with and when.')}
      {field('risk','Immediate risk assessment *','What was considered and what safety steps followed?')}
      <Field label="Parent/carer contact"><select value={form.parentContact} onChange={e=>put('parentContact',e.target.value)}><option value="">Not yet recorded</option><option>Informed</option><option>Not informed</option><option>Unable to contact</option></select></Field>
      {field('parentResponse','Parent/carer response, date & time')}
      {field('parentNotInformedReason','Reason not informed / not yet contacted','Only when applicable; record the actual safeguarding rationale.')}
      {field('childFeedback','Feedback to child, date & time','If not given, note why.')}
    </div></div>
    <div className="concern-form-section"><span className="concern-index">DSL action form · page 2</span><h3>Decision &amp; follow-through</h3><div className="concern-form-grid">
      <Field label="Request for Support made? *"><select value={form.requestSupport} onChange={e=>put('requestSupport',e.target.value)}><option>Not decided</option><option>Yes</option><option>No</option></select></Field>
      <Field label="Agency / service">{<input value={form.agency} onChange={e=>put('agency',e.target.value)} placeholder="Required if Yes"/>}</Field>
      {field('rationale','Rationale for action / decision *')}
      <Field label="Parental consent for referral"><select value={form.referralConsent} onChange={e=>put('referralConsent',e.target.value)}><option>Not applicable</option><option>Yes</option><option>No</option><option>Not yet recorded</option></select></Field>
      {field('consentReason','If no consent, record rationale','The attached example identifies risk of harm, impact on investigation or immediate safety from delay as possible reasons; school policy and DSL judgement govern.')}
      {field('reporterFeedback','Feedback to reporting staff · date & time')}
      {field('staffFeedback','Other staff informed · who, why, date & time')}
      {field('furtherAction','Further action agreed · owner and review date')}
      <Field label="DSL / DDSL full name *"><input value={form.dsl} onChange={e=>put('dsl',e.target.value)} placeholder="Name and role"/></Field>
      <Field label="Date & time completed *"><input type="datetime-local" value={form.completedAt} onChange={e=>put('completedAt',e.target.value)}/></Field>
    </div><p className="concern-note">Name entry is not a digital signature. No request or notification is actually sent.</p></div>
    {error && <p className="concern-error" role="alert">{error}</p>}
    <div className="concern-form-footer"><button className="triage-secondary" onClick={onCancel}>Cancel</button><button className="triage-primary" onClick={save}>Add fictional action record <Check size={14}/></button></div>
  </div>;
}

type FieldProps = { label: string; hint?: string; required?: boolean; children: React.ReactNode };
function Field({ label, hint, required, children }: FieldProps) {
  return <label className="concern-field"><span>{label}{required && <b> *</b>}</span>{hint && <small>{hint}</small>}{children}</label>;
}

export function ConcernForm({ managers, onCancel, onSubmit }: {
  managers: string[]; onCancel: () => void; onSubmit: (data: ConcernRecordData) => void;
}) {
  const [form, setForm] = useState<ConcernRecordData>(blank);
  const [review, setReview] = useState(false);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false);
  const put = (key: keyof ConcernRecordData, value: string) => setForm(prev => ({ ...prev, [key]: value }));
  const input = (key: keyof ConcernRecordData, placeholder?: string, type = 'text') =>
    <input type={type} value={form[key]} onChange={e => put(key, e.target.value)} placeholder={placeholder}/>;
  const area = (key: keyof ConcernRecordData, placeholder?: string) =>
    <textarea value={form[key]} onChange={e => put(key, e.target.value)} placeholder={placeholder} rows={3}/>;
  const validate = () => {
    const required: (keyof ConcernRecordData)[] = ['studentName','form','incidentAt','reporter','position','location','observed','response','safeguardingLead','handoffAt','manager'];
    if (required.some(k => !form[k].trim())) { setError('Complete all fields marked * before reviewing the record.'); return; }
    if (form.handoffAt < form.incidentAt) { setError('The recorded handover cannot be earlier than the incident.'); return; }
    setError(''); setReview(true);
  };
  return <div className="concern-form">
    <div className="concern-safety"><ShieldAlert size={18}/><div><strong>Do not wait for this form if a child is at risk.</strong><p>Contact the designated safeguarding lead through your school’s approved route. This prototype is local and fictional; clicking submit will not notify anyone.</p></div></div>
    <div className="concern-form-steps"><span className={!review ? 'active' : ''}>01 · Factual record</span><span className={review ? 'active' : ''}>02 · Review &amp; handover</span></div>
    {!review ? <>
      <div className="concern-form-section"><span className="concern-index">01 — Identify</span><h3>Who, when and where</h3><div className="concern-form-grid">
        <Field label="Child’s full name" required>{input('studentName', 'First and surname')}</Field>
        <Field label="Year group"><select value={form.year} onChange={e=>put('year',e.target.value)}>{['Year 7','Year 8','Year 9','Year 10','Year 11','Year 12','Year 13'].map(y=><option key={y}>{y}</option>)}</select></Field>
        <Field label="Class / form group" required>{input('form', 'e.g. 9H')}</Field>
        <Field label="Date of birth">{input('dateOfBirth', undefined, 'date')}</Field>
        <Field label="Gender (if relevant)">{input('gender', 'Optional')}</Field>
        <Field label="Date & time of incident" required>{input('incidentAt', undefined, 'datetime-local')}</Field>
        <Field label="Reporter’s full name" required>{input('reporter', 'Your name')}</Field>
        <Field label="Role / position" required>{input('position', 'e.g. class teacher')}</Field>
        <Field label="Visitor contact details" hint="If the reporter is a visitor.">{input('visitorContact', 'Only if applicable')}</Field>
      </div></div>
      <div className="concern-form-section"><span className="concern-index">02 — Record the concern</span><h3>Describe, don’t diagnose</h3><div className="concern-form-grid">
        <Field label="Where did it happen?" required>{input('location', 'e.g. science classroom')}</Field>
        <Field label="Who else was present?">{input('present', 'Names or roles, if known')}</Field>
        <Field label="What you saw or heard" hint="Factual observations, times and sequence. Avoid assumptions." required>{area('observed', 'Describe what happened in your own words.')}</Field>
        <Field label="Child’s words or actions" hint="Quote exactly if possible; if none, leave blank.">{area('childWords', 'Use quotation marks for direct words.')}</Field>
        <Field label="Your response and open-ended questions" required>{area('response', 'What did you say or do? Which clarifying questions were asked?')}</Field>
        <Field label="Signs of injury or pain" hint="Record what was observed; follow local body-map procedure if needed.">{area('injuries', 'If none observed, say so if appropriate.')}</Field>
        <Field label="Other children or adults involved">{area('otherPeople', 'Distinguish first-hand from second-hand information.')}</Field>
        <Field label="Previous similar concerns">{area('previous', 'Only what you know; attribute the source.')}</Field>
        <Field label="Professional views" hint="Clearly separate a view from fact and identify whose view it is.">{area('professionalViews', 'Optional professional context.')}</Field>
      </div></div>
      <div className="concern-form-section"><span className="concern-index">03 — Handover</span><h3>Make responsibility explicit</h3><div className="concern-form-grid">
        <Field label="Person passed to (DSL / DDSL)" required>{input('safeguardingLead', 'Full name and role')}</Field>
        <Field label="Date & time passed on" required>{input('handoffAt', undefined, 'datetime-local')}</Field>
        <Field label="Named Link Manager" required><select value={form.manager} onChange={e=>put('manager',e.target.value)}>{managers.map(m=><option key={m}>{m}</option>)}</select></Field>
      </div><p className="concern-note">Handover entries are unverified text in this prototype. A production system must not mark them as received without a confirmed DSL/DDSL acknowledgement.</p></div>
      {error && <p className="concern-error" role="alert">{error}</p>}
      <div className="concern-form-footer"><button className="triage-secondary" onClick={onCancel}>Cancel</button><button className="triage-primary" onClick={validate}>Review record <ArrowRight size={14}/></button></div>
    </> : <>
      <div className="concern-review"><span className="concern-kicker">Check before adding locally</span><h3>Does this reflect what you know?</h3><p>This is not a signed or sent safeguarding report. Review direct words separately from your observations.</p>
        <Line label="Child / form" value={`${form.studentName} · ${form.form}`}/><Line label="Incident" value={form.incidentAt.replace('T',' · ')}/><Line label="Reporter" value={`${form.reporter} · ${form.position}`}/><Line label="Factual observation" value={form.observed}/><Line label="Child’s own words" value={form.childWords}/><Line label="Response" value={form.response}/><Line label="Handed to / when" value={`${form.safeguardingLead} · ${form.handoffAt.replace('T',' · ')}`}/>
        <label className="concern-confirm"><input type="checkbox" checked={confirm} onChange={e=>setConfirm(e.target.checked)}/><span>I have reviewed this fictional record and understand that no DSL notification, referral or signature will occur.</span></label>
      </div>
      <div className="concern-form-footer"><button className="triage-secondary" onClick={()=>setReview(false)}><ArrowLeft size={14}/> Edit record</button><button className="triage-primary" disabled={!confirm} onClick={()=>onSubmit({...form,completedAt:new Date().toLocaleString('en-GB',{dateStyle:'medium',timeStyle:'short'})})}>Add to prototype <Check size={14}/></button></div>
    </>}
    <div className="concern-source"><ClipboardCheck size={15}/><p>Based on {source}. This example is a design reference; use your current school/local authority process for real records.</p></div>
  </div>;
}