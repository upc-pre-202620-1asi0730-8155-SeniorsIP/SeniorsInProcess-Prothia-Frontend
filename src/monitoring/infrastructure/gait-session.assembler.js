import { GaitSession } from "../domain/model/gait-session.entity.js";

const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'];

function formatRecordedAt(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return String(isoString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = MONTHS_ES[d.getMonth()] || 'Sept';
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} • ${hours}:${mins}`;
}

/**
 * Assembler transforming raw telemetry session resources into GaitSession domain entities.
 * Part of the Monitoring Bounded Context.
 *
 * @class GaitSessionAssembler
 */
export class GaitSessionAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return new GaitSession();

        // Map Backend GaitSessionResource fields (durationMinutes, symmetryPercent, etc.)
        if (resource.durationMinutes !== undefined || resource.symmetryPercent !== undefined) {
            const sym = Number(resource.symmetryPercent ?? 92);
            const gradeLabel = sym >= 90 ? 'Excelente' : sym >= 85 ? 'Aceptable' : 'Asimetría';
            const symType = sym >= 90 ? 'green' : sym >= 85 ? 'yellow' : 'orange';
            const alertsCount = Number(resource.alertsCount ?? 0);
            const alertsText = alertsCount === 0
                ? '0 incidentes'
                : alertsCount === 1
                    ? '1 alerta leve'
                    : `${alertsCount} alertas`;
            const alertType = alertsCount === 0 ? 'green' : alertsCount === 1 ? 'yellow' : 'orange';

            return new GaitSession({
                id: resource.id,
                datetime: resource.datetime || formatRecordedAt(resource.recordedAt),
                duration: `${resource.durationMinutes ?? 1} min`,
                steps: Number(resource.steps ?? 0).toLocaleString('en-US'),
                cadence: `${resource.cadence ?? 90} pasos/min`,
                symmetry: `${sym}% (${gradeLabel})`,
                symmetryType: symType,
                alerts: alertsText,
                alertType,
                impact: `${resource.impactPeakNewtons ?? 620} N`
            });
        }

        return new GaitSession({
            id: resource.id,
            datetime: resource.datetime,
            duration: resource.duration,
            steps: resource.steps,
            cadence: resource.cadence,
            symmetry: resource.symmetry,
            symmetryType: resource.symmetryType || 'green',
            alerts: resource.alerts || '0 incidentes',
            alertType: resource.alertType || 'green',
            impact: resource.impact || '620 N'
        });
    }

    static toEntitiesFromResponse(response) {
        if (!response || !Array.isArray(response.data)) {
            return [];
        }
        return response.data.map(item => this.toEntityFromResource(item));
    }

    static toResourceFromEntity(entity) {
        const parseNum = (val, fallback) => {
            const cleaned = String(val ?? '').replace(/[^\d]/g, '');
            const parsed = parseInt(cleaned, 10);
            return Number.isNaN(parsed) ? fallback : parsed;
        };
        return {
            patientId: Number(entity.patientId || 1),
            durationMinutes: Math.max(1, parseNum(entity.duration, 1)),
            steps: parseNum(entity.steps, 0),
            cadence: parseNum(entity.cadence, 90),
            symmetryPercent: Math.min(100, Math.max(0, parseNum(entity.symmetry, 92))),
            alertsCount: parseNum(entity.alerts, 0),
            impactPeakNewtons: parseNum(entity.impact, 620)
        };
    }
}
