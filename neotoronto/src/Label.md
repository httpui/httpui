# HTTPState Safety Signage API

Quick reference for interacting with the safety signage API.

## Endpoint

```
POST https://httpstate.com/fb93d64d42fd4804a88c10f41e884406
```

## JSON Properties

| Property | Type | Description |
|----------|------|-------------|
| `flicker` | boolean | Enable/disable screen flickering |
| `level` | string | Safety level: `safety`, `notice`, `caution`, `warning`, `danger` |
| `text` | string | Message content (keep total payload under 128 chars) |

## Safety Levels (ANSI Z535)

- **safety** - Green (informational, safe condition)
- **notice** - Blue (general information)
- **caution** - Yellow (possible hazard)
- **warning** - Orange (potential hazard)
- **danger** - Red (immediate hazard)

## Examples

```bash
# Danger (auto-enables flicker)
curl -X POST -H "Content-Type: application/json" \
  -d '{"text": "Emergency!", "level": "danger", "flicker": true}' \
  https://httpstate.com/fb93d64d42fd4804a88c10f41e884406
```

## Rules

- Use `flicker: true` with `danger` level
- Use `flicker: false` for all other levels
- Keep total JSON payload under 128 characters
