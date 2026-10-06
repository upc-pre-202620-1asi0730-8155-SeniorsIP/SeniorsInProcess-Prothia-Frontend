import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { WorkshopApi } from "../infrastructure/workshop-api.js";
import { Prosthesis } from "../domain/model/prosthesis.entity.js";
import { MechanicalAlert } from "../domain/model/mechanical-alert.entity.js";
import { MaintenanceSchedule } from "../domain/model/maintenance-schedule.entity.js";
import { ProsthesisAssembler } from "../infrastructure/prosthesis.assembler.js";
import { MechanicalAlertAssembler } from "../infrastructure/mechanical-alert.assembler.js";
import { MaintenanceScheduleAssembler } from "../infrastructure/maintenance-schedule.assembler.js";

const workshopApi = new WorkshopApi();

export const useWorkshopStore = defineStore('workshop', () => {
    // Default initial mock dataset precisely matching the reference screenshot and domain
    const defaultProstheses = [
        new Prosthesis({
            id: 1,
            serialNumber: 'PR-2026-TT-084',
            type: 'Transtibial Carbono (Vacío Activo)',
            patientName: 'Carlos Mendoza Arias',
            clinicName: 'Rehab Lima Sur',
            accumulatedCycles: 342100,
            cycleLimit: 800000,
            lastService: '15/05/2026 (Encaje)',
            status: 'optimal',
            batteryLevel: 94,
            sensorStatus: 'online',
            kLevel: 'K3',
            socketType: 'Fibra de Carbono Termoformada (Vacío Activo)',
            kneeType: 'N/A (Transtibial)',
            footType: 'Pie Dinámico de Carbono'
        }),
        new Prosthesis({
            id: 2,
            serialNumber: 'PR-2025-TF-004',
            type: 'Transfemoral Hidráulica',
            patientName: 'Hugo Paredes',
            clinicName: 'Rehab Lima Sur',
            accumulatedCycles: 814200,
            cycleLimit: 800000,
            lastService: '10/01/2026 (Revisión)',
            status: 'critical',
            batteryLevel: 52,
            sensorStatus: 'online',
            kLevel: 'K2',
            socketType: 'Encaje Cuadrilateral con liner de silicona',
            kneeType: 'Rodilla Monocéntrica Hidráulica',
            footType: 'Pie de carbono multieje'
        }),
        new Prosthesis({
            id: 3,
            serialNumber: 'PR-2026-TT-099',
            type: 'Transtibial Ensamblada',
            patientName: 'Disponible sin asignar',
            clinicName: 'Taller Central',
            accumulatedCycles: 0,
            cycleLimit: 800000,
            lastService: 'En ensamblaje',
            status: 'storage',
            batteryLevel: 100,
            sensorStatus: 'online',
            kLevel: 'K2',
            socketType: 'Socket modular termoplástico',
            kneeType: 'N/A (Transtibial)',
            footType: 'Pie Sach Estándar'
        }),
        new Prosthesis({
            id: 4,
            serialNumber: 'PR-2026-TF-012',
            type: 'Transfemoral Hidráulica',
            patientName: 'Roberto Sánchez P.',
            clinicName: 'Rehab Lima Sur',
            accumulatedCycles: 512400,
            cycleLimit: 800000,
            lastService: '20/03/2026 (Alineación)',
            status: 'warning',
            batteryLevel: 68,
            sensorStatus: 'online',
            kLevel: 'K2',
            socketType: 'Encaje Isquiático de Contacto Total',
            kneeType: 'Rodilla Monocéntrica Hidráulica 3R80',
            footType: 'Pie articulado SACH reforzado'
        }),
        new Prosthesis({
            id: 4,
            serialNumber: 'PR-2026-TT-055',
            type: 'Transtibial Bilateral Carbono',
            patientName: 'María Vega Castro',
            clinicName: 'Rehab Lima Sur',
            accumulatedCycles: 195000,
            cycleLimit: 800000,
            lastService: '02/06/2026 (Alineación)',
            status: 'optimal',
            batteryLevel: 88,
            sensorStatus: 'online',
            kLevel: 'K3',
            socketType: 'Socket de vacío activo Harmony',
            kneeType: 'N/A (Transtibial)',
            footType: 'Triton Carbon Foot'
        }),
        new Prosthesis({
            id: 5,
            serialNumber: 'PR-2026-TT-091',
            type: 'Transtibial Carbono',
            patientName: 'Jorge Alarcón Ruiz',
            clinicName: 'Rehab Lima Sur',
            accumulatedCycles: 280000,
            cycleLimit: 800000,
            lastService: '12/04/2026 (Ajuste)',
            status: 'optimal',
            batteryLevel: 91,
            sensorStatus: 'online',
            kLevel: 'K4',
            socketType: 'Liner con pin distal y lanzadera',
            kneeType: 'N/A (Transtibial)',
            footType: 'Vari-Flex XC con rotador'
        })
    ];

    const defaultAlerts = [
        new MechanicalAlert({
            id: 1,
            prosthesisId: 3,
            serialNumber: 'PR-2025-TF-004',
            cycles: 814200,
            cycleLimit: 800000,
            patientName: 'Hugo Paredes',
            kLevel: 'K2',
            component: 'Amortiguador hidráulico de rodilla',
            description: 'El amortiguador hidráulico de rodilla superó el ciclo de vida recomendado de 800,000 ciclos. Riesgo de pérdida de fluido.',
            severity: 'critical',
            status: 'pending',
            occurredAt: 'Hoy 08:30 AM'
        }),
        new MechanicalAlert({
            id: 2,
            prosthesisId: 2,
            serialNumber: 'PR-2026-TF-012',
            cycles: 512400,
            cycleLimit: 800000,
            patientName: 'Roberto Sánchez P.',
            kLevel: 'K2',
            component: 'Elastómero de amortiguación',
            description: 'Desgaste preventivo del elastómero superando el 60% de vida proyectada. Recambio urgente recomendado.',
            severity: 'warning',
            status: 'pending',
            occurredAt: 'Ayer 16:45 PM'
        })
    ];

    const defaultMaintenances = [
        new MaintenanceSchedule({
            id: 1,
            serialNumber: 'PR-2026-TT-084',
            patientName: 'Carlos Mendoza Arias',
            scheduledDate: '18/09/2026',
            interventionType: 'Ajuste de Alineación',
            technicianName: 'Ing. Roberto Valdivia',
            status: 'scheduled',
            notes: 'Solicitud de clínica por leve inclinación lateral. Inspección de alineación sagital y apriete de tornillería de titanio.'
        }),
        new MaintenanceSchedule({
            id: 2,
            serialNumber: 'PR-2025-TF-004',
            patientName: 'Hugo Paredes',
            scheduledDate: '15/09/2026',
            interventionType: 'Alerta de Fatiga (814k ciclos)',
            technicianName: 'Ing. Roberto Valdivia',
            status: 'scheduled',
            notes: 'Recambio urgente de cilindro hidráulico de rodilla por superación de vida útil recomendada.'
        }),
        new MaintenanceSchedule({
            id: 3,
            serialNumber: 'PR-2026-TF-012',
            patientName: 'Roberto Sánchez P.',
            scheduledDate: '22/09/2026',
            interventionType: 'Inspección de Amortiguador',
            technicianName: 'Ing. Roberto Valdivia',
            status: 'scheduled',
            notes: 'Ajuste por detección de impacto en talón superior a 1,150 N. Calibración de amortiguación terminal.'
        }),
        new MaintenanceSchedule({
            id: 4,
            serialNumber: 'PR-2026-TT-055',
            patientName: 'María Vega Castro',
            scheduledDate: '25/09/2026',
            interventionType: 'Revisión Periódica de Vacío',
            technicianName: 'Ing. Roberto Valdivia',
            status: 'scheduled',
            notes: 'Control de presión de bomba de vacío activo Harmony y cambio preventivo de junta tórica.'
        }),
        new MaintenanceSchedule({
            id: 5,
            serialNumber: 'PR-2026-TT-091',
            patientName: 'Jorge Alarcón Ruiz',
            scheduledDate: '28/09/2026',
            interventionType: 'Torque de Conectores',
            technicianName: 'Ing. Roberto Valdivia',
            status: 'scheduled',
            notes: 'Mantenimiento trimestral paciente K4. Verificación de torque en pernos de titanio y rotador.'
        })
    ];

    const prostheses = ref(defaultProstheses);
    const mechanicalAlerts = ref(defaultAlerts);
    const maintenances = ref(defaultMaintenances);
    const loaded = ref(true);
    const errors = ref([]);

    // UI Dialog & Detail States
    const activeProsthesisForDetail = ref(null);
    const showDetailDialog = ref(false);
    const activeAlertForSchedule = ref(null);
    const showScheduleDialog = ref(false);
    const showRegisterProsthesisDialog = ref(false);

    // Fleet Summary Metrics (dynamically computed from reactive state)
    const stats = computed(() => ({
        monitoredCount: prostheses.value.length || 42,
        capacity: 100,
        linkedPatients: prostheses.value.filter(p => p.patientName && !p.patientName.includes('sin asignar')).length,
        scheduledThisWeek: maintenances.value.filter(m => m.status === 'scheduled').length,
        fatigueAlertsCount: mechanicalAlerts.value.filter(a => a.status === 'pending').length,
        totalAccumulatedHours: '12.4k',
        iotTelemetryPercentage: 100
    }));

    function fetchFleet() {
        workshopApi.getProstheses()
            .then(res => {
                const entities = ProsthesisAssembler.toEntitiesFromResponse(res);
                if (entities.length > 0) {
                    prostheses.value = entities;
                }
            })
            .catch(err => {
                errors.value.push(err);
                // Keep defaultProstheses on error
            });
    }

    function fetchAlerts() {
        workshopApi.getMechanicalAlerts()
            .then(res => {
                const entities = MechanicalAlertAssembler.toEntitiesFromResponse(res);
                if (entities.length > 0) {
                    mechanicalAlerts.value = entities;
                }
            })
            .catch(err => {
                errors.value.push(err);
            });
    }

    function fetchMaintenances() {
        workshopApi.getMaintenances()
            .then(res => {
                const entities = MaintenanceScheduleAssembler.toEntitiesFromResponse(res);
                if (entities.length > 0) {
                    maintenances.value = entities;
                }
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
                // Fallback to local memory if fake API is not running
                const entity = new Prosthesis({ id: Date.now(), ...payload });
                prostheses.value.unshift(entity);
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

        return workshopApi.createMaintenance(payload)
            .then(res => {
                const entity = MaintenanceScheduleAssembler.toEntityFromResource(res.data);
                maintenances.value.unshift(entity);
                const found = mechanicalAlerts.value.find(a => a.id === alertItem.id);
                if (found) found.status = 'scheduled';
                return entity;
            })
            .catch(err => {
                errors.value.push(err);
                // Fallback to local memory if fake API is not running
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
        scheduleImmediateRevision,
        completeMaintenance,
        openProsthesisDetail,
        openScheduleForAlert
    };
});

export default useWorkshopStore;
