import { Fragment } from "react";
import { documentStyles as styles, htmlDocumentStyle } from "./proposalDocumentLayout";

function HtmlView({ style, children, ...props }) {
  return <div {...props} style={{ display: "flex", flexDirection: "column", flexShrink: 0, minWidth: 0, borderStyle: "solid", borderWidth: 0, ...htmlDocumentStyle(style) }}>{children}</div>;
}
function HtmlText({ style, children, ...props }) {
  return <div {...props} style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", flexShrink: 0, borderStyle: "solid", borderWidth: 0, ...htmlDocumentStyle(style) }}>{children}</div>;
}
function HtmlImage({ style, src }) { return <img src={src} alt="" style={htmlDocumentStyle(style)} />; }
function HtmlLink({ style, src, children }) { return <a href={src} style={htmlDocumentStyle(style)}>{children}</a>; }
const html = { View: HtmlView, Text: HtmlText, Image: HtmlImage, Link: HtmlLink };
const money = value => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

// Uma única estrutura comercial e os mesmos estilos para HTML e PDF.
export function ProposalDocument({ document, assets = { center: "/brand/centro-de-excelencia-senai.png", senai: "/brand/logo-senai.png" }, renderer, onRender, pageRef, bodyRef }) {
  const { snapshot: s } = document;
  const { View, Text, Image, Link } = renderer ?? html;
  // Snapshots antigos continuam legíveis sem inferir vínculos nem expor valor/hora.
  const groups = s.groups ?? [{ piece: null, items: s.items ?? [], subtotal: (s.items ?? []).reduce((sum, item) => sum + item.subtotal, 0) }];
  const detailed = s.investmentDisplay === "hours";
  const section = (key, title) => s.sections[key] && s.content[key] ? <View key={key} style={styles.section}><Text style={styles.label}>{title}</Text><Text>{s.content[key]}</Text></View> : null;
  const content = <>
    <View style={styles.body} {...(!renderer ? { ref: bodyRef, "data-proposal-body": true } : {})}>
      <View style={styles.logos}><View style={styles.logoViewport}><Image style={styles.logo} src={assets.center} /></View><View style={styles.senaiViewport}><Image style={styles.senai} src={assets.senai} /></View></View>
      <Text style={styles.title}>PROPOSTA COMERCIAL</Text>
      <Text style={styles.code}>{document.proposalId} • V{document.version}</Text>
      <View style={styles.meta}>
        <View style={styles.column}><Text style={styles.label}>ORÇAMENTO</Text><Text>{document.quoteId}</Text></View>
        <View style={styles.column}><Text style={styles.label}>DATA DE EMISSÃO</Text><Text>{new Date(document.createdAt).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}</Text></View>
      </View>
      <View style={styles.section}><Text style={styles.label}>CLIENTE</Text><Text style={styles.client}>{s.client.company}</Text>{s.client.contact && <Text>{s.client.contact}</Text>}</View>
      {section("scope", "ESCOPO")}
      <View style={styles.section}>
        <Text style={styles.label}>SERVIÇOS E INVESTIMENTO</Text>
        {s.sections.items && s.investmentDisplay !== "total-only" && groups.map((group, index) => <View key={index} style={styles.piece}>
          <Text style={styles.pieceTitle}>{group.piece ? "PEÇA " + String(index + 1).padStart(2, "0") + " · " + group.piece.name : "SERVIÇOS SEM PEÇA VINCULADA"}</Text>
          {group.piece?.code && <Text style={styles.caption}>Código {group.piece.code}</Text>}
          {group.piece?.quantity != null && <Text style={styles.caption}>Quantidade: {group.piece.quantity}</Text>}
          <View style={[styles.row, styles.tableHeader]}><Text style={styles.name}>SERVIÇO</Text>{detailed && <Text style={styles.cell}>HORAS</Text>}<Text style={styles.cell}>VALOR</Text></View>
          {group.items.map((item, itemIndex) => <View key={itemIndex} style={styles.row}>
            <View style={styles.name}><Text>{item.name}</Text>{item.equipment && <Text style={styles.caption}>{item.equipment}</Text>}</View>
            {detailed && <Text style={styles.cell}>{item.quotedHours == null ? "—" : item.quotedHours + " h"}</Text>}
            <Text style={styles.cell}>{money(item.subtotal)}</Text>
          </View>)}
          <View style={styles.pieceSubtotal}><Text>{group.piece ? "Subtotal da peça" : "Subtotal dos serviços"}</Text><Text>{money(group.subtotal)}</Text></View>
        </View>)}
        <View style={styles.total}><Text style={styles.totalLabel}>INVESTIMENTO TOTAL</Text><Text style={styles.totalValue}>{money(s.total)}</Text></View>
      </View>
      {section("technology", "EQUIPAMENTO / TECNOLOGIA")}
      <View style={{ flexDirection: "row" }}>
        {[ ["deadline", "PRAZO"], ["validity", "VALIDADE"] ].map(([key, title]) => s.sections[key] && s.content[key] ? <View key={key} style={styles.column}>{section(key, title)}</View> : null)}
      </View>
      {section("terms", "CONDIÇÕES COMERCIAIS")}
      {section("notes", "OBSERVAÇÃO COMERCIAL")}
      {s.sections.photos && s.media.some(media => media.type === "photo") && <View style={styles.photos}>{s.media.filter(media => media.type === "photo").map(media => <View key={media.id}><Image style={styles.photo} src={media.dataUrl} /><Text style={styles.caption}>{media.name}</Text></View>)}</View>}
      {s.sections.files && s.media.some(media => media.type === "file") && <View style={styles.section}><Text style={styles.label}>ARQUIVOS / REFERÊNCIAS</Text>{s.media.filter(media => media.type === "file").map(media => <Link key={media.id} src={media.dataUrl}>{media.name}</Link>)}</View>}
    </View>
    <Text style={styles.footer}>Centro de Excelência em Metrologia • Goiânia</Text>
  </>;
  if (renderer) {
    const { Document, Page } = renderer;
    return <Document title={document.proposalId + " V" + document.version} author="Centro de Excelência em Metrologia" creationDate={new Date(document.createdAt)} modificationDate={new Date(document.createdAt)} onRender={onRender}><Page size="A4" wrap={false} style={styles.page}>{content}</Page></Document>;
  }
  return <article ref={pageRef} className="proposal-document" aria-label="Proposta comercial A4" style={htmlDocumentStyle(styles.page)}><Fragment>{content}</Fragment></article>;
}
