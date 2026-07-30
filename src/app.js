const app = document.getElementById("app");
const user = () => QAApi.getDB().user;
let view = "dashboard";
let projectTab = "overview";
let selectedCase = null;
let editing = null;
let searchTerm = "";

const NAV = [
  ["dashboard","▦","Dashboard"],
  ["projects","▣","Proyectos"],
  ["requirements","✓","Requerimientos"],
  ["cases","□","Casos de prueba"],
  ["bugs","⚠","Defectos"],
  ["reports","▤","Reportes"],
  ["profile","●","Perfil"],
  ["settings","⚙","Configuración"]
];

function esc(v=""){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));}
function db(){return QAApi.getDB();}
function toast(msg,type="ok"){
  const el=document.createElement("div"); el.className="toast "+type; el.textContent=msg;
  document.body.appendChild(el); setTimeout(()=>el.remove(),2400);
}
function confirmDelete(text){
  return !db().settings.confirmDelete || window.confirm(text);
}
function badge(v){
  const x=String(v).toLowerCase();
  let c="gray";
  if(["activo","passed","aprobado","cerrado"].includes(x)) c="green";
  if(["en pruebas","en revisión","pending","borrador"].includes(x)) c="yellow";
  if(["failed","abierto","alta","crítica"].includes(x)) c="red";
  if(["media","blocked"].includes(x)) c="blue";
  return `<span class="badge ${c}">${esc(v)}</span>`;
}
function initials(){return "DG";}
function go(v){view=v; editing=null; searchTerm=""; render();}
function setTab(t){projectTab=t; render();}
function layout(title,subtitle,body){
  const u=user();
  return `<div class="app">
    <aside class="sidebar">
      <div class="brand"><div class="logo">QA</div><span>QA Manager</span></div>
      <div class="nav-title">Gestión de calidad</div>
      ${NAV.map(n=>`<button class="nav-item ${view===n[0]?"active":""}" onclick="go('${n[0]}')"><span class="nav-icon">${n[1]}</span><span>${n[2]}</span></button>`).join("")}
      <div class="sidebar-footer"><div class="user-mini"><div class="avatar">${initials()}</div><div><b>${esc(u.name)}</b><small>${esc(u.role)}</small></div></div></div>
    </aside>
    <main class="main">
      <header class="topbar"><div class="breadcrumb">QA Manager / ${esc(title)}</div><div class="header-user"><div class="avatar">${initials()}</div><div><b>${esc(u.name)}</b><small>${esc(u.role)}</small></div></div></header>
      <section class="content"><h1>${esc(title)}</h1><p class="subtitle">${esc(subtitle||"")}</p>${body}</section>
    </main>
  </div>`;
}
function tabs(){
  const tabs=[["overview","Resumen"],["requirements","Requerimientos"],["cases","Casos de prueba"],["bugs","Defectos"],["reports","Reportes"]];
  return `<div class="tabs">${tabs.map(t=>`<button class="tab ${projectTab===t[0]?"active":""}" onclick="setTab('${t[0]}')">${t[1]}</button>`).join("")}</div>`;
}

function dashboard(){
  const d=db(), total=d.cases.length, passed=d.cases.filter(c=>c.status==="Passed").length, failed=d.cases.filter(c=>c.status==="Failed").length;
  const active=d.projects.filter(p=>p.status==="Activo").length, open=d.bugs.filter(b=>b.status!=="Cerrado").length, coverage=total?Math.round(passed/total*100):0;
  return layout("Dashboard","Indicadores calculados a partir de los datos actuales.",`
    <div class="kpis">
      <div class="card kpi"><span>Proyectos activos</span><strong>${active}</strong><small>de ${d.projects.length} registrados</small></div>
      <div class="card kpi"><span>Casos de prueba</span><strong>${total}</strong><small>${passed} Passed · ${failed} Failed</small></div>
      <div class="card kpi"><span>Bugs abiertos</span><strong>${open}</strong><small>${d.bugs.length} defectos registrados</small></div>
      <div class="card kpi"><span>Cobertura</span><strong>${coverage}%</strong><small>casos Passed / casos totales</small></div>
    </div>
    <div class="grid-2">
      <div class="card card-pad"><div class="card-title"><h2>Estado de pruebas</h2><span class="muted">Actualizado en tiempo real</span></div>
        <div class="progress"><div style="width:${coverage}%"></div></div>
        <div class="legend"><span>Passed <b>${passed}</b></span><span>Failed <b>${failed}</b></span><span>Pending <b>${total-passed-failed}</b></span></div>
      </div>
      <div class="card card-pad"><div class="card-title"><h2>Flujo recomendado</h2></div>
        <div class="flow"><span>Proyecto</span><i>→</i><span>Requerimiento</span><i>→</i><span>Caso</span><i>→</i><span>Ejecución</span><i>→</i><span>Bug</span></div>
        <p class="muted">Ruta completa para demostrar la funcionalidad del prototipo.</p>
      </div>
    </div>
    <div class="card card-pad" style="margin-top:20px"><div class="card-title"><h2>Actividad reciente</h2><button class="btn btn-primary" onclick="go('projects')">Gestionar proyectos</button></div>
      <table><thead><tr><th>Elemento</th><th>Estado</th><th>Responsable</th><th>Fecha</th></tr></thead>
      <tbody>${d.bugs.slice(-4).reverse().map(b=>`<tr><td><b>${esc(b.id)}</b> · ${esc(b.title)}</td><td>${badge(b.status)}</td><td>${esc(b.owner)}</td><td>${esc(b.created)}</td></tr>`).join("")}</tbody></table>
    </div>`);
}

