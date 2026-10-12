// Todo o texto do portfólio fica aqui.
// Conteúdo dos projetos: só o que mostra nível técnico e visual.

// O número de contato vem do .env.local (veja .env.example) e não fica no repositório.
const numeroWhatsapp = import.meta.env.VITE_WHATSAPP_NUMERO ?? '';

export const whatsapp = {
  numero: numeroWhatsapp,
  texto: import.meta.env.VITE_WHATSAPP_TEXTO ?? '',
  link: `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent('Olá, João! Vi seu portfólio e quero conversar sobre um projeto.')}`,
};

export const img = (name: string) => `/projetos/${name}.jpg`;
export const mini = (name: string) => `/projetos/mini/${name}.jpg`;

export const numeros = [
  { valor: '400+', titulo: 'alunos', texto: 'usam a Plataforma Deload, que eu construí do zero.' },
  { valor: '342', titulo: 'congressos médicos', texto: 'de 32 especialidades no MetaTracker, com prazos de submissão pesquisados por IA.' },
];

export type Tela = { imagem: string; nome: string; texto: string };
export type Item = [string, string];

export type Projeto = {
  id: string;
  nome: string;
  titulo: [string, string];
  chamada: string;
  tipo: string;
  local: string;
  capa: string;
  destaque?: boolean;
  destaques?: Item[];
  resumo: string[];
  nota?: string;
  link?: { href: string; texto: string };
  escopo: string[];
  tecnologias?: string[];
  telas: { computador: Tela[]; celular: Tela[] };
  engenharia: Item[];
  design: Item[];
};

const deload: Projeto = {
  id: 'deload',
  nome: 'Plataforma Deload',
  titulo: ['Uma plataforma', 'de estudos inteira'],
  chamada: 'Revisão espaçada, simulados, flashcards e IA própria para mais de 400 alunos.',
  tipo: 'Plataforma de estudos com IA',
  local: 'Mentoria Deload',
  capa: 'deload-login-claro',
  resumo: [
    'A Deload é a plataforma de estudos da Mentoria Deload, para quem se prepara para o ENEM. Junta revisão espaçada, flashcards, simulados, biblioteca de materiais, métricas, comunidade e assistentes de inteligência artificial.',
    'Construí o sistema inteiro sozinho, da interface ao banco de dados, e continuo evoluindo a plataforma com os pedidos do dono da mentoria. Hoje mais de 400 alunos estudam nela.',
  ],
  nota: 'As telas usam uma conta de teste. Os nomes das provas e das instituições aparecem censurados.',
  link: { href: 'https://plataformadeload.com.br', texto: 'plataformadeload.com.br' },
  escopo: ['Interface', 'Servidor', 'Banco de dados', 'Assistentes de IA', 'Autenticação', 'Pagamentos'],
  telas: {
    computador: [
      { imagem: 'deload-login-claro', nome: 'Entrada', texto: 'Login por e-mail ou pela conta Google, com a marca da Deload ao fundo.' },
      { imagem: 'deload-inicio', nome: 'Painel do aluno', texto: 'O aluno vê logo o próximo tópico, os dias até a prova, o ritmo da semana e o desempenho em flashcards e simulados.' },
      { imagem: 'deload-revisoes', nome: 'Revisão espaçada', texto: 'Calendário com as revisões de cada dia, limite diário e taxa de acerto.' },
      { imagem: 'deload-flashcards', nome: 'Flashcards', texto: 'Mais de 2 mil cartões em pastas por matéria, com o progresso de cada uma.' },
      { imagem: 'deload-simulados', nome: 'Simulados e provas', texto: 'Acervo de provas por instituição e ano, com painel de desempenho e ranking geral.' },
      { imagem: 'deload-questoes', nome: 'Biblioteca autoral', texto: 'Listas de questões inéditas por área e nível, materiais e apostilas da mentoria.' },
      { imagem: 'deload-checklist', nome: 'Checklist de conteúdos', texto: 'Todos os conteúdos do ENEM por matéria, para o aluno marcar o que já estudou.' },
    ],
    celular: [
      { imagem: 'deload-celular-inicio', nome: 'Painel no celular', texto: 'Os blocos do painel empilham na tela do celular.' },
      { imagem: 'deload-celular-flashcards', nome: 'Flashcards no celular', texto: 'Pastas por matéria fáceis de tocar.' },
      { imagem: 'deload-celular-simulados', nome: 'Simulados no celular', texto: 'Provas recentes em cartões, com acesso rápido.' },
    ],
  },
  engenharia: [
    ['Agendamento de revisões por aluno', 'O conteúdo estudado volta ao calendário em revisões espaçadas. A plataforma organiza as sessões por dia, com limite diário e registro de acertos para acompanhar a evolução de cada aluno.'],
    ['Simulados com análise de desempenho', 'As respostas das provas alimentam a correção, os indicadores de desempenho e o ranking. O aluno acompanha seus resultados dentro do mesmo sistema em que realiza os simulados.'],
    ['Flashcards com progresso individual', 'Cartões organizados por matéria e pasta mantêm o progresso de estudo de cada aluno. O acervo e os resultados se conectam ao painel de acompanhamento da plataforma.'],
    ['Assistentes de IA no ambiente de estudo', 'Assistentes próprios atendem dúvidas dentro da plataforma. A integração reúne consulta à IA, materiais e prática de questões no mesmo ambiente de aprendizagem.'],
    ['Autenticação e acesso por plano', 'Login por Google ou e-mail identifica a conta do aluno, enquanto as regras de acesso determinam os recursos disponíveis no seu plano. A plataforma reúne interface, servidor e persistência dos dados de estudo.'],
    ['Integração de materiais com Google Drive', 'Handlers de API fazem a ponte entre a plataforma e o Drive para acesso e upload de arquivos. A biblioteca integra o acervo de materiais à área do aluno.'],
  ],
  design: [
    ['Três temas visuais', 'Escuro, claro e outono. A troca acontece na hora e muda a interface inteira.'],
    ['Marca presente na interface', 'O laranja da Deload guia as ações e o símbolo da marca aparece ao fundo da entrada.'],
    ['Entrar e criar conta no mesmo lugar', 'Um único cartão com abas, para o aluno não se perder entre páginas.'],
    ['Pensada para o celular', 'Cada tela foi ajustada para funcionar bem em telas pequenas.'],
  ],
};

