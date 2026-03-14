let plants=[],selectedId=null,currentTab='overview',currentFilter='All',weather=null;
const TODAY=new Date();TODAY.setHours(0,0,0,0);

function loadPlants(){try{const r=localStorage.getItem('garden-v1');plants=r?JSON.parse(r):JSON.parse(JSON.stringify(PLANTS_INIT));}catch(e){plants=JSON.parse(JSON.stringify(PLANTS_INIT));}}
function savePlants(){localStorage.setItem('garden-v1',JSON.stringify(plants));const el=document.getElementById('save-msg');if(!el)return;el.style.opacity='1';clearTimeout(el._t);el._t=setTimeout(()=>el.style.opacity='0',2000);}

async function fetchWeather(){
  const{lat,lon}=LOCATION;
  const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=fahrenheit&timezone=America%2FChicago&forecast_days=10`;
  try{const r=await fetch(url);const d=await r.json();weather=d.daily;renderWeatherBar();if(currentTab==='harden off'){const p=plants.find(x=>x.id===selectedId);if(p)renderTab(p);}}catch(e){console.warn('Weather failed',e);}
}
function wxIcon(c){if(c===0)return'☀';if(c<=2)return'⛅';if(c<=45)return'☁';if(c<=67)return'🌧';if(c<=77)return'❄';return'⛈';}
function renderWeatherBar(){
  const bar=document.getElementById('weather-bar');if(!bar||!weather)return;
  bar.innerHTML=weather.time.slice(0,7).map((date,i)=>{
    const d=new Date(date+'T12:00:00');const lbl=i===0?'Today':d.toLocaleDateString('en-US',{weekday:'short'});
    const hi=Math.round(weather.temperature_2m_max[i]),lo=Math.round(weather.temperature_2m_min[i]),frost=lo<=36;
    return`<div class="weather-day${frost?' frost-risk':''}"><div class="wd-label">${lbl}</div><div>${wxIcon(weather.weathercode[i])}</div><div class="wd-hi">${hi}°</div><div class="wd-lo${frost?' frost-lo':''}">${lo}°${frost?' ❄':''}</div></div>`;
  }).join('');
}
function cat(p){if(p.method==='DWC')return'DWC';if(p.method==='Bonsai')return'Bonsai';if(p.category==='Uncertain Seed')return'Uncertain';return'Soil';}

const PLANT_HARDEN_NOTES={
  'Lactuca sativa (Bibb)':                    {minNight:28,note:'High cold tolerance. Tolerates light frost once hardened. Can begin hardening now.'},
  'Lactuca sativa (Iceberg)':                 {minNight:28,note:'High cold tolerance. Cool weather needed to form tight heads. Begin hardening now.'},
  'Solanum lycopersicum':                     {minNight:50,note:'Cold-sensitive below 50°F. Begin ~Apr 7–10. Day 1–2 wilting is normal.'},
  'Solanum lycopersicum var. cerasiforme':    {minNight:50,note:'Cold-sensitive below 50°F. Begin ~Apr 7–10. Very productive in AR summer heat.'},
  'Capsicum annuum':                          {minNight:55,note:'Do not expose below 55°F. Begin hardening after Apr 27 only.'},
  'Capsicum chinense (non-isolated)':         {minNight:60,note:'Most cold-sensitive Capsicum species. Wait until consistent 60°F+ nights. After Apr 27.'},
  'Capsicum chinense (hydro clone)':          {minNight:60,note:'DWC permanent — hardening not applicable.'},
  'Ocimum basilicum':                         {minNight:60,note:'Very cold-sensitive. Keep above 60°F at all times. Indoor permanent.'},
  'Thymus vulgaris':                          {minNight:40,note:'Hardy herb once established. Indoor permanent per your plan.'},
  'Origanum vulgare':                         {minNight:40,note:'Hardy herb. Indoor permanent per your plan.'},
  'Salvia rosmarinus':                        {minNight:40,note:'Hardy once established. Indoor permanent. Seeds are fresh — good viability.'},
  'Ulmus pumila':                             {minNight:32,note:'Cold-hardy deciduous. Needs winter dormancy. No hardening concern at this stage.'},
  'Picea pungens':                            {minNight:32,note:'Cold-hardy conifer. Sensitive to overwatering. No hardening concern at seedling stage.'},
  'Pinus thunbergii':                         {minNight:32,note:'Cold-hardy pine. Long-term bonsai project. No hardening concern at seedling stage.'},
  'Capsicum chinense':                        {minNight:80,note:'Old seeds — germination focus. Keep at 85–90°F on heat mat. May take 3–5 weeks.'},
};
function daysSince(s){if(!s)return null;return Math.floor((TODAY-new Date(s+'T00:00:00'))/86400000);}
function fmtDate(s){return new Date(s+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});}
function daysUntil(s){return Math.ceil((new Date(s+'T00:00:00')-TODAY)/86400000);}
function hardenDay(p){if(!p.hardenStart)return 0;return Math.floor((TODAY-new Date(p.hardenStart+'T00:00:00'))/86400000)+1;}

function renderSidebar(){
  const filters=['All','DWC','Soil','Bonsai','Uncertain','Harden Off'];
  document.getElementById('filter-bar').innerHTML=filters.map(f=>`<button class="filter-btn${currentFilter===f?' active':''}" onclick="setFilter('${f}')">${f}</button>`).join('');
  const list=currentFilter==='All'?plants:currentFilter==='Harden Off'?plants.filter(p=>p.hardenOff):plants.filter(p=>cat(p)===currentFilter);
  document.getElementById('plant-list').innerHTML=list.map(p=>{
    const c=cat(p),days=daysSince(p.startDate),hd=p.hardenOff&&p.hardenStart?hardenDay(p):null;
    return`<div class="plant-item${p.id===selectedId?' active':''}" onclick="selectPlant('${p.id}')">
      <div class="plant-name">${p.name}</div><div class="plant-sub">${p.stage}</div>
      <div class="plant-badges"><span class="badge badge-${c.toLowerCase()}">${c}</span>${p.hardenOff?'<span class="badge badge-harden">harden</span>':''}${p.nickname?`<span class="badge badge-bonsai">${p.nickname}</span>`:''}${p.viability?'<span class="badge badge-uncertain">low viability</span>':''}</div>
      ${days!==null?`<div class="plant-days">Day ${days}</div>`:''}
      ${hd&&hd>0&&hd<=10?`<div class="plant-days harden-active">Hardening day ${hd}/10</div>`:''}
    </div>`;
  }).join('');
}

function renderDetail(){
  const d=document.getElementById('detail');
  if(!selectedId){d.innerHTML='<div class="empty-detail">Select a plant to view details</div>';return;}
  const p=plants.find(x=>x.id===selectedId);if(!p)return;
  const c=cat(p),tabs=['overview','log','feed','light'];
  if(c==='DWC')tabs.splice(1,0,'dwc');if(p.hardenOff)tabs.push('harden off');
  const days=daysSince(p.startDate);
  d.innerHTML=`<div class="detail-header">
    <div class="detail-title-row"><h1 class="detail-title">${p.name}</h1>
      <div class="header-badges"><span class="badge badge-${c.toLowerCase()}">${c}</span>${p.hardenOff?'<span class="badge badge-harden">harden off</span>':''}${p.nickname?`<span class="badge badge-bonsai">${p.nickname}</span>`:''}${p.viability?`<span class="badge badge-uncertain">low viability</span>`:''}</div></div>
    <div class="detail-meta">${p.variety} · ${p.location}</div>
    ${p.startDate?`<div class="detail-meta dim">Started ${fmtDate(p.startDate)} · Day ${days}</div>`:''}
  </div>
  <div class="tab-bar">${tabs.map(t=>`<button class="tab${currentTab===t?' active':''}" onclick="setTab('${t}')">${t}</button>`).join('')}</div>
  <div id="tab-content"></div>`;
  renderTab(p);
}

function renderTab(p){
  const tc=document.getElementById('tab-content');if(!tc)return;
  const c=cat(p);
  if(currentTab==='overview')renderOverview(p,tc);
  else if(currentTab==='dwc')renderDWC(p,tc);
  else if(currentTab==='log')renderLog(p,tc);
  else if(currentTab==='feed')renderFeed(p,tc);
  else if(currentTab==='light')renderLight(p,tc);
  else if(currentTab==='harden off')renderHarden(p,tc);
}

function renderOverview(p,tc){
  const days=daysSince(p.startDate),lph=p.phLog&&p.phLog.length?p.phLog[p.phLog.length-1]:null;
  tc.innerHTML=`
    <div class="metrics-row">
      <div class="metric"><div class="metric-label">Method</div><div class="metric-value sm">${p.method}</div></div>
      <div class="metric"><div class="metric-label">Light</div><div class="metric-value">${p.lightHours}<span class="metric-unit">h</span></div></div>
      <div class="metric"><div class="metric-label">Age</div><div class="metric-value">${days!==null?days:'—'}<span class="metric-unit">${days!==null?'d':''}</span></div></div>
      ${lph?`<div class="metric"><div class="metric-label">Last pH</div><div class="metric-value ${lph.value>=5.8&&lph.value<=6.2?'ok':'bad'}">${lph.value.toFixed(1)}</div></div>`:''}
    </div>
    <div class="card"><div class="card-label">Growth stage</div>
      <select class="field-select" onchange="updateField('${p.id}','stage',this.value)">
        ${STAGE_OPTIONS.map(s=>`<option${s===p.stage?' selected':''}>${s}</option>`).join('')}
      </select></div>
    <div class="two-col">
      <div class="card"><div class="card-label">Destination</div><div class="card-value">${p.dest}</div></div>
      <div class="card"><div class="card-label">Location</div><div class="card-value">${p.location}</div></div>
    </div>
    ${p.notes&&p.notes.length?`<div class="card"><div class="card-label">Recent notes</div><ul class="log-list">
      ${p.notes.slice(-3).reverse().map(n=>`<li><span class="log-text">${n.text}</span><span class="log-date">${n.date}</span></li>`).join('')}
    </ul></div>`:''}
    ${p.viability?`<div class="alert warn"><strong>Low viability seeds:</strong> ${p.viability}</div>`:''}
    ${p.info?`<div class="card"><div class="card-label">Plant notes</div><div class="card-value dim">${p.info}</div></div>`:''}`;
}

function renderDWC(p,tc){
  const lph=p.phLog&&p.phLog.length?p.phLog[p.phLog.length-1]:null;
  const lec=p.ecLog&&p.ecLog.length?p.ecLog[p.ecLog.length-1]:null;
  const phOk=lph&&lph.value>=5.8&&lph.value<=6.2;
  tc.innerHTML=`
    <div class="alert warn"><strong>Nutrient alert:</strong> Big Bloom alone is incomplete. Add <strong>FoxFarm Grow Big Hydro</strong> (veg) + <strong>Tiger Bloom</strong> (fruiting).</div>
    <div class="metrics-row">
      <div class="metric"><div class="metric-label">Last pH</div><div class="metric-value ${lph?(phOk?'ok':'bad'):''}">${lph?lph.value.toFixed(1):'—'}</div><div class="metric-target">Target 5.8–6.2</div></div>
      <div class="metric"><div class="metric-label">Last EC</div><div class="metric-value">${lec?lec.value.toFixed(2):'—'}</div><div class="metric-target">Seedling 0.8–1.2</div></div>
      <div class="metric"><div class="metric-label">pH logs</div><div class="metric-value">${p.phLog?p.phLog.length:0}</div></div>
    </div>
    <div class="two-col">
      <div class="card"><div class="card-label">Log pH</div>
        <div class="input-row"><input type="number" id="ph-input" step="0.1" min="4" max="8" placeholder="5.9"><button class="btn btn-primary" onclick="logPH('${p.id}')">Log</button></div>
        <div class="target-note">Target: 5.8 – 6.2</div></div>
      <div class="card"><div class="card-label">Log EC</div>
        <div class="input-row"><input type="number" id="ec-input" step="0.01" min="0" max="5" placeholder="1.2"><button class="btn btn-primary" onclick="logEC('${p.id}')">Log</button></div>
        <div class="target-note">Seedling 0.8–1.2 · Veg 1.2–1.8 · Fruit 2.0–2.5</div></div>
    </div>
    ${p.phLog&&p.phLog.length?`<div class="two-col">
      <div class="card"><div class="card-label">pH history</div><ul class="log-list">
        ${[...p.phLog].reverse().slice(0,10).map(e=>`<li><span class="log-text ${e.value>=5.8&&e.value<=6.2?'ok':'bad'}">${e.value.toFixed(1)}</span><span class="log-date">${e.date}</span></li>`).join('')}
      </ul></div>
      ${p.ecLog&&p.ecLog.length?`<div class="card"><div class="card-label">EC history</div><ul class="log-list">
        ${[...p.ecLog].reverse().slice(0,10).map(e=>`<li><span class="log-text">${e.value.toFixed(2)}</span><span class="log-date">${e.date}</span></li>`).join('')}
      </ul></div>`:''}
    </div>`:''}`;
}

function renderLog(p,tc){
  tc.innerHTML=`<div class="card"><div class="card-label">Add observation</div>
    <textarea id="note-input" placeholder="Observations, health notes, measurements..."></textarea>
    <button class="btn btn-primary" style="margin-top:8px" onclick="addNote('${p.id}')">Add note</button></div>
    <div class="card"><div class="card-label">All notes <span class="count">${p.notes?p.notes.length:0}</span></div>
    ${p.notes&&p.notes.length?`<ul class="log-list">${[...p.notes].reverse().map(n=>`<li><span class="log-text">${n.text}</span><span class="log-date">${n.date}</span></li>`).join('')}</ul>`:'<div class="empty-msg">No notes yet.</div>'}
    </div>`;
}

function renderFeed(p,tc){
  tc.innerHTML=`<div class="card"><div class="card-label">Log feeding</div>
    <div class="input-row"><input type="text" id="feed-input" placeholder="e.g. 5ml Big Bloom per gal, pH 6.0"><button class="btn btn-primary" onclick="addFeed('${p.id}')">Log</button></div></div>
    ${p.method==='DWC'?`<div class="alert warn"><strong>FoxFarm Hydro Trio:</strong> Wk 1–3: Grow Big Hydro ¼ str · Wk 4–6: +Big Bloom · Wk 7+: Tiger Bloom+Big Bloom</div>`:''}
    <div class="card"><div class="card-label">Feed history <span class="count">${p.feeds?p.feeds.length:0}</span></div>
    ${p.feeds&&p.feeds.length?`<ul class="log-list">${[...p.feeds].reverse().map(f=>`<li><span class="log-text">${f.text}</span><span class="log-date">${f.date}</span></li>`).join('')}</ul>`:'<div class="empty-msg">No feeds logged yet.</div>'}
    </div>`;
}

function renderLight(p,tc){
  const pct=Math.round(((p.lightHours-12)/8)*100);
  tc.innerHTML=`<div class="card"><div class="card-label">Daily light hours</div>
    <div class="light-display"><span class="light-val" id="light-val">${p.lightHours}h</span><span class="light-sub">per day</span></div>
    <input type="range" class="light-slider" min="12" max="20" step="1" value="${p.lightHours}"
      oninput="updateLightLive('${p.id}',this.value)" onchange="updateLightSave('${p.id}',this.value)">
    <div class="range-labels"><span>12h</span><span>16h</span><span>18h</span><span>20h</span></div>
    <div class="light-bar-wrap"><div class="light-bar-fill" id="light-bar" style="width:${pct}%"></div></div></div>
    <div class="card"><div class="card-label">Stage recommendations</div>
    <table class="rec-table">
      <tr><td>Seedling / germination</td><td class="ok">16–18h</td></tr>
      <tr><td>Vegetative</td><td class="ok">16–18h</td></tr>
      <tr><td>Flowering / fruiting (peppers)</td><td class="warn">12–14h</td></tr>
      <tr><td>Bonsai trees</td><td class="info">12–14h</td></tr>
      <tr><td>Lettuce (prevent bolt)</td><td class="ok">14–16h</td></tr>
    </table></div>`;
}

function renderHarden(p,tc){
  const dtf=daysUntil(LOCATION.lastFrost),dts=daysUntil(LOCATION.safePlant);
  const hd=hardenDay(p),hn=PLANT_HARDEN_NOTES[p.variety]||{minNight:50,note:'Monitor carefully.'};
  const idealD=new Date(LOCATION.safePlant+'T00:00:00');idealD.setDate(idealD.getDate()-10);
  const idealStr=idealD.toISOString().split('T')[0];
  const rows=HARDEN_SCHEDULE.map((s,i)=>{
    const d=new Date(TODAY);d.setDate(TODAY.getDate()+i);
    const ds=d.toLocaleDateString('en-US',{month:'short',day:'numeric'});
    let hi='—',lo='—',frost=false,cls='';
    if(weather&&weather.temperature_2m_max[i]!==undefined){
      hi=Math.round(weather.temperature_2m_max[i]);lo=Math.round(weather.temperature_2m_min[i]);
      frost=lo<=36;cls=lo<hn.minNight?'warn':'ok';
    }
    const isT=p.hardenStart&&hd===s.day,isPast=p.hardenStart&&hd>s.day;
    return`<tr class="${isT?'today-row':''} ${isPast?'past-row':''}">
      <td>${p.hardenStart?(isPast?'✓':isT?'▶':s.day):s.day}</td>
      <td>${ds}</td>
      <td>${s.hours}h <span class="${s.shade?'shade-tag':'sun-tag'}">${s.shade?'shade':'sun'}</span></td>
      <td class="notes-col">${s.notes}</td>
      <td class="${frost?'bad':cls}">${hi!=='—'?hi+'°/'+lo+'°':'—'}${frost?' ❄':''}</td></tr>`;
  }).join('');
  tc.innerHTML=`
    ${dtf>0?`<div class="harden-dates-row">
      <div class="hdc frost"><div class="hdc-label">Last frost risk</div><div class="hdc-val">${fmtDate(LOCATION.lastFrost)}</div><div class="hdc-days">${dtf}d away</div></div>
      <div class="hdc safe"><div class="hdc-label">Safe outdoor planting</div><div class="hdc-val">${fmtDate(LOCATION.safePlant)}</div><div class="hdc-days">${dts}d away</div></div>
      <div class="hdc ideal"><div class="hdc-label">Ideal harden start</div><div class="hdc-val">${fmtDate(idealStr)}</div><div class="hdc-days">${Math.max(0,dts-10)}d away</div></div>
    </div>`:''}
    <div class="alert info"><strong>${p.variety}:</strong> ${hn.note}</div>
    <div class="card"><div class="card-label">Progress</div>
      ${!p.hardenStart?`<p style="color:var(--text3);margin-bottom:12px">Not started yet.</p><button class="btn btn-primary" onclick="startHarden('${p.id}')">Start hardening today</button>`
      :`<div class="harden-progress">
          <div class="hp-track"><div class="hp-fill" style="width:${Math.min(100,(Math.min(hd,10)/10)*100)}%"></div></div>
          <div class="hp-label">Day ${Math.min(hd,10)} of 10${hd>10?' — complete!':''}</div>
        </div><button class="btn" onclick="resetHarden('${p.id}')" style="margin-top:8px">Reset</button>`}
    </div>
    <div class="card"><div class="card-label">10-day protocol ${weather?'· live forecast':'· loading weather...'}</div>
      <div style="overflow-x:auto">
        <table class="harden-table">
          <thead><tr><th>Day</th><th>Date</th><th>Outside</th><th>Guidance</th><th>Forecast hi/lo</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
}