function projects(){
  const d=db(), q=searchTerm.toLowerCase();
  const rows=d.projects.filter(p=>(p.name+" "+p.client+" "+p.status).toLowerCase().includes(q));
  return layout("Proyectos","Crear, editar, eliminar y consultar proyectos.",`
    <div class="toolbar"><input class="search" value="${esc(searchTerm)}" oninput="searchTerm=this.value;render()" placeholder="Buscar por nombre, cliente o estado"><button class="btn btn-primary" onclick="newProject()">+ Nuevo proyecto</button></div>
    <div class="card table-wrap"><table><thead><tr><th>Proyecto</th><th>Cliente</th><th>Estado</th><th>Responsable</th><th>Creado</th><th>Acciones</th></tr></thead><tbody>
    ${rows.map(p=>`<tr><td><b>${esc(p.name)}</b><small>${esc(p.description)}</small></td><td>${esc(p.client)}</td><td>${badge(p.status)}</td><td>${esc(p.owner)}</td><td>${esc(p.created)}</td><td><div class="actions"><button class="icon-btn" onclick="newProject(${p.id})">Editar</button><button class="icon-btn danger" onclick="deleteProject(${p.id})">Eliminar</button><button class="icon-btn" onclick="go('requirements')">Ver</button></div></td></tr>`).join("")||`<tr><td colspan="6" class="empty">No se encontraron proyectos.</td></tr>`}
    </tbody></table></div>${editing==="project"?projectModal():""}`);
}
function projectModal(){
  const p=editingData();
  return `<div class="overlay"><div class="modal"><div class="modal-head"><h2>${p?"Editar proyecto":"Nuevo proyecto"}</h2><button class="close" onclick="editing=null;render()">✕</button></div>
  <form onsubmit="saveProject(event)"><div class="form-grid">
  <div class="field"><label>Nombre</label><input id="fName" value="${esc(p?.name||"")}" required></div>
  <div class="field"><label>Cliente</label><input id="fClient" value="${esc(p?.client||"")}" required></div>
  <div class="field"><label>Estado</label><select id="fStatus">${["Activo","En pruebas","Cerrado"].map(x=>`<option ${p?.status===x?"selected":""}>${x}</option>`).join("")}</select></div>
  <div class="field"><label>Responsable</label><input id="fOwner" value="${esc(p?.owner||user().name)}" required></div>
  <div class="field full"><label>Descripción</label><textarea id="fDesc" required>${esc(p?.description||"")}</textarea></div>
  </div><div class="form-actions"><button type="button" class="btn btn-secondary" onclick="editing=null;render()">Cancelar</button><button class="btn btn-primary">Guardar</button></div></form></div></div>`;
}
function newProject(id=null){editing=id?{type:"project",id}: "project";render();}
function editingData(){return editing&&editing.type==="project"?db().projects.find(p=>p.id===editing.id):null;}
function saveProject(e){e.preventDefault();try{
  const payload={name:fName.value,client:fClient.value,status:fStatus.value,owner:fOwner.value,description:fDesc.value};
  if(editingData()) QAApi.updateProject(editing.id,payload); else QAApi.createProject(payload);
  editing=null;toast("Proyecto guardado correctamente");render();
}catch(err){toast(err.message,"error")}}
function deleteProject(id){if(confirmDelete("¿Eliminar el proyecto y sus requerimientos asociados?")){QAApi.deleteProject(id);toast("Proyecto eliminado");render()}}

