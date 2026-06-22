import "./globals.css";


export const metadata = {
  title: "Freelancer Desk",
  description: "Freelancer Desk | Manage your freelance projects with ease and efficiency.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
