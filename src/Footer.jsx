function Footer() {
  return (
    <footer style={{ 
      padding: "2rem", 
      background: "#111", 
      color: "#aaa", 
      textAlign: "center" 
    }}>
      <p>© 2026 Your Company. All rights reserved.</p>
      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1.5rem" }}>
        <a href="#" style={{ color: "#aaa" }}>Privacy</a>
        <a href="#" style={{ color: "#aaa" }}>Terms</a>
        <a href="#" style={{ color: "#aaa" }}>Contact</a>
      </div>
    </footer>
  );
}

export default Footer;