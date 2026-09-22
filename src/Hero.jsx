function Hero() {
  return (
    <section style={{ 
      padding: "6rem 2rem", 
      textAlign: "center", 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white"
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        Welcome to Our Product
      </h1>
      <p style={{ fontSize: "1.25rem", maxWidth: "600px", margin: "0 auto 2rem" }}>
        Build something amazing today. Fast, modern, and beautiful.
      </p>
      <button style={{
        padding: "0.8rem 2rem",
        fontSize: "1.1rem",
        background: "white",
        color: "#667eea",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold"
      }}>
        Get Started
      </button>
    </section>
  );
}

export default Hero;