function setFilter(f){currentFilter=f;renderSidebar();}
function setTab(t){currentTab=t;const p=plants.find(x=>x.id===selectedId);if(p)renderDetail();}
function selectPlant(id){selectedId=id;currentTab='overview';renderDetail();renderSidebar();if(window.innerWidth<768)document.getElementById('sidebar').classList.remove('open');}
function updateField(id,field,val){const p=plants.find(x=>x.id===id);if(!p)return;p[field]=val;savePlants();renderSidebar();}
function updateLightLive(id,val){const el=document.getElementById('light-val'),bar=document.getElementById('light-bar');if(el)el.textContent=val+'h';if(bar)bar.style.width=Math.round(((parseInt(val)-12)/8)*100)+'%';}
function updateLightSave(id,val){const p=plants.find(x=>x.id===id);if(!p)return;p.lightHours=parseInt(val);savePlants();renderSidebar();}
function addNote(id){const inp=document.getElementById('note-input');if(!inp||!inp.value.trim())return;const p=plants.find(x=>x.id===id);if(!p)return;if(!p.notes)p.notes=[];p.notes.push({text:inp.value.trim(),date:new Date().toLocaleDateString()});savePlants();renderDetail();}
function addFeed(id){const inp=document.getElementById('feed-input');if(!inp||!inp.value.trim())return;const p=plants.find(x=>x.id===id);if(!p)return;if(!p.feeds)p.feeds=[];p.feeds.push({text:inp.value.trim(),date:new Date().toLocaleDateString()});savePlants();renderDetail();}
function logPH(id){const inp=document.getElementById('ph-input');if(!inp||!inp.value)return;const p=plants.find(x=>x.id===id);if(!p)return;if(!p.phLog)p.phLog=[];p.phLog.push({value:parseFloat(parseFloat(inp.value).toFixed(1)),date:new Date().toLocaleDateString()});savePlants();renderDetail();}
function logEC(id){const inp=document.getElementById('ec-input');if(!inp||!inp.value)return;const p=plants.find(x=>x.id===id);if(!p)return;if(!p.ecLog)p.ecLog=[];p.ecLog.push({value:parseFloat(parseFloat(inp.value).toFixed(2)),date:new Date().toLocaleDateString()});savePlants();renderDetail();}
function startHarden(id){const p=plants.find(x=>x.id===id);if(!p)return;p.hardenStart=TODAY.toISOString().split('T')[0];savePlants();renderDetail();renderSidebar();}
function resetHarden(id){const p=plants.find(x=>x.id===id);if(!p)return;p.hardenStart=null;savePlants();renderDetail();renderSidebar();}
function exportData(){const b=new Blob([JSON.stringify(plants,null,2)],{type:'application/json'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`garden-${new Date().toISOString().split('T')[0]}.json`;a.click();URL.revokeObjectURL(u);}
function importData(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(Array.isArray(d)){plants=d;savePlants();selectedId=null;render();}}catch(err){alert('Invalid file.');}};r.readAsText(f);}
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open');}
function render(){renderSidebar();renderDetail();}
function init(){loadPlants();render();fetchWeather();}
document.addEventListener('DOMContentLoaded',init);
