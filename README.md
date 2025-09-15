# โปรเจคเกม (Static Host Ready)

โครงสร้างไฟล์สำหรับอัพขึ้นโฮสต์แบบ Static (เช่น GitHub Pages, Netlify, Vercel, Cloudflare Pages, หรือโฮสต์โรงเรียน)

```
game-host/
├─ index.html
├─ assets/
│  ├─ css/
│  │  └─ styles.css
│  ├─ js/
│  │  └─ game.js
│  └─ images/
│     ├─ buddha.png        ← ใส่รูปจริงทับไฟล์นี้
│     ├─ villager.png      ← ใส่รูปจริงทับไฟล์นี้
│     └─ favicon.png
```

## อัพเดตภาพตัวละคร
- แทนที่ `assets/images/buddha.png` และ `assets/images/villager.png` ด้วยไฟล์รูปจริงของคุณ (ขนาดใดก็ได้ แนะนำ 512x512 PNG)
- ไม่ต้องแก้โค้ดเพิ่มเติม ชื่อไฟล์คงเดิมก็พอ

## เปิดใช้งาน
- เปิด `index.html` ตรง ๆ ได้ หรืออัพทั้งโฟลเดอร์ขึ้นโฮสต์
- หากใช้ GitHub Pages: push ทั้งโฟลเดอร์ขึ้น repo แล้วเปิด Pages
- หากใช้ Netlify/Vercel/Cloudflare Pages: เลือก deploy เป็น Static site โฟลเดอร์ `game-host`

> หมายเหตุ: ถ้าคุณใช้โดเมนย่อย/พาธย่อย ไม่ต้องแก้อะไรเพิ่มเพราะไฟล์อ้างอิงเป็นพาธสัมพัทธ์ (relative path)
