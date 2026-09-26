# LFG Student Triage (standalone browser demo)

## GitHub Pages

The standalone frontend can be hosted on GitHub Pages. The API server and canvas development environment cannot run there; they can remain in this repository as source. The frontend currently works without them.

For this repository's project site, build from the repository root:

```sh
corepack enable
corepack prepare pnpm@10.26.1 --activate
pnpm install --frozen-lockfile
PORT=4173 BASE_PATH=/lfg-student-triage/ pnpm --filter @workspace/student-triage run build
```

Publish only `artifacts/student-triage/dist/public` using GitHub Pages, not the repository root. In a GitHub Actions Pages workflow, use Node.js 22, run the commands above, upload that directory with `actions/upload-pages-artifact`, and deploy it with `actions/deploy-pages`. The workflow needs `contents: read`, `pages: write` and `id-token: write` permissions and the `github-pages` environment. Enable **Settings → Pages → Source: GitHub Actions** after adding the workflow.

Use `BASE_PATH=/` instead for a user/organisation site or a custom domain served at its root. Case links use query parameters, so they do not require server-side route rewrites.

Hosting does not add authentication, shared records or secure storage. Use fictional data only. Browser data on a GitHub Pages origin is separate from the Replit preview and is not migrated by uploading the project. Do not put secrets or real student information in the repository.

The web app in `artifacts/student-triage` is a fictional, standalone React/Vite demonstration of the approved student-triage workflow. It needs no login, API server or database. From the workspace root, use `pnpm --filter @workspace/student-triage typecheck` to check types, or run the web artifact through the normal project workflow. For focused persistence checks, run `cd artifacts/student-triage && node --experimental-strip-types --test src/components/student-triage/case-storage.test.mjs` (Node 22+).

**Do not enter real student data.** The sample names, records, attendance marks, handovers, DSL actions and acknowledgements are fictional. Recording an item does not contact anyone, authenticate a user, confirm a handover or send a referral or notification. The safeguarding help panel has no configured school DSL phone/email; use the school's actual safeguarding procedures and contact list, or UK emergency services in immediate danger.

Edits are kept in this browser's `localStorage` only, under a versioned schema. They are not encrypted, backed up, shared between devices, or suitable for official records; anyone with access to the same browser profile may access them. Browser clearing/private browsing/storage restrictions can erase or block edits. Damaged or incompatible saved state is displayed as an error and is not silently replaced. Use the explicit **Reset sample data** confirmation to discard local changes (including damaged state). Other tabs on the same origin receive storage updates; writes check their last-seen revision and block stale edits, though browser storage is not a transactional multi-user database. Case and tab can be linked with `?case=ST-2048&show=Attendance`. Downloaded text summaries remain on the device and should not be mistaken for official records.

# LFG Student Triage

An interactive design prototype for supporting students from an initial concern through triage, intervention and a supported return to the classroom.

**Status: mock-up, not an operational school system.** All student records are fictional. Changes are held in browser component state and reset on reload. Do not enter real student or safeguarding information.

## What you can explore

- **Casework and triage:** search cases, filter by alert status or Link Manager, view case history and explore the seven-stage pathway.
- **Concern and disclosure records:** distinct examples for five fictional students, separating the reporter’s factual account and the child’s words from the DSL/DDSL response. A concern form includes validation and review before adding a local record.
- **Communication Passport:** a visible availability indicator and expandable communication guidance. Profiles without an example show “No passport recorded”, not an assumption that support is unnecessary.
- **Attendance mapping:** four weeks of illustrative marks, summary counts, a sample attendance percentage and linked DfE context.
- **Intervention:** support actions with owners, due dates and completion states.
- **Agreement:** illustrative acknowledgements by school, student and family, not legally binding signatures.
- **Reintegration:** a supported-return checklist and local confirmation, with follow-up prompts.
- **Safeguarding help:** an accessible control in the navigation ribbon, opening contact and escalation guidance.

The pathway is: **Link Manager → Reporting → Alert Status → Triage → Intervention → Agreement → Return & Reintegration**.

## Preview

Open the project’s **Preview**, toggle on the canvas and open the **LFG Student Triage** frame at full size.

The component preview route is:

