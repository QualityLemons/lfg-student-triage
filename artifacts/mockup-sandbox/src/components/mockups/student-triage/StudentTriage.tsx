import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, CalendarDays, Check, ClipboardList, Clock3, FileText, Filter, HeartHandshake, Info, LayoutList, Plus, Search, ShieldCheck, UserRound, UsersRound, X } from 'lucide-react';
import './StudentTriage.css';
import { CommunicationPassport, demoPassport, type Passport } from './_CommunicationPassport';
import { ConcernForm, RecordOfConcern, type ConcernRecordData, type DslActionData } from './ConcernRecord';

type Alert = 'On Track' | 'Due Soon' | 'Breached';
type Tab = 'Overview' | 'Report' | 'Triage' | 'Intervention' | 'Agreement' | 'Reintegration' | 'History';
type Action = { id: number; text: string; owner: string; due: string; done: boolean };
type Case = {
  passport?: Passport;
  record?: ConcernRecordData;
  dslAction?: DslActionData;
  id: string; name: string; year: string; form: string; manager: string; status: Alert; stage: number; deadline: string;
  concern: string; context: string; voice: string; reporter: string; reported: string; decision: string; rationale: string;
  actions: Action[]; acknowledgements: Record<string, boolean>; checklist: Record<string, boolean>; history: string[]; closed?: boolean;
};

const managers = ['Amira Patel', 'Daniel Hughes', 'Sophie Bennett', 'Marcus Reed'];
const initialCases: Case[] = [
  { id:'ST-2048', name:'Maya Thompson', year:'Year 9', form:'9H', manager:'Amira Patel', status:'Due Soon', stage:4, deadline:'Today, 15:30', concern:'Difficulty settling after a change in routine', context:'Maya left a science lesson after a timetable change. She returned to speak with staff after a short break.', voice:'“I did not know where I was meant to be, and everyone was looking at me.”', reporter:'Ms E. Foster · Science', reported:'Today, 09:12', decision:'Progress to intervention', rationale:'A predictable transition plan and a trusted check-in should reduce uncertainty before lessons.', actions:[{id:1,text:'Agree a quiet arrival routine for science',owner:'Ms E. Foster',due:'Tomorrow',done:true},{id:2,text:'Schedule morning check-in with Maya',owner:'Amira Patel',due:'Tomorrow',done:false},{id:3,text:'Share the lesson transition plan with home',owner:'Amira Patel',due:'Friday',done:false}], acknowledgements:{School:true,Student:false,Family:false}, checklist:{'Receiving teacher briefed':false,'First-day welcome arranged':false,'Check-in schedule agreed':false,'Student confirms readiness':false}, history:['Intervention plan drafted · Today, 11:20','Triage decision recorded · Today, 10:06','Reflective report submitted · Today, 09:12'] },
  { id:'ST-2047', name:'Leo Williams', year:'Year 8', form:'8C', manager:'Daniel Hughes', status:'Breached', stage:3, deadline:'Yesterday, 16:00', concern:'Repeated absence from afternoon registration', context:'Leo has missed two afternoon registrations this week; staff noted a recent change to his transport home.', voice:'“I worry I will miss my lift if I am late leaving.”', reporter:'Mr A. Shah · Form tutor', reported:'Yesterday, 08:45', decision:'Awaiting decision', rationale:'', actions:[], acknowledgements:{School:false,Student:false,Family:false}, checklist:{'Receiving teacher briefed':false,'First-day welcome arranged':false,'Check-in schedule agreed':false,'Student confirms readiness':false}, history:['SLA deadline passed · Yesterday, 16:00','Reflective report submitted · Yesterday, 08:45'] },
  { id:'ST-2045', name:'Aisha Rahman', year:'Year 10', form:'10B', manager:'Sophie Bennett', status:'On Track', stage:6, deadline:'Thu, 12:00', concern:'Supporting a confident return after time out', context:'Aisha is preparing to return to English following a short period of supported learning.', voice:'“I would like to know what I have missed before I go back.”', reporter:'Ms K. James · English', reported:'Monday, 14:26', decision:'Progress to intervention', rationale:'A paced return with a curriculum catch-up and named point of contact.', actions:[{id:1,text:'Prepare catch-up pack',owner:'Ms K. James',due:'Wednesday',done:true},{id:2,text:'Agree a first-lesson welcome',owner:'Sophie Bennett',due:'Thursday',done:true}], acknowledgements:{School:true,Student:true,Family:true}, checklist:{'Receiving teacher briefed':true,'First-day welcome arranged':true,'Check-in schedule agreed':false,'Student confirms readiness':false}, history:['Agreement acknowledged by all parties · Tuesday, 15:02','Intervention actions reviewed · Tuesday, 11:30','Reflective report submitted · Monday, 14:26'] },
  { id:'ST-2043', name:'Noah Clarke', year:'Year 7', form:'7F', manager:'Amira Patel', status:'On Track', stage:2, deadline:'Fri, 10:00', concern:'Peer disagreement during lunchtime', context:'A disagreement in the playground was de-escalated with staff support. Both pupils requested space.', voice:'“I want to sort it out, just not in front of everybody.”', reporter:'Mrs R. Lewis · Pastoral', reported:'Tuesday, 13:10', decision:'Awaiting decision', rationale:'', actions:[], acknowledgements:{School:false,Student:false,Family:false}, checklist:{'Receiving teacher briefed':false,'First-day welcome arranged':false,'Check-in schedule agreed':false,'Student confirms readiness':false}, history:['Reflective report submitted · Tuesday, 13:10'] },
  { id:'ST-2039', name:'Ella Morgan', year:'Year 11', form:'11D', manager:'Marcus Reed', status:'Due Soon', stage:5, deadline:'Tomorrow, 09:00', concern:'Agreed study support after missed coursework', context:'Ella has found recent coursework deadlines difficult alongside family commitments.', voice:'“It helps when the work is broken into smaller parts.”', reporter:'Mr J. Price · Design technology', reported:'Monday, 09:34', decision:'Progress to intervention', rationale:'A stepped coursework plan with brief weekly check-ins.', actions:[{id:1,text:'Break coursework into weekly milestones',owner:'Mr J. Price',due:'Tomorrow',done:false},{id:2,text:'Arrange weekly progress check-in',owner:'Marcus Reed',due:'Friday',done:false}], acknowledgements:{School:true,Student:true,Family:false}, checklist:{'Receiving teacher briefed':false,'First-day welcome arranged':false,'Check-in schedule agreed':false,'Student confirms readiness':false}, history:['Agreement shared for acknowledgement · Tuesday, 12:10','Intervention plan drafted · Monday, 15:20','Reflective report submitted · Monday, 09:34'] },
];

