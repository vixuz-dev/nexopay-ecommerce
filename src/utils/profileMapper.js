/**
 * Normaliza fecha ISO del API a yyyy-MM-dd para inputs type="date".
 * @param {string|undefined|null} value
 * @returns {string}
 */
export const birthdateToDateInputValue = (value) => {
  if (value == null || value === '') return '';
  const s = String(value);
  if (s.includes('T')) return s.slice(0, 10);
  return s;
};

/**
 * Construye objeto cliente a partir del registro de get_personal_information (body[0], snake_case).
 * @param {object|null|undefined} data - Registro plano o respuesta con body[]
 * @returns {object|null}
 */
export const clientFromPersonalInformation = (data) => {
  if (!data || typeof data !== 'object') return null;

  let raw = data;
  if (Array.isArray(data.body)) {
    raw = data.body[0];
  }
  if (!raw || typeof raw !== 'object') return null;
  if (raw.client != null && typeof raw.client === 'object' && !raw.email && !raw.name) {
    raw = raw.client;
  }

  const address = {
    street: raw.street ?? '',
    externalNumber: raw.external_number ?? raw.externalNumber ?? '',
    internalNumber: raw.internal_number ?? raw.internalNumber ?? '',
    neighborhood: raw.neighborhood ?? '',
    city: raw.city ?? '',
    state: raw.state ?? '',
    zipCode: raw.zip_code ?? raw.zipCode ?? '',
    references: raw.address_references ?? raw.references ?? '',
  };

  return {
    name: raw.name ?? '',
    paternalLastName:
      raw.paternalLastName ?? raw.paternal_lastname ?? raw.paternal_last_name ?? '',
    maternalLastName:
      raw.maternalLastName ?? raw.maternal_lastname ?? raw.maternal_last_name ?? '',
    email: raw.email ?? '',
    phone: raw.phone ?? '',
    birthdate: birthdateToDateInputValue(
      raw.birthdate ?? raw.date_of_birth ?? raw.birth_date ?? ''
    ),
    curp: raw.curp ?? '',
    emailVerified: raw.emailVerified ?? raw.email_verified,
    address,
    limitCreditAmount: raw.limitCreditAmount ?? raw.limit_credit_amount,
    creditStatus: raw.creditStatus ?? raw.credit_status,
    hasCreditLine: raw.hasCreditLine ?? raw.has_credit_line,
  };
};

export const userToProfileForm = (user) => {
  if (!user) {
    return {
      name: '',
      paternalLastName: '',
      maternalLastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      curp: '',
      address: {
        street: '',
        number: '',
        interior: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        references: '',
      },
    };
  }

  const addr = user.address ?? {};
  return {
    name: user.name ?? '',
    paternalLastName: user.paternalLastName ?? '',
    maternalLastName: user.maternalLastName ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
    dateOfBirth: birthdateToDateInputValue(user.birthdate ?? ''),
    curp: user.curp ?? '',
    address: {
      street: addr.street ?? '',
      number: addr.externalNumber ?? '',
      interior: addr.internalNumber ?? '',
      neighborhood: addr.neighborhood ?? '',
      city: addr.city ?? '',
      state: addr.state ?? '',
      zipCode: addr.zipCode ?? '',
      references: addr.references ?? '',
    },
  };
};

export const profileFormToClientPayload = (formData, clientId) => ({
  client_id: clientId,
  name: formData.name?.trim() ?? '',
  paternalLastName: formData.paternalLastName?.trim() ?? '',
  maternalLastName: formData.maternalLastName?.trim() ?? '',
  phone: formData.phone?.trim() ?? '',
  birthdate: formData.dateOfBirth || null,
  curp: formData.curp?.trim() || null,
  address: {
    street: formData.address?.street?.trim() ?? '',
    externalNumber: formData.address?.number?.trim() ?? '',
    internalNumber: formData.address?.interior?.trim() ?? '',
    neighborhood: formData.address?.neighborhood?.trim() ?? '',
    city: formData.address?.city?.trim() ?? '',
    state: formData.address?.state?.trim() ?? '',
    zipCode: formData.address?.zipCode?.trim() ?? '',
    references: formData.address?.references?.trim() ?? '',
  },
});
