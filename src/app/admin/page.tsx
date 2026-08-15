"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Translations } from "@/i18n/translations";
import { apiUrl, apiItemUrl, apiItemMethod } from "@/lib/api-base";
import {
  SECTIONS,
  defaultValues,
  sectionFields,
  type TextField,
  type TextOverrides,
} from "@/i18n/text-fields";

/* ─── types ─── */
type PortfolioItem = {
  id: string;
  type: "video" | "photo";
  title: string;
  category: string;
  youtubeId?: string;
  bg: string;
  thumbnail?: string;
};

type Award = { year: string; title: string; org: string };

type Content = {
  bioShort: string;
  bioFull: string;
  awards: Award[];
  texts?: TextOverrides;
};

const CATEGORIES = ["Film", "Podcast", "Event", "Foto", "Dron"];
const TABS = ["Galeria", "Teksty", "Bio", "Nagrody"] as const;
type Tab = (typeof TABS)[number];

/* ─── style helpers ─── */
function navBtnStyle(active: boolean): React.CSSProperties {
  return {
    display: "block", width: "100%", textAlign: "left", padding: "11px 24px",
    background: active ? "rgba(242,237,232,0.07)" : "transparent",
    border: "none", cursor: "pointer", fontSize: 13,
    color: active ? "#f2ede8" : "rgba(242,237,232,0.5)",
    letterSpacing: "0.04em",
    borderLeft: active ? "2px solid #f2ede8" : "2px solid transparent",
    transition: "all 0.18s ease",
  };
}

function btnStyle(variant: "primary" | "ghost" | "danger" = "primary"): React.CSSProperties {
  return {
    padding: variant === "ghost" ? "7px 14px" : "8px 18px",
    border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500,
    letterSpacing: "0.06em", borderRadius: 4, transition: "opacity 0.18s ease",
    background: variant === "primary" ? "#f2ede8" : variant === "danger" ? "rgba(200,60,60,0.15)" : "rgba(242,237,232,0.08)",
    color: variant === "primary" ? "#0d0d0d" : variant === "danger" ? "#e05555" : "#f2ede8",
  };
}

function badgePillStyle(type: string): React.CSSProperties {
  return {
    display: "inline-block", padding: "2px 8px", borderRadius: 999,
    fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
    background: type === "video" ? "rgba(100,150,255,0.15)" : "rgba(200,160,80,0.15)",
    color: type === "video" ? "#8ab4ff" : "#d4a843",
    marginRight: 6,
  };
}

