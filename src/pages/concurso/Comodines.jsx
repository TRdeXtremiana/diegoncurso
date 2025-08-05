function Comodines() {
  const comodines = ["📞", "👥", "⏱️"]; // llamada, público, 30s

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px" }}>
      {comodines.map((c, i) => (
        <button
          key={i}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

export default Comodines;