const welove: Projeto = {
  id: 'welove',
  nome: 'We Love Gastrobar',
  titulo: ['Reservas e gestão', 'de um gastrobar'],
  chamada: 'Escolha de mesas no mapa, reservas online e painel administrativo para gerir o restaurante.',
  tipo: 'Site, reservas e gestão do restaurante',
  local: 'Bosque, Rio Branco (AC)',
  capa: 'welove-abertura',
  destaque: true,
  resumo: [
    'Construí o site e o sistema de gestão do We Love Gastrobar, em Rio Branco. O cliente escolhe onde sentar e faz a reserva online; a equipe acompanha as reservas, organiza os ambientes e cuida do conteúdo da casa pelo painel administrativo.',
    'Fiz o front, as APIs, a integração com Firebase e Google Drive e os testes automáticos. A identidade noturna, com cores de neon, foi pedida pela casa.',
  ],
  destaques: [
    ['Sistema de reservas', 'Mapa interativo para explorar os ambientes e escolher mesas ou combinações para o grupo. A disponibilidade é conferida pelo servidor; depois, o cliente acompanha a reserva pelo código e telefone.'],
    ['Painel de gestão do restaurante', 'Reservas em lista e calendário, mapa de ocupação e remanejamento de mesas. A equipe também gerencia ambientes, eventos e cardápio, além de editar fotos e textos do site pelo próprio painel.'],
  ],
  nota: 'As telas do painel foram capturadas em uma cópia local, com reservas de demonstração. Nomes, telefones, códigos, datas, contagens e títulos de arquivos aparecem censurados.',
  escopo: ['Sistema de reservas', 'Painel de gestão', 'Mapa interativo de mesas', 'Site', 'Editor de conteúdo', 'APIs', 'Passeio 360°', 'Cardápio impresso', 'Vetorização do logo'],
  tecnologias: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Framer Motion', 'Lenis', 'Firebase', 'Firestore', 'WebGL', 'Vercel Functions'],
  telas: {
    computador: [
      { imagem: 'welove-abertura', nome: 'Abertura', texto: 'A fachada iluminada abre o site, com os botões de reserva e cardápio logo de cara.' },
      { imagem: 'welove-admin-painel', nome: 'Painel principal', texto: 'Visão geral da gestão, com indicadores, calendário de reservas e eventos e os agendamentos do dia.' },
      { imagem: 'welove-admin-reservas', nome: 'Gestão de reservas', texto: 'Sistema de reservas que desenvolvi para a casa. A equipe acompanha os agendamentos, registra a chegada e finaliza o atendimento pelo painel.' },
      { imagem: 'welove-admin-reserva-detalhes', nome: 'Detalhes da reserva', texto: 'Mesa, convidados, situação e contato reunidos no mesmo lugar, com ações de check-in, cancelamento e envio de mensagem.' },
      { imagem: 'welove-admin-biblioteca', nome: 'Biblioteca de mídia', texto: 'Fotos, vídeos, imagens 360° e logo organizados por categoria, com busca, upload e integração com o Google Drive.' },
      { imagem: 'welove-atmosfera', nome: 'Atmosfera da casa', texto: 'Mosaico de fotos em movimento contínuo, que a equipe troca pelo painel.' },
      { imagem: 'welove-cardapio', nome: 'Cardápio', texto: 'O cardápio completo, com fotos, preços, categorias e busca. Sai do mesmo catálogo do cardápio impresso.' },
      { imagem: 'welove-horarios', nome: 'Horários e localização', texto: 'Horários de cada dia, com destaque para hoje, e o mapa com rota pelo Google Maps ou Waze.' },
    ],
    celular: [
      { imagem: 'welove-celular', nome: 'Abertura no celular', texto: 'Versão enxuta para o celular, onde está a maior parte do público.' },
      { imagem: 'welove-celular-cardapio', nome: 'Cardápio no celular', texto: 'Categorias que deslizam para o lado e busca de pratos e drinks.' },
    ],
  },
  engenharia: [
    ['Motor de disponibilidade de mesas', 'O servidor cruza capacidade dos ambientes, horários de funcionamento e eventos recorrentes para calcular as opções de reserva. A escolha feita no mapa passa por uma nova conferência de disponibilidade antes da confirmação.'],
    ['Gestão do ciclo de atendimento', 'A reserva passa pelo agendamento, check-in e finalização no painel. A equipe consulta a ocupação em lista, calendário ou mapa e pode remanejar mesas conforme a operação da casa.'],
    ['Sincronização em tempo real', 'Lista, calendário e detalhes recebem atualizações do Firestore por assinaturas em tempo real. As alterações aparecem após a confirmação da gravação, mantendo as diferentes visões ligadas ao estado persistido da reserva.'],
    ['Segurança do painel', 'Verificação em duas etapas por aplicativo autenticador, Firebase App Check nas APIs, limite de tentativas por aparelho e sessão encerrada após 30 minutos sem uso.'],
    ['Motor 360° próprio em WebGL', 'O passeio virtual roda num visualizador que escrevi do zero, com shader próprio, carregado só quando o visitante abre.'],
    ['Backend separado da interface', 'APIs serverless executam as regras de negócio com Firebase Admin e integram o Google Drive. Reservas, conteúdo e arquivos são tratados por serviços do servidor, separados dos componentes de apresentação.'],
    ['Catálogo único para web e impressão', 'O mesmo catálogo alimenta o cardápio digital e a geração de um PDF A4 com produtos, preços e fotos. A composição das páginas é automatizada para produzir o material de impressão a partir dos dados do restaurante.'],
    ['Gestão de conteúdo e arquivos', 'O painel permite editar o conteúdo público e organizar fotos, vídeos e panoramas em uma biblioteca integrada ao Google Drive. A equipe administra o acervo usado pelo site em um só lugar.'],
  ],
  design: [
    ['Identidade noturna', 'Fundo escuro, magenta para as ações principais e verde-água de apoio, seguindo as cores do logo vetorizado por mim.'],
    ['Movimento na rolagem', 'Framer Motion e Lenis: seções que entram com a rolagem, mosaico em movimento contínuo e títulos animados por letra.'],
    ['Celular em primeiro lugar', 'Menos texto no topo, barra fixa de ações e seletor de horário próprio, que cabe na tela em qualquer aparelho.'],
    ['Editor visual para a equipe', 'A equipe troca fotos e textos das seções pelo painel, sem mexer em código.'],
  ],
};

