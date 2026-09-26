import { ArrowRight, CalendarDays } from 'lucide-react';
import './AttendanceMapping.css';

type Mark = 'present' | 'late' | 'authorised' | 'unexplained' | 'pending';
type Mapping = {
  weeks: Mark[][];
  observation: string;
  discuss: string;
};

const examples: Record<string, Mapping> = {
  'ST-2048': {
    weeks: [
      ['present', 'present', 'present', 'late', 'present'],
      ['present', 'present', 'authorised', 'present', 'present'],
      ['present', 'late', 'present', 'present', 'present'],
      ['present', 'present', 'present', 'present', 'present'],
    ],
    observation: 'Two late arrivals appear in this sample. Check whether changes to the morning routine have made arrival harder; do not infer a cause from the marks alone.',
    discuss: 'Ask Maya privately what helps her settle after a timetable change and agree a predictable arrival plan with her Link Manager.',
  },
  'ST-2047': {
    weeks: [
      ['present', 'present', 'present', 'present', 'present'],
      ['present', 'present', 'late', 'present', 'present'],
      ['present', 'unexplained', 'present', 'present', 'present'],
      ['present', 'present', 'pending', 'present', 'present'],
    ],
    observation: 'One unexplained absence and one day without a recorded mark need checking against the official register. This day-level view cannot show the afternoon registration pattern in the concern.',
    discuss: 'Review session-level registration and talk with Leo and his family about the homeward journey before deciding next steps.',
  },
  'ST-2045': {
    weeks: [
      ['authorised', 'authorised', 'present', 'present', 'present'],
      ['present', 'present', 'present', 'present', 'present'],
      ['present', 'present', 'present', 'present', 'present'],
      ['present', 'present', 'present', 'present', 'present'],
    ],
    observation: 'Two authorised absence days appear at the start of this sample. Later days are marked present; the map does not measure readiness to return to a specific lesson.',
    discuss: 'Use Aisha’s own account and the agreed class-return plan alongside any register information.',
  },
  'ST-2043': {
    weeks: [
      ['present', 'present', 'present', 'present', 'present'],
      ['present', 'present', 'present', 'present', 'present'],
      ['present', 'present', 'present', 'present', 'present'],
      ['present', 'present', 'present', 'present', 'present'],
    ],
    observation: 'All twenty sampled days are marked present. Attendance does not tell us how Noah experienced the lunchtime disagreement.',
    discuss: 'Keep the pupil’s account central and avoid treating a stable attendance pattern as evidence that no support is needed.',
  },
  'ST-2039': {
    weeks: [
      ['present', 'present', 'authorised', 'present', 'present'],
      ['present', 'late', 'present', 'present', 'present'],
      ['present', 'present', 'present', 'authorised', 'present'],
      ['present', 'present', 'present', 'present', 'present'],
    ],
    observation: 'Two authorised absences and one late day appear in the sample. Coursework progress and attendance are different measures and should not be conflated.',
    discuss: 'Agree realistic coursework milestones with Ella and ask whether any timetable or catch-up support would help.',
  },
};

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const markLabels: Record<Mark, string> = {
  present: 'Present',
  late: 'Late, attended',
  authorised: 'Authorised absence',
  unexplained: 'Unexplained in this mock example',
  pending: 'No mark recorded in this mock example',
};

