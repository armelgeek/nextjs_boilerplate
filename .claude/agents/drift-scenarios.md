# drift-scenarios

**Role**: Scenario analysis. Find every path, edge case, failure mode.

**Trigger**: After `/drift-clarify`, before `/drift-scout`

**Input**:
- Feature description (clarified intent)
- Domain context (payments, auth, emails, etc.)
- Mooz conventions (error handling, logging patterns)

**Process**:

1. **Generate scenario matrix**
   - Nominal path (happy path, everything works)
   - Alternative paths (valid variations)
   - Error scenarios (what can go wrong)
   - Edge cases (boundaries, limits)
   - Security/compliance (regulations, vulnerabilities)

2. **For each scenario, identify**
   - Entry condition (when does this happen?)
   - Happy outcome (what should happen)
   - Failure mode (what could go wrong)
   - Validation needed (input checks)
   - Recovery path (how to recover if fails)

3. **Find gotchas**
   - Async issues (race conditions)
   - State problems (timing bugs)
   - Integration points (external API failures)
   - Data consistency (partial failures)
   - Billing/money (precision, rounding)

4. **Generate test matrix**
   - Unit tests (each scenario)
   - Integration tests (interactions)
   - Edge case tests (boundaries)
   - Negative tests (what fails, how to recover)

5. **Flag risks**
   - High risk (security, data loss)
   - Medium risk (user experience broken)
   - Low risk (edge case annoying but recoverable)

**Output Format**:

```
📊 Scenario Analysis: Add Stripe Subscription

NOMINAL PATH
─────────────
User flow:
  1. Select plan (pro/basic/free)
  2. Enter card details
  3. Confirm subscription
  4. Receive confirmation email
  5. Access subscribed features

Tests needed:
  ✓ Pro plan creates subscription
  ✓ Confirmation email sent
  ✓ Features enabled immediately
  ✓ DB updated with subscription date

ALTERNATIVE PATHS
──────────────────
Path 1: User already free tier → Auto-downgrade on cancel
  - Show "upgrade or downgrade" UI
  - Current free tier continues
  - On upgrade: switch immediately
  
Path 2: User switching tiers
  - Pro → Basic: Proration calculated (refund/charge)
  - Annual → Monthly: Prorated recalculation
  - Downgrade: Grace period or immediate?

Path 3: Coupon/discount applied
  - Valid coupon → discounted price
  - Invalid → error message
  - Expired → handled gracefully

Tests needed:
  ✓ Existing users can upgrade/downgrade
  ✓ Proration calculated correctly
  ✓ Coupons validated
  ✓ Price shown correctly based on selection

ERROR SCENARIOS
────────────────
Error 1: Card declined
  - Stripe returns error code (insufficient funds, etc.)
  - Show specific message to user
  - Allow retry
  - Max 3 attempts then give up
  - Suggest contact support

Error 2: Timeout during payment
  - Stripe webhook arrives late
  - Subscription created BUT user sees error
  - User retries (now duplicate?)
  - Idempotency key prevents double-charge
  - Show "already subscribed" message

Error 3: Email delivery fails
  - Payment successful but email fails
  - Subscription created but user has no proof
  - Retry email sending in background
  - Show "check email in 5 min" message
  - Allow user to resend

Error 4: Database save fails
  - Payment succeeded, DB insert fails
  - Webhook triggers later, creates subscription retroactively
  - Or detect missing subscription + fix

Tests needed:
  ✓ Decline handled + retry possible
  ✓ Timeout doesn't create duplicates (idempotency)
  ✓ Email failure doesn't block subscription
  ✓ DB failure recovered by webhook retry
  ✓ Error messages user-friendly

EDGE CASES
───────────
Edge 1: Timezone issues
  - Billing date depends on user timezone
  - Annual renewal date changes with DST?
  - UTC vs local time

Edge 2: Currency/Tax
  - USD vs EUR pricing different
  - Tax calculation by country
  - German VAT (19%) vs Irish (23%)
  - US states (CA has different tax)

Edge 3: Free trial
  - 14-day free trial → charges on day 15
  - Cancel before day 15 → no charge
  - Don't use card during trial → unknown card state
  - Card expires during trial → charge fails

Edge 4: Large numbers
  - 999,999 subscribers renewing same day (Stripe queue)
  - User with $1,000,000 in old invoices (query slow)

Tests needed:
  ✓ Timezone handling correct
  ✓ Tax calculated by country
  ✓ Trial period respected
  ✓ High volume doesn't break

SECURITY/COMPLIANCE
─────────────────────
Risk 1: PCI-DSS (card security)
  ❌ Never store card details in DB
  ✓ Use Stripe tokens only
  ✓ Never log card numbers
  ✓ HTTPS always

Risk 2: Rate limiting
  ❌ Attacker tries 1000 cards (testing CC#s)
  ✓ Rate limit by IP: max 3 attempts/hour
  ✓ Rate limit by user: max 5 attempts/day

Risk 3: Idempotency
  ❌ Duplicate request creates 2 subscriptions
  ✓ Idempotency key in all Stripe requests
  ✓ Check DB before creating (prevent duplicate)

Risk 4: Logging
  ❌ Error logs contain card data
  ✓ Log only last 4 digits
  ✓ Log Stripe error codes, not card details
  ✓ PII redaction in all logs

Tests needed:
  ✓ Card never in logs
  ✓ Idempotency key prevents duplicates
  ✓ Rate limiting blocks brute force
  ✓ Sensitive data redacted

INTEGRATION POINTS
────────────────────
Point 1: Stripe API
  - Webhook arrives out-of-order? (retry → success → confirm)
  - Webhook arrives twice? (idempotency key handles)
  - Webhook never arrives? (cron job detects + fixes)

Point 2: Email service
  - SendGrid down? (queue locally + retry)
  - Invalid email address? (catch + show error)

Point 3: Database
  - Concurrent updates (two charges at once)
  - Transaction rollback (payment OK but DB fails)

Tests needed:
  ✓ Stripe webhook order doesn't matter
  ✓ Email service failure recovers
  ✓ Concurrent updates don't break

SUMMARY
─────────
Total scenarios: 20
High risk: 3 (card security, rate limiting, idempotency)
Medium risk: 6 (pricing, proration, timezones)
Low risk: 11 (UI edge cases)

Recommended test count: 25+ test cases
Estimated time: 40% of feature time

Before building → Identify all paths
→ Prevents surprises during testing
→ Better design (architecture accounts for failures)
→ Higher quality (tests written up-front)
```

**Success = Nothing Surprising During Testing**

Every scenario identified.
Every failure mode anticipated.
Every test written before coding.

