let roles = [
  { id: '1', name: 'Financeiro' },
  { id: '2', name: 'RH' },
];

export async function getRoles() {
  return roles;
}

export async function createRole(name: string) {

  const exists = roles.find((r) => r.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    throw new Error(`O cargo "${name}" já existe.`);
  }

  const newRole = {
    id: crypto.randomUUID(),
    name,
  };

  roles.push(newRole);
  return newRole;
}
