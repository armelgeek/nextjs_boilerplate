#!/usr/bin/env python3
"""Regression tests for the pack's deterministic helpers.

Every bug found in review lands here as a test so it cannot come back. Run from
anywhere:

    python3 scripts/selftest.py

Exit code 0 means both helpers behave. Stdlib only.
"""

from __future__ import annotations

import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
PACK = HERE.parent

# Each helper lives inside the skill folder that cites it, so an installed skill
# never points at a path the install command forgot to copy. The tests reach
# into those folders rather than keeping a second copy here.
sys.path.insert(0, str(PACK / "accessibility-conversion-blocker-check"))
sys.path.insert(0, str(PACK / "landing-page-copy-readability-pass"))
sys.path.insert(0, str(PACK / "landing-page-ab-test-readout"))

import contrast_check as cc  # noqa: E402
import readability_report as rr  # noqa: E402
import significance as sig  # noqa: E402

PASSED = 0
FAILED: list[str] = []


def check(name: str, actual, expected) -> None:
    global PASSED
    if actual == expected:
        PASSED += 1
    else:
        FAILED.append(f"{name}: expected {expected!r}, got {actual!r}")


def check_close(name: str, actual: float, expected: float, tol: float = 0.02) -> None:
    global PASSED
    if abs(actual - expected) <= tol:
        PASSED += 1
    else:
        FAILED.append(f"{name}: expected ~{expected}, got {actual}")


def check_raises(name: str, fn, exc) -> None:
    global PASSED
    try:
        fn()
    except exc:
        PASSED += 1
        return
    except Exception as other:  # noqa: BLE001
        FAILED.append(f"{name}: raised {type(other).__name__}, expected {exc.__name__}")
        return
    FAILED.append(f"{name}: did not raise {exc.__name__}")


# --------------------------------------------------------------------------
# contrast_check
# --------------------------------------------------------------------------

# Anchors from the WCAG definition. If these move, the maths is wrong.
check_close("white on black is 21:1", cc.contrast_ratio((255, 255, 255), (0, 0, 0)), 21.0)
check_close("black on white is 21:1", cc.contrast_ratio((0, 0, 0), (255, 255, 255)), 21.0)
check_close("white on white is 1:1", cc.contrast_ratio((255, 255, 255), (255, 255, 255)), 1.0)
# #767676 on white is the canonical "just passes AA normal text" pair.
check_close("767676 on white just passes AA", cc.contrast_ratio((118, 118, 118), (255, 255, 255)), 4.54, 0.03)
# Ratio is symmetric: order of arguments must not change the number.
check_close(
    "ratio is symmetric",
    cc.contrast_ratio((134, 255, 29), (21, 21, 22)),
    cc.contrast_ratio((21, 21, 22), (134, 255, 29)),
    0.0001,
)

check("hex shorthand expands", cc.parse_colour("#fff"), (255, 255, 255))
check("hex without hash", cc.parse_colour("151516"), (21, 21, 22))
check("hex is case insensitive", cc.parse_colour("#86ff1d"), cc.parse_colour("#86FF1D"))
check("rgb() parses", cc.parse_colour("rgb(134, 255, 29)"), (134, 255, 29))
# This used to assert that alpha was ignored, which is the bug itself written
# down as expected behaviour. Translucent colours are now refused; see below.
check("named white", cc.parse_colour("White"), (255, 255, 255))
check_raises("transparent is rejected", lambda: cc.parse_colour("transparent"), cc.ColourError)
check_raises("garbage is rejected", lambda: cc.parse_colour("#12345"), cc.ColourError)
check_raises("out of range channel", lambda: cc.parse_colour("rgb(300,0,0)"), cc.ColourError)

# Large-text boundary. 18.66px only counts as large at weight 700 or more.
check("24px normal is large", cc.is_large(24, 400), True)
check("23px normal is not large", cc.is_large(23, 400), False)
check("18.66px bold is large", cc.is_large(18.66, 700), True)
check("18.66px at 400 is not large", cc.is_large(18.66, 400), False)
check("18px bold is not large", cc.is_large(18, 700), False)

# The pair that actually failed on a real page: white label on the lime button.
lime = cc.parse_line("Button|#ffffff|#86FF1D|15|600", "AA")
check("lime button fails AA", lime.passes, False)
check("lime button uses normal-text rule", lime.required, 4.5)
check_close("lime button ratio", lime.ratio, 1.29, 0.02)

