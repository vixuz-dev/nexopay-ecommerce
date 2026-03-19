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
    dateOfBirth: user.birthdate ?? '',
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
