/**
 * Maps a delivery address from get_addresses (snake_case) to AddAddressModal form fields (camelCase).
 * @param {Object} addr - Address row from API
 * @returns {Object} Form state shape for AddAddressModal
 */
export function addressApiRecordToForm(addr) {
  if (!addr) {
    return {
      alias: '',
      nameReceived: '',
      phoneReceived: '',
      street: '',
      externalNumber: '',
      internalNumber: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      addressReferences: '',
    };
  }
  return {
    alias: addr.alias ?? '',
    nameReceived: addr.name_received ?? '',
    phoneReceived: String(addr.phone_received ?? '')
      .replace(/\D/g, '')
      .slice(0, 10),
    street: addr.street ?? '',
    externalNumber: addr.external_number ?? '',
    internalNumber: addr.internal_number ?? '',
    neighborhood: addr.neighborhood ?? '',
    city: addr.city ?? '',
    state: addr.state ?? '',
    zipCode: String(addr.zip_code ?? '')
      .replace(/\D/g, '')
      .slice(0, 5),
    addressReferences: addr.address_references ?? '',
  };
}

/**
 * @param {Object} addr - Address from API
 * @returns {boolean} true if this is the principal (non-editable) address
 */
export function isPrincipalAddress(addr) {
  return addr?.is_principal === 1;
}
