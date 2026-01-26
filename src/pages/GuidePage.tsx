import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FF8001] to-[#FBC02D] flex flex-col">

      {/* 📘 Content */}
      <div className="flex-1 p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-white mb-6">วิธีการใช้งานระบบ</h1>

        <div className="bg-white rounded-xl shadow-xl p-4 max-w-md w-full mb-6">
          <img
            src= {image1}
            alt="ขั้นตอนที่ 1"
            className="w-full h-auto rounded-lg mb-3 object-cover"
          />
          <p className="text-gray-700 text-center">
            1. เข้าสู่ระบบและเลือกโรงอาหารเพื่อทำการจองโต๊ะ
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-4 max-w-md w-full mb-6">
          <img
            src={image2}
            alt="ขั้นตอนที่ 2"
            className="w-full h-auto rounded-lg mb-3 object-cover"
          />
          <p className="text-gray-700 text-center">
            2. เลือกโต๊ะว่างที่ท่านต้องการจอง
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-4 max-w-md w-full mb-6">
          <img
            src={image3}
            alt="ขั้นตอนที่ 3"
            className="w-full h-auto rounded-lg mb-3 object-cover"
          />
          <p className="text-gray-700 text-center">
            3. เลือกระยะเวลาที่ท่านต้องการจอง
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-4 max-w-md w-full mb-6">
          <img
            src={image4}
            alt="ขั้นตอนที่ 4"
            className="w-full h-auto rounded-lg mb-3 object-cover"
          />
          <p className="text-gray-700 text-center">
            4. เมื่อกดจองแล้วจะมีปุ่มเพิ่มมาที่ด้านขวาล่าง กดปุ่มเพื่อทำการสแกน QR หรือ ยกเลิกการจอง
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-4 max-w-md w-full">
          <img
            src={image5}
            alt="ขั้นตอนที่ 4"
            className="w-full h-auto rounded-lg mb-3 object-cover"
          />
          <p className="text-gray-700 text-center">
            5. เมื่อถึงโต๊ะทำการกดปุ่มสแกนเพื่อยืนยันการมาถึงโต๊ะ หรือ ต้องการยกเลิกการจองให้กดยกเลิกการจอง <b>"หากไม่มีคนนั่งโต๊ะแต่ยังต้องการใช้งานให้ทำการ สแกน QR อีกครั้ง เพื่อทำการบ่งบอกว่าโต๊ะนี้มีคนใช้งาน"</b>
          </p>
        </div>
      </div>
    </div>
  );
}
