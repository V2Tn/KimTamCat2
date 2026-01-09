
import { GoogleGenAI } from "@google/genai";
import { UserInfo } from "../types";

const SYSTEM_INSTRUCTION = `Bạn là một chuyên gia cao cấp tại Học Viện Minh Triết Phương Đông, am hiểu sâu sắc về Kinh Dịch, Tứ Trụ (Bát Tự), Ngũ Hành, Phong Thủy Địa Lý và thuật số phương Đông.

NHIỆM VỤ:
Tiếp nhận thông tin người dùng và thực hiện phân tích chi tiết, mang tính định hướng cao và chuyên nghiệp.

CẤU TRÚC PHẢN HỒI (BẮT BUỘC):
A. Tứ trụ và Ngũ hành: Xác định Can Chi (Năm, Tháng, Ngày, Giờ), Mệnh ngũ hành (Nạp âm), Cung phi (theo giới tính). Phân tích đặc tính ngũ hành chủ đạo và sự cân bằng âm dương.
B. Sim Phong Thủy: Phân tích SĐT theo tổng nút, ngũ hành của các con số, và quan trọng nhất là lập Quẻ Dịch cho dãy số (Quẻ Chủ, Quẻ Hỗ) để luận giải cát hung đối với bản mệnh người dùng.
C. Hướng Nhà và Địa Lý: Dựa vào Cung phi (Đông Tứ Trạch/Tây Tứ Trạch) để tư vấn 4 hướng tốt (Sinh Khí, Thiên Y, Diên Niên, Phục Vị) và 4 hướng xấu (Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại).
D. Ngày tốt và Định hướng sinh con: 
   - Đưa ra tiêu chí chọn ngày tốt trong tháng hiện tại.
   - Phân tích sự xung hợp giữa tuổi bố/mẹ và năm dự sinh con (năm Ất Tỵ 2025 hoặc Bính Ngọ 2026).
E. Lời khuyên tổng quan: Các vật phẩm phong thủy bổ trợ, màu sắc hợp mệnh, và hành động (Tu tâm, tích đức) để cải thiện vận trình.

QUY TẮC:
- Ngôn ngữ: Tiếng Việt, trang trọng, uyên bác.
- Sử dụng Markdown: Tiêu đề rõ ràng, in đậm các từ khóa quan trọng (**từ khóa**).
- Luôn giữ thái độ lịch sự và đáng tin cậy. 
- Nhắc đến triết lý là "Khai thông trí tuệ - Chuyển hóa vận mệnh".`;

export async function analyzeFengShui(userInfo: UserInfo): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Dữ liệu người dùng đăng ký tại Học Viện Minh Triết Phương Đông:
    - Họ tên: ${userInfo.fullName}
    - Ngày sinh: ${userInfo.dob} (Dương lịch)
    - Giới tính: ${userInfo.gender}
    - Số điện thoại: ${userInfo.phone}

    Hãy thực hiện phân tích phong thủy chi tiết theo đúng cấu trúc đã hướng dẫn.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "Xin lỗi, không thể khởi tạo phân tích lúc này.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Có lỗi xảy ra trong quá trình phân tích. Vui lòng thử lại sau.");
  }
}
