import { GoogleGenAI, Chat, Type } from "@google/genai";
import { ValidationResult, ApiRequest, ApiResponse as AppApiResponse, ApiMethod } from '../types';
import { KNOWLEDGE_BASE_DATA } from '../data/knowledgeBase';
import { DEPLOYMENT_GUIDES_DATA } from '../data/deploymentGuides';

const getAi = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const buildKnowledgeContextString = (): string => {
    const contextParts: string[] = [];
    contextParts.push('### INÍCIO DO CONTEXTO INTERNO (Use como fonte primária de verdade)');

    contextParts.push('\n#### Guias de Deploy:');
    Object.values(DEPLOYMENT_GUIDES_DATA).forEach(category => {
        category.guides.forEach(guide => {
            contextParts.push(`- Título: ${guide.title}. Descrição: ${guide.description}.`);
        });
    });

    contextParts.push('\n#### Base de Conhecimento de Comandos:');
    Object.values(KNOWLEDGE_BASE_DATA).forEach(category => {
        if (category.commands) {
            category.commands.forEach(cmd => contextParts.push(`- \`${cmd.command}\`: ${cmd.description}`));
        }
        if (category.subCategories) {
            Object.values(category.subCategories).forEach(subCategory => {
                subCategory.commands.forEach(cmd => contextParts.push(`- \`${cmd.command}\`: ${cmd.description}`));
            });
        }
    });

    contextParts.push('\n### FIM DO CONTEXTO INTERNO\n');
    return contextParts.join('\n');
};


export const analyzeScript = async (script: string): Promise<string> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analise o seguinte script Bash. Forneça feedback sobre possíveis bugs, inconsistências de estilo e sugira melhorias. Formate sua resposta como Markdown, incluindo trechos de código quando apropriado.\n\n\`\`\`bash\n${script}\n\`\`\``
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing script:", error);
        throw error;
    }
};

export const improveScript = async (script: string): Promise<string> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Você é um engenheiro especialista em Bash. Revise e melhore o seguinte script Bash. Seu objetivo é torná-lo mais robusto, eficiente e legível, seguindo as melhores práticas modernas. Forneça o script melhorado dentro de um bloco de código \`\`\`bash, seguido por uma lista detalhada com marcadores explicando as mudanças.\n\n**Script Original:**\n\`\`\`bash\n${script}\n\`\`\``
        });
        return response.text;
    } catch (error) {
        console.error("Error improving script:", error);
        throw error;
    }
};

export const refactorSelection = async (selection: string): Promise<{ suggestedCode: string, explanation: string }> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `You are an expert code reviewer specializing in Bash. Refactor the following Bash code snippet for clarity, efficiency, and adherence to best practices.

Respond ONLY with a JSON object that adheres to the provided schema. The 'explanation' should be concise and formatted as Markdown.

**Code Snippet to Refactor:**
\`\`\`bash
${selection}
\`\`\`
`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestedCode: {
                            type: Type.STRING,
                            description: "The refactored Bash code snippet."
                        },
                        explanation: {
                            type: Type.STRING,
                            description: "A concise, Markdown-formatted explanation of the changes made."
                        }
                    },
                    required: ['suggestedCode', 'explanation']
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as { suggestedCode: string, explanation: string };
        
        // Basic validation in case the model returns an empty string for the code
        if (!result.suggestedCode && result.explanation) {
             return { suggestedCode: selection, explanation: result.explanation };
        }

        return result;

    } catch (error) {
        console.error("Error refactoring selection:", error);
        throw error;
    }
};

export const executeScript = async (script: string): Promise<string> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Aja como um terminal Linux em um ambiente não interativo. Execute o seguinte script Bash e retorne a saída.

