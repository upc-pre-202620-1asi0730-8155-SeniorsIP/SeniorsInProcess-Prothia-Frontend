import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { WorkshopApi } from "../infrastructure/workshop-api.js";
import { Prosthesis } from "../domain/model/prosthesis.entity.js";
import { MaintenanceSchedule } from "../domain/model/maintenance-schedule.entity.js";
import { ProsthesisAssembler } from "../infrastructure/prosthesis.assembler.js";
import { MechanicalAlertAssembler } from "../infrastructure/mechanical-alert.assembler.js";
import { MaintenanceScheduleAssembler } from "../infrastructure/maintenance-schedule.assembler.js";

const workshopApi = new WorkshopApi();

export const useWorkshopStore = defineStore('workshop', () => {
    const prostheses = ref([]);
    const mechanicalAlerts = ref([]);
    const maintenances = ref([]);
    const loaded = ref(false);
    const errors = ref([]);

    // UI Dialog & Detail States
    const activeProsthesisForDetail = ref(null);
    const showDetailDialog = ref(false);
    const activeAlertForSchedule = ref(null);
    const showScheduleDialog = ref(false);
    const showRegisterProsthesisDialog = ref(false);

    // Fleet Summary Metrics (dynamically computed from reactive state)
    const stats = computed(() => ({
        monitoredCount: prostheses.value.length || 0,
        capacity: 100,
        linkedPatients: prostheses.value.filter(p => p.patientName && !p.patientName.includes('sin asignar')).length,
        scheduledThisWeek: maintenances.value.filter(m => m.status === 'scheduled').length,
        fatigueAlertsCount: mechanicalAlerts.value.filter(a => a.status === 'pending').length,
        totalAccumulatedHours: '12.4k',
        iotTelemetryPercentage: 100
    }));

    function fetchFleet() {
        return workshopApi.getProstheses()
            .then(res => {
                prostheses.value = ProsthesisAssembler.toEntitiesFromResponse(res);
                loaded.value = true;
            })
            .catch(err => {
                errors.value.push(err);
            });
    }

    function fetchAlerts() {
        return workshopApi.getMechanicalAlerts()
            .then(res => {
                mechanicalAlerts.value = MechanicalAlertAssembler.toEntitiesFromResponse(res);
            })
            .catch(err => {
                errors.value.push(err);
            });
    }

    function fetchMaintenances() {
        return workshopApi.getMaintenances()
            .then(res => {
                maintenances.value = MaintenanceScheduleAssembler.toEntitiesFromResponse(res);
            })
            .catch(err => {
                errors.value.push(err);
            });
    }

    function addProsthesis(data) {
        const payload = {
            serialNumber: data.serialNumber || `PR-2026-TT-${Math.floor(100 + Math.random() * 900)}`,
            type: data.type || 'Transtibial Carbono',
            patientName: data.patientName || 'Paciente Nuevo',
            clinicName: data.clinicName || 'Rehab Lima Sur',
            accumulatedCycles: Number(data.accumulatedCycles) || 0,
            cycleLimit: Number(data.cycleLimit) || 800000,
            lastService: 'Recién vinculado',
            status: 'optimal',
            batteryLevel: 100,
            sensorStatus: 'online',
            kLevel: data.kLevel || 'K3',
            socketType: data.socketType || 'Fibra de Carbono Termoformada',
            kneeType: data.kneeType || 'N/A',
            footType: data.footType || 'Pie dinámico'
        };

        return workshopApi.createProsthesis(payload)
            .then(res => {
                const entity = ProsthesisAssembler.toEntityFromResource(res.data);
                prostheses.value.unshift(entity);
                return entity;
            })
            .catch(err => {
                errors.value.push(err);
                const entity = new Prosthesis({ id: Date.now(), ...payload });
                prostheses.value.unshift(entity);
                return entity;
            });
    }

    function associateProsthesis(id, patientName, clinicName = 'Rehab Lima Sur') {
        return workshopApi.associateProsthesis(id, patientName, clinicName)
            .then(res => {
                const updated = ProsthesisAssembler.toEntityFromResource(res.data);
                const idx = prostheses.value.findIndex(p => p.id === updated.id);
                if (idx !== -1) prostheses.value[idx] = updated;
                return updated;
            })
            .catch(err => {
                errors.value.push(err);
                const item = prostheses.value.find(p => p.id === id);
                if (item) {
                    item.patientName = patientName;
                    item.clinicName = clinicName;
                    item.status = 'optimal';
                }
                return item;
            });
    }

    function createMaintenance(data) {
        const payload = {
            serialNumber: data.serialNumber || 'PR-2026-TT-084',
            patientName: data.patientName || 'Carlos Mendoza Arias',
            scheduledDate: data.scheduledDate || new Date().toLocaleDateString('es-PE'),
            interventionType: data.interventionType || 'Mantenimiento Preventivo',
            technicianName: data.technicianName || 'Ing. Roberto Valdivia',
            status: 'scheduled',
            notes: data.notes || ''
        };

        return workshopApi.createMaintenance(payload)
            .then(res => {
                const entity = MaintenanceScheduleAssembler.toEntityFromResource(res.data);
                maintenances.value.unshift(entity);
                return entity;
            })
            .catch(err => {
                errors.value.push(err);
                const entity = new MaintenanceSchedule({ id: Date.now(), ...payload });
                maintenances.value.unshift(entity);
                return entity;
            });
    }

    function scheduleImmediateRevision(alertItem, date, notes) {
        const payload = {
            serialNumber: alertItem.serialNumber,
            patientName: alertItem.patientName,
            scheduledDate: date || new Date().toLocaleDateString('es-PE'),
            interventionType: `Revisión inmediata: ${alertItem.component}`,
            technicianName: 'Ing. Roberto Valdivia',
            status: 'scheduled',
            notes: notes || alertItem.description
        };

        const resolvePromise = alertItem.id
            ? workshopApi.resolveMechanicalAlert(alertItem.id).catch(() => null)
            : Promise.resolve(null);

        return Promise.all([
            workshopApi.createMaintenance(payload),
            resolvePromise
        ])
            .then(([res]) => {
                const entity = MaintenanceScheduleAssembler.toEntityFromResource(res.data);
                maintenances.value.unshift(entity);
                const found = mechanicalAlerts.value.find(a => a.id === alertItem.id);
                if (found) found.status = 'scheduled';
                return entity;
            })
            .catch(err => {
                errors.value.push(err);
                const entity = new MaintenanceSchedule({ id: Date.now(), ...payload });
                maintenances.value.unshift(entity);
                const found = mechanicalAlerts.value.find(a => a.id === alertItem.id);
                if (found) found.status = 'scheduled';
                return entity;
            });
    }

    function completeMaintenance(id, notes = '') {
        const item = maintenances.value.find(m => m.id === id);
        if (item) {
            item.status = 'completed';
            if (notes) {
                item.notes = (item.notes ? item.notes + ' • ' : '') + `Atención: ${notes}`;
            }
        }
        return workshopApi.completeMaintenance(id, item?.notes || notes || '')
            .then(res => {
                const updated = MaintenanceScheduleAssembler.toEntityFromResource(res.data);
                const idx = maintenances.value.findIndex(m => m.id === updated.id);
                if (idx !== -1) maintenances.value[idx] = updated;
                return updated;
            })
            .catch(err => {
                errors.value.push(err);
                return item;
            });
    }

    function openProsthesisDetail(prosthesis) {
        activeProsthesisForDetail.value = prosthesis;
        showDetailDialog.value = true;
    }

    function openScheduleForAlert(alert) {
        activeAlertForSchedule.value = alert;
        showScheduleDialog.value = true;
    }

    return {
        prostheses,
        mechanicalAlerts,
        maintenances,
        loaded,
        errors,
        stats,
        activeProsthesisForDetail,
        showDetailDialog,
        activeAlertForSchedule,
        showScheduleDialog,
        showRegisterProsthesisDialog,
        fetchFleet,
        fetchAlerts,
        fetchMaintenances,
        addProsthesis,
        associateProsthesis,
        createMaintenance,
        scheduleImmediateRevision,
        completeMaintenance,
        openProsthesisDetail,
        openScheduleForAlert
    };
});

export default useWorkshopStore;
