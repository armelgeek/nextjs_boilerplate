#!/usr/bin/env python3
"""Structural gate for the pack.

History worth keeping: for one release every skill in this pack shared a single
activation sentence, and this validator printed OK the whole time, because it
only asked whether the words "Use when" appeared somewhere in the description.
An auditor later pasted one skill's description verbatim into another and the
gate stayed green. So the checks below assert what actually breaks for a user:
that two skills cannot be told apart, that a section is missing or out of order,
that a worked example carries no numbers and refuses nothing.

This gate passes falsely when a SKILL.md is well-formed and wrong: correct
sections, unique description, numbers in the example, and a decision rule that
does not decide the skill's own question. Structure is checkable; judgement is
not. That is what the grader pass and `selftest.py` are for.

Run:
    python3 scripts/validate-skills.py
"""

from __future__ import annotations

import re
import sys
from itertools import combinations
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PLACEHOLDERS = [
    "Add the inputs", "Step one", "Step two", "Step three",
    "Column 1", "Column 2", "Column 3", "TODO", "TBD", "Lorem ipsum",
]

TEMPLATED_PHRASES = [
    "diagnosing, planning, reviewing",
    "asks for help with",
    "provides data, screenshots",
    "needs an approval-ready diagnosis",
    "Can you check this",
    # The exact template this pack shipped once and had to unpick.
    "use the supplied evidence, run the workflow above",
    "produce the skill-specific rubric or diagnostic table",
    "the next decision could change hero copy",
]

REQUIRED_SECTIONS = [
    "## Use this skill when",
    "## Required input",
    "## Analysis workflow",
    "## Decision rules",
    "## Output format",
    "## Practical example",
    "## Guardrails",
]

# A worked example has to show the skill declining something, or it teaches the
# model that every input yields a confident answer.
REFUSAL_MARKERS = [
    "not conclude", "cannot conclude", "inconclusive", "unknown", "hypothesis",
    "assumption", "small sample", "missing", "not supplied", "unverified",
    "out of scope", "does not run", "not measured", "provisional", "not adjudicated",
    "not available", "no measurement", "guess", "refuse",
]

# Trigger clauses this similar are a routing coin flip.
TRIGGER_OVERLAP_LIMIT = 0.60

MIN_WORDS = 280
MIN_WORKFLOW_STEPS = 5

STOP = {
    "use", "when", "a", "an", "the", "is", "are", "or", "and", "to", "of", "on",
    "in", "for", "with", "that", "this", "it", "its", "as", "at", "by", "be",
    "has", "have", "does", "do", "not", "no", "you", "your", "someone", "nobody",
    "page", "landing", "skill", "them", "their", "one", "two", "if", "into",
}


def section(text: str, heading: str) -> str:
    match = re.search(rf"## {re.escape(heading)}\n(.*?)(?=\n## |\Z)", text, re.S)
    return match.group(1).strip() if match else ""


def description_of(text: str) -> str:
    if not text.startswith("---"):
        return ""
    frontmatter = text.split("---", 2)[1] if text.count("---") >= 2 else ""
    for line in frontmatter.splitlines():
        if line.startswith("description:"):
            return line[len("description:"):].strip()
    return ""


def trigger_clause(description: str) -> str:
    """The half of the description Claude routes on."""
    lowered = description.lower()
    idx = lowered.find("use when")
    return lowered[idx:] if idx != -1 else lowered


def tokens(clause: str) -> set[str]:
    words = re.findall(r"[a-z]+", clause)
    return {w for w in words if w not in STOP and len(w) > 2}


def overlap(a: set[str], b: set[str]) -> float:
    if not a or not b:
        return 0.0
    return len(a & b) / min(len(a), len(b))


def main() -> int:
    errors: list[str] = []
    descriptions: dict[str, str] = {}
    triggers: dict[str, set[str]] = {}

    paths = sorted(ROOT.glob("*/SKILL.md"))
    if not paths:
        print("No SKILL.md files found; is this the pack root?")
        return 2

    for path in paths:
        text = path.read_text(encoding="utf-8")
        rel = str(path.relative_to(ROOT))
        slug = path.parent.name

        for token in PLACEHOLDERS:
            if token in text:
                errors.append(f"{rel}: placeholder token: {token}")
        for phrase in TEMPLATED_PHRASES:
            if phrase in text:
                errors.append(f"{rel}: templated phrase: {phrase}")

        # Sections present, and in the documented order.
        positions = []
        for heading in REQUIRED_SECTIONS:
            idx = text.find(heading)
            if idx == -1:
                errors.append(f"{rel}: missing section: {heading}")
            else:
                positions.append((idx, heading))
        ordered = [h for _, h in sorted(positions)]
        expected = [h for h in REQUIRED_SECTIONS if h in ordered]
        if ordered != expected:
            errors.append(
                f"{rel}: sections out of order: {' then '.join(h[3:] for h in ordered)}"
            )

        description = description_of(text)
        if not description:
            errors.append(f"{rel}: no description in frontmatter")
        else:
            if "Use when" not in description:
                errors.append(f"{rel}: description needs an activation phrase with 'Use when'")
            descriptions[slug] = description
            triggers[slug] = tokens(trigger_clause(description))

        name_match = re.search(r"^name:\s*(\S+)", text, re.M)
        if name_match and name_match.group(1) != slug:
            errors.append(
                f"{rel}: frontmatter name '{name_match.group(1)}' does not match folder '{slug}'"
            )

        steps = re.findall(r"^\d+\.\s+", section(text, "Analysis workflow"), re.M)
        if len(steps) < MIN_WORKFLOW_STEPS:
            errors.append(
                f"{rel}: analysis workflow has {len(steps)} steps, needs {MIN_WORKFLOW_STEPS}"
            )

        example = section(text, "Practical example")
        if not re.search(r"\d", example):
            errors.append(
                f"{rel}: practical example contains no number. An example without data "
                "teaches the model to answer without data"
            )
        if not any(marker in example.lower() for marker in REFUSAL_MARKERS):
            errors.append(
                f"{rel}: practical example never declines anything. It must show what "
                "the skill refuses to conclude from the input given"
            )

        if len(text.split()) < MIN_WORDS:
            errors.append(f"{rel}: SKILL.md is too short to be useful")

    # Cross-file: two skills a reader or a router cannot tell apart.
    seen: dict[str, str] = {}
    for slug, description in descriptions.items():
        key = re.sub(r"[^a-z ]", "", description.lower())
        if key in seen:
            errors.append(
                f"{slug}: description is identical to {seen[key]}. This is the defect "
                "that made routing arbitrary once already"
            )
        seen[key] = slug

    for a, b in combinations(sorted(triggers), 2):
        score = overlap(triggers[a], triggers[b])
        if score > TRIGGER_OVERLAP_LIMIT:
            errors.append(
                f"{a} and {b}: trigger clauses overlap {score:.0%} "
                f"(limit {TRIGGER_OVERLAP_LIMIT:.0%}). Claude would be guessing between "
                "them; give at least one a boundary clause naming the other"
            )

    if errors:
        print("\n".join(errors))
        print(f"\n{len(errors)} problem(s) across {len(paths)} skills")
        return 1
    print(f"OK: {len(paths)} skills passed validation")
    return 0


if __name__ == "__main__":
    sys.exit(main())
