
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// #region agent log
fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:7',message:'Entry point executing',data:{documentReady:document.readyState,hasDocument:!!document,url:window.location.href},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
// #endregion

const rootElement = document.getElementById('root');
// #region agent log
fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:10',message:'Root element lookup',data:{rootElementFound:!!rootElement,rootElementId:rootElement?.id||'null',bodyChildren:document.body?.children?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
// #endregion

if (!rootElement) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:14',message:'Root element NOT FOUND error',data:{documentBody:!!document.body,htmlContent:document.documentElement?.innerHTML?.substring(0,100)||'N/A'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
  // #endregion
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
// #region agent log
fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:20',message:'Creating React root',data:{rootCreated:!!root},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
// #endregion

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// #region agent log
fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:26',message:'React render called',data:{strictMode:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
// #endregion
