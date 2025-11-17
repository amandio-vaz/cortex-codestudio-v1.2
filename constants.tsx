import React from 'react';

export const INITIAL_SCRIPT = '#!/bin/bash\n\n# Bem-vindo ao BashStudio!\n# Escreva seu script aqui ou descreva um para ser gerado.\n\necho "Olá, Mundo!"';

export const INITIAL_YAML = `# Bem-vindo ao Editor YAML!\n# Cole seu docker-compose.yml aqui para análise.\n\nservices:\n  web:\n    image: nginx:latest\n    ports:\n      - "8080:80"`;

export const INITIAL_JSON = `{\n  "bem_vindo": "Editor JSON!",\n  "descricao": "Cole seu JSON aqui para análise, com foco em APIs, Payloads e Workflows.",\n  "exemplo": {\n    "id": 1,\n    "produto": "Caneta Azul",\n    "pronto_para_venda": true\n  }\n}`;
