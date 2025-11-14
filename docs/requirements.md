# Requisitos para o desenolvimento da aplicação

### Requisitos Funcionais

- [] Deve ser possível criar grafos manualmente (adicionar nós e arestas), no estilo _drag and drop_
- [] Deve ser possível editar grafos (mover nós, alterar pesos, remover arestas/nós)
- [] Deve ser possível executar o algoritmo BFS
- [] Deve ser possível executar o algoritmo DFS
- [] Deve ser possível executar o algoritmo de Dijkstra
- [] Deve ser possível gerar o caminho mínimo
- [] Deve ser possível visualizar a animação dos algoritmos
- [] Deve ser possível visualizar nós e arestas visitados
- [] Deve ser disponibilizado um menu - semelhante ao FigmaJam - para os componentes funcionais (nós e arestas)
- [] Deve ser disponibilizado um menu lateral para controle e execuçao dos algoritmos
- [] Deve ser exibido alertas ou mensagens de erros descritivas ao usuário quando as execuções dos algoritmos não forem possíveis

### Requisitos Não Funcionais

- [] A interface deve ser moderna e responsiva
- [] Os grafos devem ser representados por uma estrutura de dados bem definida
- [] Os grafos devem ser construídos e exibidos utilizando o React Flow
- [] A API Rest deve comunicar os dados com o frontend em formato JSON
- [] A API deve ter o CORS configurado para permitir comunicação com o frontend
- [] A API deve ser documentada via Swagger
- [] A animação da execução dos algoritmos deve ser fluída

### Regras de Negócio

- [] Os algoritmos só podem ser executados se o grafo for válido
- [] O algoritmo de Dijkstra só pode executar se todos os pesos forem >= 0