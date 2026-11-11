import {ThresholdProfile} from "../domain/model/threshold-profile.entity.js";

/**
 * Maps threshold profile resources into domain entities.
 *
 * @class ThresholdAssembler
 */
export class ThresholdAssembler {
    static toEntityFromResource(resource) {
        return new ThresholdProfile({...resource});
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        let resources = Array.isArray(response.data) ? response.data : (response.data?.['thresholds'] || []);

        return resources.map(resource => this.toEntityFromResource(resource));
    }

    static toCreateResourceFromEntity(entity) {
        return {
            patientId: Number(entity.patientId),
            pelvicTilt: Number(entity.pelvicTilt),
            asymmetry: Number(entity.asymmetry),
            cadence: Number(entity.cadence),
            impactPeak: Number(entity.impactPeak)
        };
    }

    static toUpdateResourceFromEntity(entity) {
        return {
            pelvicTilt: Number(entity.pelvicTilt),
            asymmetry: Number(entity.asymmetry),
            cadence: Number(entity.cadence),
            impactPeak: Number(entity.impactPeak)
        };
    }
}
