---
name: email-auth-verification
description: Verifies domain email authentication by inspecting DNS for SPF, DKIM, and DMARC records. Use when the user asks to check email security, DMARC readiness, SPF/DKIM/DMARC records, domain authentication status, or strict DMARC enforcement preparation.
---

# Email Authentication Verification

Act as an expert network and email security engineer. Verify whether a domain's DNS is configured for secure email authentication and strict DMARC enforcement.

## Quick start

```bash
pip install dnspython
python .cursor/skills/email-auth-verification/scripts/verify_email_auth.py example.com
```

Optional: probe a known DKIM selector:

```bash
python .cursor/skills/email-auth-verification/scripts/verify_email_auth.py example.com --selector s20210108
```

Exit codes: `0` = all clear, `1` = warnings, `2` = errors or DNS failure.

## Workflow

1. **Run the script** with the target domain (bare hostname, no scheme).
2. **Review SPF** — confirm a single `v=spf1` TXT record at the root domain; flag multiples, missing `all`, or malformed mechanisms.
3. **Review DKIM** — script probes common selectors (`default`, `google`, `k1`, `mandrill`, `s1`, etc.) at `[selector]._domainkey.[domain]`. Always note that full DKIM verification requires the exact selector from the mail provider.
4. **Review DMARC** — confirm `v=DMARC1` at `_dmarc.[domain]`; parse `p=`, `rua=`, `pct=` and summarize alignment status:
   - `p=none` → Monitoring (none)
   - `p=quarantine` → Quarantined
   - `p=reject` → Rejecting
5. **Summarize readiness** for strict enforcement: SPF valid, DKIM discoverable, DMARC present with `p=quarantine` or `p=reject`.

## Output expectations

Present results in structured terminal sections with clear indicators:

| Indicator | Meaning |
|-----------|---------|
| `✓` / `[✓]` | Record found and structurally OK |
| `⚠` | Missing record or non-critical issue |
| `✗` | Structural error (multiple records, invalid syntax) |

Each section (SPF, DKIM, DMARC) must include:
- Whether the record exists
- Raw record value when found
- Parsed tags and a brief policy summary for DMARC
- Explicit warnings when records are missing

End with a **Summary** noting whether the domain is ready for strict DMARC enforcement and recommended next steps.

## When modifying the script

- Use **Python 3** and **`dnspython`** only (no third-party DNS libraries).
- Keep SPF validation focused on obvious structural issues: multiple records, missing terminal `all`, unknown mechanisms, deprecated `ptr`.
- Do not claim full DKIM validation without the provider's selector — discovery via common selectors is best-effort.
- DMARC must always query `_dmarc.[domain]` specifically.

## Strict enforcement checklist

Domain is ready for strict DMARC when all are true:

- [ ] Exactly one valid SPF record with a terminal `all` mechanism
- [ ] DKIM record found (or confirmed selector published)
- [ ] DMARC record at `_dmarc.[domain]` with `p=quarantine` or `p=reject`
- [ ] `rua=` aggregate reporting configured for monitoring
- [ ] `pct=100` (or intentional partial rollout documented)

## Additional resources

- Script: [scripts/verify_email_auth.py](scripts/verify_email_auth.py)
