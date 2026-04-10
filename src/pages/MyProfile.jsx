import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ROUTES } from '../utils/routes';
import {
  HiOutlineArrowLeft,
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlineIdentification,
  HiOutlineLockClosed,
  HiOutlineCheckCircle,
  HiOutlinePlus,
  HiOutlineBuildingOffice,
  HiOutlineHome,
  HiOutlineShieldCheck,
  HiOutlineCreditCard,
  HiOutlineXMark,
} from 'react-icons/hi2';
import useUserStore from '../stores/userStore';
import useProfileStore from '../stores/profileStore';
import useAddressesStore from '../stores/addressesStore';
import { userToProfileForm, clientFromPersonalInformation } from '../utils/profileMapper';
import useToastStore from '../stores/toastStore';
import AddAddressModal from '../components/common/AddAddressModal';
import { DangerZoneAccountSection } from '../components/account/DangerZoneAccountSection';
import { isPrincipalAddress } from '../utils/addressForm';

const MyProfile = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const profileInformation = useProfileStore((state) => state.profileInformation);
  const personalInformation = useProfileStore((state) => state.personalInformation);
  const fetchPersonalInformation = useProfileStore((state) => state.fetchPersonalInformation);
  const showToast = useToastStore((state) => state.showToast);
  const addresses = useAddressesStore((s) => s.addresses);
  const addressesLoading = useAddressesStore((s) => s.isLoading);
  const fetchAddresses = useAddressesStore((s) => s.fetchAddresses);
  const invalidateAddresses = useAddressesStore((s) => s.invalidateAddresses);

  const [profileData, setProfileData] = useState(userToProfileForm(null));
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const client = useMemo(() => {
    const profileClient = profileInformation?.client;
    const personalClient = clientFromPersonalInformation(personalInformation);
    if (personalClient) {
      return {
        ...profileClient,
        ...personalClient,
        email: personalClient.email || profileClient?.email || user?.email,
        emailVerified:
          personalClient.emailVerified ?? profileClient?.emailVerified ?? user?.emailVerified,
      };
    }
    if (profileClient) {
      return {
        ...profileClient,
        email: profileClient.email ?? user?.email,
        emailVerified: profileClient.emailVerified ?? user?.emailVerified,
      };
    }
    return user;
  }, [profileInformation, personalInformation, user]);

  useEffect(() => {
    setProfileData(userToProfileForm(client));
  }, [client]);

  useEffect(() => {
    fetchPersonalInformation().catch(() => {});
  }, [fetchPersonalInformation]);

  useEffect(() => {
    fetchAddresses({ force: true }).catch(() => {});
  }, [fetchAddresses]);

  const handleChangePassword = () => {
    showToast('Función próximamente disponible', 'info');
  };

  const closeAddressModal = () => {
    setIsAddAddressModalOpen(false);
    setEditingAddress(null);
  };

  const openAddAddressModal = () => {
    setEditingAddress(null);
    setIsAddAddressModalOpen(true);
  };

  const handleAddressSuccess = async () => {
    invalidateAddresses();
    await fetchAddresses({ force: true });
  };

  const fullName = [client?.name, client?.paternalLastName, client?.maternalLastName]
    .filter(Boolean)
    .join(' ') || 'Usuario';

  const initials = [client?.name?.[0], client?.paternalLastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase() || 'U';

  if (!user && !client) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const inputClass = 'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-default transition-colors';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
        <button
          onClick={() => navigate(ROUTES.MY_ACCOUNT)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition-colors text-sm"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          Volver a Mi Cuenta
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 truncate">{fullName}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                {client?.phone && (
                  <span className="text-sm text-gray-500 flex items-center gap-1.5">
                    <HiOutlinePhone className="w-3.5 h-3.5" />
                    {client.phone}
                  </span>
                )}
                {client?.email && (
                  <span className="text-sm text-gray-500 flex items-center gap-1.5">
                    <HiOutlineEnvelope className="w-3.5 h-3.5" />
                    {client.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <HiOutlineUser className="w-5 h-5 text-primary-600" />
                <h2 className="text-base font-semibold text-gray-900">Información Personal</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    disabled
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Apellido Paterno</label>
                  <input
                    type="text"
                    name="paternalLastName"
                    value={profileData.paternalLastName}
                    disabled
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Apellido Materno</label>
                  <input
                    type="text"
                    name="maternalLastName"
                    value={profileData.maternalLastName}
                    disabled
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Correo Electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    disabled
                    placeholder="No registrado"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    disabled
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    disabled
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">CURP</label>
                  <input
                    type="text"
                    name="curp"
                    value={profileData.curp}
                    disabled
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {(profileData.address?.street ||
              profileData.address?.city ||
              profileData.address?.neighborhood) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <HiOutlineMapPin className="w-5 h-5 text-primary-600" />
                  <h2 className="text-base font-semibold text-gray-900">Dirección principal</h2>
                </div>
                <p className="text-xs text-gray-500 mb-5">
                  Corresponde a tu domicilio registrado. Solo lectura; no se edita aquí (usa la
                  dirección principal de tu cuenta).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Calle</label>
                    <input
                      type="text"
                      value={profileData.address.street}
                      disabled
                      readOnly
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Número exterior
                    </label>
                    <input
                      type="text"
                      value={profileData.address.number}
                      disabled
                      readOnly
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Número interior
                    </label>
                    <input
                      type="text"
                      value={profileData.address.interior}
                      disabled
                      readOnly
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Colonia</label>
                    <input
                      type="text"
                      value={profileData.address.neighborhood}
                      disabled
                      readOnly
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Ciudad</label>
                    <input
                      type="text"
                      value={profileData.address.city}
                      disabled
                      readOnly
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Estado</label>
                    <input
                      type="text"
                      value={profileData.address.state}
                      disabled
                      readOnly
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Código postal
                    </label>
                    <input
                      type="text"
                      value={profileData.address.zipCode}
                      disabled
                      readOnly
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Referencias
                    </label>
                    <textarea
                      value={profileData.address.references}
                      disabled
                      readOnly
                      rows={2}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Addresses */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <HiOutlineMapPin className="w-5 h-5 text-primary-600" />
                  <h2 className="text-base font-semibold text-gray-900">Direcciones de Envío</h2>
                  {addresses.length > 0 && (
                    <span className="text-xs text-gray-400 font-normal">({addresses.length})</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={openAddAddressModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <HiOutlinePlus className="w-3.5 h-3.5" />
                  Agregar
                </button>
              </div>

              {addressesLoading && addresses.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8">
                  <HiOutlineMapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 mb-1">No tienes direcciones de envío</p>
                  <p className="text-xs text-gray-400">Agrega una para agilizar tus compras</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.client_address_id}
                      className={`relative p-4 rounded-xl border transition-colors ${
                        addr.is_principal === 1
                          ? 'border-primary-200 bg-primary-50/50'
                          : 'border-gray-200 bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          addr.is_principal === 1
                            ? 'bg-primary-100 text-primary-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {addr.alias?.toLowerCase().includes('oficina')
                            ? <HiOutlineBuildingOffice className="w-4 h-4" />
                            : <HiOutlineHome className="w-4 h-4" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-semibold text-gray-900">{addr.alias || 'Dirección'}</span>
                            {addr.is_principal === 1 && (
                              <span className="text-[10px] font-medium text-primary-600 bg-primary-100 px-1.5 py-0.5 rounded">
                                Principal
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            {addr.name_received}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {addr.street} {addr.external_number}
                            {addr.internal_number ? ` Int. ${addr.internal_number}` : ''}
                          </p>
                          <p className="text-xs text-gray-400">
                            {addr.neighborhood}, {addr.city}, {addr.state} CP {addr.zip_code}
                          </p>
                          {addr.phone_received && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              Tel: {addr.phone_received}
                            </p>
                          )}
                        </div>
                        </div>
                        {!isPrincipalAddress(addr) && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAddress(addr);
                              setIsAddAddressModalOpen(true);
                            }}
                            className="shrink-0 text-xs font-medium text-primary-600 hover:text-primary-700 px-2 py-1 rounded-lg hover:bg-primary-50 transition-colors"
                          >
                            Editar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DangerZoneAccountSection />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <HiOutlineCreditCard className="w-5 h-5 text-primary-600" />
                <h2 className="text-base font-semibold text-gray-900">Crédito</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Límite de crédito</p>
                  <p className="text-lg font-bold text-gray-900">
                    ${(user?.limitCreditAmount ?? 0).toLocaleString('es-MX')}
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-400 mb-1">Estado</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-green-600">Cuenta activa</span>
                  </div>
                </div>
                {user?.creditStatus && (
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-400 mb-1">Estatus de crédito</p>
                    <span className="text-sm font-medium text-gray-700 capitalize">{user.creditStatus}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <HiOutlineShieldCheck className="w-5 h-5 text-primary-600" />
                <h2 className="text-base font-semibold text-gray-900">Seguridad</h2>
              </div>

              <button
                onClick={handleChangePassword}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <HiOutlineLockClosed className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  <span className="text-sm font-medium text-gray-700">Cambiar contraseña</span>
                </div>
                <HiOutlineArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
              </button>

              {user?.emailVerified != null && (
                <div className="mt-3 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                  <HiOutlineEnvelope className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">Correo verificado</span>
                  <span className="ml-auto">
                    {user.emailVerified ? (
                      <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <HiOutlineXMark className="w-5 h-5 text-red-400" />
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <HiOutlineIdentification className="w-5 h-5 text-primary-600" />
                <h2 className="text-base font-semibold text-gray-900">Datos de cuenta</h2>
              </div>

              <div className="space-y-3">
                {client?.phone && (
                  <div className="flex items-center gap-3">
                    <HiOutlinePhone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Teléfono</p>
                      <p className="text-sm text-gray-700">{client.phone}</p>
                    </div>
                  </div>
                )}
                {client?.email && (
                  <div className="flex items-center gap-3">
                    <HiOutlineEnvelope className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Correo</p>
                      <p className="text-sm text-gray-700 break-all">{client.email}</p>
                    </div>
                  </div>
                )}
                {client?.birthdate && (
                  <div className="flex items-center gap-3">
                    <HiOutlineCalendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Fecha de nacimiento</p>
                      <p className="text-sm text-gray-700">{client.birthdate}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <AddAddressModal
        isOpen={isAddAddressModalOpen}
        editAddress={editingAddress}
        onClose={closeAddressModal}
        onSuccess={handleAddressSuccess}
      />

      <Footer />
    </div>
  );
};

export default MyProfile;
