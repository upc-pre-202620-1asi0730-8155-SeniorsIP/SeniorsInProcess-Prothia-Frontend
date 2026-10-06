import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * Role Store that manages the active persona/profile key for persistence:
 * - 'technician': Técnico Ortoprotésico
 * - 'therapist': Terapeuta Clínico
 * - 'patient': Paciente Amputado
 */
export const useRoleStore = defineStore('role', () => {
  const currentRole = ref(localStorage.getItem('prothia_role') || 'technician');
  const showRegisterDialog = ref(false);

  function setRole(roleKey) {
    currentRole.value = roleKey;
    localStorage.setItem('prothia_role', roleKey);
  }

  function openRegisterDialog() {
    showRegisterDialog.value = true;
  }

  function closeRegisterDialog() {
    showRegisterDialog.value = false;
  }

  return {
    currentRole,
    showRegisterDialog,
    setRole,
    openRegisterDialog,
    closeRegisterDialog
  };
});

export default useRoleStore;
