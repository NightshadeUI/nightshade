import { ParticleSystemController } from '@nightshadeui/particle-system/src';

/**
 * Creates the controller the particle showcase drives.
 */
export class ParticleDemoManager {

    createController() {
        return new ParticleSystemController();
    }

}
