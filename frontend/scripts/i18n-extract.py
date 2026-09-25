import re,os,json,glob,sys
# Uso: python scripts/i18n-extract.py  (na pasta frontend)
# Lista os textos em português da área pública que ainda não estão em src/i18n/translations.js.
root=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','src')
files=[]
for pat in ['pages/HomePage.jsx','pages/SobrePage.jsx','pages/ServicosPage.jsx','pages/EquipamentosPage.jsx','pages/OrcamentoPage.jsx','pages/ConfiguradorPage.jsx',
            'components/home/*.jsx','components/layout/*.jsx','components/quote/*.jsx','components/configurator/**/*.js*',
            'data/serviceCatalog.js','data/requestNeeds.js','data/equipmentSpecs.js','utils/contactValidation.js',
            'pages/customer/CustomerAccessPage.jsx','components/customer/CustomerAuthCard.jsx']:
    files+=glob.glob(os.path.join(root,pat),recursive=True)
LETTER=re.compile(r'[A-Za-zÀ-ÿ]')
ACC=re.compile(r'[À-ÿ]')
def looks_text(t):
    t=t.strip()
    if len(t)<2 or not LETTER.search(t): return False
    if t.startswith(('/','http','#','./','../','mailto:','tel:')): return False
    if re.fullmatch(r'[a-z0-9_\-\.]+',t): return False  # ids
    if re.fullmatch(r'[A-Z0-9_]+',t) and len(t)<=4: return False
    toks=t.split()
    # tailwind/class-like
    cls=sum(1 for x in toks if re.search(r'[\[\]:]|^-?[a-z]+-[a-z0-9\-\[\]\/\.]+$',x) or x in ('flex','grid','block','hidden','relative','absolute','fixed','inset-0','group','uppercase','italic','truncate','shrink-0','border','rounded','transition','sr-only','isolate','h-full','w-full'))
    if toks and cls/len(toks)>=0.5: return False
    if re.search(r'\b(px|py|rgba|translate|blur)\b\(',t): return False
    if not (re.search(r'[A-ZÀ-Ý]',t) or ACC.search(t) or len(toks)>=2): return False
    if re.fullmatch(r'[\w\-]+(\.[\w\-]+)+',t): return False  # file names
    return True
out={}
for f in files:
    s=open(f,encoding='utf-8-sig').read()
    rel=os.path.relpath(f,root)
    # remove comments
    s2=re.sub(r'/\*.*?\*/','',s,flags=re.S)
    s2=re.sub(r'(?m)^\s*//.*$','',s2)
    s2=re.sub(r'\{/\*.*?\*/\}','',s2,flags=re.S)
    # JSX text: between > and < or { (not inside tags)
    for m in re.finditer(r'>([^<>{}]+)(?=[<{])',s2):
        raw=m.group(1)
        if '=>' in s2[max(0,m.start()-1):m.start()+1]: continue
        lines=[l.strip() for l in raw.split('\n')]
        text=' '.join(l for l in lines if l)
        if ('\n' not in raw): text=raw  # single line keeps inner spaces exactly
        t=text.strip()
        if looks_text(t) and not re.search(r'[;=]|\)\s*$|^\)|&&|\|\|',t):
            out.setdefault(t,set()).add(rel)
    for m in re.finditer(r'"((?:[^"\\\n]|\\.)*)"|\'((?:[^\'\\\n]|\\.)*)\'|`([^`$]*)`',s2):
        t=next(g for g in m.groups() if g is not None)
        if '\n' in t or re.search(r'[{}<>=;]',t): continue
        if looks_text(t):
            out.setdefault(t.strip(),set()).add(rel)
res={k:sorted(v) for k,v in out.items()}
known=open(os.path.join(root,'i18n','translations.js'),encoding='utf-8').read()
def noise(k):
    return bool(re.fullmatch(r'[MmLlHhVvCcZzAaSsQqTt0-9 .,\-]+',k)) or not re.search(r'[a-zà-ÿ]{2}',k) \
        or bool(re.fullmatch(r'[a-z0-9 ]+',k)) or bool(re.fullmatch(r'(ZEISS|SENAI|PRISMO|DuraMax|O-INSPECT|ATOS[ -]Q|T-SCAN|BOSELLO MAX|[ ·\-])+',k))
missing=[k for k in sorted(res) if json.dumps(k,ensure_ascii=False) not in known and not noise(k)]
print(len(missing),'textos sem tradução:')
for k in missing: print(' -',k)
