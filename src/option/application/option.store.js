import {defineStore} from "pinia";
import {ref} from "vue";
import {Option} from "../domain/model/option.entity.js";
import {OptionApi} from "../infrastructure/option-api.js";
import {OptionAssembler} from "../infrastructure/option.assembler.js";

const optionApi = new OptionApi();

const defaultOptions = [
    new Option({ id: 1, label: 'option.dashboard',     to: '/home',          icon: 'pi-th-large',               exact: true,  badge: 0, order: 1 }),
    new Option({ id: 2, label: 'option.patients',      to: '/patients',      icon: 'pi-users',                  exact: false, badge: 0, order: 2 }),
    new Option({ id: 3, label: 'option.prescriptions', to: '/prescriptions', icon: 'pi-clipboard',              exact: false, badge: 0, order: 3 }),
    new Option({ id: 4, label: 'option.alerts',        to: '/alerts',        icon: 'pi-exclamation-triangle',   exact: false, badge: 3, order: 4 }),
    new Option({ id: 5, label: 'option.workshops',     to: '/workshops',     icon: 'pi-arrow-right-arrow-left', exact: false, badge: 0, order: 5 }),
    new Option({ id: 6, label: 'option.reports',       to: '/reports',       icon: 'pi-file',                   exact: false, badge: 0, order: 6 }),
    new Option({ id: 7, label: 'option.subscription',  to: '/subscription',  icon: 'pi-credit-card',            exact: false, badge: 0, order: 7 })
];

const useOptionStore = defineStore('option', () => {
    const options = ref(defaultOptions);
    const errors = ref([]);
    const optionsLoaded = ref(false);

    function fetchOptions() {
        return optionApi.getOptions().then(response => {
            const loaded = OptionAssembler.toEntitiesFromResponse(response);
            if (loaded && loaded.length > 0) {
                options.value = loaded;
            }
            optionsLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
            options.value = defaultOptions.slice().sort((a, b) => a.order - b.order);
            optionsLoaded.value = true;
        });
    }

    return {
        options,
        errors,
        optionsLoaded,
        fetchOptions
    };
});

export default useOptionStore;
