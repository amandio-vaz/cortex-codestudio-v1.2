import { DeploymentCategory } from '../types';

export const DEPLOYMENT_GUIDES_DATA: Record<string, DeploymentCategory> = {
  apt: {
    displayName: 'deploymentGuidesCategoryApt',
    guides: [
      {
        title: 'Python 3 & Ferramentas Essenciais',
        description: 'Instala o Python 3, o gerenciador de pacotes PIP, o utilitário de ambientes virtuais VENV e as ferramentas de compilação essenciais.',
        useCase: 'Fundamental para qualquer ambiente de desenvolvimento Python em sistemas baseados em Debian/Ubuntu. Permite compilar pacotes, criar ambientes isolados e gerenciar dependências.',
        steps: [
          { command: 'sudo apt update && sudo apt upgrade -y', description: 'Atualiza a lista de pacotes e o sistema.' },
          { command: 'sudo apt install python3 python3-pip python3-venv build-essential libssl-dev libffi-dev python3-dev -y', description: 'Instala o Python e pacotes cruciais.' },
        ],
      },
      {
        title: 'Git',
        description: 'Instala o Git, o sistema de controle de versão distribuído mais popular do mundo.',
        useCase: 'Essencial para desenvolvimento de software, permitindo versionar código, colaborar com equipes e interagir com plataformas como GitHub e GitLab.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install git -y', description: 'Instala o pacote do Git.' },
        ],
      },
      {
        title: 'Nginx',
        description: 'Instala o Nginx, um servidor web de alto desempenho, proxy reverso, balanceador de carga e cache HTTP.',
        useCase: 'Servir sites estáticos, atuar como proxy reverso para aplicações Node.js/Python/Go, balancear carga entre múltiplos servidores e configurar cache para melhorar a performance.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install nginx -y', description: 'Instala o Nginx.' },
        ],
      },
      {
        title: 'Curl & Jq',
        description: 'Instala o `curl` para transferir dados com URLs e o `jq` para processar e manipular dados JSON na linha de comando.',
        useCase: 'Indispensável para testar APIs, baixar arquivos e processar respostas JSON em scripts. `jq` permite filtrar, mapear e transformar estruturas JSON complexas.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install curl jq -y', description: 'Instala ambos os pacotes.' },
        ],
      },
      {
        title: 'Htop',
        description: 'Instala o `htop`, um visualizador de processos interativo e monitor de sistema em tempo real.',
        useCase: 'Uma alternativa muito superior ao comando `top`. Facilita a visualização do consumo de CPU e RAM, busca de processos e gerenciamento (ex: kill) de forma interativa e colorida.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install htop -y', description: 'Instala o htop.' },
        ],
      },
      {
        title: 'Unzip',
        description: 'Instala o utilitário `unzip` para extrair arquivos de arquivos ZIP.',
        useCase: 'Necessário para descompactar arquivos com a extensão .zip, um formato de compressão muito comum.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install unzip -y', description: 'Instala o unzip.' },
        ],
      },
      {
        title: 'Tmux',
        description: 'Instala o `tmux`, um multiplexador de terminal que permite criar e gerenciar múltiplas sessões de terminal em uma única janela.',
        useCase: 'Manter processos rodando em segundo plano mesmo após desconectar do SSH, organizar o trabalho com múltiplos painéis e janelas, e compartilhar sessões de terminal.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install tmux -y', description: 'Instala o tmux.' },
        ],
      },
      {
        title: 'Neofetch',
        description: 'Instala o `neofetch`, uma ferramenta de linha de comando que exibe informações do sistema de forma elegante e visualmente agradável.',
        useCase: 'Gerar rapidamente um resumo visual do sistema, incluindo SO, kernel, uptime, hardware e temas, ideal para screenshots e verificações rápidas.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install neofetch -y', description: 'Instala o neofetch.' },
        ],
      },
      {
        title: 'UFW (Firewall)',
        description: 'Instala o `ufw` (Uncomplicated Firewall), uma interface amigável para gerenciar o `iptables`.',
        useCase: 'Configurar regras de firewall de forma simples e intuitiva para proteger o servidor, permitindo ou bloqueando portas e serviços específicos.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install ufw -y', description: 'Instala o ufw.' },
        ],
      },
      {
        title: 'Fail2ban',
        description: 'Instala o `fail2ban`, uma ferramenta de prevenção de intrusão que monitora logs e bane IPs com atividades maliciosas.',
        useCase: 'Proteger serviços como SSH contra ataques de força bruta, banindo automaticamente os IPs que falham repetidamente na autenticação.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install fail2ban -y', description: 'Instala o fail2ban.' },
        ],
      },
      {
        title: 'Tree',
        description: 'Instala o `tree`, um utilitário que lista o conteúdo de diretórios em um formato de árvore.',
        useCase: 'Visualizar rapidamente a estrutura de diretórios de um projeto de forma hierárquica e clara.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install tree -y', description: 'Instala o tree.' },
        ],
      },
      {
        title: 'Ncdu',
        description: 'Instala o `ncdu` (NCurses Disk Usage), um analisador de uso de disco com interface de console.',
        useCase: 'Identificar rapidamente quais arquivos e diretórios estão consumindo mais espaço em disco de forma interativa.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install ncdu -y', description: 'Instala o ncdu.' },
        ],
      },
      {
        title: 'Bat',
        description: 'Instala o `bat`, um clone do `cat` com syntax highlighting e integração com Git.',
        useCase: 'Visualizar arquivos de código diretamente no terminal com destaque de sintaxe, numeração de linhas e visualização de modificações do Git.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install bat -y', description: 'Instala o bat.' },
          { command: 'mkdir -p ~/.local/bin && ln -s /usr/bin/batcat ~/.local/bin/bat', description: 'Cria um link simbólico para usar `bat` em vez de `batcat`.'},
        ],
      },
      {
        title: 'Ripgrep (rg)',
        description: 'Instala o `ripgrep`, uma ferramenta de busca de texto recursiva extremamente rápida.',
        useCase: 'Uma alternativa moderna e muito mais rápida ao `grep`, especialmente para buscar em grandes bases de código, respeitando automaticamente o `.gitignore`.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install ripgrep -y', description: 'Instala o ripgrep.' },
        ],
      },
      {
        title: 'Fzf',
        description: 'Instala o `fzf`, um localizador fuzzy de linha de comando de propósito geral.',
        useCase: 'Melhorar drasticamente a produtividade no terminal, permitindo buscar arquivos, histórico de comandos (Ctrl+R) e processos de forma interativa e instantânea.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install fzf -y', description: 'Instala o fzf.' },
        ],
      },
      {
        title: 'Zsh (Z Shell)',
        description: 'Instala o `zsh`, um shell poderoso e altamente personalizável, compatível com o Bash.',
        useCase: 'Substituir o Bash por um shell com melhor autocompletar, correção de digitação, temas e um ecossistema de plugins robusto (como o Oh My Zsh).',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install zsh -y', description: 'Instala o zsh.' },
        ],
      },
      {
        title: 'Httpie',
        description: 'Instala o `httpie`, um cliente HTTP de linha de comando amigável, moderno e uma alternativa ao `curl`.',
        useCase: 'Testar e interagir com APIs de forma mais intuitiva, com saída JSON colorida, sintaxe simplificada e sessões persistentes.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install httpie -y', description: 'Instala o httpie.' },
        ],
      },
      {
        title: 'Nmap',
        description: 'Instala o `nmap` (Network Mapper), a ferramenta padrão da indústria para exploração de rede e auditoria de segurança.',
        useCase: 'Descobrir hosts em uma rede, escanear portas abertas, detectar serviços e versões, e identificar sistemas operacionais.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install nmap -y', description: 'Instala o nmap.' },
        ],
      },
      {
        title: 'Iftop',
        description: 'Instala o `iftop`, uma ferramenta que exibe o uso de largura de banda em uma interface de rede.',
        useCase: 'Monitorar o tráfego de rede em tempo real para identificar quais conexões estão consumindo mais banda.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install iftop -y', description: 'Instala o iftop.' },
        ],
      },
      {
        title: 'Iotop',
        description: 'Instala o `iotop`, um utilitário semelhante ao `top` para monitorar o uso de I/O (entrada/saída) de disco.',
        useCase: 'Identificar quais processos estão lendo ou escrevendo intensivamente no disco, ajudando a diagnosticar gargalos de performance.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install iotop -y', description: 'Instala o iotop.' },
        ],
      },
      {
        title: 'Rsync',
        description: 'Instala o `rsync`, uma ferramenta rápida e versátil para sincronizar arquivos e diretórios.',
        useCase: 'Realizar backups incrementais, espelhar diretórios entre máquinas locais ou remotas de forma eficiente, transferindo apenas as diferenças.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install rsync -y', description: 'Instala o rsync.' },
        ],
      },
      {
        title: 'Vim',
        description: 'Instala o `vim`, um editor de texto de terminal altamente configurável e poderoso.',
        useCase: 'Editar arquivos de configuração e código diretamente no servidor via SSH de forma eficiente, sem a necessidade de uma interface gráfica.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install vim -y', description: 'Instala o vim.' },
        ],
      },
      {
        title: 'Net-tools',
        description: 'Instala `net-tools`, que inclui utilitários de rede clássicos como `ifconfig`, `netstat` e `route`.',
        useCase: 'Necessário em alguns scripts legados ou para administradores acostumados com as ferramentas de rede mais antigas, embora `ip` e `ss` sejam os substitutos modernos.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install net-tools -y', description: 'Instala o net-tools.' },
        ],
      },
      {
        title: 'Traceroute',
        description: 'Instala o `traceroute`, uma ferramenta para diagnosticar rotas de rede.',
        useCase: 'Descobrir o caminho (saltos) que os pacotes de rede levam para chegar a um destino, ajudando a identificar problemas de conectividade e latência.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install traceroute -y', description: 'Instala o traceroute.' },
        ],
      },
      {
        title: 'Whois',
        description: 'Instala o `whois`, um cliente para consultar bancos de dados de registro de domínio.',
        useCase: 'Obter informações públicas sobre um nome de domínio, como proprietário, datas de registro e servidores de nomes.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install whois -y', description: 'Instala o whois.' },
        ],
      },
      {
        title: 'Midnight Commander (mc)',
        description: 'Instala o `mc`, um gerenciador de arquivos de dois painéis para o terminal.',
        useCase: 'Navegar, copiar, mover e gerenciar arquivos e diretórios no terminal de forma visual e intuitiva, similar aos antigos gerenciadores de arquivos do DOS.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install mc -y', description: 'Instala o Midnight Commander.' },
        ],
      },
      {
        title: 'Tcpdump',
        description: 'Instala o `tcpdump`, um poderoso analisador de pacotes de linha de comando.',
        useCase: 'Capturar e analisar o tráfego de rede em uma interface específica para depuração detalhada de problemas de rede e segurança.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install tcpdump -y', description: 'Instala o tcpdump.' },
        ],
      },
      {
        title: 'Nload',
        description: 'Instala o `nload`, um monitor de tráfego de rede em tempo real com gráficos no console.',
        useCase: 'Visualizar o tráfego de entrada e saída de uma interface de rede de forma clara e concisa.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install nload -y', description: 'Instala o nload.' },
        ],
      },
      {
        title: 'Speedtest-cli',
        description: 'Instala o `speedtest-cli` para testar a velocidade da conexão de internet a partir da linha de comando.',
        useCase: 'Verificar as velocidades de download e upload de um servidor diretamente do terminal, sem a necessidade de um navegador.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install speedtest-cli -y', description: 'Instala o speedtest-cli.' },
        ],
      },
      {
        title: 'Glances',
        description: 'Instala o `glances`, um monitor de sistema "tudo em um" escrito em Python.',
        useCase: 'Obter uma visão abrangente e em tempo real de CPU, memória, disco, rede e processos, tudo em uma única tela.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install glances -y', description: 'Instala o glances.' },
        ],
      },
      {
        title: 'Silver Searcher (ag)',
        description: 'Instala o `silversearcher-ag`, uma ferramenta de busca de código extremamente rápida.',
        useCase: 'Uma alternativa ao `ack` e `grep` para buscar texto em arquivos, otimizada para velocidade em grandes projetos de código.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install silversearcher-ag -y', description: 'Instala o The Silver Searcher.' },
        ],
      },
      {
        title: 'Bmon',
        description: 'Instala o `bmon`, um monitor de largura de banda de rede e coletor de estatísticas.',
        useCase: 'Monitorar e depurar redes, fornecendo várias visualizações do tráfego de rede com detalhes por interface.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install bmon -y', description: 'Instala o bmon.' },
        ],
      },
      {
        title: 'TLDR Pages',
        description: 'Instala o `tldr`, um cliente para páginas de manual simplificadas e baseadas em exemplos.',
        useCase: 'Obter exemplos práticos de como usar um comando sem ter que ler a página `man` completa. Ex: `tldr tar`.',
        steps: [
          { command: 'sudo apt update', description: 'Atualiza a lista de pacotes.' },
          { command: 'sudo apt install tldr -y', description: 'Instala o cliente tldr.' },
        ],
      },
    ],
  },
  docker: {
    displayName: 'deploymentGuidesCategoryDocker',
    subCategories: {
      core: {
        displayName: 'dockerSubCategoryCore',
        guides: [
          {
            title: 'Docker Engine & Compose (Ubuntu)',
            description: 'Instala a versão mais recente do Docker Engine e do plugin Docker Compose seguindo o método oficial do repositório Docker.',
            useCase: 'Permite criar, executar e gerenciar contêineres Docker e orquestrar aplicações multi-contêiner com arquivos `docker-compose.yml`. Essencial para ambientes de desenvolvimento e produção modernos.',
            steps: [
              { command: 'sudo apt-get update', description: 'Atualiza a lista de pacotes.'},
              { command: 'sudo apt-get install ca-certificates curl', description: 'Instala pacotes para permitir o uso de repositórios via HTTPS.'},
              { command: 'sudo install -m 0755 -d /etc/apt/keyrings', description: 'Cria o diretório para chaves GPG do APT.'},
              { command: 'sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc', description: 'Baixa a chave GPG oficial do Docker.'},
              { command: 'sudo chmod a+r /etc/apt/keyrings/docker.asc', description: 'Ajusta permissões da chave.'},
              { command: 'echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null', description: 'Adiciona o repositório do Docker ao APT.' },
              { command: 'sudo apt-get update', description: 'Atualiza a lista de pacotes com o novo repositório.'},
              { command: 'sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y', description: 'Instala os pacotes do Docker Engine e Compose.' },
              { command: 'sudo usermod -aG docker $USER', description: 'Adiciona seu usuário ao grupo "docker" para executar comandos sem sudo (requer novo login).'},
            ],
          },
          {
            title: 'Portainer CE',
            description: 'Implementa a última versão do Portainer CE, uma interface de gerenciamento de UI leve e poderosa para Docker. Este guia utiliza Docker Compose e segue as melhores práticas de rede e persistência de dados.',
            useCase: 'Gerenciar visualmente todos os seus ambientes Docker (contêineres, imagens, volumes, redes) de forma centralizada. Simplifica o deploy de aplicações, a análise de logs e o monitoramento de contêineres sem a necessidade de memorizar todos os comandos do Docker CLI.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/portainer && cd /opt/docker/portainer', description: 'Cria e acessa o diretório do projeto Portainer.' },
              { command: `cat <<'EOF' > docker-compose.yml
name: portainer-stack

services:
  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    command: -H unix:///var/run/docker.sock
    ports:
      - "8000:8000"
      - "9443:9443"
    volumes:
      - ./portainer_data:/data
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - frontend
    restart: unless-stopped

networks:
  frontend:
    driver: bridge
EOF`, description: 'Cria o arquivo docker-compose.yml para o Portainer.' },
              { command: 'docker compose up -d', description: 'Inicia o contêiner do Portainer em segundo plano.' },
              { command: 'echo "Acesse a interface em: https://SEU_IP_DO_SERVIDOR:9443"', description: 'Instrução de acesso.', isCode: false },
              { command: 'echo "No primeiro acesso, você precisará criar um usuário administrador."', description: 'Instrução de configuração inicial.', isCode: false },
            ],
          },
          {
            title: 'Caddy Web Server',
            description: 'Implementa o Caddy, um servidor web moderno e fácil de usar com HTTPS automático. Este guia mostra como usá-lo como servidor de arquivos estáticos e proxy reverso.',
            useCase: 'Servir sites estáticos ou atuar como um proxy reverso para suas aplicações backend (Node, Python, etc.). A principal vantagem do Caddy é a configuração automática de certificados SSL/TLS, simplificando enormemente a segurança.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/caddy-stack/site && cd /opt/docker/caddy-stack', description: 'Cria a estrutura de diretórios.' },
              { command: `echo "<h1>Hello from Caddy!</h1>" > ./site/index.html`, description: 'Cria um arquivo de exemplo.'},
              { command: `cat <<'EOF' > Caddyfile
# Substitua seu-dominio.com pelo seu domínio real
seu-dominio.com {
    # Habilita HTTPS e gerencia certificados automaticamente

    # Servir arquivos estáticos da pasta /usr/share/caddy
    root * /usr/share/caddy
    file_server

    # Exemplo de Proxy Reverso para outra aplicação
    # reverse_proxy /api/* minha-api:8000
}
EOF`, description: 'Cria um arquivo de configuração Caddyfile de exemplo.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  caddy:
    image: caddy:latest
    container_name: caddy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - ./site:/usr/share/caddy
      - ./caddy_data:/data
    restart: unless-stopped
EOF`, description: 'Cria o arquivo docker-compose.yml para o Caddy.' },
              { command: 'docker compose up -d', description: 'Inicia o contêiner do Caddy.' },
              { command: 'echo "Caddy rodando. Certifique-se de que seu domínio aponta para este servidor e que as portas 80/443 estão abertas."', description: 'Instrução.', isCode: false },
            ],
          },
          {
            title: 'Traefik Proxy com Let\'s Encrypt',
            description: 'Implementa o Traefik, um proxy reverso e balanceador de carga moderno, configurado para descobrir serviços Docker automaticamente e gerar certificados SSL/TLS com Let\'s Encrypt.',
            useCase: 'Gerenciar o tráfego de entrada para todos os seus serviços containerizados. O Traefik detecta novos contêineres e cria rotas para eles automaticamente, incluindo HTTPS, sem a necessidade de reiniciar ou reconfigurar o proxy.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/traefik-stack/letsencrypt && cd /opt/docker/traefik-stack', description: 'Cria a estrutura de diretórios.' },
              { command: `touch ./letsencrypt/acme.json && chmod 600 ./letsencrypt/acme.json`, description: 'Cria e protege o arquivo de armazenamento dos certificados.'},
              { command: `cat <<'EOF' > docker-compose.yml
services:
  traefik:
    image: traefik:latest
    container_name: traefik
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.httpchallenge=true"
      - "--certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.myresolver.acme.email=seu-email@dominio.com" # MUDE AQUI
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
      # Redirecionamento Global HTTP para HTTPS
      - "--entrypoints.web.http.redirections.entrypoint.to=websecure"
      - "--entrypoints.web.http.redirections.entrypoint.scheme=https"
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080" # Dashboard (acesso inseguro, use um proxy para produção)
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"
    restart: unless-stopped
    # Exemplo de como expor um serviço (o próprio dashboard do Traefik)
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.traefik-dashboard.rule=Host(\`traefik.seu-dominio.com\`) && (PathPrefix(\`/api\`) || PathPrefix(\`/dashboard\`))" # MUDE AQUI
      - "traefik.http.routers.traefik-dashboard.service=api@internal"
      - "traefik.http.routers.traefik-dashboard.tls.certresolver=myresolver"
      # Adicione um middleware de autenticação para o dashboard em produção!
      # - "traefik.http.routers.traefik-dashboard.middlewares=auth"
      # - "traefik.http.middlewares.auth.basicauth.users=user:$$apr1$$...$$..."
EOF`, description: 'Cria o arquivo docker-compose.yml para o Traefik.' },
              { command: 'docker compose up -d', description: 'Inicia o contêiner do Traefik.' },
              { command: 'echo "IMPORTANTE: Edite o docker-compose.yml e substitua seu-email@dominio.com e traefik.seu-dominio.com!"', description: 'Aviso de configuração.', isCode: false },
            ],
          },
          {
            title: 'Nginx Proxy Manager',
            description: 'Implementa a stack completa do Nginx Proxy Manager (NPM), que fornece uma interface web fácil para gerenciar hosts de proxy reverso com certificados SSL/TLS gratuitos do Let\'s Encrypt.',
            useCase: 'Ideal para quem prefere uma UI para gerenciar proxies reversos em vez de editar arquivos de configuração. Simplifica a exposição de múltiplos serviços web na mesma máquina, com gerenciamento visual de domínios e SSL.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/npm-stack && cd /opt/docker/npm-stack', description: 'Cria e acessa o diretório do projeto.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    container_name: nginx_proxy_manager
    restart: unless-stopped
    ports:
      # Essas portas são VITAIS.
      - '80:80' # Porta pública HTTP
      - '443:443' # Porta pública HTTPS
      - '81:81' # Porta de acesso à UI de admin
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
    # Dica: Crie uma rede comum para que o NPM possa encontrar seus outros contêineres pelo nome.
    # networks:
    #   - minha-rede-proxy

# networks:
#   minha-rede-proxy:
#     driver: bridge
EOF`, description: 'Cria o arquivo docker-compose.yml para o Nginx Proxy Manager.' },
              { command: 'docker compose up -d', description: 'Inicia o contêiner do NPM.' },
              { command: 'echo "Aguarde alguns minutos para a inicialização."', description: 'Instrução.', isCode: false },
              { command: 'echo "Acesse a UI de admin em: http://SEU_IP_DO_SERVIDOR:81"', description: 'Instrução de acesso.', isCode: false },
              { command: 'echo "Login padrão: Email: admin@example.com, Senha: changeme"', description: 'Credenciais padrão.', isCode: false },
            ],
          },
        ]
      },
      databases: {
        displayName: 'dockerSubCategoryDatabases',
        guides: [
          {
            title: 'PostgreSQL (Latest)',
            description: 'Implementa um servidor de banco de dados PostgreSQL robusto e de alta performance. Utiliza a imagem oficial e configura um volume para persistência de dados.',
            useCase: 'Banco de dados relacional de propósito geral para aplicações web, APIs e análise de dados. Essencial para projetos que requerem transações ACID, confiabilidade e um ecossistema SQL avançado.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/postgresql && cd /opt/docker/postgresql', description: 'Cria e acessa o diretório do projeto.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  postgres:
    image: postgres:latest
    container_name: postgres
    environment:
      POSTGRES_DB: minha_db
      POSTGRES_USER: meu_usuario
      POSTGRES_PASSWORD: SuaSenhaSuperSegura
    ports:
      - "5432:5432"
    volumes:
      - ./pg_data:/var/lib/postgresql/data
    restart: unless-stopped

networks:
  default:
    name: postgres_net
EOF`, description: 'Cria o arquivo docker-compose.yml para o PostgreSQL.' },
              { command: 'docker compose up -d', description: 'Inicia o contêiner do PostgreSQL.' },
              { command: 'echo "IMPORTANTE: Altere a senha padrão no arquivo docker-compose.yml!"', description: 'Aviso de segurança.', isCode: false },
              { command: 'echo "PostgreSQL rodando na porta 5432."', description: 'Confirmação.', isCode: false },
            ],
          },
          {
            title: 'MySQL (Latest)',
            description: 'Implementa o servidor de banco de dados MySQL, o banco de dados relacional de código aberto mais popular do mundo, com persistência de dados.',
            useCase: 'Backend de banco de dados para uma vasta gama de aplicações, especialmente sistemas de gerenciamento de conteúdo como WordPress, Joomla e aplicações web tradicionais.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/mysql && cd /opt/docker/mysql', description: 'Cria e acessa o diretório do projeto.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  mysql:
    image: mysql:latest
    container_name: mysql
    environment:
      MYSQL_ROOT_PASSWORD: SuaSenhaRootSuperSegura
      MYSQL_DATABASE: minha_db
      MYSQL_USER: meu_usuario
      MYSQL_PASSWORD: SuaSenhaSuperSegura
    ports:
      - "3306:3306"
    volumes:
      - ./mysql_data:/var/lib/mysql
    restart: unless-stopped

networks:
  default:
    name: mysql_net
EOF`, description: 'Cria o arquivo docker-compose.yml para o MySQL.' },
              { command: 'docker compose up -d', description: 'Inicia o contêiner do MySQL.' },
              { command: 'echo "IMPORTANTE: Altere as senhas padrão no arquivo docker-compose.yml!"', description: 'Aviso de segurança.', isCode: false },
              { command: 'echo "MySQL rodando na porta 3306."', description: 'Confirmação.', isCode: false },
            ],
          },
          {
            title: 'Redis',
            description: 'Implementa um servidor Redis, um armazenamento de estrutura de dados em memória de código aberto, usado como banco de dados, cache e message broker.',
            useCase: 'Caching de alta velocidade para aliviar a carga em bancos de dados, gerenciamento de sessões de usuário, filas de tarefas (background jobs) e comunicação em tempo real (Pub/Sub).',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/redis && cd /opt/docker/redis', description: 'Cria e acessa o diretório do projeto.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  redis:
    image: redis:latest
    container_name: redis
    command: redis-server --requirepass SuaSenhaSuperSegura
    ports:
      - "6379:6379"
    volumes:
      - ./redis_data:/data
    restart: unless-stopped

networks:
  default:
    name: redis_net
EOF`, description: 'Cria o arquivo docker-compose.yml para o Redis.' },
              { command: 'docker compose up -d', description: 'Inicia o contêiner do Redis.' },
              { command: 'echo "IMPORTANTE: Altere a senha padrão no arquivo docker-compose.yml!"', description: 'Aviso de segurança.', isCode: false },
              { command: 'echo "Redis rodando na porta 6379."', description: 'Confirmação.', isCode: false },
            ],
          },
          {
            title: 'ClickHouse',
            description: 'Implementa um servidor de banco de dados ClickHouse, um sistema de gerenciamento de banco de dados colunar de código aberto para processamento analítico online (OLAP).',
            useCase: 'Análise de dados em tempo real, dashboards, business intelligence e armazenamento de grandes volumes de dados de log ou eventos. Extremamente rápido para consultas analíticas complexas.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/clickhouse && cd /opt/docker/clickhouse', description: 'Cria e acessa o diretório do projeto.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  clickhouse-server:
    image: clickhouse/clickhouse-server:latest
    container_name: clickhouse_server
    ports:
      - "8123:8123" # HTTP
      - "9000:9000" # TCP
    volumes:
      - ./clickhouse_data:/var/lib/clickhouse
      - ./clickhouse_logs:/var/log/clickhouse-server
    environment:
      - CLICKHOUSE_PASSWORD=SuaSenhaSuperSegura
    ulimits:
      nproc: 65535
      nofile:
        soft: 262144
        hard: 262144
    restart: unless-stopped
EOF`, description: 'Cria o arquivo docker-compose.yml para o ClickHouse.' },
              { command: 'docker compose up -d', description: 'Inicia o contêiner do ClickHouse.' },
              { command: 'echo "IMPORTANTE: Altere a senha padrão no arquivo docker-compose.yml!"', description: 'Aviso de segurança.', isCode: false },
              { command: 'echo "ClickHouse rodando. Porta HTTP: 8123, Porta TCP: 9000."', description: 'Confirmação.', isCode: false },
            ],
          },
          {
            title: 'MongoDB',
            description: 'Implementa um servidor MongoDB, um banco de dados NoSQL orientado a documentos, projetado para escalabilidade e desenvolvimento ágil.',
            useCase: 'Armazenamento de dados flexíveis e semi-estruturados para aplicações web modernas, catálogos de produtos, perfis de usuário, e qualquer cenário onde um esquema rígido não é ideal.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/mongodb && cd /opt/docker/mongodb', description: 'Cria e acessa o diretório do projeto.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  mongodb:
    image: mongo:latest
    container_name: mongodb
    ports:
      - "27017:27017"
    volumes:
      - ./mongo_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=SuaSenhaSuperSegura
    restart: unless-stopped

networks:
  default:
    name: mongo_net
EOF`, description: 'Cria o arquivo docker-compose.yml para o MongoDB.' },
              { command: 'docker compose up -d', description: 'Inicia o contêiner do MongoDB.' },
              { command: 'echo "IMPORTANTE: Altere a senha padrão no arquivo docker-compose.yml!"', description: 'Aviso de segurança.', isCode: false },
              { command: 'echo "MongoDB rodando na porta 27017."', description: 'Confirmação.', isCode: false },
            ],
          },
          {
            title: 'Milvus (Standalone)',
            description: 'Implementa o Milvus em modo standalone, o banco de dados de vetores de código aberto mais popular, projetado para aplicações de IA e busca por similaridade.',
            useCase: 'Busca de imagens/vídeos por similaridade, sistemas de recomendação, chatbots, análise de documentos e qualquer aplicação que necessite armazenar e consultar embeddings de vetores de alta dimensão em larga escala.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/milvus-stack && cd /opt/docker/milvus-stack', description: 'Cria e acessa o diretório do projeto.' },
              { command: `wget https://github.com/milvus-io/milvus/releases/download/v2.4.1/milvus-standalone-docker-compose.yml -O docker-compose.yml`, description: 'Baixa o arquivo docker-compose.yml oficial do Milvus Standalone.'},
              { command: `echo "O arquivo docker-compose.yml oficial foi baixado. Editando para garantir persistência..."`, description: 'Mensagem informativa.', isCode: false },
              { command: `sed -i'' -e 's|\\/tmp\\/milvus\\/db|.\\/milvus_db|g' -e 's|\\/tmp\\/milvus\\/configs|.\\/milvus_configs|g' -e 's|\\/tmp\\/milvus\\/logs|.\\/milvus_logs|g' -e 's|\\/tmp\\/minio_data|.\\/minio_data|g' -e 's|\\/tmp\\/etcd_data|.\\/etcd_data|g' docker-compose.yml`, description: 'Ajusta os volumes no compose para usar o diretório local e garantir persistência.'},
              { command: 'docker compose up -d', description: 'Inicia a stack do Milvus (pode levar alguns minutos).' },
              { command: 'echo "Milvus Standalone está iniciando. Aguarde alguns minutos para todos os serviços ficarem saudáveis."', description: 'Aviso de inicialização.', isCode: false },
              { command: 'echo "Portas expostas: gRPC (19530), HTTP (9091), MinIO (9000), Etcd (2379). "', description: 'Informação das portas.', isCode: false },
            ],
          },
        ]
      },
      observability: {
        displayName: 'dockerSubCategoryObservability',
        guides: [
          {
            title: 'Prometheus Stack (Prometheus, Alertmanager, Node Exporter)',
            description: 'Implementa uma stack de monitoramento completa com Prometheus para coleta de métricas, Alertmanager para gerenciamento de alertas e Node Exporter para expor métricas do host.',
            useCase: 'Monitoramento proativo de servidores e aplicações. Coleta métricas de saúde do sistema (CPU, memória, disco), define regras de alerta para condições anormais (ex: disco cheio) e envia notificações via Alertmanager.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/prometheus-stack/{prometheus,alertmanager} && cd /opt/docker/prometheus-stack', description: 'Cria a estrutura de diretórios.' },
              { command: `cat <<'EOF' > ./prometheus/prometheus.yml
global:
  scrape_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
      - targets: ['alertmanager:9093']

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
  - job_name: 'node_exporter'
    static_configs:
      - targets: ['node-exporter:9100']
EOF`, description: 'Cria o arquivo de configuração do Prometheus.' },
              { command: `cat <<'EOF' > ./alertmanager/config.yml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'null'

receivers:
  - name: 'null'
EOF`, description: 'Cria um arquivo de configuração básico do Alertmanager.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./prometheus_data:/prometheus
    command: --config.file=/etc/prometheus/prometheus.yml
    networks:
      - monitoring-net
    restart: unless-stopped

  alertmanager:
    image: prom/alertmanager:latest
    container_name: alertmanager
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager/config.yml:/config/alertmanager.yml
    command: --config.file=/config/alertmanager.yml
    networks:
      - monitoring-net
    restart: unless-stopped

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node_exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--path.rootfs=/rootfs'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    networks:
      - monitoring-net
    restart: unless-stopped

networks:
  monitoring-net:
    driver: bridge
EOF`, description: 'Cria o docker-compose.yml para a stack de monitoramento.' },
              { command: 'docker compose up -d', description: 'Inicia os contêineres.' },
              { command: 'echo "Prometheus rodando na porta 9090. Alertmanager na 9093. Node Exporter na 9100."', description: 'Instrução de acesso.', isCode: false },
            ],
          },
          {
            title: 'Stack Zabbix Completa com TimescaleDB',
            description: 'Implementa uma stack completa de monitoramento Zabbix, incluindo Zabbix Server, Frontend Nginx, Agent 2 e um banco de dados PostgreSQL otimizado com a extensão TimescaleDB para dados de série temporal.',
            useCase: 'Monitoramento de infraestrutura de TI em larga escala. Ideal para coletar, armazenar e analisar métricas de servidores, redes e aplicações com alta performance, aproveitando o TimescaleDB para otimizar o armazenamento de dados históricos.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/zabbix-stack && cd /opt/docker/zabbix-stack', description: 'Cria e acessa o diretório do projeto Zabbix.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  postgres-server:
    image: timescale/timescaledb-ha:pg14-ts2.8-latest
    container_name: zabbix_postgres
    volumes:
      - ./zabbix_db_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=zabbix
      - POSTGRES_USER=zabbix
      - POSTGRES_PASSWORD=SuaSenhaSuperSeguraAqui
      - TIMESCALEDB_TELEMETRY=off
    networks:
      - zabbix-net
    restart: unless-stopped

  zabbix-server:
    image: zabbix/zabbix-server-pgsql:latest
    container_name: zabbix_server
    ports:
      - "10051:10051"
    volumes:
      - /etc/localtime:/etc/localtime:ro
    environment:
      - DB_SERVER_HOST=postgres-server
      - POSTGRES_DB=zabbix
      - POSTGRES_USER=zabbix
      - POSTGRES_PASSWORD=SuaSenhaSuperSeguraAqui
    depends_on:
      - postgres-server
    networks:
      - zabbix-net
    restart: unless-stopped

  zabbix-frontend:
    image: zabbix/zabbix-web-nginx-pgsql:latest
    container_name: zabbix_frontend
    ports:
      - "8443:8443"
      - "8080:8080"
    environment:
      - ZBX_SERVER_HOST=zabbix-server
      - DB_SERVER_HOST=postgres-server
      - POSTGRES_DB=zabbix
      - POSTGRES_USER=zabbix
      - POSTGRES_PASSWORD=SuaSenhaSuperSeguraAqui
    depends_on:
      - zabbix-server
    networks:
      - zabbix-net
    restart: unless-stopped

  zabbix-agent2:
    image: zabbix/zabbix-agent2:latest
    container_name: zabbix_agent
    privileged: true
    pid: "host"
    volumes:
      - /:/host/root:ro
      - /sys:/host/sys:ro
      - /dev/disk:/host/dev/disk:ro
    environment:
      - ZBX_SERVER_HOST=zabbix-server
    depends_on:
      - zabbix-server
      - zabbix-frontend
    networks:
      - zabbix-net
    restart: unless-stopped

networks:
  zabbix-net:
    driver: bridge
EOF`, description: 'Cria o arquivo docker-compose.yml para a stack Zabbix.' },
              { command: 'docker compose up -d', description: 'Inicia os contêineres da stack Zabbix.' },
              { command: 'echo "IMPORTANTE: Altere a senha padrão do PostgreSQL no arquivo docker-compose.yml!"', description: 'Aviso de segurança.', isCode: false },
              { command: 'echo "Aguarde alguns minutos para a inicialização completa dos serviços."', description: 'Instrução.', isCode: false },
              { command: 'echo "Acesse a interface em: http://SEU_IP_DO_SERVIDOR:8080 ou https://SEU_IP_DO_SERVIDOR:8443"', description: 'Instrução de acesso.', isCode: false },
              { command: 'echo "Login padrão: Admin / zabbix"', description: 'Credenciais padrão.', isCode: false },
            ],
          },
          {
            title: 'Stack de Logs com Loki e Vector',
            description: 'Implementa uma stack de agregação de logs moderna com Grafana Loki para armazenamento e Vector como um agente de alta performance. O Vector é configurado para coletar logs de outros contêineres Docker e receber dados via OpenTelemetry.',
            useCase: 'Centralizar e analisar logs de toda a sua infraestrutura de contêineres. Vector coleta os logs eficientemente, que são armazenados e indexados pelo Loki, permitindo buscas rápidas e integração com o Grafana para visualização. Ideal para depuração e monitoramento de sistemas distribuídos.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/loki-stack/vector && sudo mkdir -p /opt/docker/loki-stack/loki && cd /opt/docker/loki-stack', description: 'Cria a estrutura de diretórios para a stack.' },
              { command: `cat <<'EOF' > ./vector/vector.toml
# Fontes de dados (inputs)
[sources.docker_logs]
  type = "docker_logs"
  include_labels = true
  
[sources.opentelemetry]
  type = "opentelemetry"
  address = "0.0.0.0:4317" # Porta gRPC padrão do OTLP
  
# Destinos (sinks)
[sinks.loki]
  type = "loki"
  inputs = ["docker_logs", "opentelemetry"]
  endpoint = "http://loki:3100"
  encoding.codec = "json"
  # As labels são usadas para indexação no Loki
  labels = { source = "{{ source_type }}", container_name = "{{ label.com\\.docker\\.compose\\.service }}" }
EOF`, description: 'Cria o arquivo de configuração do Vector (vector.toml).' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  loki:
    image: grafana/loki:latest
    container_name: loki
    ports:
      - "3100:3100"
    volumes:
      - ./loki:/mnt/config
      - ./loki_data:/loki
    command: -config.file=/mnt/config/loki-config.yaml
    networks:
      - loki-net
    restart: unless-stopped

  vector:
    image: timberio/vector:latest-alpine
    container_name: vector
    ports:
      - "4317:4317" # Expõe a porta OTLP
    volumes:
      - ./vector/vector.toml:/etc/vector/vector.toml:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /var/lib/docker/containers/:/var/lib/docker/containers:ro
    depends_on:
      - loki
    networks:
      - loki-net
    restart: unless-stopped

networks:
  loki-net:
    driver: bridge
EOF`, description: 'Cria o arquivo docker-compose.yml para a stack.' },
              { command: `cat <<'EOF' > ./loki/loki-config.yaml
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    address: 127.0.0.1
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1
    final_sleep: 0s
  chunk_idle_period: 5m
  chunk_retain_period: 30s
  max_transfer_retries: 0

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

storage_config:
  boltdb_shipper:
    active_index_directory: /loki/boltdb-shipper-active
    cache_location: /loki/boltdb-shipper-cache
    cache_ttl: 24h
    shared_store: filesystem
  filesystem:
    directory: /loki/chunks

compactor:
  working_directory: /loki/boltdb-shipper-compactor
  shared_store: filesystem

limits_config:
  reject_old_samples: true
  reject_old_samples_max_age: 168h

chunk_store_config:
  max_look_back_period: 0s

table_manager:
  retention_deletes_enabled: false
  retention_period: 0s
EOF`, description: 'Cria um arquivo de configuração básico para o Loki.' },
              { command: 'docker compose up -d', description: 'Inicia os contêineres da stack de logs.' },
              { command: 'echo "Stack Loki + Vector rodando!"', description: 'Confirmação.', isCode: false },
              { command: 'echo "Loki está disponível na porta 3100. Adicione como fonte de dados no seu Grafana."', description: 'Instrução.', isCode: false },
              { command: 'echo "Vector está coletando logs de todos os contêineres e recebendo dados OTLP na porta 4317."', description: 'Instrução.', isCode: false },
            ],
          },
          {
            title: 'Stack OpenTelemetry Collector',
            description: 'Implementa um OpenTelemetry (OTel) Collector configurado para ser um pipeline unificado para dados de telemetria. Ele pode receber logs, métricas e traces de diversas fontes e exportá-los para diferentes backends.',
            useCase: 'Centralizar a coleta de observabilidade em sistemas distribuídos. O coletor atua como um ponto único para receber dados de agentes (FluentBit, Prometheus exporters, OTel SDKs), processá-los (ex: adicionar metadados, filtrar) e encaminhá-los para sistemas de análise como Jaeger, Loki ou Prometheus, simplificando a instrumentação.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/opentelemetry-stack && cd /opt/docker/opentelemetry-stack', description: 'Cria e acessa o diretório do projeto.' },
              { command: `cat <<'EOF' > otel-collector-config.yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:
  fluentforward:
    endpoint: 0.0.0.0:24224
  prometheus:
    config:
      scrape_configs:
        - job_name: 'otel-collector'
          scrape_interval: 10s
          static_configs:
            - targets: ['localhost:8888']
  jaeger:
    protocols:
      grpc:
      thrift_http:
  zipkin:

processors:
  batch:

exporters:
  logging:
    loglevel: debug

service:
  pipelines:
    traces:
      receivers: [otlp, jaeger, zipkin]
      processors: [batch]
      exporters: [logging]
    metrics:
      receivers: [otlp, prometheus]
      processors: [batch]
      exporters: [logging]
    logs:
      receivers: [otlp, fluentforward]
      processors: [batch]
      exporters: [logging]
EOF`, description: 'Cria o arquivo de configuração do OTel Collector.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  otel-collector:
    image: otel/opentelemetry-collector-contrib:latest
    container_name: otel_collector
    command: [--config=/etc/otelcol-contrib/config.yaml]
    volumes:
      - ./otel-collector-config.yaml:/etc/otelcol-contrib/config.yaml
    ports:
      # Traces
      - "4317:4317"    # OTLP gRPC
      - "4318:4318"    # OTLP HTTP
      - "14250:14250"  # Jaeger gRPC
      - "14268:14268"  # Jaeger Thrift HTTP
      - "9411:9411"    # Zipkin
      # Metrics
      - "8889:8889"    # Prometheus
      # Logs
      - "24224:24224"  # FluentForward
    networks:
      - observability-net
    restart: unless-stopped

networks:
  observability-net:
    driver: bridge
EOF`, description: 'Cria o arquivo docker-compose.yml para o OTel Collector.' },
              { command: 'docker compose up -d', description: 'Inicia o contêiner do OTel Collector.' },
              { command: 'echo "OpenTelemetry Collector está rodando!"', description: 'Confirmação.', isCode: false },
              { command: 'echo "Ele está configurado para receber dados em várias portas (OTLP, Jaeger, Prometheus, etc.)"', description: 'Instrução.', isCode: false },
              { command: 'echo "Os dados recebidos serão impressos nos logs do contêiner: docker logs -f otel_collector"', description: 'Instrução de depuração.', isCode: false },
            ],
          },
          {
            title: 'Grafana Alloy',
            description: 'Implementa o Grafana Alloy, um coletor OpenTelemetry com a sintaxe de configuração do Grafana Agent. Configurado para receber OTLP, fazer scrape de Prometheus e encaminhar para Loki e Tempo.',
            useCase: 'Um pipeline de telemetria unificado. Use-o como um agente para coletar logs, métricas e traces de suas aplicações e infraestrutura e enviá-los para seus backends de observabilidade de forma padronizada.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/alloy-stack/config && cd /opt/docker/alloy-stack', description: 'Cria a estrutura de diretórios para o Alloy.' },
              { command: `cat <<'EOF' > ./config/alloy-config.river
prometheus.scrape "self" {
  targets = [{"__address__" = "localhost:12345"}]
  forward_to = [prometheus.remote_write.local.receiver]
}

prometheus.remote_write "local" {
  endpoint {
    url = "http://prometheus:9090/api/v1/write" # Alvo de métricas
  }
}

loki.write "default" {
  endpoint {
    url = "http://loki:3100/loki/api/v1/push" # Alvo de logs
  }
}

otelcol.receiver.otlp "default" {
  grpc {}
  http {}
  output {
    traces  = [otelcol.exporter.otlp.tempo.input]
    logs    = [loki.write.default.receiver]
  }
}

otelcol.exporter.otlp "tempo" {
  client {
    endpoint = "tempo:4317" # Alvo de traces
    tls {
      insecure = true
    }
  }
}
EOF`, description: 'Cria o arquivo de configuração do Alloy (formato River).' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  alloy:
    image: grafana/alloy:latest
    container_name: alloy
    ports:
      - "12345:12345" # Prometheus metrics endpoint
      - "4317:4317"   # OTLP gRPC
      - "4318:4318"   # OTLP HTTP
    volumes:
      - ./config/alloy-config.river:/etc/alloy/config.river
    command:
      - "run"
      - "/etc/alloy/config.river"
    networks:
      - monitoring-net
    restart: unless-stopped

networks:
  monitoring-net:
    driver: bridge
EOF`, description: 'Cria o arquivo docker-compose.yml para o Alloy.' },
              { command: 'docker compose up -d', description: 'Inicia o contêiner do Alloy.' },
              { command: 'echo "Grafana Alloy rodando. Ele está recebendo OTLP e encaminhando para Loki e Tempo."', description: 'Confirmação.', isCode: false },
            ],
          },
          {
            title: 'Grafana Tempo com Minio',
            description: 'Implementa o Grafana Tempo, um backend de tracing distribuído, com o Minio como armazenamento de objetos S3 compatível para persistência de traces a longo prazo.',
            useCase: 'Armazenar e consultar grandes volumes de dados de tracing de aplicações instrumentadas com OpenTelemetry. O Minio fornece uma solução de armazenamento local e econômica para os traces.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/tempo-stack/config && cd /opt/docker/tempo-stack', description: 'Cria a estrutura de diretórios para o Tempo.' },
              { command: `cat <<'EOF' > ./config/tempo.yml
server:
  http_listen_port: 3200

distributor:
  receivers:
    otlp:
      protocols:
        grpc:
        http:

storage:
  trace:
    backend: s3
    s3:
      bucket: tempo-traces
      endpoint: minio:9000
      access_key: minioadmin
      secret_key: minioadmin
      insecure: true

compactor:
  compaction:
    compaction_window: 1h
    max_block_bytes: 100_000_000

ingester:
  max_block_duration: 5m
EOF`, description: 'Cria o arquivo de configuração para o Tempo.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  tempo:
    image: grafana/tempo:latest
    container_name: tempo
    command: ["-config.file=/etc/tempo/tempo.yml"]
    ports:
      - "3200:3200"   # tempo
      - "4317:4317"   # otlp grpc
      - "4318:4318"   # otlp http
    volumes:
      - ./config/tempo.yml:/etc/tempo/tempo.yml
      - ./tempo_data:/tmp/tempo
    networks:
      - monitoring-net
    restart: unless-stopped

  minio:
    image: minio/minio:latest
    container_name: minio
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=minioadmin
    volumes:
      - ./minio_data:/data
    networks:
      - monitoring-net
    restart: unless-stopped

networks:
  monitoring-net:
    driver: bridge
EOF`, description: 'Cria o docker-compose.yml para Tempo e Minio.' },
              { command: 'docker compose up -d', description: 'Inicia os contêineres.' },
              { command: 'echo "Tempo e Minio rodando. UI do Minio na porta 9001."', description: 'Instrução de acesso.', isCode: false },
            ],
          },
          {
            title: 'Jaeger (All-in-One)',
            description: 'Implementa a imagem "all-in-one" do Jaeger, que inclui UI, coletor, e armazenamento em memória. É a forma mais rápida de começar a usar o Jaeger para tracing distribuído.',
            useCase: 'Ideal para ambientes de desenvolvimento e teste para visualizar traces de aplicações. Permite analisar a latência de requisições, entender o fluxo de uma operação em múltiplos serviços e depurar problemas de performance.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/jaeger-stack && cd /opt/docker/jaeger-stack', description: 'Cria e acessa o diretório do projeto Jaeger.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  jaeger:
    image: jaegertracing/all-in-one:latest
    container_name: jaeger
    ports:
      - "16686:16686" # Jaeger UI
      - "4317:4317"   # OTLP gRPC
      - "4318:4318"   # OTLP HTTP
    networks:
      - monitoring-net
    restart: unless-stopped

networks:
  monitoring-net:
    driver: bridge
EOF`, description: 'Cria o arquivo docker-compose.yml para o Jaeger.' },
              { command: 'docker compose up -d', description: 'Inicia o contêiner do Jaeger.' },
              { command: 'echo "Jaeger rodando. Acesse a UI em http://SEU_IP_DO_SERVIDOR:16686"', description: 'Instrução de acesso.', isCode: false },
            ],
          },
          {
            title: 'Grafana OSS (com Provisioning)',
            description: 'Implementa o Grafana OSS com datasources para Prometheus, Loki, Tempo e Jaeger pré-configurados via provisioning.',
            useCase: 'Plataforma central de visualização para uma stack de observabilidade completa. Este guia prepara o Grafana para se conectar instantaneamente a backends de métricas, logs e traces, acelerando a criação de dashboards.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/grafana-stack/provisioning/datasources && cd /opt/docker/grafana-stack', description: 'Cria a estrutura de diretórios para o Grafana.' },
              { command: `cat <<'EOF' > ./provisioning/datasources/datasources.yml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090 # Assumes prometheus is on the same Docker network
    isDefault: true
  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100 # Assumes loki is on the same Docker network
  - name: Tempo
    type: tempo
    access: proxy
    url: http://tempo:3200 # Assumes tempo is on the same Docker network
  - name: Jaeger
    type: jaeger
    access: proxy
    url: http://jaeger:16686 # Assumes jaeger is on the same Docker network
EOF`, description: 'Cria o arquivo de provisioning de datasources.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  grafana:
    image: grafana/grafana-oss:latest
    container_name: grafana
    ports:
      - "3000:3000"
    volumes:
      - ./grafana_data:/var/lib/grafana
      - ./provisioning:/etc/grafana/provisioning
    networks:
      - monitoring-net # Use a common network for all observability tools
    restart: unless-stopped

networks:
  monitoring-net:
    driver: bridge
EOF`, description: 'Cria o arquivo docker-compose.yml para o Grafana.' },
              { command: 'docker compose up -d', description: 'Inicia o contêiner do Grafana.' },
              { command: 'echo "Grafana rodando na porta 3000. Login padrão: admin/admin"', description: 'Instrução de acesso.', isCode: false },
              { command: 'echo "Certifique-se que os outros serviços (Prometheus, Loki, etc.) estão na mesma rede Docker (monitoring-net)."', description: 'Aviso de rede.', isCode: false },
            ],
          },
        ]
      },
      apps: {
        displayName: 'dockerSubCategoryApps',
        guides: [
          {
            title: 'n8n (Workflow Automation)',
            description: 'Implementa o n8n, uma ferramenta de automação de fluxo de trabalho de código aberto que permite conectar diferentes aplicativos e serviços para criar automações complexas.',
            useCase: 'Alternativa auto-hospedada a serviços como Zapier ou Make. Use para automatizar tarefas repetitivas, sincronizar dados entre APIs, criar chatbots e integrar centenas de serviços sem escrever código.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/n8n && cd /opt/docker/n8n', description: 'Cria e acessa o diretório do projeto.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    ports:
      - "5678:5678"
    volumes:
      - ./n8n_data:/home/node/.n8n
    environment:
      - TZ=America/Sao_Paulo
    restart: unless-stopped
EOF`, description: 'Cria o arquivo docker-compose.yml para o n8n.' },
              { command: 'docker compose up -d', description: 'Inicia o contêiner do n8n.' },
              { command: 'echo "n8n rodando. Acesse a interface em http://SEU_IP_DO_SERVIDOR:5678"', description: 'Instrução de acesso.', isCode: false },
            ],
          },
          {
            title: 'GLPI com MariaDB',
            description: 'Implementa uma stack completa do GLPI, uma poderosa solução de código aberto para gerenciamento de ativos de TI (ITSM) e service desk, utilizando MariaDB como banco de dados.',
            useCase: 'Gerenciar inventário de hardware e software, licenças, contratos, central de serviços (help desk), base de conhecimento e relatórios para o departamento de TI.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/glpi-stack/{mariadb_data,glpi_data} && cd /opt/docker/glpi-stack', description: 'Cria a estrutura de diretórios.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  mariadb:
    image: mariadb:latest
    container_name: glpi_db
    environment:
      MYSQL_ROOT_PASSWORD: SuaSenhaRootSuperSegura
      MYSQL_DATABASE: glpidb
      MYSQL_USER: glpiuser
      MYSQL_PASSWORD: SuaSenhaGlpiSuperSegura
    volumes:
      - ./mariadb_data:/var/lib/mysql
    networks:
      - glpi-net
    restart: unless-stopped

  glpi:
    image: diouxx/glpi:latest
    container_name: glpi_app
    ports:
      - "8080:80"
    environment:
      - DB_HOST=mariadb
      - DB_DATABASE=glpidb
      - DB_USER=glpiuser
      - DB_PASSWORD=SuaSenhaGlpiSuperSegura
      - TZ=America/Sao_Paulo
    volumes:
      - ./glpi_data:/var/www/html/glpi/files
    depends_on:
      - mariadb
    networks:
      - glpi-net
    restart: unless-stopped

networks:
  glpi-net:
    driver: bridge
EOF`, description: 'Cria o arquivo docker-compose.yml para a stack GLPI.' },
              { command: 'docker compose up -d', description: 'Inicia os contêineres.' },
              { command: 'echo "IMPORTANTE: Altere as senhas padrão no arquivo docker-compose.yml!"', description: 'Aviso de segurança.', isCode: false },
              { command: 'echo "Aguarde a inicialização. Acesse o GLPI em http://SEU_IP_DO_SERVIDOR:8080"', description: 'Instrução de acesso.', isCode: false },
            ],
          },
          {
            title: 'FastAPI Application (com Dockerfile)',
            description: 'Cria e containeriza uma aplicação web básica usando FastAPI, um framework Python moderno de alta performance, servida com Uvicorn.',
            useCase: 'Ponto de partida para desenvolver e implantar APIs rápidas e escaláveis. A containerização garante que a aplicação funcione de forma consistente em qualquer ambiente Docker.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/fastapi-app/app && cd /opt/docker/fastapi-app', description: 'Cria a estrutura do projeto.' },
              { command: `cat <<'EOF' > ./app/main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}
EOF`, description: 'Cria o arquivo principal da aplicação FastAPI.' },
              { command: `echo "fastapi" > requirements.txt`, description: 'Cria o arquivo de dependências.'},
              { command: `echo "uvicorn[standard]" >> requirements.txt`, description: 'Adiciona o servidor Uvicorn às dependências.'},
              { command: `cat <<'EOF' > Dockerfile
FROM python:3.11-slim

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
EOF`, description: 'Cria o Dockerfile para containerizar a aplicação.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  web:
    build: .
    container_name: fastapi_app
    ports:
      - "8000:80"
    restart: unless-stopped
EOF`, description: 'Cria o arquivo docker-compose.yml para construir e rodar a imagem.' },
              { command: 'docker compose up -d --build', description: 'Constrói a imagem e inicia o contêiner.' },
              { command: 'echo "Aplicação FastAPI rodando. Acesse em http://SEU_IP_DO_SERVIDOR:8000"', description: 'Instrução de acesso.', isCode: false },
            ],
          },
        ]
      },
      backup_s3: {
        displayName: 'dockerSubCategoryBackupS3',
        guides: [
          {
            title: 'MinIO S3 Object Storage',
            description: 'Implementa um servidor de armazenamento de objetos de alta performance, compatível com a API S3 da Amazon. Este guia cria um ambiente robusto com persistência de dados e acesso seguro.',
            useCase: 'Armazenamento de backups, artefatos de build, mídia estática para aplicações web, data lakes e qualquer cenário que exija um armazenamento de objetos escalável e auto-hospedado. É a base para muitas ferramentas de nuvem nativa.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/minio && cd /opt/docker/minio', description: 'Cria e acessa o diretório do projeto MinIO.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  minio:
    image: minio/minio:latest
    container_name: minio
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000" # API Port
      - "9001:9001" # Console Port
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=SuaSenhaSuperSegura
    volumes:
      - ./minio_data:/data
    networks:
      - s3-net
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

networks:
  s3-net:
    driver: bridge
EOF`, description: 'Cria o arquivo docker-compose.yml para o MinIO.' },
              { command: 'docker compose up -d', description: 'Inicia o contêiner do MinIO em segundo plano.' },
              { command: 'echo "IMPORTANTE: Altere a senha padrão no arquivo docker-compose.yml!"', description: 'Aviso de segurança.', isCode: false },
              { command: 'echo "Acesse a console do MinIO em: http://SEU_IP_DO_SERVIDOR:9001"', description: 'Instrução de acesso.', isCode: false },
              { command: 'echo "Use as credenciais definidas para fazer login e criar seus buckets."', description: 'Instrução de uso.', isCode: false },
            ],
          },
          {
            title: 'Kopia Backup com MinIO S3',
            description: 'Implementa o Kopia, uma ferramenta de backup moderna, rápida e segura, junto com um servidor MinIO para servir como backend de armazenamento S3. Esta stack fornece uma solução de backup completa e auto-hospedada.',
            useCase: 'Realizar backups criptografados, deduplicados e versionados de seus arquivos, diretórios ou sistemas para um armazenamento de objetos S3 privado. Ideal para proteger dados importantes com controle total sobre o armazenamento.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/kopia-stack/{kopia_config,kopia_cache,kopia_logs,minio_data} && cd /opt/docker/kopia-stack', description: 'Cria a estrutura de diretórios.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  minio:
    image: minio/minio:latest
    container_name: kopia_minio_storage
    command: server /data --console-address ":9001"
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=SuaSenhaSuperSegura
    volumes:
      - ./minio_data:/data
    networks:
      - kopia-net
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  kopia:
    image: kopia/kopia:latest
    container_name: kopia_ui
    ports:
      - "51515:51515" # Kopia UI Port
    volumes:
      - ./kopia_config:/app/config
      - ./kopia_cache:/app/cache
      - ./kopia_logs:/app/logs
      # Monte os diretórios que você deseja fazer backup
      - /path/para/seus/dados:/dados-para-backup:ro
    environment:
      - KOPIA_PASSWORD=SuaSenhaMestraParaOKopia
      - TZ=America/Sao_Paulo
    depends_on:
      minio:
        condition: service_healthy
    networks:
      - kopia-net
    restart: unless-stopped

networks:
  kopia-net:
    driver: bridge
EOF`, description: 'Cria o arquivo docker-compose.yml para Kopia e MinIO.' },
              { command: 'docker compose up -d', description: 'Inicia a stack de backup.' },
              { command: 'echo "Aguarde o MinIO iniciar. Acesse a UI do Kopia em http://SEU_IP_DO_SERVIDOR:51515"', description: 'Instrução de acesso.', isCode: false },
              { command: `echo "No primeiro acesso, Kopia pedirá para configurar um repositório. Use as seguintes configurações:"`, description: 'Instrução de configuração.', isCode: false },
              { command: `echo "- Storage Type: Amazon S3"`, description: 'Tipo de armazenamento.', isCode: false },
              { command: `echo "- Bucket: (Crie um no MinIO, ex: 'kopia-backups') "`, description: 'Bucket.', isCode: false },
              { command: `echo "- Endpoint: http://kopia_minio_storage:9000"`, description: 'Endpoint do MinIO (use o nome do serviço).', isCode: false },
              { command: `echo "- Access Key ID: minioadmin"`, description: 'Credencial de acesso.', isCode: false },
              { command: `echo "- Secret Access Key: SuaSenhaSuperSegura"`, description: 'Credencial de acesso.', isCode: false },
              { command: `echo "- Marque 'Disable TLS verification' pois estamos usando HTTP internamente."`, description: 'Configuração de TLS.', isCode: false },
              { command: 'echo "IMPORTANTE: Altere as senhas e o caminho do volume de backup no docker-compose.yml!"', description: 'Aviso de segurança.', isCode: false },
            ],
          },
        ]
      },
      os: {
        displayName: 'dockerSubCategoryOS',
        guides: [
          {
            title: 'Ubuntu Server (Latest LTS)',
            description: 'Inicia um contêiner com a versão mais recente de suporte a longo prazo (LTS) do Ubuntu Server. Um ambiente Linux limpo e padrão.',
            useCase: 'Criar um ambiente de teste isolado, depurar scripts em uma versão específica do Ubuntu ou usar como base para construir imagens personalizadas.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/ubuntu-server && cd /opt/docker/ubuntu-server', description: 'Cria o diretório do projeto.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  ubuntu:
    image: ubuntu:latest
    container_name: ubuntu_server
    # Mantém o contêiner rodando
    command: tail -f /dev/null
    restart: unless-stopped
EOF`, description: 'Cria o arquivo docker-compose.yml para o Ubuntu.' },
              { command: 'docker compose up -d', description: 'Inicia o contêiner.' },
              { command: 'echo "Ubuntu Server rodando. Para acessar o shell, use:"', description: 'Instrução.', isCode: false },
              { command: 'echo "docker exec -it ubuntu_server /bin/bash"', description: 'Comando de acesso.', isCode: false },
            ],
          },
          {
            title: 'Alpine Linux (Latest)',
            description: 'Inicia um contêiner com a última versão do Alpine Linux, uma distribuição extremamente leve e focada em segurança.',
            useCase: 'Ambientes onde o tamanho mínimo da imagem é crucial. Ideal para criar imagens de produção enxutas, reduzindo a superfície de ataque e o tempo de download.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/alpine-linux && cd /opt/docker/alpine-linux', description: 'Cria o diretório do projeto.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  alpine:
    image: alpine:latest
    container_name: alpine_linux
    command: tail -f /dev/null
    restart: unless-stopped
EOF`, description: 'Cria o arquivo docker-compose.yml para o Alpine.' },
              { command: 'docker compose up -d', description: 'Inicia o contêiner.' },
              { command: 'echo "Alpine Linux rodando. Para acessar o shell, use:"', description: 'Instrução.', isCode: false },
              { command: 'echo "docker exec -it alpine_linux /bin/sh"', description: 'Comando de acesso.', isCode: false },
            ],
          },
          {
            title: 'BusyBox (Latest)',
            description: 'Inicia um contêiner com BusyBox, que combina versões minúsculas de muitos utilitários UNIX comuns em um único executável pequeno.',
            useCase: 'Cenários que exigem o menor tamanho de imagem possível, como em sistemas embarcados ou para tarefas de utilidade extremamente simples onde um shell completo não é necessário.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/busybox && cd /opt/docker/busybox', description: 'Cria o diretório do projeto.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  busybox:
    image: busybox:latest
    container_name: busybox_shell
    command: tail -f /dev/null
    restart: unless-stopped
EOF`, description: 'Cria o arquivo docker-compose.yml para o BusyBox.' },
              { command: 'docker compose up -d', description: 'Inicia o contêiner.' },
              { command: 'echo "BusyBox rodando. Para acessar o shell, use:"', description: 'Instrução.', isCode: false },
              { command: 'echo "docker exec -it busybox_shell /bin/sh"', description: 'Comando de acesso.', isCode: false },
            ],
          },
          {
            title: 'Ubuntu Desktop com GUI (via Web)',
            description: 'Implementa um ambiente de desktop Ubuntu (XFCE) completo, acessível através de qualquer navegador web moderno. Baseado na popular imagem linuxserver/webtop.',
            useCase: 'Ter um ambiente de desenvolvimento gráfico remoto, executar aplicações Linux com GUI em um servidor, ou ter um desktop seguro e isolado para navegação e outras tarefas.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/ubuntu-desktop && cd /opt/docker/ubuntu-desktop', description: 'Cria o diretório do projeto.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  webtop:
    image: lscr.io/linuxserver/webtop:latest
    container_name: ubuntu_desktop_web
    security_opt:
      - seccomp:unconfined # Opcional, mas pode melhorar a compatibilidade
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
      - SUBFOLDER=/ # Opcional
    ports:
      - "3000:3000"
    volumes:
      - ./webtop_config:/config
    shm_size: '1gb' # Opcional, mas recomendado para performance
    restart: unless-stopped
EOF`, description: 'Cria o arquivo docker-compose.yml para o Ubuntu Desktop.' },
              { command: 'docker compose up -d', description: 'Inicia o contêiner (pode levar um tempo para baixar a imagem).' },
              { command: 'echo "Desktop Ubuntu rodando. Acesse a GUI no seu navegador:"', description: 'Instrução.', isCode: false },
              { command: 'echo "http://SEU_IP_DO_SERVIDOR:3000"', description: 'Instrução de acesso.', isCode: false },
              { command: 'echo "Pode ser necessário ajustar PUID/PGID para corresponder ao seu usuário (`id -u` e `id -g`)."', description: 'Dica de permissão.', isCode: false },
            ],
          },
        ]
      },
      security: {
        displayName: 'dockerSubCategorySecurity',
        guides: [
          {
            title: 'Wazuh SIEM/XDR Stack (Nó Único)',
            description: 'Implementa uma stack completa de nó único da plataforma de segurança Wazuh, incluindo o Wazuh Indexer (baseado em OpenSearch), Wazuh Server e o Wazuh Dashboard (baseado em OpenSearch Dashboards).',
            useCase: 'Solução SIEM e XDR de código aberto para coleta, agregação, indexação e análise de dados de segurança. Ajuda a detectar intrusões, monitorar a integridade de arquivos, avaliar vulnerabilidades e cumprir com normas de conformidade.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/wazuh-stack && cd /opt/docker/wazuh-stack', description: 'Cria e acessa o diretório do projeto.' },
              { command: 'curl -sO https://raw.githubusercontent.com/wazuh/wazuh-docker/master/single-node/docker-compose.yml', description: 'Baixa o arquivo docker-compose.yml oficial do Wazuh.' },
              { command: 'docker compose up -d', description: 'Inicia a stack do Wazuh. Pode levar vários minutos.' },
              { command: 'echo "Aguarde alguns minutos para a inicialização completa dos serviços."', description: 'Instrução.', isCode: false },
              { command: 'echo "Acesse o dashboard em: https://localhost (ou IP do servidor). Certificados são autoassinados."', description: 'Instrução de acesso.', isCode: false },
              { command: 'echo "Credenciais padrão: admin / SecretPassword"', description: 'Credenciais padrão. Altere-as imediatamente!', isCode: false },
            ],
          },
          {
            title: 'Graylog Log Management Stack',
            description: 'Implementa a stack completa do Graylog para gerenciamento centralizado de logs, incluindo OpenSearch como backend de dados e MongoDB para metadados.',
            useCase: 'Centralizar, pesquisar e analisar logs de múltiplas fontes (aplicações, servidores, firewalls). Ideal para depuração de aplicações, análise de segurança (SIEM) e monitoramento de infraestrutura.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/graylog-stack/{mongo_data,os_data,graylog_data} && cd /opt/docker/graylog-stack', description: 'Cria a estrutura de diretórios.' },
              { command: 'echo -n "SuaSenhaAdminAqui" | sha256sum | awk \'{print $1}\'', description: 'Execute este comando para gerar o hash da sua senha de admin e coloque o resultado em GRAYLOG_ROOT_PASSWORD_SHA2.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  mongo:
    image: mongo:5.0
    container_name: graylog_mongo
    volumes:
      - ./mongo_data:/data/db
    networks:
      - graylog-net
    restart: unless-stopped

  opensearch:
    image: opensearchproject/opensearch:2.11.0
    container_name: graylog_opensearch
    environment:
      - cluster.name=graylog-os-cluster
      - node.name=os01
      - discovery.type=single-node
      - bootstrap.memory_lock=true
      - "OPENSEARCH_JAVA_OPTS=-Xms1g -Xmx1g"
    ulimits: { memlock: { soft: -1, hard: -1 } }
    volumes:
      - ./os_data:/usr/share/opensearch/data
    networks:
      - graylog-net
    restart: unless-stopped

  graylog:
    image: graylog/graylog:5.0
    container_name: graylog
    volumes:
      - ./graylog_data:/usr/share/graylog/data
    environment:
      - GRAYLOG_PASSWORD_SECRET=SuaSenhaSecretaAqui_MudeIsso # Mínimo 16 caracteres
      - GRAYLOG_ROOT_PASSWORD_SHA2=COLOQUE_O_HASH_GERADO_AQUI
      - GRAYLOG_HTTP_BIND_ADDRESS=0.0.0.0:9000
      - GRAYLOG_HTTP_EXTERNAL_URI=http://SEU_IP_DO_SERVIDOR:9000/
      - GRAYLOG_ELASTICSEARCH_HOSTS=http://opensearch:9200
      - GRAYLOG_MONGODB_URI=mongodb://mongo:27017/graylog
    networks:
      - graylog-net
    depends_on:
      - mongo
      - opensearch
    ports:
      - "9000:9000" # Graylog UI
      - "5044:5044" # Beats Input
      - "12201:12201/udp" # GELF UDP Input
    restart: unless-stopped

networks:
  graylog-net: { driver: bridge }
EOF`, description: 'Cria o arquivo docker-compose.yml para a stack Graylog.' },
              { command: 'docker compose up -d', description: 'Inicia a stack do Graylog.' },
              { command: 'echo "Acesse a UI em http://SEU_IP_DO_SERVIDOR:9000. Login: admin / SuaSenhaAdminAqui"', description: 'Instrução de acesso.', isCode: false },
            ],
          },
          {
            title: 'SOAR Platform (TheHive, Cortex, MISP)',
            description: 'Implementa uma stack de SOAR integrada com TheHive para resposta a incidentes, Cortex para análise de observables e MISP para inteligência de ameaças.',
            useCase: 'Plataforma completa para um Centro de Operações de Segurança (SOC). Gerencie incidentes (TheHive), execute analisadores em IPs, domínios e hashes (Cortex) e correlacione dados com uma base de conhecimento de ameaças (MISP).',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/soar-stack/{thehive,cortex,misp,postgres,opensearch} && cd /opt/docker/soar-stack', description: 'Cria a estrutura de diretórios.' },
              { command: `cat <<'EOF' > docker-compose.yml
services:
  postgres:
    image: postgres:14
    container_name: soar_postgres
    volumes: ["./postgres:/var/lib/postgresql/data"]
    environment: { POSTGRES_PASSWORD: "SuaSenhaPostgres" }
    networks: [soar-net]
    restart: unless-stopped
  opensearch:
    image: opensearchproject/opensearch:2.11.0
    container_name: soar_opensearch
    volumes: ["./opensearch:/usr/share/opensearch/data"]
    environment: ["discovery.type=single-node", "bootstrap.memory_lock=true", "OPENSEARCH_JAVA_OPTS=-Xms1g -Xmx1g"]
    ulimits: { memlock: { soft: -1, hard: -1 } }
    networks: [soar-net]
    restart: unless-stopped
  cortex:
    image: thehiveproject/cortex:latest
    container_name: soar_cortex
    depends_on: [opensearch]
    ports: ["9001:9001"]
    volumes: ["/var/run/docker.sock:/var/run/docker.sock", "./cortex:/etc/cortex"]
    environment: { "cortex.search.host": "opensearch" }
    networks: [soar-net]
    restart: unless-stopped
  thehive:
    image: thehiveproject/thehive4:latest
    container_name: soar_thehive
    depends_on: [cortex, postgres]
    ports: ["9000:9000"]
    volumes: ["./thehive:/etc/thehive", "/var/run/docker.sock:/var/run/docker.sock"]
    command: --cortex-host cortex
    networks: [soar-net]
    restart: unless-stopped
  misp-mariadb:
    image: mariadb:10.5
    container_name: soar_misp_db
    volumes: ["./misp/db:/var/lib/mysql"]
    environment: { MYSQL_ROOT_PASSWORD: "SuaSenhaMispDbRoot" }
    networks: [soar-net]
    restart: unless-stopped
  misp-redis:
    image: redis:6.2
    container_name: soar_misp_redis
    volumes: ["./misp/redis:/data"]
    networks: [soar-net]
    restart: unless-stopped
  misp-server:
    image: misp/misp-docker:latest
    container_name: soar_misp_server
    depends_on: [misp-mariadb, misp-redis]
    ports: ["80:80", "443:443"]
    volumes: ["./misp/server:/var/www/MISP/app/files", "./misp/logs:/var/log/"]
    environment: { MYSQL_HOST: "misp-mariadb", MYSQL_DATABASE: "misp", MYSQL_USER: "misp", MYSQL_PASSWORD: "SuaSenhaMispDbUser" }
    networks: [soar-net]
    restart: unless-stopped
networks:
  soar-net: { driver: bridge }
EOF`, description: 'Cria o arquivo docker-compose.yml para a stack SOAR.' },
              { command: 'docker compose up -d', description: 'Inicia a stack SOAR. Pode levar vários minutos.' },
              { command: 'echo "Stack SOAR iniciando. Acesse TheHive (9000), Cortex (9001) e MISP (80/443)."', description: 'Instrução.', isCode: false },
              { command: 'echo "É necessária configuração manual pós-deploy para gerar chaves de API e integrá-los."', description: 'Aviso de configuração.', isCode: false },
            ],
          },
          {
            title: 'Shuffle Automation (SOAR)',
            description: 'Implementa o Shuffle, uma plataforma SOAR de código aberto focada em automação de fluxos de trabalho de segurança e TI através de uma interface visual.',
            useCase: 'Automatizar respostas a alertas de segurança, enriquecer dados de ameaças e orquestrar ferramentas de segurança. Ideal para criar automações complexas de forma rápida e visual.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/shuffle-stack && cd /opt/docker/shuffle-stack', description: 'Cria e acessa o diretório do projeto.' },
              { command: `curl -L "https://github.com/shuffle/shuffle/releases/latest/download/docker-compose.yml" -o docker-compose.yml`, description: 'Baixa o arquivo docker-compose.yml oficial do Shuffle.' },
              { command: 'docker compose up -d', description: 'Inicia a stack do Shuffle.' },
              { command: 'echo "Shuffle iniciando. Acesse a UI em http://SEU_IP_DO_SERVIDOR:3001"', description: 'Instrução de acesso.', isCode: false },
              { command: 'echo "Pode ser necessário editar o .env gerado para configurar o domínio e outras opções."', description: 'Dica de configuração.', isCode: false },
            ],
          },
          {
            title: 'StackStorm (Automation Engine)',
            description: 'Implementa a plataforma de automação StackStorm (st2), um motor robusto orientado a eventos, também conhecido como "IFTTT para Ops", para automação de infraestrutura e segurança.',
            useCase: 'Automação de remediação de incidentes, CI/CD, respostas a eventos de segurança (SOAR) e orquestração de infraestrutura. Conecta seus aplicativos, serviços e ferramentas existentes.',
            steps: [
              { command: 'sudo mkdir -p /opt/docker/stackstorm-stack && cd /opt/docker/stackstorm-stack', description: 'Cria e acessa o diretório do projeto.' },
              { command: `curl -L "https://raw.githubusercontent.com/StackStorm/st2-docker/master/docker-compose.yml" -o docker-compose.yml`, description: 'Baixa o arquivo docker-compose.yml oficial do StackStorm.' },
              { command: `echo "ST2_USER=st2admin\\nST2_PASSWORD=SuaSenhaSuperSegura" > .env`, description: 'Cria um arquivo .env com as credenciais iniciais.' },
              { command: 'docker compose up -d', description: 'Inicia a stack completa do StackStorm. Pode levar vários minutos.' },
              { command: 'echo "StackStorm iniciando. A UI estará acessível em http(s)://SEU_IP_DO_SERVIDOR."', description: 'Instrução.', isCode: false },
              { command: 'echo "Use as credenciais do arquivo .env para fazer login."', description: 'Instrução de acesso.', isCode: false },
            ],
          },
        ]
      },
    }
  },
  microk8s: {
    displayName: 'deploymentGuidesCategoryMicrok8s',
    guides: [
      {
        title: 'MicroK8s via Snap',
        description: 'Instala o MicroK8s, um Kubernetes de nó único, leve e certificado pela CNCF, empacotado como um snap.',
        useCase: 'Ideal para desenvolvimento, prototipagem, testes de CI/CD e cargas de trabalho de IoT/edge. Oferece uma experiência Kubernetes completa de forma simples e rápida.',
        steps: [
          { command: 'sudo snap install microk8s --classic', description: 'Instala o snap do MicroK8s.' },
          { command: 'sudo usermod -a -G microk8s $USER', description: 'Adiciona seu usuário ao grupo do MicroK8s para executar comandos sem sudo.' },
          { command: 'sudo chown -f -R $USER ~/.kube', description: 'Ajusta permissões do diretório kubeconfig.'},
          { command: 'echo "Faça um novo login ou execute \'newgrp microk8s\' para aplicar as permissões."', description: 'Instrução para o usuário.', isCode: false },
          { command: 'microk8s status --wait-ready', description: 'Verifica o status e aguarda o serviço ficar pronto.' },
          { command: 'microk8s enable dns dashboard storage', description: 'Habilita addons essenciais como DNS, o Dashboard e o provisionador de armazenamento padrão.' },
          { command: 'microk8s kubectl get all -A', description: 'Verifica se todos os pods do sistema estão rodando corretamente.' },
        ],
      },
    ],
  },
  pip: {
    displayName: 'deploymentGuidesCategoryPip',
    guides: [
      {
        title: 'Ansible em Ambiente Virtual (.venv)',
        description: 'Instala o Ansible e suas coleções de forma profissional, utilizando um ambiente virtual Python para isolar dependências e garantir a reprodutibilidade dos seus projetos de automação.',
        useCase: 'Ideal para gerenciar múltiplos projetos Ansible com diferentes versões ou dependências, evitando conflitos com pacotes Python do sistema. Essencial para automação de infraestrutura, provisionamento e gerenciamento de configuração de forma limpa e organizada.',
        steps: [
          { command: 'echo "Criando o ambiente virtual..."', description: 'Mensagem informativa.', isCode: false },
          { command: 'python3 -m venv ansible_project_venv', description: 'Cria um diretório com um ambiente Python isolado.'},
          { command: 'echo "Ativando o ambiente virtual..."', description: 'Mensagem informativa.', isCode: false },
          { command: 'source ansible_project_venv/bin/activate', description: 'Ativa o ambiente. O prompt do seu terminal deve mudar.'},
          { command: 'echo "Atualizando o PIP..."', description: 'Mensagem informativa.', isCode: false },
          { command: 'pip install --upgrade pip', description: 'Garante que o gerenciador de pacotes pip está na última versão.'},
          { command: 'echo "Instalando o Ansible..."', description: 'Mensagem informativa.', isCode: false },
          { command: 'pip install ansible', description: 'Instala o pacote principal do Ansible no ambiente isolado.'},
          { command: 'echo "Instalando coleções da comunidade (ex: general, docker)..."', description: 'Mensagem informativa.', isCode: false },
          { command: 'ansible-galaxy collection install community.general community.docker', description: 'Instala coleções populares com módulos úteis.'},
          { command: 'ansible --version', description: 'Verifica a instalação e exibe a versão do Ansible e Python.'},
          { command: 'echo "Para sair do ambiente virtual, use o comando: deactivate"', description: 'Instrução final.', isCode: false },
        ]
      }
    ]
  },
  npm: {
    displayName: 'deploymentGuidesCategoryNpm',
    guides: [
      {
        title: 'NVM + Node.js & NPM',
        description: 'Instala o Node.js e o NPM da forma correta usando o NVM (Node Version Manager). Esta é a melhor prática pois permite gerenciar múltiplas versões do Node sem a necessidade de `sudo`, evitando problemas de permissão e facilitando a troca de versão por projeto.',
        useCase: 'Essencial para qualquer desenvolvedor JavaScript/TypeScript. Permite criar, construir e executar aplicações web, back-ends, ferramentas de linha de comando e muito mais.',
        steps: [
          { command: 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash', description: 'Baixa e executa o script de instalação do NVM.' },
          { command: 'export NVM_DIR="$HOME/.nvm"', description: 'Define a variável de ambiente para o NVM (adicione ao seu .bashrc/.zshrc).'},
          { command: '[ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"', description: 'Carrega o NVM na sessão atual do shell (adicione também ao .bashrc/.zshrc).'},
          { command: 'source ~/.bashrc', description: 'Recarrega o arquivo de configuração do shell para aplicar as mudanças.'},
          { command: 'nvm install --lts', description: 'Instala a versão mais recente de Suporte de Longo Prazo (LTS) do Node.js, que inclui o NPM.'},
          { command: 'node -v && npm -v', description: 'Verifica se a instalação foi bem-sucedida exibindo as versões.'},
        ],
      },
      {
        title: 'Vercel CLI',
        description: 'Instala a Vercel CLI, a interface de linha de comando para a plataforma Vercel, otimizada para frameworks de frontend e serverless functions.',
        useCase: 'Permite fazer deploy de projetos, gerenciar domínios, variáveis de ambiente e logs diretamente do terminal. Indispensável para o fluxo de trabalho de qualquer desenvolvedor que usa a Vercel.',
        steps: [
          { command: 'npm install -g vercel', description: 'Instala a CLI da Vercel globalmente usando NPM.' },
          { command: 'vercel --version', description: 'Verifica a instalação.' },
          { command: 'vercel login', description: 'Autentica sua conta da Vercel.' },
        ],
      },
      {
        title: 'Redis CLI',
        description: 'Instala o `redis-cli`, a interface de linha de comando oficial para interagir com servidores Redis. Redis é um banco de dados em memória de alto desempenho.',
        useCase: 'Conveniente para desenvolvedores que precisam se conectar a um servidor Redis (local ou remoto) para depurar, inspecionar chaves, executar comandos ou monitorar a performance, sem precisar instalar o pacote completo do servidor Redis.',
        steps: [
          { command: 'npm install -g redis-cli', description: 'Instala o pacote redis-cli globalmente.' },
          { command: 'redis-cli --version', description: 'Verifica se a CLI foi instalada corretamente.' },
          { command: 'redis-cli -h <host> -p <porta> PING', description: 'Exemplo de como conectar a um servidor e testar a conexão.' },
        ],
      },
    ]
  }
};