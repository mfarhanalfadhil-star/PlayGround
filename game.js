import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const root = document.querySelector('#world');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x171918);
scene.fog = new THREE.FogExp2(0x171918, 0.035);
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(0, 10.6, 14.8);
camera.lookAt(0, 0.5, 0);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
root.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xb7b5a8, 0x292321, 1.7));
const moon = new THREE.DirectionalLight(0xc8d3cf, 2.5); moon.position.set(-5, 10, 4); moon.castShadow = true; moon.shadow.mapSize.set(1024, 1024); moon.shadow.camera.left = -9; moon.shadow.camera.right = 9; moon.shadow.camera.top = 9; moon.shadow.camera.bottom = -9; scene.add(moon);
const emberLight = new THREE.PointLight(0xd7593e, 22, 10, 2); emberLight.position.set(0, 1, -3.4); scene.add(emberLight);
const fill = new THREE.PointLight(0x867c62, 16, 13); fill.position.set(5, 3, 5); scene.add(fill);

const mat = (color, roughness=.8, metalness=0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
const stone = mat(0x343633), darkStone = mat(0x202321), iron = mat(0x363a3a,.38,.72), armor = mat(0x474947,.55,.42), cloth = mat(0x28272a), gold = mat(0xa78857,.42,.55), bone = mat(0x9a8d73), red = new THREE.MeshStandardMaterial({color:0xb7372c,emissive:0x791b13,emissiveIntensity:2});
const floor = new THREE.Mesh(new THREE.CircleGeometry(10, 80), mat(0x282b28)); floor.rotation.x=-Math.PI/2; floor.position.y=-.12; floor.receiveShadow=true; scene.add(floor);
const platform = new THREE.Mesh(new THREE.CylinderGeometry(7.4,7.8,.32,64), stone); platform.position.y=-.04; platform.receiveShadow=true; platform.castShadow=true; scene.add(platform);
const disk = new THREE.Mesh(new THREE.CircleGeometry(6.7,64), mat(0x30322e)); disk.rotation.x=-Math.PI/2; disk.position.y=.13; disk.receiveShadow=true; scene.add(disk);
const rim = new THREE.Mesh(new THREE.TorusGeometry(7.12,.12,8,90), iron); rim.rotation.x=Math.PI/2; rim.position.y=.17; rim.castShadow=true; scene.add(rim);
for(let r=1;r<=5;r++) { const rune = new THREE.Mesh(new THREE.TorusGeometry(r*1.14,.012,4,80), new THREE.MeshBasicMaterial({color:r===3?0x75654c:0x4c4a40,transparent:true,opacity:.48})); rune.rotation.x=Math.PI/2; rune.position.y=.145; scene.add(rune); }
// Broken flagstones give the arena a readable, hand-built floor.
for(let i=0;i<34;i++){const a=i*2.399, r=1.1+(i%7)*.78, w=.55+(i%3)*.14;const tile=new THREE.Mesh(new THREE.BoxGeometry(w,.035,w*.72),i%4?mat(0x383a35):mat(0x42413a));tile.position.set(Math.cos(a)*r,.16,Math.sin(a)*r);tile.rotation.y=a*.6;tile.receiveShadow=true;scene.add(tile)}
// Distant monoliths and fragments frame the duel.
for(let i=0;i<12;i++){const a=i*Math.PI/6, r=8.6, h=1.7+(i%4)*.43;const p=new THREE.Group();p.position.set(Math.cos(a)*r,.04,Math.sin(a)*r);p.rotation.y=a;const base=new THREE.Mesh(new THREE.BoxGeometry(.8,.22,.8),darkStone);base.position.y=.11;p.add(base);const col=new THREE.Mesh(new THREE.BoxGeometry(.43,h,.46),stone);col.position.y=.22+h/2;col.castShadow=true;col.receiveShadow=true;p.add(col);const cap=new THREE.Mesh(new THREE.BoxGeometry(.62,.15,.65),iron);cap.position.y=.22+h;p.add(cap);scene.add(p)}
for(let i=0;i<20;i++){const a=i*2.4,r=7.6+(i%3)*.65;const ember=new THREE.Mesh(new THREE.SphereGeometry(.035+(i%3)*.012,8,6),new THREE.MeshBasicMaterial({color:i%2?0xb87a4c:0x756744}));ember.position.set(Math.cos(a)*r,.45+(i%4)*.15,Math.sin(a)*r);scene.add(ember)}

function box(parent, size, material, pos, rot) {const m=new THREE.Mesh(new THREE.BoxGeometry(...size),material);m.position.set(...pos);if(rot)m.rotation.set(...rot);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function sphere(parent,r,material,pos,scale=[1,1,1]){const m=new THREE.Mesh(new THREE.SphereGeometry(r,16,12),material);m.position.set(...pos);m.scale.set(...scale);m.castShadow=true;parent.add(m);return m}
function limb(parent, from, to, radius, material){const a=new THREE.Vector3(...from),b=new THREE.Vector3(...to),d=new THREE.Vector3().subVectors(b,a);const m=new THREE.Mesh(new THREE.CylinderGeometry(radius*.76,radius,d.length(),9),material);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());m.castShadow=true;parent.add(m);return m}
function makeKnight(isBoss){
  const g=new THREE.Group(); const scale=isBoss?1.18:1;
  const bodyMat=isBoss?mat(0x292b2c,.4,.7):armor, clothMat=isBoss?mat(0x481e1d,.8):cloth;
  const torso=box(g,[.72,.88,.4],bodyMat,[0,1.32,0]); torso.rotation.x=-.04;
  box(g,[.83,.24,.46],isBoss?iron:gold,[0,1.55,0]);
  box(g,[.73,.42,.42],clothMat,[0,.9,.03],[.15,0,0]);
  const head=sphere(g,.34,bodyMat,[0,1.96,0],[.82,1.04,.84]);
  // helmet ridge, cheek guards and glowing visor
  box(g,[.5,.1,.48],isBoss?iron:gold,[0,2.25,0],[0,0,-.02]);
  box(g,[.45,.12,.08],iron,[0,2.02,.29]);
  box(g,[.32,.045,.045],isBoss?red:mat(0xc28b5b),[0,2.04,.345]);
  if(isBoss){for(const side of [-1,1]){const horn=limb(g,[side*.19,2.18,0],[side*.48,2.68,-.08],.105,bone);horn.rotation.z=side*-.12;}}
  for(const s of [-1,1]){
    const shoulder=sphere(g,.25,isBoss?iron:armor,[s*.49,1.58,0],[1,.85,1]);
    box(g,[.2,.33,.32],bodyMat,[s*.49,1.53,.1],[0,0,s*.14]);
    limb(g,[s*.49,1.43,0],[s*.55,1.04,.03],.13,bodyMat);
    sphere(g,.14,iron,[s*.55,1.02,.03]);
    limb(g,[s*.26,.9,0],[s*.28,.38,.04],.17,bodyMat);
    box(g,[.32,.25,.43],iron,[s*.28,.22,.07]);
    box(g,[.16,.52,.34],gold,[s*.53,1.45,.02],[0,0,s*.12]);
  }
  // Sword held out from the right hand; blade pivots for attack animation.
  const weaponPivot=new THREE.Group(); weaponPivot.position.set(.56,1.04,.08);g.add(weaponPivot);
  box(weaponPivot,[.09,.55,.09],gold,[0,-.17,.01]);
  const blade=box(weaponPivot,[.11,.86,.065],isBoss?bone:mat(0xb7c0bd,.24,.85),[0,-.83,.01]);
  blade.rotation.z=.02;
  const tip=new THREE.Mesh(new THREE.ConeGeometry(.055,.18,4),isBoss?bone:mat(0xb7c0bd,.24,.85));tip.position.set(0,-1.34,.01);tip.rotation.z=Math.PI;weaponPivot.add(tip);
  box(weaponPivot,[.47,.085,.12],isBoss?red:gold,[0,-.42,.01]);
  const shield=new THREE.Group();shield.position.set(-.6,1.15,.18);g.add(shield);
  const shieldMesh=new THREE.Mesh(new THREE.CylinderGeometry(.31,.38,.12,6),isBoss?iron:gold);shieldMesh.rotation.x=Math.PI/2;shieldMesh.castShadow=true;shield.add(shieldMesh);
  const shieldCenter=sphere(shield,.13,isBoss?red:iron,[0,0,.08],[1,1,.35]);
  g.scale.setScalar(scale);
  return {group:g, weaponPivot, shield, torso, head};
}
const player=makeKnight(false);scene.add(player.group);player.group.position.set(0,0,3.2);player.group.rotation.y=Math.PI;
const boss=makeKnight(true);scene.add(boss.group);boss.group.position.set(0,0,-2.4);
// Silhouette ring under combatants.
function shadowRing(color){const ring=new THREE.Mesh(new THREE.RingGeometry(.48,.72,32),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.38,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.18;scene.add(ring);return ring}
const pRing=shadowRing(0xc19b5e),bRing=shadowRing(0x9e332c);

const ui={health:document.querySelector('#health-fill'),stamina:document.querySelector('#stamina-fill'),boss:document.querySelector('#boss-fill'),healthText:document.querySelector('#health-value'),staminaText:document.querySelector('#stamina-value'),phase:document.querySelector('#boss-phase'),toast:document.querySelector('#toast'),status:document.querySelector('#status-text')};
let hp=100, stamina=100, bossHp=100, active=false, paused=false, ended=false, shieldHeld=false, time=0, toastTimer=0, shake=0;
const keys=new Set(), moveTouch={x:0,z:0};
let playerState='idle', dodgeTimer=0, parryTimer=0, attackTimer=0, attackCooldown=0, hitFlash=0, bossState='idle', bossTimer=1.6, bossCooldown=0, bossStun=0, bossAttackLanded=false, bossWindup=0, totalTime=0;
const clock=new THREE.Clock();
function showToast(text,duration=1.15){ui.toast.textContent=text;ui.toast.classList.add('show');toastTimer=duration}
function setStatus(text){ui.status.textContent=text}
function updateHud(){ui.health.style.width=`${hp}%`;ui.stamina.style.width=`${stamina}%`;ui.boss.style.width=`${bossHp}%`;ui.healthText.textContent=Math.ceil(hp);ui.staminaText.textContent=Math.ceil(stamina);ui.phase.textContent=bossHp<=40?'PHASE II':'PHASE I'}
function startGame(){active=true;paused=false;document.querySelector('#center-prompt').classList.add('dismiss');setStatus('The Hollow Knight watches your every move…');showToast('THE DUEL BEGINS',1.6);}
function endGame(won){if(ended)return;ended=true;active=false;document.querySelector('#result').classList.remove('hidden');document.querySelector('#result').classList.toggle('killed',!won);document.querySelector('#result-title').textContent=won?'VICTORY':'YOU HAVE FALLEN';document.querySelector('#result-copy').textContent=won?'The Hollow Knight returns to the silence. Your oath endures.':'The sanctum claims another soul. Learn his rhythm, then rise again.'}
function resetGame(){hp=100;stamina=100;bossHp=100;active=true;paused=false;ended=false;shieldHeld=false;playerState='idle';dodgeTimer=parryTimer=attackTimer=attackCooldown=0;bossState='idle';bossTimer=1.5;bossCooldown=0;bossStun=0;bossAttackLanded=false;player.group.position.set(0,0,3.2);boss.group.position.set(0,0,-2.4);player.group.rotation.y=Math.PI;boss.group.rotation.y=Math.PI;document.querySelector('#result').classList.add('hidden');document.querySelector('#pause-overlay').classList.add('hidden');document.querySelector('#center-prompt').classList.add('dismiss');setStatus('The Hollow Knight watches your every move…');updateHud()}
function pauseGame(value){if(!active&&!paused)return;paused=value;document.querySelector('#pause-overlay').classList.toggle('hidden',!paused)}
function face(from,to){const dx=to.x-from.x,dz=to.z-from.z;return Math.atan2(dx,dz)}
function forward(group){return new THREE.Vector3(Math.sin(group.rotation.y),0,Math.cos(group.rotation.y))}
function action(name){if(!active||paused||ended)return;
  if(name==='attack'&&attackCooldown<=0&&stamina>=9){attackTimer=.38;attackCooldown=.58;stamina-=9;playerState='attack';player.weaponPivot.rotation.x=-.9;player.weaponPivot.rotation.z=-.42;setStatus('Strike while the opening lasts…');}
  if(name==='dodge'&&dodgeTimer<=0&&stamina>=23){dodgeTimer=.5;stamina-=23;playerState='dodge';showToast('EVASIVE STEP',.55);const move=movementVector();if(move.lengthSq()<.05){move.copy(forward(player.group)).multiplyScalar(-1)} player.group.position.add(move.normalize().multiplyScalar(1.05));}
  if(name==='parry'&&stamina>=15){parryTimer=.48;stamina-=15;playerState='parry';showToast('STEEL READY',.45);}
  if(name==='shield'){shieldHeld=true;}
}
function movementVector(){const v=new THREE.Vector3(moveTouch.x,0,moveTouch.z);if(keys.has('w')||keys.has('arrowup'))v.z-=1;if(keys.has('s')||keys.has('arrowdown'))v.z+=1;if(keys.has('a')||keys.has('arrowleft'))v.x-=1;if(keys.has('d')||keys.has('arrowright'))v.x+=1;return v.lengthSq()>1?v.normalize():v}
function hurtPlayer(amount){hp=Math.max(0,hp-amount);hitFlash=.2;shake=.22;player.torso.material=red;setTimeout(()=>{if(player.torso.material===red)player.torso.material=armor},90);showToast(`-${amount} VITALITY`,.65);updateHud();if(hp<=0)endGame(false)}
function hurtBoss(amount){bossHp=Math.max(0,bossHp-amount);bossStun=.45;bossState='stun';bossTimer=0;showToast('OPENING PUNISHED',.8);updateHud();if(bossHp<=0)endGame(true)}
function update(dt){time+=dt;if(!active||paused){return}
 totalTime+=dt;attackCooldown=Math.max(0,attackCooldown-dt);dodgeTimer=Math.max(0,dodgeTimer-dt);parryTimer=Math.max(0,parryTimer-dt);if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)ui.toast.classList.remove('show')}
 const movement=movementVector();if(movement.lengthSq()>.01&&dodgeTimer<=0){const speed=2.7;player.group.position.addScaledVector(movement,speed*dt);player.group.rotation.y=THREE.MathUtils.damp(player.group.rotation.y,Math.atan2(movement.x,movement.z),dt*10);if(playerState!=='attack'&&playerState!=='parry')playerState='move';}else if(playerState==='move')playerState='idle';
 player.group.position.x=THREE.MathUtils.clamp(player.group.position.x,-6.1,6.1);player.group.position.z=THREE.MathUtils.clamp(player.group.position.z,-5.7,6.1);
 boss.group.rotation.y=THREE.MathUtils.damp(boss.group.rotation.y,face(boss.group.position,player.group.position),dt*5);
 const distance=boss.group.position.distanceTo(player.group.position);
 // Player's quick but deliberate sword strike, with short forward reach.
 if(attackTimer>0){attackTimer-=dt;player.weaponPivot.rotation.x=THREE.MathUtils.damp(player.weaponPivot.rotation.x,-1.85,dt*12);player.weaponPivot.rotation.z=THREE.MathUtils.damp(player.weaponPivot.rotation.z,.72,dt*12);if(attackTimer<.2&&!player.didHit){player.didHit=true;const facing=forward(player.group);const toBoss=new THREE.Vector3().subVectors(boss.group.position,player.group.position);if(distance<2.35&&facing.dot(toBoss.normalize())>.22&&bossState!=='stun'){hurtBoss(bossHp<=40?17:14);}}if(attackTimer<=0){player.didHit=false;player.weaponPivot.rotation.set(0,0,0);if(playerState==='attack')playerState='idle';}}else if(Math.abs(player.weaponPivot.rotation.x)+Math.abs(player.weaponPivot.rotation.y)+Math.abs(player.weaponPivot.rotation.z)>0.03){player.weaponPivot.rotation.x=THREE.MathUtils.damp(player.weaponPivot.rotation.x,0,dt*9);player.weaponPivot.rotation.z=THREE.MathUtils.damp(player.weaponPivot.rotation.z,0,dt*9)}
 // stamina regenerates except while actively guarding or during a technique.
 if(!shieldHeld&&dodgeTimer<=0&&parryTimer<=0)stamina=Math.min(100,stamina+17*dt);if(shieldHeld){stamina=Math.max(0,stamina-8*dt);if(stamina<=0)shieldHeld=false;}player.shield.scale.setScalar(shieldHeld?1.16:1);player.shield.rotation.y=THREE.MathUtils.damp(player.shield.rotation.y,shieldHeld?-.35:0,dt*8);
 // Boss rhythm: approach, clearly telegraph, commit, recover.
 bossCooldown=Math.max(0,bossCooldown-dt);
 if(bossState==='stun'){bossStun-=dt;if(bossStun<=0){bossState='recover';bossTimer=.7}}
 else if(bossState==='idle'||bossState==='approach'){
   if(distance>2.05){bossState='approach';const dir=new THREE.Vector3().subVectors(player.group.position,boss.group.position).setY(0).normalize();boss.group.position.addScaledVector(dir,Math.min(distance-1.72,1.25)*dt*(bossHp<=40?1.2:.78));}
   else if(bossCooldown<=0){bossState='telegraph';bossTimer=bossHp<=40?.73:.97;bossAttackLanded=false;setStatus('His blade draws back — prepare to react');}
 }
 else if(bossState==='telegraph'){
   bossTimer-=dt;boss.weaponPivot.rotation.x=THREE.MathUtils.damp(boss.weaponPivot.rotation.x,-.75,dt*5);boss.group.scale.setScalar(1.18+Math.sin(time*22)*.018);
   if(bossTimer<=0){bossState='attack';bossTimer=.3;bossWindup=.3;boss.weaponPivot.rotation.x=1.1;setStatus('NOW — parry, dodge, or raise your guard');}
 }
 else if(bossState==='attack'){
   bossTimer-=dt;boss.weaponPivot.rotation.x=THREE.MathUtils.damp(boss.weaponPivot.rotation.x,1.8,dt*14);
   if(bossTimer<=.16&&!bossAttackLanded){bossAttackLanded=true;const dir=new THREE.Vector3().subVectors(player.group.position,boss.group.position).setY(0);const d=dir.length();dir.normalize();const facing=forward(boss.group).dot(dir);
     if(d<2.85&&facing>.1){if(parryTimer>0){parryTimer=0;hurtBoss(22);bossState='stun';bossStun=.8;boss.weaponPivot.rotation.x=0;setStatus('PERFECT PARRY — punish him!');showToast('✦  PERFECT PARRY  ✦',1.2);}
       else if(dodgeTimer>0){showToast('CLEAN DODGE',.65);setStatus('His strike misses — take your opening');}
       else if(shieldHeld&&stamina>0){const cost=bossHp<=40?20:14;stamina=Math.max(0,stamina-cost);if(stamina>0){showToast('BLOCKED · STAMINA -'+cost,.7);shake=.07}else hurtPlayer(20);}
       else hurtPlayer(bossHp<=40?28:20);
     } else {showToast('OUT OF REACH',.5)}
   }
   if(bossTimer<=0){bossState='recover';bossTimer=.95;bossCooldown=bossHp<=40?.4:.9;boss.weaponPivot.rotation.set(0,0,0);boss.group.scale.setScalar(1.18);setStatus('A brief opening — strike now');}
 }
 else if(bossState==='recover'){bossTimer-=dt;boss.weaponPivot.rotation.x=THREE.MathUtils.damp(boss.weaponPivot.rotation.x,0,dt*8);if(bossTimer<=0)bossState='idle'}
 if(bossState!=='telegraph')boss.group.scale.setScalar(THREE.MathUtils.damp(boss.group.scale.x,1.18,dt*5));
 // Compact idle motion, foot shadows and camera follow.
 player.group.position.y=Math.sin(time*5)*.018;boss.group.position.y=Math.sin(time*4+1)*.025;
 pRing.position.set(player.group.position.x,.18,player.group.position.z);bRing.position.set(boss.group.position.x,.18,boss.group.position.z);
 pRing.material.opacity=.3+stamina/400;bRing.material.opacity=bossState==='telegraph'?.8:.35;
 if(bossState==='telegraph'){bRing.scale.setScalar(1+Math.sin(time*20)*.1);emberLight.intensity=25+Math.sin(time*22)*10}else{bRing.scale.setScalar(1);emberLight.intensity=22}
 const target=new THREE.Vector3(player.group.position.x*.2,0,0);camera.position.x=THREE.MathUtils.damp(camera.position.x,target.x,dt*2);camera.lookAt(target.x,.45,0);
 if(shake>0){shake=Math.max(0,shake-dt);camera.position.x+=(Math.random()-.5)*shake;camera.position.y=10.6+(Math.random()-.5)*shake*2}
 updateHud();
}
function resize(){const w=root.clientWidth,h=root.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();if(w<700){camera.position.y=12.3;camera.position.z=16.8;camera.fov=45}else{camera.position.y=10.6;camera.position.z=14.8;camera.fov=42}camera.updateProjectionMatrix()}
window.addEventListener('resize',resize);resize();
function loop(){requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.04);update(dt);renderer.render(scene,camera)}loop();

