import { MaintenanceSchedule } from "../domain/model/maintenance-schedule.entity.js";

/**
 * Maps maintenance schedule resources into domain entities.
 *
 * @class MaintenanceScheduleAssembler
 */
export class MaintenanceScheduleAssembler {
    /**
     * @param {Object} resource
     * @returns {MaintenanceSchedule}
     */
    static toEntityFromResource(resource) {
        return new MaintenanceSchedule({ ...resource });
    }

    /**
     * @param {import('axios').AxiosResponse<Array<Object>|Object>} response
     * @returns {MaintenanceSchedule[]}
     */
    static toEntitiesFromResponse(response) {
        if (!response || response.status !== 200) {
            return [];
        }
        const resources = Array.isArray(response.data) ? response.data : (response.data['maintenanceSchedules'] || []);
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
