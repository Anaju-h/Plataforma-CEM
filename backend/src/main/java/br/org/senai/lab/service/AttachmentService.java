package br.org.senai.lab.service;

import br.org.senai.lab.exception.ApiException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.*;

/**
 * Arquivos da solicitação. O navegador envia cada arquivo em base64 junto com a SOL; aqui ele é validado,
 * gravado em request_attachment e substituído na SOL só pelos metadados (id, nome, tipo, tamanho).
 */
@ApplicationScoped
public class AttachmentService {
  static final long MAX_FILE=10L*1024*1024, MAX_TOTAL=25L*1024*1024;
  static final int MAX_FILES=10;
  static final Set<String> EXTENSIONS=Set.of("jpg","jpeg","png","webp","gif","bmp","heic","pdf","step","stp","igs","iges","stl","obj","ply","dwg","dxf","x_t","sldprt","sldasm","iam","ipt","3mf","zip","doc","docx","xls","xlsx","csv","txt");
  public record Stored(List<Map<String,Object>> metadata,List<Pending> pending) {}
  public record Pending(UUID id,String name,String contentType,byte[] content) {}
  public record FileContent(String name,String contentType,byte[] content) {}
  @Inject EntityManager em;

  /** Decodifica e valida; devolve metadados (sem o conteúdo) e os arquivos pendentes para gravar após a SOL existir. */
  public Stored prepare(List<Map<String,Object>> files){
    List<Map<String,Object>> metadata=new ArrayList<>();List<Pending> pending=new ArrayList<>();
    if(files==null)return new Stored(metadata,pending);
    if(files.size()>MAX_FILES*2)throw new ApiException(400,"Lista de arquivos grande demais: envie no máximo "+MAX_FILES+" arquivos.");
    long total=0;int withContent=0;
    for(Map<String,Object> file:files){
      if(file==null)continue;
      String name=clean(String.valueOf(file.getOrDefault("name","arquivo")),260);
      Object data=file.get("dataBase64");
      Map<String,Object> meta=new LinkedHashMap<>();
      meta.put("name",name);meta.put("type",file.get("type"));meta.put("size",file.get("size"));
      if(data instanceof String base64&&!base64.isBlank()){
        if(++withContent>MAX_FILES)throw new ApiException(400,"Envie no máximo "+MAX_FILES+" arquivos.");
        String ext=name.contains(".")?name.substring(name.lastIndexOf('.')+1).toLowerCase(Locale.ROOT):"";
        if(!EXTENSIONS.contains(ext))throw new ApiException(400,"Tipo de arquivo não aceito: "+name+".");
        byte[] bytes;
        try{bytes=Base64.getDecoder().decode(base64.contains(",")?base64.substring(base64.indexOf(',')+1):base64);}catch(IllegalArgumentException e){throw new ApiException(400,"Arquivo inválido: "+name+".");}
        if(bytes.length>MAX_FILE)throw new ApiException(400,"Cada arquivo pode ter até 10 MB ("+name+").");
        total+=bytes.length;if(total>MAX_TOTAL)throw new ApiException(400,"O total de arquivos pode ter até 25 MB.");
        UUID id=UUID.randomUUID();
        String contentType=mediaType(String.valueOf(file.getOrDefault("contentType","")));
        meta.put("id",id.toString());meta.put("size",bytes.length);meta.put("contentType",contentType);meta.put("stored",true);
        pending.add(new Pending(id,name,contentType,bytes));
      } else meta.put("id",String.valueOf(file.getOrDefault("id",UUID.randomUUID().toString())));
      metadata.add(meta);
    }
    return new Stored(metadata,pending);
  }

  @Transactional public void save(UUID requestId,List<Pending> pending){
    for(Pending p:pending)
      em.createNativeQuery("INSERT INTO request_attachment(id,request_id,file_name,content_type,size_bytes,content,created_at) VALUES (?1,?2,?3,?4,?5,?6,SYSUTCDATETIME())")
        .setParameter(1,p.id()).setParameter(2,requestId).setParameter(3,p.name()).setParameter(4,p.contentType()).setParameter(5,(long)p.content().length).setParameter(6,p.content()).executeUpdate();
  }

  @Transactional @SuppressWarnings("unchecked")
  public FileContent load(UUID requestId,UUID attachmentId){
    List<Object[]> rows=em.createNativeQuery("SELECT file_name,content_type,content FROM request_attachment WHERE id=?1 AND request_id=?2").setParameter(1,attachmentId).setParameter(2,requestId).getResultList();
    if(rows.isEmpty())throw new ApiException(404,"Arquivo não encontrado.");
    Object[] r=rows.get(0);
    return new FileContent(String.valueOf(r[0]),mediaType(String.valueOf(r[1])),(byte[])r[2]);
  }

  /** Tipo MIME seguro; qualquer coisa fora do padrão vira download binário. */
  static String mediaType(String value){
    String v=value==null?"":value.trim().toLowerCase(Locale.ROOT);
    return v.matches("^[a-z0-9.+-]+/[a-z0-9.+-]+$")&&v.length()<=120?v:"application/octet-stream";
  }
  private static String clean(String value,int max){String v=value.replaceAll("[\\\\/:*?\"<>|\\r\\n]","_").trim();return v.length()>max?v.substring(v.length()-max):v;}
}
