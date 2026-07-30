/*
 * QA Manager - API simulada
 * Persistencia: localStorage
 * No utiliza datos reales ni credenciales reales.
 */
const QAApi = (() => {
  const KEY = "qa_manager_trl5_diego_v1";

  const seed = {
    user: {
      name: "Diego Andres Gomez Piamba",
      role: "QA Analyst",
      email: "diego.gomez@unad.edu.co"
    },
    projects: [
      {id: 1, name: "Plataforma Bancaria", client: "Banco ABC", status: "Activo", owner: "Diego Andres Gomez Piamba", description: "Gestión de pruebas para los servicios principales de una plataforma bancaria.", created: "2026-07-20"},
      {id: 2, name: "Ecommerce", client: "Tienda Online", status: "En pruebas", owner: "Diego Andres Gomez Piamba", description: "Validación funcional del proceso de compra.", created: "2026-07-22"}
    ],
    requirements: [
      {id: "HU-001", projectId: 1, title: "Inicio de sesión", description: "El usuario debe poder iniciar sesión con credenciales válidas.", priority: "Alta", status: "Aprobado"},
      {id: "HU-002", projectId: 1, title: "Consulta de saldo", description: "El usuario debe consultar su saldo disponible.", priority: "Media", status: "En revisión"},
      {id: "HU-003", projectId: 1, title: "Transferencia bancaria", description: "El usuario debe realizar una transferencia válida.", priority: "Alta", status: "Aprobado"}
    ],
    cases: [
      {id: "CP-001", requirementId: "HU-001", title: "Login exitoso", preconditions: "Usuario registrado y contraseña válida.", steps: "Ingresar usuario; ingresar contraseña; seleccionar Iniciar sesión.", expected: "El sistema permite el acceso.", status: "Passed", lastExecution: "2026-07-20"},
      {id: "CP-002", requirementId: "HU-001", title: "Clave incorrecta", preconditions: "Usuario registrado.", steps: "Ingresar usuario; ingresar clave incorrecta; seleccionar Iniciar sesión.", expected: "El sistema rechaza el acceso y muestra el mensaje definido.", status: "Failed", lastExecution: "2026-07-20"},
      {id: "CP-003", requirementId: "HU-003", title: "Transferencia válida", preconditions: "Saldo suficiente y beneficiario registrado.", steps: "Seleccionar beneficiario; ingresar monto; confirmar.", expected: "La transferencia queda registrada.", status: "Pending", lastExecution: "-"}
    ],
    executions: [
      {id: 1, caseId: "CP-001", result: "Passed", observed: "Acceso concedido correctamente.", date: "2026-07-20"},
      {id: 2, caseId: "CP-002", result: "Failed", observed: "El mensaje mostrado no coincide con el esperado.", date: "2026-07-20"}
    ],
    bugs: [
      {id: "BUG-001", caseId: "CP-002", title: "Mensaje de error no coincide", description: "El mensaje presentado al ingresar una clave incorrecta no corresponde al resultado esperado.", severity: "Alta", priority: "Alta", status: "Abierto", owner: "Diego Andres Gomez Piamba", created: "2026-07-20"},
      {id: "BUG-002", caseId: "CP-001", title: "Detalle visual menor", description: "Elemento visual desalineado en una pantalla secundaria.", severity: "Baja", priority: "Baja", status: "Cerrado", owner: "Diego Andres Gomez Piamba", created: "2026-07-21"}
    ],
    settings: {emailNotifications: true, compactMode: false, confirmDelete: true}
  };

  function clone(x){ return JSON.parse(JSON.stringify(x)); }
  function load(){
    const raw = localStorage.getItem(KEY);
    if(!raw){ localStorage.setItem(KEY, JSON.stringify(seed)); return clone(seed); }
    try { return JSON.parse(raw); } catch(e){ localStorage.setItem(KEY, JSON.stringify(seed)); return clone(seed); }
  }
  function save(db){ localStorage.setItem(KEY, JSON.stringify(db)); return clone(db); }
  function nextNumeric(list){ return list.length ? Math.max(...list.map(x => Number(x.id) || 0)) + 1 : 1; }
  function nextCode(prefix, list){
    const nums = list.map(x => Number(String(x.id).replace(/\D/g,"")) || 0);
    return `${prefix}-${String(Math.max(0,...nums)+1).padStart(3,"0")}`;
  }

  return {
    getDB(){ return load(); },
    reset(){ localStorage.setItem(KEY, JSON.stringify(seed)); return clone(seed); },
    clear(){ localStorage.removeItem(KEY); },

    createProject(payload){
      const db=load();
      const item={id:nextNumeric(db.projects), ...payload, created:new Date().toISOString().slice(0,10)};
      db.projects.push(item); save(db); return item;
    },
    updateProject(id,payload){
      const db=load(); const i=db.projects.findIndex(x=>x.id===Number(id));
      if(i<0) throw Error("Proyecto no encontrado.");
      db.projects[i]={...db.projects[i],...payload}; save(db); return db.projects[i];
    },
    deleteProject(id){
      const db=load(); const n=Number(id);
      db.projects=db.projects.filter(x=>x.id!==n);
      db.requirements=db.requirements.filter(x=>x.projectId!==n);
      save(db); return true;
    },

    createRequirement(payload){
      const db=load(); const item={id:payload.id || nextCode("HU",db.requirements),...payload};
      if(db.requirements.some(x=>x.id===item.id)) throw Error("El código del requerimiento ya existe.");
      db.requirements.push(item); save(db); return item;
    },
    updateRequirement(id,payload){
      const db=load(); const i=db.requirements.findIndex(x=>x.id===id);
      if(i<0) throw Error("Requerimiento no encontrado.");
      db.requirements[i]={...db.requirements[i],...payload}; save(db); return db.requirements[i];
    },
    deleteRequirement(id){
      const db=load(); db.requirements=db.requirements.filter(x=>x.id!==id);
      db.cases=db.cases.filter(x=>x.requirementId!==id); save(db); return true;
    },

    createCase(payload){
      const db=load(); const item={id:payload.id || nextCode("CP",db.cases), status:"Pending", lastExecution:"-", ...payload};
      if(db.cases.some(x=>x.id===item.id)) throw Error("El código del caso ya existe.");
      db.cases.push(item); save(db); return item;
    },
    updateCase(id,payload){
      const db=load(); const i=db.cases.findIndex(x=>x.id===id);
      if(i<0) throw Error("Caso no encontrado.");
      db.cases[i]={...db.cases[i],...payload}; save(db); return db.cases[i];
    },
    deleteCase(id){
      const db=load(); db.cases=db.cases.filter(x=>x.id!==id); db.executions=db.executions.filter(x=>x.caseId!==id); db.bugs=db.bugs.filter(x=>x.caseId!==id); save(db); return true;
    },

    executeCase(caseId,result,observed){
      const db=load(); const i=db.cases.findIndex(x=>x.id===caseId);
      if(i<0) throw Error("Caso no encontrado.");
      const date=new Date().toISOString().slice(0,10);
      db.cases[i].status=result; db.cases[i].lastExecution=date;
      db.executions.push({id:nextNumeric(db.executions),caseId,result,observed,date});
      save(db); return db.cases[i];
    },

    createBug(payload){
      const db=load(); const item={id:payload.id || nextCode("BUG",db.bugs), created:new Date().toISOString().slice(0,10), ...payload};
      if(db.bugs.some(x=>x.id===item.id)) throw Error("El código del bug ya existe.");
      db.bugs.push(item); save(db); return item;
    },
    updateBug(id,payload){
      const db=load(); const i=db.bugs.findIndex(x=>x.id===id);
      if(i<0) throw Error("Bug no encontrado.");
      db.bugs[i]={...db.bugs[i],...payload}; save(db); return db.bugs[i];
    },
    deleteBug(id){
      const db=load(); db.bugs=db.bugs.filter(x=>x.id!==id); save(db); return true;
    },

    updateSettings(payload){
      const db=load(); db.settings={...db.settings,...payload}; save(db); return db.settings;
    }
  };
})();
