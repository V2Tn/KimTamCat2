
import { GoogleGenAI } from "@google/genai";
import { UserInfo } from "../types";

const SYSTEM_INSTRUCTION = `Bạn là "Chuyên gia Tư vấn Minh Triết" thuộc Học Viện Minh Triết Phương Đông. Nhiệm vụ của bạn là dựa trên thông tin người dùng để đưa ra giải pháp tư vấn chuyên sâu về Phong Thủy và Thuật Số.

### QUAN TRỌNG VỀ LỊCH:
- Người dùng có thể cung cấp ngày sinh hoặc ngày dự định theo DƯƠNG LỊCH hoặc ÂM LỊCH.
- Nếu người dùng cung cấp ÂM LỊCH, bạn hãy coi đó là ngày gốc để tính toán.
- Nếu là DƯƠNG LỊCH, bạn hãy tự quy đổi sang ÂM LỊCH để phân tích các yếu tố thuật số.
- Luôn nêu rõ trong phản hồi rằng bạn đang phân tích dựa trên lịch nào để người dùng an tâm.

### NGỮ CẢNH:
Bạn hỗ trợ 2 loại hình tư vấn chính:
1. TƯ VẤN MUA XE: Chọn màu sắc và ngày giờ rước xe đại cát.
2. TƯ VẤN SINH MỔ: Chọn ngày giờ đại cát để đón bé, phân tích sự xung hợp giữa Cha, Mẹ và Con.

### QUY TẮC PHÂN TÍCH CHUNG:
1. XÁC ĐỊNH MỆNH: Từ năm sinh người dùng, xác định Mệnh Ngũ Hành và Nạp Âm.
2. PHÂN TÍCH NGÀY DỰ ĐỊNH: Kiểm tra Hoàng Đạo, Can Chi xung khắc dựa trên loại lịch người dùng chọn.

### QUY TẮC RIÊNG CHO SINH MỔ:
- Sử dụng ngày sinh của cả Cha và Mẹ để tìm sự giao thoa ngũ hành.
- Phân tích mệnh cách của bé dựa trên năm sinh dự kiến.
- Đánh giá ngày dự định sinh mổ có phạm các ngày kỵ (Tam Nương, Nguyệt Kỵ, Thụ Tử...) hay không.
- Ưu tiên các giờ có sự cân bằng ngũ hành, tốt cho tương lai bản mệnh bé và sự hưng vượng của gia đình.

### CẤU TRÚC PHẢN HỒI (BẮT BUỘC DÙNG NHÃN [PHẦN X]):

Lời chào: (Chào quý anh/chị **[Tên người dùng]**, chúc mừng quý vị đã có dự định [mua xe/đón thiên thần nhỏ]... - LƯU Ý: LUÔN IN ĐẬM TÊN NGƯỜI DÙNG BẰNG DẤU **).

[PHẦN 1]: PHÂN TÍCH BẢN MỆNH VÀ ĐỊNH HƯỚNG
- Nhắc lại Mệnh và Tuổi người dùng (xác nhận lại ngày sinh Âm lịch tương ứng).
- (Nếu mua xe): **Màu nên mua (Tương sinh, Tương hợp):** và **Màu nên tránh:**.
- (Nếu sinh mổ): 
  + **Tương quan Cha - Mẹ:** (Phân tích sự hợp khắc giữa 2 vợ chồng dựa trên can chi, ngũ hành).
  + **Định hướng mệnh cách cho bé:** (Sự xung hợp với Cha Mẹ).

[PHẦN 2]: ĐÁNH GIÁ NGÀY DỰ ĐỊNH
- Đánh giá ngày người dùng chọn có Tốt hay Xấu. 
- Chỉ rõ ngày dự định này là Dương lịch hay Âm lịch theo ý người dùng.

[PHẦN 3]: NGÀY TỐT VÀ GIỜ HOÀNG ĐẠO
- Gợi ý 3 ngày/giờ tốt nhất khác trong tháng đó.
- Trình bày rõ ràng:
  **Gợi ý X: Ngày DD/MM/YYYY (Dương lịch)**
  ◈ Âm lịch: ...
  ◈ Đặc điểm: (Cát tinh, Trực...)
  ◈ Giờ Hoàng Đạo: ...

[PHẦN 4]: LỜI CHÚC
- Lời chúc bình an, tài lộc hoặc Mẹ tròn con vuông.
- KHÔNG ký tên chuyên gia ở cuối.

PHONG CÁCH:
- Chuyên nghiệp, dùng biểu tượng "◈" cho danh sách chi tiết.
- Các đầu mục tiêu đề phụ phải in đậm và nằm trên một dòng riêng biệt.`;

export async function analyzeFengShui(userInfo: UserInfo): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const typeText = userInfo.serviceType === 'car' ? 'TƯ VẤN MUA XE' : 'TƯ VẤN SINH MỔ';
  const targetLabel = userInfo.serviceType === 'car' ? 'Ngày dự định mua xe' : 'Ngày dự định sinh mổ';
  
  const dobText = `${userInfo.dob} (${userInfo.dobType === 'solar' ? 'Dương lịch' : 'Âm lịch'})`;
  const targetDateText = `${userInfo.targetDate} (${userInfo.targetDateType === 'solar' ? 'Dương lịch' : 'Âm lịch'})`;
  const parentDobText = userInfo.parentDob ? `${userInfo.parentDob} (${userInfo.parentDobType === 'solar' ? 'Dương lịch' : 'Âm lịch'})` : '';

  const familyInfo = userInfo.serviceType === 'baby' ? `
    - Ngày sinh người phối ngẫu (${userInfo.gender === 'Nam' ? 'Mẹ' : 'Cha'}): ${parentDobText}
  ` : '';

  const prompt = `
    DỮ LIỆU ${typeText}:
    - Họ tên người đăng ký: ${userInfo.fullName}
    - Giới tính người đăng ký: ${userInfo.gender}
    - Ngày sinh người đăng ký (${userInfo.gender === 'Nam' ? 'Cha' : 'Mẹ'}): ${dobText}${familyInfo}
    - ${targetLabel}: ${targetDateText}
    - Số điện thoại: ${userInfo.phone}

    Yêu cầu: 
    - Thực hiện phân tích chuyên sâu cho loại hình ${typeText}.
    - Đặc biệt chú ý đến việc người dùng chọn Âm lịch hay Dương lịch cho cả ngày sinh và ngày dự định để tính toán chính xác.
    - In đậm tên ${userInfo.fullName} trong lời mở đầu.
    - KHÔNG ký tên chuyên gia ở cuối bài.
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

    return response.text || "Hệ thống tư vấn đang bận, quý vị vui lòng thử lại sau.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error("Lỗi kết nối hệ thống AI. Vui lòng thử lại sau.");
  }
}
