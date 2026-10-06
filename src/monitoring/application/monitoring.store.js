/**
 * Application service store for the Monitoring bounded context.
 * It coordinates alert resolution and per-patient threshold calibration.
 *
 * @module useMonitoringStore
 */
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {MonitoringApi} from "../infrastructure/monitoring-api.js";
import {AlertAssembler} from "../infrastructure/alert.assembler.js";
import {ThresholdAssembler} from "../infrastructure/threshold.assembler.js";
import {ThresholdProfile} from "../domain/model/threshold-profile.entity.js";
import {GaitSession} from "../domain/model/gait-session.entity.js";

import { Alert } from "../domain/model/alert.entity.js";

const defaultAlerts = [
    new Alert({
        id: 1,
        patientId: 1,
        patientName: 'Carlos Mendoza',
        deviationType: 'Inclinación Pélvica Lateral',
        recordedValue: '+14°',
        threshold: '>12°',
        severity: 'warning',
        status: 'pending',
        occurredAt: '2026-09-12T10:15:00'
    }),
    new Alert({
        id: 2,
        patientId: 2,
        patientName: 'Roberto Sánchez',
        deviationType: 'Pico de Carga en Talón',
        recordedValue: '1,150 N',
        threshold: '>950 N',
        severity: 'critical',
        status: 'pending',
        occurredAt: '2026-09-11T18:20:00'
    }),
    new Alert({
        id: 3,
        patientId: 4,
        patientName: 'Jorge Alarcón',
        deviationType: 'Asimetría Bilateral Brusca',
        recordedValue: '22%',
        threshold: '>15%',
        severity: 'warning',
        status: 'resolved',
        occurredAt: '2026-09-10T11:00:00'
    })
];

const defaultThresholdProfiles = [
    new ThresholdProfile({ id: 1, patientId: 1, pelvicTilt: 19, asymmetry: 15, cadence: 102, impactPeak: 1.3 }),
    new ThresholdProfile({ id: 2, patientId: 2, pelvicTilt: 10, asymmetry: 12, cadence: 60, impactPeak: 1.2 }),
    new ThresholdProfile({ id: 3, patientId: 3, pelvicTilt: 12, asymmetry: 15, cadence: 80, impactPeak: 1.3 }),
    new ThresholdProfile({ id: 4, patientId: 4, pelvicTilt: 14, asymmetry: 15, cadence: 90, impactPeak: 1.5 })
];

const defaultGaitSessions = [
    new GaitSession({
        id: 1,
        datetime: '12/09/2026 10:15 AM',
        duration: '24 min',
        steps: '2,140',
        cadence: '88 pasos/min',
        symmetry: '94% (Excelente)',
        symmetryType: 'green',
        alerts: '0 incidentes',
        alertType: 'green',
        impact: '620 N'
    }),
    new GaitSession({
        id: 2,
        datetime: '11/09/2026 16:40 PM',
        duration: '30 min',
        steps: '2,890',
        cadence: '85 pasos/min',
        symmetry: '91% (Óptimo)',
        symmetryType: 'green',
        alerts: '1 compensación',
        alertType: 'yellow',
        impact: '680 N'
    }),
    new GaitSession({
        id: 3,
        datetime: '10/09/2026 09:10 AM',
        duration: '18 min',
        steps: '1,620',
        cadence: '94 pasos/min',
        symmetry: '90% (Óptimo)',
        symmetryType: 'green',
        alerts: '0 incidentes',
        alertType: 'green',
        impact: '640 N'
    }),
    new GaitSession({
        id: 4,
        datetime: '09/09/2026 17:00 PM',
        duration: '35 min',
        steps: '3,100',
        cadence: '82 pasos/min',
        symmetry: '88% (Aceptable)',
        symmetryType: 'teal',
        alerts: '2 compensaciones',
        alertType: 'orange',
        impact: '750 N'
    }),
    new GaitSession({
        id: 5,
        datetime: '08/09/2026 11:20 AM',
        duration: '22 min',
        steps: '1,950',
        cadence: '90 pasos/min',
        symmetry: '93% (Excelente)',
        symmetryType: 'green',
        alerts: '0 incidentes',
        alertType: 'green',
        impact: '610 N'
    })
];

const monitoringApi = new MonitoringApi();

/**
 * Reactive store that exposes Monitoring commands and queries.
 *
 * @returns {Object} Store state and actions.
 */
