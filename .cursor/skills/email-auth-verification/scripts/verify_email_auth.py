#!/usr/bin/env python3
"""Verify SPF, DKIM, and DMARC DNS records for a domain."""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass, field
from typing import Iterable

import dns.exception
import dns.resolver


DEFAULT_DKIM_SELECTORS = ("default", "google", "k1", "mandrill", "s1", "selector1", "selector2", "mail", "dkim")
SPF_MECHANISM_RE = re.compile(
    r"^(?:[+\-~?])?(?:all|include:|a(?::|$)|mx(?::|$)|ptr(?::|$)|ip4:|ip6:|exists:|redirect=|exp=)",
    re.IGNORECASE,
)


@dataclass
class SpfResult:
    exists: bool = False
    records: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)


@dataclass
class DkimSelectorResult:
    selector: str
    record: str


@dataclass
class DmarcResult:
    exists: bool = False
    raw: str = ""
    policy: str | None = None
    rua: str | None = None
    pct: str | None = None
    warnings: list[str] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)


def normalize_domain(domain: str) -> str:
    domain = domain.strip().lower().rstrip(".")
    if domain.startswith("http://") or domain.startswith("https://"):
        raise ValueError("Provide a bare domain (e.g. example.com), not a URL.")
    if not domain or " " in domain or "/" in domain:
        raise ValueError("Invalid domain name.")
    return domain


def query_txt(name: str) -> list[str]:
    try:
        answers = dns.resolver.resolve(name, "TXT")
    except (dns.resolver.NXDOMAIN, dns.resolver.NoAnswer, dns.resolver.NoNameservers):
        return []
    except dns.exception.DNSException as exc:
        raise RuntimeError(f"DNS query failed for {name}: {exc}") from exc

    records: list[str] = []
    for rdata in answers:
        parts = [part.decode("utf-8", errors="replace") if isinstance(part, bytes) else str(part) for part in rdata.strings]
        records.append("".join(parts))
    return records


def parse_tagged_record(raw: str) -> dict[str, str]:
    tags: dict[str, str] = {}
    for part in raw.split(";"):
        part = part.strip()
        if not part or "=" not in part:
            continue
        key, _, value = part.partition("=")
        tags[key.strip().lower()] = value.strip()
    return tags


def validate_spf(record: str) -> tuple[list[str], list[str]]:
    warnings: list[str] = []
    errors: list[str] = []

    if not record.lower().startswith("v=spf1"):
        errors.append("SPF record must start with 'v=spf1'.")
        return warnings, errors

    tokens = record.split()
    if len(tokens) < 2:
        warnings.append("SPF record has no mechanisms after the version tag.")

    mechanisms = tokens[1:]
    has_include = any(token.lower().startswith("include:") for token in mechanisms)
    has_all = any(re.match(r"^[+\-~?]?all$", token, re.IGNORECASE) for token in mechanisms)

    if not has_include:
        warnings.append("No 'include:' tags found; verify authorized senders are declared.")
    if not has_all:
        errors.append("Missing terminal 'all' mechanism (e.g. '-all', '~all').")

    for token in mechanisms:
        if token.lower().startswith("v="):
            continue
        if not SPF_MECHANISM_RE.match(token):
            errors.append(f"Unrecognized or malformed SPF mechanism: '{token}'")

    if any(token.lower().startswith("ptr") for token in mechanisms):
        warnings.append("PTR mechanism is deprecated and should be avoided.")

    return warnings, errors


def check_spf(domain: str) -> SpfResult:
    result = SpfResult()
    txt_records = query_txt(domain)
    spf_records = [record for record in txt_records if record.lower().startswith("v=spf1")]

    if not spf_records:
        result.warnings.append("No SPF record found at the root domain.")
        return result

    result.exists = True
    result.records = spf_records

    if len(spf_records) > 1:
        result.errors.append(
            f"Multiple SPF records detected ({len(spf_records)}). Only one SPF TXT record is allowed."
        )

    for record in spf_records:
        warnings, errors = validate_spf(record)
        result.warnings.extend(warnings)
        result.errors.extend(errors)

    return result