**REQUISITO CRÍTICO DE FORMATAÇÃO DE ERRO:** Se um comando no script resultar em um erro (ex: comando não encontrado, erro de permissão, erro de sintaxe detectado pelo shell), você DEVE prefixar a linha de erro com \`L<line_number>: \`, onde \`<line_number>\` é a linha exata no script que causou o erro.
Para saídas normais (stdout) e avisos, NÃO adicione este prefixo.
Se o script exigir entrada do usuário ou parecer entrar em um loop infinito, anote isso claramente.
Formate TODA a sua resposta dentro de um único bloco de código \`\`\`text. Não inclua nenhuma explicação fora dele.

**Exemplo de Resposta Esperada com Erro:**
\`\`\`text
$ ./meu_script.sh
Olá, Mundo!
L5: cat: arquivo_inexistente.txt: No such file or directory
$
\`\`\`

**Script para Executar:**
\`\`\`bash
${script}
\`\`\`
`
        });
        const output = response.text.trim();
        if (output.startsWith('```text') && output.endsWith('```')) {
            return output;
        }
        return '```text\n' + output + '\n```';
    } catch (error) {
        console.error("Error executing script:", error);
        throw error;
    }
};

export const generateScript = async (prompt: string, systemInstruction: string, requiredCommands: string): Promise<string> => {
    const langInstruction = `
### Requisitos de Comentários (Português do Brasil - pt-BR)
- O script DEVE ser extensiva e claramente comentado em Português do Brasil (pt-BR).
- Adicione um bloco de cabeçalho detalhado explicando o propósito do script, como usá-lo e quaisquer dependências.
- Comente cada função ou bloco lógico para descrever seu propósito e funcionamento.
- Forneça comentários detalhados para quaisquer comandos, pipelines ou algoritmos complexos.
- Explique a estratégia de tratamento de erros, detalhando o que cada verificação de erro faz e por quê.`;

    let commandInstruction = '';
    if (requiredCommands && requiredCommands.trim() !== '') {
        commandInstruction = `
### Requisitos de Ferramentas
- O script DEVE utilizar as seguintes ferramentas/comandos, se apropriado para a tarefa: \`${requiredCommands}\`.
- Se uma das ferramentas especificadas for essencial para a tarefa, o script DEVE verificar se ela está instalada e acessível no PATH do sistema. Se não estiver, o script deve sair com uma mensagem de erro clara instruindo o usuário a instalar a dependência.`;
    }

    const knowledgeContext = buildKnowledgeContextString();
    
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Você é um especialista de classe mundial em engenharia Bash. Sua tarefa é gerar um script Bash de alta qualidade e pronto para produção com base na solicitação do usuário. O script deve ser robusto, idempotente quando aplicável e incluir um excelente tratamento de erros.

${knowledgeContext}

---

Com base no contexto interno acima e em seu treinamento geral, responda à solicitação do usuário.

${langInstruction}
${commandInstruction}

**Solicitação do Usuário:** "${prompt}"`,
            config: {
                systemInstruction: systemInstruction || "Você é um especialista de classe mundial em engenharia Bash. Gere scripts de alta qualidade e prontos para produção.",
                thinkingConfig: { thinkingBudget: 32768 }
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating script:", error);
        throw error;
    }
};

export const validateScript = async (script: string): Promise<ValidationResult> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the following Bash script for a range of issues, providing detailed and actionable feedback for each.

- **Syntax & Logic Errors**:
  - Identify critical syntax mistakes that would prevent the script from running (severity: 'error').
  - Detect potential infinite loops (e.g., \`while true\` without a proper break condition, or loop variables that are not updated) (severity: 'warning').

- **Security Vulnerabilities**:
  - Find common security risks like command injection, unquoted variables in sensitive contexts, or unsafe use of temp files (severity: 'error' or 'warning').

- **Portability & Case Sensitivity**:
  - Detect inconsistent casing in file paths (e.g., referencing "/path/to/MyFile" and later "/path/to/myfile"). This is a bug on case-sensitive filesystems (severity: 'warning').
  - Identify shell commands or built-ins called with incorrect capitalization (e.g., \`Grep\` instead of \`grep\`). Commands are case-sensitive (severity: 'error').
  - Check for variables that are referenced with different casing (e.g., setting \`myVar\` but reading \`myvar\`). This can lead to unexpected behavior (severity: 'warning').

- **Best Practices & Code Quality**:
  - Identify unused variables that are declared but never read (severity: 'warning').
  - Suggest improvements for clarity and maintainability.

- **Performance & Efficiency**:
  - Detect performance bottlenecks, such as running external commands inside tight loops where a Bash built-in could be used (severity: 'performance').
  - Find inefficient command usage, like "useless use of cat" (\`cat file | grep ...\`) or complex pipes (\`grep ... | awk ...\`) that could be simplified into a single command (severity: 'performance').

Respond ONLY with a JSON object that adheres to the provided schema. The \`message\` for each issue must be detailed and clearly explain the problem and a potential solution. Ensure you identify the specific line number for each issue whenever possible.

**IMPORTANT**: Set \`isValid\` to \`false\` only if you find one or more issues with \`severity: 'error'\`. If you only find 'warning' or 'performance' issues, set \`isValid\` to \`true\`. If there are no issues at all, return \`isValid: true\` and an empty \`issues\` array.

Script:
\`\`\`bash
${script}
\`\`\`
`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isValid: { type: Type.BOOLEAN },
                        issues: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    line: { type: Type.INTEGER, description: "The line number of the issue, or null if it's a general script issue.", nullable: true },
                                    message: { type: Type.STRING, description: "A clear, detailed description of the issue and potential solutions." },
                                    severity: { type: Type.STRING, enum: ['error', 'warning', 'performance'], description: "The severity of the issue." }
                                },
                                required: ['message', 'severity']
                            }
                        }
                    },
                    required: ['isValid', 'issues']
                }
            }
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as ValidationResult;
        return result;

    } catch (error) {
        console.error("Error validating script:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return {
            isValid: false,
            issues: [{
                line: null,
                message: `The AI validation service failed to analyze the script. Details: ${errorMessage}`,
                severity: 'error'
            }]
        };
    }
};