# A weight keyword must be accepted, not crash the line parser.
bold_word = cc.parse_line("Heading|black|white|20|bold", "AA")
check("bold keyword becomes 700", bold_word.weight, 700)
check("20px bold is large", bold_word.large, True)
check("20px bold needs 3:1", bold_word.required, 3.0)

# Defaults when size and weight are omitted.
defaults = cc.parse_line("Body|#000|#fff", "AA")
check("default size is 16", defaults.size, 16.0)
check("default weight is 400", defaults.weight, 400)
check("16px is normal text", defaults.large, False)

# AAA raises the bar on a pair that passes AA.
aa = cc.parse_line("Body|#767676|#ffffff", "AA")
aaa = cc.parse_line("Body|#767676|#ffffff", "AAA")
check("passes AA", aa.passes, True)
check("fails AAA", aaa.passes, False)

check_raises("too few columns", lambda: cc.parse_line("just-a-label", "AA"), cc.ColourError)

# The renderer must not crash on a mixed batch, and must count failures.
rendered = cc.render([lime, aa], ["one bad line"], "AA")
check("render counts failures", "Failing: 1." in rendered, True)
check("render lists unmeasurable lines", "one bad line" in rendered, True)
check("render states it is not a verdict", "not a conformance verdict" in rendered, True)

# --------------------------------------------------------------------------
# readability_report
# --------------------------------------------------------------------------

simple = rr.parse("One two three. Four five six seven!", 35, 20.0)
check("counts sentences", simple.count, 2)
check("counts words", simple.word_count, 7)
check_close("mean length", simple.mean_length, 3.5)
check("max length", simple.max_length, 4)

# Empty and whitespace-only input must not divide by zero.
empty = rr.parse("   \n  ", 35, 20.0)
check("empty input has no sentences", empty.count, 0)
check("empty input mean is zero", empty.mean_length, 0.0)
check("empty input longest is None", empty.longest, None)
check("empty input renders a message", "No sentences found" in rr.render(empty), True)

# A sentence with no terminal punctuation still counts.
unterminated = rr.parse("A headline with no full stop", 35, 20.0)
check("unterminated sentence counts", unterminated.count, 1)

long_text = "word " * 40 + ". Short one."
long_report = rr.parse(long_text, 35, 20.0)
check("flags the long sentence", len(long_report.long_sentences), 1)
check("threshold is respected", len(rr.parse(long_text, 45, 20.0).long_sentences), 0)

passive = rr.parse("The report was generated overnight.", 35, 20.0)
check("regular participle detected", len(passive.passive_candidates), 1)
irregular = rr.parse("The page was built by committee.", 35, 20.0)
check("irregular participle detected", len(irregular.passive_candidates), 1)
adverb = rr.parse("Results are quickly delivered.", 35, 20.0)
check("adverb between be and participle", len(adverb.passive_candidates), 1)
active = rr.parse("We ship the page today.", 35, 20.0)
check("active voice is not flagged", len(active.passive_candidates), 0)
# "red" ends in -ed but is three letters, so the length guard must hold.
short_ed = rr.parse("The border is red.", 35, 20.0)
check("short -ed word is not a participle", len(short_ed.passive_candidates), 0)
# Only one candidate per sentence, so one long sentence cannot dominate the count.
double = rr.parse("It was built and it was shipped.", 35, 20.0)
check("one candidate per sentence", len(double.passive_candidates), 1)

# "simple" is not an intensifier; "simply" is. The guard keeps the list from creeping.
hedged = rr.parse("This is basically just really very simple.", 35, 20.0)
check("counts intensifiers", sum(hedged.intensifiers.values()), 4)
check("adjective is not an intensifier", "simple" in hedged.intensifiers, False)

freq = rr.parse("Landing page landing page landing conversion.", 35, 20.0)
check("frequency skips stopwords", freq.frequency.most_common(1)[0], ("landing", 3))

# Sentence indexes must stay contiguous after empty fragments are dropped.
gappy = rr.parse("One. . Two. Three.", 35, 20.0)
check("indexes are contiguous", [s.index for s in gappy.sentences], [1, 2, 3])