/* ─── static styles ─── */
const S: Record<string, React.CSSProperties> = {
  page: { display: "flex", minHeight: "100vh", background: "#0d0d0d", fontFamily: "system-ui, sans-serif" },
  sidebar: { width: 220, background: "#111", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", flexShrink: 0 },
  sidebarHeader: { padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" },
  logoText: { fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#f2ede8" },
  sidebarLabel: { fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(242,237,232,0.35)", marginTop: 24, padding: "0 24px 8px" },
  main: { flex: 1, overflow: "auto" },
  topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.07)", position: "sticky", top: 0, background: "#0d0d0d", zIndex: 10 },
  tabTitle: { fontSize: 18, fontWeight: 600, color: "#f2ede8" },
  content: { padding: "32px 40px" },
  card: { background: "#161616", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, overflow: "hidden", marginBottom: 12 },
  cardRow: { display: "flex", alignItems: "center", gap: 16, padding: "16px 20px" },
  thumb: { width: 64, height: 40, objectFit: "cover", borderRadius: 3, background: "#222", flexShrink: 0 },
  cardInfo: { flex: 1, minWidth: 0 },
  cardTitle: { fontSize: 14, color: "#f2ede8", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  cardMeta: { fontSize: 11, color: "rgba(242,237,232,0.4)", letterSpacing: "0.06em" },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 },
  modalBox: { background: "#161616", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, width: "100%", maxWidth: 520, maxHeight: "90vh", overflow: "auto", padding: 32 },
  modalTitle: { fontSize: 16, fontWeight: 600, color: "#f2ede8", marginBottom: 24 },
  label: { display: "block", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(242,237,232,0.45)", marginBottom: 7, marginTop: 16 },
  input: { display: "block", width: "100%", background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "10px 12px", fontSize: 14, color: "#f2ede8", outline: "none", boxSizing: "border-box" },
  textarea: { display: "block", width: "100%", background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "10px 12px", fontSize: 14, color: "#f2ede8", outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: 100 },
  select: { display: "block", width: "100%", background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "10px 12px", fontSize: 14, color: "#f2ede8", outline: "none" },
  formRow: { display: "flex", gap: 12, marginTop: 24 },
  loginWrap: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center" },
  loginBox: { background: "#161616", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "48px 40px", width: "100%", maxWidth: 360 },
  loginTitle: { fontSize: 20, fontWeight: 700, color: "#f2ede8", letterSpacing: "-0.02em", marginBottom: 8 },
  loginSub: { fontSize: 13, color: "rgba(242,237,232,0.45)", marginBottom: 32 },
  errorMsg: { fontSize: 12, color: "#e05555", marginTop: 10 },
};

/* ─── Login ─── */
function LoginScreen({ onAuth }: { onAuth: (pw: string) => void }) {
  const [user, setUser] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch(apiUrl("auth"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: user, password: pw }) });
    setLoading(false);
    if (res.ok) { onAuth(pw); } else { setErr("Nieprawidłowy użytkownik lub hasło"); }
  }

  return (
    <div style={S.loginWrap}>
      <div style={S.loginBox}>
        <p style={S.loginTitle}>Panel admina</p>
        <p style={S.loginSub}>Lotne Media — CMS</p>
        <form onSubmit={handleLogin}>
          <label style={{ ...S.label, marginTop: 0 }}>Użytkownik</label>
          <input style={S.input} type="text" value={user} onChange={(e) => setUser(e.target.value)} autoFocus placeholder="użytkownik" autoComplete="username" />
          <label style={S.label}>Hasło</label>
          <input style={S.input} type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          {err && <p style={S.errorMsg}>{err}</p>}
          <div style={{ marginTop: 24 }}>
            <button type="submit" style={{ ...btnStyle("primary"), width: "100%", padding: "12px" }} disabled={loading}>
              {loading ? "Logowanie…" : "Zaloguj się"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Thumbnail + upload ─── */
function ThumbField({ value, onChange, adminKey }: { value: string; onChange: (url: string) => void; adminKey: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(apiUrl("upload"), { method: "POST", headers: { "x-admin-key": adminKey }, body: fd });
    const { url } = await res.json();
    onChange(url);
    setUploading(false);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
      {value && <img src={value} alt="" style={{ width: 72, height: 44, objectFit: "cover", borderRadius: 3, background: "#222", flexShrink: 0 }} />}
      <input style={{ ...S.input, flex: 1 }} value={value} onChange={(e) => onChange(e.target.value)} placeholder="URL lub wgraj plik…" />
      <button type="button" onClick={() => fileRef.current?.click()} style={{ ...btnStyle("ghost"), whiteSpace: "nowrap", flexShrink: 0 }} disabled={uploading}>
        {uploading ? "…" : "Wgraj"}
      </button>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </div>
  );
}

/* ─── Item form modal ─── */
function ItemForm({ initial, onSave, onCancel, adminKey }: {
  initial?: PortfolioItem;
  onSave: (item: Omit<PortfolioItem, "id">) => void;
  onCancel: () => void;
  adminKey: string;
}) {
  const blank: Omit<PortfolioItem, "id"> = { type: "video", title: "", category: "Film", youtubeId: "", bg: "#1a1a1a", thumbnail: "" };
  const [form, setForm] = useState<Omit<PortfolioItem, "id">>(
    initial
      ? { type: initial.type, title: initial.title, category: initial.category, youtubeId: initial.youtubeId || "", bg: initial.bg, thumbnail: initial.thumbnail || "" }
      : blank
  );

  function set(k: string, v: string) { setForm((p) => ({ ...p, [k]: v })); }

  return (
    <div style={S.modal} onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div style={S.modalBox}>
        <p style={S.modalTitle}>{initial ? "Edytuj pozycję" : "Dodaj pozycję"}</p>

        <label style={S.label}>Typ</label>
        <select style={S.select} value={form.type} onChange={(e) => set("type", e.target.value)}>
          <option value="video">Wideo</option>
          <option value="photo">Zdjęcie</option>
        </select>

        <label style={S.label}>Tytuł</label>
        <input style={S.input} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Tytuł realizacji" />

        <label style={S.label}>Kategoria</label>
        <select style={S.select} value={form.category} onChange={(e) => set("category", e.target.value)}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>

        {form.type === "video" && (
          <>
            <label style={S.label}>YouTube ID</label>
            <input style={S.input} value={form.youtubeId} onChange={(e) => set("youtubeId", e.target.value)} placeholder="np. dQw4w9WgXcQ" />
          </>
        )}

        <label style={S.label}>Miniatura</label>
        <ThumbField value={form.thumbnail || ""} onChange={(url) => set("thumbnail", url)} adminKey={adminKey} />

        <label style={S.label}>Kolor tła (hex)</label>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input type="color" value={form.bg} onChange={(e) => set("bg", e.target.value)} style={{ width: 40, height: 36, border: "none", borderRadius: 4, cursor: "pointer" }} />
          <input style={{ ...S.input, flex: 1 }} value={form.bg} onChange={(e) => set("bg", e.target.value)} />
        </div>

        <div style={S.formRow}>
          <button style={btnStyle("ghost")} onClick={onCancel}>Anuluj</button>
          <button style={btnStyle("primary")} onClick={() => onSave(form)}>Zapisz</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Galeria tab ─── */
function GaleriaTab({ adminKey }: { adminKey: string }) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [modal, setModal] = useState<"add" | PortfolioItem | null>(null);

  useEffect(() => { fetch(apiUrl("portfolio")).then((r) => r.json()).then(setItems); }, []);

  async function handleAdd(data: Omit<PortfolioItem, "id">) {
    const res = await fetch(apiUrl("portfolio"), { method: "POST", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify(data) });
    const item = await res.json();
    if (item.dbSynced === false) alert("Zapisano na stronie, ale baza jest niedostępna — zmiana może zniknąć po wgraniu nowej wersji.");
    setItems((p) => [...p, item]);
    setModal(null);
  }

  async function handleEdit(id: string, data: Omit<PortfolioItem, "id">) {
    const res = await fetch(apiItemUrl(id, "PUT"), { method: apiItemMethod("PUT"), headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify(data) });
    const updated = await res.json();
    setItems((p) => p.map((it) => (it.id === id ? updated : it)));
    setModal(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Usunąć tę pozycję?")) return;
    await fetch(apiItemUrl(id, "DELETE"), { method: apiItemMethod("DELETE"), headers: { "x-admin-key": adminKey } });
    setItems((p) => p.filter((it) => it.id !== id));
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: "rgba(242,237,232,0.4)" }}>{items.length} pozycji w galerii</p>
        <button style={btnStyle("primary")} onClick={() => setModal("add")}>+ Dodaj pozycję</button>
      </div>

      {items.map((item) => (
        <div key={item.id} style={S.card}>
          <div style={S.cardRow}>
            <div style={{ ...S.thumb, background: item.bg, position: "relative", overflow: "hidden" }}>
              {item.thumbnail && <img src={item.thumbnail} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
            </div>
            <div style={S.cardInfo}>
              <p style={S.cardTitle}>{item.title}</p>
              <p style={S.cardMeta}>
                <span style={badgePillStyle(item.type)}>{item.type === "video" ? "Wideo" : "Foto"}</span>
                {item.category}
                {item.youtubeId && ` · yt:${item.youtubeId}`}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button style={btnStyle("ghost")} onClick={() => setModal(item)}>Edytuj</button>
              <button style={btnStyle("danger")} onClick={() => handleDelete(item.id)}>Usuń</button>
            </div>
          </div>
        </div>
      ))}

      {modal === "add" && <ItemForm onSave={handleAdd} onCancel={() => setModal(null)} adminKey={adminKey} />}
      {modal && modal !== "add" && (
        <ItemForm
          initial={modal as PortfolioItem}
          onSave={(data) => handleEdit((modal as PortfolioItem).id, data)}
          onCancel={() => setModal(null)}
          adminKey={adminKey}
        />
      )}
    </>
  );
}

/* ─── Teksty tab ─── */
function sectionChipStyle(active: boolean): React.CSSProperties {
  return {
    padding: "7px 14px", borderRadius: 999, fontSize: 12, cursor: "pointer",
    border: active ? "1px solid rgba(242,237,232,0.35)" : "1px solid rgba(255,255,255,0.09)",
    background: active ? "rgba(242,237,232,0.1)" : "transparent",
    color: active ? "#f2ede8" : "rgba(242,237,232,0.5)",
    transition: "all 0.18s ease", whiteSpace: "nowrap",
  };
}

const fieldStyles: Record<string, React.CSSProperties> = {
  row: { padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  head: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  name: { fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(242,237,232,0.6)" },
  changed: { fontSize: 10, color: "#d4a843", letterSpacing: "0.08em", textTransform: "uppercase" },
  langCol: { flex: 1, minWidth: 220 },
  langTag: { fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(242,237,232,0.3)", marginBottom: 5, display: "block" },
  groupHead: { fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(242,237,232,0.35)", padding: "20px 20px 6px", background: "rgba(255,255,255,0.02)" },
  reset: { background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "rgba(242,237,232,0.4)", textDecoration: "underline", padding: 0 },
};

/** Polska odmiana: 1 pole, 2–4 pola, 5+ pól. */
function zmienionePola(n: number): string {
  const last = n % 10;
  const lastTwo = n % 100;
  if (n === 1) return "1 zmienione pole";
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${n} zmienione pola`;
  return `${n} zmienionych pól`;
}

function TekstyTab({ adminKey }: { adminKey: string }) {
  const [section, setSection] = useState<keyof Translations>("hero");
  /** Pełne teksty wszystkich pól, klucz "pl.hero.line1". Startują z wartości domyślnych. */
  const [values, setValues] = useState<TextOverrides>({});
  const [loaded, setLoaded] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [translating, setTranslating] = useState<string[]>([]);
  const [translateError, setTranslateError] = useState("");
  const [dbWarning, setDbWarning] = useState("");

  const defaults = useMemo(() => defaultValues(), []);
  const fields = useMemo(() => sectionFields(section), [section]);
  const meta = SECTIONS.find((s) => s.key === section);

  /** Pola, w których angielski wpisano ręcznie — automat ich nie nadpisuje. */
  const manualEn = useRef<Set<string>>(new Set());
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    fetch(apiUrl("content"))
      .then((r) => r.json())
      .then((d: Content) => {
        const stored = d.texts || {};
        setValues({ ...defaults, ...stored });
        // Zapisany angielski traktujemy jak ręczny, żeby go nie nadpisać automatem.
        for (const [key, value] of Object.entries(stored)) {
          if (key.startsWith("en.") && value !== defaults[key]) manualEn.current.add(key.slice(3));
        }
        setLoaded(true);
      });
  }, [defaults]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => clearTimeout(timer));
  }, []);

  function setValue(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setSaved(false);
  }

  /** Tłumaczy podane teksty PL → EN i wstawia wynik do pól angielskich. */
  async function runTranslate(entries: { path: string; text: string }[]) {
    const todo = entries.filter((e) => e.text.trim() !== "");
    if (todo.length === 0) return;

    setTranslating((prev) => [...prev, ...todo.map((e) => e.path)]);
    setTranslateError("");
    try {
      const res = await fetch(apiUrl("translate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: todo.map((e) => e.text) }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const { translations } = (await res.json()) as { translations?: (string | null)[] };
      if (!translations) throw new Error("brak tłumaczeń");

      const done: Record<string, string> = {};
      todo.forEach((entry, i) => {
        const out = translations[i];
        if (typeof out === "string" && out.trim() !== "") {
          done[`en.${entry.path}`] = out;
          manualEn.current.delete(entry.path);
        }
      });

      if (Object.keys(done).length === 0) {
        setTranslateError("Nie udało się przetłumaczyć — wpisz angielski ręcznie.");
        return;
      }
      setValues((prev) => ({ ...prev, ...done }));
      setDirty(true);
      setSaved(false);
      if (Object.keys(done).length < todo.length) {
        setTranslateError("Część tekstów się nie przetłumaczyła — sprawdź je przed zapisem.");
      }
    } catch {
      setTranslateError("Tłumaczenie niedostępne — wpisz angielski ręcznie.");
    } finally {
      const paths = todo.map((e) => e.path);
      setTranslating((prev) => prev.filter((p) => !paths.includes(p)));
    }
  }

  function handlePlChange(f: TextField, value: string) {
    setValue(`pl.${f.path}`, value);
    // Pola wspólne (e-mail, SEO, imiona) mają tę samą wartość w obu językach.
    if (f.shared) {
      setValue(`en.${f.path}`, value);
      return;
    }
    if (!autoTranslate || manualEn.current.has(f.path)) return;

    const pending = timers.current.get(f.path);
    if (pending) clearTimeout(pending);
    timers.current.set(
      f.path,
      setTimeout(() => {
        timers.current.delete(f.path);
        runTranslate([{ path: f.path, text: value }]);
      }, 900)
    );
  }

  function handleEnChange(f: TextField, value: string) {
    manualEn.current.add(f.path);
    const pending = timers.current.get(f.path);
    if (pending) {
      clearTimeout(pending);
      timers.current.delete(f.path);
    }
    setValue(`en.${f.path}`, value);
  }

  function resetField(f: TextField) {
    manualEn.current.delete(f.path);
    setValues((prev) => ({
      ...prev,
      [`pl.${f.path}`]: f.defaults.pl,
      [`en.${f.path}`]: f.defaults.en,
    }));
    setDirty(true);
    setSaved(false);
  }

  function resetSection() {
    if (!confirm(`Przywrócić domyślne teksty w sekcji „${meta?.label}”?`)) return;
    setValues((prev) => {
      const next = { ...prev };
      for (const f of fields) {
        manualEn.current.delete(f.path);
        next[`pl.${f.path}`] = f.defaults.pl;
        next[`en.${f.path}`] = f.defaults.en;
      }
      return next;
    });
    setDirty(true);
    setSaved(false);
  }

  function translateSection() {
    const targets = fields.filter((f) => !f.shared);
    if (!confirm(`Przetłumaczyć całą sekcję „${meta?.label}”? Angielskie teksty zostaną nadpisane.`))
      return;
    runTranslate(targets.map((f) => ({ path: f.path, text: values[`pl.${f.path}`] || "" })));
  }

  async function handleSave() {
    // Zapisujemy tylko to, co różni się od tekstów domyślnych z translations.ts.
    const texts: TextOverrides = {};
    for (const [key, value] of Object.entries(values)) {
      if (defaults[key] === undefined) continue;
      if (value !== defaults[key]) texts[key] = value;
    }

    setSaving(true);
    const res = await fetch(apiUrl("content"), {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ texts }),
    });
    setSaving(false);
    if (!res.ok) {
      alert("Nie udało się zapisać zmian.");
      return;
    }
    // Treść zapisuje się w pliku zawsze; baza to trwała kopia i może być chwilowo niedostępna.
    const result = await res.json().catch(() => null);
    setDbWarning(
      result && result.dbSynced === false
        ? "Zapisano na stronie, ale nie udało się zapisać do bazy. Zmiana może zniknąć po wgraniu nowej wersji."
        : ""
    );
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const changedInSection = fields.filter(
    (f) => values[`pl.${f.path}`] !== f.defaults.pl || values[`en.${f.path}`] !== f.defaults.en
  ).length;

  if (!loaded) return <p style={{ fontSize: 13, color: "rgba(242,237,232,0.4)" }}>Wczytuję teksty…</p>;

  return (
    <div style={{ maxWidth: 900 }}>
      <p style={{ fontSize: 13, color: "rgba(242,237,232,0.45)", lineHeight: 1.6, marginBottom: 18 }}>
        Każde pole zawiera tekst, który jest teraz na stronie — możesz poprawić choćby jedną literę.
        Angielska wersja tłumaczy się sama, ale zawsze możesz ją nadpisać ręcznie.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {SECTIONS.map((s) => (
          <button key={s.key} style={sectionChipStyle(section === s.key)} onClick={() => setSection(s.key)}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Pasek akcji */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          padding: "14px 20px", background: "#161616", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 8, marginBottom: 12, position: "sticky", top: 61, zIndex: 5,
        }}
      >
        <button style={btnStyle("primary")} onClick={handleSave} disabled={saving || !dirty}>
          {saving ? "Zapisuję…" : "Zapisz zmiany"}
        </button>
        {dirty && !saving && <span style={{ fontSize: 12, color: "#d4a843" }}>Niezapisane zmiany</span>}
        {saved && <span style={{ fontSize: 12, color: "#6db56d" }}>Zapisano ✓</span>}

        <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "rgba(242,237,232,0.55)", cursor: "pointer" }}>
          <input type="checkbox" checked={autoTranslate} onChange={(e) => setAutoTranslate(e.target.checked)} />
          Tłumacz automatycznie na angielski
        </label>

        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: "rgba(242,237,232,0.4)" }}>
          {changedInSection > 0 ? zmienionePola(changedInSection) : "Wszystko domyślne"}
        </span>
        <button style={fieldStyles.reset} onClick={translateSection} disabled={translating.length > 0}>
          {translating.length > 0 ? "Tłumaczę…" : "Przetłumacz sekcję"}
        </button>
        {changedInSection > 0 && (
          <button style={fieldStyles.reset} onClick={resetSection}>
            Przywróć sekcję
          </button>
        )}
      </div>

      {translateError && (
        <p style={{ fontSize: 12, color: "#e0a555", marginBottom: 12 }}>{translateError}</p>
      )}
      {dbWarning && (
        <p style={{ fontSize: 12, color: "#e0a555", marginBottom: 12 }}>⚠ {dbWarning}</p>
      )}
      {meta?.hint && (
        <p style={{ fontSize: 12, color: "rgba(242,237,232,0.35)", marginBottom: 12 }}>{meta.hint}</p>
      )}

      <div style={{ ...S.card, marginBottom: 40 }}>
        {fields.map((f, i) => {
          const plValue = values[`pl.${f.path}`] ?? "";
          const enValue = values[`en.${f.path}`] ?? "";
          const changed = plValue !== f.defaults.pl || enValue !== f.defaults.en;
          const showGroup = f.group && f.group !== fields[i - 1]?.group;
          const busy = translating.includes(f.path);

          const Field = f.multiline ? "textarea" : "input";
          const fieldStyle = f.multiline ? { ...S.textarea, minHeight: 84, fontSize: 13 } : { ...S.input, fontSize: 13 };

          return (
            <div key={f.path}>
              {showGroup && <p style={fieldStyles.groupHead}>{f.group}</p>}
              <div style={fieldStyles.row}>
                <div style={fieldStyles.head}>
                  <span style={fieldStyles.name}>{f.label}</span>
                  {changed && <span style={fieldStyles.changed}>zmienione</span>}
                  <div style={{ flex: 1 }} />
                  {changed && (
                    <button style={fieldStyles.reset} onClick={() => resetField(f)}>
                      Przywróć domyślny
                    </button>
                  )}
                </div>

                {f.shared ? (
                  <Field
                    style={fieldStyle}
                    value={plValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                      handlePlChange(f, e.target.value)
                    }
                  />
                ) : (
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <div style={fieldStyles.langCol}>
                      <span style={fieldStyles.langTag}>Polski</span>
                      <Field
                        style={fieldStyle}
                        value={plValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          handlePlChange(f, e.target.value)
                        }
                      />
                    </div>
                    <div style={fieldStyles.langCol}>
                      <span style={{ ...fieldStyles.langTag, display: "flex", alignItems: "center", gap: 8 }}>
                        English
                        {busy && <span style={{ color: "#d4a843" }}>tłumaczę…</span>}
                        <span style={{ flex: 1 }} />
                        <button
                          style={{ ...fieldStyles.reset, fontSize: 10, textTransform: "none", letterSpacing: 0 }}
                          onClick={() => runTranslate([{ path: f.path, text: plValue }])}
                          disabled={busy}
                        >
                          Przetłumacz
                        </button>
                      </span>
                      <Field
                        style={{ ...fieldStyle, opacity: busy ? 0.5 : 1 }}
                        value={enValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          handleEnChange(f, e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Bio tab ─── */
function BioTab({ adminKey }: { adminKey: string }) {
  const [bioShort, setBioShort] = useState("");
  const [bioFull, setBioFull] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(apiUrl("content")).then((r) => r.json()).then((d: Content) => {
      setBioShort(d.bioShort || "");
      setBioFull(d.bioFull || "");
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    await fetch(apiUrl("content"), { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify({ bioShort, bioFull }) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ maxWidth: 680 }}>
      <label style={{ ...S.label, marginTop: 0 }}>Bio krótkie (wyświetlane domyślnie)</label>
      <textarea style={{ ...S.textarea, minHeight: 120 }} value={bioShort} onChange={(e) => setBioShort(e.target.value)} />

      <label style={S.label}>Bio pełne (po kliknięciu "Czytaj więcej")</label>
      <textarea style={{ ...S.textarea, minHeight: 200 }} value={bioFull} onChange={(e) => setBioFull(e.target.value)} />

      <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 16 }}>
        <button style={btnStyle("primary")} onClick={handleSave} disabled={saving}>
          {saving ? "Zapisuję…" : "Zapisz zmiany"}
        </button>
        {saved && <span style={{ fontSize: 12, color: "#6db56d" }}>Zapisano ✓</span>}
      </div>
    </div>
  );
}

/* ─── Nagrody tab ─── */
function NagrodaForm({ onAdd }: { onAdd: (a: Award) => void }) {
  const [form, setForm] = useState<Award>({ year: "", title: "", org: "" });
  function set(k: keyof Award, v: string) { setForm((p) => ({ ...p, [k]: v })); }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.year || !form.title) return;
    onAdd(form);
    setForm({ year: "", title: "", org: "" });
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginTop: 24, padding: 20, background: "#161616", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8 }}>
      <div style={{ width: 90 }}>
        <label style={{ ...S.label, marginTop: 0 }}>Rok</label>
        <input style={S.input} value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2025" maxLength={4} />
      </div>
      <div style={{ flex: 2, minWidth: 200 }}>
        <label style={{ ...S.label, marginTop: 0 }}>Tytuł nagrody</label>
        <input style={S.input} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Nazwa nagrody" />
      </div>
      <div style={{ flex: 1, minWidth: 140 }}>
        <label style={{ ...S.label, marginTop: 0 }}>Organizacja</label>
        <input style={S.input} value={form.org} onChange={(e) => set("org", e.target.value)} placeholder="Opcjonalnie" />
      </div>
      <button type="submit" style={{ ...btnStyle("primary"), marginBottom: 1 }}>+ Dodaj</button>
    </form>
  );
}

function NagrodaTab({ adminKey }: { adminKey: string }) {
  const [awards, setAwards] = useState<Award[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(apiUrl("content")).then((r) => r.json()).then((d: Content) => setAwards(d.awards || []));
  }, []);

  async function saveAwards(updated: Award[]) {
    setSaving(true);
    await fetch(apiUrl("content"), { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify({ awards: updated }) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleAdd(a: Award) { const u = [a, ...awards]; setAwards(u); saveAwards(u); }
  function handleDelete(idx: number) { const u = awards.filter((_, i) => i !== idx); setAwards(u); saveAwards(u); }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 13, color: "rgba(242,237,232,0.4)" }}>{awards.length} nagród</p>
        {saving && <span style={{ fontSize: 12, color: "rgba(242,237,232,0.4)" }}>Zapisuję…</span>}
        {saved && <span style={{ fontSize: 12, color: "#6db56d" }}>Zapisano ✓</span>}
      </div>

      {awards.map((a, idx) => (
        <div key={idx} style={S.card}>
          <div style={{ ...S.cardRow, gap: 20 }}>
            <span style={{ fontStyle: "italic", fontSize: 13, color: "rgba(242,237,232,0.45)", flexShrink: 0, minWidth: 44 }}>{a.year}</span>
            <div style={S.cardInfo}>
              <p style={S.cardTitle}>{a.title}</p>
              {a.org && <p style={S.cardMeta}>{a.org}</p>}
            </div>
            <button style={btnStyle("danger")} onClick={() => handleDelete(idx)}>Usuń</button>
          </div>
        </div>
      ))}

      <NagrodaForm onAdd={handleAdd} />
    </>
  );
}

/* ─── Main ─── */
export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Galeria");

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_key");
    if (stored) setAdminKey(stored);
  }, []);

  function handleAuth(pw: string) {
    sessionStorage.setItem("admin_key", pw);
    setAdminKey(pw);
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_key");
    setAdminKey(null);
  }

  if (!adminKey) {
    return (
      <div style={{ ...S.page, flexDirection: "column" }}>
        <LoginScreen onAuth={handleAuth} />
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={S.sidebarHeader}>
          <p style={S.logoText}>Lotne Media</p>
          <p style={{ fontSize: 10, color: "rgba(242,237,232,0.3)", marginTop: 4, letterSpacing: "0.1em" }}>Panel admina</p>
        </div>
        <p style={S.sidebarLabel}>Zawartość</p>
        {TABS.map((tab) => (
          <button key={tab} style={navBtnStyle(activeTab === tab)} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <a href="/" target="_blank" rel="noreferrer" style={{ display: "block", fontSize: 12, color: "rgba(242,237,232,0.4)", textDecoration: "none", marginBottom: 10 }}>
            ↗ Otwórz stronę
          </a>
          <button style={{ ...btnStyle("ghost"), width: "100%", textAlign: "left" }} onClick={handleLogout}>
            Wyloguj
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={S.main}>
        <div style={S.topbar}>
          <p style={S.tabTitle}>{activeTab}</p>
        </div>
        <div style={S.content}>
          {activeTab === "Galeria" && <GaleriaTab adminKey={adminKey} />}
          {activeTab === "Teksty" && <TekstyTab adminKey={adminKey} />}
          {activeTab === "Bio" && <BioTab adminKey={adminKey} />}
          {activeTab === "Nagrody" && <NagrodaTab adminKey={adminKey} />}
        </div>
      </div>
    </div>
  );
}
