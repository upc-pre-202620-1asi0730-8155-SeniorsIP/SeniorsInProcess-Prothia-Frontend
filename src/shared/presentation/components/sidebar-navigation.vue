<script setup>
import { useI18n } from "vue-i18n";
import AvatarInitials from "./avatar-initials.vue";
import OptionMenu from "../../../option/presentation/components/option-menu.vue";

/**
 * Dark side navigation: brand, main menu and signed-in professional.
 * The menu entries belong to the Option bounded context (<option-menu/>).
 * user: { name, role, location }
 */
defineProps({
  user:  { type: Object, required: true }
});
const emit = defineEmits(['navigate']);
const { t } = useI18n();
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__brand">
      <span class="sidebar__logo" aria-hidden="true"/>
      <div>
        <p class="sidebar__name">PROTHIA</p>
        <p class="sidebar__tagline">{{ t('shell.brand-tagline') }}</p>
      </div>
    </div>

    <div class="sidebar__nav">
      <option-menu @navigate="emit('navigate')"/>
    </div>

    <footer class="sidebar__user">
      <avatar-initials :name="user.name" tone="teal" :size="38"/>
      <div class="sidebar__user-text">
        <p class="sidebar__user-name">{{ user.name }}</p>
        <p class="sidebar__user-role">{{ user.role }}<template v-if="user.location"> • {{ user.location }}</template></p>
      </div>
    </footer>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--pt-navy-900);
  color: #ffffff;
}
.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1.5rem 1.4rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.sidebar__logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--pt-teal);
}
.sidebar__name { margin: 0; font-size: 1.0625rem; font-weight: 800; letter-spacing: 0.02em; line-height: 1.2; }
.sidebar__tagline {
  margin: 0.1rem 0 0;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #4fc3c0;
}

.sidebar__nav { padding: 1.1rem 1rem; flex: 1; overflow-y: auto; }

.sidebar__user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.1rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.sidebar__user-text { min-width: 0; }
.sidebar__user-name { margin: 0; font-size: 0.8125rem; font-weight: 700; }
.sidebar__user-role { margin: 0; font-size: 0.6875rem; color: #8ea1b4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
