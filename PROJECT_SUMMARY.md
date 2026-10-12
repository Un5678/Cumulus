# 📋 สรุปภาพรวมโปรเจกต์ Cumulus (Project Summary)

เอกสารนี้รวบรวมข้อมูลสำคัญทั้งหมดของระบบ **Cumulus** (เดิม: My Investment) ทั้งในส่วนของสถาปัตยกรรม, ระบบฐานข้อมูลบน Cloud, ตรรกะการคำนวณการเงิน, และการออกแบบหน้าจอ เพื่อให้คุณสามารถเก็บไว้อ้างอิงหรือใช้เริ่มต้นสนทนาต่อได้อย่างสมบูรณ์

---

## 1. ข้อมูลทั่วไปและเทคโนโลยี (Tech Stack)
* **Frontend:** React (Vite)
* **Styling:** Tailwind CSS (พร้อมการออกแบบ Responsive รองรับ PC, Tablet, Mobile)
* **Charts Library:** Chart.js + react-chartjs-2
* **Backend & Database:** Google Apps Script (Web App API) + Google Sheets
* **Font:** Google Font "Prompt"

---

## 2. ระบบฐานข้อมูลและการเชื่อมต่อ Cloud (Database & API)
ข้อมูลการลงทุนทั้งหมดถูกจัดเก็บอยู่บน **Google Sheets** ในบัญชี Google Drive ของคุณ ข้อมูลจึงปลอดภัย ไม่สูญหายแม้จะย้ายเครื่องหรือย้ายโฟลเดอร์

* **Web App API URL:**
  `https://script.google.com/macros/s/AKfycbwnXVzDqzDLUhD6CjEK5jxy0z2UfbvgFM-j8osQ9vTvp_I58aBSBKInaEVAlreFDx7azA/exec`

* **แผ่นงาน (Sheets) ที่ใช้งาน:**
  1. `TradeLog` — บันทึกประวัติการทำรายการ:
     * วันที่ (`date`), พอร์ต (`portfolio`), ประเภท (`type`: Buy, Sell, Deposit, Withdraw, Dividend, Interest)
     * สัญลักษณ์ (`symbol`), จำนวน (`volume`), ราคา (`price`), ค่าธรรมเนียม (`fee`), มูลค่ารวม (`totalValue`)
  2. `CurrencyLog` — บันทึกประวัติการแลกเปลี่ยนเงิน:
     * วันที่ (`date`), ประเภท (`type`: Buy USD, Sell USD), จำนวนเงิน (`amount`), อัตราแลกเปลี่ยน (`exchangeRate`), จำนวนที่ได้รับ (`convertedAmount`)
  3. `MarketData` — ราคาตลาดและอัตราแลกเปลี่ยนปัจจุบัน:
     * สัญลักษณ์ (`symbol`), ราคาอัตโนมัติ (`autoPrice`), ราคาแมนนวล (`manualPrice`)
     * มีคู่เงิน `USDTHB` สำหรับคำนวณอัตราแลกเปลี่ยนกลาง (`globalExchangeRate`)
  4. `PriceHistory` — บันทึกประวัติราคาย้อนหลังสำหรับวาดกราฟเส้น Performance

* **ระบบความปลอดภัย (Security):**
  * มีการตรวจสอบ Secret Token (`app_secret_token`) ก่อนอนุญาตให้บันทึกหรือลบข้อมูลใน Google Sheets
  * Token จะถูกจดจำไว้ใน Browser Cache (`localStorage`) ของเครื่องผู้ใช้งาน

---

## 3. ตรรกะและสูตรการเงินสำคัญ (Core Financial Calculations)
ระบบมีจุดเด่นคือการคำนวณทางบัญชีที่แม่นยำสูง แยกประเภทผลตอบแทนชัดเจน:

### 3.1 การแยกกำไรการลงทุน ออกจาก กำไรค่าเงิน (Asset P/L vs FX P/L)
* **Asset P/L (กำไรจากการลงทุน):** คำนวณจากผลต่างราคาของหุ้น/สินทรัพย์ในรูปสกุล USD แล้วแปลงเป็น THB ณ อัตราแลกเปลี่ยนปัจจุบัน
* **Currency P/L (กำไรจากค่าเงิน):** คำนวณจากการแลกเงินใน `CurrencyLog` (FIFO / Average Cost) อย่างเป็นอิสระ
* **เงินลงทุนสุทธิ (Invested Capital):** มีความสัมพันธ์เชิงสมการที่พิสูจน์แล้วว่า:
  $$\text{มูลค่าพอร์ตปัจจุบัน} - \text{กำไรการลงทุนรวม} - \text{กำไรค่าเงิน} = \text{เงินต้นจริง}$$