// Fictional training examples only. These are not statements about real pupils,
// verified handovers, referrals, family contact or safeguarding decisions.
const demoConcernDetails: Record<string, {
  incidentAt: string; location: string; present: string; observed: string;
  response: string; otherPeople: string; previous: string; professionalViews: string;
  dslResponse: string; risk: string; rationale: string; furtherAction: string;
}> = {
  'ST-2048': {
    incidentAt: '2026-09-24T09:05',
    location: 'Science classroom and corridor',
    present: 'Ms E. Foster; classmates were in the room.',
    observed: 'Following an announced timetable change, Maya left the science room. A member of staff saw her waiting in the corridor. She returned after a brief conversation and a short break.',
    response: 'Ms Foster spoke with Maya in a quiet space, asked what she needed for the next lesson and offered a written outline of the changed timetable.',
    otherPeople: 'Ms E. Foster witnessed the departure and return. No account from classmates is included.',
    previous: 'No earlier incident is described in this fictional example.',
    professionalViews: 'Amira Patel (Link Manager) suggested a predictable transition and check-in plan; this is a suggested response, not a diagnosis.',
    dslResponse: 'Illustrative review of the reporter’s factual account and Maya’s words. The named Link Manager was identified for a follow-up conversation.',
    risk: 'The fictional account does not describe an immediate safety concern. A real DSL would assess this independently and use the school’s current process.',
    rationale: 'For this example, a supportive transition plan and an opportunity to hear Maya’s preferences are indicated; no external referral is depicted.',
    furtherAction: 'Amira Patel to discuss a check-in and written timetable with Maya; review after the next science lesson. Demo plan only.',
  },
  'ST-2047': {
    incidentAt: '2026-09-23T13:20',
    location: 'Afternoon registration',
    present: 'Mr A. Shah, form tutor. Other attendees are not identified in the scenario.',
    observed: 'Leo was not present at afternoon registration on two occasions this week. The form tutor noted that Leo’s home transport arrangements had recently changed.',
    response: 'Mr Shah asked Leo privately whether there was anything making afternoon registration difficult and recorded his reply without further interpretation.',
    otherPeople: 'No other children or adults are named as directly involved in this fictional account.',
    previous: 'The same type of absence occurred twice in the example week; no longer history is provided.',
    professionalViews: 'Daniel Hughes (Link Manager) should confirm the registration and transport arrangements before drawing conclusions.',
    dslResponse: 'Illustrative preliminary review only. The registration pattern and transport concern were noted for clarification with the Link Manager.',
    risk: 'Impact on Leo’s safe journey home has not been assessed in this mock scenario. The breached case deadline does not itself constitute a safeguarding finding.',
    rationale: 'More information is needed before a response or referral decision can be described. No conclusion is inferred from absence alone.',
    furtherAction: 'Daniel Hughes to check the transport concern and registration times; DSL to review the findings through the school’s actual process.',
  },
  'ST-2045': {
    incidentAt: '2026-09-21T14:10',
    location: 'English classroom / supported learning transition',
    present: 'Ms K. James. No additional people are identified in the fictional scenario.',
    observed: 'Aisha was preparing to return to English after a period of supported learning. She asked about work she had missed before returning to the class.',
    response: 'Ms James listened to Aisha’s question and offered to identify the missed work and arrange a first-lesson check-in.',
    otherPeople: 'No other child or adult is reported to have witnessed a specific incident.',
    previous: 'A period of supported learning is mentioned; its reason and dates are not included in this example.',
    professionalViews: 'Sophie Bennett (Link Manager) proposed a paced return and a named point of contact, recorded here as a plan rather than an observed fact.',
    dslResponse: 'Illustrative review of a support and reintegration record. No separate safeguarding disclosure is depicted.',
    risk: 'No immediate safety information is supplied in the fictional source. A real reviewer would check the wider record and current plan.',
    rationale: 'Continue a supported return and capture Aisha’s own priorities. The mock record does not establish grounds for a referral.',
    furtherAction: 'Sophie Bennett and Ms James to agree a catch-up pack and first-lesson welcome with Aisha; review at the next check-in.',
  },
  'ST-2043': {
    incidentAt: '2026-09-22T12:45',
    location: 'Playground at lunchtime',
    present: 'Mrs R. Lewis; two pupils involved in the disagreement. The other pupil is not named in this mock record.',
    observed: 'Two pupils disagreed during lunch. Mrs Lewis intervened, and the pupils separated with staff support. Both requested some space.',
    response: 'Mrs Lewis checked with each pupil separately, gave them space and recorded Noah’s words without asking leading questions.',
    otherPeople: 'Another pupil was involved; their own account would require a separate record and is not reproduced here.',
    previous: 'No previous similar concern is provided in this fictional example.',
    professionalViews: 'Amira Patel (Link Manager) suggested a private restorative conversation only if both pupils are ready.',
    dslResponse: 'Illustrative initial review of the lunchtime report. A separate account from the other pupil is not available in this prototype.',
    risk: 'The information shown is insufficient to determine wider risk; no injury or threat is described in the source scenario.',
    rationale: 'Gather each pupil’s account without treating one as a substitute for the other; decide next steps after reviewing the complete picture.',
    furtherAction: 'Amira Patel to arrange separate check-ins and consider whether a restorative conversation is appropriate. Demo action only.',
  },
  'ST-2039': {
    incidentAt: '2026-09-21T09:15',
    location: 'Design technology lesson',
    present: 'Mr J. Price. No other person is specifically identified in this example.',
    observed: 'Mr Price noted that Ella had not completed a coursework milestone. Ella spoke about finding deadlines difficult alongside commitments at home.',
    response: 'Mr Price asked what would help her manage the next milestone and offered to break the remaining work into smaller steps.',
    otherPeople: 'No other children or adults are identified as involved.',
    previous: 'A missed coursework milestone is described; no wider pattern is evidenced in this fictional record.',
    professionalViews: 'Marcus Reed (Link Manager) proposed weekly check-ins, stated as a support option rather than a conclusion about Ella’s circumstances.',
    dslResponse: 'Illustrative review of an educational support concern. No safeguarding disclosure about home circumstances is assumed from Ella’s statement.',
    risk: 'The example does not provide information to assess an immediate risk. If Ella discloses more, staff would follow the school’s safeguarding route.',
    rationale: 'Support coursework planning and invite Ella to share what help would be useful; do not infer concerns beyond what she said.',
    furtherAction: 'Mr Price to agree weekly milestones with Ella; Marcus Reed to offer a private progress check-in. Demo plan only.',
  },
};

