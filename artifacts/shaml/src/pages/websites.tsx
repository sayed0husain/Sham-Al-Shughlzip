export default function WebsitesPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: "hsl(30,20%,97%)", fontFamily: "var(--app-font-sans)" }}
    >
      <h1
        style={{
          fontFamily: "var(--app-font-heading)",
          color: "hsl(8,61%,41%)",
          fontSize: "3rem",
          marginBottom: "1rem",
        }}
      >
        المواقع
      </h1>
      <p style={{ color: "hsl(20,8%,50%)", fontSize: "1.1rem" }}>
        قريباً — ترقبوا مواقعنا القادمة
      </p>
      <a
        href="/"
        style={{
          marginTop: "2rem",
          color: "hsl(8,61%,41%)",
          fontFamily: "var(--app-font-heading)",
          textDecoration: "none",
          fontSize: "1rem",
          borderBottom: "1px solid hsl(8,61%,41%)",
          paddingBottom: "2px",
        }}
      >
        ← العودة للرئيسية
      </a>
    </div>
  );
}
