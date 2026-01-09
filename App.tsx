
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { InputForm } from './components/InputForm';
import { AnalysisView } from './components/AnalysisView';
import { analyzeFengShui } from './services/geminiService';
import { saveToGoogleSheet } from './services/sheetService';
import { UserInfo } from './types';
import { ScrollReveal } from './components/ScrollReveal';

const CarIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M2 13C2 11.5 3 10.5 4.5 10.5H5.5L7.5 5.5C8 4.5 9 4 10 4H14C15 4 16 4.5 16.5 5.5L18.5 10.5H19.5C21 10.5 22 11.5 22 13V15C22 16.5 21 17.5 19.5 17.5H4.5C3 17.5 2 16.5 2 15V13Z" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinejoin="round"
    />
    <circle cx="7" cy="17.5" r="3" fill="white" stroke="currentColor" strokeWidth="2.2"/>
    <circle cx="17" cy="17.5" r="3" fill="white" stroke="currentColor" strokeWidth="2.2"/>
  </svg>
);

const BabyIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="7.5" r="4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <path 
      d="M12 12C8 12 5.5 14 5.5 18C5.5 20.2 7.3 22 9.5 22H14.5C16.7 22 18.5 20.2 18.5 18C18.5 14 16 12 12 12Z" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12 3C12 3 12.5 2 13.5 2" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round"
    />
    <path d="M10 7.5H10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M13.5 7.5H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const LoadingOverlay: React.FC = () => (
  <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#fdf6e9]/98 backdrop-blur-2xl animate-fadeIn">
    <div className="relative mb-8">
      <div className="absolute -inset-12 bg-[#b07d35]/15 rounded-full blur-[60px] animate-pulse"></div>
      <div className="w-32 h-32 md:w-44 md:h-44 relative flex items-center justify-center">
        <img 
          src="https://phongthuykimtamcat.com/uploads/source//logo/logo-ktc.png" 
          alt="Loading..." 
          className="w-full h-full object-contain animate-slow-spin drop-shadow-2xl"
        />
      </div>
    </div>
    <div className="text-center space-y-4 px-6 max-w-md">
      <h3 className="text-[#002b33] font-sans font-bold text-lg md:text-xl uppercase tracking-[0.3em] animate-pulse">
        Đang Luận Giải...
      </h3>
      <p className="text-gray-500 font-script text-2xl md:text-3xl leading-relaxed">
        "Trí tuệ đang khai mở, vận mệnh đang dần hiển lộ..."
      </p>
      <div className="flex justify-center gap-2 pt-6">
        <div className="w-2.5 h-2.5 bg-[#b07d35] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2.5 h-2.5 bg-[#b07d35] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2.5 h-2.5 bg-[#b07d35] rounded-full animate-bounce"></div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(!!process.env.API_KEY);
  const [activeService, setActiveService] = useState<'car' | 'baby' | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected || !!process.env.API_KEY);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setHasKey(true);
      setError(null);
    }
  };

  const handleAnalyze = async (data: UserInfo) => {
    setIsLoading(true);
    setError(null);
    
    // Đẩy dữ liệu qua Make.com / Google Sheets
    saveToGoogleSheet({
      fullName: data.fullName,
      phone: data.phone,
      dob: `${data.dob} (${data.dobType === 'solar' ? 'Dương' : 'Âm'})`,
      gender: data.gender,
      source: 'Luận Giải',
      note: `Dịch vụ: ${data.serviceType === 'car' ? 'Mua xe' : 'Sinh mổ'} | Dự kiến: ${data.targetDate} (${data.targetDateType === 'solar' ? 'Dương' : 'Âm'})${data.parentDob ? ` | Phối ngẫu: ${data.parentDob}` : ''}`
    });

    try {
      const response = await analyzeFengShui(data);
      setResult(response);
      const container = document.getElementById('analysis-stage');
      if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err: any) {
      const errMsg = err.message || "";
      if (errMsg.includes("Requested entity was not found") || errMsg.includes("API Key")) {
        setHasKey(false);
        setError("Vui lòng cấu hình Khóa API để tiếp tục luận giải.");
      } else {
        setError(errMsg || "Đã xảy ra lỗi không xác định.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleService = (service: 'car' | 'baby') => {
    setResult(null);
    setActiveService(service);
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setActiveService(null);
  };

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <Layout showBanner={!result}>
        <div className="transition-all duration-500 w-full">
          {!hasKey && (
            <div className="w-full bg-[#fdf6e9] py-12">
              <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white/80 border-2 border-[#b07d35] p-10 rounded-sm shadow-2xl text-center animate-fadeIn glass-panel">
                  <h3 className="text-[#002b33] font-serif text-2xl uppercase tracking-widest mb-4">Cấu Hình Hệ Thống</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                    Để sử dụng trí tuệ nhân tạo tư vấn phong thủy, quý vị cần xác thực quyền truy cập hệ thống.
                  </p>
                  <button 
                    onClick={handleSelectKey}
                    className="bg-[#002b33] text-white px-10 py-4 rounded-sm text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#b07d35] transition-all shadow-lg"
                  >
                    Chọn Khóa API Hệ Thống
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && hasKey && (
            <div className="w-full bg-red-50/30 py-6">
              <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-red-50 border-l-8 border-[#b07d35] text-[#b07d35] p-6 rounded-lg shadow-xl animate-bounce flex items-center gap-4">
                  <span className="text-3xl">⚠️</span>
                  <div>
                    <p className="font-bold uppercase tracking-tight">Hệ thống ghi nhận sự cố:</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={`w-full flex flex-col ${!hasKey ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
            
            <div className="w-full pt-12 pb-20 lg:pt-20 lg:pb-28 relative overflow-hidden perspective-2000">
              <ScrollReveal animation="slide-up">
                <div className="max-w-[1300px] mx-auto px-6 md:px-12 lg:px-16 preserve-3d">
                  <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-0 preserve-3d">
                    
                    <div className="w-full lg:w-[60%] z-30 translate-z-100 transition-transform duration-1000 hover:translate-z-[120px] pointer-events-none text-center lg:text-left">
                      <div className="space-y-1 mb-2">
                      <h1 className="text-[#b07d35] font-sans text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold uppercase leading-tight tracking-[0.05em] drop-shadow-2xl">
                        Học Viện Phong Thủy
                      </h1>
                      <h1 className="text-[#002b33] font-sans text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold uppercase leading-tight tracking-[0.05em] drop-shadow-2xl">
                        Minh Triết Phương Đông
                      </h1>
                    </div>
                      <div className="translate-z-50 pl-1.5">
                        <p className="text-[#b07d35] font-script text-3xl md:text-5xl lg:text-6xl leading-none opacity-95">
                          Tinh hoa hội tụ — Vận mệnh hanh thông
                        </p>
                      </div>
                    </div>

                    <div className="w-full lg:w-[55%] lg:-ml-[12%] lg:mt-10 z-10 translate-z-20 preserve-3d">
                      <div className="relative p-8 md:p-12 bg-white/90 backdrop-blur-2xl rounded-[40px] border border-white/60 shadow-[0_50px_100px_-20px_rgba(176,125,53,0.15)] group transition-all duration-700 hover:shadow-[0_70px_120px_-20px_rgba(176,125,53,0.25)]">
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[40px] pointer-events-none">
                          <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-br from-white/20 via-transparent to-transparent rotate-45 transition-transform duration-[1200ms] group-hover:translate-x-[40%] group-hover:translate-y-[40%]"></div>
                        </div>
                        
                        <div className="relative z-10 space-y-5">
                          <div className="w-12 h-1 bg-[#b07d35]/40"></div>
                          <p className="text-[#1a1a1a] text-base md:text-lg lg:text-[19px] text-justify font-sans font-normal leading-relaxed opacity-95 tracking-wide">
                            Học viện Phong Thủy Minh Triết Phương Đông trực thuộc <span className="italic font-bold text-[#b07d35]">Viện Nghiên cứu Những Bí Ẩn của Vũ Trụ và Văn Hóa Phương Đông</span>, 
                            chuyên nghiên cứu, giảng dạy và ứng dụng phong thủy, huyền học, triết lý Á Đông, giúp quý thân chủ thấu hiểu quy luật vũ trụ, cân bằng năng lượng, kiến tạo cuộc sống hài hòa, thịnh vượng.
                          </p>
                          <div className="pt-2 flex justify-end items-end">
                            <div className="w-14 h-14 border border-[#b07d35]/20 rounded-full flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-700 overflow-hidden p-2.5 bg-white shadow-inner shrink-0">
                              <img src="https://phongthuykimtamcat.com/uploads/source//logo/logo-ktc.png" alt="Logo KTC" className="w-full h-full object-contain" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-8 bg-[#b07d35]/5 blur-[35px] rounded-full"></div>
                    </div>

                  </div>
                </div>
              </ScrollReveal>
              <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[#b07d35]/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
              <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#002b33]/5 rounded-full blur-[100px] pointer-events-none"></div>
            </div>

            <div className="w-full py-12 lg:py-20 bg-gradient-to-b from-transparent to-[#fcf8ef]/50" id="analysis-stage">
              <ScrollReveal animation="slide-up" delay={100}>
                <div className="max-w-[1300px] mx-auto px-6 md:px-12">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                    
                    <div className="lg:col-span-4 space-y-4 sticky top-24">
                      <div className="mb-8 pl-2 space-y-3">
                        <h3 className="text-[#002b33] font-sans font-bold text-lg md:text-xl uppercase tracking-[0.1em] leading-none">
                          Hạng mục <span className="text-[#b07d35]">Xem Tuổi</span>
                        </h3>
                        <div className="w-12 h-1.5 bg-[#b07d35]"></div>
                      </div>
                      
                      <button 
                        onClick={() => toggleService('car')}
                        className={`
                          w-full flex items-center gap-5 px-8 py-6 text-left
                          transition-all duration-500 ease-out border-2
                          group relative overflow-hidden
                          ${activeService === 'car' 
                            ? 'rounded-2xl bg-[#002b33] text-white border-[#002b33] shadow-xl' 
                            : 'rounded-xl bg-white text-[#b07d35] border-[#b07d35]/10 hover:border-[#b07d35] hover:bg-white/50'
                          }
                        `}
                      >
                        <div className={`w-16 h-16 flex items-center justify-center rounded-full border transition-all ${activeService === 'car' ? 'bg-[#b07d35] border-white/20' : 'bg-[#fdf6e9] border-[#b07d35]/20 text-[#b07d35]'}`}>
                          <CarIcon />
                        </div>
                        <div>
                          <span className={`block font-sans text-[11px] font-bold uppercase tracking-[0.3em] ${activeService === 'car' ? 'text-white' : 'text-[#002b33]'}`}>Xem Ngày Mua Xe</span>
                          <span className={`text-[10px] opacity-60 uppercase tracking-tighter ${activeService === 'car' ? 'text-white/70' : 'text-[#b07d35]/80'}`}>Tài lộc hanh thông</span>
                        </div>
                      </button>

                      <button 
                        onClick={() => toggleService('baby')}
                        className={`
                          w-full flex items-center gap-5 px-8 py-6 text-left
                          transition-all duration-500 ease-out border-2
                          group relative overflow-hidden
                          ${activeService === 'baby' 
                            ? 'rounded-2xl bg-[#002b33] text-white border-[#002b33] shadow-xl' 
                            : 'rounded-xl bg-white text-[#b07d35] border-[#b07d35]/10 hover:border-[#b07d35] hover:bg-white/50'
                          }
                        `}
                      >
                        <div className={`w-16 h-16 flex items-center justify-center rounded-full border transition-all ${activeService === 'baby' ? 'bg-[#b07d35] border-white/20' : 'bg-[#fdf6e9] border-[#b07d35]/20 text-[#b07d35]'}`}>
                          <BabyIcon />
                        </div>
                        <div>
                          <span className={`block font-sans text-[11px] font-bold uppercase tracking-[0.3em] ${activeService === 'baby' ? 'text-white' : 'text-[#002b33]'}`}>Xem Ngày Sinh Mổ</span>
                          <span className={`text-[10px] opacity-60 uppercase tracking-tighter ${activeService === 'baby' ? 'text-white/70' : 'text-[#b07d35]/80'}`}>Khai mở phúc lộc</span>
                        </div>
                      </button>
                    </div>

                    <div className="lg:col-span-8">
                      {result ? (
                        <div className="animate-fadeIn">
                          <AnalysisView content={result} onReset={reset} />
                        </div>
                      ) : activeService ? (
                        <div className="relative group animate-fadeIn">
                          <div className="absolute -inset-4 bg-gradient-to-br from-[#b07d35]/10 to-transparent rounded-[3rem] blur-3xl opacity-40"></div>
                          <div className="relative bg-white p-8 md:p-14 rounded-[2.5rem] border border-[#b07d35]/20 shadow-xl overflow-hidden">
                            <div className="flex flex-col items-center text-center mb-12 space-y-8 relative z-10">
                              {activeService === 'car' ? (
                                <>
                                  <div className="inline-block px-10 py-3 rounded-full border border-[#b07d35]/30 bg-[#fdf6e9]/50 shadow-sm">
                                    <span className="text-[#b07d35] font-serif font-bold text-sm md:text-base uppercase tracking-[0.4em]">
                                      VẠN DẶM BÌNH AN
                                    </span>
                                  </div>
                                  <div className="space-y-4 max-w-2xl">
                                    <p className="text-[#4a4a4a] text-xl md:text-2xl font-medium leading-relaxed font-script italic">
                                      "Xế sang hợp mệnh, tài lộc hanh thông".
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="inline-block px-10 py-3 rounded-full border border-[#b07d35]/30 bg-[#fdf6e9]/50 shadow-sm">
                                    <span className="text-[#b07d35] font-serif font-bold text-sm md:text-base uppercase tracking-[0.4em]">
                                      PHÚC LỘC SINH THÀNH
                                    </span>
                                  </div>
                                  <div className="space-y-4 max-w-2xl">
                                    <p className="text-[#4a4a4a] text-xl md:text-2xl font-medium leading-relaxed font-script italic">
                                      "Khai mở phúc lộc, đón thiên sứ chào đời".
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="relative z-10">
                              <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} serviceType={activeService} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white/40 rounded-[2.5rem] border-2 border-dashed border-[#b07d35]/20">
                           <h3 className="text-[#002b33] font-serif text-xl uppercase tracking-widest mb-3 opacity-60">Sẵn sàng luận giải</h3>
                           <p className="text-gray-500 text-sm max-w-sm italic">Quý vị vui lòng chọn một hạng mục xem tuổi ở menu bên trái để bắt đầu quá trình phân tích phong thủy chuyên sâu.</p>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Phần Bổ Sung: Bộ sách Bát Cực Linh Số Bảo Điển */}
            <div className="w-full py-24 border-t border-gray-100 bg-gradient-to-b from-transparent to-[#fcf8ef]/50 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#b07d35]/5 rounded-full blur-[120px] pointer-events-none"></div>
              <ScrollReveal animation="slide-up" delay={200}>
                <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                  <div className="text-center space-y-4 mb-20">
                     <h3 className="text-2xl md:text-4xl font-sans font-bold text-[#002b33] uppercase tracking-[0.1em] leading-tight">
                       BỘ SÁCH “Bát Cực Linh Số Bảo Điển”
                     </h3>
                     <p className="text-[#b07d35] font-script text-3xl opacity-90 mt-2">Bát cực linh số bảo điển - Thiên mệnh giàu sang</p>
                  </div>
                  
                  {/* Image Group Section */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-20">
                    <div className="md:col-span-7 relative group">
                      <div className="absolute -inset-4 bg-[#b07d35]/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="relative overflow-hidden rounded-[2rem] shadow-2xl border-[12px] border-white aspect-[4/3]">
                        <div className="absolute top-4 left-4 z-20">
                          <span className="bg-[#002b33]/80 backdrop-blur-md text-[#b07d35] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#b07d35]/30">Thiên mệnh giàu sang</span>
                        </div>
                        <img src="https://kimtamcat.com.vn/wp-content/uploads/2025/05/HKT_0039-800x533.jpg" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" alt="Thiên Mệnh Giàu Sang 1" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#002b33]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      </div>
                    </div>
                    <div className="md:col-span-5 md:-ml-20 mt-8 md:mt-0 relative group">
                      <div className="absolute -inset-4 bg-[#b07d35]/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="relative overflow-hidden rounded-[1.5rem] shadow-2xl border-[8px] border-white aspect-square md:translate-y-12">
                         <div className="absolute bottom-4 right-4 z-20">
                          <span className="bg-white/90 backdrop-blur-md text-[#002b33] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-gray-100">Tiên thiên khái niệm</span>
                        </div>
                        <img src="https://kimtamcat.com.vn/wp-content/uploads/2025/05/HTQT-55768-800x534.jpg" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" alt="Thiên Mệnh Giàu Sang 2" />
                         <div className="absolute inset-0 bg-gradient-to-br from-[#b07d35]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      </div>
                    </div>
                  </div>

                  {/* Book Description Text Section - Linked to Images */}
                  <div className="flex flex-col items-center">
                    <div className="max-w-4xl bg-white/50 backdrop-blur-xl p-8 md:p-16 rounded-[2.5rem] border border-[#b07d35]/20 shadow-2xl relative">
                      {/* Decorative elements to link with images */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#b07d35] text-white px-8 py-2.5 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] shadow-xl z-20">
                        Giá Trị Tác Phẩm
                      </div>
                      
                      <div className="space-y-8">
                        <div className="border-b border-[#b07d35]/10 pb-8 space-y-4">
                          <p className="text-[#002b33] font-sans font-bold text-lg md:text-2xl leading-relaxed text-center md:text-justify">
                            “Bát Cực Linh Số Bảo Điển” là bộ sách chuyên sâu do bà <span className="text-[#b07d35]">Nguyễn Thu Nga</span> – Tổng Giám đốc Kim Tâm Cát – biên soạn, nhằm giúp độc giả khám phá và khai mở thiên mệnh cá nhân trong thời đại số.
                          </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-10 md:gap-14 text-gray-700 leading-relaxed font-sans font-light text-sm md:text-[17px] text-justify">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="w-2 h-2 bg-[#b07d35] rounded-full"></span>
                              <span className="text-[11px] font-bold uppercase tracking-widest text-[#002b33]">Phương pháp lý luận</span>
                            </div>
                            <p>
                              Dựa trên nền tảng lý thuyết Bát Cực Linh Số, bộ sách cung cấp những công cụ và phương pháp giúp người đọc nhận diện và phát huy giá trị riêng biệt thông qua các chỉ số năng lượng số. 
                            </p>
                            <p>
                              Sách được chia thành hai phiên bản: <span className="font-bold text-[#b07d35]">sơ cấp</span> và <span className="font-bold text-[#b07d35]">nâng cao</span>, phù hợp với cả người mới bắt đầu và những ai đã có kiến thức nền tảng về phong thủy và huyền học.
                            </p>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="w-2 h-2 bg-[#b07d35] rounded-full"></span>
                              <span className="text-[11px] font-bold uppercase tracking-widest text-[#002b33]">Ứng dụng thực tiễn</span>
                            </div>
                            <p>
                              Đây không chỉ là tài liệu học thuật mà còn là cẩm nang ứng dụng thực tiễn, giúp mỗi cá nhân định hướng và phát triển bản thân một cách toàn diện trong bối cảnh hiện đại. 
                            </p>
                            <p className="italic text-[#002b33]/60">
                              Bộ sách là tâm huyết kết tinh từ nhiều năm nghiên cứu, giúp chuyển hóa những bí ẩn của vũ trụ thành các quy luật gần gũi và ứng dụng được ngay vào cuộc sống hàng ngày.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default App;