const natto: Projeto = {
  id: 'natto',
  nome: 'Natto Bistrô & Café',
  titulo: ['Um bistrô de', 'alma amazônica'],
  chamada: 'Cardápio, reserva pelo WhatsApp e uma abertura que se monta com a rolagem.',
  tipo: 'Site de restaurante',
  local: 'Village Wilde Maciel, Rio Branco (AC)',
  capa: 'natto-abertura',
  destaque: true,
  resumo: [
    'O Natto é um bistrô e café em Rio Branco que junta pratos de bistrô com ingredientes da Amazônia, como tucupi, jambu e castanha.',
    'Desenvolvi o site com consulta ao cardápio oficial, localização e solicitação de reserva pelo WhatsApp. A integração com os serviços da casa reúne a apresentação do restaurante e o caminho até o atendimento.',
  ],
  link: { href: 'https://natto-bistro.vercel.app', texto: 'natto-bistro.vercel.app' },
  escopo: ['Pesquisa da marca', 'Paleta e tipografia', 'Site completo', 'Sistema de animação', 'Reserva pelo WhatsApp', 'Publicação na Vercel'],
  tecnologias: ['React', 'TypeScript', 'Vite', 'Framer Motion', 'Lenis'],
  telas: {
    computador: [
      { imagem: 'natto-abertura', nome: 'Abertura', texto: 'A foto do prato se abre a partir do centro e o título aparece letra por letra.' },
      { imagem: 'natto-cozinha', nome: 'A cozinha', texto: 'Texto à esquerda e três fotos de pratos, a do meio um pouco mais baixa.' },
      { imagem: 'natto-amazonia', nome: 'Sabores da Amazônia', texto: 'Fundo pêssego, fotos dos pratos e a palavra "nativo" correndo ao fundo com a rolagem.' },
      { imagem: 'natto-cardapio', nome: 'Cardápio', texto: 'Um botão redondo abre o cardápio oficial dentro do próprio site.' },
      { imagem: 'natto-momentos', nome: 'Seu momento', texto: 'Abas com sublinhado que desliza e foto que troca por dissolução.' },
      { imagem: 'natto-local', nome: 'O local', texto: 'A foto da entrada com o topo em arco e o mapa ao lado.' },
      { imagem: 'natto-reserva', nome: 'Reserva', texto: 'O formulário monta a mensagem e abre o WhatsApp da casa.' },
    ],
    celular: [
      { imagem: 'natto-celular', nome: 'Abertura no celular', texto: 'O texto sobe para o fundo escuro e o prato aparece inteiro embaixo.' },
      { imagem: 'natto-cozinha-celular', nome: 'A cozinha no celular', texto: 'As fotos se reorganizam em grade e o texto continua fácil de ler.' },
      { imagem: 'natto-amazonia-celular', nome: 'Sabores no celular', texto: 'As fotos dos pratos em duas colunas.' },
      { imagem: 'natto-reserva-celular', nome: 'Reserva no celular', texto: 'Campos com 16 px para o iPhone não dar zoom quando a pessoa toca neles.' },
    ],
  },
  engenharia: [
    ['Solicitação de reserva integrada ao WhatsApp', 'O formulário transforma os dados preenchidos em uma mensagem estruturada e abre a conversa com o restaurante. O visitante revisa e envia a solicitação pelo WhatsApp, onde a equipe dá continuidade ao atendimento.'],
    ['Integração com o cardápio oficial', 'O cardápio do Saipos abre dentro do site em uma janela de consulta. O restaurante mantém produtos e preços no sistema que já utiliza, sem precisar atualizar um segundo catálogo no site.'],
    ['Arquitetura estática com serviços externos', 'A aplicação em React e TypeScript é compilada pelo Vite em arquivos estáticos. Cardápio, localização e contato se conectam aos serviços externos, permitindo publicar o site sem manter um servidor de aplicação próprio.'],
    ['Carregamento progressivo de imagens', 'A imagem de abertura recebe prioridade, enquanto as fotos das outras seções carregam sob demanda. Essa estratégia distribui o download do acervo fotográfico conforme a navegação e reduz a disputa de recursos na entrada.'],
  ],
  design: [
    ['Paleta tirada da marca', 'Pêssego da logo, terracota da cerâmica dos pratos e um marrom quente no rodapé. As seções alternam claro e colorido.'],
    ['Três fontes com papéis definidos', 'Cormorant Garamond nos títulos, Fraunces na marca e Manrope no texto e nos botões.'],
    ['Abertura em três tempos', 'A marca se monta numa cortina escura, a cortina sobe e o prato principal se abre do centro como numa tela de cinema.'],
    ['Cada seção do tamanho da tela', 'Medidas pela altura da janela para nenhuma seção ficar cortada, testado em 1366 × 680.'],
  ],
};

