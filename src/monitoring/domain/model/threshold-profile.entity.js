import {thresholdDefinitions} from "./threshold-definitions.js";

/**
 * Alert thresholds calibrated for one patient.
 *
 * @class ThresholdProfile
 */
export class ThresholdProfile {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?number} [params.id=null] - Profile identifier.
     * @param {?number} [params.patientId=null] - Patient the profile belongs to.
     * @param {number} [params.pelvicTilt] - Maximum lateral pelvic tilt, in degrees.
     * @param {number} [params.asymmetry] - Bilateral asymmetry tolerance, in percent.
     * @param {number} [params.cadence] - Minimum expected cadence, in steps per minute.
     * @param {number} [params.impactPeak] - Maximum impact load, as a multiple of body weight.
     */
    constructor({ id = null, patientId = null, pelvicTilt, asymmetry, cadence, impactPeak }) {
        const given = { pelvicTilt, asymmetry, cadence, impactPeak };
        this.id = id;
        this.patientId = patientId;
        for (const { key, defaultValue } of thresholdDefinitions) {
            this[key] = given[key] ?? defaultValue;
        }
    }

    /** @returns {Object<string, number>} Threshold values keyed by definition key. */
    get values() {
        return Object.fromEntries(thresholdDefinitions.map(({ key }) => [key, this[key]]));
    }
}