# Comparison direction must read from the second document's perspective.
before = rr.parse("word " * 30 + ".", 35, 20.0)
after = rr.parse("Short. Sentences. Here.", 35, 20.0)
comparison = rr.render_compare(before, after, "before", "after")
check("comparison marks the shorter version easier", "easier" in comparison, True)
check("comparison warns about vagueness", "vagueness defect" in comparison, True)

# The full render must include every section it promises.
full = rr.render(rr.parse(long_text + " The page was built by committee.", 35, 20.0))
for section in ("## Measurement", "Long sentences", "Passive-voice candidates", "Hardest sentence"):
    check(f"render includes {section}", section in full, True)

# --------------------------------------------------------------------------

# --------------------------------------------------------------------------
# Bugs found by an audit pass. Each one is here so it cannot come back.
# --------------------------------------------------------------------------

# Alpha was parsed and discarded, so invisible text passed a build gate at 21:1.
check_raises(
    "translucent rgba is rejected",
    lambda: cc.parse_colour("rgba(0,0,0,0.02)"),
    cc.ColourError,
)
check_raises(
    "percentage alpha is rejected",
    lambda: cc.parse_colour("rgba(0,0,0,2%)"),
    cc.ColourError,
)
check("fully opaque rgba is accepted", cc.parse_colour("rgba(0,0,0,1)"), (0, 0, 0))
check("rgba with alpha 1.0 is accepted", cc.parse_colour("rgba(9,9,9,1.0)"), (9, 9, 9))

# A non-finite size silently relaxed the threshold from 4.5:1 to 3:1.
check_raises("infinite size is rejected", lambda: cc.parse_size("1e309"), cc.ColourError)
check_raises("nan size is rejected", lambda: cc.parse_size("nan"), cc.ColourError)
check_raises("zero size is rejected", lambda: cc.parse_size("0"), cc.ColourError)
check_raises("negative size is rejected", lambda: cc.parse_size("-9"), cc.ColourError)
check_raises("absurd size is rejected", lambda: cc.parse_size("99999"), cc.ColourError)
check("normal size parses", cc.parse_size("15.5"), 15.5)

check_raises("negative weight is rejected", lambda: cc.parse_weight("-700"), cc.ColourError)
check_raises("zero weight is rejected", lambda: cc.parse_weight("0"), cc.ColourError)
check_raises("weight above 1000 is rejected", lambda: cc.parse_weight("1200"), cc.ColourError)
check("weight 1000 is allowed", cc.parse_weight("1000"), 1000)
check("normal keyword becomes 400", cc.parse_weight("normal"), 400)

# hsl() is unmeasurable here and must say so rather than being guessed at.
check_raises("hsl is rejected", lambda: cc.parse_colour("hsl(120,50%,50%)"), cc.ColourError)
check_raises("currentColor is rejected", lambda: cc.parse_colour("currentColor"), cc.ColourError)

# A BOM leaked into the first label.
check("BOM is stripped from a colour", cc.parse_colour("﻿#fff"), (255, 255, 255))
check("BOM is stripped from a label", cc.parse_line("﻿Bom|black|white", "AA").label, "Bom")
check_raises("empty label is rejected", lambda: cc.parse_line("|black|white", "AA"), cc.ColourError)

# Output is capped, and failures are never dropped to make room for passes.
_many = [cc.parse_line(f"P{i}|black|white", "AA") for i in range(80)]
_fail = cc.parse_line("Bad|#ffffff|#86FF1D|15|600", "AA")
_capped = cc.render(_many + [_fail], [], "AA", max_rows=10)
check("render caps rows", _capped.count("\n| P") <= 10, True)
check("render keeps the failing row when capping", "| Bad |" in _capped, True)
check("render reports what it hid", "Not shown:" in _capped, True)

# --------------------------------------------------------------------------
# readability_report: tokenizer, abbreviations, small-sample guard
# --------------------------------------------------------------------------

# Accented words were shredded into fragments, corrupting the headline numbers.
_accents = rr.parse("Zürich teams don’t wait. Café naïve résumé.", 35, 20.0)
check("accented words count once", _accents.word_count, 7)
check("accented word survives whole", "zürich" in _accents.frequency, True)
check("no fragment in the frequency table", "rich" in _accents.frequency, False)
check("typographic apostrophe stays inside the word", "don’t" in [w.lower() for s in _accents.sentences for w in s.words], True)

