// Medidas em pontos: compartilhadas pelo HTML (pt) e pelo renderizador PDF.
export const A4 = { width: 595.28, height: 841.89, bottom: 52 };
export const documentStyles = {
  page: { minHeight: A4.height, maxHeight: A4.height, width: A4.width, position: "relative", backgroundColor: "#ffffff", fontFamily: "Helvetica", fontSize: 10, color: "#071f2d", lineHeight: 1.4 },
  body: { position: "absolute", top: 34, left: 38, right: 38, flexShrink: 0 },
  logos: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 19, marginBottom: 23, borderBottomWidth: 1, borderBottomColor: "#cbd8e1" },
  // Os PNGs possuem margens transparentes grandes. O enquadramento remove
  // apenas essas margens, preservando os assets e a proporção das marcas.
  logoViewport: { width: 228, height: 38, position: "relative", overflow: "hidden" },
  logo: { position: "absolute", width: 256.8, height: 171.2, top: -60.96, left: -9 },
  senaiViewport: { width: 112, height: 34, position: "relative", overflow: "hidden" },
  senai: { position: "absolute", width: 112, height: 61.136, top: -10, left: 0 },
  title: { fontSize: 23, lineHeight: 1.2, fontFamily: "Helvetica-Bold", letterSpacing: 0.3, marginBottom: 5 },
  code: { fontSize: 11, color: "#426177", marginBottom: 19 },
  meta: { flexDirection: "row", marginBottom: 19 },
  column: { flex: 1 },
  section: { marginBottom: 16 },
  label: { fontSize: 8.5, lineHeight: 1.4, fontFamily: "Helvetica-Bold", letterSpacing: 0.8, color: "#526e81", marginBottom: 5 },
  client: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  row: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#e2e9ee", paddingTop: 6, paddingBottom: 6 },
  name: { flex: 1, paddingRight: 10 },
  cell: { width: 79, textAlign: "right" },
  tableHeader: { fontSize: 8, color: "#526e81", fontFamily: "Helvetica-Bold" },
  piece: { marginTop: 7, marginBottom: 5 },
  pieceTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  pieceSubtotal: { flexDirection: "row", justifyContent: "space-between", fontFamily: "Helvetica-Bold", fontSize: 9, paddingTop: 5 },
  total: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#163e58", paddingTop: 12, marginTop: 12, marginBottom: 6 },
  totalLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", letterSpacing: 0.5 },
  totalValue: { fontSize: 18, lineHeight: 1.2, fontFamily: "Helvetica-Bold" },
  photos: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  photo: { width: 145, height: 85, objectFit: "contain", marginRight: 10, marginBottom: 4 },
  caption: { fontSize: 8, color: "#526e81" },
  footer: { position: "absolute", bottom: 24, left: 38, right: 38, paddingTop: 9, borderTopWidth: 0.5, borderTopColor: "#cbd8e1", fontSize: 8, color: "#657b89" },
};

export function htmlDocumentStyle(style) {
  const merged = Array.isArray(style) ? Object.assign({}, ...style) : style ?? {};
  return Object.fromEntries(Object.entries(merged).map(([key, value]) => {
    if (key === "fontFamily") return [key, "Arial, Helvetica, sans-serif"];
    return [key, typeof value === "number" && !["flex", "flexShrink", "flexGrow", "lineHeight", "opacity", "fontWeight"].includes(key) ? `${value}pt` : value];
  }).concat(merged.fontFamily === "Helvetica-Bold" ? [["fontWeight", 700]] : []));
}

export function documentOverflows(page, body) {
  if (!page || !body) return false;
  // offset* independe da escala aplicada exclusivamente ao wrapper do preview.
  const safeBottom = page.clientHeight * (A4.height - A4.bottom) / A4.height;
  return body.offsetTop + Math.max(body.offsetHeight, body.scrollHeight) > safeBottom + 1;
}