export const getCodeCompletion = async (lineContent: string): Promise<string[]> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a Bash code completion engine. Based on the following partial line of Bash script, provide up to 5 concise and relevant completion suggestions for the last word.
- Suggest command names, flags, file paths, or variable names.
- Prioritize the most common and logical completions first.
- Respond ONLY with a JSON object containing a "suggestions" array. Do not include any explanation, markdown, or formatting.
- If you have no suggestions, return an empty array.

Partial Line:
\`\`\`bash
${lineContent}
\`\`\`
`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['suggestions']
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as { suggestions: string[] };
        return result.suggestions || [];

    } catch (error) {
        console.error("Error getting code completion:", error);
        return []; // Return empty array on error
    }
};


export const addDocstrings = async (script: string): Promise<string> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Using pro for better code understanding
            contents: `Você é um engenheiro de software sênior especializado em Bash. Sua tarefa é adicionar documentação detalhada e completa ao script Bash fornecido, em Português do Brasil (pt-BR).

**Requisitos:**
1.  **Bloco de Cabeçalho:** Adicione ou complete o bloco de cabeçalho no início do script. Ele deve incluir:
    -   \`@Descrição\`: Uma descrição clara do que o script faz.
    -   \`@Autor\`: O nome do autor (use "BashStudio AI").
    -   \`@Uso\`: Como executar o script, incluindo exemplos de argumentos.
    -   \`@Dependências\`: Quaisquer ferramentas ou comandos externos necessários.
2.  **Documentação de Funções:** Para cada função no script:
    -   Adicione um bloco de comentários logo acima da definição da função.
    -   Descreva o propósito da função.
    -   Liste e explique todos os \`@Parâmetros\`.
    -   Descreva o que a função \`@Retorna\`.
3.  **Comentários Inline:** Adicione comentários inline para explicar linhas ou blocos de código complexos, pipelines de comandos ou lógica não óbvia.
4.  **Manter Código Original:** NÃO modifique a lógica do script. Apenas adicione comentários e documentação.
5.  **Formato de Saída:** Retorne APENAS o script Bash completo e documentado dentro de um único bloco de código \`\`\`bash. Não inclua nenhuma explicação fora do bloco de código.

**Script para Documentar:**
\`\`\`bash
${script}
\`\`\`
`
        });
        const fullResponse = response.text.trim();
        const match = fullResponse.match(/```bash([\s\S]*?)```/);
        return match?.[1] ? match[1].trim() : fullResponse; // Return only the code
    } catch (error) {
        console.error("Error adding docstrings:", error);
        throw error;
    }
};