const metatracker: Projeto = {
  id: 'metatracker',
  nome: 'MetaTracker',
  titulo: ['Congressos', 'médicos em dia'],
  chamada: 'Prazos de congressos médicos atualizados por uma IA que pesquisa na web.',
  tipo: 'Sistema médico com IA',
  local: 'Meta-Analysis Academy',
  capa: 'metatracker-painel',
  resumo: [
    'A Meta-Analysis Academy ensina médicos e estudantes de medicina a fazer revisões sistemáticas e metanálises, e muitos desses trabalhos são apresentados em congressos médicos. O MetaTracker reúne os congressos que a academia acompanha, com a data do evento, a abertura e o fechamento das submissões de resumos, os prazos de late-breaking e a data de aceite.',
    'Construí o sistema inteiro: a tabela editável, o login com níveis de acesso, o painel administrativo e um robô que usa a IA do Google com pesquisa na web para manter os prazos atualizados. A base começou com 342 congressos de 32 especialidades, importados da planilha oficial da academia.',
  ],
  nota: 'É um sistema interno, acessado com login. Nas telas, os dados dos congressos aparecem censurados e o painel administrativo usa contas de exemplo.',
  escopo: ['Interface', 'Servidor', 'Banco de dados', 'Robô de IA', 'Autenticação', 'Painel administrativo', 'Exportação em PDF e Excel', 'Português e inglês'],
  tecnologias: ['JavaScript', 'Vite', 'Node.js', 'Express', 'Firebase Auth', 'Firestore', 'Google Gemini', 'jsPDF', 'Vercel'],
  telas: {
    computador: [
      { imagem: 'metatracker-painel', nome: 'Painel de congressos', texto: 'Todos os congressos numa tabela, com os prazos de submissão de cada um, busca e filtro por coluna.' },
      { imagem: 'metatracker-admin', nome: 'Robô de IA', texto: 'O administrador acompanha o robô que pesquisa os prazos na web, roda uma atualização na hora e controla quem pode editar.' },
      { imagem: 'metatracker-novo', nome: 'Novo congresso', texto: 'A equipe cadastra um congresso com especialidade, datas e prazos, e o robô passa a mantê-lo atualizado.' },
      { imagem: 'metatracker-colunas', nome: 'Colunas sob medida', texto: 'A equipe cria colunas próprias, como status ou responsável, e escolhe quais aparecem.' },
      { imagem: 'metatracker-login', nome: 'Entrada', texto: 'Login por e-mail ou pela conta Google, em português ou inglês.' },
    ],
    celular: [
      { imagem: 'metatracker-celular', nome: 'Tabela no celular', texto: 'A tabela continua legível no celular, com paginação no fim da lista.' },
      { imagem: 'metatracker-celular-login', nome: 'Entrada no celular', texto: 'O mesmo login, ajustado para a tela pequena.' },
    ],
  },
  engenharia: [
    ['Pesquisa automatizada com saída estruturada', 'O backend consulta o Gemini com pesquisa do Google para localizar a próxima edição de cada congresso. Datas do evento e prazos de submissão retornam em um JSON com campos definidos, que o sistema processa para atualizar o cadastro.'],
    ['Processamento em lotes e controle de cota', 'O robô prioriza os congressos há mais tempo sem atualização e processa pequenos lotes, com intervalos entre chamadas à API. A mesma operação pode ser acionada pelo administrador para um lote ou um congresso específico.'],
    ['Validação temporal e histórico de execução', 'Antes de substituir os dados, o sistema verifica o ano da edição retornada pela IA. Respostas de edições passadas são descartadas; atualizações e falhas ficam registradas no histórico para acompanhamento da equipe.'],
    ['Níveis de acesso', 'Login com Firebase, token conferido no servidor em toda chamada e dois papéis: o administrador edita e o leitor consulta. Ninguém consegue mudar o próprio papel.'],
    ['Persistência com alternativa local', 'O Firestore centraliza os registros e o servidor mantém uma cópia em JSON como alternativa de armazenamento em caso de indisponibilidade. A inicialização também permite migrar a base local para o banco remoto.'],
    ['Servidor protegido', 'Cabeçalhos de segurança com Helmet, política de conteúdo em produção e limite de requisições por IP, mais rígido na rota que confere e-mails.'],
    ['Exportação no navegador', 'O relatório em PDF A4 é montado no próprio navegador com jsPDF e a planilha para Excel sai com as cores da academia, sempre respeitando os filtros aplicados.'],
  ],
  design: [
    ['Manual da marca aplicado', 'Azul Delft, verde Tiffany e a fonte Ruda vieram do manual da marca da Meta-Analysis Academy, junto com o logo em forma de forest plot.'],
    ['Claro e escuro', 'Os dois temas usam a paleta da marca e trocam na hora, tanto no login quanto no painel.'],
    ['Português e inglês', 'A interface inteira troca de idioma sem recarregar a página. Os dados dos congressos ficam no idioma original.'],
    ['Leitura de planilha', 'Cabeçalho azul com o filtro logo abaixo de cada título e linhas compactas, para ler muitos prazos de uma vez.'],
  ],
};

