insert into public.service_packages
  (category, name, slug, best_for, description, starting_price, price_unit, turnaround, sort_order)
values
  ('society_accounting', 'Society Essentials', 'society-essentials',
   'Up to 30 flats',
   'Best for: smaller societies that want clean, reliable monthly books.',
   3000.00, 'per month', '5 working days after month-end', 1),

  ('society_accounting', 'Society Standard', 'society-standard',
   '31-75 flats',
   'Best for: mid-sized societies that want AGM-ready records year-round.',
   6000.00, 'per month', 'Monthly, plus AGM pack 2 weeks prior', 2),

  ('society_accounting', 'Society Premium', 'society-premium',
   '75+ flats / audit-heavy societies',
   'Best for: larger societies or committees that want full oversight and priority turnaround.',
   10000.00, 'per month', 'Priority, 2-3 working days', 3);






insert into public.service_package_features (package_id, feature_text, sort_order) values
  ((select id from public.service_packages where slug = 'society-essentials'),
   'Monthly maintenance bill preparation and collection tracking', 1),
  ((select id from public.service_packages where slug = 'society-essentials'),
   'Society ledger and cash book maintenance', 2),
  ((select id from public.service_packages where slug = 'society-essentials'),
   'Monthly bank reconciliation', 3),
  ((select id from public.service_packages where slug = 'society-essentials'),
   'Member account statements, provided on request', 4),

  ((select id from public.service_packages where slug = 'society-standard'),
   'Everything in Society Essentials, plus:', 1),
  ((select id from public.service_packages where slug = 'society-standard'),
   'Detailed income & expenditure statements', 2),
  ((select id from public.service_packages where slug = 'society-standard'),
   'AGM documentation and minutes support (one AGM per year included)', 3),
  ((select id from public.service_packages where slug = 'society-standard'),
   'Defaulter list preparation and tracking', 4),
  ((select id from public.service_packages where slug = 'society-standard'),
   $$Coordination support with your society's statutory auditor$$, 5),

  ((select id from public.service_packages where slug = 'society-premium'),
   'Everything in Society Standard, plus:', 1),
  ((select id from public.service_packages where slug = 'society-premium'),
   'Priority processing and faster response times', 2),
  ((select id from public.service_packages where slug = 'society-premium'),
   'Support with statutory audit coordination and compliance paperwork (including GST/TDS-related documentation)', 3),
  ((select id from public.service_packages where slug = 'society-premium'),
   'Committee handover documentation support when office-bearers change', 4);



   insert into public.service_packages
  (category, name, slug, best_for, description, starting_price, price_unit, turnaround, sort_order)
values
  ('business_accounting', 'Starter Bookkeeping', 'starter-bookkeeping',
   'Individuals & freelancers',
   'Best for: individuals and freelancers who want their finances organized.',
   1500.00, 'per month', '5 working days after month-end', 1),

  ('business_accounting', 'Business Growth', 'business-growth',
   'Small businesses',
   'Best for: small businesses with regular day-to-day transactions.',
   4000.00, 'per month', '5-7 working days', 2),

  ('business_accounting', 'Comprehensive Accounting', 'comprehensive-accounting',
   'Growing businesses',
   'Best for: established or growing small businesses needing full bookkeeping support.',
   7500.00, 'per month', '7 working days; priority available', 3);




insert into public.service_package_features (package_id, feature_text, sort_order) values
  ((select id from public.service_packages where slug = 'starter-bookkeeping'),
   'Monthly income and expense tracking', 1),
  ((select id from public.service_packages where slug = 'starter-bookkeeping'),
   'Basic ledger maintenance', 2),
  ((select id from public.service_packages where slug = 'starter-bookkeeping'),
   'Simple monthly summary report', 3),

  ((select id from public.service_packages where slug = 'business-growth'),
   'Everything in Starter Bookkeeping, plus:', 1),
  ((select id from public.service_packages where slug = 'business-growth'),
   'Invoice and billing support', 2),
  ((select id from public.service_packages where slug = 'business-growth'),
   'Journal and ledger maintenance', 3),
  ((select id from public.service_packages where slug = 'business-growth'),
   'Monthly financial statement (profit & loss snapshot)', 4),

  ((select id from public.service_packages where slug = 'comprehensive-accounting'),
   'Everything in Business Growth, plus:', 1),
  ((select id from public.service_packages where slug = 'comprehensive-accounting'),
   'Full financial statements (profit & loss, balance sheet support)', 2),
  ((select id from public.service_packages where slug = 'comprehensive-accounting'),
   'Bank reconciliation', 3),
  ((select id from public.service_packages where slug = 'comprehensive-accounting'),
   'Coordination support with your Chartered Accountant for tax filings', 4);







   insert into public.service_packages
  (category, name, slug, best_for, description, starting_price, price_unit, turnaround, sort_order)
values
  ('typing_services', 'Pay-Per-Document', 'pay-per-document',
   'Occasional needs',
   'Best for: one-off letters, forms, resumes, or applications.',
   50.00, 'per page', 'Same day to 1 working day', 1),

  ('typing_services', 'Society Documentation Bundle', 'society-documentation-bundle',
   'Societies (monthly)',
   'Best for: societies with recurring notices, circulars, and reports.',
   1000.00, 'per month (up to 20 pages)', '1-2 working days per request', 2),

  ('typing_services', 'Business Documentation Bundle', 'business-documentation-bundle',
   'Businesses (monthly)',
   'Best for: small businesses with regular correspondence and documentation.',
   1200.00, 'per month (up to 25 pages)', '1-2 working days per request', 3);

insert into public.service_package_features (package_id, feature_text, sort_order) values
  ((select id from public.service_packages where slug = 'pay-per-document'),
   'Accurate typing of letters, applications, forms, and resumes', 1),
  ((select id from public.service_packages where slug = 'pay-per-document'),
   'Proofreading included', 2),
  ((select id from public.service_packages where slug = 'pay-per-document'),
   'Delivery via WhatsApp or email', 3),

  ((select id from public.service_packages where slug = 'society-documentation-bundle'),
   'Up to 20 pages of society documentation per month (notices, circulars, AGM papers, reports)', 1),
  ((select id from public.service_packages where slug = 'society-documentation-bundle'),
   'Proofreading and formatting included', 2),
  ((select id from public.service_packages where slug = 'society-documentation-bundle'),
   'Additional pages billed at the standard per-page rate', 3),

  ((select id from public.service_packages where slug = 'business-documentation-bundle'),
   'Up to 25 pages of business documentation per month (letters, forms, reports, correspondence)', 1),
  ((select id from public.service_packages where slug = 'business-documentation-bundle'),
   'Proofreading and formatting included', 2),
  ((select id from public.service_packages where slug = 'business-documentation-bundle'),
   'Additional pages billed at the standard per-page rate', 3);











   insert into public.blog_posts (slug, title, excerpt, content_markdown, tags, is_published, published_at) values
(
  '5-common-society-accounting-mistakes',
  '5 Common Mistakes Co-operative Housing Societies Make in Accounting (and How to Avoid Them)',
  'Small oversights in society accounting can snowball into bigger problems at audit time or during committee handovers -- here are five to watch for.',
  $md$Running a co-operative housing society is rarely simple -- and when it comes to accounting, small oversights can snowball into bigger problems at audit time or during committee handovers. Here are five mistakes we frequently see, and how to avoid them.

**1. Mixing Personal and Society Funds** -- Even temporarily, using society funds for stopgap expenses before reimbursement can create confusion in the books and raise red flags during audits. Keep society funds strictly separate at all times.

**2. Delayed or Inconsistent Bill Recording** -- Maintenance bills raised late or recorded inconsistently make it difficult to track defaulters and calculate accurate dues. A fixed monthly billing cycle, recorded promptly, keeps collections aligned with records.

**3. Skipping Regular Bank Reconciliation** -- Many societies only reconcile bank statements once a year, right before the audit -- meaning errors can go unnoticed for months. Monthly reconciliation catches mistakes early and keeps books audit-ready year-round.

**4. Poor Documentation of Committee Decisions** -- Financial decisions made in committee meetings -- like approving a vendor payment -- should always be backed by minutes and supporting documents. Missing paperwork is one of the most common audit objections.

**5. No Clear Handover Process** -- When committee members change, financial records and access often aren't transferred properly, leading to gaps in information. A documented handover checklist protects the society's financial history.

**How M. R. Services Can Help** -- We manage day-to-day society accounting, bank reconciliation, and documentation so your committee always has accurate, audit-ready records -- no matter how often committee members change. [Contact us](/contact) to discuss your society's accounting needs.$md$,
  array['society-accounting','audit','common-mistakes'],
  true, now() - interval '75 days'
),
(
  'understanding-your-maintenance-bill',
  'A Simple Guide to Understanding Your Society''s Maintenance Bill',
  'A plain-language breakdown of what typically goes into a co-operative society maintenance bill, from sinking fund to non-occupancy charges.',
  $md$If you've ever looked at your monthly maintenance bill and wondered how the amount was calculated, you're not alone. Here's a simple breakdown of what typically goes into it.

- **Common Area Maintenance Charges** -- Covers upkeep of lifts, staircases, gardens, security, and common lighting, usually divided among flats.
- **Sinking Fund** -- A mandatory contribution set aside for major future repairs, such as structural work or repainting.
- **Repairs & Maintenance Fund** -- Covers ongoing minor repairs, distinct from the sinking fund which is for larger, long-term expenses.
- **Non-Occupancy Charges** -- Applicable if a flat is rented out rather than self-occupied, as per society bye-laws.
- **Parking Charges** -- Calculated per allotted parking space, if applicable.
- **Insurance Charges** -- Contribution towards the society's building insurance premium.
- **Interest on Arrears** -- Levied on overdue payments if bills aren't cleared within the due date.

**Why Accuracy Matters** -- Errors in maintenance bill calculation -- over- or under-charging -- can lead to member disputes and compliance issues during audits. Clear, well-documented billing protects both the society and its members.

**How M. R. Services Can Help** -- We prepare and maintain accurate, transparent maintenance bills for co-operative societies, so members always know exactly what they're paying for. [Contact us](/contact) to streamline your society's billing process.$md$,
  array['society-accounting','maintenance-bill'],
  true, now() - interval '60 days'
),
(
  'why-small-business-needs-bookkeeping',
  'Why Every Small Business Needs Proper Bookkeeping From Day One',
  'Postponing "formal" bookkeeping until a business grows is one of the most common regrets owners share later -- here is why starting early matters.',
  $md$It's tempting for a new small business to postpone "formal" bookkeeping until things get bigger -- but this is one of the most common regrets business owners share later. Here's why starting early matters.

**1. You Can't Manage What You Don't Track** -- Without organized records, it's difficult to know your actual profit, outstanding payments, or unnecessary spending.

**2. Tax Time Becomes Far Less Stressful** -- Well-maintained books mean you're never scrambling to reconstruct a year's transactions before a filing deadline.

**3. It Builds Credibility** -- Whether approaching a bank for a loan or bringing on a partner, clean financial records signal professionalism.

**4. Early Mistakes Are Cheaper to Fix** -- A bookkeeping error caught in month one is a five-minute correction; the same error left for a year can mean hours of reconciliation.

**5. It Helps You Make Better Decisions** -- Accurate, up-to-date books let you see real trends, so you can adjust before small issues become big ones.

**Getting Started Doesn't Have to Be Complicated** -- You don't need elaborate software or a full-time accountant to begin -- simple, consistent bookkeeping updated weekly puts you miles ahead.

**How M. R. Services Can Help** -- We provide affordable bookkeeping and accounting support tailored for small businesses and individuals, so you can focus on running your business while we keep the numbers straight. [Contact us](/contact) to get started.$md$,
  array['business-accounting','bookkeeping'],
  true, now() - interval '45 days'
),
(
  'gst-tds-basics-for-housing-societies',
  'GST and TDS Basics Every Housing Society Should Know',
  'A general overview of when GST and TDS rules can apply to a housing society -- not a substitute for professional tax advice, but a starting point.',
  $md$Many housing society committee members are surprised to learn that GST and TDS rules can apply to their society under certain conditions. Here is a general overview -- not a substitute for professional tax advice, but a starting point for understanding your society's obligations.

**When GST May Apply** -- If a housing society's aggregate turnover (including maintenance collections) exceeds the prescribed threshold in a financial year, and per-member monthly maintenance exceeds the specified limit, GST registration and compliance may become applicable. Thresholds can change, so it's worth checking current limits with a tax professional.

**When TDS May Apply** -- If a society makes certain payments -- to contractors, professionals, or for larger annual maintenance/repair contracts -- above prescribed thresholds, TDS deduction and deposit rules may apply.

**Why This Matters for Committees** -- Non-compliance, even unintentional, can result in penalties, interest, and complications during audits. Understanding these basics helps committees ask the right questions.

**What Societies Should Keep in Mind**
- Track total annual collections and payments carefully
- Maintain documentation for all large payments and contracts
- Review applicability with a qualified tax professional periodically, as rules and thresholds are revised from time to time

> **A note on this article:** This is general educational information, not professional tax advice. Every society's situation is different, and GST/TDS rules can change -- always confirm current applicability with a qualified chartered accountant or tax consultant before taking action.

**How M. R. Services Can Help** -- We help societies maintain the accurate records and documentation needed for compliance, and can coordinate with your appointed auditor or tax professional as needed. [Contact us](/contact) to learn more.$md$,
  array['society-accounting','gst','tds','compliance'],
  true, now() - interval '30 days'
),
(
  'preparing-for-your-society-agm',
  'How to Prepare for Your Housing Society''s Annual General Meeting (AGM)',
  'Good preparation makes the difference between a smooth AGM and a chaotic one -- a simple seven-point checklist for committees.',
  $md$The AGM is one of the most important events on a housing society's calendar -- and good preparation makes the difference between a smooth meeting and a chaotic one. Here is a simple checklist.

**1. Finalize Financial Statements Early** -- Income & expenditure statements, balance sheets, and audit reports should be ready well before the AGM date.

**2. Prepare and Circulate the Notice** -- As per bye-laws, the AGM notice with agenda typically needs to reach all members within a specified number of days in advance.

**3. Compile Supporting Documents** -- Have receipts, vendor contracts, and committee meeting minutes ready in case members raise questions about specific expenses.

**4. List Pending Approvals** -- Any decisions requiring member approval, such as major repair work or bye-law amendments, should be clearly listed on the agenda.

**5. Address the Defaulters List Carefully** -- Prepare an accurate, updated list of maintenance defaulters, handled sensitively as per society rules.

**6. Assign Someone to Record Minutes** -- Accurate minutes protect the society and its committee; make sure someone is responsible for recording decisions during the meeting.

**7. Plan for Follow-Up** -- After the AGM, ensure decisions are documented, communicated to members, and reflected in the society's records.

**How M. R. Services Can Help** -- We assist societies with AGM documentation -- from preparing financial statements to organizing supporting records -- so your committee walks in fully prepared. [Contact us](/contact) ahead of your next AGM.$md$,
  array['society-accounting','agm'],
  true, now() - interval '15 days'
),
(
  'benefits-of-outsourcing-accounting',
  'The Benefits of Outsourcing Accounting and Documentation Work for Small Businesses',
  'Outsourcing bookkeeping and documentation, even in a small way, often pays for itself -- five reasons it is worth considering.',
  $md$Many small business owners try to manage their own books and paperwork in the early days, often because it feels like the "cheaper" option. But outsourcing this work, even in a small way, often pays for itself.

**1. You Get Your Time Back** -- Every hour spent reconciling invoices or typing documents is an hour not spent growing your business.

**2. Fewer Costly Errors** -- A dedicated accounting professional catches issues you might miss while juggling everything else.

**3. Professional-Looking Documentation** -- Professionally typed and formatted documents create a stronger impression than last-minute, error-prone drafts.

**4. Scalable Support Without Full-Time Costs** -- Outsourcing lets you get exactly the level of support you need, without the overhead of a full-time hire.

**5. Better Financial Visibility** -- With organized, up-to-date books, you always know where your business stands financially.

**Is It Right for You?** -- If bookkeeping or documentation work is piling up, taking time away from your core business, or causing avoidable stress, it may be time to bring in dedicated support.

**How M. R. Services Can Help** -- We offer flexible accounting and English typing support for small businesses and individuals, so you can offload the paperwork and focus on what you do best. [Contact us](/contact) to see how we can help.$md$,
  array['business-accounting','typing-services','outsourcing'],
  true, now() - interval '5 days'
);





-- content.md marks these explicitly as sample text -- "replace with real
-- client feedback as it's collected". They are seeded as-is (including
-- the bracketed placeholder names) so staging/local visibly shows real
-- layout with obviously-sample copy; replace them via Admin -> Testimonials
-- before go-live. Do NOT carry this block into the production seed.
-- ---------------------------------------------------------------------
insert into public.testimonials (quote, author_name, author_role, is_featured, sort_order) values
  ($q$Manali handled our society's accounts with great accuracy and patience -- always available when we needed her.$q$,
   'Secretary, [Society Name]', 'Sample -- replace before launch', true, 1),
  ($q$M. R. Services has managed our society's accounts for the past year, and everything is finally organized and transparent.$q$,
   'Secretary, [Society Name]', 'Sample -- replace before launch', false, 2),
  ('Quick, accurate typing work every time -- I send documents over WhatsApp and get them back the same day.',
   '[Client Name]', 'Individual Client (sample -- replace before launch)', false, 3),
  ($q$Affordable and professional. Helped streamline our small business's bookkeeping without any hassle.$q$,
   '[Business Owner Name]', 'Sample -- replace before launch', false, 4);





