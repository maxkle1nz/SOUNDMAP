# ⚠️ ARCHIVED — RESØN Simplified App

**Status:** ARCHIVED — Superseded by RESON-mapster  
**Date:** 2026-02-28  
**Reason:** Wave 31 audit concluded this codebase is redundant

---

## What This Was

This directory (`RESON/`) contained the original simplified RESØN app — a ~6,400-line React + Supabase frontend built as an early prototype for the sound-mapping platform.

## Why It's Archived

During the Wave 31 nightshift audit, it was determined that:

1. **RESON-mapster** (`~/clawd/RESON-mapster/`) is the canonical, actively developed codebase
2. RESON-mapster supersedes this app in every dimension: architecture, features, UI fidelity, and production readiness
3. The simplified app has not been updated since RESON-mapster reached feature parity
4. Maintaining two parallel codebases creates confusion and drift

## What to Use Instead

→ **Active project:** `~/clawd/RESON-mapster/soundmap-frontend/`

All development, bug fixes, and feature work should target RESON-mapster.

## Preservation Policy

This directory is **preserved, not deleted**, for:
- Historical reference
- Potential extraction of isolated utilities or patterns
- Rollback reference if needed

Do not deploy, develop, or depend on this codebase for anything new.

---

*Archived by Wave 31 nightshift agent — RESØN OAuth + Archive mission*
