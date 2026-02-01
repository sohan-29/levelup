import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const api = import.meta.env.VITE_API_URL;

function isoDateKey(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function readPending() {
  try {
    return JSON.parse(localStorage.getItem("dailyNotesPending") || "{}");
  } catch (e) {
    return {};
  }
}
function writePending(obj) {
  localStorage.setItem("dailyNotesPending", JSON.stringify(obj));
}

export default function NoteViewer({ date }) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState(null);
  const [text, setText] = useState("");
  const autosaveEnabled = true; // autosave is on by default
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  const debouncedRef = useRef(null);
  const originalTextRef = useRef("");
  const dateIso = date ? isoDateKey(date) : isoDateKey(new Date());
  const isToday = new Date(date).toDateString() === new Date().toDateString();

  useEffect(() => {
    async function load() {
      setLoadingInitial(true);
      try {
        const res = await axios.get(`${api}/notes?date=${dateIso}`, { withCredentials: true });
        setNote(res.data.note || null);

        const pending = readPending();
        const localPending = pending[dateIso];

        // If there is a local pending note (unsynced) prefer it when server has none, or if pending is newer
        const serverNote = res.data.note || null;
        const serverText = serverNote?.text || "";
        const serverUpdated = serverNote?.updatedAt ? new Date(serverNote.updatedAt) : null;
        if (localPending && (!serverNote || (serverUpdated && new Date(localPending.savedAt) > serverUpdated))) {
          const pendingText = localPending.text || "";
          setText(pendingText);
          setLastSavedAt(localPending.savedAt || null);
          originalTextRef.current = pendingText;
        } else {
          const loadedText = serverText;
          setText(loadedText);
          setLastSavedAt(serverNote?.updatedAt || null);
          originalTextRef.current = loadedText; // remember server text to avoid redundant autosaves
        }
      } catch (err) {
        console.error(err);
        const pending = readPending();
        const local = pending[dateIso]?.text || "";

        // No response - likely offline or server down
        if (!err.response) {
          if (local) {
            setText(local);
            setLastSavedAt(pending[dateIso]?.savedAt || null);
            toast('Loaded local/pending note', { icon: '📄' });
          } else {
            toast.error('Server unavailable. Try again later or check your connection.');
          }
          return;
        }

        const status = err.response.status;
        const message = err.response.data?.error || null;

        if (status === 401) {
          toast.error('Please login to view notes');
          return;
        }
        if (status === 403) {
          toast.error(message || 'Access denied');
          return;
        }

        // 5xx server errors
        if (status >= 500) {
          if (local) {
            setText(local);
            setLastSavedAt(pending[dateIso]?.savedAt || null);
            toast('Loaded local/pending note', { icon: '📄' });
          } else {
            toast.error('Server currently unavailable. Please try again later.');
          }
          return;
        }

        // Fallback: generic message
        toast.error('Unable to load note');
      } finally {
        setLoadingInitial(false);
      }
    }
    load();
  }, [dateIso]);

  // Update pending count UI
  useEffect(() => {
    setPendingCount(Object.keys(readPending()).length);
  }, []);

  useEffect(() => {
    function onOnline() {
      syncPending();
    }
    window.addEventListener('online', onOnline);
    // try sync on mount too
    syncPending();
    return () => {
      window.removeEventListener('online', onOnline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function syncPending() {
    const pending = readPending();
    const keys = Object.keys(pending);
    if (keys.length === 0) {
      setPendingCount(0);
      return;
    }

    for (const d of keys) {
      const payload = pending[d];
      try {
        const res = await axios.put(`${api}/notes/${d}`, { text: payload.text }, { withCredentials: true });
        // remove from pending
        delete pending[d];
        writePending(pending);
        setPendingCount(Object.keys(pending).length);
        toast.success(`Synced note ${d}`);
      } catch (err) {
        console.error('Sync failed for', d, err?.response?.status);
        // If 401, stop trying (user needs to login). Keep in pending.
        if (err?.response?.status === 401) {
          toast.error('Please login to sync notes');
          break;
        }
        // If 403, discard and notify
        if (err?.response?.status === 403) {
          delete pending[d];
          writePending(pending);
          setPendingCount(Object.keys(pending).length);
          toast.error(`Note ${d} rejected by server`);
        }
        // Otherwise keep for next attempt
      }
    }
  }

  async function doSave({ notifyOnSuccess = true } = {}) {
    if (!isToday) return;
    if (text.trim().length === 0) {
      toast.error("Note cannot be empty");
      return;
    }
    if (text.length > 500) {
      toast.error("Note cannot exceed 500 characters");
      return;
    }

    setSaving(true);
    try {
      const res = await axios.put(`${api}/notes/${dateIso}`, { text }, { withCredentials: true });
      setNote(res.data.note || null);
      setLastSavedAt(res.data.note?.updatedAt || new Date().toISOString());
      // remove from pending if exists
      const pending = readPending();
      if (pending[dateIso]) {
        delete pending[dateIso];
        writePending(pending);
        setPendingCount(Object.keys(pending).length);
      }
      if (notifyOnSuccess) toast.success("Note saved");
      // mark as saved locally to avoid repeated autosaves
      originalTextRef.current = text;
    } catch (err) {
      console.error(err);
      // network error (no response)
      if (!err.response) {
        const pending = readPending();
        pending[dateIso] = { text: text.slice(0, 500), savedAt: new Date().toISOString() };
        writePending(pending);
        setPendingCount(Object.keys(pending).length);
        originalTextRef.current = text; // consider it pending-saved to avoid repeat
        toast('Saved locally (offline)', { icon: '💾' });
        return;
      }

      const status = err.response.status;
      const message = err.response.data?.error || 'Server error';

      // 401 - need auth: keep locally but tell user to login to sync
      if (status === 401) {
        const pending = readPending();
        pending[dateIso] = { text: text.slice(0, 500), savedAt: new Date().toISOString() };
        writePending(pending);
        setPendingCount(Object.keys(pending).length);
        originalTextRef.current = text; // avoid repeated autosave attempts
        toast('Saved locally (login required to sync)', { icon: '🔒' });
        return;
      }

      // 403 or other client errors - validation/forbidden: DO NOT save locally
      if (status === 403 || (status >= 400 && status < 500)) {
        toast.error(message);
        return;
      }

      // Server errors (5xx) - save locally and inform user
      if (status >= 500) {
        const pending = readPending();
        pending[dateIso] = { text: text.slice(0, 500), savedAt: new Date().toISOString() };
        writePending(pending);
        setPendingCount(Object.keys(pending).length);
        originalTextRef.current = text; // mark as pending-saved
        toast('Saved locally (server error)', { icon: '💾' });
        return;
      }

      // Fallback: save locally and notify
      const pending = readPending();
      pending[dateIso] = { text: text.slice(0, 500), savedAt: new Date().toISOString() };
      writePending(pending);
      setPendingCount(Object.keys(pending).length);
      toast('Saved locally', { icon: '💾' });
    } finally {
      setSaving(false);
    }
  }

  // Autosave (debounced) — always enabled for today's note
  useEffect(() => {
    if (!isToday) return;
    // don't autosave if nothing has changed since last save
    if (text === originalTextRef.current) return;

    // clear previous timer
    if (debouncedRef.current) clearTimeout(debouncedRef.current);
    debouncedRef.current = setTimeout(() => {
      doSave({ notifyOnSuccess: false })
        .then(() => { originalTextRef.current = text; })
        .catch(() => { /* doSave handles fallback and toasts */ });
    }, 1500);
    return () => {
      if (debouncedRef.current) clearTimeout(debouncedRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, isToday]);

  function onChange(e) {
    setText(e.target.value);
  }

  return (
    <div className="note-viewer text-black sm:text-white">
      <div className="mb-2 text-sm font-semibold">{new Date(date).toLocaleDateString()}</div>

      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-xs text-gray-500">Last: {lastSavedAt ? new Date(lastSavedAt).toLocaleTimeString() : '—'}</div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500">Pending: {pendingCount}</div>
        </div>
      </div>

      {loadingInitial ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <div>
          {!isToday ? (
            <div className="whitespace-pre-wrap text-sm text-gray-700 min-h-20">{note?.text || "No note for this day."}</div>
          ) : (
            <div className="flex flex-col gap-2">
              <textarea value={text} onChange={onChange} maxLength={500} className="w-full min-h-[120px] p-2 border rounded" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-500">{text.length}/500</div>
                  <div className="text-xs text-gray-500">{saving ? 'Saving...' : lastSavedAt ? 'Saved' : ''}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
