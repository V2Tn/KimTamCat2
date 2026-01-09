
/**
 * Dịch vụ kết nối với Make.com (Integromat)
 */

// Link Webhook chính xác từ tài khoản của bạn
const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/txuubkcr5hfjs72ydlo58ajd2jjw4873";

export interface SheetData {
  fullName: string;
  phone: string;
  dob?: string;
  gender?: string;
  email?: string;
  note?: string;
  // Added 'Luận Giải' to fix type mismatch error in App.tsx
  source: 'Xem Phong Thủy' | 'Tư Vấn' | 'Luận Giải';
  timestamp?: string;
}

export async function saveToGoogleSheet(data: SheetData): Promise<boolean> {
  if (!MAKE_WEBHOOK_URL || MAKE_WEBHOOK_URL.includes("your-unique-webhook-id")) {
    console.warn("⚠️ Cảnh báo: Webhook chưa được cấu hình đúng link.");
    return false; 
  }

  try {
    const payload = {
      ...data,
      timestamp: new Date().toLocaleString('vi-VN'),
      origin: window.location.origin,
      status: 'new_lead'
    };

    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch (error) {
    console.error("❌ Lỗi gửi dữ liệu:", error);
    return false;
  }
}