function requirements(){
  const d=db(), rows=d.requirements.filter(r=>(r.id+" "+r.title+" "+r.priority+" "+r.status).toLowerCase().includes(searchTerm.toLowerCase()));
  return layout("Requerimientos","Historias y requisitos trazables al proceso de pruebas.",`
    ${tabs()}<div class="toolbar"><input class="search" value="${esc(searchTerm)}" oninput="searchTerm=this.value;render()" placeholder="Buscar requerimiento"><button class="btn btn-primary" onclick="newRequirement()">+ Nuevo requerimiento</button></div>
    <div class="card table-wrap"><table><thead><tr><th>ID</th><th>Título</th><th>Prioridad</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
    ${rows.map(r=>`<tr><td><b>${esc(r.id)}</b></td><td>${esc(r.title)}<small>${esc(r.description)}</small></td><td>${badge(r.priority)}</td><td>${badge(r.status)}</td><td><div class="actions"><button class="icon-btn" onclick="newRequirement('${r.id}')">Editar</button><button class="icon-btn danger" onclick="deleteRequirement('${r.id}')">Eliminar</button></div></td></tr>`).join("")}</tbody></table></div>${editing==="requirement"||editing?.type==="requirement"?requirementModal():""}`);
}
function newRequirement(id=null){editing=id?{type:"requirement",id}:"requirement";render();}
function requirementModal(){const d=db(), r=editing?.id?d.requirements.find(x=>x.id===editing.id):null;return `<div class="overlay"><div class="modal"><div class="modal-head"><h2>${r?"Editar":"Nuevo"} requerimiento</h2><button class="close" onclick="editing=null;render()">✕</button></div><form onsubmit="saveRequirement(event)"><div class="form-grid">
<div class="field"><label>Código</label><input id="rId" value="${esc(r?.id||"")}" ${r?"readonly":""} placeholder="HU-004" required></div>
<div class="field"><label>Prioridad</label><select id="rPriority">${["Alta","Media","Baja"].map(x=>`<option ${r?.priority===x?"selected":""}>${x}</option>`).join("")}</select></div>
<div class="field full"><label>Título</label><input id="rTitle" value="${esc(r?.title||"")}" required></div>
<div class="field full"><label>Descripción</label><textarea id="rDesc" required>${esc(r?.description||"")}</textarea></div>
<div class="field full"><label>Estado</label><select id="rStatus">${["Borrador","En revisión","Aprobado"].map(x=>`<option ${r?.status===x?"selected":""}>${x}</option>`).join("")}</select></div>
</div><div class="form-actions"><button type="button" class="btn btn-secondary" onclick="editing=null;render()">Cancelar</button><button class="btn btn-primary">Guardar</button></div></form></div></div>`}
function saveRequirement(e){e.preventDefault();try{
  const payload={id:rId.value,projectId:1,title:rTitle.value,description:rDesc.value,priority:rPriority.value,status:rStatus.value};
  if(editing?.id) QAApi.updateRequirement(editing.id,payload); else QAApi.createRequirement(payload);
  editing=null;toast("Requerimiento guardado");render();
}catch(err){toast(err.message,"error")}}
function deleteRequirement(id){if(confirmDelete("¿Eliminar este requerimiento y sus casos asociados?")){QAApi.deleteRequirement(id);toast("Requerimiento eliminado");render()}}

