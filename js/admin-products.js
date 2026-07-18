(function () {
  'use strict';

  let categories = [];
  let products = [];
  let editingId = null; // null = creating new
  let mediaItems = []; // [{type, src}]

  // Drag-to-reorder state
  let dragSrcId = null;

  document.addEventListener('DOMContentLoaded', async () => {
    const session = await requireAdminSession();
    if (!session) return;
    wireLogoutButton();

    // Tab switcher
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.admin-tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      });
    });

    await loadCategories();
    await loadProducts();
    await loadSettings();
    renderTable();

    document.getElementById('add-product-btn').addEventListener('click', () => openModal(null));
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    document.getElementById('modal-overlay').addEventListener('click', closeModal);
    document.getElementById('product-form').addEventListener('submit', onSave);
    document.getElementById('f-customizable').addEventListener('change', (e) => {
      document.getElementById('custom-label-field').hidden = !e.target.checked;
    });
    document.getElementById('f-media-upload').addEventListener('change', onFilesChosen);
    document.getElementById('settings-form').addEventListener('submit', saveSettings);
  });

  async function loadCategories() {
    const { data, error } = await sb.from('categories').select('slug,label').neq('slug', 'all').order('sort_order');
    if (error) { console.error(error); return; }
    categories = data;
    const sel = document.getElementById('f-category');
    sel.innerHTML = categories.map(c => `<option value="${c.slug}">${escapeHtml(c.label)}</option>`).join('');
  }

  async function loadProducts() {
    const { data, error } = await sb.from('products').select('*').order('sort_order');
    if (error) { console.error(error); alert('Failed to load products: ' + error.message); return; }
    products = data;
  }

  /* ============================================================
     TABLE RENDER
     ============================================================ */
  function renderTable() {
    const tbody = document.getElementById('product-rows');
    tbody.innerHTML = products.map(p => {
      const d = p.data;
      const thumb = (d.media && d.media[0] && d.media[0].type === 'image') ? d.media[0].src : '';
      const catLabel = (categories.find(c => c.slug === p.category) || {}).label || p.category;
      const isDelisted = p.status === 'delisted';
      return `
        <tr data-id="${p.id}" draggable="true">
          <td><span class="drag-handle" title="Drag to reorder">☰</span></td>
          <td>${thumb ? `<img class="thumb" src="${escapeAttr(thumb)}" />` : ''}</td>
          <td>${escapeHtml(d.name)}${isDelisted ? ' <em style="color:#999;font-size:.78rem;">(delisted)</em>' : ''}</td>
          <td>${escapeHtml(catLabel)}</td>
          <td>₹${Number(d.price).toLocaleString('en-IN')}</td>
          <td>${p.featured ? '★' : ''}</td>
          <td><span class="pill pill-${p.status}">${p.status}</span></td>
          <td class="row-actions">
            <button class="btn edit-btn" data-id="${p.id}">Edit</button>
            ${isDelisted
              ? `<button class="btn btn-primary relist-btn" data-id="${p.id}" style="font-size:.8rem;padding:.35rem .6rem;">Re-list</button>`
              : `<button class="btn btn-delist delist-btn" data-id="${p.id}">Delist</button>`
            }
            <button class="btn delete-btn" data-id="${p.id}" style="color:#b33636;border-color:#f5c2c2;" title="Permanently delete">✕</button>
          </td>
        </tr>`;
    }).join('');

    // Action buttons
    tbody.querySelectorAll('.edit-btn').forEach(b => b.addEventListener('click', () => openModal(b.dataset.id)));
    tbody.querySelectorAll('.delist-btn').forEach(b => b.addEventListener('click', () => onDelist(b.dataset.id)));
    tbody.querySelectorAll('.relist-btn').forEach(b => b.addEventListener('click', () => onRelist(b.dataset.id)));
    tbody.querySelectorAll('.delete-btn').forEach(b => b.addEventListener('click', () => onHardDelete(b.dataset.id)));

    // Drag-to-reorder events
    tbody.querySelectorAll('tr[draggable]').forEach(tr => {
      tr.addEventListener('dragstart', onDragStart);
      tr.addEventListener('dragover', onDragOver);
      tr.addEventListener('dragleave', onDragLeave);
      tr.addEventListener('drop', onDrop);
      tr.addEventListener('dragend', onDragEnd);
    });
  }

  /* ============================================================
     SOFT DELETE / RELIST
     ============================================================ */
  async function onDelist(id) {
    if (!confirm('Delist this product? It will be hidden from the store but kept in the database. You can re-list it anytime.')) return;
    const { error } = await sb.from('products').update({ status: 'delisted', updated_at: new Date().toISOString() }).eq('id', id);
    if (error) { alert('Failed to delist: ' + error.message); return; }
    await loadProducts();
    renderTable();
  }

  async function onRelist(id) {
    if (!confirm('Re-list this product? It will become visible on the store again.')) return;
    const { error } = await sb.from('products').update({ status: 'active', updated_at: new Date().toISOString() }).eq('id', id);
    if (error) { alert('Failed to re-list: ' + error.message); return; }
    await loadProducts();
    renderTable();
  }

  async function onHardDelete(id) {
    const name = (products.find(p => p.id === id)?.data?.name) || id;
    if (!confirm(`⚠️ PERMANENTLY delete "${name}"?\n\nThis cannot be undone — the product and all its data will be removed from the database forever.`)) return;
    const { error } = await sb.from('products').delete().eq('id', id);
    if (error) { alert('Failed to delete: ' + error.message); return; }
    await loadProducts();
    renderTable();
  }

  /* ============================================================
     DRAG-TO-REORDER
     ============================================================ */
  function onDragStart(e) {
    dragSrcId = this.dataset.id;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragSrcId);
  }

  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (this.dataset.id !== dragSrcId) {
      this.classList.add('drag-over');
    }
  }

  function onDragLeave() {
    this.classList.remove('drag-over');
  }

  function onDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    const targetId = this.dataset.id;
    if (!dragSrcId || dragSrcId === targetId) return;

    // Reorder products array
    const srcIdx = products.findIndex(p => p.id === dragSrcId);
    const tgtIdx = products.findIndex(p => p.id === targetId);
    if (srcIdx === -1 || tgtIdx === -1) return;

    const [moved] = products.splice(srcIdx, 1);
    products.splice(tgtIdx, 0, moved);

    renderTable();
    persistOrder();
  }

  function onDragEnd() {
    document.querySelectorAll('#product-rows tr').forEach(tr => {
      tr.classList.remove('dragging', 'drag-over');
    });
    dragSrcId = null;
  }

  async function persistOrder() {
    const toast = document.getElementById('order-toast');
    if (toast) { toast.classList.remove('show'); toast.textContent = 'Saving…'; toast.style.color = '#777'; toast.style.background = '#f5f5f5'; toast.style.borderColor = '#ddd'; toast.classList.add('show'); }

    try {
      await Promise.all(
        products.map((p, i) =>
          sb.from('products').update({ sort_order: i + 1 }).eq('id', p.id)
        )
      );
      if (toast) {
        toast.textContent = 'Order saved ✓';
        toast.style.color = '#1e7b34';
        toast.style.background = '#e6f4ea';
        toast.style.borderColor = '#b7dfbf';
        setTimeout(() => toast.classList.remove('show'), 3000);
      }
    } catch (err) {
      console.error('Failed to save order:', err);
      if (toast) {
        toast.textContent = 'Failed to save order — try again.';
        toast.style.color = '#b33636';
        toast.style.background = '#fbe4e4';
        toast.style.borderColor = '#f5c2c2';
        setTimeout(() => toast.classList.remove('show'), 4000);
      }
    }
  }

  /* ============================================================
     MODAL — OPEN / CLOSE
     ============================================================ */
  function openModal(id) {
    editingId = id;
    document.getElementById('form-error').textContent = '';
    document.getElementById('upload-status').textContent = '';
    const form = document.getElementById('product-form');
    form.reset();

    if (id) {
      const p = products.find(x => x.id === id);
      const d = p.data;
      document.getElementById('modal-title').textContent = 'Edit Product';
      document.getElementById('f-id').value = p.id;
      document.getElementById('f-id').disabled = true;
      document.getElementById('f-name').value = d.name || '';
      document.getElementById('f-category').value = p.category || '';
      document.getElementById('f-price').value = d.price || 0;
      document.getElementById('f-badge').value = d.badge || '';
      document.getElementById('f-description').value = d.description || '';
      document.getElementById('f-specs').value = (d.specs || []).map(s => `${s[0]}: ${s[1]}`).join('\n');
      document.getElementById('f-featured').checked = !!p.featured;
      document.getElementById('f-customizable').checked = !!d.customizable;
      document.getElementById('f-status').value = p.status || 'active';
      document.getElementById('f-custom-label').value = d.customLabel || '';
      document.getElementById('custom-label-field').hidden = !d.customizable;
      mediaItems = JSON.parse(JSON.stringify(d.media || []));
    } else {
      document.getElementById('modal-title').textContent = 'Add Product';
      document.getElementById('f-id').disabled = false;
      document.getElementById('f-status').value = 'active';
      document.getElementById('custom-label-field').hidden = true;
      mediaItems = [];
    }
    renderMediaList();
    document.getElementById('modal-overlay').classList.add('open');
    document.getElementById('product-modal').classList.add('open');
  }

  function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
    document.getElementById('product-modal').classList.remove('open');
  }

  /* ============================================================
     MEDIA LIST
     ============================================================ */
  function renderMediaList() {
    const list = document.getElementById('media-list');
    list.innerHTML = mediaItems.map((m, i) => `
      <div class="media-item" draggable="true" data-idx="${i}" style="cursor:grab;">
        ${m.type === 'video' ? `<video src="${escapeAttr(m.src)}" muted></video>` : `<img src="${escapeAttr(m.src)}" />`}
        <button type="button" data-idx="${i}" class="remove-media-btn">×</button>
      </div>
    `).join('');

    // Remove buttons
    list.querySelectorAll('.remove-media-btn').forEach(b => {
      b.addEventListener('click', () => {
        mediaItems.splice(Number(b.dataset.idx), 1);
        renderMediaList();
      });
    });

    // Drag-to-reorder within media list
    let dragSrcIdx = null;
    list.querySelectorAll('.media-item[draggable]').forEach(item => {
      item.addEventListener('dragstart', () => {
        dragSrcIdx = Number(item.dataset.idx);
        item.style.opacity = '0.4';
      });
      item.addEventListener('dragend', () => { item.style.opacity = ''; });
      item.addEventListener('dragover', e => { e.preventDefault(); item.style.outline = '2px solid #C69C6D'; });
      item.addEventListener('dragleave', () => { item.style.outline = ''; });
      item.addEventListener('drop', e => {
        e.preventDefault();
        item.style.outline = '';
        const tgtIdx = Number(item.dataset.idx);
        if (dragSrcIdx === null || dragSrcIdx === tgtIdx) return;
        const [moved] = mediaItems.splice(dragSrcIdx, 1);
        mediaItems.splice(tgtIdx, 0, moved);
        dragSrcIdx = null;
        renderMediaList();
      });
    });
  }

  async function onFilesChosen(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const statusEl = document.getElementById('upload-status');
    const productId = document.getElementById('f-id').value.trim() || 'unassigned';

    let successCount = 0;
    for (const file of files) {
      statusEl.textContent = `Uploading ${file.name}…`;
      const path = `${productId}/${Date.now()}-${file.name}`;
      const { error } = await sb.storage.from('products').upload(path, file);
      if (error) {
        alert(`Failed to upload ${file.name}: ${error.message}`);
        continue;
      }
      const { data: { publicUrl } } = sb.storage.from('products').getPublicUrl(path);
      mediaItems.push({ type: file.type.startsWith('video') ? 'video' : 'image', src: publicUrl });
      renderMediaList();
      successCount++;
    }
    statusEl.textContent = `Successfully uploaded ${successCount} of ${files.length} file(s).`;
    e.target.value = '';
  }

  /* ============================================================
     SAVE (CREATE / UPDATE)
     ============================================================ */
  async function onSave(e) {
    e.preventDefault();
    const errEl = document.getElementById('form-error');
    errEl.textContent = '';
    const saveBtn = document.getElementById('save-btn');

    const id = document.getElementById('f-id').value.trim();
    if (!/^[a-z0-9-]+$/.test(id)) {
      errEl.textContent = 'Product ID must be lowercase letters, numbers, and dashes only.';
      return;
    }
    if (!mediaItems.length) {
      errEl.textContent = 'Add at least one image or video.';
      return;
    }

    const category = document.getElementById('f-category').value;
    const featured = document.getElementById('f-featured').checked;
    const status = document.getElementById('f-status').value;
    const customizable = document.getElementById('f-customizable').checked;

    const specs = document.getElementById('f-specs').value
      .split('\n').map(l => l.trim()).filter(Boolean)
      .map(l => {
        const idx = l.indexOf(':');
        return idx === -1 ? [l, ''] : [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
      });

    const data = {
      id, name: document.getElementById('f-name').value.trim(),
      category, tags: [category],
      price: Number(document.getElementById('f-price').value),
      featured, customizable,
      description: document.getElementById('f-description').value.trim(),
      specs, media: mediaItems
    };
    const badge = document.getElementById('f-badge').value.trim();
    if (badge) data.badge = badge;
    if (customizable) data.customLabel = document.getElementById('f-custom-label').value.trim();

    // preserve variants if editing an existing product that had them (not editable in this form)
    if (editingId) {
      const existing = products.find(x => x.id === editingId);
      if (existing && existing.data.variants) data.variants = existing.data.variants;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';

    let error;
    if (editingId) {
      ({ error } = await sb.from('products')
        .update({ category, featured, status, data, updated_at: new Date().toISOString() })
        .eq('id', editingId));
    } else {
      ({ error } = await sb.from('products')
        .insert({ id, category, featured, status, sort_order: products.length + 1, data }));
    }

    saveBtn.disabled = false;
    saveBtn.textContent = 'Save';

    if (error) {
      errEl.textContent = error.message;
      return;
    }

    await loadProducts();
    renderTable();
    closeModal();
  }

  /* ============================================================
     HELPERS
     ============================================================ */
  async function loadSettings() {
    const { data, error } = await sb.from('site_settings').select('*').eq('id', 1).single();
    if (error) { console.error('Settings load error:', error); return; }
    document.getElementById('s-whatsapp').value  = data.whatsapp || '';
    document.getElementById('s-instagram').value = data.instagram || '';
    document.getElementById('s-currency').value  = data.currency || '\u20b9';
    document.getElementById('s-proc-min').value  = data.processing_days_min || 15;
    document.getElementById('s-proc-max').value  = data.processing_days_max || 20;
    document.getElementById('s-del-min').value   = data.delivery_days_min || 7;
    document.getElementById('s-del-max').value   = data.delivery_days_max || 10;
  }

  async function saveSettings(e) {
    e.preventDefault();
    const statusEl = document.getElementById('settings-status');
    const btn = document.getElementById('settings-save-btn');
    btn.disabled = true; btn.textContent = 'Saving…';
    statusEl.textContent = '';
    const payload = {
      whatsapp:             document.getElementById('s-whatsapp').value.trim(),
      instagram:            document.getElementById('s-instagram').value.trim(),
      currency:             document.getElementById('s-currency').value.trim() || '\u20b9',
      processing_days_min:  Number(document.getElementById('s-proc-min').value),
      processing_days_max:  Number(document.getElementById('s-proc-max').value),
      delivery_days_min:    Number(document.getElementById('s-del-min').value),
      delivery_days_max:    Number(document.getElementById('s-del-max').value),
      updated_at:           new Date().toISOString()
    };
    const { error } = await sb.from('site_settings').update(payload).eq('id', 1);
    btn.disabled = false; btn.textContent = 'Save Settings';
    if (error) {
      statusEl.textContent = '❌ ' + error.message;
      statusEl.style.color = '#b33636';
    } else {
      statusEl.textContent = '✓ Settings saved!';
      statusEl.style.color = '#1e7b34';
      setTimeout(() => statusEl.textContent = '', 3000);
    }
  }

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function escapeAttr(s) { return String(s).replace(/"/g, '&quot;'); }
})();
