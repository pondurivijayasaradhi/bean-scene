function Navbar() {
  return (
    <nav style={{ padding: "1rem 2rem", background: "#111", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Logo</h2>
        <ul style={{ display: "flex", gap: "1.5rem", listStyle: "none" }}>
          <li><a href="#home" style={{ color: "white", textDecoration: "none" }}>Home</a></li>
          <li><a href="#features" style={{ color: "white", textDecoration: "none" }}>Features</a></li>
          <li><a href="#subscribe" style={{ color: "white", textDecoration: "none" }}>Subscribe</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;