# A page in a non-Latin script was reported as a broken file.
_cjk = rr.parse("这是一个着陆页。它不转化。", 35, 20.0)
check("cjk splits into sentences", _cjk.count, 2)
check("cjk is counted as ideographs", _cjk.script, "cjk")
check("cjk renders a measurement", "## Measurement" in rr.render(_cjk), True)
check("cjk says it counted ideographs", "ideographs because" in rr.render(_cjk), True)

# Abbreviations inflated the sentence count and deflated the mean.
_abbr = rr.parse("Trusted by Dr. Smith and approx. 4 000 teams. Book a demo.", 35, 20.0)
check("abbreviations do not end sentences", _abbr.count, 2)
check("abbreviation text is restored", "Dr. Smith" in _abbr.sentences[0].text, True)
_more_abbr = rr.parse("Ships to the U.S. and the U.K. Contact us.", 35, 20.0)
check("dotted abbreviation keeps its interior dot", _more_abbr.count, 2)
check("interior dot is restored", "U.S." in _more_abbr.sentences[0].text, True)
# "e.g." is followed by a capital often enough that its trailing period must be
# protected as well, or a single sentence splits in two.
_eg = rr.parse("Works with e.g. Shopify and Stripe. Try it.", 35, 20.0)
check("e.g. before a capital does not split", _eg.count, 2)
check("i.e. before a capital does not split", rr.parse("It is fast, i.e. Under one second. Try it.", 35, 20.0).count, 2)
# A terminator followed by a lowercase word is not a sentence break.
check("lowercase after a period does not split", rr.parse("Version 2.0 ships today.", 35, 20.0).count, 1)

# The mean flag never actually flagged, and was reported on samples of one.
_one = rr.parse("A single sentence about landing pages.", 35, 20.0)
check("mean is not adjudicated on a small sample", "not adjudicated" in _one.mean_verdict, True)
check("small sample is not stable", _one.mean_is_stable, False)
_ten = rr.parse(" ".join(f"Sentence number {i} here." for i in range(12)), 35, 2.0)
check("mean is stable at ten sentences", _ten.mean_is_stable, True)
check("mean of three words is measured", _ten.mean_length, 3.0)
check("mean over the flag is stated", "over the 2.0 flag" in _ten.mean_verdict, True)
_within = rr.parse(" ".join(f"Short {i}." for i in range(12)), 35, 20.0)
check("mean within the flag is stated", "within the 20.0 flag" in _within.mean_verdict, True)

# Hedges and intensifiers are different defects and are counted apart.
_vague = rr.parse("This may perhaps possibly work. It is very really just simple.", 35, 20.0)
check("epistemic hedges counted", sum(_vague.hedges.values()), 3)
check("intensifiers counted", sum(_vague.intensifiers.values()), 3)
check("hedge is not counted as intensifier", "perhaps" in _vague.intensifiers, False)
check("intensifier is not counted as hedge", "really" in _vague.hedges, False)

# Empty input must not read as an improvement in a comparison.
_empty = rr.parse("", 35, 20.0)
check("empty input has no sentences", _empty.count, 0)
check("empty render explains itself", "no words this tool could" in rr.render(_empty), True)

# --------------------------------------------------------------------------
# significance: the arithmetic the readout skill used to eyeball
# --------------------------------------------------------------------------

_r = sig.Result(sig.Arm("A", 1200, 36), sig.Arm("B", 1180, 48), 0.05, 6)
check_close("p value on the skill's own example", _r.p_value, 0.158, 0.01)
check("that example is not significant", _r.statistically_significant, False)
check("interval on the difference contains zero", _r.difference_interval[0] < 0 < _r.difference_interval[1], True)
check("verdict is inconclusive", _r.verdict, "inconclusive")
check("both conversion gates fail", len([f for f in _r.gate_failures if "conversions" in f]), 2)
check("runtime gate fails at six days", any("business cycle" in f for f in _r.gate_failures), True)
check("required sample exceeds what is on hand", _r.required_visitors_per_arm > 1180, True)

# A large clear win must pass everything, or the gates are just a blocker.
_win = sig.Result(sig.Arm("A", 40000, 1200), sig.Arm("B", 40000, 1600), 0.05, 21)
check("a real win is significant", _win.statistically_significant, True)
check("a real win clears the gates", _win.gate_failures, [])
check("a real win is a winner", _win.verdict, "winner")

