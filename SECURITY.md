# Backend Security Setup

## Environment Variables

สำหรับความปลอดภัย เราใช้ Environment Variables สำหรับเก็บข้อมูลสำคัญ

### Setup Instructions:

1. Copy `.env.example` เป็น `.env`:
   ```bash
   cp .env.example .env
   ```

2. แก้ไขค่าใน `.env` ให้เป็นค่าจริง

3. **⚠️ ห้าม commit ไฟล์ `.env` ขึ้น git!**

### สำหรับ Demo Passwords:

ไฟล์ `.env` มี password สำหรับ demo accounts:
- DEMO_PASSWORD_ADMIN
- DEMO_PASSWORD_MANAGER  
- DEMO_PASSWORD_OPERATOR
- DEMO_PASSWORD_USER
- DEMO_PASSWORD_WATANYU

### ในระบบจริง:

- ลบ demo password mapping ออก
- ใช้ hashed password จาก database
- ใช้ proper authentication system

## Security Best Practices:

- ✅ ใช้ Environment Variables
- ✅ .env อยู่ใน .gitignore
- ✅ มี .env.example สำหรับ developer อื่น
- ✅ ไม่ hardcode sensitive data ใน code