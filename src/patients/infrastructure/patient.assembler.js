import {Patient} from "../domain/model/patient.entity.js";

const AMPUTATION_TO_API = {
    'Transtibial Der.': 'TranstibialRight',
    'Transtibial Izq.': 'TranstibialLeft',
    'Transtibial Bilateral': 'TranstibialBilateral',
    'Transfemoral Der.': 'TransfemoralRight',
    'Transfemoral Izq.': 'TransfemoralLeft',
    'Transfemoral Bilateral': 'TransfemoralBilateral'
};

const AMPUTATION_FROM_API = {
    transtibialRight: 'Transtibial Der.',
    TranstibialRight: 'Transtibial Der.',
    transtibialLeft: 'Transtibial Izq.',
    TranstibialLeft: 'Transtibial Izq.',
    transtibialBilateral: 'Transtibial Bilateral',
    TranstibialBilateral: 'Transtibial Bilateral',
    transfemoralRight: 'Transfemoral Der.',
    TransfemoralRight: 'Transfemoral Der.',
    transfemoralLeft: 'Transfemoral Izq.',
    TransfemoralLeft: 'Transfemoral Izq.',
    transfemoralBilateral: 'Transfemoral Bilateral',
    TransfemoralBilateral: 'Transfemoral Bilateral'
};

/**
 * Maps patient resources into domain entities.
 *
 * @class PatientAssembler
 */
export class PatientAssembler {
    /**
     * @param {Object} resource - Patient resource payload.
     * @returns {Patient} Patient entity.
     */
    static toEntityFromResource(resource) {
        return new Patient({
            ...resource,
            amputation: AMPUTATION_FROM_API[resource.amputation] || resource.amputation
        });
    }

    /**
     * @param {Patient|Object} entity - Patient entity.
     * @returns {Object} Resource payload for Backend API.
     */
    static toResourceFromEntity(entity) {
        return {
            fullName: entity.fullName,
            dni: entity.dni,
            age: Number(entity.age),
            amputation: AMPUTATION_TO_API[entity.amputation] || entity.amputation,
            kLevel: entity.kLevel,
            prosthesisCode: entity.prosthesisCode || null
        };
    }

    /**
     * @param {import('axios').AxiosResponse<Array<Object>|Object>} response - HTTP response with patient resources.
     * @returns {Patient[]} Patient entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        let resources = Array.isArray(response.data) ? response.data : (response.data?.['patients'] || []);

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