def check_dkim(domain: str, selectors: Iterable[str]) -> list[DkimSelectorResult]:
    found: list[DkimSelectorResult] = []
    for selector in selectors:
        name = f"{selector}._domainkey.{domain}"
        for record in query_txt(name):
            if "v=dkim1" in record.lower() or "k=rsa" in record.lower() or "p=" in record.lower():
                found.append(DkimSelectorResult(selector=selector, record=record))
                break
    return found


def dmarc_status_label(policy: str | None) -> str:
    mapping = {
        "none": "Monitoring (none)",
        "quarantine": "Quarantined",
        "reject": "Rejecting",
    }
    if not policy:
        return "Unknown (no p= tag)"
    return mapping.get(policy.lower(), f"Custom policy ({policy})")


def check_dmarc(domain: str) -> DmarcResult:
    result = DmarcResult()
    name = f"_dmarc.{domain}"
    txt_records = query_txt(name)
    dmarc_records = [record for record in txt_records if record.lower().startswith("v=dmarc1")]

    if not dmarc_records:
        result.warnings.append(f"No DMARC record found at {name}.")
        return result

    if len(dmarc_records) > 1:
        result.errors.append(f"Multiple DMARC records detected ({len(dmarc_records)}).")

    result.exists = True
    result.raw = dmarc_records[0]
    tags = parse_tagged_record(result.raw)

    result.policy = tags.get("p")
    result.rua = tags.get("rua")
    result.pct = tags.get("pct", "100")

    if not result.policy:
        result.errors.append("DMARC record is missing required 'p=' (policy) tag.")
    elif result.policy.lower() not in {"none", "quarantine", "reject"}:
        result.warnings.append(f"Unusual DMARC policy value: p={result.policy}")

    if not result.rua:
        result.warnings.append("No aggregate reporting address (rua=) configured.")

    try:
        pct_value = int(result.pct)
        if pct_value < 100:
            result.warnings.append(f"Policy applies to only {pct_value}% of messages (pct={pct_value}).")
    except ValueError:
        result.errors.append(f"Invalid pct= value: {result.pct}")

    return result


def print_header(title: str) -> None:
    print()
    print("=" * 60)
    print(title)
    print("=" * 60)


def print_status(label: str, ok: bool, detail: str = "") -> None:
    icon = "✓" if ok else "⚠"
    suffix = f" — {detail}" if detail else ""
    print(f"  [{icon}] {label}{suffix}")


def print_spf(domain: str, result: SpfResult) -> None:
    print_header(f"SPF — {domain}")
    if not result.exists:
        print_status("Record", False, "MISSING")
        for warning in result.warnings:
            print(f"  ⚠ {warning}")
        return

    print_status("Record", True, "FOUND")
    for idx, record in enumerate(result.records, start=1):
        print(f"\n  Record {idx}:")
        print(f"    {record}")

    for warning in result.warnings:
        print(f"  ⚠ {warning}")
    for error in result.errors:
        print(f"  ✗ {error}")


def print_dkim(domain: str, found: list[DkimSelectorResult], selectors_tried: tuple[str, ...]) -> None:
    print_header(f"DKIM — {domain}")
    print(f"  Selectors probed: {', '.join(selectors_tried)}")

    if not found:
        print_status("Record", False, "NOT DISCOVERABLE with common selectors")
        print("  ⚠ Full DKIM verification requires the exact selector used by your mail provider.")
        print("    Check your ESP admin panel or DNS provider for the selector name.")
        return

    print_status("Record", True, f"FOUND ({len(found)} selector(s))")
    for item in found:
        print(f"\n  Selector: {item.selector}")
        print(f"    Host: {item.selector}._domainkey.{domain}")
        preview = item.record if len(item.record) <= 120 else item.record[:117] + "..."
        print(f"    {preview}")

    print("\n  Note: Full DKIM verification requires the exact selector used by your mail provider.")
    if len(found) < len(selectors_tried):
        print("  Other selectors may exist; confirm with your ESP if deliverability issues persist.")