function mockDocumentation(c: Case): Pick<Case, 'record' | 'dslAction'> {
  const example = demoConcernDetails[c.id];
  if (!example) return {};
  const reporterParts = c.reporter.split(' · ');
  const completedAt = example.incidentAt.slice(0, 11) + '10:45';
  const record: ConcernRecordData = {
    studentName: c.name, year: c.year, form: c.form, dateOfBirth: '', gender: '',
    incidentAt: example.incidentAt, completedAt, reporter: reporterParts[0],
    position: reporterParts[1] ?? 'Staff member', visitorContact: '',
    location: example.location, present: example.present, observed: example.observed,
    childWords: c.voice, response: example.response, injuries: '', otherPeople: example.otherPeople,
    previous: example.previous, professionalViews: example.professionalViews,
    safeguardingLead: 'Demo DSL — handover unverified', handoffAt: completedAt, manager: c.manager,
  };
  const dslAction: DslActionData = {
    dsl: 'Demo DSL — illustrative entry, not a verified person',
    completedAt: example.incidentAt.slice(0, 11) + '11:25',
    response: example.dslResponse, risk: example.risk,
    parentContact: 'Not recorded in this fictional scenario', parentResponse: '',
    parentNotInformedReason: '', childFeedback: '',
    requestSupport: 'Not decided', agency: '', rationale: example.rationale,
    referralConsent: 'Not applicable — no referral depicted', consentReason: '',
    reporterFeedback: '', staffFeedback: '', furtherAction: example.furtherAction,
  };
  return { record, dslAction };
}

