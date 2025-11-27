function save(key,val){localStorage.setItem(key,JSON.stringify(val))}
function load(key,fallback){const v=localStorage.getItem(key);return v?JSON.parse(v):fallback}

const RESORTS_KEY='ta_resorts_v1',ARRIVALS_KEY='ta_arrivals_v1';

const resortForm=document.getElementById('resort-form'),
      resortList=document.getElementById('resort-list'),
      resortSelect=document.getElementById('t-resort'),
      resortStorage=document.getElementById('resort-storage'),
      arrivalForm=document.getElementById('arrival-form'),
      arrivalsTable=document.querySelector('#arrivals-table tbody'),
      arrivalStorage=document.getElementById('arrival-storage'),
      visitSelect=document.getElementById('t-visit'),
      daysContainer=document.getElementById('days-container'),
      hoursContainer=document.getElementById('hours-container'),
      btnExport=document.getElementById('btn-export'),
      btnSeed=document.getElementById('btn-seed'),
      btnClearArrivals=document.getElementById('btn-clear-arrivals'),
      btnClearResorts=document.getElementById('btn-clear-resorts');

// RESORTS
function renderResorts(){
  const resorts=load(RESORTS_KEY,[]);
  resortList.innerHTML=resorts.length===0?'No resorts yet':resorts.map(r=>'• '+r).join('<br>');
  resortSelect.innerHTML=resorts.length===0?'<option value="">-- no resorts --</option>':resorts.map(r=>`<option>${r}</option>`).join('');
  resortStorage.innerHTML=resorts.length===0?'No resort history yet':resorts.map(r=>'• '+r).join('<br>');
}

resortForm.addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.getElementById('resort-name').value.trim();
  if(!name) return;
  const resorts=load(RESORTS_KEY,[]);
  if(!resorts.includes(name)) resorts.push(name);
  save(RESORTS_KEY,resorts);
  document.getElementById('resort-name').value='';
  renderResorts();
});

btnClearResorts.addEventListener('click',()=>{if(confirm('Clear all resorts?')){save(RESORTS_KEY,[]);renderResorts()}});

// ARRIVALS
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c])}

