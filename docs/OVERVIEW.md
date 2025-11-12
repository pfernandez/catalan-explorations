# Basis — Overview

This document is the conceptual front door: **why** the pieces exist and **how** they relate, without assuming any physics commitments beyond the code.

---

## 1. Starting point: `()` as Vacuum + Structure

- `()` = vacuum symbol & potential.
- Pairing generates **Catalan** objects:
  - Dyck words, binary trees, noncrossing diagrams.
- We treat this as the **possibility space** of well-formed, nested causal histories.

---

## 2. Dyck paths as discrete spacetime sketches

Each Dyck word is a path with `(`=up, `)`=down, never below 0, end at 0.

```text
word:   ( ( ) ( ) )
step:   + + - + - -
height: 0 1 2 1 2 1 0

    2 |      /\
    1 |   /\/  \
    0 |__/      \__
       0 1 2 3 4 5 6
```

- **height** ≈ causal depth (“time”)
- **breadth** ≈ branching (“space”)
- Scaling limits (→ Brownian-like excursions) give a bridge to continuous analysis.

We use this as a **design constraint** for dynamics.

---

## 3. Collapse as dynamics (and a gravity analogy)

Local rules (at minimum `(() x) ⇒ x`) rewrite structures; more policies prefer leftmost/heaviest/balanced, etc.

We measure:

- motif recurrence & survival,
- distribution of consistent extensions for partial histories.

Cautious analogy:

- **motif density** → potential,
- **gradients** → force-like behavior,
- **collapse of computed history** → curvature-like effects.

This is a **statistical, structural program** we can compute on.

---

## 4. Pure structural SK / λ from `()`

Encoding:

- Binders: `(() body)` (introduce argument),
- References: `#n` (De Bruijn),
- Application: pairing,
- Evaluation: repeated `(() x) ⇒ x` + substitution.

We define `I`, `K`, `S`, booleans, composition in `programs/sk-basis.lisp`.  
**Result:** The substrate is **Turing-complete**.

---

## 5. Motifs, cycles, and structural sharing

We quotient repeated shapes to build a **pattern graph**:

```text
Causal tree → quotient by isomorphic subtrees → Pattern graph (may cycle)
```

- **Fixed motifs** = persistent identities,
- **Cycles** = reentry (same form reappears),
- **Indistinguishability** = many embeddings of one motif-class.

This reconciles “loop diagrams” and Wheeler-style ideas with strict forward causality.

---

## 6. Diagrams, gauge, and fields (work in progress)

- **Feynman-like diagrams:** vertices = collapse events, propagators = persistent links, histories = diagram sums.
- **Gauge-like freedom:** once internal labels (phase/color) are attached, local representation changes that preserve observables act like gauge transformations.
- **Wilson-loop-style invariants:** closed structural loops over internal labels.

Open questions we test here:

- Can standard diagrammatics be reconstructed from Catalan histories + weights?
- Can gauge redundancies and effective couplings emerge from statistics of realized vs unrealized possibilities?

---

## 7. Attention & memory (Scheme lineage)

An early Scheme fragment models:

- frames as `(focus . rest)`,
- a program as a list of navigation ops,
- an agent as an id + procedure.

It was a **Turing-style read-head** over cons-based memory—an attention mechanism. The modern SK/Catalan kernel is a tighter base for the same idea: **computation, memory, and observation on one substrate**.

---

## 8. Concept stack (at a glance)

```text
   [ Physical / Semantic Interpretations ]
      QFT-like diagrams, gauge-like symmetry, gravity analogies
                               |
   [ Pattern Graph ]  motifs, cycles, reentry, conserved forms
                               |
   [ Dynamics / Collapse ]  local rules, evaluation, motif statistics
                               |
   [ Catalan Structures ]  Dyck words, trees, noncrossing diagrams
                               |
   [ `()` ]  vacuum symbol, pure pairing
```

Layers 0–2 are concrete; layers 3–4 are exploratory.

---

## 9. How to navigate

- **Kernel & compute:** `src/sk.js`, `programs/sk-basis.lisp`
- **Motifs:** `src/motif-discover.js`, `src/collapse-policy.js`
- **Background essays:** `docs/` (clearly marked as exploratory)

Engage as:
1) a combinatorics/interpreter playground,  
2) a structural approach to agents/memory, or  
3) a hypothesis lab for diagrammatics/geometry.

Each layer stands on its own.