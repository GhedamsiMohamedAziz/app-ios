<!-- Owned by: mle-reviewer (with architect) -->

# Pricing intelligence

The differentiator from Darragi's idea: help sellers bid the *right* price.

- `suggestPrice(history)` → `PriceSuggestion` (suggested + low/high band + basis).
- v1 is a transparent **median-based heuristic** over historical bids.
- Same signature is the seam for a trained model later (features: part, region,
  condition, season, seller rating).

## Roadmap

- [ ] Feature pipeline (part category, region, condition, recency)
- [ ] Offline eval vs. realised sale prices
- [ ] Online A/B: suggested-price vs. free-form bids → win-rate & margin
- [ ] Guardrail: never suggest below cost; surface confidence honestly
