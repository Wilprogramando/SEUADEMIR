:root{
  --forest:#10231d; --forest2:#1c3b32; --panel:#16302a;
  --cream:#f3f7f2; --cream2:#e6efe4;
  --lime:#9be870; --lime2:#7cd14e; --clay:#ff7a4d; --clay2:#f0623a;
  --gold:#e9c46a; --ink:#13241f; --muted:#7d918a; --line:#dbe6db;
  --grad: linear-gradient(135deg,#10231d 0%,#1c3b32 55%,#244c40 100%);
}
*{font-family:'Hanken Grotesk',sans-serif;box-sizing:border-box;}
html,body{margin:0;background:var(--cream);color:var(--ink);}
.display{font-family:'Fraunces',serif;}
::-webkit-scrollbar{width:10px;height:10px;}
::-webkit-scrollbar-thumb{background:#bcd0bf;border-radius:8px;}
::-webkit-scrollbar-track{background:transparent;}
input,textarea,select,button{outline:none;font-family:inherit;}

/* fundo com textura sutil */
.bg-app{
  background:
    radial-gradient(900px 500px at 100% -10%, rgba(155,232,112,.12), transparent 60%),
    radial-gradient(700px 500px at -10% 10%, rgba(255,122,77,.10), transparent 55%),
    var(--cream);
  min-height:100vh;
}

/* animações */
.fadein{animation:fadein .5s cubic-bezier(.2,.7,.2,1) both;}
@keyframes fadein{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}
.pop{animation:pop .35s cubic-bezier(.2,.8,.2,1) both;}
@keyframes pop{from{opacity:0;transform:scale(.96);}to{opacity:1;transform:none;}}
.stagger>*{animation:fadein .45s both;}
.stagger>*:nth-child(1){animation-delay:.03s}
.stagger>*:nth-child(2){animation-delay:.06s}
.stagger>*:nth-child(3){animation-delay:.09s}
.stagger>*:nth-child(4){animation-delay:.12s}
.stagger>*:nth-child(5){animation-delay:.15s}
.stagger>*:nth-child(6){animation-delay:.18s}

/* componentes */
.card{background:rgba(255,255,255,.78);backdrop-filter:blur(6px);border:1px solid var(--line);border-radius:20px;box-shadow:0 8px 30px -18px rgba(16,35,29,.4);}
.chk{transition:transform .16s ease, background .16s ease, color .16s ease, box-shadow .16s ease;}
.chk:active{transform:scale(.95);}
.btn-primary{background:var(--forest);color:var(--cream);border-radius:14px;font-weight:600;transition:.18s;}
.btn-primary:hover{background:var(--forest2);box-shadow:0 10px 24px -12px rgba(16,35,29,.6);}
.btn-lime{background:linear-gradient(135deg,var(--lime),var(--lime2));color:#0d2016;border-radius:14px;font-weight:700;transition:.18s;}
.btn-lime:hover{filter:brightness(1.03);box-shadow:0 10px 24px -12px rgba(124,209,78,.7);}
.field-input{width:100%;padding:.6rem .8rem;border-radius:12px;border:1px solid var(--line);background:rgba(255,255,255,.9);color:var(--ink);transition:.15s;}
.field-input:focus{border-color:var(--lime2);box-shadow:0 0 0 3px rgba(155,232,112,.25);}
.nav-active{background:var(--cream);color:var(--forest)!important;box-shadow:0 6px 16px -10px rgba(0,0,0,.5);}
.ring-gold{box-shadow:0 0 0 2px var(--gold) inset;}
.chip{font-size:.72rem;padding:.15rem .55rem;border-radius:999px;background:var(--cream2);color:var(--forest2);}

/* faixa decorativa de login */
.auth-hero{background:var(--grad);position:relative;overflow:hidden;}
.auth-hero::after{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.06) 1px,transparent 1px);background-size:18px 18px;opacity:.6;}
.glow{filter:drop-shadow(0 6px 16px rgba(155,232,112,.35));}