### 3.2 การจำแนกพอร์ตการลงทุน (Portfolio Structure)
รองรับการกรองดูภาพรวมสินทรัพย์ทั้งหมด และแยกตามกลุ่มพอร์ต:
* **ภาพรวม:** `สินทรัพย์ทั้งหมด (Total Wealth)`
* **สินทรัพย์หลัก:** `หุ้น (Stocks)`, `กองทุน (Funds)`, `คริปโต (Crypto)`, `ทองคำ (Gold)`, `เงินสด (Cash)`
* **Sub-portfolios (สำหรับหุ้น):** `Core Portfolio`, `Satellite Portfolio`, `Alpha Portfolio`, `Defensive Portfolio`, `Dividend Portfolio`
* **ระบบเป้าหมาย (Rebalance Targets):** มีฟังก์ชัน `getScalingFactor()` คำนวณสัดส่วนเป้าหมาย % ย้อนกลับตามระดับพอร์ตที่ผู้ใช้เลือกดูได้อย่างถูกต้อง

---

## 4. ไฮไลต์ด้าน UI และ Responsive Dynamics
หน้าระบบถูกปรับแต่งเป็นพิเศษเพื่อประสบการณ์การใช้งานที่ดีที่สุด:

1. **กราฟแท่งผลตอบแทน (Monthly Bar Chart):**
   * เลื่อนดูข้อมูลย้อนหลังได้ (Horizontal Scroll) โดยใช้เทคนิค `dir="rtl"` ทำให้เวลาเปิดหน้าเว็บ กราฟจะเลื่อนไปอยู่ **เดือนล่าสุด (ขวาสุด)** ให้โดยอัตโนมัติ
   * แกน Y อยู่ทางขวา (`position: 'right'`) มองเทียบกับเดือนล่าสุดได้ทันที
   * ขนาดความกว้างของกราฟถูกล็อกสูตรให้มองเห็นได้พอดี 2 ปี (24 เดือน) เสมอ:
     $$\text{minWidth} = \max(100\%, \frac{\text{จำนวนเดือน}}{24} \times 100\%)$$
   * ตารางสรุปด้านล่างจะเรียง **เดือนล่าสุดไว้ด้านบนสุด** เสมอ

2. **กราฟวงกลม (Pie Chart Layout Fix):**
   * ใช้คอนเทนเนอร์ `absolute inset-0` เพื่อไม่ให้ Canvas กราฟค้างความสูงเวลาสลับระหว่างโหมด "จัดกลุ่ม" และ "รายตัว"

3. **Dynamic Responsive (มือถือ / แท็บเล็ต / PC):**
   * ขนาดตัวเลขในการ์ดสรุปและตารางปรับลดขนาดตามขนาดหน้าจออัตโนมัติ ป้องกันตัวเลขตกบรรทัดหรือซ้อนทับกัน
   * กล่องสรุปสถิติ 5 ช่องใน Performance & Risk ปรับเป็น 2 ช่องบนมือถือ, 3 ช่องบนแท็บเล็ต, และ 5 ช่องบน PC
   * ตารางข้อมูลทุกหน้ามีขนาดช่องไฟ (Padding) ที่กระชับ อ่านง่ายบนสมาร์ตโฟน

---

## 5. วิธีรันและดูแลระบบ (How to Run & Maintain)

```bash
# 1. เข้าสู่โฟลเดอร์โปรเจกต์
cd Cumulus

# 2. ติดตั้ง Dependencies (กรณีเครื่องใหม่หรือหลังย้าย)
npm install

# 3. รันเซิร์ฟเวอร์สำหรับทดสอบในเครื่อง
npm run dev

# 4. ทดสอบ Build สำหรับ Production
npm run build
```

* **Local URL:** `http://localhost:5173`

---

## 6. หากต้องการกลับมาพัฒนาต่อกับ AI (Next Chat Prompt)
เมื่อคุณย้ายโฟลเดอร์ไปยังที่ใหม่แล้วเปิดหน้าต่างแชทใหม่ คุณสามารถคัดลอกข้อความสั้นๆ นี้ส่งให้ AI ได้ทันที:

> *"สวัสดีครับ นี่คือโปรเจกต์เว็บ Cumulus (React + Vite + Tailwind + Chart.js) เชื่อมต่อ Google Sheets Web App เพื่อบันทึกการลงทุน รบกวนอ่านไฟล์ PROJECT_SUMMARY.md ในโปรเจกต์เพื่อทำความเข้าใจโครงสร้าง แล้วช่วยฉันทำ..."*
