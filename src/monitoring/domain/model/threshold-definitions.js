/**
 * Definition of every alert threshold that can be calibrated for a patient.
 * Labels, descriptions and units are translated under `alerts.thresholds.<key>`.
 */
export const thresholdDefinitions = [
    { key: 'pelvicTilt', min: 0,   max: 30,  step: 1,   defaultValue: 12 },
    { key: 'asymmetry',  min: 0,   max: 40,  step: 1,   defaultValue: 15 },
    { key: 'cadence',    min: 40,  max: 140, step: 1,   defaultValue: 75 },
    { key: 'impactPeak', min: 0.5, max: 3,   step: 0.1, defaultValue: 1.3 }
];