export function AttendanceMapping({
  caseId,
  studentName,
  expanded = false,
  onExplore,
}: {
  caseId: string;
  studentName: string;
  expanded?: boolean;
  onExplore?: () => void;
}) {
  const mapping = examples[caseId];
  if (!mapping) {
    return <section className="attendance-map" aria-label={`Attendance mapping for ${studentName}`}>
      <div className="attendance-map-header"><div><p className="attendance-map-eyebrow">Student profile / contextual view</p><h3 className="attendance-map-title">Attendance mapping</h3></div><span className="attendance-map-pill">No mapping recorded</span></div>
      <p className="attendance-map-subtitle">No illustrative attendance marks have been added for this new case. Check the school register and ask the student before drawing conclusions.</p>
    </section>;
  }
  const marks = mapping.weeks.flat();
  const attended = marks.filter(m => m === 'present' || m === 'late').length;
  const late = marks.filter(m => m === 'late').length;
  const authorised = marks.filter(m => m === 'authorised').length;
  const toCheck = marks.filter(m => m === 'unexplained' || m === 'pending').length;
  // Every weekday cell represents an expected session in this mock four-week
  // timetable. A blank mark stays provisional; it is not silently removed
  // from the denominator or treated as attended/absent.
  const possibleSessions = marks.length;
  const missingMarks = marks.filter(m => m === 'pending').length;
  const attendanceRate = possibleSessions ? (attended / possibleSessions) * 100 : null;

  return <section className="attendance-map" aria-label={`Attendance mapping for ${studentName}`}>
    <div className="attendance-map-header">
      <div>
        <p className="attendance-map-eyebrow">Student profile / contextual view</p>
        <h3 className="attendance-map-title">Attendance mapping</h3>
        <p className="attendance-map-subtitle">Illustrative day-level marks · four sample school weeks · not a live register</p>
      </div>
      <span className="attendance-map-pill"><CalendarDays size={12} aria-hidden="true"/> 4-week view</span>
    </div>
    <div className="attendance-map-stats" aria-label="Four-week attendance summary">
      <div className="attendance-map-stat attendance-map-rate"><strong>{attendanceRate === null ? '—' : `${attendanceRate.toFixed(1)}%`}</strong><span>Illustrative rate · {attended}/{possibleSessions} expected sessions attended, including late{missingMarks ? ' · provisional: mark to verify' : ''}</span></div>
      <div className="attendance-map-stat"><strong>{attended}<span aria-hidden="true"> / {possibleSessions}</span></strong><span>Sessions attended, including late</span></div>
      <div className="attendance-map-stat"><strong>{late}</strong><span>Late days</span></div>
      <div className="attendance-map-stat"><strong>{authorised}</strong><span>Authorised absence days</span></div>
      <div className="attendance-map-stat"><strong>{toCheck}</strong><span>Marks to verify</span></div>
    </div>
    <div className="attendance-map-grid" aria-label="Example school-day attendance marks">
      <div className="attendance-map-week head"><span className="attendance-map-week-label">Sample</span>{dayNames.map(day => <span className="attendance-map-day" key={day}>{day}</span>)}</div>
      {mapping.weeks.map((week, weekIndex) => <div className="attendance-map-week" key={weekIndex}>
        <span className="attendance-map-week-label">Week {weekIndex + 1}</span>
        {week.map((mark, dayIndex) => <span key={dayIndex} className={`attendance-map-day ${mark}`} aria-label={`Week ${weekIndex + 1}, ${dayNames[dayIndex]}: ${markLabels[mark]}`} title={`Week ${weekIndex + 1}, ${dayNames[dayIndex]}: ${markLabels[mark]}`}>{mark === 'present' ? 'P' : mark === 'late' ? 'L' : mark === 'authorised' ? 'A' : mark === 'unexplained' ? 'U' : '—'}</span>)}
      </div>)}
    </div>
    <div className="attendance-map-legend">
      {([['present','Present'],['late','Late · attended'],['authorised','Authorised absence'],['unexplained','Unexplained · check'],['pending','No mark · check']] as [Mark, string][]).map(([mark,label])=><span key={mark}><i className={`attendance-map-swatch ${mark}`} aria-hidden="true"/>{label}</span>)}
    </div>
    <div className="attendance-map-insight"><strong>What this sample suggests checking</strong><p>{mapping.observation}</p></div>
    {expanded && <div className="attendance-map-detail">
      <h4>Use alongside the whole story</h4>
      <p>{mapping.discuss}</p>
      <ul>
        <li>Confirm each mark against the official school register, including morning and afternoon sessions.</li>
        <li>Speak with the student and relevant adults before connecting attendance to a reported concern.</li>
        <li>Record support and follow-up separately; an attendance mark is not a safeguarding judgement or an intervention decision.</li>
      </ul>
      <div className="attendance-policy">
        <strong>Policy context · DfE (England)</strong>
        <p>DfE attendance rates use sessions attended as a share of possible sessions recorded in school MIS data. DfE reporting defines persistent absence as missing 10% or more of sessions and severe absence as 50% or more. This short illustration cannot establish either official year-to-date status.</p>
        <p>Possible sessions are sessions the pupil attended or was expected to attend; sessions they were not expected to attend are excluded. Here, all 20 weekday cells represent expected sample sessions. A blank mark stays in the denominator, but makes the rate provisional until the register is checked.</p>
        <div className="attendance-policy-links">
          <a href="https://www.gov.uk/government/publications/monitor-your-school-attendance-user-guide/monitor-your-school-attendance-user-guide" target="_blank" rel="noopener noreferrer">DfE · Monitor your school attendance user guide</a>
          <a href="https://www.gov.uk/government/publications/working-together-to-improve-school-attendance" target="_blank" rel="noopener noreferrer">DfE · Working together to improve school attendance</a>
        </div>
      </div>
      <p>This view uses fictional day-level sample marks for design exploration. It does not calculate official academic-year attendance, persistent or severe absence, penalty thresholds, or an SLA.</p>
    </div>}
    {!expanded && onExplore && <button type="button" className="attendance-map-link" onClick={onExplore}>Explore attendance context <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }}/></button>}
    <p className="attendance-map-footer">Fictional data only. Unexplained and missing marks are prompts to verify, not conclusions about the student.</p>
  </section>;
}