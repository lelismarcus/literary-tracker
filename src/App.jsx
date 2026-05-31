import { useState, useEffect } from "react";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
document.head.appendChild(fontLink);

const C = {
  bg: "#161618", surface: "#1E1E21", card: "#242428", border: "#2E2E33",
  text: "#EEEEF0", textMid: "#A0A0AA", textSoft: "#65656E",
  opal: "#3D9E82", opalDim: "#1E3830", opalLight: "#52BFA0",
  danger: "#C0504A", lido: "#3D9E82", lendo: "#5B8FCC", naoLido: "#48484F",
};

const PERIOD_COLORS = {
  "Romantismo Gótico": "#8B6AAF", "Pré-realismo": "#4A7AAA",
  "Romantismo tardio": "#B87040", "Transição": "#9A9A30",
  "Realismo vitoriano": "#3D9E82", "Realismo tardio": "#4A7A50",
  "Naturalismo": "#4A6A30", "Estetismo": "#B04848",
};

function periodColor(p) {
  if (!p) return C.textSoft;
  for (const [k, v] of Object.entries(PERIOD_COLORS))
    if (p.toLowerCase().includes(k.toLowerCase().split(" ")[0].toLowerCase())) return v;
  return C.textSoft;
}

const ERA_VITORIANA_BOOKS = [
  { id:"b1",  titulo:"Os Mistérios de Udolfo",        autor:"Ann Radcliffe",    ano:"1794", periodo:"Romantismo Gótico",                       resumo:"Matriz do romance gótico inglês. Estabelece a arquitetura que as Brontë herdarão e subverterão: a mansão isolada, o segredo enterrado, a mulher ameaçada.", ebook:false, paginas:672, progresso:0,   comentarios:[] },
  { id:"b2",  titulo:"Frankenstein",                   autor:"Mary Shelley",     ano:"1818", periodo:"Romantismo Gótico",                       resumo:"Escrito no núcleo do Romantismo, excede seu tempo: antecipa a ficção científica e critica o otimismo iluminista.", ebook:false, paginas:280, avaliacao:null, progresso:0, comentarios:[] },
  { id:"b3",  titulo:"Razão e Sensibilidade",          autor:"Jane Austen",      ano:"1811", periodo:"Pré-realismo / Neoclassicismo tardio",     resumo:"Austen antecipa o realismo antes do Romantismo vitoriano. Ironia social precisa, linguagem controlada, casamento como problema filosófico.", ebook:false, paginas:374, avaliacao:null, progresso:0, comentarios:[] },
  { id:"b4",  titulo:"Emma",                           autor:"Jane Austen",      ano:"1815", periodo:"Pré-realismo / Neoclassicismo tardio",     resumo:"Ponto alto da ironia austeniana. Emma Woodhouse é uma das personagens mais complexas da literatura inglesa.", ebook:false, paginas:474, avaliacao:null, progresso:0, comentarios:[] },
  { id:"b5",  titulo:"O Morro dos Ventos Uivantes",   autor:"Emily Brontë",     ano:"1847", periodo:"Romantismo tardio / Transição",            resumo:"O caos emocional vence a contenção formal. É o romance mais próximo do Romantismo gótico — a emoção como força bruta que recusa qualquer domesticação.", ebook:false, paginas:348, progresso:100, avaliacao:null, comentarios:[] },
  { id:"b6",  titulo:"Jane Eyre",                     autor:"Charlotte Brontë", ano:"1847", periodo:"Romantismo tardio / Transição",            resumo:"No limiar entre Romantismo e Realismo. Romantismo com esqueleto proto-realista. A voz em primeira pessoa inaugura uma nova subjetividade feminina.", ebook:false, paginas:532, progresso:100, avaliacao:null, comentarios:[] },
  { id:"b7",  titulo:"A Inquilina de Wildfell Hall",  autor:"Anne Brontë",      ano:"1848", periodo:"Transição / Proto-realismo",               resumo:"A mais realista das três Brontë. O trauma estrutura a voz. Anne é a única que critica o herói byroniano em vez de romantizá-lo.", ebook:false, paginas:490, avaliacao:null, progresso:45, comentarios:[] },
  { id:"b8",  titulo:"David Copperfield",             autor:"Charles Dickens",  ano:"1850", periodo:"Realismo vitoriano",                       resumo:"O bildungsroman realista por excelência. A subjetividade embedada no social e histórico — infância traumática, trabalho infantil, mobilidade social.", ebook:false, paginas:882, avaliacao:null, progresso:0, comentarios:[] },
  { id:"b9",  titulo:"O Moinho no Floss",             autor:"George Eliot",     ano:"1860", periodo:"Realismo vitoriano",                       resumo:"Mais próximo emocionalmente das Brontë. Maggie Tulliver tem o ímpeto de Jane Eyre mas vive num mundo que Eliot recusa a transfigurar romanticamente.", ebook:false, paginas:520, avaliacao:null, progresso:0, comentarios:[] },
  { id:"b10", titulo:"Middlemarch",                   autor:"George Eliot",     ano:"1871", periodo:"Realismo vitoriano",                       resumo:"O ponto mais alto do realismo vitoriano. Eliot examina com rigor filosófico as limitações que a sociedade impõe ao indivíduo.", ebook:false, paginas:904, avaliacao:null, progresso:0, comentarios:[] },
  { id:"b11", titulo:"Longe da Multidão Enlouquecida",autor:"Thomas Hardy",     ano:"1874", periodo:"Realismo tardio / Proto-naturalismo",      resumo:"O campo inglês destruído pela industrialização. O realismo começa a escurecer — o determinismo social e biológico começa a pesar.", ebook:false, paginas:418, avaliacao:null, progresso:0, comentarios:[] },
  { id:"b12", titulo:"Tess of the d'Urbervilles",     autor:"Thomas Hardy",     ano:"1891", periodo:"Naturalismo vitoriano",                    resumo:"O indivíduo contra forças sem rosto. O otimismo vitoriano está definitivamente extinto neste romance implacável.", ebook:false, paginas:448, avaliacao:null, progresso:0, comentarios:[] },
  { id:"b13", titulo:"O Retrato de Dorian Gray",      autor:"Oscar Wilde",      ano:"1890", periodo:"Estetismo / Decadentismo",                 resumo:"Contraponto direto ao realismo. Wilde declara que a arte não deve nada à moral. Resposta sofisticada à seriedade moral de Eliot e Dickens.", ebook:false, paginas:254, avaliacao:null, progresso:0, comentarios:[] },
];

