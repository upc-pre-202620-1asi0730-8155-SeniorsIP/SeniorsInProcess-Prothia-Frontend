/**
 * Navigation option entity within the Option bounded context.
 * Represents one entry of the main menu of the clinical portal.
 *
 * @class Option
 */
export class Option {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?number} [params.id=null] - Option identifier.
     * @param {string} [params.label=''] - i18n key of the option label (e.g. 'option.dashboard').
     * @param {string} [params.to=''] - Route path the option navigates to.
     * @param {string} [params.icon=''] - PrimeIcons class name (e.g. 'pi-users').
     * @param {boolean} [params.exact=false] - Whether the option is active only on an exact route match.
     * @param {number} [params.badge=0] - Counter shown next to the label; 0 hides it.
     * @param {number} [params.order=0] - Position of the option in the menu.
     */
    constructor({ id = null, label = '', to = '', icon = '', exact = false, badge = 0, order = 0 }) {
        this.id = id;
        this.label = label;
        this.to = to;
        this.icon = icon;
        this.exact = exact;
        this.badge = badge;
        this.order = order;
    }
}
