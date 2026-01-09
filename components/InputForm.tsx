
import React, { useState, useEffect } from 'react';
import { UserInfo } from '../types';

interface Props {
  onAnalyze: (data: UserInfo) => void;
  isLoading: boolean;
  serviceType: 'car' | 'baby';
}

export const InputForm: React.FC<Props> = ({ onAnalyze, isLoading, serviceType }) => {
  const [formData, setFormData] = useState<Omit<UserInfo, 'serviceType'>>({
    fullName: '',
    dob: '',
    dobType: 'solar',
    gender: 'Nam',
    phone: '',
    targetDate: new Date().toISOString().split('T')[0],
    targetDateType: 'solar',
    parentDob: '',
    parentDobType: 'solar'
  });

  const [showErrors, setShowErrors] = useState(false);

  const isNameValid = formData.fullName.trim().length >= 2;
  const cleanPhone = formData.phone.replace(/\D/g, '');
  const isPhoneValid = cleanPhone.length >= 10 && cleanPhone.length <= 12;
  const isDobValid = formData.dob !== '';
  const isTargetDateValid = formData.targetDate !== '';
  const isParentDobValid = serviceType === 'baby' ? (formData.parentDob !== '') : true;

  const isFormValid = isNameValid && isPhoneValid && isDobValid && isTargetDateValid && isParentDobValid;

  useEffect(() => {
    setShowErrors(false);
  }, [serviceType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setShowErrors(true);
      return;
    }
    onAnalyze({ ...formData, phone: cleanPhone, serviceType });
  };

  const getInputClass = (isValid: boolean) => {
    return `w-full px-5 py-4 bg-gray-50/80 border rounded-xl focus:ring-4 focus:ring-[#b07d35]/5 focus:border-[#b07d35] outline-none transition-all placeholder:text-gray-400 text-gray-800 text-sm ${
      showErrors && !isValid 
        ? 'border-red-400 bg-red-50/30 animate-shake-error shadow-inner' 
        : 'border-gray-200'
    }`;
  };

  const labelClass = "block text-[#1a1a1a] font-bold text-[11px] uppercase tracking-[0.15em] mb-3 opacity-60 ml-1";
  const groupClass = "relative space-y-1";
  const errorTextClass = "text-red-500 text-[10px] mt-1 italic font-medium ml-1 animate-fadeIn";

  const nameLabel = serviceType === 'car' ? 'Họ và tên' : 'HỌ VÀ TÊN';
  const phoneLabel = serviceType === 'car' ? 'Số điện thoại liên hệ' : 'SỐ ĐIỆN THOẠI LIÊN HỆ';
  const dobLabel = serviceType === 'car' ? 'ngày sinh' : `Ngày sinh ${formData.gender === 'Nam' ? 'Cha' : 'Mẹ'}`;
  const targetDateLabel = serviceType === 'car' ? 'Ngày dự định mua xe' : 'Ngày dự định sinh mổ';
  const genderLabel = serviceType === 'car' ? 'Giới tính' : 'BẠN LÀ AI?';
  const parentDobLabel = formData.gender === 'Nam' ? 'Ngày sinh của Mẹ bé' : 'Ngày sinh của Cha bé';

  const CalendarSelect = ({ value, onChange }: { value: string, onChange: (val: 'solar' | 'lunar') => void }) => (
    <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value as any)}
        className="bg-white border border-gray-200 rounded-lg py-1 px-2 text-[10px] font-bold text-[#b07d35] outline-none focus:border-[#b07d35] shadow-sm cursor-pointer"
      >
        <option value="solar">DƯƠNG LỊCH</option>
        <option value="lunar">ÂM LỊCH</option>
      </select>
    </div>
  );

  return (
    <div className="bg-transparent">
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {/* Row 1: Name & Phone */}
          <div className={groupClass}>
            <label className={labelClass}>{nameLabel}</label>
            <input
              type="text"
              className={getInputClass(isNameValid)}
              placeholder="Nhập đầy đủ họ và tên"
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            />
            {showErrors && !isNameValid && <p className={errorTextClass}>* Vui lòng nhập họ và tên</p>}
          </div>

          <div className={groupClass}>
            <label className={labelClass}>{phoneLabel}</label>
            <input
              type="tel"
              className={getInputClass(isPhoneValid)}
              placeholder="Nhập 10 - 12 số"
              value={formData.phone}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                setFormData({ ...formData, phone: val });
              }}
            />
            {/* Hiển thị lỗi ngay lập tức khi người dùng nhập */}
            {(formData.phone.length > 0 && !isPhoneValid) && (
              <p className={errorTextClass}>* Số điện thoại phải từ 10 đến 12 chữ số</p>
            )}
            {showErrors && formData.phone === '' && (
              <p className={errorTextClass}>* Vui lòng nhập số điện thoại</p>
            )}
          </div>

          {/* Row 2: Birth Dates */}
          <div className={groupClass}>
            <label className={labelClass}>{dobLabel}</label>
            <div className="relative">
              <input
                type="date"
                className={getInputClass(isDobValid)}
                value={formData.dob}
                onChange={e => setFormData({ ...formData, dob: e.target.value })}
              />
              <CalendarSelect 
                value={formData.dobType} 
                onChange={(val) => setFormData({ ...formData, dobType: val })} 
              />
            </div>
            {showErrors && !isDobValid && <p className={errorTextClass}>* Vui lòng chọn ngày sinh</p>}
          </div>

          {serviceType === 'baby' ? (
            <div className={groupClass}>
              <label className={labelClass}>{parentDobLabel}</label>
              <div className="relative">
                <input
                  type="date"
                  className={getInputClass(isParentDobValid)}
                  value={formData.parentDob}
                  onChange={e => setFormData({ ...formData, parentDob: e.target.value })}
                />
                <CalendarSelect 
                  value={formData.parentDobType || 'solar'} 
                  onChange={(val) => setFormData({ ...formData, parentDobType: val })} 
                />
              </div>
              {showErrors && !isParentDobValid && <p className={errorTextClass}>* Vui lòng chọn ngày sinh phối ngẫu</p>}
            </div>
          ) : (
            <div className={groupClass}>
              <label className={labelClass}>{targetDateLabel}</label>
              <div className="relative">
                <input
                  type="date"
                  className={getInputClass(isTargetDateValid)}
                  value={formData.targetDate}
                  onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                />
                <CalendarSelect 
                  value={formData.targetDateType} 
                  onChange={(val) => setFormData({ ...formData, targetDateType: val })} 
                />
              </div>
              {showErrors && !isTargetDateValid && <p className={errorTextClass}>* Vui lòng chọn ngày dự định mua xe</p>}
            </div>
          )}

          {/* Row 3 Special Layouts for Baby Service */}
          {serviceType === 'baby' && (
            <>
              <div className={groupClass}>
                <label className={labelClass}>{targetDateLabel}</label>
                <div className="relative">
                  <input
                    type="date"
                    className={getInputClass(isTargetDateValid)}
                    value={formData.targetDate}
                    onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                  />
                  <CalendarSelect 
                    value={formData.targetDateType} 
                    onChange={(val) => setFormData({ ...formData, targetDateType: val })} 
                  />
                </div>
                {showErrors && !isTargetDateValid && <p className={errorTextClass}>* Vui lòng chọn ngày dự định sinh mổ</p>}
              </div>
              <div className={groupClass}>
                <label className={labelClass}>{genderLabel}</label>
                <div className="flex gap-3">
                  {[
                    { label: 'Cha', value: 'Nam' },
                    { label: 'Mẹ', value: 'Nữ' }
                  ].map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g.value as any })}
                      className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border-2 ${
                        formData.gender === g.value 
                          ? 'bg-[#002b33] text-white border-[#002b33] shadow-md' 
                          : 'bg-white text-gray-400 border-gray-100 hover:border-[#b07d35]/20'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {serviceType === 'car' && (
            <div className={groupClass}>
              <label className={labelClass}>{genderLabel}</label>
              <div className="flex gap-3">
                {[
                  { label: 'Nam', value: 'Nam' },
                  { label: 'Nữ', value: 'Nữ' }
                ].map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g.value as any })}
                    className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border-2 ${
                      formData.gender === g.value 
                        ? 'bg-[#002b33] text-white border-[#002b33] shadow-md' 
                        : 'bg-white text-gray-400 border-gray-100 hover:border-[#b07d35]/20'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-10 flex flex-col items-center gap-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full max-w-md py-5 rounded-full text-[13px] font-bold uppercase tracking-[0.4em] transition-all relative overflow-hidden flex items-center justify-center gap-4 group ${
              isLoading 
                ? 'bg-[#b07d35] text-white shadow-inner cursor-wait' 
                : isFormValid 
                  ? 'bg-[#002b33] text-white hover:bg-[#b07d35] shadow-[0_20px_40px_-10px_rgba(0,43,51,0.5)] animate-pulse-glow animate-subtle-shake' 
                  : showErrors 
                    ? 'bg-red-900 text-white animate-shake-error' 
                    : 'bg-[#002b33] text-white opacity-90 hover:bg-[#003d47]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="flex items-center justify-center">
                  <img 
                    src="https://phongthuykimtamcat.com/uploads/source//logo/logo-ktc.png" 
                    className="w-8 h-8 object-contain animate-slow-spin" 
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                <span className="animate-pulse">Đang Luận Giải...</span>
              </>
            ) : (
              <>
                {(isFormValid || showErrors) && (
                  <div className="absolute left-8 flex items-center justify-center">
                    <img 
                      src="https://phongthuykimtamcat.com/uploads/source//logo/logo-ktc.png" 
                      className={`w-7 h-7 object-contain ${isFormValid ? 'animate-slow-spin' : ''} opacity-80`} 
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  </div>
                )}
                <span>Bắt Đầu Luận Giải</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
          
          <div className="h-6 text-center">
            {!isFormValid && !isLoading && (
              <p className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${showErrors ? 'text-red-600 animate-bounce' : 'text-[#b07d35] opacity-60 animate-pulse'}`}>
                {showErrors ? '⚠️ Vui lòng điền đủ 10-12 số điện thoại!' : 'Kính mời quý vị điền đủ thông tin để bắt đầu'}
              </p>
            )}
            {isFormValid && !isLoading && (
              <p className="text-[11px] text-[#2d4a3e] font-bold uppercase tracking-[0.2em] animate-fadeIn">
                ✨ Thông tin hợp lệ, mời quý vị nhấn Luận Giải
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