const INITIAL_PROJECTS = [
  { id:"p1",     titulo:"Era Vitoriana", descricao:"Literatura inglesa do séc. XVIII ao XIX, do Romantismo ao Decadentismo.", livros:ERA_VITORIANA_BOOKS.map(b=>b.id) },
  { id:"outros", titulo:"Outros",        descricao:"Livros sem projeto definido.", livros:[] },
];

function pct(b) {
  if (b.ebook) return Math.min(b.progresso, 100);
  return b.paginas > 0 ? Math.min(Math.round((b.progresso/b.paginas)*100), 100) : 0;
}
function statusLabel(p) { return p>=100?"Lido":p>0?"Lendo":"Não lido"; }
function statusColor(p) { return p>=100?C.lido:p>0?C.lendo:C.naoLido; }

async function callClaude(body) {
  const res = await fetch("/api/claude", {
    method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body),
  });
  return res.json();
}

async function fetchBookInfo(titulo) {
  const data = await callClaude({ model:"claude-opus-4-5", max_tokens:800, messages:[{ role:"user", content:`Retorne APENAS um JSON sem markdown para o livro "${titulo}": {"autor":"...","ano":"...","periodo":"período literário em português","resumo":"resumo em 2 frases"}. Se não encontrado: {"erro":"Livro não encontrado"}` }] });
  const text = data.content?.find(b=>b.type==="text")?.text || "";
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

async function fetchContextualizacao(livro, projeto, todos) {
  const titulos = todos.map(l=>`${l.titulo} (${l.ano})`).join(", ");
  const data = await callClaude({ model:"claude-opus-4-5", max_tokens:500, messages:[{ role:"user", content:`Projeto: "${projeto.titulo}". Livros: ${titulos}. Em 2-3 frases, contextualize "${livro.titulo}" (${livro.autor}, ${livro.ano}) neste projeto. Responda apenas o texto.` }] });
  return data.content?.find(b=>b.type==="text")?.text || livro.resumo;
}

function sortBooks(livros) {
  const lendo  = livros.filter(b=>{const p=pct(b);return p>0&&p<100;});
  const outros = livros.filter(b=>{const p=pct(b);return p===0||p>=100;});
  lendo.sort((a,b)=>pct(b)-pct(a));
  const po={};
  outros.forEach(b=>{if(!po[b.periodo])po[b.periodo]=parseInt(b.ano)||9999;else po[b.periodo]=Math.min(po[b.periodo],parseInt(b.ano)||9999);});
  outros.sort((a,b)=>{const d=(po[a.periodo]||9999)-(po[b.periodo]||9999);return d!==0?d:(parseInt(a.ano)||0)-(parseInt(b.ano)||0);});
  return {lendo,outros};
}

const GS = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#161618;color:#EEEEF0;font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;}input,textarea,select,button{font-family:inherit;}button{cursor:pointer;}::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:#161618;}::-webkit-scrollbar-thumb{background:#2E2E33;border-radius:2px;}@keyframes spin{to{transform:rotate(360deg);}}`;

const Icons = {
  Plus:()=><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  Close:()=><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  Edit:()=><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.5 2.5l3 3L4 15H1v-3L10.5 2.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  Comment:()=><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2h12v9H8l-4 3v-3H2V2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  Search:()=><svg width="17" height="17" viewBox="0 0 17 17" fill="none"><circle cx="7.5" cy="7.5" r="5" stroke="currentColor" strokeWidth="1.8"/><path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  ChevronDown:()=><svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 5.5l4.5 4.5L12 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ChevronUp:()=><svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 9.5L7.5 5l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Folder:()=><svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1.5 3.5a1 1 0 011-1h3l1.5 1.5h5a1 1 0 011 1v6a1 1 0 01-1 1h-10a1 1 0 01-1-1v-7.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  Trash:()=><svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2.5 4.5h10M5.5 4.5V3h4v1.5M5.5 7v4M9.5 7v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M3.5 4.5l.7 7.5h6.6l.7-7.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  Book:()=><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="3" y="3" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M8 8h10M8 12h10M8 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Spin:()=><svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{animation:"spin 1s linear infinite"}}><circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="2" strokeDasharray="22 8" strokeLinecap="round"/></svg>,
};