# Significant on the maths but under the refusal gates: gates must win.
_thin = sig.Result(sig.Arm("A", 300, 6), sig.Arm("B", 300, 30), 0.05, 30)
check("thin arms are significant on the maths", _thin.statistically_significant, True)
check("but the conversion gate overrides", _thin.verdict, "inconclusive")

# A variant that loses must not be reported as a winner.
_loss = sig.Result(sig.Arm("A", 40000, 1600), sig.Arm("B", 40000, 1200), 0.05, 21)
check("a losing variant is named as such", _loss.verdict, "control wins")

# Runtime unknown must not silently pass the cycle gate as if it were fine.
_no_runtime = sig.Result(sig.Arm("A", 40000, 1200), sig.Arm("B", 40000, 1600), 0.05, None)
check("unknown runtime does not fail the gate", any("business cycle" in f for f in _no_runtime.gate_failures), False)
check("unknown runtime is disclosed in the output", "runtime not supplied" in sig.render(_no_runtime), True)

# Zero difference has no sample size to compute, and must not divide by zero.
_same = sig.Result(sig.Arm("A", 5000, 250), sig.Arm("B", 5000, 250), 0.05, 14)
check("identical arms need no sample size", _same.required_visitors_per_arm, None)
check("identical arms are inconclusive", _same.verdict, "inconclusive")
check("identical arms render", "## Significance" in sig.render(_same), True)

# Wilson interval, not the normal approximation, so rates near zero stay sane.
_lo, _hi = sig.wilson_interval(0, 100, 1.96)
check("wilson lower bound never goes below zero", _lo >= 0.0, True)
check("wilson upper bound is above zero at zero successes", _hi > 0.0, True)
_flo, _fhi = sig.wilson_interval(100, 100, 1.96)
check("wilson upper bound never exceeds one", _fhi <= 1.0, True)

# Input validation: the column swap is the mistake people actually make.
check_raises(
    "more conversions than visitors is rejected",
    lambda: sig.parse_arm("A", [36, 1200]),
    sig.InputError,
)
check_raises("zero visitors is rejected", lambda: sig.parse_arm("A", [0, 0]), sig.InputError)
check_raises("negative conversions rejected", lambda: sig.parse_arm("A", [100, -1]), sig.InputError)
check("a valid arm parses", sig.parse_arm("A", [1200, 36]).rate, 0.03)

# The output has to carry the honesty the skill promises.
_rendered = sig.render(_r)
check("render states the verdict", "### Verdict: inconclusive" in _rendered, True)
check("render warns against recording a validated lift", "never as a validated lift" in _rendered, True)
check("render discloses no multiple-comparison correction", "not corrected for here" in _rendered, True)

# --------------------------------------------------------------------------
# Second audit pass. These are the false-green cases: a gate that returns 0
# while the defect is still there is worse than no gate.
# --------------------------------------------------------------------------

# A label starting with "#" was read as a comment, so the line vanished from the
# run and the gate still exited 0, hiding invisible text.
_hash_label = cc.parse_line("#1 Hero CTA|#ffffff|#ffffff|16|400", "AA")
check("hash-prefixed label is measured", _hash_label.label, "#1 Hero CTA")
check("white on white fails", _hash_label.passes, False)
check_close("white on white is 1:1", _hash_label.ratio, 1.0)

# Alpha outside 0 to 1 bypassed the translucency refusal entirely.
check_raises("alpha above 1 is rejected", lambda: cc.parse_colour("rgba(0,0,0,5)"), cc.ColourError)
check_raises("negative alpha is rejected", lambda: cc.parse_colour("rgba(0,0,0,-1)"), cc.ColourError)

# MDE collapsed to 0.00pp at a control rate of 0 or 100 percent, which reads as
# "any difference is detectable" in a skill that quotes it verbatim.
check("mde is not computable at a zero rate", sig.Result(sig.Arm("A", 1000, 0), sig.Arm("B", 1000, 50), 0.05, 14).mde_at_current_size, None)
check("mde is not computable at a full rate", sig.Result(sig.Arm("A", 1000, 1000), sig.Arm("B", 1000, 1000), 0.05, 14).mde_at_current_size, None)
check("mde output says so rather than printing zero", "not computable" in sig.render(sig.Result(sig.Arm("A", 1000, 0), sig.Arm("B", 1000, 50), 0.05, 14)), True)
check("mde is computable at a normal rate", sig.Result(sig.Arm("A", 4000, 120), sig.Arm("B", 4000, 160), 0.05, 14).mde_at_current_size is not None, True)

