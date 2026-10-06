/**
 * Application service store for the Option bounded context.
 * It loads the navigation menu and keeps UI-facing state.
 *
 * @module useOptionStore
 */
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {OptionApi} from "../infrastructure/option-api.js";
import {OptionAssembler} from "../infrastructure/option.assembler.js";
import {defaultOptions} from "../domain/model/default-options.js";

const optionApi = new OptionApi();

/**
 * Reactive store that exposes Option commands and queries.
 *
 * @returns {Object} Store state and actions.
 */
const useOptionStore = defineStore('option', () => {
    /**
     * List of option entities.
     * @type {import('vue').Ref<Option[]>}
     */
    const options = ref([]);
    /**
     * List of errors encountered during API operations.
     * @type {import('vue').Ref<Error[]>}
     */
    const errors = ref([]);
    /**
     * Whether options have been loaded.
     * @type {import('vue').Ref<boolean>}
     */
    const optionsLoaded = ref(false);
    /**
     * Number of loaded options.
     * @type {import('vue').ComputedRef<number>}
     */
    const optionsCount = computed(() => optionsLoaded.value ? options.value.length : 0);

    /**
     * Loads options from infrastructure. If the API fails, falls back to the default menu.
     * @returns {void}
     */
    function fetchOptions() {
        optionApi.getOptions().then(response => {
            options.value = OptionAssembler.toEntitiesFromResponse(response);
            optionsLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
            options.value = defaultOptions.map(resource => OptionAssembler.toEntityFromResource(resource));
            optionsLoaded.value = true;
        });
    }

    return { options, errors, optionsLoaded, optionsCount, fetchOptions };
});

export default useOptionStore;