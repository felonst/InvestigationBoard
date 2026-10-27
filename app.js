(() => {
  const $ = id => document.getElementById(id);
  const TYPE = {
    person:{label:'පුද්ගලයෙක්',icon:'👤',color:'#dceafe',border:'#3b82f6'},
    phone:{label:'දුරකථන අංකය',icon:'📞',color:'#dcfce7',border:'#22a06b'},
    social:{label:'සමාජ මාධ්‍ය ගිණුම',icon:'🌐',color:'#ede9fe',border:'#8b5cf6'},
    vehicle:{label:'වාහනය',icon:'🚗',color:'#ffedd5',border:'#f59e0b'},
    business:{label:'ව්‍යාපාරයක් / ආයතනයක්',icon:'🏢',color:'#cffafe',border:'#0891b2'},
    employment:{label:'රැකියාව / සේවා ස්ථානය',icon:'💼',color:'#fce7f3',border:'#db2777'},
    email:{label:'ඊමේල් ලිපිනය',icon:'✉️',color:'#e0e7ff',border:'#6366f1'},
    address:{label:'ලිපිනය',icon:'📍',color:'#fee2e2',border:'#ef4444'},
    device:{label:'උපකරණයක්',icon:'💻',color:'#e2e8f0',border:'#64748b'},
    website:{label:'වෙබ් අඩවිය / ඩොමේනය',icon:'🔗',color:'#d1fae5',border:'#059669'},
    wallet:{label:'ක්‍රිප්ටෝ වොලට්',icon:'₿',color:'#fef3c7',border:'#d97706'},
    account:{label:'ගිණුමක් / හැඳුනුම්පතක්',icon:'🧾',color:'#f3e8ff',border:'#a855f7'},
    document:{label:'ලේඛනයක් / සාක්ෂියක්',icon:'📄',color:'#f1f5f9',border:'#64748b'},
    event:{label:'සිදුවීමක්',icon:'⚑',color:'#ffe4e6',border:'#e11d48'},
    location:{label:'ස්ථානයක්',icon:'🗺️',color:'#dbeafe',border:'#2563eb'},
    other:{label:'වෙනත්',icon:'◈',color:'#e5e7eb',border:'#6b7280'}
  };
  const CONF = {unverified:'තහවුරු කර නැත',reported:'වාර්තා වූ තොරතුරක්',corroborated:'අමතර මූලාශ්‍රයකින් තහවුරුයි',confirmed:'තහවුරු කර ඇත'};
  let nodes, edges, network, selected = [], nextId = 1;
  const STORAGE_KEY = 'investigation-link-board-v1';
  const saved = safeParse(localStorage.getItem(STORAGE_KEY));
  nodes = new vis.DataSet(saved?.nodes || []);
  edges = new vis.DataSet(saved?.edges || []);
  nextId = saved?.nextId || 1;
  $('caseTitle').value = saved?.caseTitle || 'නව විමර්ශනය';
  $('caseRef').value = saved?.caseRef || '';
  $('caseNotes').value = saved?.caseNotes || '';
  const options = {
    autoResize:true, interaction:{hover:true, multiselect:true, navigationButtons:false, keyboard:{enabled:true}, zoomView:true, dragView:true},
    physics:{enabled:true, stabilization:{iterations:120}, barnesHut:{gravitationalConstant:-2600, centralGravity:0.15, springLength:150, springConstant:0.04, damping:0.12}},
    nodes:{shape:'dot',size:28,borderWidth:2,font:{face:"Inter, Noto Sans Sinhala, sans-serif",size:14,color:'#17243a',strokeWidth:3,strokeColor:'#ffffff'},margin:10,shadow:{enabled:true,color:'rgba(30,55,90,0.12)',size:8,x:0,y:3}},
    edges:{smooth:{type:'dynamic'},color:{color:'#aab8cb',highlight:'#2563eb',hover:'#4f83d1'},width:2,font:{face:"Inter, Noto Sans Sinhala, sans-serif",size:11,align:'middle',background:'#ffffff',strokeWidth:3,strokeColor:'#ffffff'},arrows:{to:{enabled:true,scaleFactor:0.45}}},
  };
  network = new vis.Network($('network'),{nodes,edges},options);
  function safeParse(s){try{return s?JSON.parse(s):null}catch{return null}}
  function persist(){localStorage.setItem(STORAGE_KEY,JSON.stringify({nodes:nodes.get(),edges:edges.get(),nextId,caseTitle:$('caseTitle').value,caseRef:$('caseRef').value,caseNotes:$('caseNotes').value}));}
  function nodeData(type,name,detail,source,confidence,id){
    const t=TYPE[type]||TYPE.other;
    return {id:id??nextId++,label:t.icon+'  '+name,title:t.label+'\n'+name,group:type,shape:'dot',size:31,color:{background:t.color,border:t.border,highlight:{background:t.color,border:'#1d4ed8'},hover:{background:t.color,border:t.border}},font:{face:"Inter, Noto Sans Sinhala, sans-serif",size:13,color:'#1e293b',strokeWidth:4,strokeColor:'#ffffff'},borderWidth:2,entityName:name,detail:detail||'',source:source||'',confidence:confidence||'unverified',type,createdAt:new Date().toISOString()};
  }
  function refreshCounts(){
    $('nodeCount').textContent=nodes.length+' අයිතම';
    $('edgeCount').textContent=edges.length+' සම්බන්ධතා';
    $('emptyState').classList.toggle('hidden',nodes.length>0);
  }
  function renderDetails(id){
    const n=nodes.get(id);
    if(!n){$('detailPanel').innerHTML='විස්තර බැලීමට සිතියමේ අයිතමයක් තෝරන්න.';return}
    const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const related=edges.get().filter(e=>e.from===id||e.to===id);
    $('detailPanel').innerHTML=`<div class="detail-content"><div class="detail-name">${safe(TYPE[n.type]?.icon||'◈')} ${safe(n.entityName)}</div>
      <div class="detail-row"><span class="key">වර්ගය</span><span>${safe(TYPE[n.type]?.label||'වෙනත්')}</span></div>
      <div class="detail-row"><span class="key">තත්ත්වය</span><span><i class="status ${safe(n.confidence)}">${safe(CONF[n.confidence]||CONF.unverified)}</i></span></div>
      <div class="detail-row"><span class="key">විස්තර</span><span>${safe(n.detail||'—').replace(/\n/g,'<br>')}</span></div>
      <div class="detail-row"><span class="key">මූලාශ්‍රය</span><span>${safe(n.source||'—')}</span></div>
      <div class="detail-row"><span class="key">සම්බන්ධතා</span><span>${related.length}</span></div></div>`;
  }
  function renderRelations(id){
    const rels=edges.get().filter(e=>!id||e.from===id||e.to===id);
    if(!rels.length){$('relationsPanel').innerHTML='තවම සම්බන්ධතා නැත.';return}
    $('relationsPanel').innerHTML=rels.map(e=>{
      const a=nodes.get(e.from),b=nodes.get(e.to);
      return `<div class="relation-item"><span class="relation-arrow">↔</span><div><div class="relation-label">${esc(a?.entityName||'මකා දැමූ අයිතමය')} → ${esc(b?.entityName||'මකා දැමූ අයිතමය')}</div><div>${esc(e.label||'සම්බන්ධයි')}</div><div class="relation-sub">${esc(e.notes||'සටහන් නැත')}</div></div></div>`;
    }).join('');
  }
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function updatePanels(){refreshCounts();const ids=network.getSelectedNodes();renderDetails(ids.length===1?ids[0]:null);renderRelations(ids.length===1?ids[0]:null)}
  $('entityForm').addEventListener('submit',e=>{
    e.preventDefault();const name=$('entityName').value.trim();if(!name)return;
    const n=nodeData($('entityType').value,name,$('entityDetail').value.trim(),$('entitySource').value.trim(),$('entityConfidence').value);
    nodes.add(n);$('entityForm').reset();$('entityType').value='person';network.selectNodes([n.id]);network.focus(n.id,{scale:1.1,animation:true});persist();updatePanels();
  });
  network.on('selectNode',updatePanels);network.on('deselectNode',updatePanels);network.on('doubleClick',p=>{if(p.nodes.length===1)openEdit(p.nodes[0])});
  nodes.on('*',()=>{refreshCounts();persist()});edges.on('*',()=>{refreshCounts();persist()});
  ['caseTitle','caseRef','caseNotes'].forEach(id=>$(id).addEventListener('input',()=>{ $('workspaceTitle').textContent=$('caseTitle').value.trim()||'සම්බන්ධතා සිතියම';persist()}));
  $('workspaceTitle').textContent=$('caseTitle').value||'සම්බන්ධතා සිතියම';
  $('fitBtn').onclick=()=>network.fit({animation:true});
  $('connectBtn').onclick=()=>{
    if(nodes.length<2){alert('සම්බන්ධතාවක් සෑදීමට අවම වශයෙන් අයිතම දෙකක් එක් කරන්න.');return}
    const chosen=network.getSelectedNodes();
    fillNodeSelects(chosen.length>=2?chosen.slice(0,2):[]);
    $('relationLabel').value='';$('relationNotes').value='';
    $('relationDialog').showModal();
  };
  function fillNodeSelects(chosen){
    const list=nodes.get().sort((a,b)=>a.entityName.localeCompare(b.entityName,'si'));
    ['fromNode','toNode'].forEach((id,i)=>{$(id).innerHTML=list.map(n=>`<option value="${n.id}">${esc(TYPE[n.type]?.icon||'◈')} ${esc(n.entityName)}</option>`).join('');if(chosen[i]!==undefined)$(id).value=chosen[i]});
    if(chosen.length<2&&list.length>1)$('toNode').selectedIndex=1;
  }
  $('saveRelationBtn').onclick=e=>{
    e.preventDefault();const from=Number($('fromNode').value),to=Number($('toNode').value),label=$('relationLabel').value.trim();
    if(from===to){alert('වෙනස් අයිතම දෙකක් තෝරන්න.');return}if(!label){$('relationLabel').focus();return}
    edges.add({id:'e'+Date.now()+'-'+Math.floor(Math.random()*1000),from,to,label,notes:$('relationNotes').value.trim(),arrows:'to',font:{align:'middle',background:'#fff',size:11,strokeWidth:3,strokeColor:'#fff'}});
    $('relationDialog').close();network.selectNodes([from,to]);persist();updatePanels();
  };
  $('editBtn').onclick=()=>{const ids=network.getSelectedNodes();if(ids.length!==1){alert('සංස්කරණය කිරීමට එක් අයිතමයක් තෝරන්න.');return}openEdit(ids[0])};
  function openEdit(id){
    const n=nodes.get(id);if(!n)return;
    $('editId').value=id;$('editType').innerHTML=Object.entries(TYPE).map(([k,v])=>`<option value="${k}">${v.icon} ${v.label}</option>`).join('');
    $('editType').value=n.type;$('editName').value=n.entityName;$('editDetail').value=n.detail||'';$('editSource').value=n.source||'';$('editConfidence').value=n.confidence||'unverified';$('editDialog').showModal();
  }
  $('saveEditBtn').onclick=e=>{
    e.preventDefault();const id=Number($('editId').value),old=nodes.get(id),name=$('editName').value.trim();if(!old||!name)return;
    const updated=nodeData($('editType').value,name,$('editDetail').value.trim(),$('editSource').value.trim(),$('editConfidence').value,id);
    nodes.update({...old,...updated,id,label:updated.label});$('editDialog').close();network.selectNodes([id]);persist();updatePanels();
  };
  $('deleteBtn').onclick=()=>{
    const ids=network.getSelectedNodes();if(!ids.length){alert('මැකීමට අයිතමයක් තෝරන්න.');return}
    if(!confirm('තෝරාගත් අයිතම සහ ඒවාට සම්බන්ධ රේඛා මකන්නද?'))return;
    edges.remove(edges.get().filter(e=>ids.includes(e.from)||ids.includes(e.to)).map(e=>e.id));nodes.remove(ids);network.unselectAll();persist();updatePanels();
  };
  $('printBtn').onclick=()=>{network.fit({animation:false});setTimeout(()=>window.print(),250)};
  $('exportBtn').onclick=()=>{
    const payload={case:{title:$('caseTitle').value,reference:$('caseRef').value,notes:$('caseNotes').value},nodes:nodes.get(),edges:edges.get(),exportedAt:new Date().toISOString()};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=(($('caseRef').value||'investigation').replace(/[^a-z0-9-_]/gi,'_'))+'.json';a.click();URL.revokeObjectURL(url);
  };
  $('newCaseBtn').onclick=()=>{
    if(!confirm('නව විමර්ශනයක් ආරම්භ කළොත් වත්මන් සිතියම ඉවත් වේ. JSON Export කර තිබේද?'))return;
    nodes.clear();edges.clear();nextId=1;$('caseTitle').value='නව විමර්ශනය';$('caseRef').value='';$('caseNotes').value='';$('workspaceTitle').textContent='සම්බන්ධතා සිතියම';network.unselectAll();persist();updatePanels();
  };
  refreshCounts();renderRelations();if(nodes.length)network.fit({animation:false});
})();