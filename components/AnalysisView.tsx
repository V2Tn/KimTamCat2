
import React, { useState, useMemo } from 'react';

interface Section {
  id: string;
  title: string;
  content: string[];
}

interface Props {
  content: string;
  onReset: () => void;
}

export const AnalysisView: React.FC<Props> = ({ content, onReset }) => {
  const [openSection, setOpenSection] = useState<string | null>('1');

  const { intro, sections } = useMemo(() => {
    const lines = content.split('\n');
    const resultSections: Section[] = [];
    let introLines: string[] = [];
    let currentSection: Section | null = null;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const sectionMatch = trimmed.match(/^\[PHẦN\s*(\d+)\][:\s-]*(.*)$/i);

      if (sectionMatch) {
        if (currentSection) resultSections.push(currentSection);
        
        currentSection = {
          id: sectionMatch[1],
          title: sectionMatch[2].replace(/\*/g, '').trim(),
          content: []
        };
      } else {
        if (currentSection) {
          currentSection.content.push(trimmed);
        } else {
          introLines.push(trimmed);
        }
      }
    });

    if (currentSection) resultSections.push(currentSection);
    
    return { intro: introLines, sections: resultSections };
  }, [content]);

  const processBold = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const innerText = part.slice(2, -2);
        return <strong key={i} className="text-[#002b33] font-bold">{innerText}</strong>;
      }
      return part;
    });
  };

  const renderLines = (lines: string[]) => {
    return lines.map((line, idx) => {
      const trimmedLine = line.trim();
      const lowerLine = trimmedLine.toLowerCase();
      const isSubHeader = (lowerLine.includes('gợi ý') || lowerLine.includes('màu nên mua') || lowerLine.includes('màu nên tránh')) && 
                         (trimmedLine.startsWith('**') || trimmedLine.startsWith('- **') || trimmedLine.startsWith('◈ **'));
      
      const isListItem = !isSubHeader && (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ') || trimmedLine.startsWith('◈') || /^\d+\.\s/.test(trimmedLine));
      
      if (isSubHeader) {
        const cleanHeader = trimmedLine.replace(/^([-*◈]|\d+\.)\s/, '');
        return (
          <div key={idx} className={`mt-8 mb-4 border-b border-[#b07d35]/20 pb-2 ${idx === 0 ? 'mt-2' : ''}`}>
            <h3 className="text-[#002b33] text-[18px] font-serif font-bold tracking-wide">
              {processBold(cleanHeader)}
            </h3>
          </div>
        );
      }

      if (isListItem) {
        const listText = trimmedLine.replace(/^([-*◈]|\d+\.)\s/, '');
        return (
          <li key={idx} className="ml-2 md:ml-4 mb-4 text-gray-700 list-none relative flex items-start gap-4 font-sans">
            <span className="text-[#b07d35] mt-1.5 text-[10px] shrink-0">◈</span>
            <span className="text-[15px] md:text-[16px] leading-relaxed tracking-wide font-light">{processBold(listText)}</span>
          </li>
        );
      }

      return (
        <p key={idx} className="mb-5 leading-relaxed text-gray-700 text-[15px] md:text-[16px] font-sans font-light tracking-wide">
          {processBold(line)}
        </p>
      );
    });
  };

  return (
    <div className="space-y-10 w-full animate-fadeIn" style={{ overflowAnchor: 'none' }}>
      <div className="bg-[#002b33] py-12 px-6 shadow-xl rounded-2xl text-center relative overflow-hidden animate-fadeInBanner">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#b07d35]"></div>
        <h1 className="text-2xl md:text-3xl font-sans text-white font-bold uppercase tracking-[0.2em] leading-tight">
           Kết Quả Luận Giải
        </h1>
        <p className="text-[#b07d35] mt-2 font-script text-3xl opacity-90 italic">Khai thông trí tuệ - Chuyển hóa vận mệnh</p>
      </div>

      {intro.length > 0 && (
        <div className="bg-white/70 p-6 md:p-10 rounded-2xl border-l-8 border-[#b07d35] shadow-lg mb-8 italic text-[#002b33] text-[16px] md:text-[17px] leading-relaxed font-sans">
          {renderLines(intro)}
        </div>
      )}

      <div className="space-y-4">
        {sections.map((section) => {
          let displayTitle = section.title;
          if (section.id === '1') displayTitle = 'Bản mệnh & Định hướng';
          if (section.id === '2') displayTitle = 'Đánh giá ngày dự định';
          if (section.id === '3') displayTitle = 'Gợi ý ngày tốt & Giờ hoàng đạo';
          if (section.id === '4') displayTitle = 'Lời chúc vạn an';

          const isOpen = openSection === section.id;

          return (
            <div key={section.id} className="bg-white rounded-xl shadow-md border border-[#002b33]/5 overflow-hidden transition-all hover:shadow-lg">
              <button
                onClick={() => setOpenSection(isOpen ? null : section.id)}
                className={`w-full flex items-center justify-between p-6 transition-all duration-500 ${
                  isOpen ? 'bg-[#b07d35] text-white' : 'bg-[#002b33] text-white hover:bg-[#003d47]' 
                }`}
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-serif font-bold text-[12px] border-2 ${
                    isOpen ? 'bg-white text-[#b07d35] border-white' : 'bg-transparent text-[#b07d35] border-[#b07d35]'
                  }`}>
                    {section.id}
                  </span>
                  <h2 className="text-[13px] md:text-[15px] font-serif font-bold uppercase tracking-widest text-left">
                    {displayTitle}
                  </h2>
                </div>
                <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </button>

              <div className={`transition-all duration-700 ease-in-out overflow-hidden ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-8 md:p-12 bg-[#fffdfa]">
                  <div className="prose prose-sm md:prose-lg max-w-none">
                    {renderLines(section.content)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center">
        <button onClick={onReset} className="px-12 py-5 bg-[#002b33] text-white font-sans font-bold rounded-full transition-all hover:bg-[#b07d35] shadow-xl uppercase tracking-[0.4em] text-[10px]">
          Lập Hồ Sơ Mới
        </button>
      </div>
    </div>
  );
};
