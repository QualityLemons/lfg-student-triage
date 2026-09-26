import { z } from 'zod';
import type { Case } from './case-types';

export const STORAGE_KEY = 'lfg-student-triage-demo-v1';
const text = z.string();
const record = z.object({
  studentName:text,year:text,form:text,dateOfBirth:text,gender:text,incidentAt:text,completedAt:text,reporter:text,position:text,visitorContact:text,
  location:text,present:text,observed:text,childWords:text,response:text,injuries:text,otherPeople:text,previous:text,professionalViews:text,
  safeguardingLead:text,handoffAt:text,manager:text,
}).strict();
const dsl = z.object({
  dsl:text,completedAt:text,response:text,risk:text,parentContact:text,parentResponse:text,parentNotInformedReason:text,childFeedback:text,
  requestSupport:text,agency:text,rationale:text,referralConsent:text,consentReason:text,reporterFeedback:text,staffFeedback:text,furtherAction:text,
}).strict();
const passport = z.object({
  reviewed:text,important:text,communication:text,help:text,likes:text,dislikes:text,
}).strict();
const caseSchema = z.object({
  passport:passport.optional(),record:record.optional(),dslAction:dsl.optional(),
  id:text.min(1),name:text.min(1),year:text,form:text,manager:text,status:z.enum(['On Track','Due Soon','Breached']),
  stage:z.number().int().min(1).max(7),deadline:text,concern:text,context:text,voice:text,reporter:text,reported:text,decision:text,rationale:text,
  actions:z.array(z.object({id:z.number(),text:text,owner:text,due:text,done:z.boolean()}).strict()),
  acknowledgements:z.record(text,z.boolean()),checklist:z.record(text,z.boolean()),history:z.array(text),closed:z.boolean().optional(),
}).strict();
const envelope = z.object({ version:z.literal(1), revision:z.number().int().nonnegative(), cases:z.array(caseSchema).min(1) }).strict();
export type Snapshot = { version: 1; revision: number; cases: Case[] };

export function parseSnapshot(raw: string | null): Snapshot | null {
  if (raw === null) return null;
  const value = envelope.parse(JSON.parse(raw));
  if (new Set(value.cases.map(c => c.id)).size !== value.cases.length) throw new Error('Duplicate case IDs in stored data.');
  return value as Snapshot;
}

export function readSnapshot(storage: Storage): Snapshot | null {
  return parseSnapshot(storage.getItem(STORAGE_KEY));
}

// Check immediately before every write. A stale tab must reload, not overwrite.
export function writeSnapshot(storage: Storage, expected: number | null, cases: Case[]): Snapshot {
  const current = readSnapshot(storage);
  if ((current?.revision ?? null) !== expected) throw new Error('This tab has an older copy of the cases. Reload this page before making changes.');
  const next: Snapshot = { version: 1, revision: (current?.revision ?? 0) + 1, cases };
  const encoded = JSON.stringify(next);
  parseSnapshot(encoded);
  storage.setItem(STORAGE_KEY, encoded);
  return next;
}

export function resetSnapshot(storage: Storage, cases: Case[]): Snapshot {
  // An explicit reset is the only operation permitted to replace damaged data.
  let current: Snapshot | null = null;
  try { current = readSnapshot(storage); } catch { /* Only explicit confirmation permits replacing damaged data. */ }
  const next: Snapshot = { version: 1, revision: Math.max(Date.now(), (current?.revision ?? 0) + 1), cases };
  storage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}