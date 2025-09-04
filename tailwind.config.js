/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        thai: ["K2D", "sans-serif"], // ✅ เพิ่มตรงนี้
      },
      colors: {
        primary: "#FF8001",       // main
        secondary: "#FBC02D",     // second
        border: "#B3B3B3",
        line: "#D9D9D9",
        textsecondary: "#656565", // เปลี่ยนชื่อให้สอดคล้อง
        icon: "#151515",
        gradient: "linear-gradient(to left, #FF8001, #FBC02D)",
      },
      backgroundImage: {
        "gradient": "linear-gradient(to top, #FF8001, #FBC02D)",
      },
    },
  },
  plugins: [],
};