window.addEventListener('keydown',e=>{const key=e.key.toLowerCase();keys.add(key);if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(key))e.preventDefault();if(key===' '){action('dodge')}if(key==='j'){action('attack')}if(key==='k'){action('parry')}if(key==='l'){action('shield')}});
window.addEventListener('keyup',e=>{const key=e.key.toLowerCase();keys.delete(key);if(key==='l'){shieldHeld=false}});
document.querySelector('#begin-btn').addEventListener('click',startGame);
document.querySelector('#retry-btn').addEventListener('click',resetGame);
document.querySelector('#pause-btn').addEventListener('click',()=>pauseGame(true));document.querySelector('#resume-btn').addEventListener('click',()=>pauseGame(false));
const joystick=document.querySelector('#joystick'),knob=document.querySelector('#joy-knob');let joyPointer=null;
function joyMove(e){const r=joystick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,max=38,len=Math.hypot(dx,dy),scale=len>max?max/len:1;const x=dx*scale,y=dy*scale;knob.style.transform=`translate(${x}px,${y}px)`;moveTouch.x=x/max;moveTouch.z=y/max;}
joystick.addEventListener('pointerdown',e=>{joyPointer=e.pointerId;joystick.setPointerCapture(joyPointer);joyMove(e)});joystick.addEventListener('pointermove',e=>{if(e.pointerId===joyPointer)joyMove(e)});function joyEnd(){joyPointer=null;moveTouch.x=moveTouch.z=0;knob.style.transform=''}joystick.addEventListener('pointerup',joyEnd);joystick.addEventListener('pointercancel',joyEnd);
document.querySelectorAll('.action-btn').forEach(button=>{const act=button.dataset.action;button.addEventListener('pointerdown',e=>{e.preventDefault();button.classList.add('active');if(act==='shield'){action('shield')}else action(act)});const off=()=>{button.classList.remove('active');if(act==='shield')shieldHeld=false};button.addEventListener('pointerup',off);button.addEventListener('pointercancel',off);button.addEventListener('pointerleave',off)});
// Avoid accidental context-menu / page gestures during touch combat.
document.addEventListener('contextmenu',e=>e.preventDefault());
