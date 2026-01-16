export const metadata = {
  title: "Report Web",
  description: "Public share dashboards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
