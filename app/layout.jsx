import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Tamarind Mombasa Microservices</title>
        <meta
          name="description"
          content="Tamarind Mombasa Microservices Portal | A collection of services for Tamarind Mombasa operations"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