function cases(){
  const d=db(), rows=d.cases.filter(c=>(c.id+" "+c.title+" "+c.status).toLowerCase().includes(searchTerm.toLowerCase()));
  return layout("Casos de prueba","Diseñar, ejecutar y controlar casos asociados a requerimientos.",`
  ${tabs()}<div class="toolbar"><input class="search" value="${esc(searchTerm)}" oninput="searchTerm=this.value;render()" placeholder="Buscar caso"><button class="btn btn-primary" onclick="newCase()">+ Nuevo caso</button></div>
  <div class="card table-wrap"><table><thead><tr><th>ID</th><th>Caso</th><th>Req.</th><th>Estado</th><th>Última ejecución</th><th>Acciones</th></tr></thead><tbody>
  ${rows.map(c=>`<tr><td><b>${esc(c.id)}</b></td><td>${esc(c.title)}<small>${esc(c.expected)}</small></td><td>${esc(c.requirementId)}</td><td>${badge(c.status)}</td><td>${esc(c.lastExecution)}</td><td><div class="actions"><button class="icon-btn" onclick="executeCase('${c.id}')">Ejecutar</button><button class="icon-btn" onclick="newCase('${c.id}')">Editar</button><button class="icon-btn danger" onclick="deleteCase('${c.id}')">Eliminar</button></div></td></tr>`).join("")}</tbody></table></div>${editing==="case"||editing?.type==="case"?caseModal():""}`);
}
function newCase(id=null){editing=id?{type:"case",id}:"case";render();}
function caseModal(){const d=db(), c=editing?.id?d.cases.find(x=>x.id===editing.id):null;return `<div class="overlay"><div class="modal wide"><div class="modal-head"><h2>${c?"Editar":"Nuevo"} caso de prueba</h2><button class="close" onclick="editing=null;render()">✕</button></div><form onsubmit="saveCase(event)"><div class="form-grid">
<div class="field"><label>ID</label><input id="cId" value="${esc(c?.id||"")}" ${c?"readonly":""} placeholder="CP-004" required></div>
<div class="field"><label>Requerimiento</label><select id="cReq">${d.requirements.map(r=>`<option value="${r.id}" ${c?.requirementId===r.id?"selected":""}>${r.id} · ${esc(r.title)}</option>`).join("")}</select></div>
<div class="field full"><label>Título</label><input id="cTitle" value="${esc(c?.title||"")}" required></div>
<div class="field full"><label>Precondiciones</label><textarea id="cPre" required>${esc(c?.preconditions||"")}</textarea></div>
<div class="field full"><label>Pasos</label><textarea id="cSteps" required>${esc(c?.steps||"")}</textarea></div>
<div class="field full"><label>Resultado esperado</label><textarea id="cExpected" required>${esc(c?.expected||"")}</textarea></div>
</div><div class="form-actions"><button type="button" class="btn btn-secondary" onclick="editing=null;render()">Cancelar</button><button class="btn btn-primary">Guardar</button></div></form></div></div>`}
function saveCase(e){e.preventDefault();try{
 const payload={id:cId.value,requirementId:cReq.value,title:cTitle.value,preconditions:cPre.value,steps:cSteps.value,expected:cExpected.value};
 if(editing?.id) QAApi.updateCase(editing.id,payload); else QAApi.createCase(payload);
 editing=null;toast("Caso de prueba guardado");render();
}catch(err){toast(err.message,"error")}}
function deleteCase(id){if(confirmDelete("¿Eliminar el caso, ejecuciones y bugs asociados?")){QAApi.deleteCase(id);toast("Caso eliminado");render()}}
function executeCase(id){selectedCase=id;view="execute";render();}

function execute(){
 const d=db(), c=d.cases.find(x=>x.id===selectedCase)||d.cases[0], history=d.executions.filter(x=>x.caseId===c.id);
 return layout("Ejecutar caso de prueba",`${c.id} · ${c.title}`,`
 ${tabs()}<div class="grid-2"><div class="card card-pad"><h2>Definición</h2><p><b>Requerimiento:</b> ${esc(c.requirementId)}</p><p><b>Precondiciones:</b> ${esc(c.preconditions)}</p><p><b>Pasos:</b> ${esc(c.steps)}</p><p><b>Resultado esperado:</b> ${esc(c.expected)}</p></div>
 <div class="card card-pad"><h2>Nueva ejecución</h2><form onsubmit="saveExecution(event)"><div class="field"><label>Resultado</label><select id="eResult"><option>Passed</option><option ${c.status==="Failed"?"selected":""}>Failed</option><option>Blocked</option><option>Pending</option></select></div><div class="field" style="margin-top:16px"><label>Resultado obtenido</label><textarea id="eObserved" required>${c.status==="Failed"?"El sistema muestra un mensaje diferente al esperado.":""}</textarea></div><button class="btn btn-primary" style="margin-top:18px">Guardar ejecución</button></form></div></div>
 <div class="card card-pad" style="margin-top:20px"><h2>Historial</h2><table><thead><tr><th>Fecha</th><th>Resultado</th><th>Observación</th></tr></thead><tbody>${history.reverse().map(x=>`<tr><td>${esc(x.date)}</td><td>${badge(x.result)}</td><td>${esc(x.observed)}</td></tr>`).join("")||`<tr><td colspan="3" class="empty">Sin ejecuciones.</td></tr>`}</tbody></table></div>`);
}
function saveExecution(e){e.preventDefault();try{QAApi.executeCase(selectedCase,eResult.value,eObserved.value);toast("Ejecución guardada");if(eResult.value==="Failed"){go("bugs")}else{go("cases")}}catch(err){toast(err.message,"error")}}

