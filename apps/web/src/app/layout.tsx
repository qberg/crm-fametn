import { manrope, oswald } from "@/lib/fonts";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${manrope.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
