# README

## Descritivo de Requisitos

### RF

- [x] Usuário deve poder escolher um cartão
- [x] Usuário deve poder realizar simulações
- [x] Usuário deve poder ver o histórico de simulações realizadas (Filtrando por: Tipo, Período e Cartão)
- [ ] Usuário deve poder decidir se quer receber avisos por e-mail (Futuramente: Informar outro e-mail para receber avisos)

### RNF

- [x] O sistema deve buscar a cotação do dólar a cada 5 minutos
- [x] O sistema deve ter bandeiras pré cadastradas pelo admin
- [x] O sistema deve ter os cartões pré cadastradas pelo admin
- [ ] O sistema deve mostrar um avatar com a inicial do usuário (Futuramente: Avatar Desenhado escolhido pelo Usuário)

### RN

- [x] O cadastro de cotação do dólar deve salvar o valor da cotação e a data/hora da busca
- [x] O cadastro de cartão deve conter Nome, Instituição, Bandeira, Moeda de Conversão, Taxa de Conversão de Pontos/Dólar
- [x] O cadastro da escolha de um cartão pelo usuário deve ter a referência de qual cartão
- [x] O usuário não pode ter mais de 3 cartões ligados à ele (Futuramente: plano premium liberando quantidade ilimitada)

- [x] A simulação deve estar relacionada à um cartão do usuário, tipos (Compra, Período e Gasto Mensal)
- [x] O tipo "compra" recebe o valor e retorna quantos pontos o usuário vai receber
- [x] O tipo "gasto mensal" recebe quantos pontos o usuário quer acumular e em quantos meses e retorna o quanto deverá ser gasto mensalmente
- [x] O tipo "período" recebe o valor do gasto mensal e a quantidade de pontos almejada e retorna o período que será necessário para alcançar

## Todo List

### Autenticação

- [x] Criação de usuário via e-mail
- [x] Criação de usuário via google
- [ ] Criação de usuário via facebook

- [x] Authenticação de usuário via e-mail
- [x] Authenticação de usuário via google
- [ ] Authenticação de usuário via facebook

- [x] Proteção da aplicação para usuário logado
- [x] Proteção do admin para usuário logado e com permissões administrativas

- [ ] Melhorias na Experiência do Usuário
- [ ] Melhorias Visuais

### Banco de dados

- [x] Tabela Bandeira
- [x] Tabela Instituição Financeira
- [x] Tabela Cartão
- [x] Tabela Cartão Usuário
- [x] Tabela Dólar
- [x] Tabela Simulação
- [x] Tabela Cartão Simulação

### Funcionalidades da Aplicação (Cadastros, Cálculos)

#### Admin

- [x] Cadastro de Bandeira
- [x] Cadastro de Instituição Financeira
- [x] Cadastro de Cartão

#### Usuario

- [x] Escolha de Cartão
- [x] Realização de Simulação

### Funcionalidades de Usuário (Histórico, Perfil)

- [x] Listagem de Simulações
- [ ] Habilitar recebimento de avisos via e-mail

### Feedback e Melhorias Visuais

### Testes

### Deploy

### Teste Em Produção

### Desenvolvimento Restante

Tela Inicial:

- [ ] Aprimorar Design
- [ ] Implementar rota de sugestão de cartões
- [ ] Fazer cartões favoritos serem selecionados automaticamente
- [ ] Mostrar cotação do dólar utilizada na simulação

Tela Cartões:

- [ ] Serão mostradas mais informações relativas aos cartões
- [ ] Botão para favoritar um cartão

Tela Histórico:

- [ ] Será implementado um filtro de período
- [ ] Jogar a data para cima
- [ ] Mostrar cotação do dólar utilizada na simulação

Tela Perfil:

- [ ] Funcionalidade de alterar senha será ativada (ainda não está efetivamente alterando)
- [ ] A visualização dos cartões receberá mais detalhes
- [ ] Implementar notificações de e-mail por tipo
- [ ] Implementar e-mail para recebimento de notificações

Tela Admin:

- [ ] Será adicionado novos campos na entidade do cartão
- [ ] Fazer admin poder colocar um cartão em destaque (aparecerá como sugestão na tela principal)
- [ ] Adicionar Ágio na Instituição Financeira (refazer os cálculos de simulação)
- [ ] Ordernar Cartões por Instituição Financeira

Funcionalidade de Esqueci Minha Senha:

- [ ] Será enviado o e-mail
