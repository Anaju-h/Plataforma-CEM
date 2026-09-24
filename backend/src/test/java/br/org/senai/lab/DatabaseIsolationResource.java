package br.org.senai.lab;

import io.quarkus.test.common.QuarkusTestResourceLifecycleManager;
import java.nio.file.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.sql.*;
import java.util.*;

/** Pins the test datasource before Flyway and compares DEV using SELECT statements only. */
public class DatabaseIsolationResource implements QuarkusTestResourceLifecycleManager {
  private static final String TEST_URL="jdbc:sqlserver://localhost:1433;databaseName=lab_platform_test;encrypt=true;trustServerCertificate=true";
  private String devUrl,user,password,before;
  public Map<String,String> start() {
    try {
      Map<String,String> values=new HashMap<>();
      Path env=Path.of(".env");
      if(Files.exists(env)) for(String line:Files.readAllLines(env)) {
        if(line.isBlank()||line.stripLeading().startsWith("#")||!line.contains("="))continue;
        int split=line.indexOf('=');String value=line.substring(split+1).trim();
        if(value.length()>1&&((value.startsWith("\"")&&value.endsWith("\""))||(value.startsWith("'")&&value.endsWith("'"))))value=value.substring(1,value.length()-1);
        values.put(line.substring(0,split).trim(),value);
      }
      values.putAll(System.getenv());user=values.get("DB_USER");password=values.get("DB_PASSWORD");devUrl=values.get("JDBC_DATABASE_URL");
      if(devUrl==null||!devUrl.toLowerCase(Locale.ROOT).matches(".*databasename=lab_platform(?:;.*)?"))throw new IllegalStateException("DEV não está configurado para a verificação de isolamento.");
      before=fingerprint();
      return Map.of("quarkus.datasource.jdbc.url",TEST_URL,"quarkus.datasource.username",values.getOrDefault("TEST_DB_USER",user),"quarkus.datasource.password",values.getOrDefault("TEST_DB_PASSWORD",password));
    }catch(Exception e){throw new IllegalStateException("Falha ao preparar a verificação de isolamento DEV/TEST",e);}
  }
  private String fingerprint() throws Exception {
    MessageDigest digest=MessageDigest.getInstance("SHA-256");
    try(Connection c=DriverManager.getConnection(devUrl,user,password)) {
      c.setReadOnly(true);
      try(var s=c.createStatement();var rs=s.executeQuery("SELECT DB_NAME()")){if(!rs.next()||!"lab_platform".equals(rs.getString(1)))throw new IllegalStateException("Banco DEV inesperado");}
      List<String> tables=new ArrayList<>();
      try(var s=c.createStatement();var rs=s.executeQuery("SELECT name FROM sys.tables WHERE is_ms_shipped=0 ORDER BY name")){while(rs.next())tables.add(rs.getString(1));}
      for(String table:tables) {
        digest.update(table.getBytes(StandardCharsets.UTF_8));List<String> rows=new ArrayList<>();
        // Hash each row independently and sort: no dependence on physical row order.
        try(var s=c.createStatement();var rs=s.executeQuery("SELECT * FROM ["+table.replace("]","]]")+"]")) {
          int count=rs.getMetaData().getColumnCount();
          while(rs.next()) {StringBuilder row=new StringBuilder();for(int i=1;i<=count;i++){String value=rs.getString(i);row.append(value==null?-1:value.length()).append(':').append(value).append('|');}rows.add(row.toString());}
        }
        Collections.sort(rows);for(String row:rows)digest.update(row.getBytes(StandardCharsets.UTF_8));
      }
      try(var s=c.createStatement();var rs=s.executeQuery("SELECT name,CONVERT(VARCHAR(100),current_value) FROM sys.sequences ORDER BY name")){while(rs.next())digest.update((rs.getString(1)+":"+rs.getString(2)).getBytes(StandardCharsets.UTF_8));}
    }
    return HexFormat.of().formatHex(digest.digest());
  }
  public void stop() {
    if(before==null)return;
    try {
      if(!before.equals(fingerprint()))throw new IllegalStateException("O conteúdo ou as sequências DEV mudaram durante a suíte.");
      System.out.println("DEV isolation verified: all lab_platform rows and sequences unchanged.");
    }catch(Exception e){throw new IllegalStateException("Falha na verificação final de isolamento",e);}
  }
}