const stages = ['Link manager','Reporting','Alert status','Triage','Intervention','Agreement','Reintegration'];
const tabs: Tab[] = ['Overview','Report','Triage','Intervention','Agreement','Reintegration','History'];
const stageTabs: Tab[] = ['Overview','Report','Overview','Triage','Intervention','Agreement','Reintegration'];
const checklistLabels = ['Receiving teacher briefed','First-day welcome arranged','Check-in schedule agreed','Student confirms readiness'];
const parties = ['School','Student','Family'];
const alertClass = (status: Alert) => status === 'On Track' ? 'track' : status === 'Due Soon' ? 'soon' : 'breached';

export function StudentTriage() {
  const [cases, setCases] = useState<Case[]>(() => initialCases.map(c => ({
    ...c,
    ...(c.id === 'ST-2048' ? { passport: demoPassport } : {}),
    ...mockDocumentation(c),
  })));
  const [selectedId, setSelectedId] = useState('ST-2048');
  const [tab, setTab] = useState<Tab>(() => new URLSearchParams(window.location.search).get('show') === 'report' ? 'Report' : 'Overview');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All statuses');
  const [managerFilter, setManagerFilter] = useState('All managers');
  const [modal, setModal] = useState<'report'|'manager'|'summary'|null>(null);
  const [toast, setToast] = useState('');
  const [decision, setDecision] = useState('Progress to intervention');
  const [rationale, setRationale] = useState('');
  const [newAction, setNewAction] = useState({text:'',owner:'',due:''});
  const [showActionForm, setShowActionForm] = useState(false);
  const [newManager, setNewManager] = useState('Amira Patel');
  const selected = cases.find(c => c.id === selectedId) ?? cases[0];
  const visible = useMemo(() => cases.filter(c => {
    const matchesQuery = `${c.name} ${c.id} ${c.concern} ${c.year}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (filter === 'All statuses' || c.status === filter) && (managerFilter === 'All managers' || c.manager === managerFilter);
  }).sort((a,b) => ({Breached:0,'Due Soon':1,'On Track':2}[a.status] - {Breached:0,'Due Soon':1,'On Track':2}[b.status])), [cases,query,filter,managerFilter]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 3500); return () => clearTimeout(timer); }, [toast]);
  const updateCase = (updates: Partial<Case>, event?: string) => {
    setCases(prev => prev.map(c => c.id === selected.id ? {...c,...updates,history:event ? [event,...c.history] : c.history} : c));
  };
  const chooseCase = (id: string) => { setSelectedId(id); setTab('Overview'); setShowActionForm(false); };
  const nav = (target: string) => {
    if (target === 'Queue') { setManagerFilter('All managers'); setFilter('All statuses'); setQuery(''); setTab('Overview'); }
    if (target === 'My caseload') { setManagerFilter('Amira Patel'); setFilter('All statuses'); setQuery(''); setTab('Overview'); }
    if (target === 'Reports') { setManagerFilter('All managers'); setFilter('All statuses'); setTab('Report'); }
    if (target === 'Pathway') { setManagerFilter('All managers'); setFilter('All statuses'); setTab('Intervention'); }
  };
  const createReport = (record: ConcernRecordData) => {
    const id = `ST-${2050 + cases.length}`;
    const item: Case = {id,name:record.studentName.trim(),year:record.year,form:record.form.trim(),manager:record.manager,status:'On Track',stage:2,deadline:'Tomorrow, 15:30',concern:record.observed.trim().slice(0,110),context:record.observed.trim(),voice:record.childWords.trim() || 'Student perspective not yet recorded.',reporter:`${record.reporter.trim()} · ${record.position.trim()}`,reported:record.completedAt,decision:'Awaiting decision',rationale:'',actions:[],acknowledgements:{School:false,Student:false,Family:false},checklist:Object.fromEntries(checklistLabels.map(k=>[k,false])),history:['Record of concern added locally · Just now'],record};
    setCases(prev=>[item,...prev]); setSelectedId(id); setTab('Report'); setModal(null); setFilter('All statuses'); setManagerFilter('All managers'); setQuery(''); setToast('Fictional record added locally. No DSL notification or referral was sent.');
  };
  const recordDecision = () => {
    if (!rationale.trim()) { setToast('Add a short rationale before recording a triage decision.'); return; }
    const advancing = decision === 'Progress to intervention';
    updateCase({decision,rationale:rationale.trim(),stage: advancing ? Math.max(selected.stage,5) : selected.stage}, `Triage: ${decision.toLowerCase()} · Just now`);
    setToast('Triage decision saved locally.'); setRationale('');
  };
  const addAction = () => {
    if (!newAction.text.trim() || !newAction.owner.trim() || !newAction.due.trim()) { setToast('Add an action, owner and due date.'); return; }
    updateCase({actions:[...selected.actions,{id:Date.now(),text:newAction.text.trim(),owner:newAction.owner.trim(),due:newAction.due.trim(),done:false}],stage:Math.max(selected.stage,5)},'Intervention action added · Just now');
    setNewAction({text:'',owner:'',due:''}); setShowActionForm(false); setToast('Support action added locally.');
  };
  const acknowledge = (party: string) => {
    const next = {...selected.acknowledgements,[party]:!selected.acknowledgements[party]};
    updateCase({acknowledgements:next,stage:Object.values(next).every(Boolean) && selected.actions.length ? Math.max(selected.stage,6) : selected.stage},`${party} acknowledgement ${next[party] ? 'marked' : 'removed'} in prototype · Just now`);
    setToast('Prototype acknowledgement only — no real signature is captured.');
  };
  const toggleChecklist = (label: string) => {
    const next = {...selected.checklist,[label]:!selected.checklist[label]};
    updateCase({checklist:next,stage:Math.max(selected.stage,6)},`Reintegration checklist updated · Just now`);
  };
  const canClose = selected.actions.length > 0 && Object.values(selected.acknowledgements).every(Boolean) && Object.values(selected.checklist).every(Boolean);
  return <div className="triage-root">
    <div className="triage-shell">
      <aside className="triage-sidebar">
        <div className="triage-brand"><span className="triage-brand-mark">l</span><div><strong>lfg</strong><small>Student triage</small></div></div>
        <div><p className="triage-side-label">Workspace</p><div className="triage-nav">
          <button className={managerFilter === 'All managers' && tab === 'Overview' ? 'active':''} onClick={()=>nav('Queue')}><LayoutList size={16}/><span className="nav-copy">Triage queue</span><span>{cases.filter(c=>!c.closed).length}</span></button>
          <button className={managerFilter === 'Amira Patel' ? 'active':''} onClick={()=>nav('My caseload')}><UserRound size={16}/><span className="nav-copy">My caseload</span></button>
          <button className={tab === 'Report' ? 'active':''} onClick={()=>nav('Reports')}><FileText size={16}/><span className="nav-copy">Reports</span></button>
          <button className={tab === 'Intervention' ? 'active':''} onClick={()=>nav('Pathway')}><HeartHandshake size={16}/><span className="nav-copy">Support plans</span></button>
        </div></div>
        <div className="triage-side-note"><ShieldCheck size={17}/><strong>Care, with continuity.</strong>One record follows each student from first concern through a supported return to class.</div>
        <div className="triage-profile"><span className="triage-avatar">AP</span><div><strong>Amira Patel</strong><small>Link Manager · demo view</small></div></div>
      </aside>
      <main className="triage-main">
        <header className="triage-topbar"><div className="triage-breadcrumb">Student support <span style={{padding:'0 8px'}}> / </span> <strong>Triage workspace</strong></div><div className="triage-topright"><span className="triage-prototype">INTERACTIVE PROTOTYPE</span><span>Fictional student data</span></div></header>
        <div className="triage-content">
          <div className="triage-titlebar"><div><p className="triage-eyebrow">Pastoral care / Casework</p><h1>See the whole story.</h1><p className="triage-subtitle">A clear next step for every student who needs support.</p></div><button className="triage-primary" onClick={()=>setModal('report')}><Plus size={15}/> Record concern</button></div>
          <div className="triage-stats">
            <div className="triage-stat"><div className="triage-stat-label">Open cases <UsersRound size={13}/></div><div className="triage-stat-value">{cases.filter(c=>!c.closed).length}<small>across the team</small></div></div>
            <div className="triage-stat"><div className="triage-stat-label">On track <Check size={13}/></div><div className="triage-stat-value">{cases.filter(c=>c.status==='On Track'&&!c.closed).length}<small>with time to act</small></div></div>
            <div className="triage-stat"><div className="triage-stat-label">Due soon <Clock3 size={13}/></div><div className="triage-stat-value">{cases.filter(c=>c.status==='Due Soon'&&!c.closed).length}<small>attention today</small></div></div>
            <div className="triage-stat"><div className="triage-stat-label">Breached <Info size={13}/></div><div className="triage-stat-value">{cases.filter(c=>c.status==='Breached'&&!c.closed).length}<small>needs review</small></div></div>
          </div>
          <div className="triage-workspace">
            <section className="triage-panel" aria-label="Triage queue">
              <div className="triage-panel-head"><h2>Cases to attend to</h2><p>Ordered by deadline, with a named adult alongside every student.</p></div>
              <div className="triage-filters"><label className="triage-search"><Search size={14}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search students or cases" aria-label="Search cases"/></label><select className="triage-filter-select" aria-label="Filter by alert status" value={filter} onChange={e=>setFilter(e.target.value)}><option>All statuses</option><option>Breached</option><option>Due Soon</option><option>On Track</option></select><select className="triage-filter-select" aria-label="Filter by Link Manager" value={managerFilter} onChange={e=>setManagerFilter(e.target.value)}><option>All managers</option>{managers.map(m=><option key={m}>{m}</option>)}</select></div>
              <div className="triage-queue-meta"><span>{visible.length} {visible.length===1?'case':'cases'} shown</span><span><Filter size={11} style={{display:'inline',verticalAlign:'middle'}}/> Priority order</span></div>
              <div className="triage-case-list">{visible.length ? visible.map(c=><button key={c.id} className={`triage-case ${selected.id===c.id?'selected':''}`} onClick={()=>chooseCase(c.id)}>
                <div className="triage-case-top"><div><div className="triage-case-name">{c.name}</div><div className="triage-case-meta">{c.year} · {c.id} · {stages[c.stage-1]}</div></div><span className={`triage-badge ${alertClass(c.status)}`}><span className="triage-dot"/>{c.status}</span></div>
                <div className="triage-case-desc">{c.concern}</div><div className="triage-case-foot"><span><UserRound size={12}/> {c.manager}</span><span><Clock3 size={12}/> {c.deadline}</span></div>
              </button>) : <div className="triage-empty"><Search size={22}/><strong>No cases in this view</strong><p>Try a different search or filter.</p><button className="triage-text-button" onClick={()=>{setQuery('');setFilter('All statuses');setManagerFilter('All managers');}}>Clear filters</button></div>}</div>
            </section>
            <section className="triage-panel" aria-label="Selected case detail">
              <div className="triage-detail-head">
                <div className="triage-detail-top"><div><p className="triage-eyebrow" style={{marginBottom:5}}>CASE {selected.id} / {selected.year}</p><h2>{selected.name}</h2><p className="triage-case-meta">{selected.form} · {selected.concern}</p></div><div className="triage-detail-actions"><button className="triage-secondary" onClick={()=>{setNewManager(selected.manager);setModal('manager');}}><UserRound size={13}/> Reassign</button><button className="triage-secondary" onClick={()=>setModal('summary')}><FileText size={13}/> Case summary</button></div></div>
                <div className="triage-detail-status"><span className={`triage-badge ${alertClass(selected.status)}`}><span className="triage-dot"/>{selected.status}</span><span><strong>Next deadline</strong> · {selected.deadline}</span><span className="triage-separator"/><span><strong>Link Manager</strong> · {selected.manager}</span>{selected.closed && <span className="triage-badge track">Reintegrated</span>}</div>
                <button className="triage-secondary" style={{ marginTop: 12 }} onClick={()=>setTab('Overview')}><BookOpen size={14}/>{selected.passport ? 'Communication Passport available' : 'Communication Passport · not recorded'}</button>
              </div>
              <div className="triage-tabs" role="tablist">{tabs.map(t=><button role="tab" aria-selected={tab===t} key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</div>
              <div className="triage-tab-content">
                {tab === 'Overview' && <>
                  <CommunicationPassport key={selected.id} passport={selected.passport} manager={selected.manager}/>
                  <h3 className="triage-section-title">A pathway back to belonging</h3><p className="triage-section-sub">Seven connected stages. Select a stage to see what has happened and what comes next.</p>
                  <div className="triage-pathway">{stages.map((s,i)=><button key={s} className={`triage-step ${i+1<selected.stage?'done':''} ${i+1===selected.stage?'current':''}`} onClick={()=>setTab(stageTabs[i])}><span className="triage-step-number">{i+1<selected.stage?'✓':String(i+1).padStart(2,'0')}</span><span className="triage-step-label">{s}</span></button>)}</div>
                  <div className="triage-two-col"><div className="triage-info-box"><p className="triage-box-eyebrow">The student perspective</p><h3>What we have heard</h3><p>{selected.voice}</p><div className="triage-box-footer"><span>From reflective report</span><button className="triage-text-button" onClick={()=>setTab('Report')}>Read report <ArrowRight size={11} style={{display:'inline'}}/></button></div></div><div className="triage-info-box important"><p className="triage-box-eyebrow">Next meaningful step</p><h3>{selected.stage<=3?'Record a multidisciplinary decision':selected.stage===4?'Agree the support actions':selected.stage===5?'Gather acknowledgements':'Prepare a supported return'}</h3><p>{selected.stage<=3?'Review context and record a rationale before moving forward.':selected.stage===4?'Give each action a person and a date so the plan can be followed through.':selected.stage===5?'School, student and family should each understand the shared plan.':'Brief the receiving teacher and agree a check-in rhythm with the student.'}</p><div className="triage-box-footer"><span>{selected.decision}</span><button className="triage-text-button" onClick={()=>setTab(selected.stage<=3?'Triage':selected.stage===4?'Intervention':selected.stage===5?'Agreement':'Reintegration')}>Open stage <ArrowRight size={11} style={{display:'inline'}}/></button></div></div></div>
                  <div className="triage-mini-heading"><h3>Recent case activity</h3><button className="triage-text-button" onClick={()=>setTab('History')}>View history</button></div><div className="triage-activity">{selected.history.slice(0,2).map((h,i)=><div className="triage-activity-item" key={i}><strong>{h.split(' · ')[0]}</strong><small>{h.split(' · ')[1]}</small></div>)}</div>
                </>}
                {tab === 'Report' && <>
                  <div className="triage-notice" style={{ marginBottom: 18 }}>Fictional example documentation for {selected.name}. The quoted student words are part of the mock scenario; handover, DSL review and follow-up are illustrative entries only, not verified events. No real notification, referral or parent contact has occurred.</div>
                  <RecordOfConcern key={selected.id} record={selected.record} dslAction={selected.dslAction} legacy={{studentName:selected.name,year:selected.year,form:selected.form,concern:selected.concern,context:selected.context,voice:selected.voice,reporter:selected.reporter,reported:selected.reported,manager:selected.manager}} onSummary={()=>setModal('summary')} onSaveDsl={dslAction=>{updateCase({dslAction},'DSL action example added locally · Just now');setToast('Fictional DSL action added locally. No referral or notification was sent.');}}/>
                </>}
                {tab === 'Triage' && <><h3 className="triage-section-title">Multidisciplinary triage</h3><p className="triage-section-sub">Record a considered decision and the reason behind it.</p>{selected.status==='Breached' && <div className="triage-notice" style={{marginBottom:13}}>Deadline passed in this fictional case. A real system would surface an escalation and notify the relevant people; this prototype sends nothing.</div>}{selected.rationale && <div className="triage-info-box" style={{marginBottom:15}}><p className="triage-box-eyebrow">Recorded decision</p><h3>{selected.decision}</h3><p>{selected.rationale}</p></div>}<div className="triage-decision-grid">{[['Progress to intervention','Build a support plan with named actions'],['Request more information','Pause for a fuller picture'],['Refer elsewhere','Connect to a specialist team'],['Resolve at triage','Record why further action is not needed']].map(([title,sub])=><button key={title} className={decision===title?'active':''} onClick={()=>setDecision(title)}>{title}<small>{sub}</small></button>)}</div><label className="triage-field">Decision rationale<textarea value={rationale} onChange={e=>setRationale(e.target.value)} placeholder="What context informed this decision?"/></label><div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}><button className="triage-primary" onClick={recordDecision}>Record decision <ArrowRight size={13}/></button></div></>}
                {tab === 'Intervention' && <><h3 className="triage-section-title">A plan of support</h3><p className="triage-section-sub">Small, concrete actions — each with an owner and a date.</p>{selected.actions.length ? <div className="triage-list">{selected.actions.map(a=><div className="triage-list-row" key={a.id}><div><strong style={{textDecoration:a.done?'line-through':'none',opacity:a.done?.65:1}}>{a.text}</strong><small>{a.owner} · Due {a.due}</small></div><button className="triage-secondary" onClick={()=>updateCase({actions:selected.actions.map(item=>item.id===a.id?{...item,done:!item.done}:item)},`Action ${a.done?'reopened':'completed'} · Just now`)}>{a.done?<><Check size={12}/> Done</>:'Mark done'}</button></div>)}</div>:<div className="triage-empty" style={{background:'#f5f5ed',borderRadius:8}}><ClipboardList size={22}/><strong>No actions defined yet</strong><p>Start with one achievable step and give it a named owner.</p></div>}{showActionForm ? <div className="triage-inline-form"><label className="triage-field">Support action<input value={newAction.text} onChange={e=>setNewAction({...newAction,text:e.target.value})} placeholder="e.g. Agree a calm morning arrival"/></label><div className="triage-field-grid"><label className="triage-field">Owner<input value={newAction.owner} onChange={e=>setNewAction({...newAction,owner:e.target.value})} placeholder="Staff member's name"/></label><label className="triage-field">Due<input value={newAction.due} onChange={e=>setNewAction({...newAction,due:e.target.value})} placeholder="e.g. Thursday"/></label></div><div className="triage-form-actions"><button className="triage-secondary" onClick={()=>setShowActionForm(false)}>Cancel</button><button className="triage-primary" onClick={addAction}>Add action</button></div></div>:<button className="triage-secondary" style={{marginTop:14}} onClick={()=>setShowActionForm(true)}><Plus size={13}/> Add support action</button>}<div className="triage-callout" style={{marginTop:17,marginBottom:0}}><Info size={14}/> An intervention plan needs at least one action before an agreement can be marked complete.</div></>}
                {tab === 'Agreement' && <><h3 className="triage-section-title">A shared agreement</h3><p className="triage-section-sub">Understanding and commitment from the school, student and family.</p><div className="triage-notice" style={{marginBottom:15}}>Demo acknowledgements only. These are not signatures, legally binding agreements or messages to families.</div><div className="triage-info-box" style={{marginBottom:15}}><p className="triage-box-eyebrow">Agreement · draft version 1</p><h3>What we are agreeing to do</h3><p>{selected.actions.length ? selected.actions.map(a=>a.text).join(' · ') : 'A support plan has not been defined yet. Add an action before gathering acknowledgements.'}</p></div><div className="triage-list">{parties.map(p=><div className="triage-list-row" key={p}><div><strong>{p}</strong><small>{selected.acknowledgements[p]?'Marked as acknowledged in this prototype':'Awaiting prototype acknowledgement'}</small></div><button className="triage-secondary" disabled={!selected.actions.length} onClick={()=>acknowledge(p)}>{selected.acknowledgements[p]?<><Check size={12}/> Acknowledged</>:'Mark acknowledged'}</button></div>)}</div><p style={{color:'#72817b',fontSize:10,marginTop:12}}>{Object.values(selected.acknowledgements).filter(Boolean).length} of 3 acknowledgements marked. All three are needed before the return can be confirmed.</p></>}
                {tab === 'Reintegration' && <><h3 className="triage-section-title">A supported return to class</h3><p className="triage-section-sub">Closure means the student is back and supported, not simply that a plan exists.</p><div className="triage-info-box" style={{marginBottom:16}}><p className="triage-box-eyebrow">Return plan</p><h3>Make the first day feel predictable</h3><p>Confirm the receiving teacher has the right context, agree an arrival, and make space to hear how the student feels about returning.</p></div>{checklistLabels.map(label=><label key={label} className="triage-checkrow"><input type="checkbox" checked={selected.checklist[label]??false} onChange={()=>toggleChecklist(label)}/><span><strong>{label}</strong><small>{label==='Check-in schedule agreed'?'Plan a follow-up at 30, 60 and 90 days.':'A practical step towards a confident return.'}</small></span></label>)}<div className="triage-mini-heading"><h3>Return confirmation</h3></div><div className="triage-callout"><CalendarDays size={15}/> {canClose?'All prototype prerequisites are complete. You can confirm the return locally.':'Complete the checklist, define an intervention action and mark all agreement acknowledgements before confirming return.'}</div><button className="triage-primary" disabled={!canClose || !!selected.closed} onClick={()=>{updateCase({closed:true,stage:7},'Reintegration confirmed in prototype · Just now');setToast('Return confirmed locally. No external records were changed.');}}>{selected.closed?'Return confirmed':'Confirm supported return'}</button></>}
                {tab === 'History' && <><h3 className="triage-section-title">Case history</h3><p className="triage-section-sub">A running account of the steps taken in this local prototype.</p><div className="triage-activity">{selected.history.map((h,i)=><div className="triage-activity-item" key={`${h}-${i}`}><strong>{h.split(' · ')[0]}</strong><small>{h.split(' · ')[1] || 'Recorded locally'}</small></div>)}</div><div className="triage-notice">For illustration only: this is not a production audit trail.</div></>}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
    {modal && <div className="triage-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(null)}}><div className="triage-modal" style={modal==='report'?{width:'min(760px,100%)'}:undefined} role="dialog" aria-modal="true" aria-label={modal==='report'?'New record of concern':modal==='manager'?'Reassign Link Manager':'Case summary'}>
      <div className="triage-modal-head"><div><p className="triage-eyebrow">{modal==='report'?'RECORD OF CONCERN':modal==='manager'?'CASE OWNERSHIP':'TEXT PREVIEW'}</p><h2>{modal==='report'?'Notice. Record. Hand over.':modal==='manager'?'Change Link Manager':'Case summary'}</h2><p>{modal==='report'?'Reporter’s factual account and named safeguarding handover, with a distinct DSL response.':modal==='manager'?`Choose the adult who will own ${selected.name}'s case.`:'A readable local summary; no document is generated.'}</p></div><button className="triage-icon-button" aria-label="Close dialog" onClick={()=>setModal(null)}><X size={17}/></button></div>
      {modal==='report' && <div className="triage-modal-body"><ConcernForm managers={managers} onCancel={()=>setModal(null)} onSubmit={createReport}/></div>}
      {modal==='manager' && <><div className="triage-modal-body"><div className="triage-notice">This changes only the fictional case on screen. No notifications are sent.</div><label className="triage-field">Named Link Manager<select value={newManager} onChange={e=>setNewManager(e.target.value)}>{managers.map(m=><option key={m}>{m}</option>)}</select></label></div><div className="triage-modal-foot"><button className="triage-secondary" onClick={()=>setModal(null)}>Cancel</button><button className="triage-primary" onClick={()=>{if(newManager!==selected.manager)updateCase({manager:newManager},`Link Manager changed to ${newManager} · Just now`);setModal(null);setToast('Link Manager changed locally; no notification was sent.');}}>Save assignment</button></div></>}
      {modal==='summary' && <><div className="triage-modal-body"><div className="triage-notice">On-screen text preview only. Not an exported report, official record or shareable document.</div><div className="triage-info-box"><p className="triage-box-eyebrow">{selected.id} · {selected.year} · {selected.form}</p><h3>{selected.name}</h3><p>Link Manager: {selected.manager}<br/>Reported by: {selected.reporter} · {selected.reported}<br/>Deadline: {selected.deadline} ({selected.status})</p></div><div className="triage-info-box"><p className="triage-box-eyebrow">Context and response</p><h3>{selected.concern}</h3><p>{selected.context}<br/><br/>Student voice: {selected.voice}<br/><br/>Triage: {selected.decision}{selected.rationale?` — ${selected.rationale}`:''}<br/>Support actions: {selected.actions.length ? selected.actions.map(a=>a.text).join('; ') : 'Not yet defined'}</p></div></div><div className="triage-modal-foot"><button className="triage-primary" onClick={()=>setModal(null)}>Done</button></div></>}
    </div></div>}
    {toast && <div className="triage-toast" role="status">{toast}</div>}
  </div>;
}