function renderArrivals(){
  const arr=load(ARRIVALS_KEY,[]);arrivalsTable.innerHTML='';
  if(arr.length===0){arrivalsTable.innerHTML='<tr><td colspan="13" class="muted">No arrivals yet</td></tr>'}
  else{
    arr.slice().reverse().forEach((a,i)=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td>${escapeHtml(a.name)}</td><td>${escapeHtml(a.resort)}</td><td>${escapeHtml(a.category)}</td><td>${a.date}</td><td>${a.male}</td><td>${a.female}</td><td>${a.total}</td><td>${a.nationality}</td><td>${a.visit}</td><td>${a.hours}</td><td>${a.days}</td><td>${a.addedBy}</td><td><button data-index="${i}" class="del">Delete</button></td>`;
      arrivalsTable.appendChild(tr)
    });
    arrivalsTable.querySelectorAll('.del').forEach(btn=>{
      btn.addEventListener('click',()=>{
        if(!confirm('Delete this arrival?')) return;
        let list=load(ARRIVALS_KEY,[]);
        list.splice(list.length-1-btn.dataset.index,1);
        save(ARRIVALS_KEY,list);
        renderArrivals();
      })
    })
  }
  renderArrivalStorage();
}

function renderArrivalStorage(){
  const arr=load(ARRIVALS_KEY,[]);
  arrivalStorage.innerHTML=arr.length===0?'No arrival history yet':arr.map(a=>`• ${a.name} — ${a.resort} — ${a.category} — ${a.date} — Male: ${a.male} / Female: ${a.female} — Total: ${a.total} — ${a.nationality} — ${a.visit} — Hours: ${a.hours} — Days: ${a.days}`).join('<br>');
}

arrivalForm.addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.getElementById('t-name').value.trim(),
        resort=document.getElementById('t-resort').value,
        category=document.getElementById('t-category').value,
        date=document.getElementById('t-date').value,
        male=parseInt(document.getElementById('t-male').value)||0,
        female=parseInt(document.getElementById('t-female').value)||0,
        nationality=document.getElementById('t-nationality').value,
        visit=document.getElementById('t-visit').value,
        hours=document.getElementById('t-hours').value,
        days=document.getElementById('t-days').value,
        total=male+female;

  if(!name||!resort||!category||!date||(male+female)===0||!nationality||!visit||(visit==='Day Tour'&&!hours)||(visit==='Overnight'&&!days)){
    alert('Please fill all required fields correctly');return;
  }

  let list=load(ARRIVALS_KEY,[]);
  list.push({id:Date.now(),name,resort,category,date,male,female,total,nationality,visit,hours,days,addedBy:"Admin"});
  save(ARRIVALS_KEY,list);arrivalForm.reset();renderArrivals();
});

// Toggle Day/Hour dropdowns
visitSelect.addEventListener('change',()=>{
  if(visitSelect.value==='Day Tour'){hoursContainer.style.display='block';daysContainer.style.display='none'}
  else if(visitSelect.value==='Overnight'){daysContainer.style.display='block';hoursContainer.style.display='none'}
  else{daysContainer.style.display='none';hoursContainer.style.display='none'}
});

// EXPORT CSV
btnExport.addEventListener('click',()=>{
  const arr=load(ARRIVALS_KEY,[]);
  if(arr.length===0){alert('No data');return}
  const header=['Name','Resort/Place','Category','Date','Male','Female','Total','Nationality','Visit','Hours','Days','AddedBy'];
  const rows=[header.join(',')].concat(arr.map(r=>[r.name,r.resort,r.category,r.date,r.male,r.female,r.total,r.nationality,r.visit,r.hours,r.days,r.addedBy].map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')));
  const csv=new Blob([rows.join('\n')],{type:'text/csv'});const url=URL.createObjectURL(csv);const a=document.createElement('a');a.href=url;a.download='arrivals.csv';a.click();URL.revokeObjectURL(url);
});

// CLEAR
btnClearArrivals.addEventListener('click',()=>{if(confirm('Clear all arrivals?')){save(ARRIVALS_KEY,[]);renderArrivals()}});

// SEED DEMO
btnSeed.addEventListener('click',()=>{
  const resorts=['Church of Malolos','Sunshine Beach Resort','Blue Lagoon'];
  save(RESORTS_KEY,resorts);
  const arrivals=[
    {id:1,name:'Maria Santos',resort:resorts[0],category:'Church',date:'2025-07-10',male:1,female:2,total:3,nationality:'Local',visit:'Day Tour',hours:'1hr–3hrs',days:'',addedBy:'Admin'},
    {id:2,name:'John Lee',resort:resorts[1],category:'Resort',date:'2025-09-02',male:2,female:2,total:4,nationality:'Foreign',visit:'Overnight',hours:'',days:'2',addedBy:'Admin'}
  ];
  save(ARRIVALS_KEY,arrivals);
  renderResorts();renderArrivals();
});

// Init date
document.getElementById('t-date').value=new Date().toISOString().slice(0,10);

// Initial render
renderResorts();renderArrivals();

document.addEventListener('DOMContentLoaded', () => {
    // --- (Iba pang code mo para sa forms, tables, atbp.) ---

    // 1. Kukunin natin ang 'Show Chart' button gamit ang ID nito
    const showChartButton = document.getElementById('btn-show-chart');
    
    // 2. Titiyakin natin na nandyan ang button bago magdagdag ng event listener
    if (showChartButton) {
        // 3. Magdadagdag tayo ng 'click' event listener
        showChartButton.addEventListener('click', () => {
            // Ito ang magre-redirect sa 'chart.html'
            window.location.href = 'chart.html';
        });
    }

    // --- (Iba pang code mo, tulad ng 'btn-seed', 'btn-clear-arrivals', atbp.) ---
});