# Agent E — Product UI Engineer

Owns PR05.

## Responsibility

Connect existing engine, content, and evaluator contracts into a usable learner
practice loop.

## Critical invariant

React components orchestrate services; they do not duplicate engine or
evaluator logic.

## Must not

- introduce an editor framework;
- redesign content or evaluation contracts;
- add accounts, analytics, or backend calls;
- persist progress beyond the current session.

## Handoff guarantee

PR06 receives a complete but session-only application that can solve all five
exercises.
