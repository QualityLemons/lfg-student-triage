import type { Passport } from './_CommunicationPassport';
import type { ConcernRecordData, DslActionData } from './ConcernRecord';

export type Alert = 'On Track' | 'Due Soon' | 'Breached';
export type Tab = 'Overview' | 'Attendance' | 'Report' | 'Triage' | 'Intervention' | 'Agreement' | 'Reintegration' | 'History';
export type Action = { id: number; text: string; owner: string; due: string; done: boolean };
export type Case = {
  passport?: Passport;
  record?: ConcernRecordData;
  dslAction?: DslActionData;
  id: string; name: string; year: string; form: string; manager: string; status: Alert; stage: number; deadline: string;
  concern: string; context: string; voice: string; reporter: string; reported: string; decision: string; rationale: string;
  actions: Action[]; acknowledgements: Record<string, boolean>; checklist: Record<string, boolean>; history: string[]; closed?: boolean;
};