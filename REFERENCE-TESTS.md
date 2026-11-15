# Owned original reference tests

These4 original test files belong to image-editor because their imported source modules match this repository’s exact captured blobs. Current implementation files and assertions are unchanged. Import and proven fixture/resource URL locators are ported to this repository; no cross-repository private source imports or compatibility path shims are added.

Mechanical source-test baseline `3b931d6c5590b48f14bca3efecd5c23a7a7cb3b0`; merge `eb271c2ab2ebfc34ba0e18c6b29e8e8c118a770a`. Private phase44 preserves earlier paths, explicit copy boundaries and source-to-result commit/ref maps. The locator-normalized complete AST is unchanged, not just selected assertions.

Run `npm run test:reference`. This is Node unit/reference qualification of the retained domain modules, not browser/worker/kernel/renderer/storage/authentication/human-agent acceptance. Current app hosting/build and shared-operation integration gates remain separately open.

Captured baseline and current port: 8 pass, 0 fail, 0 cancelled, 0 skipped across 8 reported Node subtests. Top-level assertion-only files count as one reported Node subtest, not individual assertions.