export const optimizePerformance = async (script: string): Promise<string> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Você é um engenheiro de desempenho de sistemas especialista em Bash. Analise o script Bash a seguir em busca de gargalos de desempenho e oportunidades de otimização.

**Sua tarefa:**
1.  **Reescrever o Script:** Forneça uma versão otimizada do script que seja mais rápida e/ou use menos recursos (CPU, memória).
2.  **Explicar as Mudanças:** Após o bloco de código, forneça uma lista detalhada com marcadores explicando CADA otimização que você fez e por que ela melhora o desempenho. Por exemplo, substituir comandos externos por built-ins do Bash, otimizar loops, reduzir chamadas de processo, etc.
3.  **Formato de Saída:** Primeiro, o script otimizado dentro de um bloco \`\`\`bash. Depois, a explicação detalhada em Markdown.

**Script Original:**
\`\`\`bash
${script}
\`\`\`
`
        });
        return response.text;
    } catch (error) {
        console.error("Error optimizing script:", error);
        throw error;
    }
};

export const checkSecurity = async (script: string): Promise<string> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Aja como um especialista em segurança de aplicações (AppSec) realizando uma auditoria de segurança no script Bash a seguir.

**Sua tarefa:**
1.  **Analisar Vulnerabilidades:** Verifique o script em busca de vulnerabilidades de segurança comuns, incluindo, mas não se limitando a:
    -   **Injeção de Comandos:** Uso de variáveis não sanitizadas em \`eval\` ou diretamente em comandos.
    -   **Uso de Variáveis sem Aspas:** Variáveis que podem sofrer word splitting ou expansão de glob.
    -   **Arquivos Temporários Inseguros:** Uso de nomes de arquivo previsíveis em /tmp. Verifique se \`mktemp\` está sendo usado corretamente para criar arquivos e diretórios temporários de forma segura, e se eles são limpos adequadamente.
    -   **Manuseio Inseguro de Entrada via Pipe:** Analise se o script processa entradas de \`stdin\` (por exemplo, \`cat algum_arquivo | ./meu_script.sh\`) de uma forma que poderia levar a injeção de comandos ou outros comportamentos inesperados.
    -   **Credenciais Hardcoded:** Senhas, tokens de API ou chaves secretas no código.
    -   **Permissões Inseguras:** Comandos que podem ser explorados se executados com permissões elevadas.
2.  **Gerar Relatório:** Forneça um relatório detalhado em formato Markdown.
    -   Para cada vulnerabilidade encontrada, crie um cabeçalho (ex: "### Injeção de Comando na Linha 15").
    -   Descreva o **Risco** da vulnerabilidade.
    -   Mostre o **Trecho de Código Vulnerável**.
    -   Forneça uma **Remediação** sugerida com um exemplo de código corrigido.
    -   Se nenhuma vulnerabilidade for encontrada, retorne uma mensagem clara afirmando que a verificação foi concluída e nenhum problema de segurança óbvio foi detectado.

**Script para Análise:**
\`\`\`bash
${script}
\`\`\`
`
        });
        return response.text;
    } catch (error) {
        console.error("Error checking security:", error);
        throw error;
    }
};

export const generateApiTestsFromScript = async (script: string): Promise<ApiRequest[]> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Você é um Engenheiro de QA especialista em testes de API. Analise o script Bash a seguir e identifique todas as chamadas de API (usando curl, wget, etc.).

Para CADA chamada de API encontrada, gere uma suíte de casos de teste, incluindo pelo menos:
1.  Um caso de "caminho feliz" (sucesso).
2.  Um caso de erro de validação (ex: 400 Bad Request) com um corpo (body) malformado, se aplicável.
3.  Um caso de erro de autenticação (ex: 401 Unauthorized) com um header de autorização inválido.
4.  Um caso de recurso não encontrado (ex: 404 Not Found) com um ID inválido na URL.

**REQUISITOS DE SAÍDA:**
- Responda APENAS com um objeto JSON.
- O objeto deve conter uma única chave "tests", que é um array de objetos.
- Cada objeto no array deve representar um único caso de teste e seguir estritamente o schema fornecido.
- O campo 'name' deve ser descritivo, ex: "Get User - Success", "Create User - Missing Name".
- O campo 'id' deve ser um UUID v4.
- O campo 'body' deve ser uma string JSON válida ou uma string vazia.