# The sentence lookahead was ASCII-only, so any language with non-ASCII capitals
# collapsed into one sentence and inflated both numbers the skill acts on.
_pl = rr.parse("Zamow teraz. Świetna oferta dla ciebie. Ładny produkt. Świetna cena dla zespolu. Żaden inny sklep tego nie ma.", 35, 20.0)
check("polish sentences split", _pl.count, 5)
_tr = rr.parse("Hemen sipariş ver. İyi bir teklif. Şimdi dene.", 35, 20.0)
check("turkish dotted capital splits", _tr.count, 3)
_de = rr.parse("Jetzt bestellen. Über 500 Teams nutzen es. Ärgerlich einfach.", 35, 20.0)
check("german umlaut capital splits", _de.count, 3)

# Bullet and headline copy is the dominant shape of a landing page, and a hard
# line break was not a boundary, so 40 bullets measured as one 160-word sentence.
_bullets = rr.parse("\n".join(f"Feature number {i} ships today." for i in range(40)), 35, 20.0)
check("line breaks end sentences", _bullets.count, 40)
check("no false long-sentence flag on bullets", len(_bullets.long_sentences), 0)
_unterminated = rr.parse("Faster onboarding\nFewer support tickets\nOne dashboard", 35, 20.0)
check("unterminated lines still parse", _unterminated.count >= 1, True)

# Exit codes are part of the contract: these helpers are meant to gate a build, so
# the codes get checked by actually running them, not by inspecting a function.
import subprocess  # noqa: E402

READABILITY = PACK / "landing-page-copy-readability-pass" / "readability_report.py"
CONTRAST = PACK / "accessibility-conversion-blocker-check" / "contrast_check.py"
SIGNIFICANCE = PACK / "landing-page-ab-test-readout" / "significance.py"


def run(script: pathlib.Path, args: list[str], stdin: str = "") -> int:
    return subprocess.run(
        [sys.executable, str(script), *args],
        input=stdin, capture_output=True, text=True,
    ).returncode


# --long accepted zero and negatives, flagging every sentence.
check("negative --long is rejected", run(READABILITY, ["-", "--long", "-5"], "A page. Two."), 2)
check("zero --long is rejected", run(READABILITY, ["-", "--long", "0"], "A page. Two."), 2)
check("valid --long runs", run(READABILITY, ["-", "--long", "5"], "A page. Two."), 0)

# Undecodable bytes must exit 2, as the docstrings promise, not traceback.
_bin = PACK / "scripts" / "_selftest_binary.tmp"
_bin.write_bytes(b"\x00\x01\x02\xff\xfe" * 40)
try:
    check("readability exits 2 on binary input", run(READABILITY, [str(_bin)]), 2)
    check("contrast exits 2 on binary input", run(CONTRAST, [str(_bin)]), 2)
finally:
    _bin.unlink(missing_ok=True)

# The three-way exit contract on the contrast gate.
check("contrast exits 0 when everything passes", run(CONTRAST, ["-"], "Ok|black|white\n"), 0)
check("contrast exits 1 on a threshold failure", run(CONTRAST, ["-"], "Bad|#ffffff|#86FF1D|15|600\n"), 1)
check("contrast exits 2 on an unmeasurable line", run(CONTRAST, ["-"], "Ok|black|white\nBad|hsl(1,2%,3%)|white\n"), 2)
check("contrast exits 1 on a hash-labelled failure", run(CONTRAST, ["-"], "#1 CTA|#fff|#fff\n"), 1)

# Significance exits 1 on inconclusive, which is what makes the refusal a gate
# rather than a paragraph.
check("significance exits 1 when inconclusive", run(SIGNIFICANCE, ["--a", "1200", "36", "--b", "1180", "48"]), 1)
check("significance exits 0 on a real win", run(SIGNIFICANCE, ["--a", "40000", "1200", "--b", "40000", "1600", "--runtime-days", "21"]), 0)
check("significance exits 2 on swapped columns", run(SIGNIFICANCE, ["--a", "36", "1200", "--b", "48", "1180"]), 2)

total = PASSED + len(FAILED)
print(f"{PASSED}/{total} checks passed")
for failure in FAILED:
    print(f"  FAIL {failure}")
sys.exit(1 if FAILED else 0)
