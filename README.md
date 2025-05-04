# คู่มือเริ่มต้นใช้งาน Webboard Frontend (ภาษาไทย)

## 1. Clone โปรเจกต์

```bash
git clone <url-repo>
cd webboard-frontend
```

## 2. ติดตั้ง dependencies

```bash
npm install
```

## 3. ตั้งค่า Environment
- สร้างไฟล์ `.env` (หรือดูตัวอย่างใน repo)
- ใส่ค่า API endpoint เช่น

```
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3001
```

## 4. รันโปรเจกต์

```bash
npm run dev
```
- เปิดเว็บที่ [http://localhost:3000](http://localhost:3000)

## 5. โครงสร้างโปรเจกต์
- `app/` : ไฟล์เพจหลัก (Next.js App Router)
- `components/` : ส่วนประกอบ UI ต่าง ๆ เช่น ปุ่ม, card, sidebar, ฯลฯ
- `lib/` : ฟังก์ชันช่วยเหลือ เช่น utils, config
- `public/` : รูปภาพ โลโก้ ฯลฯ
- `types/` : ไฟล์ type/interface สำหรับ TypeScript

## 6. การใช้งาน
- สมัครสมาชิก/เข้าสู่ระบบที่หน้า Sign In
- สร้างโพสต์ใหม่/คอมเมนต์/ค้นหา/เลือก community ได้
- ถ้า login แล้วจะเห็นโพสต์ของตัวเองในหน้า Blog

## 7. ปัญหาที่พบบ่อย
- ถ้า fetch API ไม่ได้ ให้เช็ค `.env` ว่าตั้งค่า NEXT_PUBLIC_API_ENDPOINT ถูกต้อง
- ถ้าเจอ error เกี่ยวกับ CORS ให้เช็ค backend ว่าอนุญาต origin หรือยัง
- ถ้าเว็บไม่แสดงผล ให้เช็คว่า backend รันอยู่ที่ port 3001 หรือไม่

## 8. ข้อมูลเพิ่มเติม
- Frontend ใช้ [Next.js](https://nextjs.org/) + Tailwind CSS

