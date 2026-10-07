/**
 * Menu used when the options endpoint is not reachable, so the portal always has navigation.
 * Mirrors the `options` collection of server/db.json.
 */
export const defaultOptions = [
    { id: 1, label: 'option.dashboard',     to: '/home',          icon: 'pi-th-large',               exact: true,  badge: 0, order: 1 },
    { id: 2, label: 'option.patients',      to: '/patients',      icon: 'pi-users',                  exact: false, badge: 0, order: 2 },
    { id: 3, label: 'option.prescriptions', to: '/prescriptions', icon: 'pi-clipboard',              exact: false, badge: 0, order: 3 },
    { id: 4, label: 'option.alerts',        to: '/alerts',        icon: 'pi-exclamation-triangle',   exact: false, badge: 3, order: 4 },
    { id: 5, label: 'option.workshops',     to: '/workshops',     icon: 'pi-arrow-right-arrow-left', exact: false, badge: 0, order: 5 },
    { id: 6, label: 'option.reports',       to: '/reports',       icon: 'pi-file',                   exact: false, badge: 0, order: 6 },
    { id: 7, label: 'option.subscription',  to: '/subscription',  icon: 'pi-credit-card',            exact: false, badge: 0, order: 7 }
];
