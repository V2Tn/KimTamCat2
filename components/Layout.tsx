
import React, { useState } from 'react';
import { ContactModal } from './ContactModal';

interface LayoutProps {
  children: React.ReactNode;
  showBanner?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showBanner = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Background Lotus Watermark */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] flex items-center justify-center overflow-hidden z-0">
        <img 
          src="https://phongthuykimtamcat.com/uploads/source//logo/logo-ktc.png" 
          alt=""
          className="w-full max-w-4xl h-auto object-contain scale-125 md:scale-150 rotate-[-10deg]"
        />
      </div>

      {/* Top Header/Nav Bar */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-[#b07d35]/10">
        <div className="container mx-auto px-2 md:px-4 py-1.5 md:py-3 flex items-center justify-between gap-1 md:gap-4">
          <div className="flex items-center gap-1.5 md:gap-5 min-w-0 flex-1">
            <img 
              src="https://phongthuykimtamcat.com/uploads/source//logo/logo-ktc.png" 
              alt="Logo" 
              className="h-8 md:h-14 w-auto object-contain shrink-0"
            />
            {/* Logo Text Side - Horizontal Layout with Separator */}
            <div className="flex flex-col border-l border-[#b07d35]/40 pl-1.5 md:pl-5 py-0.5 md:py-1 min-w-0">
              <span className="text-[#002b33] font-sans font-bold text-[6px] md:text-[14px] uppercase tracking-[0.1em] md:tracking-[0.2em] leading-tight truncate">
                Học Viện
              </span>
              <span className="text-[#b07d35] font-sans font-bold text-[8.5px] md:text-[18px] uppercase tracking-tighter md:tracking-[0.05em] leading-tight break-words">
                Minh Triết Phương Đông
              </span>
            </div>
          </div>

          <div className="flex items-center shrink-0 ml-1">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#002b33] text-white px-2.5 md:px-6 py-2 md:py-2.5 text-[7px] md:text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-[#b07d35] transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              Đăng Ký <span className="hidden sm:inline">Tư Vấn</span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow relative z-10 w-full">
        {children}
      </main>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <footer className="bg-[#002b33] py-20 border-t border-[#b07d35]/20 mt-auto relative overflow-hidden z-10">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
           <img src="https://phongthuykimtamcat.com/uploads/source//logo/logo-ktc.png" className="w-96 transform translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-[#b07d35]/20 pb-16 mb-8">
            {/* Footer Logo Section */}
            <div className="flex items-center gap-5 md:gap-7 justify-center md:justify-start">
              <img 
                src="https://phongthuykimtamcat.com/uploads/source//logo/logo-ktc.png" 
                alt="Logo" 
                className="h-16 md:h-24 w-auto object-contain"
                style={{ filter: 'sepia(100%) saturate(300%) brightness(110%) hue-rotate(5deg)' }}
              />
              <div className="flex flex-col border-l-2 border-[#b07d35]/60 pl-5 md:pl-7 py-2">
                <span className="text-white/90 font-sans font-bold text-[12px] md:text-[16px] uppercase tracking-[0.25em] leading-tight mb-1.5 md:mb-2">
                  Học Viện
                </span>
                <span className="text-[#b07d35] font-sans font-bold text-[16px] md:text-[24px] uppercase tracking-[0.08em] leading-tight whitespace-nowrap">
                  Minh Triết Phương Đông
                </span>
              </div>
            </div>

            {/* Footer Contact Info Section */}
            <div className="flex flex-col space-y-8">
              <div>
                <h3 className="text-white text-3xl font-serif font-bold uppercase tracking-[0.05em] mb-4">Thông tin liên hệ</h3>
                <div className="w-24 h-1 bg-[#b07d35]"></div>
              </div>
              <ul className="space-y-6 text-white text-[15px] md:text-[16px] font-sans font-medium leading-relaxed">
                <li className="flex items-start gap-4">
                  <span className="shrink-0 mt-1">
                    <svg className="w-6 h-6 text-[#b07d35]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                  </span>
                  <span className="max-w-md">66–68 Nguyễn Thanh Sơn, Phường Thạnh Mỹ Lợi, Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="shrink-0">
                    <svg className="w-6 h-6 text-[#b07d35]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </span>
                  <span className="tracking-wide">084 5968 665</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="shrink-0">
                    <svg className="w-6 h-6 text-[#b07d35]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </span>
                  <span className="tracking-wide">kimtamcat7586@gmail.com</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="shrink-0">
                    <svg className="w-6 h-6 text-[#b07d35]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                  </span>
                  <span className="tracking-wide">www.kimtamcat.com.vn</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-[#b07d35] text-[10px] tracking-[0.4em] uppercase opacity-60">
            <p>© {new Date().getFullYear()} HỌC VIỆN MINH TRIẾT PHƯƠNG ĐÔNG. MỌI QUYỀN ĐƯỢC BẢO LƯU.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