const useMonitoringStore = defineStore('monitoring', () => {
    /** @type {import('vue').Ref<Alert[]>} */
    const alerts = ref([...defaultAlerts]);
    /** @type {import('vue').Ref<ThresholdProfile[]>} */
    const thresholdProfiles = ref([...defaultThresholdProfiles]);
    /** @type {import('vue').Ref<GaitSession[]>} */
    const gaitSessions = ref([...defaultGaitSessions]);
    /** @type {import('vue').Ref<Error[]>} */
    const errors = ref([]);
    const alertsLoaded = ref(true);
    const thresholdsLoaded = ref(true);
    /** @type {import('vue').ComputedRef<number>} */
    const pendingCount = computed(() => alerts.value.filter(alert => alert.isPending).length);

    /** Loads alerts from infrastructure. */
    function fetchAlerts() {
        return monitoringApi.getAlerts().then(response => {
            const list = AlertAssembler.toEntitiesFromResponse(response);
            if (list.length > 0) {
                alerts.value = list;
            }
            alertsLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
            alertsLoaded.value = true;
        });
    }

    /** Loads threshold profiles from infrastructure. */
    function fetchThresholdProfiles() {
        return monitoringApi.getThresholdProfiles().then(response => {
            const list = ThresholdAssembler.toEntitiesFromResponse(response);
            if (list.length > 0) {
                thresholdProfiles.value = list;
            }
            thresholdsLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
            thresholdsLoaded.value = true;
        });
    }

    /**
     * Marks an alert as resolved optimistically.
     * @param {Alert} alert - Alert to resolve.
     * @returns {Promise<any>} Resolves when the alert was updated.
     */
    function resolveAlert(alert) {
        const resource = { ...alert, status: 'resolved' };
        const target = alerts.value.find(item => item.id === alert.id);
        if (target) {
            target.status = 'resolved';
        }
        return monitoringApi.updateAlert(resource).then(response => {
            const resolved = AlertAssembler.toEntityFromResource(response.data);
            const index = alerts.value.findIndex(item => item.id === resolved.id);
            if (index >= 0) alerts.value[index] = resolved;
            return resolved;
        }).catch(error => {
            errors.value.push(error);
            return resource;
        });
    }

    /**
     * @param {number} patientId - Patient identifier.
     * @returns {ThresholdProfile} Stored profile, or a profile with default values if none exists.
     */
    function getThresholdProfileByPatientId(patientId) {
        return thresholdProfiles.value.find(profile => profile.patientId === patientId)
            ?? new ThresholdProfile({ patientId });
    }

    /**
     * Creates or updates a patient's threshold profile optimistically.
     * @param {ThresholdProfile} profile - Profile to persist.
     * @returns {Promise<any>} Resolves when the profile was stored.
     */
    function saveThresholdProfile(profile) {
        const entity = profile instanceof ThresholdProfile ? profile : new ThresholdProfile(profile);
        if (!entity.id) entity.id = Date.now();
        const existingIdx = thresholdProfiles.value.findIndex(item => item.patientId === entity.patientId);
        if (existingIdx >= 0) {
            thresholdProfiles.value[existingIdx] = entity;
        } else {
            thresholdProfiles.value.push(entity);
        }

        const request = entity.id && entity.id < 1000000000000
            ? monitoringApi.updateThresholdProfile(entity)
            : monitoringApi.createThresholdProfile(entity);
        return request.then(response => {
            const saved = ThresholdAssembler.toEntityFromResource(response.data);
            const index = thresholdProfiles.value.findIndex(item => item.id === saved.id || item.patientId === saved.patientId);
            if (index >= 0) thresholdProfiles.value[index] = saved; else thresholdProfiles.value.push(saved);
            return saved;
        }).catch(error => {
            errors.value.push(error);
            return entity;
        });
    }

    /**
     * Records a completed gait walking session into the biomechanical history.
     * @param {GaitSession|Object} session - Gait session to record.
     */
    function recordGaitSession(session) {
        const entity = session instanceof GaitSession ? session : new GaitSession(session);
        gaitSessions.value.unshift(entity);
    }

    return {
        alerts, thresholdProfiles, gaitSessions, errors, alertsLoaded, thresholdsLoaded, pendingCount,
        fetchAlerts, fetchThresholdProfiles, resolveAlert, getThresholdProfileByPatientId, saveThresholdProfile, recordGaitSession
    };
});

export { useMonitoringStore };
export default useMonitoringStore;