function StatusBadge({p}) {
  const l=statusLabel(p), c=statusColor(p);
  return <span style={{padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:600,letterSpacing:"0.04em",background:c+"22",color:c,border:`1px solid ${c}44`}}>{l}</span>;
}

function ProgressBar({livro,onChange}) {
  const p=pct(livro), bc=p>=100?C.lido:p>0?C.lendo:C.border;
  const label=livro.ebook?`${p}%`:`${Math.min(livro.progresso,livro.paginas)} / ${livro.paginas}`;
  const btn={width:32,height:32,borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.textMid,fontSize:20,fontWeight:400,display:"flex",alignItems:"center",justifyContent:"center"};
  return (
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <button onClick={()=>onChange(-1)} style={btn}>−</button>
      <div style={{flex:1,height:5,background:C.border,borderRadius:3,overflow:"hidden"}}>
        <div style={{width:`${p}%`,height:"100%",background:bc,borderRadius:3,transition:"width 0.3s"}}/>
      </div>
      <button onClick={()=>onChange(1)} style={btn}>+</button>
      <span style={{fontSize:12,color:C.textSoft,minWidth:54,textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{label}</span>
    </div>
  );
}

function BookCard({livro,projeto,todos,onEdit,onUpdateProgress,onAddComment,onRate}) {
  const [expanded,setExpanded]=useState(false);
  const [ctx,setCtx]=useState(null);
  const [loadingCtx,setLoadingCtx]=useState(false);
  const [showComment,setShowComment]=useState(false);
  const [commentText,setCommentText]=useState("");
  const [editingRating,setEditingRating]=useState(false);
  const col=periodColor(livro.periodo);
  const p=pct(livro);

  async function toggleCtx() {
    if(expanded){setExpanded(false);return;}
    setExpanded(true);
    if(ctx||loadingCtx)return;
    setLoadingCtx(true);
    try{const c=await fetchContextualizacao(livro,projeto,todos);setCtx(c);}
    catch{setCtx(livro.resumo);}
    setLoadingCtx(false);
  }

  function saveComment() {
    if(!commentText.trim())return;
    onAddComment(livro.id,commentText.trim());
    setCommentText("");setShowComment(false);
  }

  const iconBtn={width:36,height:36,borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:C.textMid,display:"flex",alignItems:"center",justifyContent:"center"};

  return (
    <div style={{background:C.card,borderRadius:16,marginBottom:10,overflow:"hidden",border:`1px solid ${C.border}`}}>
      <div style={{height:3,background:col}}/>
      <div style={{padding:"16px 16px 14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
              <StatusBadge p={p}/>
              <span style={{fontSize:11,color:col,fontWeight:600}}>{livro.periodo}</span>
            </div>
            <div style={{fontSize:17,fontWeight:700,color:C.text,lineHeight:1.25,marginBottom:3}}>{livro.titulo}</div>
            <div style={{fontSize:13,color:C.textMid}}>{livro.autor} · {livro.ano}</div>
            {livro.avaliacao&&<div style={{marginTop:4,cursor:"pointer"}} onClick={()=>setEditingRating(e=>!e)}><StarRating avaliacao={livro.avaliacao} readonly={true}/></div>}
          </div>
          <div style={{display:"flex",gap:6,marginLeft:10,flexShrink:0}}>
            <button onClick={()=>onEdit(livro)} style={iconBtn} title="Editar"><Icons.Edit/></button>
            <button onClick={()=>setShowComment(s=>!s)} style={{...iconBtn,border:`1px solid ${showComment?C.opal:C.border}`,background:showComment?C.opalDim:C.surface,color:showComment?C.opal:C.textMid}} title="Comentário"><Icons.Comment/></button>
          </div>
        </div>
        <ProgressBar livro={livro} onChange={d=>onUpdateProgress(livro.id,d)}/>
        {pct(livro)>=100&&!livro.avaliacao&&(
          <div style={{marginTop:12,padding:"10px 12px",background:C.opalDim,borderRadius:10,border:`1px solid ${C.opal}44`}}>
            <div style={{fontSize:12,color:C.opal,fontWeight:600,marginBottom:8}}>Avalie sua leitura</div>
            <StarRating avaliacao={livro.avaliacao} onRate={n=>{onRate(livro.id,n);}}/>
          </div>
        )}
        {livro.avaliacao&&editingRating&&(
          <div style={{marginTop:8,padding:"10px 12px",background:C.opalDim,borderRadius:10,border:`1px solid ${C.opal}44`}}>
            <div style={{fontSize:12,color:C.opal,fontWeight:600,marginBottom:8}}>Alterar avaliação</div>
            <StarRating avaliacao={livro.avaliacao} onRate={n=>{onRate(livro.id,n);setEditingRating(false);}}/>
          </div>
        )}
      </div>

      <button onClick={toggleCtx} style={{width:"100%",padding:"10px 16px",background:C.surface,border:"none",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",color:C.textSoft,fontSize:12,fontWeight:600,letterSpacing:"0.05em"}}>
        <span>CONTEXTO LITERÁRIO</span>
        {expanded?<Icons.ChevronUp/>:<Icons.ChevronDown/>}
      </button>
      {expanded&&(
        <div style={{padding:"12px 16px 14px",background:C.surface,borderTop:`1px solid ${C.border}`}}>
          {loadingCtx
            ?<div style={{display:"flex",alignItems:"center",gap:8,color:C.opal,fontSize:13}}><Icons.Spin/> Carregando...</div>
            :<div style={{fontSize:14,color:C.textMid,lineHeight:1.65}}>{ctx||livro.resumo}</div>
          }
        </div>
      )}

      {livro.comentarios?.length>0&&(
        <div style={{borderTop:`1px solid ${C.border}`,padding:"12px 16px"}}>
          {livro.comentarios.map((c,i)=>(
            <div key={i} style={{fontSize:13,color:C.textMid,padding:"8px 12px",background:C.opalDim,borderLeft:`3px solid ${C.opal}`,borderRadius:8,marginBottom:6,lineHeight:1.6}}>
              "{c.texto}"
              <div style={{fontSize:11,color:C.textSoft,marginTop:4}}>{c.data}</div>
            </div>
          ))}
        </div>
      )}

      {showComment&&(
        <div style={{borderTop:`1px solid ${C.border}`,padding:"12px 16px",background:C.surface}}>
          <textarea value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Adicionar quote ou observação..." rows={3}
            style={{width:"100%",fontSize:14,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 12px",resize:"vertical",background:C.card,color:C.text,outline:"none",lineHeight:1.5}}/>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <button onClick={saveComment} style={{padding:"10px 20px",borderRadius:10,border:"none",background:C.opal,color:"#fff",fontSize:14,fontWeight:600}}>Salvar</button>
            <button onClick={()=>setShowComment(false)} style={{padding:"10px 16px",borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:C.textMid,fontSize:14}}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}


function StarRating({avaliacao, onRate, readonly=false}) {
  const [hover, setHover] = useState(null);
  return (
    <div style={{display:"flex",alignItems:"center",gap:3}}>
      {[1,2,3,4,5].map(n=>(
        <span key={n}
          onClick={()=>!readonly&&onRate&&onRate(n===avaliacao?null:n)}
          onMouseEnter={()=>!readonly&&setHover(n)}
          onMouseLeave={()=>!readonly&&setHover(null)}
          style={{fontSize:readonly?16:22,cursor:readonly?"default":"pointer",lineHeight:1,
            color:(hover||avaliacao)>=n?"#F5C518":"#3A3A40",transition:"color 0.1s"}}>
          ★
        </span>
      ))}
    </div>
  );
}

function Label({children}) {
  return <div style={{fontSize:12,fontWeight:600,color:C.textSoft,letterSpacing:"0.06em",marginBottom:6,textTransform:"uppercase"}}>{children}</div>;
}
const inputSt={width:"100%",padding:"12px 14px",border:`1px solid #2E2E33`,borderRadius:12,fontSize:14,color:"#EEEEF0",background:"#1E1E21",outline:"none",display:"block"};

function BookForm({initial,projects,onSave,onDelete,onCancel}) {
  const isEdit=!!initial?.id;
  const [form,setForm]=useState(initial||{titulo:"",autor:"",ano:"",periodo:"",resumo:"",ebook:false,paginas:200,progresso:0,comentarios:[],projetoId:projects[0]?.id||"outros"});
  const [searching,setSearching]=useState(false);
  const [searchMsg,setSearchMsg]=useState("");
  const [newProj,setNewProj]=useState(false);
  const [npTit,setNpTit]=useState("");
  const [npDesc,setNpDesc]=useState("");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  async function handleSearch() {
    if(!form.titulo.trim())return;
    setSearching(true);setSearchMsg("");
    try {
      const data=await fetchBookInfo(form.titulo);
      if(data.erro)setSearchMsg("Livro não encontrado.");
      else{setForm(f=>({...f,autor:data.autor||f.autor,ano:data.ano||f.ano,periodo:data.periodo||f.periodo,resumo:data.resumo||f.resumo}));setSearchMsg("Campos preenchidos pela IA — verifique antes de salvar.");}
    } catch{setSearchMsg("Erro ao buscar. Tente novamente.");}
    setSearching(false);
  }

  function handleSave() {
    if(!form.titulo.trim())return;
    onSave({...form,id:form.id||`b${Date.now()}`,paginas:parseInt(form.paginas)||200,progresso:parseInt(form.progresso)||0,comentarios:form.comentarios||[]},newProj&&npTit?{titulo:npTit,descricao:npDesc}:null);
  }

  return (
    <div style={{padding:"16px 16px 40px"}}>
      <div style={{fontSize:20,fontWeight:700,color:"#EEEEF0",marginBottom:20}}>{isEdit?"Editar livro":"Novo livro"}</div>
      <Label>Nome do livro</Label>
      <div style={{display:"flex",gap:8,marginBottom:4}}>
        <input value={form.titulo} onChange={e=>set("titulo",e.target.value)} placeholder="Título..." style={{...inputSt,flex:1}}/>
        <button onClick={handleSearch} disabled={searching} title="Buscar via IA"
          style={{width:48,height:48,borderRadius:12,border:`1px solid ${C.opal}`,background:C.opalDim,color:C.opal,display:"flex",alignItems:"center",justifyContent:"center",opacity:searching?0.5:1}}>
          {searching?<Icons.Spin/>:<Icons.Search/>}
        </button>
      </div>
      {searchMsg&&<div style={{fontSize:12,color:C.opal,marginBottom:12,lineHeight:1.5}}>{searchMsg}</div>}
      {!searchMsg&&<div style={{marginBottom:12}}/>}
      <Label>Autor</Label>
      <input value={form.autor} onChange={e=>set("autor",e.target.value)} placeholder="Nome do autor" style={{...inputSt,marginBottom:12}}/>
      <div style={{display:"flex",gap:12,marginBottom:12}}>
        <div style={{flex:1}}><Label>Ano</Label><input value={form.ano} onChange={e=>set("ano",e.target.value)} placeholder="1847" style={inputSt}/></div>
        <div style={{flex:2}}><Label>Período literário</Label><input value={form.periodo} onChange={e=>set("periodo",e.target.value)} placeholder="Ex: Realismo vitoriano" style={inputSt}/></div>
      </div>
      <Label>Resumo / Contexto</Label>
      <textarea value={form.resumo} onChange={e=>set("resumo",e.target.value)} placeholder="Contexto literário..." rows={3}
        style={{...inputSt,resize:"vertical",lineHeight:1.5,marginBottom:16}}/>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
        <div onClick={()=>set("ebook",!form.ebook)} style={{width:44,height:26,borderRadius:13,background:form.ebook?C.opal:"#2E2E33",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
          <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:form.ebook?21:3,transition:"left 0.2s"}}/>
        </div>
        <span style={{fontSize:14,color:C.textMid,fontWeight:500}}>Ebook</span>
        {!form.ebook&&<div style={{display:"flex",alignItems:"center",gap:8,marginLeft:8}}><span style={{fontSize:13,color:C.textSoft}}>Páginas</span><input type="number" value={form.paginas} onChange={e=>set("paginas",e.target.value)} style={{...inputSt,width:80,padding:"8px 10px"}}/></div>}
      </div>
      <Label>Projeto</Label>
      <select value={newProj?"__new__":form.projetoId} onChange={e=>{if(e.target.value==="__new__")setNewProj(true);else{setNewProj(false);set("projetoId",e.target.value);}}}
        style={{...inputSt,marginBottom:newProj?8:20}}>
        {projects.map(p=><option key={p.id} value={p.id}>{p.titulo}</option>)}
        <option value="__new__">+ Novo projeto</option>
      </select>
      {newProj&&(
        <div style={{background:C.opalDim,border:`1px solid ${C.opal}44`,borderRadius:12,padding:14,marginBottom:20}}>
          <div style={{fontSize:12,fontWeight:700,color:C.opal,marginBottom:10,letterSpacing:"0.06em"}}>NOVO PROJETO</div>
          <input value={npTit} onChange={e=>setNpTit(e.target.value)} placeholder="Título do projeto" style={{...inputSt,marginBottom:8}}/>
          <textarea value={npDesc} onChange={e=>setNpDesc(e.target.value)} placeholder="Descrição" rows={2} style={{...inputSt,resize:"none",lineHeight:1.5}}/>
        </div>
      )}
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <button onClick={handleSave} style={{padding:"12px 24px",borderRadius:12,border:"none",background:C.opal,color:"#fff",fontSize:14,fontWeight:600}}>Salvar</button>
        <button onClick={onCancel} style={{padding:"12px 20px",borderRadius:12,border:`1px solid #2E2E33`,background:"#1E1E21",color:C.textMid,fontSize:14}}>Cancelar</button>
        {isEdit&&<button onClick={()=>onDelete(form.id)} style={{padding:"12px 16px",borderRadius:12,border:`1px solid ${C.danger}55`,background:"#1E1E21",color:C.danger,fontSize:14,display:"flex",alignItems:"center",gap:6,marginLeft:"auto"}}><Icons.Trash/>Excluir</button>}
      </div>
    </div>
  );
}

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
}

export default function App() {
  const [books,setBooks]=useState(()=>loadFromStorage("ml_books", ERA_VITORIANA_BOOKS));
  const [projects,setProjects]=useState(()=>loadFromStorage("ml_projects", INITIAL_PROJECTS));
  const [activeId,setActiveId]=useState(()=>loadFromStorage("ml_activeId", "p1"));
  const [view,setView]=useState("home");
  const [editingBook,setEditingBook]=useState(null);
  const [projOpen,setProjOpen]=useState(false);

  useEffect(()=>{ try { localStorage.setItem("ml_books", JSON.stringify(books)); } catch {} },[books]);
  useEffect(()=>{ try { localStorage.setItem("ml_projects", JSON.stringify(projects)); } catch {} },[projects]);
  useEffect(()=>{ try { localStorage.setItem("ml_activeId", activeId); } catch {} },[activeId]);

  const activeProj=projects.find(p=>p.id===activeId)||projects[0];
  const projBooks=books.filter(b=>activeProj.livros.includes(b.id));
  const {lendo,outros}=sortBooks(projBooks);
  const byPeriod={};
  outros.forEach(b=>{if(!byPeriod[b.periodo])byPeriod[b.periodo]=[];byPeriod[b.periodo].push(b);});
  const periodGroups=Object.entries(byPeriod).sort(([,a],[,b])=>(parseInt(a[0]?.ano)||0)-(parseInt(b[0]?.ano)||0));
  const lidoCount=projBooks.filter(b=>pct(b)>=100).length;

  function updateProgress(id,delta){setBooks(bs=>bs.map(b=>{if(b.id!==id)return b;const max=b.ebook?100:b.paginas;return{...b,progresso:Math.max(0,Math.min(b.progresso+delta,max))};}));}
  function addComment(id,texto){setBooks(bs=>bs.map(b=>b.id!==id?b:{...b,comentarios:[...(b.comentarios||[]),{texto,data:new Date().toLocaleDateString("pt-BR")}]}));}
  function rateBook(id,avaliacao){setBooks(bs=>bs.map(b=>b.id!==id?b:{...b,avaliacao}));}

  function handleSave(livro,newProjData) {
    let pid=livro.projetoId||"outros";
    let ups=[...projects];
    if(newProjData){const np={id:`p${Date.now()}`,titulo:newProjData.titulo,descricao:newProjData.descricao,livros:[]};ups=[...ups,np];pid=np.id;livro={...livro,projetoId:pid};}
    const isNew=!books.find(b=>b.id===livro.id);
    setBooks(bs=>isNew?[...bs,livro]:bs.map(b=>b.id===livro.id?livro:b));
    setProjects(ups.map(p=>{let l=p.livros.filter(id=>id!==livro.id);if(p.id===pid)l=[...l,livro.id];return{...p,livros:l};}));
    setView("home");setEditingBook(null);
  }

  function handleDelete(id){setBooks(bs=>bs.filter(b=>b.id!==id));setProjects(ps=>ps.map(p=>({...p,livros:p.livros.filter(l=>l!==id)})));setView("home");setEditingBook(null);}

  function SectionLabel({color,children}) {
    return(
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,marginTop:4}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:color,flexShrink:0}}/>
        <span style={{fontSize:11,fontWeight:700,color,letterSpacing:"0.08em",textTransform:"uppercase"}}>{children}</span>
      </div>
    );
  }

  return (
    <>
      <style>{GS}</style>
      <div style={{minHeight:"100vh",background:C.bg,maxWidth:480,margin:"0 auto",paddingBottom:90}}>
        <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"18px 16px 14px",position:"sticky",top:0,zIndex:50}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:22,fontWeight:700,color:C.text,letterSpacing:"-0.02em"}}>Minhas Leituras</div>
              <div style={{fontSize:13,color:C.textSoft,marginTop:2}}>
                {activeProj.titulo} · <span style={{color:C.lido}}>{lidoCount} lidos</span> · <span style={{color:C.lendo}}>{lendo.length} lendo</span>
              </div>
            </div>
            {view==="home"
              ?<button onClick={()=>{setEditingBook(null);setView("form");}} style={{width:44,height:44,borderRadius:14,border:"none",background:C.opal,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}><Icons.Plus/></button>
              :<button onClick={()=>{setView("home");setEditingBook(null);}} style={{width:44,height:44,borderRadius:14,border:`1px solid ${C.border}`,background:C.surface,color:C.textMid,display:"flex",alignItems:"center",justifyContent:"center"}}><Icons.Close/></button>
            }
          </div>
        </div>

        {view==="form"?(
          <BookForm initial={editingBook} projects={projects.filter(p=>p.id!=="outros")}
            onSave={handleSave} onDelete={handleDelete}
            onCancel={()=>{setView("home");setEditingBook(null);}}/>
        ):(
          <div style={{padding:"14px 12px 0"}}>
            {lendo.length>0&&(
              <div style={{marginBottom:6}}>
                <SectionLabel color={C.lendo}>Em leitura</SectionLabel>
                {lendo.map(b=><BookCard key={b.id} livro={b} projeto={activeProj} todos={projBooks} onEdit={l=>{setEditingBook({...l,projetoId:activeId});setView("form");}} onUpdateProgress={updateProgress} onAddComment={addComment} onRate={rateBook}/>)}
              </div>
            )}
            {periodGroups.map(([periodo,livros])=>(
              <div key={periodo} style={{marginBottom:6}}>
                <SectionLabel color={periodColor(periodo)}>{periodo}</SectionLabel>
                {livros.map(b=><BookCard key={b.id} livro={b} projeto={activeProj} todos={projBooks} onEdit={l=>{setEditingBook({...l,projetoId:activeId});setView("form");}} onUpdateProgress={updateProgress} onAddComment={addComment} onRate={rateBook}/>)}
              </div>
            ))}
            {projBooks.length===0&&(
              <div style={{textAlign:"center",padding:"60px 20px",color:C.textSoft}}>
                <div style={{color:C.border,marginBottom:14,display:"flex",justifyContent:"center"}}><Icons.Book/></div>
                <div style={{fontSize:16,fontWeight:600,color:C.textMid,marginBottom:6}}>Nenhum livro neste projeto</div>
                <div style={{fontSize:14}}>Toque em + para adicionar</div>
              </div>
            )}
          </div>
        )}

        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.surface,borderTop:`1px solid ${C.border}`,zIndex:100}}>
          <button onClick={()=>setProjOpen(o=>!o)} style={{width:"100%",padding:"14px 16px",background:"none",border:"none",display:"flex",justifyContent:"space-between",alignItems:"center",color:C.text}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{color:C.opal,display:"flex"}}><Icons.Folder/></span>
              <span style={{fontSize:15,fontWeight:600}}>{activeProj.titulo}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,color:C.textSoft,fontSize:12}}>
              <span>Projetos</span>
              {projOpen?<Icons.ChevronDown/>:<Icons.ChevronUp/>}
            </div>
          </button>
          {projOpen&&(
            <div style={{borderTop:`1px solid ${C.border}`,maxHeight:220,overflowY:"auto"}}>
              {projects.map(p=>(
                <button key={p.id} onClick={()=>{setActiveId(p.id);setProjOpen(false);}}
                  style={{width:"100%",padding:"13px 16px",background:p.id===activeId?C.opalDim:"none",border:"none",borderBottom:`1px solid ${C.border}`,textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:15,fontWeight:p.id===activeId?600:400,color:p.id===activeId?C.opal:C.text}}>{p.titulo}</span>
                  <span style={{fontSize:12,color:C.textSoft}}>{p.livros.length} livros</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