**Script para Análise:**
\`\`\`bash
${script}
\`\`\`
`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tests: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING, description: 'UUID v4 for the request' },
                                    name: { type: Type.STRING, description: 'Descriptive name for the test case' },
                                    method: { type: Type.STRING, enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'] },
                                    url: { type: Type.STRING },
                                    headers: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                id: { type: Type.STRING },
                                                key: { type: Type.STRING },
                                                value: { type: Type.STRING },
                                                enabled: { type: Type.BOOLEAN }
                                            }
                                        }
                                    },
                                    params: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                id: { type: Type.STRING },
                                                key: { type: Type.STRING },
                                                value: { type: Type.STRING },
                                                enabled: { type: Type.BOOLEAN }
                                            }
                                        }
                                    },
                                    body: { type: Type.STRING, description: 'JSON string or empty string' }
                                }
                            }
                        }
                    },
                    required: ['tests']
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as { tests: ApiRequest[] };
        return result.tests || [];
    } catch (error) {
        console.error("Error generating API tests from script:", error);
        throw error;
    }
};

export const analyzeApiResponse = async (request: ApiRequest, response: AppApiResponse): Promise<string> => {
     try {
        const ai = getAi();
        const apiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Você é um engenheiro de software sênior e especialista em diagnóstico de API. Analise a seguinte requisição HTTP e sua resposta.

**Sua Tarefa:**
Forneça uma análise clara e concisa em formato Markdown. Siga esta estrutura:
1.  **Status:** Explique o que o código de status HTTP (${response.status} ${response.statusText}) significa no contexto desta requisição específica.
2.  **Análise do Corpo (Body):** Resuma o conteúdo do corpo da resposta. Se for um erro, explique a mensagem de erro. Se for sucesso, descreva brevemente os dados retornados.
3.  **Cabeçalhos Notáveis (Headers):** Aponte 1 ou 2 cabeçalhos importantes na resposta (ex: \`Content-Type\`, \`Cache-Control\`, \`X-RateLimit-Remaining\`) e explique o que eles indicam.
4.  **Sugestão (se for erro):** Se a resposta for um erro (status >= 400), forneça uma causa provável e sugira uma solução clara. Por exemplo, "O token de autorização parece estar faltando ou inválido" ou "O ID na URL pode não existir".

---

### Requisição Enviada:
- **Método:** ${request.method}
- **URL:** ${request.url}
- **Cabeçalhos:** \`\`\`json\n${JSON.stringify(request.headers.filter(h => h.enabled).reduce((acc, h) => ({...acc, [h.key]: h.value}), {}), null, 2)}\n\`\`\`
- **Corpo:** \`\`\`json\n${request.body || '{}'}\n\`\`\`

### Resposta Recebida:
- **Status:** ${response.status} ${response.statusText}
- **Tempo:** ${response.time}ms
- **Cabeçalhos:** \`\`\`json\n${JSON.stringify(response.headers, null, 2)}\n\`\`\`
- **Corpo:** \`\`\`json\n${response.body || '{}'}\n\`\`\`
`
        });
        return apiResponse.text;
    } catch (error) {
        console.error("Error analyzing API response:", error);
        throw error;
    }
};


let chatInstance: Chat | null = null;
let lastSystemInstruction: string | null = null;

export const getChatResponse = async (history: { role: 'user' | 'model'; parts: { text: string }[] }[], newMessage: string, systemInstruction: string): Promise<string> => {
    try {
        const ai = getAi();
        const knowledgeContext = buildKnowledgeContextString();
        const finalSystemInstruction = `${systemInstruction}\n\n${knowledgeContext}`;
        
        if (!chatInstance || lastSystemInstruction !== finalSystemInstruction) {
            console.log("Creating new chat instance with instruction:", finalSystemInstruction);
            lastSystemInstruction = finalSystemInstruction;
            chatInstance = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: finalSystemInstruction,
                },
                history: history,
            });
        }
        const response = await chatInstance.sendMessage({ message: newMessage });
        return response.text;
    } catch (error) {
        console.error("Error in chat:", error);
        chatInstance = null;
        lastSystemInstruction = null;
        throw error;
    }
};