```text
/__mockup/preview/student-triage/StudentTriage
```

It is served by the existing **artifacts/mockup-sandbox: Component Preview Server** workflow. Use that managed workflow for the preview rather than starting a duplicate server.

To check the prototype’s TypeScript:

```sh
pnpm --filter @workspace/mockup-sandbox run typecheck
```

## Safeguarding and policy boundaries

- Opening the help panel or submitting a mock concern **does not notify a Designated Safeguarding Lead (DSL), send a referral, or confirm a handover**.
- Approved school contact details have not been configured. DSL call and email controls remain disabled. The emergency `999` link opens a device dialler; it does not place a call automatically.
- For a real concern, follow the school’s safeguarding procedures immediately. Do not rely on this prototype.
- Example handovers, DSL actions, deadlines and histories are illustrative, not verified records or an immutable audit trail.
- The all-party acknowledgement gate and staged closure rules come from the project requirements. They must not be represented as universal DfE requirements or used to delay a pupil’s return.
- Guidance notes offer context and considerations, not diagnoses, automatic sanctions or compliance certification.
- Before operational use, the workflow needs review against current school and local authority policies, with approval from the school’s safeguarding leadership.

## Attendance calculation

The prototype calculates:

```text
sample attendance % = (present + late sample marks) / expected sample sessions × 100
```

Each of the 20 weekday cells represents one expected sample session. This simplified model is **not** a complete morning/afternoon register or an official academic-year calculation. “Late” is treated as attended in this mock model; live calculations must use the applicable registration codes.

Missing marks remain in the denominator and make the displayed rate provisional pending verification.

Linked DfE context describes persistent absence as missing **10% or more** of possible sessions and severe absence as missing **50% or more**. The short mock sample does not assign either official status, calculate penalty thresholds or automatically trigger intervention.

## Reference material

- [Product Requirements Document](STUDENT-TRIAGE-PRD.md) — proposed scope, acceptance criteria and phasing; not a statement that all features are implemented.
- Hertfordshire CPSLO Service, *Example and guidance for Record of Concern*, **2023–2024 v1**, supplied during design — basis for the concern and DSL action record structure.
- [Oxford Health Communication Passport example](https://www.oxfordhealth.nhs.uk/wp-content/uploads/oxtc/resources/Communication-passport-example01.pdf) — structure for person-centred communication guidance; the prototype uses its own fictional example.
- [DfE behaviour guidance and resources](https://www.gov.uk/government/publications/behaviour-in-schools--2/further-guidance-and-resources-for-supporting-behaviour-in-schools).
- [Behaviour in schools: advice for headteachers and school staff, February 2024](https://assets.publishing.service.gov.uk/media/65ce3721e1bdec001a3221fe/Behaviour_in_schools_-_advice_for_headteachers_and_school_staff_Feb_2024.pdf) — source-linked considerations for triage, intervention, agreement and reintegration.
- [Monitor your school attendance: user guide](https://www.gov.uk/government/publications/monitor-your-school-attendance-user-guide/monitor-your-school-attendance-user-guide).
- [Working together to improve school attendance](https://www.gov.uk/government/publications/working-together-to-improve-school-attendance).

DfE references apply to England. Check current versions and local applicability before using them operationally.

## Project structure

```text
STUDENT-TRIAGE-PRD.md                 Product requirements
artifacts/mockup-sandbox/            React + Vite prototype environment
  src/components/mockups/student-triage/
    StudentTriage.tsx                Casework interface and fictional case data
    ConcernRecord.tsx                Concern forms and DSL response presentation
    AttendanceMapping.tsx            Sample attendance mapping and guidance
    _CommunicationPassport.tsx       Communication profile section
    _SafeguardingHelp.tsx            Safeguarding contact panel
artifacts/api-server/               Starter API; not a student-record backend
lib/                                Shared workspace packages
```

The prototype uses React, TypeScript, Vite, Tailwind CSS, Radix UI and Lucide icons in a pnpm workspace.

## Before a live system

The mock-up does not implement authentication, role-restricted student access, secure persistent records, verified handovers, real notifications, referrals, statutory attendance integration, retention controls or production audit history. These require implementation and validation before any real student data is used.