function bugs(){
 const d=db(), rows=d.bugs.filter(b=>(b.id+" "+b.title+" "+b.status+" "+b.severity).toLowerCase().includes(searchTerm.toLowerCase()));
 return layout("Defectos","Registrar, editar, consultar y cerrar bugs derivados de pruebas.",`
 ${tabs()}<div class="toolbar"><input class="search" value="${esc(searchTerm)}" oninput="searchTerm=this.value;render()" placeholder="Buscar bug"><button class="btn btn-primary" onclick="newBug()">+ Nuevo bug</button></div>
 <div class="card table-wrap"><table><thead><tr><th>ID</th><th>Defecto</th><th>Severidad</th><th>Estado</th><th>Caso</th><th>Responsable</th><th>Acciones</th></tr></thead><tbody>
 ${rows.map(b=>`<tr><td><b>${esc(b.id)}</b></td><td>${esc(b.title)}<small>${esc(b.description)}</small></td><td>${badge(b.severity)}</td><td>${badge(b.status)}</td><td>${esc(b.caseId)}</td><td>${esc(b.owner)}</td><td><div class="actions"><button class="icon-btn" onclick="newBug('${b.id}')">Editar</button><button class="icon-btn danger" onclick="deleteBug('${b.id}')">Eliminar</button></div></td></tr>`).join("")}</tbody></table></div>${editing==="bug"||editing?.type==="bug"?bugModal():""}`);
}
function newBug(id=null){editing=id?{type:"bug",id}:"bug";render();}
function bugModal(){const d=db(), b=editing?.id?d.bugs.find(x=>x.id===editing.id):null;return `<div class="overlay"><div class="modal"><div class="modal-head"><h2>${b?"Editar":"Registrar"} defecto</h2><button class="close" onclick="editing=null;render()">✕</button></div><form onsubmit="saveBug(event)"><div class="form-grid">
<div class="field"><label>ID</label><input id="bId" value="${esc(b?.id||"")}" ${b?"readonly":""} placeholder="BUG-003" required></div>
<div class="field"><label>Caso relacionado</label><select id="bCase">${d.cases.map(c=>`<option ${b?.caseId===c.id?"selected":""}>${c.id}</option>`).join("")}</select></div>
<div class="field full"><label>Título</label><input id="bTitle" value="${esc(b?.title||"")}" required></div>
<div class="field full"><label>Descripción</label><textarea id="bDesc" required>${esc(b?.description||"")}</textarea></div>
<div class="field"><label>Severidad</label><select id="bSeverity">${["Crítica","Alta","Media","Baja"].map(x=>`<option ${b?.severity===x?"selected":""}>${x}</option>`).join("")}</select></div>
<div class="field"><label>Prioridad</label><select id="bPriority">${["Alta","Media","Baja"].map(x=>`<option ${b?.priority===x?"selected":""}>${x}</option>`).join("")}</select></div>
<div class="field"><label>Estado</label><select id="bStatus">${["Abierto","En revisión","Cerrado"].map(x=>`<option ${b?.status===x?"selected":""}>${x}</option>`).join("")}</select></div>
<div class="field"><label>Responsable</label><input id="bOwner" value="${esc(b?.owner||user().name)}" required></div>
</div><div class="form-actions"><button type="button" class="btn btn-secondary" onclick="editing=null;render()">Cancelar</button><button class="btn btn-primary">Guardar</button></div></form></div></div>`}
function saveBug(e){e.preventDefault();try{const p={id:bId.value,caseId:bCase.value,title:bTitle.value,description:bDesc.value,severity:bSeverity.value,priority:bPriority.value,status:bStatus.value,owner:bOwner.value};if(editing?.id)QAApi.updateBug(editing.id,p);else QAApi.createBug(p);editing=null;toast("Defecto guardado");render()}catch(err){toast(err.message,"error")}}
function deleteBug(id){if(confirmDelete("¿Eliminar este defecto?")){QAApi.deleteBug(id);toast("Defecto eliminado");render()}}

