function BarraProgreso({ actual, total }) {
  return (
    <div style={{ margin: "20px 0" }}>
      Pregunta {actual} / {total}
      <div style={{ background: "#ddd", borderRadius: "10px", overflow: "hidden" }}>
        <div
          style={{
            width: `${(actual / total) * 100}%`,
            height: "10px",
            background: "var(--morado)",
          }}
        />
      </div>
    </div>
  );
}

export default BarraProgreso;
