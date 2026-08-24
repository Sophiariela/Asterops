import { describe, expect, it } from "vitest";

import { back, fitPercent, getResult, initialState, pick, score } from "@/lib/diagnostic";

describe("diagnostic scoring", () => {
  // Documented worked example from docs/design-handoff/screenshots/README.md:
  // physical products · 2-5 years · people find us but don't buy · old site nobody
  // updates · through DMs · spreadsheets · follow-up and admin · improving what we
  // have · several tools plus data to migrate → CommerceOS primary, OperationsOS
  // second, Aster Pro (migration > 0). Also reproduced live in the browser during
  // the initial diagnostic build — this test locks that result in.
  const documentedAnswers = [0, 2, 1, 1, 1, 1, 1, 3, 2];

  it("matches the documented worked example exactly", () => {
    const result = getResult(documentedAnswers);

    expect(result.primary.key).toBe("commerce");
    expect(result.primary.value).toBe(10);
    expect(result.second?.key).toBe("ops");
    expect(result.second?.value).toBe(6);
    expect(result.tier).toBe("Aster Pro");
    expect(fitPercent(result.primary.value, result.max)).toBe(100);
    expect(fitPercent(result.second!.value, result.max)).toBe(60);

    const deferredScores = Object.fromEntries(result.deferred.map((s) => [s.key, s.value]));
    expect(deferredScores).toEqual({ web: 4, growth: 4, launch: 0 });
  });

  it("only recommends a second system when it clears max(3, primary * 0.6)", () => {
    // Q0 physical products (commerce 3, web 1) is the only answer — commerce
    // primary at 3, everything else well under the 60% threshold.
    const result = getResult([0]);
    expect(result.primary.key).toBe("commerce");
    expect(result.second).toBeNull();
    expect(result.chosen).toHaveLength(1);
  });

  it("never recommends more than two systems", () => {
    const result = getResult(documentedAnswers);
    expect(result.chosen.length).toBeLessThanOrEqual(2);
  });

  it("defaults to Self-serve when no tier flags are set", () => {
    // "In our heads and message threads" (no flag) and "Nothing — a clean
    // start" (no flag) keep integrations/migration/custom all at zero.
    const answers = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const result = getResult(answers);
    expect(result.tier).toBe("Self-serve");
  });

  it("escalates to Aster Pro once integrations reach 2, even with no migration", () => {
    // Q5 "A CRM the team relies on" sets integrations: 1; Q8 "One or two tools"
    // sets integrations: 1 — combined that's 2, with migration and custom at 0.
    const answers = [0, 0, 0, 0, 0, 3, 0, 0, 1];
    const result = getResult(answers);
    const { flags } = score(answers);
    expect(flags.integrations).toBe(2);
    expect(flags.migration).toBe(0);
    expect(flags.custom).toBe(0);
    expect(result.tier).toBe("Aster Pro");
  });

  it("escalates to Aster Studio whenever custom > 0, overriding migration/integrations", () => {
    // Q8 "Complex internal software" sets integrations: 2, custom: 1.
    const answers = [0, 0, 0, 0, 0, 0, 0, 0, 3];
    const result = getResult(answers);
    expect(result.tier).toBe("Aster Studio");
  });

  it("ignores unanswered trailing questions when scoring a partial run", () => {
    const result = getResult([0, 0]);
    expect(result.primary.key).toBe("commerce");
  });
});

describe("diagnostic state machine", () => {
  it("starts empty at step 0", () => {
    expect(initialState()).toEqual({ step: 0, answers: [] });
  });

  it("picking an option advances to the next step and records the answer", () => {
    const next = pick(initialState(), 0, 2);
    expect(next).toEqual({ step: 1, answers: [2] });
  });

  it("re-answering an earlier question truncates every later answer", () => {
    let state = initialState();
    state = pick(state, 0, 0);
    state = pick(state, 1, 1);
    state = pick(state, 2, 2);
    expect(state.answers).toEqual([0, 1, 2]);

    // Go back and re-pick question 1 with a different option — question 2's
    // stale answer must not survive, or it would keep scoring silently.
    state = pick(state, 1, 3);
    expect(state).toEqual({ step: 2, answers: [0, 3] });
  });

  it("back() steps back by one and floors at zero", () => {
    expect(back({ step: 3, answers: [0, 1, 2] })).toEqual({ step: 2, answers: [0, 1, 2] });
    expect(back({ step: 0, answers: [] })).toEqual({ step: 0, answers: [] });
  });
});
