import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiOutlineEnvelope, HiOutlineIdentification } from 'react-icons/hi2';
import { useCreditForm } from '../../../stores/creditFormStore';
import { emailCurpSchema } from '../../../schemas/credit';

const EmailCurpStep = ({ setCustomNextHandler }) => {
  const { formData, updateFormData, goToNextStep, setIsCurrentStepValid } = useCreditForm();
  const emailCurpData = formData.emailCurp || {};

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm({
    resolver: zodResolver(emailCurpSchema),
    mode: 'onChange',
    defaultValues: {
      email: emailCurpData.email || '',
      curp: emailCurpData.curp || '',
    },
  });

  useEffect(() => {
    setIsCurrentStepValid(isValid);
  }, [isValid, setIsCurrentStepValid]);

  useEffect(() => {
    const hasPersistedData = emailCurpData.email || emailCurpData.curp;
    if (hasPersistedData) {
      trigger().then((result) => {
        setIsCurrentStepValid(result);
      });
    }
  }, []);

  useEffect(() => {
    if (setCustomNextHandler) {
      setCustomNextHandler(() => {
        handleSubmit(
          (data) => {
            updateFormData({
              emailCurp: {
                email: data.email.trim(),
                curp: data.curp.trim().toUpperCase(),
              },
            });
            goToNextStep();
          },
          () => {
            trigger();
          }
        )();
      });
    }
  }, [isValid, handleSubmit, goToNextStep, setCustomNextHandler, trigger]);

  return (
    <form onSubmit={handleSubmit(() => {})}>
      <div className="mb-6">
        <h2 id="step-title-7" className="text-2xl font-bold text-gray-900 mb-2">
          Datos complementarios
        </h2>
        <p className="text-gray-600">
          Necesitamos tu correo electrónico y CURP para completar tu solicitud.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Correo electrónico *
          </label>
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
            Asegúrate de que este correo te pertenezca, ya que lo validaremos más adelante.
          </p>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineEnvelope className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              {...register('email')}
              placeholder="ejemplo@correo.com"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            CURP *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineIdentification className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              {...register('curp')}
              placeholder="18 caracteres"
              maxLength={18}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 uppercase ${
                errors.curp ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.curp && (
            <p className="mt-1 text-sm text-red-600">{errors.curp.message}</p>
          )}
        </div>
      </div>
    </form>
  );
};

export default EmailCurpStep;
