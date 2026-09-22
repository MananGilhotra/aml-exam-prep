# Advanced Machine Learning — Complete Exam Handbook

Interactive revision site for **AML (CSA 333)**, built from Worksheets 0–11.

**Live site → https://manangilhotra.github.io/aml-exam-prep/**

## What's inside

| | |
|---|---|
| **12 lecture pages** | Every definition, formula, table and case study from the worksheets, explained in Hinglish from basics upward |
| **180 MCQs** | 10 per lecture + a 60-question mock test, each with a full "why — and why not the others" explanation |
| **107 solved problems** | Every numerical worked step by step: OLS by hand, matrix inversion, a full gradient-descent epoch, PCA eigendecomposition |
| **68 diagrams** | Hand-built SVGs — loss surfaces, GD paths, confusion matrices, scree plots, residual patterns |
| **Revision tools** | Master formula sheet · 70+ flashcards · mock test · NumPy/sklearn lab code companion |

## Topics

Code→AI→ML→DL · ML project lifecycle · Simple &amp; Multiple Linear Regression (OLS) ·
Batch / Stochastic / Mini-Batch Gradient Descent · Evaluation metrics (regression + classification) ·
Polynomial regression &amp; the five assumptions · Bias–variance tradeoff · Feature selection · PCA

## Running it locally

It's a static site — no build step, no dependencies.

```bash
python3 -m http.server 8800
# then open http://localhost:8800
```

Or just double-click `index.html`.

> **Note:** KaTeX (math rendering) and the fonts load from a CDN, so the first load needs internet.

## Source

Built from `AML_combined.pdf` (Worksheets 0–8, 10, 11). Worksheet 09 was not in that PDF —
the Bias–Variance page was reconstructed from the course's own Lab 9 and from the
cross-references in Worksheets 8 and 10, and is marked as such at the top of that page.
