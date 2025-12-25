import type { Metadata } from "next";
import {
  Crimson_Text,
  Geist,
  Geist_Mono,
  Inter,
  Lato,
  Libre_Baskerville,
  Lora,
  Merriweather,
  Montserrat,
  Noto_Sans_SC,
  Noto_Serif_SC,
  Open_Sans,
  Playfair_Display,
  Poppins,
  Raleway,
  Roboto,
  Source_Sans_3,
} from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson-text",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RenderY",
  description: "A demo application using Next.js and Material-UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 添加 Google Fonts 链接以支持更多中文字体 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable}
          ${inter.variable}
          ${roboto.variable}
          ${notoSansSC.variable}
          ${notoSerifSC.variable}
          ${sourceSans3.variable}
          ${poppins.variable}
          ${playfairDisplay.variable}
          ${merriweather.variable}
          ${lora.variable}
          ${crimsonText.variable}
          ${libreBaskerville.variable}
          ${montserrat.variable}
          ${raleway.variable}
          ${openSans.variable}
          ${lato.variable}
          antialiased
        `}
      >
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