def print_dmarc(domain: str, result: DmarcResult) -> None:
    print_header(f"DMARC — _dmarc.{domain}")
    if not result.exists:
        print_status("Record", False, "MISSING")
        for warning in result.warnings:
            print(f"  ⚠ {warning}")
        return

    print_status("Record", True, "FOUND")
    print(f"\n  Raw record:\n    {result.raw}")
    print("\n  Parsed tags:")
    print(f"    p   (policy) : {result.policy or '(missing)'}")
    print(f"    rua (reports): {result.rua or '(not set)'}")
    print(f"    pct (percent): {result.pct}")

    print(f"\n  Alignment status: {dmarc_status_label(result.policy)}")

    for warning in result.warnings:
        print(f"  ⚠ {warning}")
    for error in result.errors:
        print(f"  ✗ {error}")


def print_summary(domain: str, spf: SpfResult, dkim_found: list[DkimSelectorResult], dmarc: DmarcResult) -> None:
    print_header(f"Summary — {domain}")

    spf_ok = spf.exists and not spf.errors
    dkim_ok = bool(dkim_found)
    dmarc_ok = dmarc.exists and dmarc.policy and not dmarc.errors
    strict_ready = spf_ok and dkim_ok and dmarc_ok and dmarc.policy in {"quarantine", "reject"}

    print_status("SPF configured", spf.exists, "pass" if spf_ok else "review needed")
    print_status("DKIM discoverable", dkim_ok, "pass" if dkim_ok else "selector unknown")
    print_status("DMARC configured", dmarc.exists, dmarc_status_label(dmarc.policy) if dmarc.exists else "missing")

    print()
    if strict_ready:
        print("  ✓ Domain appears ready for strict DMARC enforcement (p=quarantine or p=reject).")
    else:
        print("  ⚠ Domain is NOT fully ready for strict DMARC enforcement.")
        gaps: list[str] = []
        if not spf.exists:
            gaps.append("publish SPF")
        elif spf.errors:
            gaps.append("fix SPF errors")
        if not dkim_ok:
            gaps.append("confirm DKIM selector and publish record")
        if not dmarc.exists:
            gaps.append("publish DMARC at _dmarc")
        elif dmarc.policy == "none":
            gaps.append("move DMARC policy from p=none to p=quarantine/reject after monitoring")
        elif not dmarc.rua:
            gaps.append("add rua= for aggregate reporting")
        if gaps:
            print("  Recommended actions:")
            for gap in gaps:
                print(f"    • {gap}")


def run(domain: str, selectors: Iterable[str]) -> int:
    domain = normalize_domain(domain)
    selectors_tuple = tuple(selectors)

    print(f"\nEmail Authentication Check: {domain}")
    print("-" * 60)

    spf = check_spf(domain)
    dkim_found = check_dkim(domain, selectors_tuple)
    dmarc = check_dmarc(domain)

    print_spf(domain, spf)
    print_dkim(domain, dkim_found, selectors_tuple)
    print_dmarc(domain, dmarc)
    print_summary(domain, spf, dkim_found, dmarc)

    has_errors = bool(spf.errors or dmarc.errors)
    has_warnings = bool(spf.warnings or dmarc.warnings or not dkim_found or not spf.exists or not dmarc.exists)
    if has_errors:
        return 2
    if has_warnings:
        return 1
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Verify SPF, DKIM, and DMARC DNS records for a domain.",
    )
    parser.add_argument("domain", help='Domain to inspect (e.g. "example.com")')
    parser.add_argument(
        "--selector",
        action="append",
        dest="selectors",
        help="Additional DKIM selector to probe (repeatable)",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    selectors = list(DEFAULT_DKIM_SELECTORS)
    if args.selectors:
        for selector in args.selectors:
            if selector not in selectors:
                selectors.insert(0, selector)

    try:
        return run(args.domain, selectors)
    except ValueError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 2
    except RuntimeError as exc:
        print(f"DNS error: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