function reports(){
 const d=db(), total=d.cases.length, passed=d.cases.filter(c=>c.status==="Passed").length, failed=d.cases.filter(c=>c.status==="Failed").length, pending=d.cases.filter(c=>c.status==="Pending").length, coverage=total?Math.round(passed/total*100):0;
 return layout("Reportes","Indicadores básicos para seguimiento de calidad.",`
 <div class="toolbar"><button class="btn btn-secondary" onclick="window.print()">Imprimir / guardar PDF</button><button class="btn btn-primary" onclick="toast('Reporte actualizado')">Actualizar</button></div>
 <div class="kpis"><div class="card kpi"><span>Ejecuciones</span><strong>${d.executions.length}</strong><small>historial registrado</small></div><div class="card kpi"><span>Passed</span><strong>${passed}</strong><small>${coverage}% de los casos</small></div><div class="card kpi"><span>Failed</span><strong>${failed}</strong><small>requieren análisis</small></div><div class="card kpi"><span>Pending</span><strong>${pending}</strong><small>pendientes de ejecución</small></div></div>
 <div class="grid-2"><div class="card card-pad"><h2>Distribución de casos</h2><div class="report-row"><span>Passed</span><div class="mini-progress"><i style="width:${total?passed/total*100:0}%"></i></div><b>${passed}</b></div><div class="report-row"><span>Failed</span><div class="mini-progress"><i style="width:${total?failed/total*100:0}%"></i></div><b>${failed}</b></div><div class="report-row"><span>Pending</span><div class="mini-progress"><i style="width:${total?pending/total*100:0}%"></i></div><b>${pending}</b></div></div>
 <div class="card card-pad"><h2>Defectos por severidad</h2>${["Crítica","Alta","Media","Baja"].map(s=>`<div class="report-row"><span>${s}</span><div class="mini-progress"><i style="width:${d.bugs.length?d.bugs.filter(b=>b.severity===s).length/d.bugs.length*100:0}%"></i></div><b>${d.bugs.filter(b=>b.severity===s).length}</b></div>`).join("")}</div></div>
 <div class="card card-pad" style="margin-top:20px"><h2>Resumen</h2><p>El prototipo registra ${d.projects.length} proyectos, ${d.requirements.length} requerimientos, ${d.cases.length} casos, ${d.executions.length} ejecuciones y ${d.bugs.length} defectos.</p><p>La cobertura calculada es <b>${coverage}%</b>.</p></div>`);
}

function profile(){const u=user();return layout("Perfil","Información del responsable del prototipo.",`<div class="card card-pad profile-card"><div class="profile-head"><div class="avatar big">${initials()}</div><div><h2>${esc(u.name)}</h2><span>${esc(u.role)}</span></div></div><div class="form-grid"><div class="field"><label>Nombre completo</label><input value="${esc(u.name)}" readonly></div><div class="field"><label>Correo</label><input value="${esc(u.email)}" readonly></div><div class="field"><label>Rol</label><input value="${esc(u.role)}" readonly></div><div class="field"><label>Proyecto</label><input value="QA Manager - Fase 4" readonly></div></div></div>`)}
function settings(){
 const s=db().settings;return layout("Configuración","Preferencias y control de datos locales.",`<div class="card card-pad settings-card">
 ${setting("Notificaciones por correo","Avisos sobre bugs y ejecuciones","emailNotifications",s.emailNotifications)}
 ${setting("Modo compacto","Reducir espacios en tablas","compactMode",s.compactMode)}
 ${setting("Confirmar eliminaciones","Solicitar confirmación antes de eliminar","confirmDelete",s.confirmDelete)}
 <div class="form-actions"><button class="btn btn-secondary" onclick="resetData()">Restablecer datos demo</button><button class="btn btn-primary" onclick="toast('Configuración guardada')">Guardar</button></div>
 </div>`)}
function setting(title,desc,key,val){return `<div class="setting"><div><b>${title}</b><small>${desc}</small></div><button class="toggle ${val?"on":""}" onclick="toggleSetting('${key}')"></button></div>`}
function toggleSetting(key){const s=db().settings;QAApi.updateSettings({[key]:!s[key]});render();}
function resetData(){if(confirm("¿Restablecer todos los datos de demostración?")){QAApi.reset();toast("Datos restablecidos");go("dashboard")}}

function render(){
  const pages={dashboard,projects,requirements,cases,execute,bugs,reports,profile,settings};
  app.innerHTML=(pages[view]||dashboard)();
}
render();
