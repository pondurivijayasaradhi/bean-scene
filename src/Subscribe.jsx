function Subscribe() {
  return (
    <section id="subscribe" style={{ 
      padding: "4rem 2rem", 
      textAlign: "center", 
      background: "#f8f9fa" 
    }}>
      <h2>Subscribe to our newsletter</h2>
      <p style={{ margin: "1rem 0 2rem", color: "#666" }}>
        Get the latest updates and offers directly in your inbox.
      </p>
      <form style={{ display: "flex", justifyContent: "center", gap: "0.5rem", maxWidth: "400px", margin: "0 auto" }}>
        <input 
          type="email" 
          placeholder="Enter your email" 
          style={{ 
            flex: 1, 
            padding: "0.75rem 1rem", 
            border: "1px solid #ddd", 
            borderRadius: "6px",
            fontSize: "1rem"
          }} 
        />
        <button type="submit" style={{
          padding: "0.75rem 1.5rem",
          background: "#667eea",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold"
        }}>
          Subscribe
        </button>
      </form>
    </section>
  );
}

export default Subscribe;