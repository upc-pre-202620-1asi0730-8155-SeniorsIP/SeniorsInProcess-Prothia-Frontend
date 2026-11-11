import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {MonitoringApi} from "../infrastructure/monitoring-api.js";
import {AlertAssembler} from "../infrastructure/alert.assembler.js";
import {ThresholdAssembler} from "../infrastructure/threshold.assembler.js";
import {GaitSessionAssembler} from "../infrastructure/gait-session.assembler.js";
import {ThresholdProfile} from "../domain/model/threshold-profile.entity.js";
import {GaitSession} from "../domain/model/gait-session.entity.js";

const monitoringApi = new MonitoringApi();

const useMonitoringStore = defineStore('monitoring', () => {
    const alerts = ref([]);
    const thresholdProfiles = ref([]);
    const gaitSessions = ref([]);
    const errors = ref([]);
    const alertsLoaded = ref(false);
    const thresholdsLoaded = ref(false);
    const gaitSessionsLoaded = ref(false);

    const pendingCount = computed(() => alerts.value.filter(alert => alert.isPending).length);

    function fetchAlerts() {
        return monitoringApi.getAlerts().then(response => {
            alerts.value = AlertAssembler.toEntitiesFromResponse(response);
            alertsLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
            alertsLoaded.value = true;
        });
    }

    function fetchThresholdProfiles() {
        return monitoringApi.getThresholdProfiles().then(response => {
            thresholdProfiles.value = ThresholdAssembler.toEntitiesFromResponse(response);
            thresholdsLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
            thresholdsLoaded.value = true;
        });
    }

    function fetchGaitSessions() {
        return monitoringApi.getGaitSessions().then(response => {
            gaitSessions.value = GaitSessionAssembler.toEntitiesFromResponse(response);
            gaitSessionsLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
            gaitSessionsLoaded.value = true;
        });
    }

    function resolveAlert(alert) {
        return monitoringApi.resolveAlert(alert.id).then(response => {
            const updated = AlertAssembler.toEntityFromResource(response.data);
            const index = alerts.value.findIndex(a => a.id === updated.id);
            if (index !== -1) alerts.value[index] = updated;
            return updated;
        }).catch(error => {
            errors.value.push(error);
            throw error;
        });
    }

    function getThresholdProfileByPatientId(patientId) {
        const numericId = Number(patientId);
        return thresholdProfiles.value.find(p => Number(p.patientId) === numericId)
            ?? new ThresholdProfile({ patientId: numericId });
    }

    function applySavedThreshold(saved) {
        const index = thresholdProfiles.value.findIndex(p => p.id === saved.id || Number(p.patientId) === Number(saved.patientId));
        if (index !== -1) thresholdProfiles.value[index] = saved;
        else thresholdProfiles.value.push(saved);
        return saved;
    }

    function saveThresholdProfile(profile) {
        const existingInDb = thresholdProfiles.value.find(p => Number(p.patientId) === Number(profile.patientId) && p.id);
        const entityToSave = existingInDb
            ? new ThresholdProfile({ ...profile, id: existingInDb.id })
            : new ThresholdProfile({ ...profile, id: null });

        const request = entityToSave.id
            ? monitoringApi.updateThresholdProfile(entityToSave).catch(err => {
                if (err?.response?.status === 404) {
                    return monitoringApi.createThresholdProfile(entityToSave);
                }
                throw err;
            })
            : monitoringApi.createThresholdProfile(entityToSave);

        return request
            .then(response => applySavedThreshold(ThresholdAssembler.toEntityFromResource(response.data)))
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function recordGaitSession(sessionData) {
        const entity = new GaitSession({
            id: Date.now(),
            ...sessionData
        });
        return monitoringApi.createGaitSession({ ...entity, patientId: sessionData.patientId || 1 })
            .then(response => {
                const created = GaitSessionAssembler.toEntityFromResource(response.data);
                gaitSessions.value.unshift(created);
                return created;
            })
            .catch(error => {
                errors.value.push(error);
                gaitSessions.value.unshift(entity);
                return entity;
            });
    }

    return {
        alerts,
        thresholdProfiles,
        gaitSessions,
        errors,
        alertsLoaded,
        thresholdsLoaded,
        gaitSessionsLoaded,
        pendingCount,
        fetchAlerts,
        fetchThresholdProfiles,
        fetchGaitSessions,
        resolveAlert,
        getThresholdProfileByPatientId,
        saveThresholdProfile,
        recordGaitSession
    };
});

export default useMonitoringStore;
export { useMonitoringStore };
