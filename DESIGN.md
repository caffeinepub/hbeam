# Design Brief: HBeam Media Messaging Layer

## Overview
Media messaging UI extension for HBeam v24 — inline media preview and voice messaging controls integrated into existing message bubbles. Dark mint/charcoal aesthetic with minimal, refined interactions.

## Palette
| Name | OKLCH | Usage |
|------|-------|-------|
| Primary (Mint) | `0.82 0.19 152` | Play buttons, active states, accent highlights |
| Background | `0.11 0.012 240` | Page background |
| Card | `0.16 0.014 240` | Message bubbles, media containers |
| Muted | `0.18 0.013 240` | Secondary surfaces, disabled states |
| Foreground | `0.94 0.01 220` | Text on dark backgrounds |
| Border | `0.25 0.016 240` | Subtle dividers, outlines |

## Typography
- **Body**: Plus Jakarta Sans (existing, 14–16px line-height 1.5)
- **Mono**: JetBrains Mono (time display, file sizes, 12–13px)
- **Display**: General Sans (modal headers, 16–18px, weight 600)

## Components & Zones
| Component | Structure | Behavior |
|-----------|-----------|----------|
| Image Message | Thumbnail (max 300px) in bubble with rounded corners | Tap to expand full-screen |
| Video Message | Static thumbnail + mint play icon overlay | Hover/tap shows play affordance |
| File Message | Icon + name + size (KB/MB) + download link | Download on tap |
| Audio Player | Play button + progress bar + time display (mm:ss) | Plays inline in bubble |
| Upload Progress | Thin progress bar inside bubble during send | Shows percentage, clears on completion |
| Voice Recorder | Bottom modal with start/stop buttons, timer | Dismiss on close, preview before send |

## Motion
- **Play button entry**: 200ms fade-in on audio/video hover
- **Progress bar fill**: Real-time smooth update during playback/upload
- **Modal slide-up**: 300ms cubic-bezier entrance from bottom
- **Waveform pulse**: Continuous 600ms loop during playback

## Constraints
- All media inline in bubbles (no modals except voice recorder)
- Reuse existing mint/card tokens — no new colors
- Audio player fits within bubble width (max 280px on mobile)
- Fallback text for unavailable media ("Image unavailable", "Audio failed to load")
- Voice recorder only active when recording starts (not always open)

## Signature Detail
Mint glow on play button hover — subtle, refined, not aggressive. Audio progress bar uses mint fill with smooth real-time updates. File size shown in mono font at 12px for technical clarity.
