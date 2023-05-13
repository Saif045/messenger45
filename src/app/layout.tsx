import "./globals.css";
import AuthContext from "@/context/AuthContext";
import ActiveStatus from "@/components/globalComponents/ActiveStatus";
import ToasterContext from "@/context/ToasterContext";
import { Analytics } from '@vercel/analytics/react';


export const metadata = {
  title: "Messenger",
  description: "Messenger Clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />
<Analytics/>
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
