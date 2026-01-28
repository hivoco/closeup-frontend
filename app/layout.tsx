import type { Metadata, Viewport } from "next";
import { Geologica } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const geologica = Geologica({
  variable: "--font-geologica",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://closeuplovetunes.in"),

  title: {
    default: "Create Your Personalized Love Tune | Closeup Love Tunes",
    template: "%s | Closeup Love Tunes",
  },

  description:
    "Create a personalized romantic music video with Closeup Love Tunes. Turn your love story into a beautiful Valentine's music video.",

  openGraph: {
    title: "Create Your Personalized Love Tune | Closeup",
    description:
      "Surprise your partner with a personalized romantic music video. Create your Closeup Love Tune today.",
    url: "https://closeuplovetunes.in",
    siteName: "Closeup Love Tunes",
    images: [
      {
        url: "/og/red-logo.png",
        width: 1200,
        height: 630,
        alt: "Closeup Love Tunes - Personalized Love Music Video",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Create Your Personalized Love Tune | Closeup",
    description:
      "Turn your love story into a personalized romantic music video with Closeup Love Tunes.",
    images: ["/og/red-logo.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://closeuplovetunes.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-NK2Q4ZM3" />
      <body className={`${geologica.className} antialiased`}>
        {children}

        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{ backgroundColor: "white", color: "black" }}
        />
      </body>
      {/* <GoogleAnalytics gaId="G-FZLSKM6970" /> */}
    </html>
  );
}
