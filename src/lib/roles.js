const ROLE_KEY = "tenant_passport_role_by_user_v1";

function loadRoleMap() {
  try {
    return JSON.parse(localStorage.getItem(ROLE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveRoleMap(map) {
  localStorage.setItem(ROLE_KEY, JSON.stringify(map));
}

export function getUserRole(userId) {
  if (!userId) return null;
  const map = loadRoleMap();
  return map[userId] || null; // "tenant" | "manager" | null
}

export function setUserRole(userId, role) {
  if (!userId) return;
  const map = loadRoleMap();
  map[userId] = role;
  saveRoleMap(map);
}

export function clearUserRole(userId) {
  if (!userId) return;
  const map = loadRoleMap();
  delete map[userId];
  saveRoleMap(map);
}
