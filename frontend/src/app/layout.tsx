import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { MessageProvider } from "@/context/messageContext";
import { SocketContextProvider } from "@/context/socketContext";
import { GameActionProvider } from "@/context/eventContext";
import { UserInfoProvider } from "@/context/userInfoContext";
import { GameDataProvider } from "@/context/userGameContext";
import { DetailedUserGameDataProvider } from "@/context/detailedGameContext";
import { ToastContainer } from "react-toastify";
import { GameEventInfoProvider } from "@/context/gameEventInfoContext";
import { AuthProvider } from "@/context/authContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "sides.gg",
  description: "Stake your team. Earn real-time rewards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        <AuthProvider>
          {/* <LoadingProvider> */}
            <UserInfoProvider>
              <GameEventInfoProvider>
                <GameDataProvider>
                  <DetailedUserGameDataProvider>
                    <SocketContextProvider>
                      <MessageProvider>
                        <GameActionProvider>
                          <div className="min-h-[100dvh]">
                            {children}
                          </div>
                          <ToastContainer position="bottom-right" />
                        </GameActionProvider>
                      </MessageProvider>
                    </SocketContextProvider>
                  </DetailedUserGameDataProvider>
                </GameDataProvider>
              </GameEventInfoProvider>
            </UserInfoProvider>
          {/* </LoadingProvider> */}
        </AuthProvider>
      </body>
    </html>
  );
}