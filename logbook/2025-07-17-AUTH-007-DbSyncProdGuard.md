# AUTH-007 DB Sync Production Guard

## Task
Add guard in auth service AppModule to prevent DB schema sync in production.

## Plan
- Update AppModule useFactory to throw if DB_SYNC=true and NODE_ENV=production.
- Update implementation guide docs.
- Add unit test verifying module startup fails with that config.
- Update project board.

## Outcome
Implemented guard, docs, tests. All tests pass.
