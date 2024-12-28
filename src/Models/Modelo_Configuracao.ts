import { uint16 } from "../@Types/Tipo_Inteiros";


class Modelo_Config {
    public BD: Config_BD = new Config_BD();
    public LOG: Config_Log = new Config_Log();
    public WebServer: Config_WebServer = new Config_WebServer();
}

class Config_BD {
    public Usuario: string = "";
    public Senha: string = "";
    public Database: string = "wscore";
    public Host: string = "localhost";
    public Porta: uint16 = new uint16(3306);
}

class Config_Log {
    public Console: boolean = true;
    public Arquivo: boolean = true;
    public LocalArquivo: string = "/var/log/wscore/";
    public Rotatividade: number = 86400;
}

class Config_WebServer {
    public Porta: uint16 = new uint16(80);
    public Porta_Https: uint16 = new uint16(443);
    public Host: string = "localhost";
    public Https_enable: boolean = true;
    public Http_redireciona_Https: boolean = true;
    // Localização do certificado SSL do servidor
    public Https_Certificado: string = "./certs/servidor.crt";
    public Https_Chave: string = "./certs/servidor.key";
    public Pasta_Arquivos_Html = "./src/Views/_web"
}

export { Modelo_Config, Config_WebServer }