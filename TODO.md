# TODO

- `particle-system/src/helpers/particles.ts` is about the package's own subject: `createParticle` and `stepParticle` belong on a `Particle` entity (or the controller), `resolveParticleConfig` on the config's owner. It's public API, so move it with a release.
