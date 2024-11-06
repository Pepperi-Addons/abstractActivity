# [addon name] Architecture

## Overview

Creates the abstract activity scheme, which is inherited by new activities.  
In the future might be used to hold common logic for all activities, once ADAL will be able to support it (schemes logic inheritance).

---

## Data Model

Creates the abstract activity scheme `base_activities`, which is the base of all activities.

---

## Relations

Has DIMX import (`DataImportResource`) & export (`DataExportResource`) relations to enable data import and export.

---