export const projetos = [natto, welove, deload, metatracker];

export const passos = [
  ['Conversa', 'Você conversa direto comigo. Entendo como o seu negócio funciona e combinamos o que o projeto precisa ter.'],
  ['Proposta', 'As funcionalidades e os ajustes da manutenção ficam por escrito, na proposta ou em contrato, como você preferir.'],
  ['Construção', 'Começo o que dá enquanto você junta fotos e textos. Combino 20 dias úteis a partir do envio dos materiais e costumo entregar antes.'],
  ['Entrega', 'Publico o site com domínio no seu nome e HTTPS. Depois continuo cuidando dele com a manutenção mensal.'],
];

export const stack = [
  { grupo: 'Interface', itens: ['React', 'TypeScript', 'Next.js', 'Vite', 'Tailwind', 'Framer Motion', 'Lenis', 'WebGL'] },
  { grupo: 'Servidor e dados', itens: ['Node.js', 'Express', 'Python', 'Firebase', 'Firestore', 'APIs serverless'] },
  { grupo: 'Integrações', itens: ['Google Drive', 'Pagamentos', 'WhatsApp', 'Inteligência artificial', 'IA com pesquisa na web'] },
  { grupo: 'Publicação', itens: ['Vercel', 'Hostinger', 'Domínio e HTTPS'] },
];
