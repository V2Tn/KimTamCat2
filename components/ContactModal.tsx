
import React, { useState } from 'react';
import { saveToGoogleSheet } from '../services/sheetService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isSending, setIsSending] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    note: ''
  });

  if (!isOpen) return null;

  const cleanPhone = formData.phone.replace(/\D/g, '');
  const isPhoneValid = cleanPhone.length >= 10 && cleanPhone.length <= 12;
  const isNameValid = formData.name.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isNoteValid = formData.note.trim().length > 0;

  const isFormValid = isNameValid && isPhoneValid && isEmailValid && isNoteValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setShowErrors(true);
      return;
    }
    setIsSending(true);

    // Đẩy dữ liệu qua Make.com / Google Sheets
    const success = await saveToGoogleSheet({
      fullName: formData.name,
      phone: cleanPhone,
      email: formData.email,
      note: formData.note,
      source: 'Tư Vấn'
    });

    setIsSending(false);
    if (success) {
      alert("Cảm ơn quý khách! Học Viện Minh Triết Phương Đông đã tiếp nhận thông tin và sẽ liên hệ lại sớm nhất.");
      setFormData({ name: '', phone: '', email: '', note: '' });
      setShowErrors(false);
      onClose();
    } else {
      alert("Có lỗi xảy ra khi gửi thông tin. Quý khách vui lòng thử lại hoặc liên hệ hotline.");
    }
  };

  const inputClass = (isValid: boolean) => `w-full py-3 border-b focus:border-[#b07d35] outline-none transition-all placeholder:text-gray-400 text-sm font-light bg-transparent disabled:opacity-50 ${
    showErrors && !isValid ? 'border-red-500 bg-red-50/10 animate-shake-error' : 'border-gray-300'
  }`;

  const errorMsgClass = "text-[10px] text-red-500 mt-1 italic font-medium absolute -bottom-5 left-0 animate-fadeIn";

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div 
        className="bg-white w-full max-w-2xl rounded-sm shadow-2xl relative overflow-hidden modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-400 hover:text-[#b07d35] text-3xl transition-colors"
          aria-label="Đóng"
        >
          &times;
        </button>

        <div className="p-8 md:p-14">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a1a1a] uppercase tracking-wider mb-4">
              Thông Tin Liên Hệ
            </h2>
            <div className="w-20 h-1 bg-[#b07d35] mb-6 mx-auto md:mx-0"></div>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              Quý khách vui lòng để lại thông tin, đội ngũ chuyên gia của Học Viện Minh Triết Phương Đông sẽ liên hệ tư vấn trong thời gian sớm nhất!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
              <div className="relative group">
                <input 
                  required
                  disabled={isSending}
                  type="text" 
                  placeholder="Tên của bạn *" 
                  className={inputClass(isNameValid)}
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
                {showErrors && !isNameValid && <span className={errorMsgClass}>Vui lòng nhập họ tên</span>}
              </div>
              <div className="relative group">
                <input 
                  required
                  disabled={isSending}
                  type="tel" 
                  placeholder="Số điện thoại (10-12 số) *" 
                  className={inputClass(isPhoneValid)}
                  value={formData.phone}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                    setFormData({...formData, phone: val});
                  }}
                />
                {/* Hiển thị lỗi ngay lập tức */}
                {(formData.phone.length > 0 && !isPhoneValid) && (
                  <span className={errorMsgClass}>Phải đủ 10 đến 12 chữ số</span>
                )}
                {showErrors && formData.phone === '' && (
                  <span className={errorMsgClass}>Vui lòng nhập số điện thoại</span>
                )}
              </div>
            </div>

            <div className="relative group">
              <input 
                required
                disabled={isSending}
                type="email" 
                placeholder="Địa chỉ email *" 
                className={inputClass(isEmailValid)}
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              {showErrors && !isEmailValid && <span className={errorMsgClass}>Email không đúng định dạng</span>}
            </div>

            <div className="relative group">
              <textarea 
                required
                disabled={isSending}
                placeholder="Nhập câu hỏi của bạn ở đây *" 
                rows={1}
                className={`${inputClass(isNoteValid)} resize-none min-h-[46px]`}
                value={formData.note}
                onChange={e => setFormData({...formData, note: e.target.value})}
              ></textarea>
              {showErrors && !isNoteValid && <span className={errorMsgClass}>Vui lòng nhập nội dung</span>}
            </div>

            <div className="pt-8 flex justify-center">
              <button 
                type="submit"
                disabled={isSending}
                className={`w-full md:w-full bg-[#002b33] text-white py-5 px-8 font-bold uppercase tracking-[0.3em] text-[12px] shadow-lg hover:bg-[#b07d35] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 ${isSending ? 'opacity-70 cursor-not-allowed' : ''} ${!isFormValid && showErrors ? 'bg-red-900 animate-shake-error' : ''}`}
              >
                {isSending ? (
                  <>
                    <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>
                    Đang Gửi...
                  </>
                ) : "Gửi Thông Tin Đăng Ký"}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Background click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};
