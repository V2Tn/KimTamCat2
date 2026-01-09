
export interface UserInfo {
  fullName: string;
  dob: string;
  dobType: 'solar' | 'lunar';
  gender: 'Nam' | 'Nữ';
  phone: string;
  targetDate: string; // Ngày dự định (Mua xe hoặc Sinh mổ)
  targetDateType: 'solar' | 'lunar';
  serviceType: 'car' | 'baby';
  parentDob?: string; // Ngày sinh của Cha hoặc Mẹ (dành cho sinh mổ)
  parentDobType?: 'solar' | 'lunar';
}

export interface AnalysisResult {
  content: string;
  timestamp: string;
}
